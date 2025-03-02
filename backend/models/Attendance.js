const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    staffId: { type: String, required: true },
    isPresent: { type: Boolean, required: true },
    totalPresent: { type: Number, required: true },
  },
  { 
    timestamps: true,
    // Add indexes for better query performance
    indexes: [
      { date: 1, staffId: 1 },
      { date: 1 }
    ]
  }
);

// Compound index for unique combinations of date and staffId
attendanceSchema.index({ date: 1, staffId: 1 }, { unique: true });

// Pre-save middleware to ensure date is set to midnight UTC
attendanceSchema.pre('save', function(next) {
  if (this.date) {
    this.date = new Date(this.date.setHours(0, 0, 0, 0));
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema, 'attendances');