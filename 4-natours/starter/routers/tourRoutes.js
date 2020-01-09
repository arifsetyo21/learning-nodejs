/* NOTE Refactoring 4 route solution, Manage file structure with separate routing to other directory */
const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
   console.log(`Tour id is : ${val}`);
   next();
});

/* NOTE Calling middleware from tourController */
// router.param('id', tourController.checkId);

router
   .route('/')
   .get(tourController.getAllTours)
   /* NOTE Make readable code with use access method from tourController object */
   .post(tourController.createTour);

router
   .route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour);

module.exports = router;
