import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  PhoneCall, 
  Activity, 
  FileEdit, 
  FileText,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import api, { socket } from '../services/api';
import { fallbackAppointments } from '../services/mockData';
import './DoctorDashboard.css';

const DoctorDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState(fallbackAppointments);
  const [selectedApt, setSelectedApt] = useState(fallbackAppointments[0] || null);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [vitals, setVitals] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6',
    weight: '70'
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchDoctorAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data?.success && res.data.appointments?.length > 0) {
        setAppointments(res.data.appointments);
        const currentServing = res.data.appointments.find((a) => a.status === 'in_consultation');
        const firstWaiting = res.data.appointments.find((a) => a.status === 'checked_in');
        if (currentServing) {
          setSelectedApt(currentServing);
          setPrescriptionNotes(currentServing.prescriptionNotes || '');
          if (currentServing.vitals) setVitals(currentServing.vitals);
        } else if (firstWaiting && !selectedApt) {
          setSelectedApt(firstWaiting);
        }
      }
    } catch (err) {
      console.warn('Backend offline, using doctor chamber cache');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();

    socket.on('queue:update', () => {
      fetchDoctorAppointments();
    });

    return () => {
      socket.off('queue:update');
    };
  }, []);

  const handleStatusUpdate = async (aptId, newStatus) => {
    try {
      const res = await api.patch(`/appointments/${aptId}/status`, {
        status: newStatus,
        prescriptionNotes,
        vitals
      });

      if (res.data?.success) {
        setStatusMessage(`Patient status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
        setTimeout(() => setStatusMessage(''), 4000);
        fetchDoctorAppointments();
        return;
      }
    } catch (err) {
      console.warn('API sync warning, applying local state update:', err);
    }

    // Local state fallback so UI updates in real-time
    setAppointments((prev) =>
      prev.map((item) =>
        item._id === aptId
          ? { ...item, status: newStatus, prescriptionNotes, vitals }
          : item
      )
    );
    if (selectedApt && selectedApt._id === aptId) {
      setSelectedApt((prev) => ({
        ...prev,
        status: newStatus,
        prescriptionNotes,
        vitals
      }));
    }
    setStatusMessage(`Patient status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const currentlyServing = appointments.filter((a) => a.status === 'in_consultation');
  const waitingPatients = appointments.filter((a) => a.status === 'checked_in');
  const completedToday = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="doctor-dashboard-container">
      {/* Top OPD Banner */}
      <div className="doctor-header-card">
        <div className="doctor-title-col">
          <div className="badge-room">
            <Stethoscope size={16} />
            <span>OPD Room: {user?.roomNumber || 'Suite 204'}</span>
          </div>
          <h1>{user?.name || 'Dr. Mitchell'} Console</h1>
          <p className="doctor-sub">
            {user?.specialization || 'Interventional Cardiology'} • {user?.department || 'Cardiology'}
          </p>
        </div>

        <div className="doctor-quick-metrics">
          <div className="metric-box serving">
            <span className="metric-val">{currentlyServing.length}</span>
            <span className="metric-lbl">In Chamber</span>
          </div>
          <div className="metric-box waiting">
            <span className="metric-val">{waitingPatients.length}</span>
            <span className="metric-lbl">Waiting Outside</span>
          </div>
          <div className="metric-box done">
            <span className="metric-val">{completedToday.length}</span>
            <span className="metric-lbl">Completed Today</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="doctor-toast-alert">
          <CheckCircle size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main 2-Panel OPD Console Workspace */}
      <div className="doctor-workspace-grid">
        {/* Left: Queue Roster */}
        <div className="doctor-roster-column">
          <div className="roster-header">
            <h3>Today's Patient Queue ({appointments.length})</h3>
            <span className="date-tag">{new Date().toLocaleDateString()}</span>
          </div>

          <div className="roster-list">
            {appointments.map((apt) => {
              const isSelected = selectedApt?._id === apt._id;
              return (
                <div 
                  key={apt._id}
                  className={`roster-item ${isSelected ? 'selected' : ''} ${apt.status}`}
                  onClick={() => {
                    setSelectedApt(apt);
                    setPrescriptionNotes(apt.prescriptionNotes || '');
                    if (apt.vitals) setVitals(apt.vitals);
                  }}
                >
                  <div className="roster-item-top">
                    <span className="roster-token">{apt.tokenNumber}</span>
                    <span className={`roster-status-pill ${apt.status}`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="roster-patient-name">{apt.patient?.name}</h4>
                  <div className="roster-patient-meta">
                    <span>{apt.patient?.gender || 'N/A'}, {apt.patient?.age || '30'} yrs</span>
                    <span>• {apt.timeSlot}</span>
                  </div>

                  <p className="roster-chief-complaint">
                    <strong>Complaint:</strong> {apt.reason}
                  </p>
                </div>
              );
            })}

            {appointments.length === 0 && !loading && (
              <div className="empty-roster">
                <Users size={36} className="text-muted" />
                <p>No patients booked for your OPD slot today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Consultation & E-Prescription Desk */}
        <div className="doctor-consult-column">
          {selectedApt ? (
            <div className="consult-card">
              {/* Patient Banner */}
              <div className="consult-patient-banner">
                <div className="consult-avatar">
                  {selectedApt.patient?.name?.charAt(0) || 'P'}
                </div>
                <div className="consult-patient-details">
                  <div className="patient-token-badge">
                    <span>Token: {selectedApt.tokenNumber}</span>
                    <span className="status-indicator-tag">{selectedApt.status.toUpperCase()}</span>
                  </div>
                  <h2>{selectedApt.patient?.name}</h2>
                  <p className="consult-subtext">
                    Blood Group: <strong>{selectedApt.patient?.bloodGroup || 'O+'}</strong> • 
                    Phone: <strong>{selectedApt.patient?.phone || '+1-555-0199'}</strong> • 
                    Slot: <strong>{selectedApt.timeSlot}</strong>
                  </p>
                </div>

                {/* Queue Control Buttons */}
                <div className="consult-actions-bar">
                  {selectedApt.status === 'checked_in' && (
                    <button 
                      className="btn-call-patient"
                      onClick={() => handleStatusUpdate(selectedApt._id, 'in_consultation')}
                    >
                      <Play size={16} />
                      <span>Call into Room</span>
                    </button>
                  )}

                  {selectedApt.status === 'in_consultation' && (
                    <button 
                      className="btn-finish-consult"
                      onClick={() => handleStatusUpdate(selectedApt._id, 'completed')}
                    >
                      <CheckCircle size={16} />
                      <span>Complete & Sign Off</span>
                    </button>
                  )}

                  {selectedApt.status === 'confirmed' && (
                    <button 
                      className="btn-checkin-direct"
                      onClick={() => handleStatusUpdate(selectedApt._id, 'in_consultation')}
                    >
                      <Play size={16} />
                      <span>Start Direct Consultation</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Vitals Form Section */}
              <div className="consult-section">
                <div className="section-subtitle-bar">
                  <Activity size={18} />
                  <h3>Recorded Patient Vitals</h3>
                </div>

                <div className="vitals-inputs-grid">
                  <div className="vital-item">
                    <label>Blood Pressure</label>
                    <input 
                      type="text" 
                      value={vitals.bloodPressure || ''} 
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      placeholder="120/80 mmHg"
                    />
                  </div>
                  <div className="vital-item">
                    <label>Heart Rate (BPM)</label>
                    <input 
                      type="text" 
                      value={vitals.heartRate || ''} 
                      onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                      placeholder="72 bpm"
                    />
                  </div>
                  <div className="vital-item">
                    <label>Temperature</label>
                    <input 
                      type="text" 
                      value={vitals.temperature || ''} 
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                      placeholder="98.6 °F"
                    />
                  </div>
                  <div className="vital-item">
                    <label>Body Weight</label>
                    <input 
                      type="text" 
                      value={vitals.weight || ''} 
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                      placeholder="70 kg"
                    />
                  </div>
                </div>
              </div>

              {/* Chief Complaint Details */}
              <div className="consult-section">
                <div className="section-subtitle-bar">
                  <FileText size={18} />
                  <h3>Reported Symptoms & Chief Complaint</h3>
                </div>
                <div className="complaint-display-card">
                  <p><strong>Primary Concern:</strong> {selectedApt.reason}</p>
                  {selectedApt.symptoms && (
                    <p style={{ marginTop: '0.4rem' }}><strong>Patient Statement:</strong> {selectedApt.symptoms}</p>
                  )}
                </div>
              </div>

              {/* Clinical Notes & Prescription Editor */}
              <div className="consult-section">
                <div className="section-subtitle-bar">
                  <FileEdit size={18} />
                  <h3>Doctor's Prescription & Clinical Summary</h3>
                </div>

                <textarea
                  rows={5}
                  className="prescription-textarea"
                  placeholder="Enter medical findings, prescribed medicines with dosages, diagnostic lab tests, or follow-up recommendations..."
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                />

                <div className="consult-save-bar">
                  <button 
                    className="btn-save-notes"
                    onClick={() => handleStatusUpdate(selectedApt._id, selectedApt.status)}
                  >
                    Save Clinical Notes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-consult-desk">
              <Stethoscope size={48} className="text-muted" />
              <h3>Select a Patient from Queue</h3>
              <p>Choose an OPD patient from the left column to view medical history and conduct consultation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
