import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GetStarted = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-saylani-green via-white to-saylani-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <img src="/icons/logo.svg" alt="Saylani Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">Saylani Mass IT Hub</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-20"
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome to{' '}
            <span className="text-saylani-green">Saylani</span>{' '}
            <span className="text-saylani-blue">Mass IT Hub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Your comprehensive campus management portal for students and staff. 
            Report issues, find lost items, volunteer for events, and more.
          </p>
          
          <div className="flex justify-center space-x-4 mb-16">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3 flex items-center">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
            >
              <div className="bg-saylani-green/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-saylani-green" />
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Lost & Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Post lost or found items with images and track their status in real-time
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
            >
              <div className="bg-saylani-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-saylani-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Complaints</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Submit and track campus complaints with our easy-to-use system
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
            >
              <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <GraduationCap className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Volunteer</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Register for campus events and make a difference in our community
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GetStarted;