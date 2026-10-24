# Smart Hospital Appointment & Queue Management System

> **Tagline:** *Smarter Healthcare, Shorter Queues, Better Patient Experiences.*

A full-stack, responsive healthcare operations platform engineered with **React.js, Node.js, Express.js, MongoDB, and Socket.IO**. Designed with a premium healthcare aesthetic (clean clinical white background, calming blue and teal accents, modern typography, and touch-friendly controls) to deliver a seamless experience across Mobile phones, Tablets, Laptops, and Desktop computers.

---

## 🌟 Architecture & Key Features

### 1. Multi-Device Experience
- **📱 Mobile (Smartphones):** Mobile-first touch interface, bottom app navigation / collapsible menu, digital queue tokens, live waiting-time countdowns, and instant self-booking.
- **📟 Tablet (Reception Desks & Nursing Triage):** Rapid patient check-ins, quick walk-in appointment creation, digital slip printing, and room status updates.
- **💻 Laptop (Doctor OPD Chamber):** OPD consultation workspace with queue roster on the left and active patient records, vitals recording (BP, heart rate, temperature, weight), and e-prescription generator on the right.
- **🖥️ Desktop (Hospital Administration & Live Queue TV Displays):** Master live feed of all outpatient departments, queue load meters, duty rosters, department capacity tracking, and full-screen Kiosk Queue TV with audio voice callout assistance.

### 2. Role-Based Dashboards
1. **Patient Dashboard:** View active queue status, digital token passes, wait-time estimates, appointment rescheduling, cancellation, and past doctor prescriptions.
2. **Doctor Console:** Chamber queue roster, "Call Next Patient" audio-synced trigger, vitals documentation, and sign-off consultation workflows.
3. **Receptionist OPD Desk:** Real-time patient check-in on arrival, token slip generation, walk-in patient triage, and department-level filtering.
4. **Hospital Admin Operations:** Comprehensive telemetry, department capacity utilization bars, on-duty physician monitoring, and audit log.
5. **Live Queue TV Display:** Real-time Socket.IO synced OPD display board showing currently consulting tokens, waiting queue orders, and audible speech notifications when a patient is called.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v24+
- **MongoDB**: Running locally on port `27017` or a MongoDB Atlas URI

### 1. Database & Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds demo users, departments, and live queue appointments
npm start        # Launches backend API on http://localhost:5050
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Launches React Vite frontend on http://localhost:3000
```

---

## 🔑 Demo Login Credentials
All demo profiles are preloaded with password `password123`:

| Role | Email | Password | Primary Feature Access |
|---|---|---|---|
| **Patient** | `patient@hospital.com` | `password123` | Digital Token Pass, Live Wait Countdown, Reschedule |
| **Doctor** | `doctor@hospital.com` | `password123` | OPD Consultation Room, Call Patient, Vitals & Notes |
| **Receptionist** | `receptionist@hospital.com` | `password123` | Front Desk Triage, Check-In Walk-Ins, Print Slip |
| **Admin** | `admin@hospital.com` | `password123` | Hospital Telemetry, Department Capacity, Live Logs |

*(You can also use the 1-Click demo switcher pills directly on the login screen).*

---

## 📡 Real-Time Socket.IO Events
- `queue:update`: Emitted when appointments are booked, rescheduled, cancelled, checked-in, or called into consultation. Automatically updates the live display board and dashboard rosters without browser refreshes.
- Real-time Web Speech Synthesis announces patient tokens: *"Token CARD-001, please proceed to Suite 204"*.
