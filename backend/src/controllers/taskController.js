import Task from '../models/Task.js';

// @desc    Get all tasks for logged-in user
// @route   GET /api/v1/tasks
// @access  Private
export const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Build query
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check if user owns the task or is admin
    if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user._id;

    const task = await Task.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this task'
      });
    }

    // Don't allow changing task owner
    delete req.body.user;

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user task statistics
// @route   GET /api/v1/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.getUserStats(req.user._id);

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};