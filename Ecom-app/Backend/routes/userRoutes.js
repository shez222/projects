// routes/userRoutes.js

const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.route('/me').get(protect, getMe).put(protect, updateMe);

// Admin routes
router
  .route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect,  getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
