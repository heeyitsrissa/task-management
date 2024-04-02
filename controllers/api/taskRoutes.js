const router = require("express").Router();
const { Task, User } = require("../../models");

const withAuth = require("../../utils/auth");
const { appendTaskToFile } = require("../../utils/helpers");

router.get('/', withAuth, async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { user_id: req.session.user_id },
            include: [{ model: User, attributes: ['username'] }]
        });

        const tasksPlain = tasks.map(task => task.get({ plain: true }));

        res.render('tasks', {
            tasks: tasksPlain,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: err });
    }
});
router.post('/', withAuth, async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(201).redirect('/api/tasks');
    } catch (err) {
        console.error(err);
        res.status(400).render('error', { error: err });
    }
});

// router.get('/:id', withAuth, async (req, res) => {
//     try {
//         const task = await Task.findByPk(req.params.id, {
//             include: [{ model: User, attributes: ['username'] }]
//         });

//         if (!task) {
//             res.status(404).render('error', { error: "Task not found" });
//             return;
//         }

//         const taskPlain = task.get({ plain: true });

//         res.render('task', {
//             task: taskPlain,
//             logged_in: req.session.logged_in
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).render('error', { error: err }); // 
//     }
// });


// UPDATE a task
router.put('/:id', withAuth, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            res.status(404).json({ message: 'No task found with this id!' });
            return;
        }

        if (task.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'You do not have permission to update this task' });
            return;
        }

        await task.update(req.body);
        const updatedTask = await task.get({ plain: true });
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: err }); // 
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

  


