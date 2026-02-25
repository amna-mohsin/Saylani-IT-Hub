import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, X, Home, Package, AlertCircle, Users, 
  BookOpen, Settings, LogOut, Bell, Search,
  Sun, Moon, UserCircle, ChevronRight, Award,
  BarChart3, Activity, Calendar, ChevronDown, FileText,
  CheckCircle, XCircle, Clock, MessageSquare, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== NOTIFICATION DROPDOWN COMPONENT ====================
// ==================== NOTIFICATION DROPDOWN COMPONENT ====================
const NotificationDropdown = ({ notifications, onViewAll, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-[#66b032]" />;
    }
  };

  // Get background color based on type
  const getNotificationBg = (type) => {
    switch(type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'error': return 'bg-red-50 dark:bg-red-900/20';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20';
      default: return 'bg-[#66b032]/10 dark:bg-[#66b032]/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell - NOW DIRECTLY LINKS TO NOTIFICATIONS PAGE */}
      <button
        onClick={() => {
          navigate('/notifications'); // Direct navigation to notifications page
        }}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#66b032] transition-colors" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-gray-800"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Menu - Optional: You can keep this or remove it */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-[#66b032]/10 to-[#0057a8]/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  <Bell className="w-4 h-4 mr-2 text-[#66b032]" />
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification, index) => (
                  <motion.div
                    key={notification.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-[#66b032]/5 dark:bg-[#66b032]/10' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read && onMarkAsRead) {
                        onMarkAsRead(notification.id);
                      }
                      if (notification.link) {
                        navigate(notification.link);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-full ${getNotificationBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-gray-400">
                            {notification.time || 'Just now'}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#66b032] rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    We'll notify you when something arrives
                  </p>
                </div>
              )}
            </div>

            {/* Footer - View All button links to Notifications page */}
            {notifications.length > 0 && (
              <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={() => {
                    onViewAll();
                    setIsOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full py-2 text-sm text-[#66b032] hover:text-[#0057a8] font-medium text-center transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== LAYOUT COMPONENT ====================
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load notifications
  useEffect(() => {
    const loadNotifications = () => {
      // Try to load from localStorage first
      const savedNotifs = localStorage.getItem('userNotifications');
      if (savedNotifs) {
        const allNotifs = JSON.parse(savedNotifs);
        // Filter for current user
        const userNotifs = allNotifs.filter(n => n.userId === user?.id || n.userEmail === user?.email);
        setNotifications(userNotifs);
      } else {
        // Sample notifications for demo
        const sampleNotifs = [
          {
            id: 1,
            type: 'success',
            title: 'Item Found!',
            message: 'Your lost iPhone 13 has been found. Contact the finder to arrange pickup.',
            time: '5 minutes ago',
            read: false,
            link: '/lost-found',
            userId: user?.id,
            userEmail: user?.email
          },
          {
            id: 2,
            type: 'info',
            title: 'Complaint Update',
            message: 'Your complaint about water cooler issue is now in progress.',
            time: '2 hours ago',
            read: false,
            link: '/complaints',
            userId: user?.id,
            userEmail: user?.email
          },
          {
            id: 3,
            type: 'warning',
            title: 'Volunteer Approval',
            message: 'Your volunteer application has been approved! Check your email for details.',
            time: '1 day ago',
            read: true,
            link: '/volunteer',
            userId: user?.id,
            userEmail: user?.email
          }
        ];
        setNotifications(sampleNotifs);
      }
    };

    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Mark notification as read
  const handleMarkAsRead = (notificationId) => {
    const updatedNotifs = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifs));
  };

  // Handle view all notifications
  const handleViewAll = () => {
    navigate('/notifications');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-[#66b032]' },
    { icon: Package, label: 'Lost & Found', path: '/lost-found', color: 'text-[#0057a8]' },
    { icon: AlertCircle, label: 'Complaints', path: '/complaints', color: 'text-red-500' },
    { icon: Users, label: 'Volunteer', path: '/volunteer', color: 'text-purple-500' },
    { icon: FileText, label: 'Notes', path: '/notes', color: 'text-yellow-500' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 z-40 h-screen w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-r border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-700 bg-white shadow-lg overflow-hidden">
                        <img 
                          src="/icons/favicon.png" 
                          alt="Saylani Logo" 
                          className="w-9 h-9 object-contain p-0.5" 
                        />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-bold text-gray-800 dark:text-white text-base leading-tight">Saylani Portal</h2>
                      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lost & Found</span>
                    </div>
                  </motion.div>
                  {isMobile && (
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* User Profile - Links to Settings page */}
              <Link to="/settings" className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:scale-105 transition-transform">
                      {user?.full_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-[#66b032] transition-colors truncate">
                      {user?.full_name || user?.username}
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1.5 py-0.5 bg-[#66b032]/20 text-[#66b032] text-[8px] rounded-full">
                        {user?.course || 'Student'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#0057a8]/20 text-[#0057a8] text-[8px] rounded-full">
                        {user?.roll_no || user?.rollNo}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>

              {/* Navigation */}
              <div className="flex-1 px-3 overflow-y-auto">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 p-3">MAIN MENU</p>
                <nav className="space-y-0.5">
                  {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all group relative overflow-hidden text-sm ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#66b032]/20 to-[#0057a8]/20 text-gray-900 dark:text-white font-bold' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#66b032]/0 to-[#0057a8]/0 group-hover:from-[#66b032]/10 group-hover:to-[#0057a8]/10 transition-all duration-300" />
                          <item.icon className={`w-4 h-4 ${item.color} relative z-10`} />
                          <span className="flex-1 font-medium relative z-10">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Logout Button */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group text-sm"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div 
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarOpen && !isMobile ? '256px' : '0' }}
      >
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Welcome back, {user?.full_name || user?.username}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </motion.button>

              {/* Notification Icon with Dropdown - Links to Notifications page */}
              <NotificationDropdown 
                notifications={notifications}
                onViewAll={handleViewAll}
                onMarkAsRead={handleMarkAsRead}
              />

              {/* User Menu - All options now properly linked */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-bold">
                    {user?.full_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                      >
                        <div className="p-3 bg-gradient-to-r from-[#66b032]/10 to-[#0057a8]/10 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.full_name || user?.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>

                        <div className="p-2">
                          {/* View Profile - Links to Settings page */}
                          <button
                            onClick={() => { 
                              setShowUserMenu(false); 
                              navigate('/settings'); 
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <UserCircle className="w-4 h-4 text-[#66b032]" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">View Profile</span>
                          </button>

                          {/* Settings - Links to Settings page */}
                          <button
                            onClick={() => { 
                              setShowUserMenu(false); 
                              navigate('/settings'); 
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4 text-[#0057a8]" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">Settings</span>
                          </button>

                          {/* Divider */}
                          <div className="my-1 border-t dark:border-gray-700"></div>

                          {/* Logout - Added to dropdown */}
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;