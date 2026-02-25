import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Calendar, Clock, MapPin, CheckCircle, 
  XCircle, Plus, Search, Filter, Grid, List,
  User, BookOpen, MoreVertical, Trash2, X,
  Loader, ChevronDown, ChevronUp, Award,
  Sparkles, Activity, AlertCircle, Phone, Mail,
  HelpCircle, Heart, Target, Zap, Globe,
  Coffee, Music, Code, Palette, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    pending: { 
      icon: Clock, 
      text: 'Pending', 
      color: 'text-yellow-600 dark:text-yellow-400', 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    approved: { 
      icon: CheckCircle, 
      text: 'Approved', 
      color: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800'
    },
    rejected: { 
      icon: XCircle, 
      text: 'Rejected', 
      color: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800'
    }
  };
  const { icon: Icon, text, color, bg, border } = config[status] || config.pending;
  
  return (
    <span className={`${bg} ${color} ${border} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-sm border`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {text}
    </span>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, eventTitle }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle className="w-10 h-10 text-red-500" />
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-800 dark:text-white mb-2"
              >
                Delete Registration?
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-400 mb-6"
              >
                Are you sure you want to delete your registration for <span className="font-semibold">"{eventTitle}"</span>? This action cannot be undone.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex space-x-3"
              >
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Delete
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Event Card
const EventCard = ({ event, onRegister, isRegistered, spotsLeft }) => {
  const categoryIcons = {
    'education': BookOpen,
    'tech': Code,
    'art': Palette,
    'music': Music,
    'social': Heart,
    'sports': Target,
    'food': Coffee,
    'other': Globe
  };

  const Icon = categoryIcons[event.category] || Sparkles;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="h-32 bg-gradient-to-r from-[#66b032] to-[#0057a8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        <div className="absolute top-4 left-4 text-white">
          <Icon className="w-8 h-8" />
        </div>
        <div className="absolute bottom-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            spotsLeft > 0 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#66b032] flex-shrink-0" />
            <span>{new Date(event.event_date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[#0057a8] flex-shrink-0" />
            <span>{event.event_time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {event.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {event.current_volunteers || 0}/{event.max_volunteers} volunteers
            </span>
          </div>
          
          {!isRegistered && spotsLeft > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRegister(event)}
              className="px-4 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#66b032]/30 transition-all"
            >
              Register Now
            </motion.button>
          )}
          
          {isRegistered && (
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Registered
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Registration Card
const RegistrationCard = ({ registration, user, onUpdateStatus, onDelete, isAdmin }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const actionMenuRef = useRef(null);

  const isOwnRegistration = user?.id === registration.user_id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#66b032] to-[#0057a8] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {registration.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {registration.event_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {registration.full_name}
                    {isOwnRegistration && (
                      <span className="ml-2 text-[10px] bg-[#66b032]/10 text-[#66b032] px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {registration.availability && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 mr-2 text-[#66b032] flex-shrink-0" />
                    <span className="truncate">{registration.availability}</span>
                  </div>
                )}
                
                {registration.skills && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <Award className="w-4 h-4 mr-2 text-[#0057a8] flex-shrink-0" />
                    <span className="truncate">{registration.skills}</span>
                  </div>
                )}

                {registration.roll_no && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <User className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                    <span className="font-mono">#{registration.roll_no}</span>
                  </div>
                )}

                {registration.course && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <BookOpen className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                    <span>{registration.course}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-gray-700">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(registration.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <StatusBadge status={registration.status} />
              </div>
            </div>

            {/* Actions Menu */}
            {(isAdmin || isOwnRegistration) && (
              <div className="relative ml-4" ref={actionMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </motion.button>
                
                <AnimatePresence>
                  {showActions && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 mb-1">
                            Registration Actions
                          </div>
                          
                          {isAdmin && registration.status === 'pending' && (
                            <>
                              <motion.button
                                whileHover={{ x: 5 }}
                                onClick={() => {
                                  onUpdateStatus(registration.id, 'approved');
                                  setShowActions(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              >
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium block">Approve</span>
                                  <span className="text-xs text-gray-500">Accept registration</span>
                                </div>
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ x: 5 }}
                                onClick={() => {
                                  onUpdateStatus(registration.id, 'rejected');
                                  setShowActions(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-red-600 block">Reject</span>
                                  <span className="text-xs text-gray-500">Decline registration</span>
                                </div>
                              </motion.button>
                            </>
                          )}
                          
                          {isOwnRegistration && (
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                setShowActions(false);
                                setShowDeleteModal(true);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-red-600 block">Delete</span>
                                <span className="text-xs text-gray-500">Cancel registration</span>
                              </div>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(registration.id)}
        eventTitle={registration.event_name}
      />
    </>
  );
};

// Registration Form
const RegistrationForm = ({ onSubmit, onCancel, events, user }) => {
  const [formData, setFormData] = useState({
    event_id: '',
    availability: '',
    skills: '',
    full_name: user?.full_name || user?.username || '',
    roll_no: user?.roll_no || user?.rollNo || '',
    course: user?.course || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const availabilityOptions = [
    'Weekends (Saturday-Sunday)',
    'Weekdays (Monday-Friday)',
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 3 PM)',
    'Evening (3 PM - 6 PM)',
    'Full-time (Any time)'
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.event_id) newErrors.event_id = 'Please select an event';
    }
    
    if (step === 2) {
      if (!formData.availability) newErrors.availability = 'Please select your availability';
      if (!formData.full_name?.trim()) newErrors.full_name = 'Name is required';
    }
    
    if (step === 3) {
      if (!formData.phone && !formData.email) {
        newErrors.contact = 'Please provide at least one contact method';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(3) && validateStep(2) && validateStep(1)) {
      setSubmitting(true);
      await onSubmit(formData);
      setSubmitting(false);
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  const steps = [
    { number: 1, title: 'Select Event', icon: '📅' },
    { number: 2, title: 'Your Details', icon: '👤' },
    { number: 3, title: 'Contact Info', icon: '📞' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Volunteer Registration</h2>
            <p className="text-sm text-gray-500 mt-1">Make a difference in our community</p>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number 
                    ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  <span>{step.icon}</span>
                </div>
                <p className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {step.title}
                </p>
              </div>
              {step.number < steps.length && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step.number 
                    ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8]' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Event */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-3">Select Event *</label>
                <div className="space-y-2">
                  {events.map(event => {
                    const spotsLeft = (event.max_volunteers || 0) - (event.current_volunteers || 0);
                    const isSelected = formData.event_id === event.id;
                    const isFull = spotsLeft <= 0;
                    
                    return (
                      <button
                        key={event.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => {
                          setFormData({ ...formData, event_id: event.id });
                          setErrors({ ...errors, event_id: null });
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isFull
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                            : isSelected
                              ? 'border-[#66b032] bg-[#66b032]/5 dark:bg-[#66b032]/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-[#66b032]/50'
                        } ${errors.event_id && !isSelected ? 'border-red-500' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(event.event_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {event.event_time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span className={`text-sm font-medium ${
                              spotsLeft < 5 ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {spotsLeft} spots
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.event_id && <p className="text-xs text-red-500 mt-1">{errors.event_id}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Your Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => {
                    setFormData({ ...formData, full_name: e.target.value });
                    setErrors({ ...errors, full_name: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.full_name ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  disabled={submitting}
                />
                {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Availability *</label>
                <select
                  value={formData.availability}
                  onChange={(e) => {
                    setFormData({ ...formData, availability: e.target.value });
                    setErrors({ ...errors, availability: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.availability ? 'border-red-500' : ''
                  }`}
                  disabled={submitting}
                >
                  <option value="">Select your availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.availability && <p className="text-xs text-red-500 mt-1">{errors.availability}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills (Optional)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                  placeholder="e.g., Teaching, Technical, Organizing, First Aid"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Roll No (Optional)</label>
                  <input
                    type="text"
                    value={formData.roll_no}
                    onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                    placeholder="e.g., CS-2024-001"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course (Optional)</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                    placeholder="e.g., Computer Science"
                    disabled={submitting}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact Info */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                    placeholder="e.g., +92 300 1234567"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                    placeholder="e.g., you@example.com"
                    disabled={submitting}
                  />
                </div>
              </div>

              {errors.contact && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {errors.contact}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                * At least one contact method (phone or email) is required
              </p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t dark:border-gray-700">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={submitting}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Main Component
const Volunteer = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isAdmin = user?.email === 'admin@saylani.com' || user?.role === 'admin';

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Load events
      const savedEvents = localStorage.getItem('volunteerEvents');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        // Sample events if none exist
        const sampleEvents = [
          {
            id: '1',
            title: 'Community Food Drive',
            description: 'Help distribute food to those in need',
            category: 'food',
            event_date: '2024-03-25',
            event_time: '9:00 AM - 2:00 PM',
            location: 'Community Center',
            max_volunteers: 20,
            current_volunteers: 8,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Tech Workshop for Kids',
            description: 'Teach basic programming to underprivileged children',
            category: 'education',
            event_date: '2024-03-28',
            event_time: '10:00 AM - 1:00 PM',
            location: 'Library Hall',
            max_volunteers: 15,
            current_volunteers: 5,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Campus Cleanup Drive',
            description: 'Help keep our campus clean and green',
            category: 'social',
            event_date: '2024-03-30',
            event_time: '8:00 AM - 11:00 AM',
            location: 'Main Campus',
            max_volunteers: 30,
            current_volunteers: 12,
            created_at: new Date().toISOString()
          }
        ];
        setEvents(sampleEvents);
        localStorage.setItem('volunteerEvents', JSON.stringify(sampleEvents));
      }

      // Load registrations
      const savedRegistrations = localStorage.getItem('volunteerRegistrations');
      if (savedRegistrations) {
        const allRegs = JSON.parse(savedRegistrations);
        // Filter by user if not admin
        if (!isAdmin) {
          setRegistrations(allRegs.filter(reg => reg.user_id === user?.id));
        } else {
          setRegistrations(allRegs);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const saveRegistrations = (newRegistrations) => {
    try {
      localStorage.setItem('volunteerRegistrations', JSON.stringify(newRegistrations));
      // Filter by user if not admin
      if (!isAdmin) {
        setRegistrations(newRegistrations.filter(reg => reg.user_id === user?.id));
      } else {
        setRegistrations(newRegistrations);
      }
    } catch (error) {
      console.error('Error saving registrations:', error);
      toast.error('Failed to save registration');
    }
  };

  const saveEvents = (newEvents) => {
    try {
      localStorage.setItem('volunteerEvents', JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const handleRegister = async (formData) => {
    try {
      const selectedEvent = events.find(e => e.id === formData.event_id);
      
      if (!selectedEvent) {
        toast.error('Event not found');
        return;
      }

      const spotsLeft = (selectedEvent.max_volunteers || 0) - (selectedEvent.current_volunteers || 0);
      if (spotsLeft <= 0) {
        toast.error('No spots left for this event');
        return;
      }

      const newRegistration = {
        id: Date.now().toString(),
        user_id: user?.id,
        full_name: formData.full_name,
        event_name: selectedEvent.title,
        availability: formData.availability,
        skills: formData.skills || '',
        status: 'pending',
        roll_no: formData.roll_no,
        course: formData.course,
        phone: formData.phone,
        email: formData.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Get existing registrations
      const existingRegs = JSON.parse(localStorage.getItem('volunteerRegistrations') || '[]');
      const updatedRegs = [newRegistration, ...existingRegs];
      saveRegistrations(updatedRegs);

      // Update event volunteer count
      const updatedEvents = events.map(event => 
        event.id === formData.event_id 
          ? { ...event, current_volunteers: (event.current_volunteers || 0) + 1 }
          : event
      );
      saveEvents(updatedEvents);

      setShowForm(false);
      toast.success('Registration submitted successfully!');
      
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register');
    }
  };

  const updateStatus = (id, newStatus) => {
    try {
      const existingRegs = JSON.parse(localStorage.getItem('volunteerRegistrations') || '[]');
      const updatedRegs = existingRegs.map(reg => 
        reg.id === id ? { ...reg, status: newStatus, updated_at: new Date().toISOString() } : reg
      );
      saveRegistrations(updatedRegs);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Find the registration to get event info
      const existingRegs = JSON.parse(localStorage.getItem('volunteerRegistrations') || '[]');
      const registration = existingRegs.find(r => r.id === id);
      
      if (!registration) return;

      // Remove registration
      const updatedRegs = existingRegs.filter(reg => reg.id !== id);
      saveRegistrations(updatedRegs);

      // Update event volunteer count
      const event = events.find(e => e.title === registration.event_name);
      if (event) {
        const updatedEvents = events.map(e => 
          e.id === event.id 
            ? { ...e, current_volunteers: Math.max((e.current_volunteers || 0) - 1, 0) }
            : e
        );
        saveEvents(updatedEvents);
      }

      toast.success('Registration deleted successfully');
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error('Failed to delete registration');
    }
  };

  // Check if user is registered for an event
  const isRegisteredForEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return false;
    
    const existingRegs = JSON.parse(localStorage.getItem('volunteerRegistrations') || '[]');
    return existingRegs.some(r => 
      r.event_name === event.title && 
      r.user_id === user?.id && 
      r.status !== 'rejected'
    );
  };

  // Get spots left for an event
  const getSpotsLeft = (event) => {
    return (event.max_volunteers || 0) - (event.current_volunteers || 0);
  };

  // Filter and sort registrations
  const filteredRegistrations = registrations
    .filter(reg => {
      const matchesSearch = reg.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reg.skills?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'all') return matchesSearch;
      if (filter === 'pending') return matchesSearch && reg.status === 'pending';
      if (filter === 'approved') return matchesSearch && reg.status === 'approved';
      if (filter === 'rejected') return matchesSearch && reg.status === 'rejected';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

  // Filter events by category
  const filteredEvents = events
    .filter(event => {
      if (selectedCategory === 'all') return true;
      return event.category === selectedCategory;
    })
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  // Stats
  const totalRegistrations = registrations.length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const totalEvents = events.length;
  const totalSpots = events.reduce((sum, e) => sum + (e.max_volunteers || 0), 0);
  const filledSpots = events.reduce((sum, e) => sum + (e.current_volunteers || 0), 0);

  const categories = [
    { value: 'all', label: 'All Events', icon: Sparkles },
    { value: 'education', label: 'Education', icon: BookOpen },
    { value: 'tech', label: 'Technology', icon: Code },
    { value: 'social', label: 'Social', icon: Heart },
    { value: 'food', label: 'Food Drive', icon: Coffee },
    { value: 'sports', label: 'Sports', icon: Target },
    { value: 'art', label: 'Arts & Culture', icon: Palette },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'other', label: 'Other', icon: Globe }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#66b032] to-[#0057a8] p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 animate-pulse" />
          
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Volunteer Program</h1>
            </div>
            <p className="text-white/90 max-w-2xl">
              Make a difference in our community by volunteering for various events. 
              Every hour you give helps create positive change.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{totalEvents}</p>
                <p className="text-xs text-white/80">Active Events</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{totalRegistrations}</p>
                <p className="text-xs text-white/80">Registrations</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-white/80">Pending</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-xs text-white/80">Approved</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{filledSpots}/{totalSpots}</p>
                <p className="text-xs text-white/80">Spots Filled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>{showForm ? 'Cancel' : 'Register as Volunteer'}</span>
          </button>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <AnimatePresence>
          {showForm && (
            <RegistrationForm 
              onSubmit={handleRegister} 
              onCancel={() => setShowForm(false)} 
              events={events}
              user={user}
            />
          )}
        </AnimatePresence>

        {/* Category Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Browse by Category
          </h2>
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={() => setShowForm(true)}
                isRegistered={isRegisteredForEvent(event.id)}
                spotsLeft={getSpotsLeft(event)}
              />
            ))}
          </div>
        </div>

        {/* Search and Filter for Registrations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            My Registrations
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search registrations by event or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Registrations Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading registrations...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredRegistrations.length > 0 ? (
              <motion.div 
                layout
                className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 lg:grid-cols-2' 
                    : 'grid-cols-1'
                } gap-6`}
              >
                {filteredRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration.id}
                    registration={registration}
                    user={user}
                    onUpdateStatus={updateStatus}
                    onDelete={handleDelete}
                    isAdmin={isAdmin}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
              >
                <div className="max-w-md mx-auto">
                  <Heart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No registrations found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Ready to make a difference? Register for an event today!'}
                  </p>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Register Now
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

export default Volunteer;