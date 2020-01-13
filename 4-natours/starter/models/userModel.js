const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
      required: [true, 'Please confirm your password'],
      validate: {
         validator: function(el) {
            return el === this.password;
         },
         message: 'Password are not the same'
      }
   }
});

userSchema.pre('save', async function(next) {
   // Run function if password was actualy modified
   if (!this.isModified('password')) return next();

   // Hash the password with 12
   this.password = await bcrypt.hash(this.password, 12);

   // set password confirm with undefined
   this.passwordConfirm = undefined;
   next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
