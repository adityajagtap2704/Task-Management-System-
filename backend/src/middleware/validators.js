import { body, param, validationResult } from 'express-validator';

// Custom date validator that handles empty strings
const validateDueDate = (value) => {
  // Allow empty string, null, or undefined
  if (!value || value === '') {
    return true;
  }
  
  // Check if it's a valid date
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Check if date is not in the past (allow today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  if (date < today) {
    throw new Error('Due date cannot be in the past');
  }
  
  return true;
};

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
];

// User login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Task creation/update validation
export const validateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .custom(validateDueDate),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  validate
];

// Task update validation (allows partial updates)
export const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .custom(validateDueDate),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  validate
];

// MongoDB ObjectId validation
export const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate
];

export { validate };