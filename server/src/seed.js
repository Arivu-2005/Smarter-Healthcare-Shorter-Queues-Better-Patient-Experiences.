import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_hospital_db';

const departmentsData = [
  {
    name: 'Cardiology',
    code: 'CARD',
    description: 'Advanced heart care, diagnostics, ECG, and cardiovascular consultations.',
    icon: 'Activity',
    floor: '2nd Floor, Wing A',
    headDoctor: 'Dr. Sarah Mitchell',
    contactPhone: '+1-555-0101'
  },
  {
    name: 'Neurology',
    code: 'NEUR',
    description: 'Brain, nervous system, cognitive assessments, and neurological therapies.',
    icon: 'Brain',
    floor: '3rd Floor, Wing B',
    headDoctor: 'Dr. Robert Chen',
    contactPhone: '+1-555-0102'
  },
  {
    name: 'Orthopedics',
    code: 'ORTH',
    description: 'Joint replacement, bone health, spine surgery, and sports injuries.',
    icon: 'Bone',
    floor: '1st Floor, Wing C',
    headDoctor: 'Dr. Emily Vance',
    contactPhone: '+1-555-0103'
  },
  {
    name: 'Pediatrics',
    code: 'PEDI',
    description: 'Comprehensive healthcare and immunizations for infants, kids, and teens.',
    icon: 'Baby',
    floor: 'Ground Floor, Wing D',
    headDoctor: 'Dr. Marcus Brody',
    contactPhone: '+1-555-0104'
  },
  {
    name: 'Dermatology',
    code: 'DERM',
    description: 'Skin health, clinical dermatology, allergy testing, and cosmetic care.',
    icon: 'ShieldAlert',
    floor: '2nd Floor, Wing C',
    headDoctor: 'Dr. Elena Rostova',
    contactPhone: '+1-555-0105'
  },
  {
    name: 'General Medicine',
    code: 'GEN',
    description: 'Primary care, preventive screenings, infectious diseases, and health checks.',
    icon: 'Stethoscope',
    floor: 'Ground Floor, Wing A',
    headDoctor: 'Dr. James Wilson',
    contactPhone: '+1-555-0100'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB...');

    // Clear collections
    await User.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // Insert Departments
    await Department.insertMany(departmentsData);
    console.log('[Seed] Departments inserted.');

    // Insert Admin
    const adminUser = await User.create({
      name: 'Dr. Arthur Harrison (Chief Admin)',
      email: 'admin@hospital.com',
      password: 'password123',
      role: 'admin',
      phone: '+1-555-0001',
      gender: 'male',
      age: 48,
      bloodGroup: 'A+'
    });

    // Insert Receptionist
    const receptionistUser = await User.create({
      name: 'Clara Oswald (Front Desk Lead)',
      email: 'receptionist@hospital.com',
      password: 'password123',
      role: 'receptionist',
      phone: '+1-555-0002',
      gender: 'female',
      age: 32,
      bloodGroup: 'B+'
    });

    // Insert Doctors
    const doctor1 = await User.create({
      name: 'Dr. Sarah Mitchell, MD',
      email: 'doctor@hospital.com', // Primary demo doctor login
      password: 'password123',
      role: 'doctor',
      phone: '+1-555-0111',
      gender: 'female',
      age: 42,
      bloodGroup: 'O+',
      specialization: 'Senior Interventional Cardiologist',
      department: 'Cardiology',
      roomNumber: 'Suite 204',
      experienceYears: 16,
      consultationFee: 120,
      rating: 4.9,
      isAvailable: true
    });

    const doctor2 = await User.create({
      name: 'Dr. Robert Chen, MD',
      email: 'robert.chen@hospital.com',
      password: 'password123',
      role: 'doctor',
      phone: '+1-555-0112',
      gender: 'male',
      age: 45,
      bloodGroup: 'A+',
      specialization: 'Consultant Neurologist',
      department: 'Neurology',
      roomNumber: 'Suite 310',
      experienceYears: 18,
      consultationFee: 140,
      rating: 4.95,
      isAvailable: true
    });

    const doctor3 = await User.create({
      name: 'Dr. Emily Vance, MD',
      email: 'emily.vance@hospital.com',
      password: 'password123',
      role: 'doctor',
      phone: '+1-555-0113',
      gender: 'female',
      age: 38,
      bloodGroup: 'B-',
      specialization: 'Orthopedic & Joint Surgeon',
      department: 'Orthopedics',
      roomNumber: 'Suite 105',
      experienceYears: 12,
      consultationFee: 110,
      rating: 4.85,
      isAvailable: true
    });

    const doctor4 = await User.create({
      name: 'Dr. James Wilson, MD',
      email: 'james.wilson@hospital.com',
      password: 'password123',
      role: 'doctor',
      phone: '+1-555-0114',
      gender: 'male',
      age: 40,
      bloodGroup: 'AB+',
      specialization: 'General Physician & Internist',
      department: 'General Medicine',
      roomNumber: 'Suite 101',
      experienceYears: 14,
      consultationFee: 75,
      rating: 4.75,
      isAvailable: true
    });

    // Insert Patients
    const patient1 = await User.create({
      name: 'John Doe',
      email: 'patient@hospital.com', // Primary demo patient login
      password: 'password123',
      role: 'patient',
      phone: '+1-555-0201',
      gender: 'male',
      age: 34,
      bloodGroup: 'O+'
    });

    const patient2 = await User.create({
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: 'password123',
      role: 'patient',
      phone: '+1-555-0202',
      gender: 'female',
      age: 29,
      bloodGroup: 'A+'
    });

    const patient3 = await User.create({
      name: 'Michael Chang',
      email: 'michael.c@example.com',
      password: 'password123',
      role: 'patient',
      phone: '+1-555-0203',
      gender: 'male',
      age: 52,
      bloodGroup: 'B+'
    });

    const patient4 = await User.create({
      name: 'Sophia Martinez',
      email: 'sophia.m@example.com',
      password: 'password123',
      role: 'patient',
      phone: '+1-555-0204',
      gender: 'female',
      age: 26,
      bloodGroup: 'O-'
    });

    const today = new Date().toISOString().split('T')[0];

    // Seed Appointments with Queue status
    // 1. Current serving patient for Dr. Sarah Mitchell (Cardiology)
    await Appointment.create({
      patient: patient2._id,
      doctor: doctor1._id,
      department: 'Cardiology',
      date: today,
      timeSlot: '09:00 AM',
      reason: 'Routine ECG Follow-up & Hypertension check',
      symptoms: 'Mild dizziness when standing',
      status: 'in_consultation',
      tokenNumber: 'CARD-001',
      tokenSequence: 1,
      estimatedWaitTimeMinutes: 0,
      checkedInAt: new Date(Date.now() - 45 * 60000),
      consultationStartedAt: new Date(Date.now() - 10 * 60000),
      vitals: {
        bloodPressure: '128/82 mmHg',
        heartRate: '74 bpm',
        temperature: '98.4 F',
        weight: '68 kg'
      }
    });

    // 2. Waiting patient (Checked in) - John Doe (Demo user!)
    await Appointment.create({
      patient: patient1._id,
      doctor: doctor1._id,
      department: 'Cardiology',
      date: today,
      timeSlot: '09:30 AM',
      reason: 'Chest tightness and shortness of breath during cardio',
      symptoms: 'Occasional flutter in chest after brisk walking',
      status: 'checked_in',
      tokenNumber: 'CARD-002',
      tokenSequence: 2,
      estimatedWaitTimeMinutes: 10,
      checkedInAt: new Date(Date.now() - 15 * 60000),
      vitals: {
        bloodPressure: '135/88 mmHg',
        heartRate: '82 bpm',
        temperature: '98.6 F',
        weight: '76 kg'
      }
    });

    // 3. Confirmed patient (Scheduled today)
    await Appointment.create({
      patient: patient3._id,
      doctor: doctor1._id,
      department: 'Cardiology',
      date: today,
      timeSlot: '10:30 AM',
      reason: 'Post-op coronary bypass review',
      symptoms: 'Reviewing medication tolerance',
      status: 'confirmed',
      tokenNumber: 'CARD-003',
      tokenSequence: 3,
      estimatedWaitTimeMinutes: 25
    });

    // 4. Neurology patient
    await Appointment.create({
      patient: patient4._id,
      doctor: doctor2._id,
      department: 'Neurology',
      date: today,
      timeSlot: '10:00 AM',
      reason: 'Chronic migraine headaches and visual aura',
      symptoms: 'Pounding left temporal pain lasting 6 hours',
      status: 'checked_in',
      tokenNumber: 'NEUR-001',
      tokenSequence: 1,
      estimatedWaitTimeMinutes: 5,
      checkedInAt: new Date(Date.now() - 20 * 60000),
      vitals: {
        bloodPressure: '120/80 mmHg',
        heartRate: '70 bpm',
        temperature: '98.5 F',
        weight: '58 kg'
      }
    });

    // 5. Completed past appointment for John Doe
    await Appointment.create({
      patient: patient1._id,
      doctor: doctor4._id,
      department: 'General Medicine',
      date: '2026-10-15',
      timeSlot: '11:00 AM',
      reason: 'Annual Health Physical & Bloodwork',
      symptoms: 'None, annual preventive',
      status: 'completed',
      tokenNumber: 'GEN-012',
      tokenSequence: 12,
      estimatedWaitTimeMinutes: 0,
      prescriptionNotes: 'Lipid panel within normal limits. Prescribed Vitamin D3 2000IU daily. Maintain hydration.',
      vitals: {
        bloodPressure: '122/80 mmHg',
        heartRate: '72 bpm',
        temperature: '98.6 F',
        weight: '75.5 kg'
      }
    });

    console.log('[Seed] Database successfully populated with realistic healthcare records!');
    console.log('--------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('1. Admin:        admin@hospital.com / password123');
    console.log('2. Doctor:       doctor@hospital.com / password123');
    console.log('3. Receptionist: receptionist@hospital.com / password123');
    console.log('4. Patient:      patient@hospital.com / password123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
