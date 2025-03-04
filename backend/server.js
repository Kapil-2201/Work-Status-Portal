require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5173;  // Local fallback to 5173

// Enable CORS for your frontend
app.use(cors({
  origin: 'https://work-status-portal.vercel.app', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); 

// Import routes
const staffRouter = require('./routes/staff');
const taskRouter = require('./routes/task');
const attendanceRouter = require('./routes/attendance');

app.use('/api/staff', staffRouter);
app.use('/api/task', taskRouter);
app.use('/api/attendance', attendanceRouter);

// Start server (only for local development)
app.listen(port, () => console.log(`Server running on port ${port}`));
