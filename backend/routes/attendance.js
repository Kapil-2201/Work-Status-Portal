const router = require('express').Router();
const Attendance = require('../models/Attendance');

// Middleware for input validation
const validateAttendanceData = (req, res, next) => {
  const { date, staffId, isPresent, totalPresent } = req.body;
  
  if (!date || !staffId || typeof isPresent !== 'boolean' || typeof totalPresent !== 'number') {
    return res.status(400).json({ 
      error: 'Invalid attendance data. Required: date, staffId, isPresent (boolean), totalPresent (number)' 
    });
  }
  
  // Validate date format
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  
  next();
};

// Record attendance
router.post('/', validateAttendanceData, async (req, res) => {
  try {
    const { date, staffId, isPresent, totalPresent } = req.body;
    
    const attendance = await Attendance.findOneAndUpdate(
      { date: new Date(date), staffId },
      { isPresent, totalPresent },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error('Attendance update error:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Get attendance history with pagination
router.get('/history', async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 31 } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Attendance.countDocuments(query)
    ]);
    
    // Transform to required format
    const formattedAttendance = attendance.reduce((acc, record) => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!acc[dateStr]) acc[dateStr] = {};
      acc[dateStr][record.staffId] = record.isPresent;
      return acc;
    }, {});

    res.json({
      attendance: formattedAttendance,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error('Attendance history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

module.exports = router;

// Attendance.js (Mongoose Model)
