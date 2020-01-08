/* NOTE Refactoring 4 route solution, Manage file structure with separate routing to other directory */
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
router
   .route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser);

router
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deteleUser);

module.exports = router;
