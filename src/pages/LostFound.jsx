import React, { useState, useEffect, useRef } from 'react';  
import { useAuth } from '../context/AuthContext';
import { 
  Package, Search, Clock, CheckCircle, 
  XCircle, User, MapPin, Calendar,
  AlertCircle, Plus, Grid, List, MoreVertical,
  Image as ImageIcon, Phone, X,
  Trash2, Camera, Loader,
  ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// ==================== DELETE CONFIRMATION MODAL ====================
const DeleteModal = ({ isOpen, onClose, onConfirm, itemTitle }) => {
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
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-800 dark:text-white mb-2"
              >
                Delete Item?
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-400 mb-6"
              >
                Are you sure you want to delete <span className="font-semibold text-gray-800 dark:text-white">"{itemTitle}"</span>? This action cannot be undone.
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

// ==================== CONTACT MODAL ====================
const ContactModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contact Information</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reporter</p>
                <p className="font-semibold text-gray-800 dark:text-white">{item.reporter_name}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                <p className="font-semibold text-[#66b032]">{item.reporter_contact}</p>
              </div>

              {(item.roll_no || item.course) && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Details</p>
                  <div className="flex flex-wrap gap-2">
                    {item.roll_no && (
                      <span className="px-3 py-1 bg-[#66b032]/10 text-[#66b032] rounded-full text-sm">
                        Roll No: {item.roll_no}
                      </span>
                    )}
                    {item.course && (
                      <span className="px-3 py-1 bg-[#0057a8]/10 text-[#0057a8] rounded-full text-sm">
                        {item.course}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {item.reporter_contact?.includes('@') ? (
                  <a
                    href={`mailto:${item.reporter_contact}`}
                    className="flex-1 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl font-medium hover:shadow-lg transition-all text-center"
                  >
                    Send Email
                  </a>
                ) : (
                  <a
                    href={`tel:${item.reporter_contact}`}
                    className="flex-1 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl font-medium hover:shadow-lg transition-all text-center"
                  >
                    Call Now
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Urgency Badge
const UrgencyBadge = ({ urgency }) => {
  const config = {
    low: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Low', icon: '🟢' },
    medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Medium', icon: '🟡' },
    high: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'High', icon: '🔴' }
  };
  const { color, label, icon } = config[urgency] || config.medium;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${color}`}>
      <span className="mr-1">{icon}</span>
      {label}
    </span>
  );
};

// Item Card
const ItemCard = ({ item, user, onUpdateStatus, onDelete, onContact }) => {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending': return { icon: Clock, text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' };
      case 'found': return { icon: CheckCircle, text: 'Found', color: 'text-[#66b032]', bg: 'bg-green-50 border-green-100' };
      case 'matched': return { icon: CheckCircle, text: 'Matched', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' };
      case 'closed': return { icon: XCircle, text: 'Closed', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-100' };
      default: return { icon: Clock, text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' };
    }
  };

  const statusCfg = getStatusConfig(item.status);
  const StatusIcon = statusCfg.icon;
  const isOwnPost = user?.id === item.user_id;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
      >
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden bg-gray-50">
          {item.image_url && !imageError ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-lg backdrop-blur-md text-white ${item.type === 'lost' ? 'bg-red-500/90' : 'bg-[#66b032]/90'}`}>
              {item.type?.toUpperCase()}
            </span>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border shadow-sm backdrop-blur-md bg-white/90 dark:bg-gray-900/90 ${statusCfg.color} ${statusCfg.bg}`}>
              <StatusIcon className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase">{statusCfg.text}</span>
            </div>
          </div>

          {/* Three Dots - Only for owner */}
          {isOwnPost && (
            <div className="absolute bottom-3 right-3 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform border border-gray-100 dark:border-gray-700"
              >
                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              
              <AnimatePresence>
                {showActions && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30" onClick={() => setShowActions(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute right-0 bottom-full mb-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-40 overflow-hidden"
                    >
                      <button 
                        onClick={() => { onUpdateStatus(item.id, 'found'); setShowActions(false); }}
                        className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 text-[#66b032]" />
                        <span>Mark Found</span>
                      </button>
                      <button 
                        onClick={() => { setShowDeleteModal(true); setShowActions(false); }}
                        className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 leading-tight">{item.title}</h3>
          
          <div className="mb-4">
            <p className={`text-sm text-gray-500 dark:text-gray-400 ${!showFullDescription ? 'line-clamp-2' : ''}`}>
              {item.description}
            </p>
            {item.description?.length > 100 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-xs font-bold text-[#66b032] mt-1"
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-400">
              <MapPin className="w-3 h-3 mr-2 text-[#66b032]" />
              {item.location}
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <User className="w-3 h-3 mr-2 text-[#0057a8]" />
              {item.reporter_name} {isOwnPost && "(You)"}
            </div>
          </div>

          {!isOwnPost && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onContact(item)}
              className="w-full py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 dark:shadow-none flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Finder</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal FIX */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center border border-gray-100 dark:border-gray-700"
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Are you sure?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                This action will permanently delete <span className="font-bold text-gray-800 dark:text-gray-200">"{item.title}"</span>. This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { onDelete(item.id); setShowDeleteModal(false); }}
                  className="py-3 px-6 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Post Form
const PostForm = ({ onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'materials',
    location: '',
    urgency: 'medium',
    image_url: '',
    reporter_contact: user?.phone || user?.email || '',
    reporter_name: user?.full_name || user?.username || 'Anonymous',
    roll_no: user?.roll_no || user?.rollNo || '',
    course: user?.course || ''
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    { value: 'materials', label: '📚 Study Materials', icon: '📚' },
    { value: 'electronics', label: '📱 Electronics', icon: '📱' },
    { value: 'documents', label: '📄 Documents', icon: '📄' },
    { value: 'accessories', label: '🎒 Accessories', icon: '🎒' },
    { value: 'other', label: '📦 Other', icon: '📦' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.type) newErrors.type = 'Please select type';
      if (!formData.title?.trim()) newErrors.title = 'Title is required';
    }
    
    if (step === 2) {
      if (!formData.description?.trim()) newErrors.description = 'Description is required';
      if (!formData.location?.trim()) newErrors.location = 'Location is required';
      if (!imagePreview && !formData.image_url) newErrors.image = 'Image is required';
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
      toast.error('Please fill in all required fields');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image_url: reader.result });
        // Clear image error if exists
        if (errors.image) {
          setErrors({ ...errors, image: null });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(3) && validateStep(2) && validateStep(1)) {
      setUploading(true);
      await onSubmit(formData);
      setUploading(false);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📝' },
    { number: 2, title: 'Details', icon: '🔍' },
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Report Lost/Found Item</h2>
            <p className="text-sm text-gray-500 mt-1">Help others find their belongings</p>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={uploading}
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
                    ? 'bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white' 
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
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: 'lost' });
                      setErrors({ ...errors, type: null });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.type === 'lost'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-200'
                    } ${errors.type ? 'border-red-500' : ''}`}
                  >
                    <span className="text-2xl mb-2 block">🔴</span>
                    <span className="font-medium">Lost Item</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: 'found' });
                      setErrors({ ...errors, type: null });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.type === 'found'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-200'
                    } ${errors.type ? 'border-red-500' : ''}`}
                  >
                    <span className="text-2xl mb-2 block">🟢</span>
                    <span className="font-medium">Found Item</span>
                  </button>
                </div>
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setErrors({ ...errors, title: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Black Laptop Bag with Lenovo Laptop"
                  required
                  disabled={uploading}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                  disabled={uploading}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
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
                  placeholder="Provide detailed description including color, brand, distinguishing features..."
                  required
                  disabled={uploading}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="e.g., Library, 2nd Floor"
                    required
                    disabled={uploading}
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                    disabled={uploading}
                  >
                    <option value="low">🟢 Low - Not urgent</option>
                    <option value="medium">🟡 Medium - Important</option>
                    <option value="high">🔴 High - Very urgent</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs mx-auto">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-xl shadow-lg" 
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className={`border-2 border-dashed rounded-xl p-8 text-center hover:border-[#66b032] transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        errors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <Camera className="w-12 h-12 text-[#66b032] mx-auto mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                        required={!imagePreview}
                        disabled={uploading}
                      />
                    </label>
                  )}
                  {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
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
                  required
                  disabled={uploading}
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
                  required
                  disabled={uploading}
                />
                {errors.reporter_contact && <p className="text-xs text-red-500 mt-1">{errors.reporter_contact}</p>}
                <p className="text-xs text-gray-500 mt-1">This will be visible to others to contact you</p>
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
                    disabled={uploading}
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
                    disabled={uploading}
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
                disabled={uploading}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Item'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// ==================== MAIN COMPONENT ====================
const LostFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Load items from localStorage
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    setLoading(true);
    try {
      const savedItems = localStorage.getItem('lostFoundItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const saveItems = (newItems) => {
    try {
      localStorage.setItem('lostFoundItems', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Error saving items:', error);
      toast.error('Failed to save item');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (!formData.title || !formData.description || !formData.location || !formData.image_url) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (!formData.reporter_contact) {
        toast.error('Please provide contact information');
        return;
      }

      const newItem = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        user_id: user?.id,
        date_reported: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const updatedItems = [newItem, ...items];
      saveItems(updatedItems);
      setShowForm(false);
      toast.success('Item posted successfully!');
      
    } catch (error) {
      console.error('Error posting item:', error);
      toast.error('Failed to post item');
    }
  };

  const updateStatus = (id, newStatus) => {
    try {
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      );
      saveItems(updatedItems);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (id) => {
    try {
      const updatedItems = items.filter(item => item.id !== id);
      saveItems(updatedItems);
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleContact = (item) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'all') return matchesSearch;
      if (filter === 'lost') return matchesSearch && item.type === 'lost';
      if (filter === 'found') return matchesSearch && item.type === 'found';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

  // Stats
  const totalItems = items.length;
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#66b032] to-[#0057a8] p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2">Lost & Found Hub</h1>
            <p className="text-white/90 max-w-2xl">
              Report lost items or help others find theirs. Together we can reunite belongings with their owners.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-xs text-white/80">Total Reports</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{lostCount}</p>
                <p className="text-xs text-white/80">Lost Items</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{foundCount}</p>
                <p className="text-xs text-white/80">Found Items</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-white/80">Pending</p>
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
            <span>{showForm ? 'Cancel' : 'Report Item'}</span>
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
            <PostForm 
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
                placeholder="Search by title, description, location..."
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
              <option value="all">All Items</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading items...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.length > 0 ? (
              <motion.div 
                layout
                className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                } gap-6`}
              >
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    user={user}
                    onUpdateStatus={updateStatus}
                    onDelete={handleDelete}
                    onContact={handleContact}
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
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No items found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Be the first to report a lost or found item'}
                  </p>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Report Item
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Contact Modal */}
        <ContactModal
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      </div>
    </Layout>
  );
};

export default LostFound;