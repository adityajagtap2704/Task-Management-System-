import express from 'express';
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../../controllers/taskController.js';
import { validateTask, validateTaskUpdate, validateObjectId } from '../../middleware/validators.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @route   GET /api/v1/tasks/stats
 * @desc    Get task statistics for current user
 * @access  Private
 */
router.get('/stats', getTaskStats);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private
 * @query   status, priority, page, limit, sort
 */
router.get('/', getAllTasks);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create new task
 * @access  Private
 */
router.post('/', validateTask, createTask);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get single task
 * @access  Private
 */
router.get('/:id', validateObjectId, getTask);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id', validateObjectId, validateTaskUpdate, updateTask);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router.delete('/:id', validateObjectId, deleteTask);

export default router;