// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPasswordLink,
  resetPasswordOtp,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPasswordLink);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPasswordOtp);

module.exports = router;
