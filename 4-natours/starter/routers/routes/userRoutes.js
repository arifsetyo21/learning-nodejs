/* NOTE Refactoring 4 route solution, Manage file structure with separate routing to other directory */
const express = require('express');
const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.fogotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
   '/updateMyPassword',
   authController.protect,
   authController.updatePassword
);

router.patch(
   '/updateMe',
   userController.uploadUserPhoto,
   authController.protect,
   userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

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
