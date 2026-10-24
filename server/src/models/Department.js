import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, uppercase: true }, // e.g. CARD, NEUR, PEDI
    description: { type: String, default: '' },
    icon: { type: String, default: 'HeartPulse' },
    floor: { type: String, default: '1st Floor' },
    headDoctor: { type: String, default: '' },
    contactPhone: { type: String, default: '+1-555-0199' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Department', DepartmentSchema);
