/* NOTE Refactoring 4 route solution, Manage file structure with separate routing to other directory */
const express = require('express');

const router = express.Router();

const getAllUsers = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};

const createUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};
const getUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};
const updateUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};
const deteleUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
   });
};

router
   .route('/')
   .get(getAllUsers)
   .post(createUser);

router
   .route('/:id')
   .get(getUser)
   .patch(updateUser)
   .delete(deteleUser);

module.exports = router;
