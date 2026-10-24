import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  FileText,
  User,
  HeartPulse,
  Activity,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import api, { socket } from '../services/api';
import { fallbackAppointments } from '../services/mockData';
import './PatientDashboard.css';

const PatientDashboard = ({ user, setActiveTab }) => {
  const [appointments, setAppointments] = useState(fallbackAppointments);
  const [loading, setLoading] = useState(false);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('11:00 AM');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data?.success && res.data.appointments?.length > 0) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.warn('Backend offline, using patient records cache');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    socket.on('queue:update', () => {
      fetchAppointments();
    });

    return () => {
      socket.off('queue:update');
    };
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.patch(`/appointments/${id}/cancel`);
      if (res.data.success) {
        setActionMessage({ type: 'success', text: 'Appointment cancelled successfully' });
        fetchAppointments();
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to cancel appointment' });
    }
  };

  const handleRescheduleSubmit = async (id) => {
    if (!newDate || !newSlot) return;
    try {
      const res = await api.patch(`/appointments/${id}/reschedule`, {
        date: newDate,
        timeSlot: newSlot
      });
      if (res.data.success) {
        setActionMessage({ type: 'success', text: 'Appointment rescheduled successfully' });
        setReschedulingId(null);
        fetchAppointments();
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to reschedule appointment' });
    }
  };

  // Find active today appointment (checked_in or confirmed or in_consultation)
  const activeAppointment = appointments.find(
    (a) => ['checked_in', 'in_consultation', 'confirmed'].includes(a.status)
  );

  return (
    <div className="patient-dashboard-container">
      {/* Welcome Bar */}
      <div className="patient-welcome-card">
        <div className="welcome-info">
          <h1>Welcome back, {user?.name || 'Patient'}</h1>
          <p>
            Patient ID: <strong>PAT-{(user?._id || '9872').slice(-6).toUpperCase()}</strong> • 
            Blood Group: <strong>{user?.bloodGroup || 'O+'}</strong> • 
            Age: <strong>{user?.age || '32'} yrs</strong>
          </p>
        </div>
        <button className="btn-book-new" onClick={() => setActiveTab('book-appointment')}>
          <span>+ Book New Appointment</span>
        </button>
      </div>

      {actionMessage.text && (
        <div className={`alert-banner ${actionMessage.type}`}>
          {actionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Live Token Status Widget (For Active Today OPD) */}
      {activeAppointment && (
        <div className="live-token-tracker-widget">
          <div className="tracker-top">
            <div className="tracker-badge">
              <span className="live-pulse"></span>
              <span>LIVE QUEUE STATUS</span>
            </div>
            <span className="tracker-date">{activeAppointment.date}</span>
          </div>

          <div className="tracker-main">
            <div className="tracker-token-box">
              <span className="token-sub">YOUR TOKEN</span>
              <span className="token-val">{activeAppointment.tokenNumber}</span>
              <span className={`status-pill ${activeAppointment.status}`}>
                {activeAppointment.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="tracker-details">
              <h3>{activeAppointment.doctor?.name}</h3>
              <p className="doc-meta-line">{activeAppointment.department} • Room {activeAppointment.doctor?.roomNumber || 'OPD 101'}</p>
              
              <div className="wait-estimate-card">
                <Clock size={20} className="clock-icon" />
                <div>
                  <span className="wait-time-num">~{activeAppointment.estimatedWaitTimeMinutes} Minutes</span>
                  <span className="wait-time-label">
                    {activeAppointment.status === 'in_consultation'
                      ? 'Currently in doctor room!'
                      : activeAppointment.status === 'checked_in'
                      ? 'Waiting in queue • Token is active'
                      : 'Scheduled for OPD consultation'}
                  </span>
                </div>
              </div>
            </div>

            <div className="tracker-actions">
              <button className="btn-live-tv-link" onClick={() => setActiveTab('live-queue')}>
                <span>View Full Hospital Live TV</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment History / List */}
      <div className="patient-content-grid">
        <div className="content-main">
          <div className="section-title-row">
            <h2>My Appointments & Digital Tokens</h2>
            <button className="btn-refresh-sm" onClick={fetchAppointments}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="appointments-cards-list">
            {appointments.map((apt) => (
              <div key={apt._id} className="apt-card">
                <div className="apt-card-top">
                  <div className="apt-token-tag">
                    <span>{apt.tokenNumber}</span>
                  </div>
                  <div className="apt-status-wrap">
                    <span className={`status-badge ${apt.status}`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="apt-card-content">
                  <h3 className="doc-name">{apt.doctor?.name}</h3>
                  <p className="doc-dept">{apt.department} • Room {apt.doctor?.roomNumber || 'OPD 101'}</p>

                  <div className="apt-info-grid">
                    <div className="info-item">
                      <Calendar size={15} />
                      <span>{apt.date}</span>
                    </div>
                    <div className="info-item">
                      <Clock size={15} />
                      <span>{apt.timeSlot}</span>
                    </div>
                  </div>

                  <div className="apt-reason-box">
                    <strong>Reason:</strong> {apt.reason}
                    {apt.symptoms && <div><small>Symptoms: {apt.symptoms}</small></div>}
                  </div>

                  {/* Doctor notes if completed */}
                  {apt.prescriptionNotes && (
                    <div className="doctor-notes-box">
                      <FileText size={16} />
                      <div>
                        <strong>Doctor Prescription & Advice:</strong>
                        <p>{apt.prescriptionNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Rescheduling Form Panel */}
                  {reschedulingId === apt._id && (
                    <div className="reschedule-panel">
                      <h4>Select New Date & Slot</h4>
                      <div className="reschedule-inputs">
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="date-input"
                        />
                        <select
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          className="slot-input"
                        >
                          <option>09:30 AM</option>
                          <option>10:30 AM</option>
                          <option>11:30 AM</option>
                          <option>02:30 PM</option>
                          <option>03:30 PM</option>
                        </select>
                        <button 
                          className="btn-confirm-reschedule"
                          onClick={() => handleRescheduleSubmit(apt._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn-cancel-reschedule"
                          onClick={() => setReschedulingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                {['confirmed', 'checked_in'].includes(apt.status) && (
                  <div className="apt-card-footer">
                    <button 
                      className="btn-action-reschedule"
                      onClick={() => {
                        setReschedulingId(apt._id);
                        setNewDate(apt.date);
                      }}
                    >
                      Reschedule
                    </button>
                    <button 
                      className="btn-action-cancel"
                      onClick={() => handleCancel(apt._id)}
                    >
                      Cancel Visit
                    </button>
                  </div>
                )}
              </div>
            ))}

            {appointments.length === 0 && !loading && (
              <div className="empty-state-card">
                <Calendar size={48} className="empty-icon" />
                <h3>No Appointments Yet</h3>
                <p>You haven't scheduled any doctor consultations yet.</p>
                <button className="btn-book-first" onClick={() => setActiveTab('book-appointment')}>
                  Book Your First Consultation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info & Vitals */}
        <div className="content-sidebar">
          <div className="sidebar-card">
            <h3>Emergency & Helpdesk</h3>
            <p className="sidebar-text">Need urgent medical assistance or have questions regarding queue position?</p>
            <div className="contact-item">
              <span>OPD Helpline:</span>
              <strong>+1-800-SMART-CARE</strong>
            </div>
            <div className="contact-item">
              <span>Ambulance / Emergency:</span>
              <strong className="text-danger">911 / 108</strong>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>OPD Queue Guidelines</h3>
            <ul className="guidelines-list">
              <li>Arrive 15 minutes before your estimated wait time.</li>
              <li>Show your digital token code CARD-XXX at the triage desk.</li>
              <li>Turn on sound notifications to hear voice announcements.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
