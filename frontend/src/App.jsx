import React, { useState, useEffect, createContext, useContext } from 'react';
import { LogIn, LogOut, Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// API Service with proper error handling
const api = {
  async register(data) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },
  
  async login(data) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },
  
  async getTasks(token) {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch tasks' }));
      throw new Error(error.message || 'Failed to fetch tasks');
    }
    return response.json();
  },
  
  async createTask(token, data) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create task' }));
      throw new Error(error.message || 'Failed to create task');
    }
    return response.json();
  },
  
  async updateTask(token, id, data) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update task' }));
      throw new Error(error.message || 'Failed to update task');
    }
    return response.json();
  },
  
  async deleteTask(token, id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete task' }));
      throw new Error(error.message || 'Failed to delete task');
    }
    return response.json();
  },
  
  async getStats(token) {
    const response = await fetch(`${API_URL}/tasks/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch stats' }));
      throw new Error(error.message || 'Failed to fetch stats');
    }
    return response.json();
  }
};

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, [token]);

  const login = (userData, accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}>
      {message}
    </div>
  );
};

// Auth Page
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();

  const showToast = (message, type) => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Client-side validation for registration
      if (!isLogin) {
        if (!formData.name || formData.name.length < 2) {
          showToast('Name must be at least 2 characters', 'error');
          setLoading(false);
          return;
        }
        
        if (!formData.password || formData.password.length < 6) {
          showToast('Password must be at least 6 characters', 'error');
          setLoading(false);
          return;
        }
        
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          showToast('Password must contain uppercase, lowercase, and number', 'error');
          setLoading(false);
          return;
        }
      }

      const payload = isLogin ? 
        { email: formData.email, password: formData.password } : 
        formData;

      const data = isLogin ? 
        await api.login(payload) : 
        await api.register(payload);

      if (data.status === 'success') {
        login(data.data.user, data.data.accessToken);
        showToast(`${isLogin ? 'Login' : 'Registration'} successful!`, 'success');
      } else {
        showToast(data.message || 'Authentication failed', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Task Card
const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(task._id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.description && <p className="text-gray-600 text-sm mb-3">{task.description}</p>}

      <div className="flex gap-2 flex-wrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
          <Clock size={14} />
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

// Task Modal
const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up the form data before sending
    const cleanedData = { ...formData };
    
    // Remove empty dueDate to avoid validation issues
    if (!cleanedData.dueDate || cleanedData.dueDate === '') {
      delete cleanedData.dueDate;
    }
    
    // Remove empty description if it's just whitespace
    if (!cleanedData.description || cleanedData.description.trim() === '') {
      delete cleanedData.description;
    }
    
    onSave(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {task ? 'Update' : 'Create'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const showToast = (message, type) => setToast({ message, type });

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks(token);
      if (data.status === 'success') {
        setTasks(data.data.tasks);
      }
    } catch (error) {
      showToast('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getStats(token);
      if (data.status === 'success') {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchStats();
    }
  }, [token]);

  const handleCreateTask = async (taskData) => {
    try {
      const data = await api.createTask(token, taskData);
      
      if (data.status === 'success') {
        showToast('Task created successfully!', 'success');
        setShowModal(false);
        fetchTasks();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to create task', 'error');
      }
    } catch (error) {
      // Show specific validation errors if available
      if (error.message.includes('Validation failed')) {
        showToast('Please check your input and try again', 'error');
      } else {
        showToast(error.message || 'Network error', 'error');
      }
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const data = await api.updateTask(token, editingTask._id, taskData);
      
      if (data.status === 'success') {
        showToast('Task updated successfully!', 'success');
        setShowModal(false);
        setEditingTask(null);
        fetchTasks();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to update task', 'error');
      }
    } catch (error) {
      // Show specific validation errors if available
      if (error.message.includes('Validation failed')) {
        showToast('Please check your input and try again', 'error');
      } else {
        showToast(error.message || 'Network error', 'error');
      }
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const data = await api.deleteTask(token, id);
      
      if (data.status === 'success') {
        showToast('Task deleted successfully!', 'success');
        fetchTasks();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to delete task', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{user?.role}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <AlertCircle className="text-blue-500" size={40} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="text-yellow-500" size={40} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <AlertCircle className="text-blue-500" size={40} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="text-green-500" size={40} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {['all', 'pending', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                } hover:shadow-md transition-shadow`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            <Plus size={20} />
            Create Task
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-12">
                No tasks found. Create your first task!
              </p>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setShowModal(true);
                  }}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        )}

        {showModal && (
          <TaskModal
            task={editingTask}
            onClose={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
            onSave={editingTask ? handleUpdateTask : handleCreateTask}
          />
        )}
      </div>
    </div>
  );
};

// Main App
const App = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthPage />;
};

// Root
export default function TaskManagementApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}