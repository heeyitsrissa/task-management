const router = require("express").Router();
const { Task } = require("../../models");
const withAuth = require("../../utils/auth");

// router.get('/', async (req, res) => {
//     try {
//       const taskData = await Task.findAll({
//         include: [{ model: User, attributes: ['username'] }],
//       });
  
//       const tasks = taskData.map((task) => task.get({ plain: true }));
  
//       res.json(tasks);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


// Get route for displaying pending tasks.
router.get('/', withAuth, async (req, res) => {
  try {
    const tasks = await Task.findAll()
    return res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json(err);
  }
});
  
  router.post('/', withAuth, async (req, res) => {
      try {
          const newTask = await Task.create({
              ...req.body,
              user_id: req.session.user_id,
          });
          res.status(201).json(newTask);
      } catch (err) {
          res.status(400).json(err);
      }
  });
  
  router.put("/:id", withAuth, async (req, res) => {
      try {
          const updatedTask = await Task.update(req.body, {
              where: {
                  id: req.params.id,
                  user_id: req.session.user_id,
              },
          });
          if (updatedTask[0] === 0) {
              res.status(404).json({ message: "No task found with this id!" });
              return;
          }
          res.status(200).json({ message: "Task updated successfully!" });
      } catch (err) {
          res.status(500).json(err);
      }
  });

  // Delete task by ID
  router.delete('/:id', withAuth, async (req, res) => {
    try {
      // Extract the task ID from the request parameters
      const taskId = req.params.id;
  
      // Fetch the task with the specified ID from the database
      const task = await Task.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      // If the task with the specified ID is not found, return a 404 status code with a message
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // If the task is found, return it with a 200 status code
      res.status(200).json(task);
    } catch (err) {
      // If an error occurs, return a 500 status code with the error message
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
// Get task by ID
router.get('/:id', withAuth, async (req, res) => {
  try {
    // Extract the task ID from the request parameters
    const taskId = req.params.id;

    // Fetch the task with the specified ID from the database
    const task = await Task.destroy({
        where: {
            id: taskId
        }
    });

    // If the task with the specified ID is not found, return a 404 status code with a message
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If the task is found, return it with a 200 status code
    res.status(200).json(task);
  } catch (err) {
    // If an error occurs, return a 500 status code with the error message
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

  
  module.exports = router;
  

//   router.get('/', withAuth, async (req, res) => {
//     try {
//       const userData = await User.findByPk(req.session.user_id, {
//         attributes: { exclude: ['password'] },
//         include: [{ model: Task }],
//       });
  
//       const user = userData.get({ plain: true });
  
//       res.render('homepage', { ...user, logged_in: true });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


