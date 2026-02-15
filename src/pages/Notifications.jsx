import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle, AlertCircle, Package, Users, XCircle, Clock, Filter, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = storedNotifications.filter(n => n.userId === user?.email);
    setNotifications(userNotifications);
  }, [user]);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedAll = allNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedAll));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedAll = allNotifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updatedAll));
    toast.success('All notifications marked as read');
  };

  const getIcon = (type) => {
    switch(type) {
      case 'lost_found': return <Package className="w-5 h-5 text-saylani-green" />;
      case 'complaint': return <AlertCircle className="w-5 h-5 text-saylani-blue" />;
      case 'volunteer': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved':
      case 'approved':
      case 'found': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-saylani-green" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with your activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-sm focus:outline-none"
              >
                <option value="all">All</option>
                <option value="unread">Unread ({unreadCount})</option>
                <option value="read">Read</option>
              </select>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-saylani-green text-white rounded-lg hover:bg-opacity-90 transition"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                  !notification.read ? 'border-l-4 border-saylani-green' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-saylani-green/10'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {notification.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      {!notification.read && (
                        <span className="text-saylani-green text-xs font-medium">New</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            >
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;