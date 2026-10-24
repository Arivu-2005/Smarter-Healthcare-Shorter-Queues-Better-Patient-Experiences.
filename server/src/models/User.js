import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'receptionist', 'patient'],
      default: 'patient'
    },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    age: { type: Number },
    bloodGroup: { type: String, default: 'O+' },
    // Doctor specific fields
    specialization: { type: String, default: '' },
    department: { type: String, default: '' },
    roomNumber: { type: String, default: '' },
    experienceYears: { type: Number, default: 5 },
    consultationFee: { type: Number, default: 50 },
    rating: { type: Number, default: 4.8 },
    availableDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    availableSlots: {
      type: [String],
      default: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
        '03:00 PM', '03:30 PM', '04:00 PM'
      ]
    },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
