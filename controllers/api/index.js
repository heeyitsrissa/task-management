const router = require('express').Router();
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/tasks' , taskRoutes)
router.use('/users', userRoutes);


module.exports = router;

