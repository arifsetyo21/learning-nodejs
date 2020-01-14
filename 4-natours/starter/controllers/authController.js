const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
// const AppError = require('');

// Create token for send to user
const signToken = id => {
   return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPERIES_IN
   });
};

exports.signup = async (req, res, next) => {
   try {
      // NOTE [Refactored] const newUser = await User.create(req.body);
      const newUser = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passwordConfirm: req.body.passwordConfirm
      });

      const token = signToken(newUser._id);

      res.status(201).json({
         status: 'success',
         token,
         data: {
            User: newUser
         }
      });
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         data: {
            error
         }
      });
   }
};

exports.login = async (req, res, next) => {
   try {
      // get 2 variable email and password in es6
      const { email, password } = req.body;

      // 1) Check if email and password exists
      if (!email || !password) {
         // next(new AppError('please provide email and password!', 400));
         return res.status(400).json({
            status: 'fail',
            message: 'email or password must filled'
         });
      }
      // 2) Check if user exists && password is correct
      // method select('+password') is display attribute again if we select: false in model
      const user = await User.findOne({ email }).select('+password');
      // console.log(user);

      const correct = await user.correctPassword(password, user.password);
      // console.log(correct);

      if (!user || !correct) {
         res.status(401).json({
            status: 'Unauthorized',
            message: 'email or password must correct'
         });
      }

      // 3) if everything is ok, send token to client
      const token = signToken(user._id);

      res.status(200).json({
         status: 'success',
         token
      });
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         message: error
      });
   }
};
