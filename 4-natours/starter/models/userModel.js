const crypto = require('crypto');
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
      type: String,
      default: 'default.jpg'
   },
   role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
   },
   password: {
      type: String,
      required: [true, 'User password must have to fill'],
      minlength: 8,
      select: false
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
   },
   passwordUpdatedAt: Date,
   passwordResetToken: String,
   passwordResetExpires: Date,
   active: {
      type: Boolean,
      default: true
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

userSchema.pre('save', async function(next) {
   if (!this.isModified('password') || this.isNew) return next();

   // NOTE Put 1s backward to passwordUpdatedAt property to assign a valid token for sign in because new passwordUpdatedAt has assign more first than token
   this.passwordUpdatedAt = Date.now() - 1000;
   next();
});

userSchema.pre(/^find/, async function(next) {
   // NOTE return user with active != false
   this.find({ active: { $ne: false } });
   next();
});

userSchema.methods.correctPassword = async function(
   candidatePassword,
   userPassword
) {
   return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordUpdatedAfterLogin = async function(
   JWTTimestamp
) {
   if (this.passwordUpdatedAt) {
      const changedTimestamp = parseInt(
         this.passwordUpdatedAt.getTime() / 1000,
         10
      );

      console.log(changedTimestamp, JWTTimestamp);

      // If true, then password detected changed, and throw error
      return JWTTimestamp < changedTimestamp;
   }

   return false;
};

userSchema.methods.createPasswordResetToken = async function() {
   const resetToken = crypto.randomBytes(32).toString('hex');

   this.passwordResetToken = await crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

   // await console.log(resetToken, this.passwordResetToken);

   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
