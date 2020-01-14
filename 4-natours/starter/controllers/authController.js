const { promisify } = require('util');
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
         passwordConfirm: req.body.passwordConfirm,
         passwordUpdatedAt: req.body.passwordUpdatedAt,
         role: req.body.role
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

exports.protect = async (req, res, next) => {
   try {
      let token;

      // 1. Getting token and check of it's there
      if (
         req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer')
      ) {
         // for remove Bearer key from token
         token = req.headers.authorization.replace('Bearer ', '');
      }
      console.log(token);

      // Check token validation, if token is present`
      if (!token) {
         res.status(401).json({
            status: 'fail',
            message: 'token not available, please login'
         });
      }

      // 2. Validate the token
      const decoded = await promisify(jwt.verify)(
         token,
         process.env.JWT_SECRET
      );

      // console.log('decoded', decoded);

      // 3. Check if user still exists
      const currentUser = await User.findOne({ _id: decoded.id });
      if (!currentUser) {
         res.status(401).json({
            status: 'fail',
            message: "user doesn't exists"
         });
      }
      // console.log(currentUser.name);

      // 4. Check if user changed password after the JWT was issued
      if (await currentUser.checkPasswordUpdatedAfterLogin(decoded.iat)) {
         res.status(401).json({
            status: 'fail',
            message: 'User recently changed password! Please login again'
         });
      }

      // Assign user finded to req object
      req.user = currentUser;
      // FORWARD TO NEXT MIDDLEWARE
      next();
   } catch (error) {
      res.status(401).json({
         status: 'fail',
         message: error
      });
   }
};

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      // roles ['admin', 'lead-guide'], role='user'
      if (!roles.includes(req.user.role)) {
         res.status(403).json({
            status: 'fail',
            message: "you hasn't permission in this resource"
         });
      }

      next();
   };
};
