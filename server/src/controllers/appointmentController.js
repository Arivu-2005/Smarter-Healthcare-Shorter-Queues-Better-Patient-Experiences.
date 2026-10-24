import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

// Helper to calculate queue token
const generateQueueToken = async (departmentCode, date) => {
  const count = await Appointment.countDocuments({
    date,
    tokenNumber: { $regex: new RegExp(`^${departmentCode}-`) }
  });
  const seq = count + 1;
  const formattedSeq = seq < 10 ? `00${seq}` : seq < 100 ? `0${seq}` : `${seq}`;
  return {
    tokenNumber: `${departmentCode}-${formattedSeq}`,
    tokenSequence: seq
  };
};

export const createAppointment = async (req, res, io) => {
  try {
    const { doctorId, department, date, timeSlot, reason, symptoms, patientName, patientPhone, patientGender, patientAge } = req.body;
    let patientId = req.user.role === 'patient' ? req.user._id : req.body.patientId;

    // If receptionist/admin is booking for a walk-in patient without an account
    if (['receptionist', 'admin'].includes(req.user.role) && !patientId) {
      if (patientName) {
        // Find existing patient by phone or create new patient profile
        let existingPatient = null;
        if (patientPhone) {
          existingPatient = await User.findOne({ phone: patientPhone, role: 'patient' });
        }
        if (!existingPatient) {
          const generatedEmail = `walkin_${Date.now()}@hospital.local`;
          existingPatient = await User.create({
            name: patientName,
            email: generatedEmail,
            password: 'walkin_password_guest',
            phone: patientPhone || '',
            gender: patientGender || 'other',
            age: Number(patientAge) || 30,
            role: 'patient'
          });
        }
        patientId = existingPatient._id;
      } else {
        // Fallback to first available patient in system if not specified
        const firstPatient = await User.findOne({ role: 'patient' });
        if (firstPatient) patientId = firstPatient._id;
      }
    }

    if (!doctorId || !department || !date || !timeSlot || !reason) {
      return res.status(400).json({ success: false, message: 'All booking fields are required' });
    }

    if (!patientId) {
      return res.status(400).json({ success: false, message: 'Patient selection or name is required' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Double-booking / conflict prevention check
    const existingConflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $nin: ['cancelled', 'completed'] }
    });

    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: `This time slot (${timeSlot}) is already booked for Dr. ${doctor.name}. Please select another time slot.`
      });
    }

    const deptDoc = await Department.findOne({ name: department });
    const deptCode = deptDoc ? deptDoc.code : 'GEN';

    const { tokenNumber, tokenSequence } = await generateQueueToken(deptCode, date);

    // Waiting time estimate: 15 mins per patient ahead of sequence
    const estimatedWaitTimeMinutes = Math.max(5, (tokenSequence - 1) * 15);

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      department,
      date,
      timeSlot,
      reason,
      symptoms: symptoms || '',
      tokenNumber,
      tokenSequence,
      estimatedWaitTimeMinutes,
      status: 'confirmed'
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name specialization department roomNumber consultationFee');

    if (io) {
      io.emit('queue:update', { action: 'NEW_APPOINTMENT', appointment: populated });
    }

    res.status(201).json({ success: true, appointment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { role, id } = req.user;
    const { date, status, department, doctorId } = req.query;

    let filter = {};
    if (role === 'patient') {
      filter.patient = id;
    } else if (role === 'doctor') {
      filter.doctor = id;
    }

    if (date) filter.date = date;
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (doctorId && (role === 'admin' || role === 'receptionist')) filter.doctor = doctorId;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name specialization department roomNumber consultationFee')
      .sort({ date: 1, tokenSequence: 1, createdAt: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name specialization department roomNumber consultationFee');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res, io) => {
  try {
    const { status, prescriptionNotes, vitals } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status) {
      // Validate valid status transitions
      const validTransitions = {
        confirmed: ['checked_in', 'cancelled'],
        checked_in: ['in_consultation', 'cancelled'],
        in_consultation: ['completed', 'checked_in'],
        completed: [],
        cancelled: []
      };

      const allowedNext = validTransitions[appointment.status] || [];
      if (!allowedNext.includes(status) && req.user.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: `Invalid queue transition from ${appointment.status} to ${status}`
        });
      }

      appointment.status = status;
      if (status === 'checked_in' && !appointment.checkedInAt) {
        appointment.checkedInAt = new Date();
      } else if (status === 'in_consultation' && !appointment.consultationStartedAt) {
        appointment.consultationStartedAt = new Date();
      } else if (status === 'completed' && !appointment.completedAt) {
        appointment.completedAt = new Date();
      }
    }

    if (prescriptionNotes !== undefined) appointment.prescriptionNotes = prescriptionNotes;
    if (vitals) appointment.vitals = { ...appointment.vitals, ...vitals };

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name specialization department roomNumber consultationFee');

    if (io) {
      io.emit('queue:update', { action: 'STATUS_CHANGED', appointment: populated });
    }

    res.json({ success: true, appointment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rescheduleAppointment = async (req, res, io) => {
  try {
    const { date, timeSlot } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.date = date;
    appointment.timeSlot = timeSlot;
    appointment.status = 'confirmed';
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name specialization department roomNumber consultationFee');

    if (io) {
      io.emit('queue:update', { action: 'RESCHEDULED', appointment: populated });
    }

    res.json({ success: true, appointment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res, io) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('doctor', 'name specialization department roomNumber consultationFee');

    if (io) {
      io.emit('queue:update', { action: 'CANCELLED', appointment: populated });
    }

    res.json({ success: true, message: 'Appointment cancelled', appointment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Queue status for Public/Display Board & Patient live tracker
export const getLiveQueue = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { department, doctorId, date } = req.query;
    const targetDate = date || today;

    let filter = { date: targetDate, status: { $ne: 'cancelled' } };
    if (department && department !== 'All') filter.department = department;
    if (doctorId && doctorId !== 'All') filter.doctor = doctorId;

    const queue = await Appointment.find(filter)
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialization roomNumber')
      .sort({ tokenSequence: 1 });

    const currentlyServing = queue.filter(q => q.status === 'in_consultation');
    const waitingPatients = queue.filter(q => q.status === 'checked_in');
    const scheduledPatients = queue.filter(q => q.status === 'confirmed');
    const completedPatients = queue.filter(q => q.status === 'completed');

    res.json({
      success: true,
      date: targetDate,
      total: queue.length,
      currentlyServing,
      waiting: waitingPatients,
      scheduled: scheduledPatients,
      completed: completedPatients,
      allQueue: queue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
