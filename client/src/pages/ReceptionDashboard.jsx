import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight,
  Filter,
  RefreshCw,
  Building2,
  Stethoscope,
  Printer
} from 'lucide-react';
import api, { socket } from '../services/api';
import './ReceptionDashboard.css';

const ReceptionDashboard = ({ departments, doctors, setActiveTab }) => {
  const [appointments, setAppointments] = useState([]);
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAppointmentForPrint, setSelectedAppointmentForPrint] = useState(null);

  const fetchQueueRoster = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueRoster();

    socket.on('queue:update', () => {
      fetchQueueRoster();
    });

    return () => {
      socket.off('queue:update');
    };
  }, []);

  const handleCheckInPatient = async (id) => {
    try {
      const res = await api.patch(`/appointments/${id}/status`, {
        status: 'checked_in'
      });
      if (res.data.success) {
        fetchQueueRoster();
      }
    } catch (err) {
      alert('Failed to check-in patient');
    }
  };

  const filtered = appointments.filter((apt) => {
    const matchDept = filterDept === 'All' || apt.department === filterDept;
    const matchStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchSearch =
      apt.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.tokenNumber?.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor?.name?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  const checkedInCount = appointments.filter((a) => a.status === 'checked_in').length;
  const inConsultCount = appointments.filter((a) => a.status === 'in_consultation').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="reception-dashboard-container">
      {/* Top Front Desk Metric Cards */}
      <div className="reception-header-bar">
        <div>
          <h1>Front Desk Reception & Triage Desk</h1>
          <p>Real-time patient intake, digital token dispensing, and waiting lobby coordination</p>
        </div>

        <div className="reception-quick-actions">
          <button className="btn-walkin-book" onClick={() => setActiveTab('book-appointment')}>
            <UserPlus size={18} />
            <span>Walk-In Patient Registration</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="reception-stats-grid">
        <div className="r-stat-card">
          <span className="r-stat-label">Total OPD Bookings</span>
          <span className="r-stat-val text-primary">{appointments.length}</span>
        </div>
        <div className="r-stat-card">
          <span className="r-stat-label">Waiting in Lounge</span>
          <span className="r-stat-val text-warning">{checkedInCount}</span>
        </div>
        <div className="r-stat-card">
          <span className="r-stat-label">Currently in Consultation</span>
          <span className="r-stat-val text-teal">{inConsultCount}</span>
        </div>
        <div className="r-stat-card">
          <span className="r-stat-label">Discharged / Completed</span>
          <span className="r-stat-val text-success">{completedCount}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="table-controls-bar">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search patient name, token (e.g. CARD-002), or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d._id || d.name} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In (Waiting)</option>
            <option value="in_consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="btn-refresh-table" onClick={fetchQueueRoster}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Details</th>
                <th>Department & Doctor</th>
                <th>Slot Time</th>
                <th>Status</th>
                <th>Est. Wait</th>
                <th>Front Desk Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <span className="token-pill">{apt.tokenNumber}</span>
                  </td>
                  <td>
                    <div className="patient-name-cell">
                      <strong>{apt.patient?.name}</strong>
                      <span className="text-muted">{apt.patient?.gender}, {apt.patient?.age} yrs • {apt.patient?.bloodGroup}</span>
                      <span className="phone-hint">{apt.patient?.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{apt.department}</strong>
                      <div className="doc-hint">{apt.doctor?.name} ({apt.doctor?.roomNumber || 'Room 101'})</div>
                    </div>
                  </td>
                  <td>
                    <span className="slot-badge">{apt.timeSlot}</span>
                  </td>
                  <td>
                    <span className={`status-tag ${apt.status}`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="wait-badge">~{apt.estimatedWaitTimeMinutes}m</span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {apt.status === 'confirmed' && (
                        <button 
                          className="btn-checkin-action"
                          onClick={() => handleCheckInPatient(apt._id)}
                          title="Check-in patient upon arrival at hospital"
                        >
                          <CheckCircle2 size={16} />
                          <span>Check In</span>
                        </button>
                      )}

                      <button 
                        className="btn-print-token"
                        onClick={() => setSelectedAppointmentForPrint(apt)}
                        title="Print Physical Slip Token"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-table-cell">
                    No matching OPD queue records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Slip Modal */}
      {selectedAppointmentForPrint && (
        <div className="modal-backdrop">
          <div className="token-slip-modal">
            <div className="slip-inner">
              <div className="slip-brand">SMART HOSPITAL OPD TOKEN</div>
              <div className="slip-token">{selectedAppointmentForPrint.tokenNumber}</div>
              <div className="slip-dept">{selectedAppointmentForPrint.department} CLINIC</div>
              <div className="slip-divider"></div>
              <div className="slip-info-row">
                <span>Patient:</span>
                <strong>{selectedAppointmentForPrint.patient?.name}</strong>
              </div>
              <div className="slip-info-row">
                <span>Doctor:</span>
                <strong>{selectedAppointmentForPrint.doctor?.name}</strong>
              </div>
              <div className="slip-info-row">
                <span>Room:</span>
                <strong>{selectedAppointmentForPrint.doctor?.roomNumber || 'Room 101'}</strong>
              </div>
              <div className="slip-info-row">
                <span>Slot:</span>
                <strong>{selectedAppointmentForPrint.timeSlot}</strong>
              </div>
              <div className="slip-info-row">
                <span>Est. Wait:</span>
                <strong>~{selectedAppointmentForPrint.estimatedWaitTimeMinutes} Mins</strong>
              </div>
              <div className="slip-divider"></div>
              <p className="slip-footer">Please watch the TV display in the waiting lounge.</p>
            </div>

            <div className="modal-actions">
              <button className="btn-print-confirm" onClick={() => window.print()}>
                Print Token
              </button>
              <button className="btn-close-modal" onClick={() => setSelectedAppointmentForPrint(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionDashboard;
