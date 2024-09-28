const express = require('express');
const router = express.Router();

// Task model (replace with actual Mongoose model or other)
const Task = require('../models/taskModel'); 

// POST route for creating a new task
router.post('/task', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error adding task', error });
  }
});

module.exports = router;