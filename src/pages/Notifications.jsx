import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell, Package, AlertCircle, Users, BookOpen,
  Clock, CheckCircle, XCircle, Calendar,
  ChevronRight, Trash2, Check, Filter,
  Mail, MessageSquare, Award, Heart,
  Settings, User, Star, Zap, Download,
  Loader, AlertTriangle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (type) => {
    const icons = {
      'lost_found': Package,
      'complaint': AlertCircle,
      'volunteer': Users,
      'event': Calendar,
      'note': BookOpen,
      'achievement': Award,
      'message': MessageSquare,
      'update': Info,
      'warning': AlertTriangle,
      'success': CheckCircle
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type) => {
    const colors = {
      'lost_found': 'text-[#66b032] bg-[#66b032]/10',
      'complaint': 'text-[#0057a8] bg-[#0057a8]/10',
      'volunteer': 'text-purple-500 bg-purple-500/10',
      'event': 'text-yellow-500 bg-yellow-500/10',
      'note': 'text-blue-500 bg-blue-500/10',
      'achievement': 'text-orange-500 bg-orange-500/10',
      'message': 'text-green-500 bg-green-500/10',
      'update': 'text-gray-500 bg-gray-500/10',
      'warning': 'text-red-500 bg-red-500/10',
      'success': 'text-green-500 bg-green-500/10'
    };
    return colors[type] || 'text-gray-500 bg-gray-500/10';
  };

  const Icon = getIcon(notification.type);
  const iconColorClass = getIconColor(notification.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 border ${
        notification.read 
          ? 'border-gray-100 dark:border-gray-700' 
          : 'border-[#66b032] dark:border-[#66b032]'
      }`}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 w-2 h-2 bg-[#66b032] rounded-full"
        />
      )}

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl ${iconColorClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {notification.message}
                </p>
              </div>
              
              {/* Time */}
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {notification.time}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {notification.date}
              </span>
              {notification.action && (
                <span className="flex items-center text-[#66b032]">
                  <Zap className="w-3 h-3 mr-1" />
                  {notification.action}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-4">
              {!notification.read && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkRead(notification.id)}
                  className="px-3 py-1.5 bg-[#66b032]/10 text-[#66b032] rounded-lg text-xs font-medium hover:bg-[#66b032]/20 transition-all flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark as read
                </motion.button>
              )}
              
              {notification.link && (
                <Link
                  to={notification.link}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center"
                >
                  View details
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(notification.id)}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    setLoading(true);
    try {
      // Load from localStorage or use sample data
      const savedNotifications = localStorage.getItem('userNotifications');
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        // Sample notifications
        const sampleNotifications = [
          {
            id: '1',
            type: 'lost_found',
            title: 'Item Found!',
            message: 'Your lost iPhone 13 has been found. Contact the finder to arrange pickup.',
            time: '5 minutes ago',
            date: '2024-02-25',
            read: false,
            action: 'Matched',
            link: '/lost-found'
          },
          {
            id: '2',
            type: 'complaint',
            title: 'Complaint Update',
            message: 'Your complaint about water cooler issue is now in progress. Maintenance team has been assigned.',
            time: '2 hours ago',
            date: '2024-02-25',
            read: false,
            action: 'In Progress',
            link: '/complaints'
          },
          {
            id: '3',
            type: 'volunteer',
            title: 'Volunteer Approved',
            message: 'Your volunteer application for Tech Workshop has been approved! Check-in at the venue.',
            time: '1 day ago',
            date: '2024-02-24',
            read: true,
            action: 'Approved',
            link: '/volunteer'
          },
          {
            id: '4',
            type: 'event',
            title: 'Upcoming Event',
            message: 'Web Development Workshop starts tomorrow at 2:00 PM in Lab 3.',
            time: '1 day ago',
            date: '2024-02-24',
            read: true,
            action: 'Reminder',
            link: '/volunteer'
          },
          {
            id: '5',
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: 'Congratulations! You have helped recover 5 lost items. You earned the "Campus Hero" badge.',
            time: '3 days ago',
            date: '2024-02-22',
            read: true,
            action: 'New Badge',
            link: '/profile'
          },
          {
            id: '6',
            type: 'note',
            title: 'Study Group Invitation',
            message: 'You have been invited to join the React.js study group. 5 members already joined.',
            time: '4 days ago',
            date: '2024-02-21',
            read: true,
            action: 'Join',
            link: '/notes'
          },
          {
            id: '7',
            type: 'success',
            title: 'Complaint Resolved',
            message: 'Your complaint about AC not working has been marked as resolved. Rate your experience.',
            time: '5 days ago',
            date: '2024-02-20',
            read: true,
            action: 'Resolved',
            link: '/complaints'
          },
          {
            id: '8',
            type: 'warning',
            title: 'Account Security Alert',
            message: 'New login detected from unknown device. If this wasn\'t you, secure your account.',
            time: '1 week ago',
            date: '2024-02-18',
            read: true,
            action: 'Review',
            link: '/settings'
          }
        ];
        
        setNotifications(sampleNotifications);
        localStorage.setItem('userNotifications', JSON.stringify(sampleNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = (id) => {
    try {
      const updated = notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      setNotifications(updated);
      localStorage.setItem('userNotifications', JSON.stringify(updated));
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = () => {
    try {
      const updated = notifications.map(notif => ({ ...notif, read: true }));
      setNotifications(updated);
      localStorage.setItem('userNotifications', JSON.stringify(updated));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const handleDelete = (id) => {
    try {
      const updated = notifications.filter(notif => notif.id !== id);
      setNotifications(updated);
      localStorage.setItem('userNotifications', JSON.stringify(updated));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        setNotifications([]);
        localStorage.setItem('userNotifications', JSON.stringify([]));
        toast.success('All notifications deleted');
      } catch (error) {
        toast.error('Failed to delete notifications');
      }
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(notifications, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString()}.json`;
    a.click();
    toast.success('Notifications exported');
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    if (selectedType !== 'all') return notif.type === selectedType;
    return true;
  });

  // Stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  const notificationTypes = [
    { value: 'all', label: 'All Types', icon: Bell },
    { value: 'lost_found', label: 'Lost & Found', icon: Package },
    { value: 'complaint', label: 'Complaints', icon: AlertCircle },
    { value: 'volunteer', label: 'Volunteer', icon: Users },
    { value: 'event', label: 'Events', icon: Calendar },
    { value: 'note', label: 'Notes', icon: BookOpen },
    { value: 'achievement', label: 'Achievements', icon: Award },
    { value: 'warning', label: 'Alerts', icon: AlertTriangle }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#66b032] to-[#0057a8] p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 animate-pulse" />
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Bell className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Notifications</h1>
                </div>
                <p className="text-white/90 max-w-2xl">
                  Stay updated with your campus activities, alerts, and important announcements.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-xs text-white/80">Unread</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-xs text-white/80">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'read'
                  ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Read
            </button>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            )}
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            {totalCount > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {notificationTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    selectedType === type.value
                      ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
              >
                <div className="max-w-md mx-auto">
                  <Bell className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {filter !== 'all' 
                      ? 'No notifications match your current filter'
                      : 'You\'re all caught up! Check back later for updates.'}
                  </p>
                  {filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      View All Notifications
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;