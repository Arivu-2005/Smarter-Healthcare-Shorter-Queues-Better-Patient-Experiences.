import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:30 AM"
    reason: { type: String, required: true },
    symptoms: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked_in', 'in_consultation', 'completed', 'cancelled'],
      default: 'confirmed'
    },
    // Queue Token Details
    tokenNumber: { type: String }, // e.g. CARD-004
    tokenSequence: { type: Number }, // e.g. 4
    estimatedWaitTimeMinutes: { type: Number, default: 15 },
    checkedInAt: { type: Date },
    consultationStartedAt: { type: Date },
    completedAt: { type: Date },
    prescriptionNotes: { type: String, default: '' },
    vitals: {
      bloodPressure: { type: String, default: '' },
      heartRate: { type: String, default: '' },
      temperature: { type: String, default: '' },
      weight: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// Prevent double bookings for same doctor on same date and timeslot (ignoring cancelled)
AppointmentSchema.index(
  { doctor: 1, date: 1, timeSlot: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: { $nin: ['cancelled', 'completed'] } } 
  }
);
AppointmentSchema.index({ date: 1, department: 1, tokenSequence: 1 });
AppointmentSchema.index({ patient: 1, date: 1 });

export default mongoose.model('Appointment', AppointmentSchema);
