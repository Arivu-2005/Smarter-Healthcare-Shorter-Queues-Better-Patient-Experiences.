export const fallbackDepartments = [
  {
    _id: 'dept-card',
    name: 'Cardiology',
    code: 'CARD',
    description: 'Advanced heart care, diagnostics, ECG, and cardiovascular consultations.',
    floor: '2nd Floor, Wing A',
    headDoctor: 'Dr. Sarah Mitchell',
    contactPhone: '+1-555-0101'
  },
  {
    _id: 'dept-neur',
    name: 'Neurology',
    code: 'NEUR',
    description: 'Brain, nervous system, cognitive assessments, and neurological therapies.',
    floor: '3rd Floor, Wing B',
    headDoctor: 'Dr. Robert Chen',
    contactPhone: '+1-555-0102'
  },
  {
    _id: 'dept-orth',
    name: 'Orthopedics',
    code: 'ORTH',
    description: 'Joint replacement, bone health, spine surgery, and sports injuries.',
    floor: '1st Floor, Wing C',
    headDoctor: 'Dr. Emily Vance',
    contactPhone: '+1-555-0103'
  },
  {
    _id: 'dept-pedi',
    name: 'Pediatrics',
    code: 'PEDI',
    description: 'Comprehensive healthcare and immunizations for infants, kids, and teens.',
    floor: 'Ground Floor, Wing D',
    headDoctor: 'Dr. Marcus Brody',
    contactPhone: '+1-555-0104'
  },
  {
    _id: 'dept-derm',
    name: 'Dermatology',
    code: 'DERM',
    description: 'Skin health, clinical dermatology, allergy testing, and cosmetic care.',
    floor: '2nd Floor, Wing C',
    headDoctor: 'Dr. Elena Rostova',
    contactPhone: '+1-555-0105'
  },
  {
    _id: 'dept-gen',
    name: 'General Medicine',
    code: 'GEN',
    description: 'Primary care, preventive screenings, infectious diseases, and health checks.',
    floor: 'Ground Floor, Wing A',
    headDoctor: 'Dr. James Wilson',
    contactPhone: '+1-555-0100'
  }
];

export const fallbackDoctors = [
  {
    _id: 'doc-sarah',
    name: 'Dr. Sarah Mitchell, MD',
    email: 'doctor@hospital.com',
    role: 'doctor',
    phone: '+1-555-0111',
    specialization: 'Senior Interventional Cardiologist',
    department: 'Cardiology',
    roomNumber: 'Suite 204',
    experienceYears: 16,
    consultationFee: 120,
    rating: 4.9,
    isAvailable: true
  },
  {
    _id: 'doc-robert',
    name: 'Dr. Robert Chen, MD',
    email: 'robert.chen@hospital.com',
    role: 'doctor',
    phone: '+1-555-0112',
    specialization: 'Consultant Neurologist',
    department: 'Neurology',
    roomNumber: 'Suite 310',
    experienceYears: 18,
    consultationFee: 140,
    rating: 4.95,
    isAvailable: true
  },
  {
    _id: 'doc-emily',
    name: 'Dr. Emily Vance, MD',
    email: 'emily.vance@hospital.com',
    role: 'doctor',
    phone: '+1-555-0113',
    specialization: 'Orthopedic & Joint Surgeon',
    department: 'Orthopedics',
    roomNumber: 'Suite 105',
    experienceYears: 12,
    consultationFee: 110,
    rating: 4.85,
    isAvailable: true
  },
  {
    _id: 'doc-james',
    name: 'Dr. James Wilson, MD',
    email: 'james.wilson@hospital.com',
    role: 'doctor',
    phone: '+1-555-0114',
    specialization: 'General Physician & Internist',
    department: 'General Medicine',
    roomNumber: 'Suite 101',
    experienceYears: 14,
    consultationFee: 75,
    rating: 4.75,
    isAvailable: true
  }
];
export const fallbackAppointments = [
  {
    _id: 'apt-demo-1',
    patient: {
      _id: 'demo-patient-1',
      name: 'John Doe',
      gender: 'male',
      age: 34,
      bloodGroup: 'O+',
      phone: '+1-555-0201'
    },
    doctor: {
      _id: 'doc-sarah',
      name: 'Dr. Sarah Mitchell, MD',
      specialization: 'Senior Interventional Cardiologist',
      department: 'Cardiology',
      roomNumber: 'Suite 204'
    },
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:30 AM',
    reason: 'Chest tightness and shortness of breath during cardio',
    symptoms: 'Occasional flutter in chest after brisk walking',
    status: 'checked_in',
    tokenNumber: 'CARD-002',
    tokenSequence: 2,
    estimatedWaitTimeMinutes: 10,
    vitals: {
      bloodPressure: '135/88 mmHg',
      heartRate: '82 bpm',
      temperature: '98.6 F',
      weight: '76 kg'
    }
  },
  {
    _id: 'apt-demo-2',
    patient: {
      _id: 'demo-patient-2',
      name: 'Alice Johnson',
      gender: 'female',
      age: 29,
      bloodGroup: 'A+',
      phone: '+1-555-0202'
    },
    doctor: {
      _id: 'doc-sarah',
      name: 'Dr. Sarah Mitchell, MD',
      specialization: 'Senior Interventional Cardiologist',
      department: 'Cardiology',
      roomNumber: 'Suite 204'
    },
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    reason: 'Routine ECG Follow-up & Hypertension check',
    symptoms: 'Mild dizziness when standing',
    status: 'in_consultation',
    tokenNumber: 'CARD-001',
    tokenSequence: 1,
    estimatedWaitTimeMinutes: 0,
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: '74 bpm',
      temperature: '98.4 F',
      weight: '68 kg'
    }
  },
  {
    _id: 'apt-demo-3',
    patient: {
      _id: 'demo-patient-1',
      name: 'John Doe',
      gender: 'male',
      age: 34,
      bloodGroup: 'O+',
      phone: '+1-555-0201'
    },
    doctor: {
      _id: 'doc-james',
      name: 'Dr. James Wilson, MD',
      specialization: 'General Physician & Internist',
      department: 'General Medicine',
      roomNumber: 'Suite 101'
    },
    department: 'General Medicine',
    date: '2026-10-15',
    timeSlot: '11:00 AM',
    reason: 'Annual Health Physical & Bloodwork',
    status: 'completed',
    tokenNumber: 'GEN-012',
    tokenSequence: 12,
    estimatedWaitTimeMinutes: 0,
    prescriptionNotes: 'Lipid panel normal. Prescribed Vitamin D3 2000IU daily. Maintain hydration.',
    vitals: {
      bloodPressure: '122/80 mmHg',
      heartRate: '72 bpm',
      temperature: '98.6 F',
      weight: '75.5 kg'
    }
  }
];
