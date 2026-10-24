import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = ({ departments, doctors, setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, aptsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/appointments')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (aptsRes.data.success) {
        setAllAppointments(aptsRes.data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard-container">
      {/* Admin Title Bar */}
      <div className="admin-title-row">
        <div>
          <div className="admin-badge">
            <ShieldCheck size={16} />
            <span>Chief Hospital Administrator Portal</span>
          </div>
          <h1>Hospital Operations & OPD Analytics</h1>
          <p>Real-time outpatient throughput, clinical departments performance, and queue bottlenecks</p>
        </div>

        <div className="admin-top-actions">
          <button className="btn-refresh-admin" onClick={fetchAdminData}>
            <RefreshCw size={16} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card card-blue">
          <div className="kpi-icon-box">
            <Calendar size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Today's Total OPD Load</span>
            <span className="kpi-val">{stats?.todayAppointments ?? allAppointments.length}</span>
            <span className="kpi-sub">Across 6 specialized clinical wings</span>
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-icon-box">
            <Clock size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Patients in Waiting Lounge</span>
            <span className="kpi-val">{stats?.waitingToday ?? allAppointments.filter(a => a.status === 'checked_in').length}</span>
            <span className="kpi-sub">Avg waiting time: ~14.8 minutes</span>
          </div>
        </div>

        <div className="kpi-card card-teal">
          <div className="kpi-icon-box">
            <Activity size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Doctor Consultations</span>
            <span className="kpi-val">{stats?.servingToday ?? allAppointments.filter(a => a.status === 'in_consultation').length}</span>
            <span className="kpi-sub">Doctors on duty: {doctors.length}</span>
          </div>
        </div>

        <div className="kpi-card card-green">
          <div className="kpi-icon-box">
            <UserCheck size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Completed Consultations</span>
            <span className="kpi-val">{stats?.completedToday ?? allAppointments.filter(a => a.status === 'completed').length}</span>
            <span className="kpi-sub">98.2% on-time completion</span>
          </div>
        </div>
      </div>

      {/* Main Admin Section Grid */}
      <div className="admin-two-cols">
        {/* Left Column: Department Performance & Queue Capacity */}
        <div className="admin-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <Building2 size={20} className="text-primary" />
              <h2>Clinical Departments & Capacity</h2>
            </div>
          </div>

          <div className="dept-perf-list">
            {departments.map((dept) => {
              const deptApts = allAppointments.filter((a) => a.department === dept.name);
              const deptServing = deptApts.filter((a) => a.status === 'in_consultation').length;
              const deptWaiting = deptApts.filter((a) => a.status === 'checked_in').length;

              return (
                <div key={dept._id || dept.name} className="dept-perf-item">
                  <div className="dept-perf-top">
                    <div>
                      <h4 className="dept-title">{dept.name} ({dept.code})</h4>
                      <p className="dept-sub">{dept.floor} • Head: {dept.headDoctor}</p>
                    </div>
                    <span className="dept-load-badge">
                      {deptApts.length} Patients Today
                    </span>
                  </div>

                  <div className="dept-capacity-bar-wrap">
                    <div className="capacity-labels">
                      <span>Serving: {deptServing}</span>
                      <span>Waiting: {deptWaiting}</span>
                    </div>
                    <div className="capacity-bar-track">
                      <div 
                        className="capacity-bar-fill" 
                        style={{ width: `${Math.min(100, Math.max(15, deptApts.length * 20))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Duty Roster & Doctors Overview */}
        <div className="admin-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <UserCheck size={20} className="text-secondary" />
              <h2>Consultant Physicians on Duty</h2>
            </div>
          </div>

          <div className="doctors-table-wrap">
            <table className="admin-doc-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>OPD Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <strong>{doc.name}</strong>
                      <div className="doc-spec-sub">{doc.specialization}</div>
                    </td>
                    <td>{doc.department}</td>
                    <td>
                      <span className="room-chip">{doc.roomNumber || 'Room 101'}</span>
                    </td>
                    <td>
                      <span className="on-duty-badge">
                        <span className="on-duty-dot"></span> On Duty
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live System Log & Audit Table */}
      <div className="admin-panel full-width-panel">
        <div className="panel-header">
          <div className="panel-header-left">
            <FileSpreadsheet size={20} className="text-primary" />
            <h2>Master Hospital Outpatient Log (Live Feed)</h2>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-master-table">
            <thead>
              <tr>
                <th>Queue Token</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td><strong>{apt.tokenNumber}</strong></td>
                  <td>{apt.patient?.name} ({apt.patient?.phone})</td>
                  <td>{apt.doctor?.name}</td>
                  <td>{apt.department}</td>
                  <td>{apt.timeSlot}</td>
                  <td>
                    <span className={`status-badge ${apt.status}`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{apt.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
