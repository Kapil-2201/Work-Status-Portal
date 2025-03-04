const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5173;  // Ensure this is 5173

// Import routes
const staffRouter = require('./routes/staff');
const taskRouter = require('./routes/task');
const attendanceRouter = require('./routes/attendance');


// Middleware
const cors = require('cors');

const corsOptions = {
  origin: "https://work-status-portal.vercel.app", // Allow only your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Allow cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle CORS preflight requests manually
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://work-status-portal.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


// Use routes
app.use('/api/staff', staffRouter);
app.use('/api/task', taskRouter);
app.use('/api/attendance', attendanceRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
