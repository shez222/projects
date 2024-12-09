// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import crypto module

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: '', // URL or path to the profile image
    },
    coverImage: {
      type: String,
      default: '', // URL or path to the cover image
    },
    phone: {
      type: String,
      default: '', // User's phone number
    },
    address: {
      type: String,
      default: '', // User's address
    },
    purchasesCount: {
      type: Number,
      default: 0, // Number of purchases made by the user
    },
    reviewsCount: {
      type: Number,
      default: 0, // Number of reviews made by the user
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
  },
  {
    // Adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire time (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Method to generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Method to increment purchasesCount
userSchema.methods.incrementPurchases = async function () {
  this.purchasesCount += 1;
  await this.save();
};

// Method to decrement purchasesCount
userSchema.methods.decrementPurchases = async function () {
  if (this.purchasesCount > 0) {
    this.purchasesCount -= 1;
    await this.save();
  }
};

// Method to increment reviewsCount
userSchema.methods.incrementReviews = async function () {
  this.reviewsCount += 1;
  await this.save();
};

// Method to decrement reviewsCount
userSchema.methods.decrementReviews = async function () {
  if (this.reviewsCount > 0) {
    this.reviewsCount -= 1;
    await this.save();
  }
};

module.exports = mongoose.model('User', userSchema);

















// // models/User.js

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto'); // Import crypto module

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Please add a name'],
//       trim: true,
//       maxlength: [50, 'Name can not be more than 50 characters'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Please add an email'],
//       unique: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         'Please add a valid email',
//       ],
//     },
//     password: {
//       type: String,
//       required: [true, 'Please add a password'],
//       minlength: 6,
//       select: false, // Do not return password by default
//     },
//     role: {
//       type: String,
//       // enum: ['admin'],
//       // default: 'user',
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//     otp: String,
//     otpExpire: Date,
//   },
//   {
//     // Adds createdAt and updatedAt fields
//     timestamps: true,
//   }
// );

// // Encrypt password using bcrypt before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
// // Method to generate and hash password token
// userSchema.methods.getResetPasswordToken = function () {
//   // Generate token
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   // Hash token and set to resetPasswordToken field
//   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//   // Set expire time (e.g., 10 minutes)
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };
// userSchema.methods.generateOTP = function () {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//   this.otp = crypto.createHash('sha256').update(otp).digest('hex');
//   this.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//   return otp;
// };

// module.exports = mongoose.model('User', userSchema);
