import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User, Bell, Shield, Moon, Sun, Globe,
  Mail, Phone, Lock, Eye, EyeOff, Save,
  Loader, CheckCircle, XCircle, AlertCircle,
  Camera, Upload, Trash2, LogOut, Key,
  Settings as SettingsIcon, Palette, Languages,
  Volume2, Vibrate, Wifi, Database, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    rollNo: user?.roll_no || user?.rollNo || '',
    course: user?.course || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    complaintUpdates: true,
    volunteerUpdates: true,
    lostFoundUpdates: true,
    eventReminders: true,
    marketingEmails: false
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showCourse: true,
    showRollNo: true,
    allowMessages: 'friends',
    activityStatus: true
  });

  // App settings
  const [appSettings, setAppSettings] = useState({
    language: 'en',
    timezone: 'Asia/Karachi',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    soundEnabled: true,
    vibrationEnabled: true,
    autoSave: true,
    reduceAnimations: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => 
        u.email === user.email 
          ? { 
              ...u, 
              full_name: profileForm.fullName,
              username: profileForm.username,
              phone: profileForm.phone,
              roll_no: profileForm.rollNo,
              course: profileForm.course,
              bio: profileForm.bio
            }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deleted successfully');
      // Implement actual delete logic
    }
  };

  const handleExportData = () => {
    const userData = {
      profile: profileForm,
      settings: {
        notifications: notificationSettings,
        privacy: privacySettings,
        app: appSettings
      }
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString()}.json`;
    a.click();
    
    toast.success('Data exported successfully!');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-24">
              <div className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t dark:border-gray-700 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Profile Information</h2>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#66b032] to-[#0057a8] flex items-center justify-center text-white text-3xl font-bold">
                            {profileForm.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                          </div>
                          <button
                            type="button"
                            className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">{profileForm.fullName || user?.full_name}</h3>
                          <p className="text-sm text-gray-500">{profileForm.email || user?.email}</p>
                          <button
                            type="button"
                            className="mt-2 text-sm text-[#66b032] hover:underline flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Upload new photo
                          </button>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Username</label>
                          <input
                            type="text"
                            value={profileForm.username}
                            onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                            placeholder="+92 XXX XXXXXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Roll Number</label>
                          <input
                            type="text"
                            value={profileForm.rollNo}
                            onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                            placeholder="e.g., CS-2024-001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Course</label>
                          <input
                            type="text"
                            value={profileForm.course}
                            onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows="3"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                          placeholder="Tell us a little about yourself..."
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                        <button
                          type="button"
                          className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
                        >
                          {loading ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h2>
                    
                    {/* Change Password */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">Export Your Data</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Download all your personal data</p>
                          </div>
                          <button
                            onClick={handleExportData}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-red-600">Delete Account</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all data</p>
                          </div>
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      {/* Notification Channels */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Notification Channels</h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Mail className="w-5 h-5 text-[#66b032]" />
                              <span className="text-sm font-medium">Email Notifications</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailNotifications}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>

                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Bell className="w-5 h-5 text-[#0057a8]" />
                              <span className="text-sm font-medium">Push Notifications</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.pushNotifications}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>

                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-purple-500" />
                              <span className="text-sm font-medium">SMS Notifications</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.smsNotifications}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Update Types */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Receive Updates For</h3>
                        <div className="space-y-3">
                          {[
                            { id: 'complaintUpdates', label: 'Complaint Status Updates', icon: AlertCircle },
                            { id: 'volunteerUpdates', label: 'Volunteer Opportunities', icon: User },
                            { id: 'lostFoundUpdates', label: 'Lost & Found Matches', icon: Eye },
                            { id: 'eventReminders', label: 'Event Reminders', icon: Bell },
                            { id: 'marketingEmails', label: 'Marketing & Promotions', icon: Mail }
                          ].map(item => {
                            const Icon = item.icon;
                            return (
                              <label key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-5 h-5 text-gray-500" />
                                  <span className="text-sm">{item.label}</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[item.id]}
                                  onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.id]: e.target.checked })}
                                  className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                        <button
                          onClick={() => toast.success('Notification settings saved!')}
                          className="px-6 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-6">
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Profile Visibility</h3>
                        <div className="space-y-2">
                          {['public', 'friends', 'private'].map(option => (
                            <label key={option} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option}
                                checked={privacySettings.profileVisibility === option}
                                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                                className="w-4 h-4 text-[#66b032] focus:ring-[#66b032]"
                              />
                              <span className="text-sm capitalize">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Information Visibility */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Information Visibility</h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Show Email Address</span>
                            <input
                              type="checkbox"
                              checked={privacySettings.showEmail}
                              onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Show Phone Number</span>
                            <input
                              type="checkbox"
                              checked={privacySettings.showPhone}
                              onChange={(e) => setPrivacySettings({ ...privacySettings, showPhone: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Show Course Information</span>
                            <input
                              type="checkbox"
                              checked={privacySettings.showCourse}
                              onChange={(e) => setPrivacySettings({ ...privacySettings, showCourse: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Show Roll Number</span>
                            <input
                              type="checkbox"
                              checked={privacySettings.showRollNo}
                              onChange={(e) => setPrivacySettings({ ...privacySettings, showRollNo: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Messaging */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Messaging</h3>
                        <select
                          value={privacySettings.allowMessages}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, allowMessages: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                        >
                          <option value="everyone">Everyone</option>
                          <option value="friends">Friends Only</option>
                          <option value="none">No One</option>
                        </select>
                      </div>

                      <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                        <button
                          onClick={() => toast.success('Privacy settings saved!')}
                          className="px-6 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Save Privacy Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Appearance</h2>
                    
                    <div className="space-y-6">
                      {/* Theme */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Theme</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => !darkMode && toggleDarkMode()}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              !darkMode 
                                ? 'border-[#66b032] bg-[#66b032]/5' 
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Sun className="w-5 h-5 text-yellow-500" />
                              <span className="font-medium">Light Mode</span>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => darkMode && toggleDarkMode()}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              darkMode 
                                ? 'border-[#66b032] bg-[#66b032]/5' 
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                              <span className="font-medium">Dark Mode</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select
                          value={appSettings.language}
                          onChange={(e) => setAppSettings({ ...appSettings, language: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                        >
                          <option value="en">English</option>
                          <option value="ur">Urdu</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>

                      {/* Date & Time Format */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date Format</label>
                          <select
                            value={appSettings.dateFormat}
                            onChange={(e) => setAppSettings({ ...appSettings, dateFormat: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Time Format</label>
                          <select
                            value={appSettings.timeFormat}
                            onChange={(e) => setAppSettings({ ...appSettings, timeFormat: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                          >
                            <option value="12h">12-hour</option>
                            <option value="24h">24-hour</option>
                          </select>
                        </div>
                      </div>

                      {/* Other Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Other Settings</h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Sound Effects</span>
                            <input
                              type="checkbox"
                              checked={appSettings.soundEnabled}
                              onChange={(e) => setAppSettings({ ...appSettings, soundEnabled: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Vibration</span>
                            <input
                              type="checkbox"
                              checked={appSettings.vibrationEnabled}
                              onChange={(e) => setAppSettings({ ...appSettings, vibrationEnabled: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Auto-save Notes</span>
                            <input
                              type="checkbox"
                              checked={appSettings.autoSave}
                              onChange={(e) => setAppSettings({ ...appSettings, autoSave: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Reduce Animations</span>
                            <input
                              type="checkbox"
                              checked={appSettings.reduceAnimations}
                              onChange={(e) => setAppSettings({ ...appSettings, reduceAnimations: e.target.checked })}
                              className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                        <button
                          onClick={() => toast.success('Appearance settings saved!')}
                          className="px-6 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Save Appearance
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Preferences</h2>
                    
                    <div className="space-y-6">
                      {/* General Preferences */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">General</h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Default Dashboard View</span>
                            <select className="px-3 py-1 bg-white dark:bg-gray-800 border rounded-lg">
                              <option>Grid</option>
                              <option>List</option>
                            </select>
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Items per page</span>
                            <select className="px-3 py-1 bg-white dark:bg-gray-800 border rounded-lg">
                              <option>10</option>
                              <option>20</option>
                              <option>50</option>
                            </select>
                          </label>
                        </div>
                      </div>

                      {/* Data & Storage */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Data & Storage</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Storage Used</span>
                              <span className="text-sm text-gray-500">2.3 MB / 100 MB</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div className="h-full bg-[#66b032] rounded-full" style={{ width: '2.3%' }} />
                            </div>
                          </div>

                          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <span className="text-sm">Clear Cache</span>
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>

                          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <span className="text-sm">Download All Data</span>
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Accessibility */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Accessibility</h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">High Contrast</span>
                            <input type="checkbox" className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]" />
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Large Text</span>
                            <input type="checkbox" className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]" />
                          </label>
                          
                          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm">Screen Reader Optimized</span>
                            <input type="checkbox" className="w-5 h-5 text-[#66b032] rounded focus:ring-[#66b032]" />
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                        <button
                          onClick={() => toast.success('Preferences saved!')}
                          className="px-6 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;