import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Clock, 
  Users, 
  ArrowRight, 
  Activity, 
  Volume2, 
  CheckCircle, 
  Building2, 
  RefreshCw,
  BellRing
} from 'lucide-react';
import api, { socket } from '../services/api';
import './LiveQueueDisplay.css';

const LiveQueueDisplay = ({ departments }) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [queueData, setQueueData] = useState({
    currentlyServing: [],
    waiting: [],
    scheduled: [],
    completed: [],
    total: 0
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [recentCallAlert, setRecentCallAlert] = useState(null);

  const fetchLiveQueue = async () => {
    try {
      const res = await api.get(`/appointments/live-queue?department=${selectedDept}`);
      if (res.data.success) {
        setQueueData(res.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching live queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQueue();

    // Socket.IO real-time listener for queue events
    socket.on('queue:update', (payload) => {
      console.log('[Socket] Queue update received:', payload);
      fetchLiveQueue();

      if (payload.action === 'STATUS_CHANGED' && payload.appointment.status === 'in_consultation') {
        const text = `Token ${payload.appointment.tokenNumber}, please proceed to ${payload.appointment.doctor?.roomNumber || 'Room 101'}`;
        setRecentCallAlert({
          token: payload.appointment.tokenNumber,
          room: payload.appointment.doctor?.roomNumber || 'Consultation Room',
          doctor: payload.appointment.doctor?.name
        });

        // Speech synthesis if enabled
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }

        setTimeout(() => setRecentCallAlert(null), 8000);
      }
    });

    const interval = setInterval(fetchLiveQueue, 15000); // Poll every 15s as fallback

    return () => {
      socket.off('queue:update');
      clearInterval(interval);
    };
  }, [selectedDept]);

  return (
    <div className="live-queue-tv-container">
      {/* Broadcast Bar */}
      <div className="tv-header-bar">
        <div className="tv-header-left">
          <div className="tv-live-indicator">
            <span className="live-pulsing-dot"></span>
            <span>LIVE OPD BROADCAST</span>
          </div>
          <h1 className="tv-title">Digital Queue Token Display</h1>
        </div>

        <div className="tv-header-controls">
          <div className="dept-select-wrap">
            <Building2 size={16} />
            <select 
              value={selectedDept} 
              onChange={(e) => setSelectedDept(e.target.value)}
              className="dept-select"
            >
              <option value="All">All OPD Departments</option>
              {departments.map((d) => (
                <option key={d._id || d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <button 
            className={`btn-audio-toggle ${audioEnabled ? 'active' : ''}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Speech Token Callouts"
          >
            <Volume2 size={18} />
            <span>{audioEnabled ? 'Audio Chime ON' : 'Audio OFF'}</span>
          </button>

          <button className="btn-refresh" onClick={fetchLiveQueue}>
            <RefreshCw size={16} />
            <span>{lastUpdated.toLocaleTimeString()}</span>
          </button>
        </div>
      </div>

      {/* Token Callout Banner (Pop-up on live doctor call) */}
      {recentCallAlert && (
        <div className="token-callout-banner animate-bounce-subtle">
          <div className="callout-icon-pulse">
            <BellRing size={28} />
          </div>
          <div className="callout-details">
            <span className="callout-label">NOW CALLING PATIENT</span>
            <div className="callout-token-code">{recentCallAlert.token}</div>
            <p className="callout-room">
              Please proceed to <strong>{recentCallAlert.room}</strong> ({recentCallAlert.doctor})
            </p>
          </div>
        </div>
      )}

      {/* Main OPD Screen Grid */}
      <div className="tv-grid-layout">
        {/* Left Column: Currently Serving Hero Cards */}
        <div className="tv-column current-column">
          <div className="column-header serving-header">
            <Activity size={20} />
            <h2>Now Serving / In Consultation ({queueData.currentlyServing.length})</h2>
          </div>

          <div className="serving-cards-list">
            {queueData.currentlyServing.map((item) => (
              <div key={item._id} className="serving-card">
                <div className="serving-token-badge">
                  <span className="token-prefix">TOKEN NUMBER</span>
                  <span className="token-number">{item.tokenNumber}</span>
                </div>

                <div className="serving-info">
                  <div className="serving-room-badge">
                    <span>{item.doctor?.roomNumber || 'Room 101'}</span>
                  </div>
                  <h3 className="serving-doctor">{item.doctor?.name}</h3>
                  <p className="serving-dept">{item.department}</p>
                  <div className="serving-patient-hint">
                    Patient: <strong>{item.patient?.name}</strong>
                  </div>
                </div>
              </div>
            ))}

            {queueData.currentlyServing.length === 0 && (
              <div className="empty-tv-state">
                <Clock size={44} className="text-muted" />
                <p>No active consultations in progress</p>
                <span>Doctors will call the next checked-in token shortly</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Waiting & Up Next Queue */}
        <div className="tv-column waiting-column">
          <div className="column-header waiting-header">
            <Users size={20} />
            <h2>Waiting in OPD Lounge ({queueData.waiting.length})</h2>
          </div>

          <div className="waiting-tokens-grid">
            {queueData.waiting.map((item, index) => (
              <div key={item._id} className="waiting-token-card">
                <div className="queue-pos-badge">#{index + 1}</div>
                <div className="waiting-token-number">{item.tokenNumber}</div>
                <div className="waiting-details">
                  <p className="waiting-dept">{item.department}</p>
                  <p className="waiting-doctor">Dr. {item.doctor?.name?.replace('Dr. ', '')}</p>
                  <div className="waiting-est-time">
                    <Clock size={12} />
                    <span>Est. wait: ~{item.estimatedWaitTimeMinutes || (index + 1) * 15} mins</span>
                  </div>
                </div>
              </div>
            ))}

            {queueData.waiting.length === 0 && (
              <div className="empty-tv-state">
                <CheckCircle size={44} className="text-muted" />
                <p>No patients currently waiting in queue</p>
                <span>Walk-in and scheduled appointments will appear here</span>
              </div>
            )}
          </div>

          {/* Upcoming Scheduled Tokens Section */}
          <div className="scheduled-tokens-sublist">
            <h3 className="sublist-title">Upcoming Booked Slots Today ({queueData.scheduled.length})</h3>
            <div className="scheduled-pills-row">
              {queueData.scheduled.map((item) => (
                <div key={item._id} className="scheduled-pill">
                  <span className="sch-token">{item.tokenNumber}</span>
                  <span className="sch-slot">{item.timeSlot}</span>
                  <span className="sch-dept">{item.department}</span>
                </div>
              ))}
              {queueData.scheduled.length === 0 && (
                <span className="text-muted text-sm">No remaining unconfirmed bookings today</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQueueDisplay;
