const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
// TODO const AppError = require('');
const sendEmail = require('../utils/email');

// NOTE Create token for send to user
const signToken = id => {
   return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPERIES_IN
   });
};

// NOTE method for sending token to 'success' response
const createSendToken = (user, statusCode, res) => {
   // console.log(process.env.JWT_COOKIE_EXPIRES_IN);

   const token = signToken(user.id);
   const cookieOptions = {
      expires: new Date(
         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
   };
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

   res.cookie('jwt', token, cookieOptions);

   user.password = undefined;

   res.status(statusCode).json({
      status: 'success',
      token,
      result: user
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

      // NOTE using createSendToken method for send token
      createSendToken(newUser, 201, res);
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
      createSendToken(user, 200, res);
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

      // Check token validation, if token is present
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

exports.fogotPassword = async (req, res, next) => {
   // will send email address
   // 1. Get user based on email
   const user = await User.findOne({ email: req.body.email });
   if (!user) {
      res.status(404).json({
         status: 'fail',
         message: 'user not found'
      });
   }
   // 2. Generate random reset token
   const resetToken = await user.createPasswordResetToken();
   await user.save({ validateBeforeSave: false });

   // 3. Send it to user email
   const resetURL = `${req.protocol}://${req.get(
      'host'
   )}/api/v1/users/resetPassword/${resetToken}`;

   const message = `Forgot password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n if you didn't forgot your password, please ignore this email`;

   console.log(message);

   try {
      await sendEmail({
         email: user.email,
         subject: 'Your password reset token (valid for 10 minutes)',
         message
      });

      res.status(200).json({
         status: 'success',
         message: 'Token sent to email!'
      });
   } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
         status: 'fail',
         message: error
      });
   }
};

exports.resetPassword = async (req, res, next) => {
   try {
      // 1. Get user based on token
      const hashedToken = crypto
         .createHash('sha256')
         .update(req.params.token)
         .digest('hex');

      const user = await User.findOne({
         passwordResetToken: hashedToken,
         passwordResetExpires: { $gt: Date.now() }
      });

      // 2. if token has not expired, and there is user, set new password
      if (!user) {
         return next(
            res.status(400).json({
               status: 'error',
               message: 'token is invalid or has expired'
            })
         );
      }

      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      // 3. update changedPasswordAt property for the user, NOTE in the userModel.jss
      // 4. log the user in, send JWT
      createSendToken(user, 200, res);
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         error
      });
   }
};

module.exports.updatePassword = async (req, res, next) => {
   try {
      // console.log(req.user);

      // 1. Get user from collection
      const user = await User.findOne({ _id: req.user._id }).select(
         '+password'
      );

      console.log(user);
      console.log(req.body);

      // 2. Check if POSTed current password is correct
      const { passwordCurrent, password, passwordConfirm } = req.body;
      const correct = await user.correctPassword(
         passwordCurrent,
         user.password
      );

      // 3. if so, update password
      if (!user || !correct) {
         res.status(400).json({
            status: 'fail',
            message: 'invalid account'
         });
      }

      // new password
      user.password = password;
      // Password confirmation
      user.passwordConfirm = passwordConfirm;
      await user.save();

      // 4. Log user in, send JWT
      createSendToken(user, 200, res);
   } catch (error) {
      res.status(400).json({
         status: 'fail',
         error
      });
   }
};
