import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from '../../controllers/userController.js';
import { protect, restrictTo } from '../../middleware/auth.js';
import { validateObjectId } from '../../middleware/validators.js';

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', updateProfile);

// Admin only routes
router.use(restrictTo('admin'));

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get single user
 * @access  Private/Admin
 */
router.get('/:id', validateObjectId, getUser);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/:id', validateObjectId, updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', validateObjectId, deleteUser);

export default router;