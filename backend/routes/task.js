const router = require('express').Router();
let Task = require('../models/task.model');

router.route('/').get((req, res) => {
  Task.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
  const newTask = new Task(req.body);

  newTask.save()
    .then(() => res.json('Task added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').put((req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      // Update task properties based on the request body
      task.status = req.body.status || task.status;
      task.reasonForDelay = req.body.reasonForDelay || task.reasonForDelay;
      task.remarks = req.body.remarks || task.remarks;  // Allow updating remarks if needed

      task.save()
        .then(() => res.json('Task updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;