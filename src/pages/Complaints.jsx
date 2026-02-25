import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AlertCircle, Clock, CheckCircle, XCircle, 
  Wifi, Zap, Droplets, Wrench, Search, Plus,
  MapPin, User, Calendar, Filter, Grid, List,
  MoreVertical, Phone, Mail, Loader, ChevronDown,
  ChevronUp, Trash2, Camera, X, Package, Edit,
  Eye, Share2, Download, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Priority Badge
const PriorityBadge = ({ priority }) => {
  const config = {
    low: { 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', 
      label: 'Low Priority', 
      icon: Clock,
      bg: 'bg-green-500'
    },
    medium: { 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', 
      label: 'Medium Priority', 
      icon: AlertCircle,
      bg: 'bg-yellow-500'
    },
    high: { 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', 
      label: 'High Priority', 
      icon: AlertCircle,
      bg: 'bg-red-500'
    }
  };
  const { color, label, icon: Icon, bg } = config[priority] || config.medium;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color} flex items-center shadow-sm`}>
      <span className={`w-2 h-2 rounded-full ${bg} mr-1.5 animate-pulse`} />
      {label}
    </span>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    submitted: { 
      icon: Clock, 
      text: 'Submitted', 
      color: 'text-yellow-600 dark:text-yellow-400', 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    'in-progress': { 
      icon: Clock, 
      text: 'In Progress', 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800'
    },
    resolved: { 
      icon: CheckCircle, 
      text: 'Resolved', 
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
  const { icon: Icon, text, color, bg, border } = config[status] || config.submitted;
  
  return (
    <span className={`${bg} ${color} ${border} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-sm border`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {text}
    </span>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, complaintTitle }) => {
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
                Delete Complaint?
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-400 mb-6"
              >
                Are you sure you want to delete this complaint? This action cannot be undone.
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

// Complaint Card
const ComplaintCard = ({ complaint, user, onUpdateStatus, onDelete, index }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const actionMenuRef = useRef(null);

  const categories = [
    { value: 'internet', label: 'Internet Issue', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'electricity', label: 'Electricity Problem', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'water', label: 'Water Issue', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' },
    { value: 'other', label: 'Other', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' }
  ];

  const category = categories.find(c => c.value === complaint.category) || categories[4];
  const CategoryIcon = category.icon;
  const isOwner = user?.id === complaint.user_id;

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
            <div className="flex items-start space-x-4 flex-1">
              <div className={`${category.bg} p-3 rounded-xl flex-shrink-0`}>
                <CategoryIcon className={`w-6 h-6 ${category.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {category.label}
                  </h3>
                  <PriorityBadge priority={complaint.priority} />
                </div>

                <div className="relative">
                  <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${!showFullDescription ? 'line-clamp-2' : ''}`}>
                    {complaint.description}
                  </p>
                  {complaint.description && complaint.description.length > 100 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-xs text-[#66b032] hover:underline flex items-center mt-1 transition-colors"
                    >
                      {showFullDescription ? (
                        <>Show less <ChevronUp className="w-3 h-3 ml-1" /></>
                      ) : (
                        <>Read more <ChevronDown className="w-3 h-3 ml-1" /></>
                      )}
                    </button>
                  )}
                </div>

                {complaint.location && (
                  <div className="flex items-center text-xs text-gray-500 mb-3 group cursor-pointer">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0 group-hover:text-[#66b032] transition-colors" />
                    <span className="truncate group-hover:text-[#66b032] transition-colors">{complaint.location}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-t dark:border-gray-700 pt-3 gap-2">
                  <div className="flex items-center min-w-0">
                    <User className="w-3 h-3 text-[#66b032] mr-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 truncate">{complaint.reporter_name}</span>
                    {isOwner && (
                      <span className="ml-2 text-[10px] bg-[#66b032]/10 text-[#66b032] px-2 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 flex-shrink-0 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(complaint.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Roll No and Course */}
                {(complaint.roll_no || complaint.course) && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {complaint.roll_no && (
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400 font-mono">
                        #{complaint.roll_no}
                      </span>
                    )}
                    {complaint.course && (
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
                        {complaint.course}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 ml-4">
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Actions Bar - Moved outside and made more visible */}
          {isOwner && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center justify-end space-x-2">
              {complaint.status === 'submitted' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(complaint.id, 'in-progress')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Progress
                </motion.button>
              )}
              {complaint.status === 'in-progress' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(complaint.id, 'resolved')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </motion.button>
              )}
              {(complaint.status === 'submitted' || complaint.status === 'in-progress') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(complaint.id, 'rejected')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(complaint.id)}
        complaintTitle={complaint.description}
      />
    </>
  );
};

// Post Form
const ComplaintForm = ({ onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    category: 'internet',
    description: '',
    location: '',
    priority: 'medium',
    reporter_name: user?.full_name || user?.username || 'Anonymous',
    reporter_contact: user?.phone || user?.email || '',
    roll_no: user?.roll_no || user?.rollNo || '',
    course: user?.course || ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    { value: 'internet', label: 'Internet Issue', icon: Wifi, description: 'Slow speed, connection drops, no internet' },
    { value: 'electricity', label: 'Electricity Problem', icon: Zap, description: 'Power outage, voltage fluctuation, tripping' },
    { value: 'water', label: 'Water Issue', icon: Droplets, description: 'No water, leakage, dirty water' },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'Repairs, cleaning, furniture issues' },
    { value: 'other', label: 'Other', icon: HelpCircle, description: 'Any other type of complaint' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.priority) newErrors.priority = 'Please select priority level';
    }
    
    if (step === 2) {
      if (!formData.location?.trim()) newErrors.location = 'Location is required';
      if (!formData.description?.trim()) newErrors.description = 'Description is required';
      else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (step === 3) {
      if (!formData.reporter_name?.trim()) newErrors.reporter_name = 'Name is required';
      if (!formData.reporter_contact?.trim()) newErrors.reporter_contact = 'Contact info is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields correctly');
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
    { number: 1, title: 'Category', icon: '📋' },
    { number: 2, title: 'Details', icon: '📝' },
    { number: 3, title: 'Contact', icon: '📞' }
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Submit New Complaint</h2>
            <p className="text-sm text-gray-500 mt-1">Help us improve your campus experience</p>
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
          {/* Step 1: Category & Priority */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-3">Category *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: cat.value });
                          setErrors({ ...errors, category: null });
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-[#66b032] bg-[#66b032]/5 dark:bg-[#66b032]/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#66b032]/50'
                        } ${errors.category ? 'border-red-500' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#66b032] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{cat.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Priority Level *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, priority });
                        setErrors({ ...errors, priority: null });
                      }}
                      className={`p-3 rounded-xl border-2 transition-all capitalize ${
                        formData.priority === priority
                          ? priority === 'low' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                            priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                            'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">
                        {priority === 'low' ? '🟢' : priority === 'medium' ? '🟡' : '🔴'}
                      </span>
                      <span className="text-sm font-medium capitalize">{priority}</span>
                    </button>
                  ))}
                </div>
                {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Location & Description */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    setErrors({ ...errors, location: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.location ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Room 201, Lab 3, Cafeteria, Building A"
                  disabled={submitting}
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setErrors({ ...errors, description: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  rows="4"
                  placeholder="Please provide detailed description of the issue..."
                  disabled={submitting}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} / 10 minimum characters
                </p>
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
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <input
                  type="text"
                  value={formData.reporter_name}
                  onChange={(e) => {
                    setFormData({ ...formData, reporter_name: e.target.value });
                    setErrors({ ...errors, reporter_name: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.reporter_name ? 'border-red-500' : ''
                  }`}
                  disabled={submitting}
                />
                {errors.reporter_name && <p className="text-xs text-red-500 mt-1">{errors.reporter_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Info *</label>
                <input
                  type="text"
                  value={formData.reporter_contact}
                  onChange={(e) => {
                    setFormData({ ...formData, reporter_contact: e.target.value });
                    setErrors({ ...errors, reporter_contact: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.reporter_contact ? 'border-red-500' : ''
                  }`}
                  placeholder="Phone number or email"
                  disabled={submitting}
                />
                {errors.reporter_contact && <p className="text-xs text-red-500 mt-1">{errors.reporter_contact}</p>}
                <p className="text-xs text-gray-500 mt-1">This will be visible to admins to contact you</p>
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
                  'Submit Complaint'
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
const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  // Load complaints from localStorage
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    setLoading(true);
    try {
      const savedComplaints = localStorage.getItem('complaints');
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints));
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const saveComplaints = (newComplaints) => {
    try {
      localStorage.setItem('complaints', JSON.stringify(newComplaints));
      setComplaints(newComplaints);
    } catch (error) {
      console.error('Error saving complaints:', error);
      toast.error('Failed to save complaint');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (!formData.description || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      const newComplaint = {
        id: Date.now().toString(),
        ...formData,
        status: 'submitted',
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedComplaints = [newComplaint, ...complaints];
      saveComplaints(updatedComplaints);
      setShowForm(false);
      toast.success('Complaint submitted successfully!');
      
    } catch (error) {
      console.error('Error posting complaint:', error);
      toast.error('Failed to submit complaint');
    }
  };

  const updateStatus = (id, newStatus) => {
    try {
      const updatedComplaints = complaints.map(complaint => 
        complaint.id === id ? { 
          ...complaint, 
          status: newStatus,
          updated_at: new Date().toISOString()
        } : complaint
      );
      saveComplaints(updatedComplaints);
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (id) => {
    try {
      const updatedComplaints = complaints.filter(complaint => complaint.id !== id);
      saveComplaints(updatedComplaints);
      toast.success('Complaint deleted successfully');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter(complaint => {
      const matchesSearch = complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'all') return matchesSearch;
      if (filter === 'submitted') return matchesSearch && complaint.status === 'submitted';
      if (filter === 'in-progress') return matchesSearch && complaint.status === 'in-progress';
      if (filter === 'resolved') return matchesSearch && complaint.status === 'resolved';
      if (filter === 'rejected') return matchesSearch && complaint.status === 'rejected';
      if (filter === 'high') return matchesSearch && complaint.priority === 'high';
      if (filter === 'my') return matchesSearch && complaint.user_id === user?.id;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

  // Stats
  const totalComplaints = complaints.length;
  const submittedCount = complaints.filter(i => i.status === 'submitted').length;
  const inProgressCount = complaints.filter(i => i.status === 'in-progress').length;
  const resolvedCount = complaints.filter(i => i.status === 'resolved').length;
  const myComplaints = complaints.filter(i => i.user_id === user?.id).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#66b032] to-[#0057a8] p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2">Complaints Portal</h1>
            <p className="text-white/90 max-w-2xl">
              Report issues and track their resolution. We're here to help make your campus experience better.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{totalComplaints}</p>
                <p className="text-xs text-white/80">Total Complaints</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{submittedCount}</p>
                <p className="text-xs text-white/80">Submitted</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-xs text-white/80">In Progress</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{resolvedCount}</p>
                <p className="text-xs text-white/80">Resolved</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{myComplaints}</p>
                <p className="text-xs text-white/80">My Complaints</p>
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
            <span>{showForm ? 'Cancel' : 'New Complaint'}</span>
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

        {/* Post Form */}
        <AnimatePresence>
          {showForm && (
            <ComplaintForm 
              onSubmit={handleSubmit} 
              onCancel={() => setShowForm(false)} 
              user={user} 
            />
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search complaints by description, location, category..."
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
              <option value="all">All Complaints</option>
              <option value="submitted">Submitted</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="high">High Priority</option>
              <option value="my">My Complaints</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaints...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredComplaints.length > 0 ? (
              <motion.div 
                layout
                className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2' 
                    : 'grid-cols-1'
                } gap-6`}
              >
                {filteredComplaints.map((complaint, index) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    user={user}
                    index={index}
                    onUpdateStatus={updateStatus}
                    onDelete={handleDelete}
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
                  <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No complaints found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Be the first to submit a complaint'}
                  </p>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Submit Complaint
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

export default Complaints;