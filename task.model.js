const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskid: { type: String, required: true },
  nature: { type: String, required: true },
  location: { type: String, required: true },
  number: { type: Number, required: true },
  workin: { type: String, required: true },
  workout: { type: String },
  status: { type: String, required: true },
  remarks: { type: String },
  reasonForDelay: { type: String },
  staffNames: [{ type: String }],
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;