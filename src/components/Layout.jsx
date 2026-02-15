import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, X, Home, Package, AlertCircle, Users, 
  BookOpen, Settings, LogOut, Bell, Search,
  Sun, Moon, UserCircle, ChevronRight, Award,
  BarChart3, Activity, Calendar, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifs = notifs.filter(n => n.userId === user?.email);
    setNotifications(userNotifs);
  }, [user]);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-[#66b032]' },
    { icon: Package, label: 'Lost & Found', path: '/lost-found', color: 'text-[#0057a8]' },
    { icon: AlertCircle, label: 'Complaints', path: '/complaints', color: 'text-red-500' },
    { icon: Users, label: 'Volunteer', path: '/volunteer', color: 'text-purple-500' },
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
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <motion.div 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#66b032] to-[#0057a8] rounded-xl flex items-center justify-center shadow-lg">
                        <img src="/icons/logo.svg" alt="Logo" className="w-6 h-6 invert" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-gray-800 dark:text-white">Saylani Portal</h2>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Lost & Found</p>
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

              {/* User Profile */}
              <Link to="/profile" className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
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
                              ? 'bg-gradient-to-r from-[#66b032]/20 to-[#0057a8]/20 text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#66b032]/0 to-[#0057a8]/0 group-hover:from-[#66b032]/10 group-hover:to-[#0057a8]/10 transition-all duration-300" />
                          <item.icon className={`w-4 h-4 ${item.color} relative z-10`} />
                          <span className="flex-1 font-medium relative z-10">{item.label}</span>
                          {item.label === 'Notifications' && notifications.length > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center relative z-10"
                            >
                              {notifications.length}
                            </motion.span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Logout Button */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
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

      {/* Main Content */}
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
              
              {/* Page Title */}
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

              {/* User Menu */}
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

                {/* Dropdown Menu */}
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
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/profile');
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <UserCircle className="w-4 h-4 text-[#66b032]" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">Profile</span>
                          </button>

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