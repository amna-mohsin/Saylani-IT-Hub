import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Package, AlertCircle, Users, BookOpen,
  Clock, CheckCircle, XCircle, Activity,
  Calendar, Award, BarChart3, Target,
  ChevronRight, TrendingUp, Bell, Settings,
  User, LogOut, Menu, Sun, Moon,
  Sparkles, Heart, Share2, MessageCircle,
  Star, Gift, Zap, Shield, Globe, Coffee,
  X, Plus, Edit, Trash2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Create Event Modal Component
const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    capacity: 50,
    category: 'workshop'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically save to your database
      // For now, we'll simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Event created successfully!');
      onEventCreated(formData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        capacity: 50,
        category: 'workshop'
      });
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="relative p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Event</h2>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                placeholder="Describe your event"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                placeholder="Event location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="social">Social</option>
                  <option value="academic">Academic</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#66b032]/20 to-[#0057a8]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-bold text-sm shadow-lg transform group-hover:scale-105 transition-transform duration-300">
          {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-2 border-2 border-white dark:border-gray-800" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#66b032]/10 to-[#0057a8]/10" />
              <div className="relative p-4 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#66b032]/10 hover:to-[#0057a8]/10 rounded-xl transition-all duration-300 w-full group"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-2 rounded-lg bg-[#66b032]/10 group-hover:bg-[#66b032]/20 transition-colors duration-300">
                  <User className="w-4 h-4 text-[#66b032]" />
                </div>
                <span className="text-sm font-medium">View Profile</span>
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#66b032]/10 hover:to-[#0057a8]/10 rounded-xl transition-all duration-300 w-full group"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-2 rounded-lg bg-[#0057a8]/10 group-hover:bg-[#0057a8]/20 transition-colors duration-300">
                  <Settings className="w-4 h-4 text-[#0057a8]" />
                </div>
                <span className="text-sm font-medium">Settings</span>
              </Link>
              
              <div className="border-t dark:border-gray-700 my-2" />
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 w-full group"
              >
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/30 transition-colors duration-300">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Stat Card with Link
const StatCard = ({ icon: Icon, label, value, change, color, bgColor, index, linkTo }) => {
  const isPositive = change.startsWith('+');
  
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#66b032]/0 via-[#66b032]/5 to-[#0057a8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%] bg-[length:200%_100%]" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
              isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}
          >
            <TrendingUp className={`w-3 h-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span>{change}</span>
          </motion.div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#66b032]/5 to-[#0057a8]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{CardContent}</Link>;
  }

  return CardContent;
};

// Enhanced Progress Ring
const ProgressRing = ({ progress, size = 100, color = "#66b032", label }) => {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center group">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#66b032]/20 to-[#0057a8]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <svg className="transform -rotate-90 relative z-10" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-2xl font-bold text-gray-800 dark:text-white"
          >
            {normalizedProgress}%
          </motion.span>
        </div>
      </div>
      {label && (
        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
};

// Enhanced Activity Timeline
const ActivityTimeline = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const IconComponent = activity.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="group relative flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
          >
            {/* Timeline connector */}
            {index < activities.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-12 bg-gradient-to-b from-[#66b032] to-[#0057a8] opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            )}
            
            <div className={`relative w-10 h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className={`w-5 h-5 ${activity.color}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{activity.title}</p>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${activity.statusColor}`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{activity.description}</p>
              <p className="text-[10px] text-gray-400">{activity.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 group"
  >
    <div className={`p-3 rounded-xl ${color.bg} mb-2 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-5 h-5 ${color.text}`} />
    </div>
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
  </motion.button>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    complaints: 0,
    resolvedComplaints: 0,
    pendingItems: 0,
    activeComplaints: 0,
    volunteers: 0,
    notes: 0,
    notifications: 3
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Real Data Fetching
      const { data: lostItems } = await supabase.from('lost_items').select('*').eq('reporter_email', user?.email);
      const { data: complaints } = await supabase.from('complaints').select('*').eq('reporter_email', user?.email);
      const { data: volunteers } = await supabase.from('volunteers').select('*').eq('email', user?.email);
      const { data: notes } = await supabase.from('notes').select('*').eq('author_email', user?.email);

      // --- FAKE DATA MERGING FOR VISUALS ---
      const lostCount = (lostItems?.filter(i => i.type === 'lost').length || 0) + 12;
      const foundCount = (lostItems?.filter(i => i.type === 'found').length || 0) + 8;
      const complaintCount = (complaints?.length || 0) + 5;
      const resolvedCount = (complaints?.filter(c => c.status === 'resolved').length || 0) + 4;

      setStats({
        lostItems: lostCount,
        foundItems: foundCount,
        complaints: complaintCount,
        resolvedComplaints: resolvedCount,
        pendingItems: (lostItems?.filter(i => i.status === 'pending').length || 0) + 3,
        activeComplaints: (complaints?.filter(c => c.status !== 'resolved').length || 0) + 1,
        volunteers: (volunteers?.length || 0) + 24,
        notes: (notes?.length || 0) + 7,
        notifications: 3
      });

      // Populate Activities
      const demoActivities = [
        {
          icon: Package,
          title: 'iPhone 13 Found',
          description: 'Matched with your lost report',
          time: '2 hours ago',
          status: 'Matched',
          statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          color: 'text-[#66b032]',
          bgColor: 'bg-[#66b032]/10'
        },
        {
          icon: AlertCircle,
          title: 'Water Cooler Issue',
          description: 'Maintenance team assigned',
          time: '5 hours ago',
          status: 'In Progress',
          statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          color: 'text-[#0057a8]',
          bgColor: 'bg-[#0057a8]/10'
        },
        {
          icon: Users,
          title: 'Volunteer Shift',
          description: 'Checked in for IT Workshop',
          time: 'Yesterday',
          status: 'Completed',
          statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10'
        }
      ];

      setRecentActivities(demoActivities);

      // Demo Notes
      setRecentNotes([
        {
          id: 1,
          title: "Project Meeting Notes",
          preview: "Discussed UI improvements and timeline for the new dashboard features...",
          date: "2 hours ago",
          category: "Work",
          author: user?.full_name || "You"
        },
        {
          id: 2,
          title: "Study Group Session",
          preview: "Reviewed React hooks, state management, and practiced with useReducer...",
          date: "Yesterday",
          category: "Academic",
          author: user?.full_name || "You"
        },
        {
          id: 3,
          title: "Volunteer Training",
          preview: "Learned about campus safety protocols and emergency response procedures...",
          date: "2 days ago",
          category: "Volunteer",
          author: user?.full_name || "You"
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEventCreated = (newEvent) => {
    toast.success(`Event "${newEvent.title}" created successfully!`);
    // Here you would typically add the event to your state/database
  };

  const completionRate = stats.complaints > 0 ? Math.round((stats.resolvedComplaints / stats.complaints) * 100) : 85;
  const foundRate = stats.lostItems > 0 ? Math.round((stats.foundItems / stats.lostItems) * 100) : 72;

  const statCards = [
    { icon: Package, label: 'Lost Items', value: stats.lostItems, change: '+12%', color: 'text-[#66b032]', bgColor: 'bg-[#66b032]/10', linkTo: '/lost-found' },
    { icon: Target, label: 'Found Items', value: stats.foundItems, change: '+5%', color: 'text-blue-500', bgColor: 'bg-blue-500/10', linkTo: '/lost-found?tab=found' },
    { icon: AlertCircle, label: 'Complaints', value: stats.complaints, change: '+2', color: 'text-[#0057a8]', bgColor: 'bg-[#0057a8]/10', linkTo: '/complaints' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolvedComplaints, change: '+95%', color: 'text-green-500', bgColor: 'bg-green-500/10', linkTo: '/complaints?status=resolved' },
    { icon: Clock, label: 'Pending Items', value: stats.pendingItems, change: '-2', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', linkTo: '/lost-found?status=pending' },
    { icon: Activity, label: 'Active Complaints', value: stats.activeComplaints, change: 'Stable', color: 'text-orange-500', bgColor: 'bg-orange-500/10', linkTo: '/complaints?status=active' },
    { icon: Users, label: 'Volunteer Hours', value: stats.volunteers, change: '+15h', color: 'text-purple-500', bgColor: 'bg-purple-500/10', linkTo: '/volunteer' },
    { icon: BookOpen, label: 'Notes', value: stats.notes, change: '+3', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', linkTo: '/notes' },
  ];

  const quickActions = [
    { icon: Package, label: 'Report Lost', color: { bg: 'bg-[#66b032]/10', text: 'text-[#66b032]' }, onClick: () => navigate('/lost-found') },
    { icon: AlertCircle, label: 'File Complaint', color: { bg: 'bg-[#0057a8]/10', text: 'text-[#0057a8]' }, onClick: () => navigate('/complaints') },
    { icon: Users, label: 'Volunteer', color: { bg: 'bg-purple-500/10', text: 'text-purple-500' }, onClick: () => navigate('/volunteer') },
    { icon: BookOpen, label: 'Notes', color: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' }, onClick: () => navigate('/notes') },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
          {/* Animated Logo Container */}
          <div className="relative">
            {/* Pulsing background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#66b032]/20 to-[#0057a8]/20 blur-3xl animate-pulse" />
            
            {/* Rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-t-[#66b032] border-r-[#0057a8] border-b-[#66b032] border-l-[#0057a8]"
            />
            
            {/* Inner rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-dashed border-[#66b032]/30"
            />
            
            {/* Center logo */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-45">
                <div className="transform -rotate-45">
                  <img 
                    src="/icons/favicon.png" 
                    alt="Loading..." 
                    className="w-12 h-12 object-contain" 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Loading text with gradient */}
          <motion.div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-[#66b032] to-[#0057a8] bg-clip-text text-transparent"
            >
              Loading your dashboard
            </motion.p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-500 dark:text-gray-400 mt-2"
            >
              Please wait while we prepare your personalized experience...
            </motion.p>
          </motion.div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [-10, 0, -10] }}
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-[#66b032] to-[#0057a8]"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onEventCreated={handleEventCreated}
      />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-8"
      >
        {/* Enhanced Welcome Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#66b032] via-[#66b032]/90 to-[#0057a8] p-8"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [Math.random() * 400, Math.random() * 400],
                y: [Math.random() * 200, Math.random() * 200],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
          
          <div className="relative flex items-center justify-between">
            <div className="text-white">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 mb-3"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">{greeting}</span>
              </motion.div>
              
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                Welcome back, {user?.full_name || user?.username || 'User'}!
              </motion.h1>
              
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 max-w-2xl"
              >
                Your campus community is thriving. Here's what's happening around you today.
              </motion.p>

              {/* Quick stats */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-6 mt-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs opacity-80">Activity Score</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs opacity-80">Active Users</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl" />
                <Award className="w-32 h-32 text-white/30 relative z-10" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.slice(0, 4).map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>

        {/* Progress Overview and Activity Trends */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Rings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Success Metrics</h2>
            <div className="space-y-8">
              <ProgressRing progress={foundRate} color="#66b032" label="Recovery Rate" />
              <ProgressRing progress={completionRate} color="#0057a8" label="Resolution Rate" />
            </div>
          </motion.div>

          {/* Activity Trends */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Activity Trends</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Last 30 days</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Heart className="w-4 h-4 text-[#66b032] mr-2" />
                    Community Engagement
                  </span>
                  <span className="font-bold text-[#66b032]">92%</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `92%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative h-full bg-gradient-to-r from-[#66b032] to-[#88d64a] rounded-full"
                  >
                    <motion.div
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-20 bg-white/20 skew-x-12"
                    />
                  </motion.div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Zap className="w-4 h-4 text-[#0057a8] mr-2" />
                    Volunteer Participation
                  </span>
                  <span className="font-bold text-[#0057a8]">78%</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `78%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="relative h-full bg-gradient-to-r from-[#0057a8] to-blue-400 rounded-full"
                  >
                    <motion.div
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.2 }}
                      className="absolute inset-0 w-20 bg-white/20 skew-x-12"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Trend indicators */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-xs text-gray-500">Weekly Active</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">1,247</p>
                <p className="text-xs text-green-600">↑ 12% from last week</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-xs text-gray-500">Avg. Response</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">2.4h</p>
                <p className="text-xs text-green-600">↓ 30min faster</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity and Notes */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
              <Link 
                to="/notifications" 
                className="group flex items-center space-x-1 text-sm text-[#66b032] hover:text-[#66b032]/80 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <ActivityTimeline activities={recentActivities} />
          </motion.div>

          {/* Recent Notes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Notes</h2>
              <Link 
                to="/notes" 
                className="group flex items-center space-x-1 text-sm text-[#66b032] hover:text-[#66b032]/80 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  whileHover={{ x: 5 }}
                  className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white">{note.title}</h4>
                    <span className="px-2 py-1 bg-[#66b032]/10 text-[#66b032] text-xs rounded-lg">
                      {note.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{note.preview}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400">{note.date}</p>
                    <p className="text-[10px] text-gray-400">by {note.author}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Create note button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/notes')}
              className="w-full mt-6 py-3 bg-gradient-to-r from-[#66b032]/10 to-[#0057a8]/10 rounded-xl text-sm font-medium text-[#66b032] hover:from-[#66b032]/20 hover:to-[#0057a8]/20 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Lower Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.slice(4, 8).map((stat, index) => (
            <StatCard key={index + 4} {...stat} index={index + 4} />
          ))}
        </div>

        {/* Community Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Community Impact</h2>
            <Globe className="w-5 h-5 text-[#66b032]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#66b032]">156</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Items Recovered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0057a8]">89</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complaints Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">24</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Volunteers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">42</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notes Created</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;