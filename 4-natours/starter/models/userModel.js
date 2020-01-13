const mongoose = require('mongoose');
const validator = require('validator');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'User name must have to fill']
   },
   email: {
      type: String,
      required: [true, 'User email must have to fill'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide valid email']
   },
   photo: {
      type: String
   },
   password: {
      type: String,
      required: [true, 'User password must have to fill'],
      minlength: 8
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password']
   }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
