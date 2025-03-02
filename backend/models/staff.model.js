const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  staffId: { type: String, required: true },
  designation: { type: String, required: true },
  skill: { type: String, required: true },
  status: { type: String, required: true },
//   image: { type: String, required: true },
  otherSkill: { type: String },
}, {
  timestamps: true,
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
