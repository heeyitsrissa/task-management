const router = require('express').Router();
const { Task, User } = require('../models');
const withAuth = require('../utils/auth');


router.get('/add-task', withAuth, async (req, res) => {
  try {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.logged_in) {
      return res.redirect('/login');
    }

    // If the user is logged in, allow them to view tasks
    const taskData = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
          logged_in: req.session.logged_in
        },
      ],
    });

    const tasks = taskData.map(task => task.get({ plain: true }));

    res.render('add-task', { tasks, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// route for pending tasks
router.get('/pending', withAuth, async (req, res) => {
  try {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.logged_in) {
      return res.redirect('/login');
    }

    // If the user is logged in, allow them to view tasks
    const taskData = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const tasks = taskData.map(task => task.get({ plain: true }));

    res.render('pending', { tasks, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// route for inprogress tasks
router.get('/inprogress', withAuth, async (req, res) => {
  try {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.logged_in) {
      return res.redirect('/login');
    }

    // If the user is logged in, allow them to view tasks
    const taskData = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const tasks = taskData.map(task => task.get({ plain: true }));

    res.render('inprogress', { tasks, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// route for completed tasks
router.get('/completed', withAuth, async (req, res) => {
  try {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.logged_in) {
      return res.redirect('/login');
    }

    // If the user is logged in, allow them to view tasks
    const taskData = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const tasks = taskData.map(task => task.get({ plain: true }));

    res.render('completed', { tasks, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Task }],
    });

    const user = userData.get({ plain: true });

    res.render('homepage', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
 
  if (req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  res.render('login');
});

router.get('/register', (req, res) => {
  
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('register');
});

module.exports = router;