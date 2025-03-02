// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5173;  // Ensure this is 5173

// // Import routes
// const staffRouter = require('./routes/staff');
// const taskRouter = require('./routes/task');

// // Middleware
// const corsOptions = {
//   origin: 'http://localhost:3000',  // This should match your React app's URL
//   optionsSuccessStatus: 200,
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));
// app.use(express.json());

// // Use routes
// app.use('/api/staff', staffRouter);
// app.use('/api/task', taskRouter);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connection established'))
//   .catch((error) => console.log('MongoDB connection error:', error));

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
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
const corsOptions = {
  origin: ["https://work-status-portal.vercel.app"], // Allow frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};


// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

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
