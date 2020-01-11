const router = require('express').Router();
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

router.use('/tours', tourRoutes);
router.use('/users', userRoutes);

module.exports = router;
