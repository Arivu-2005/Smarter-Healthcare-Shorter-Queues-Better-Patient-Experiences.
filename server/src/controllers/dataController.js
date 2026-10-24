import User from '../models/User.js';
import Department from '../models/Department.js';
import Appointment from '../models/Appointment.js';

export const getDoctors = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { role: 'doctor' };
    if (department && department !== 'All') {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    const doctors = await User.find(query).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHospitalStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({ date: today });
    const waitingToday = await Appointment.countDocuments({ date: today, status: 'checked_in' });
    const servingToday = await Appointment.countDocuments({ date: today, status: 'in_consultation' });
    const completedToday = await Appointment.countDocuments({ date: today, status: 'completed' });

    // Department breakdown
    const departmentDistribution = await Appointment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        waitingToday,
        servingToday,
        completedToday,
        departmentDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
