const router = require('express').Router();
const Staff = require('../models/staff.model');

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching staff data: ' + err });
  }
});

// Add new staff
router.post('/', async (req, res) => {
  const newStaff = new Staff(req.body);

  try {
    await newStaff.save();
    res.json({ message: 'Staff added successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Error adding new staff member: ' + err });
  }
});

module.exports = router;
