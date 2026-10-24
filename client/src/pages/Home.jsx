import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Stethoscope, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  Search, 
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';
import './Home.css';

const Home = ({ setActiveTab, departments, doctors, onSelectDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="badge-pill">
            <Sparkles size={16} />
            <span>Next-Gen Smart Healthcare Technology</span>
          </div>
          <h1 className="hero-title">
            Smarter Healthcare, <span className="highlight-blue">Shorter Queues</span>, Better Patient Experiences.
          </h1>
          <p className="hero-description">
            Experience frictionless OPD visits. Book consultations with specialized doctors, track your live queue token sequence in real-time, and avoid crowded waiting halls.
          </p>
          <div className="hero-cta-group">
            <button 
              className="btn-hero-primary" 
              onClick={() => setActiveTab('book-appointment')}
            >
              <Calendar size={18} />
              <span>Book Appointment Now</span>
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => setActiveTab('live-queue')}
            >
              <Clock size={18} />
              <span>View Live OPD Queue Display</span>
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">15 Mins</span>
              <span className="stat-label">Avg. Patient Wait Time</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">On-time Consultations</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9 / 5</span>
              <span className="stat-label">Patient Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Departments Grid */}
      <section className="departments-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Centres of Clinical Excellence</h2>
            <p className="section-subtitle">Multi-specialty outpatient clinics equipped with live queue tracking</p>
          </div>
        </div>

        <div className="departments-grid">
          {departments.map((dept) => (
            <div 
              key={dept._id || dept.name} 
              className={`dept-card ${selectedDept === dept.name ? 'active-dept' : ''}`}
              onClick={() => setSelectedDept(dept.name === selectedDept ? 'All' : dept.name)}
            >
              <div className="dept-icon-box">
                <Building2 size={24} />
              </div>
              <h3 className="dept-name">{dept.name}</h3>
              <p className="dept-desc">{dept.description}</p>
              <div className="dept-footer">
                <span className="dept-floor">{dept.floor}</span>
                <span className="dept-badge">{dept.code}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctor Discovery & Booking Directory */}
      <section className="doctors-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Find Specialized Doctors</h2>
            <p className="section-subtitle">Browse consulting physicians and reserve your slot instantly</p>
          </div>
          <div className="search-filter-wrapper">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Department Filters Pills */}
        <div className="filter-pills-bar">
          <button 
            className={`filter-pill ${selectedDept === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedDept('All')}
          >
            All Specialties
          </button>
          {departments.map((d) => (
            <button 
              key={d._id || d.name}
              className={`filter-pill ${selectedDept === d.name ? 'active' : ''}`}
              onClick={() => setSelectedDept(d.name)}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="doctors-grid">
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="doctor-card">
              <div className="doctor-card-top">
                <div className="doctor-avatar">
                  {doc.name.charAt(4) || 'D'}
                </div>
                <div>
                  <h3 className="doctor-name">{doc.name}</h3>
                  <p className="doctor-specialty">{doc.specialization}</p>
                  <span className="doctor-department-tag">{doc.department}</span>
                </div>
              </div>

              <div className="doctor-meta">
                <div className="meta-pill">
                  <span className="meta-label">OPD Room:</span>
                  <span className="meta-value">{doc.roomNumber || 'Room 102'}</span>
                </div>
                <div className="meta-pill">
                  <span className="meta-label">Experience:</span>
                  <span className="meta-value">{doc.experienceYears} Years</span>
                </div>
                <div className="meta-pill">
                  <span className="meta-label">Fee:</span>
                  <span className="meta-value">${doc.consultationFee}</span>
                </div>
              </div>

              <div className="doctor-schedule-hint">
                <Clock size={14} />
                <span>Mon - Fri • 09:00 AM - 04:30 PM</span>
              </div>

              <button 
                className="btn-book-doctor"
                onClick={() => {
                  if (onSelectDoctor) onSelectDoctor(doc);
                  setActiveTab('book-appointment');
                }}
              >
                <span>Book Token & Slot</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="empty-results-box">
              <Stethoscope size={40} className="empty-icon" />
              <h3>No Doctors Match Your Search</h3>
              <p>Try searching another medical specialty or reset filter.</p>
              <button className="btn-reset-filter" onClick={() => { setSelectedDept('All'); setSearchTerm(''); }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="features-showcase">
        <h2 className="section-title text-center">Engineered for Seamless Patient Flow</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-blue">
              <Clock size={28} />
            </div>
            <h3>Real-Time Live Queue Tracking</h3>
            <p>Know exactly how many patients are ahead and view dynamic wait-time calculations updated on every doctor consultation step.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-teal">
              <ShieldCheck size={28} />
            </div>
            <h3>Role-Based OPD Workspaces</h3>
            <p>Specialized UI for Doctors to call patients and record vitals, Receptionists to check in walk-ins, and Admins to monitor analytics.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-amber">
              <Calendar size={28} />
            </div>
            <h3>Instant Digital Queue Tokens</h3>
            <p>Receive your department sequence token code upon booking with complete mobile-friendly ticket view and rescheduling tools.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
