import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  FileText,
  DollarSign
} from 'lucide-react';
import api from '../services/api';
import './BookAppointment.css';

const BookAppointment = ({ 
  user, 
  departments, 
  doctors, 
  preselectedDoctor, 
  setActiveTab,
  onBookingSuccess 
}) => {
  const [selectedDept, setSelectedDept] = useState(
    preselectedDoctor ? preselectedDoctor.department : (departments[0]?.name || 'Cardiology')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    preselectedDoctor ? preselectedDoctor._id : ''
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  // Receptionist-only booking for another patient
  const [patientEmail, setPatientEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientGender, setPatientGender] = useState('female');
  const [patientAge, setPatientAge] = useState('28');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  // Available doctors in chosen department
  const filteredDoctors = doctors.filter((doc) => doc.department === selectedDept);

  useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDept(preselectedDoctor.department);
      setSelectedDoctorId(preselectedDoctor._id);
    } else if (filteredDoctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(filteredDoctors[0]._id);
    }
  }, [selectedDept, doctors, preselectedDoctor]);

  const selectedDoctorObj = doctors.find((d) => d._id === selectedDoctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setActiveTab('login');
      return;
    }

    if (!selectedDoctorId) {
      setError('Please select a doctor for your consultation.');
      return;
    }

    if (!reason.trim()) {
      setError('Please specify the primary medical reason or chief complaint.');
      return;
    }

    setLoading(true);

    try {
      let payload = {
        doctorId: selectedDoctorId,
        department: selectedDept,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
        symptoms,
        patientName: patientName || (user.role === 'patient' ? user.name : 'Walk-in Patient'),
        patientPhone: patientPhone || (user.role === 'patient' ? user.phone : '+1-555-0199'),
        patientGender,
        patientAge
      };

      const res = await api.post('/appointments', payload);
      if (res.data.success) {
        setBookingResult(res.data.appointment);
        if (onBookingSuccess) onBookingSuccess(res.data.appointment);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please check availability.');
    } finally {
      setLoading(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="booking-success-view">
        <div className="success-card">
          <div className="success-icon-badge">
            <CheckCircle size={48} />
          </div>
          <h2 className="success-title">Appointment Confirmed!</h2>
          <p className="success-subtitle">
            Your consultation slot is locked and your digital queue token is generated.
          </p>

          <div className="ticket-digital-pass">
            <div className="ticket-header">
              <span className="pass-label">OPD QUEUE TOKEN</span>
              <span className="pass-token-num">{bookingResult.tokenNumber}</span>
            </div>

            <div className="ticket-body">
              <div className="ticket-field">
                <span className="label">Department:</span>
                <span className="val">{bookingResult.department}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Doctor:</span>
                <span className="val">{bookingResult.doctor?.name}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Room:</span>
                <span className="val">{bookingResult.doctor?.roomNumber || 'Room 101'}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Date & Time:</span>
                <span className="val">{bookingResult.date} at {bookingResult.timeSlot}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Est. Waiting Time:</span>
                <span className="val highlight">~{bookingResult.estimatedWaitTimeMinutes} Mins</span>
              </div>
            </div>

            <div className="ticket-footer">
              <span>Show this digital token at reception or OPD entrance</span>
            </div>
          </div>

          <div className="action-buttons-group">
            <button 
              className="btn-primary" 
              onClick={() => setActiveTab(user.role === 'patient' ? 'patient-dashboard' : `${user.role}-dashboard`)}
            >
              Go to My Dashboard
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                setBookingResult(null);
                setReason('');
                setSymptoms('');
              }}
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment-container">
      <div className="book-form-card">
        <div className="book-card-header">
          <div className="header-badge">
            <Calendar size={18} />
            <span>Outpatient Booking Portal</span>
          </div>
          <h1>Schedule a Doctor Consultation</h1>
          <p>Choose clinical department, doctor, and convenient time slot</p>
        </div>

        {error && (
          <div className="form-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form-grid">
          {/* If Receptionist, allow inputting Walk-In Patient Info */}
          {user && ['receptionist', 'admin'].includes(user.role) && (
            <div className="walkin-banner full-width">
              <div className="walkin-title">
                <User size={16} />
                <span>Walk-In Patient Intake Details</span>
              </div>
              <div className="walkin-inputs-row">
                <input 
                  type="text" 
                  placeholder="Patient Full Name *" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)} 
                  className="form-input"
                  required
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number *" 
                  value={patientPhone} 
                  onChange={(e) => setPatientPhone(e.target.value)} 
                  className="form-input"
                  required
                />
                <select 
                  value={patientGender} 
                  onChange={(e) => setPatientGender(e.target.value)} 
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Age" 
                  value={patientAge} 
                  onChange={(e) => setPatientAge(e.target.value)} 
                  className="form-input"
                  style={{ maxWidth: '90px' }}
                />
              </div>
            </div>
          )}

          {/* Department Selection */}
          <div className="form-group">
            <label className="form-label">Specialty Department</label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setSelectedDoctorId('');
              }}
              className="form-input"
            >
              {departments.map((dept) => (
                <option key={dept._id || dept.name} value={dept.name}>
                  {dept.name} ({dept.code}) - {dept.floor}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div className="form-group">
            <label className="form-label">Consulting Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Doctor</option>
              {filteredDoctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} - {doc.specialization} (${doc.consultationFee})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Time Slot Picker */}
          <div className="form-group">
            <label className="form-label">Available OPD Slot</label>
            <div className="slots-grid">
              {[
                '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
                '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
                '03:00 PM', '03:30 PM', '04:00 PM'
              ].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={`slot-chip ${selectedSlot === slot ? 'active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="form-group full-width">
            <label className="form-label">Reason for Consultation / Chief Complaint *</label>
            <input
              type="text"
              placeholder="e.g. Recurrent headaches, regular health checkup, knee pain"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Symptoms Details */}
          <div className="form-group full-width">
            <label className="form-label">Symptoms & Duration (Optional)</label>
            <textarea
              rows={3}
              placeholder="Describe what you are experiencing and how long it has lasted..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Doctor Info Summary Preview Card */}
          {selectedDoctorObj && (
            <div className="doctor-preview-box full-width">
              <div className="doc-preview-left">
                <div className="doc-icon-badge">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h4 className="doc-preview-name">{selectedDoctorObj.name}</h4>
                  <p className="doc-preview-sub">{selectedDoctorObj.specialization} • Room {selectedDoctorObj.roomNumber || '101'}</p>
                </div>
              </div>
              <div className="doc-preview-fee">
                <span className="fee-label">Consultation:</span>
                <span className="fee-amount">${selectedDoctorObj.consultationFee}</span>
              </div>
            </div>
          )}

          <div className="form-actions full-width">
            <button type="submit" disabled={loading} className="btn-submit-booking">
              <span>{loading ? 'Generating Token...' : 'Confirm Booking & Generate Queue Token'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
