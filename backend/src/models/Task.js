import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: 'Status must be either pending, in-progress, or completed'
    },
    default: 'pending'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= new Date();
      },
      message: 'Due date cannot be in the past'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must belong to a user']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ dueDate: 1 });

// Middleware to update completedAt when status changes to completed
taskSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    this.isCompleted = true;
  } else if (this.status !== 'completed') {
    this.completedAt = null;
    this.isCompleted = false;
  }
  next();
});

// Static method to get user statistics
taskSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    total: stats.reduce((acc, curr) => acc + curr.count, 0),
    pending: stats.find(s => s._id === 'pending')?.count || 0,
    inProgress: stats.find(s => s._id === 'in-progress')?.count || 0,
    completed: stats.find(s => s._id === 'completed')?.count || 0
  };
};

const Task = mongoose.model('Task', taskSchema);

export default Task;