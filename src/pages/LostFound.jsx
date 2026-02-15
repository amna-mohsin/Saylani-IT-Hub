import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Package, Search, Clock, CheckCircle, 
  XCircle, User, MapPin, Calendar,
  AlertCircle, Plus, Grid, List, MoreVertical,
  Image as ImageIcon, Phone, X,
  Trash2, Camera, Filter, Loader,
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

// Urgency Badge
const UrgencyBadge = ({ urgency }) => {
  const config = {
    low: { color: 'bg-green-100 text-green-800', label: 'Low' },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
    high: { color: 'bg-red-100 text-red-800', label: 'High' }
  };
  const { color, label } = config[urgency] || config.medium;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
};

// Item Card
const ItemCard = ({ item, user, onUpdateStatus, onDelete, onContact }) => {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending': return { icon: Clock, text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'found': return { icon: CheckCircle, text: 'Found', color: 'text-green-600', bg: 'bg-green-100' };
      case 'matched': return { icon: CheckCircle, text: 'Matched', color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'closed': return { icon: XCircle, text: 'Closed', color: 'text-gray-600', bg: 'bg-gray-100' };
      default: return { icon: Clock, text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };

  const status = getStatusConfig(item.status);
  const StatusIcon = status.icon;
  
  // Check if this is user's own post
  const isOwnPost = user && user.id && item.user_id && item.user_id === user.id;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
          {item.image_url && !imageError ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
              item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
            </span>
            <UrgencyBadge urgency={item.urgency} />
          </div>

          {/* Status */}
          <div className="absolute top-3 right-3">
            <span className={`${status.bg} ${status.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.text}
            </span>
          </div>

          {/* Actions Menu - Only for user's own posts */}
          {isOwnPost && (
            <div className="absolute bottom-3 right-3">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>
              
              <AnimatePresence>
                {showActions && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50"
                    >
                      <div className="p-2">
                        {item.status !== 'found' && (
                          <button
                            onClick={() => {
                              onUpdateStatus(item.id, 'found');
                              setShowActions(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Mark Found</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowActions(false);
                            setShowDeleteModal(true);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
          
          <div className="relative">
            <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${!showFullDescription ? 'line-clamp-2' : ''}`}>
              {item.description}
            </p>
            {item.description && item.description.length > 100 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-xs text-[#66b032] hover:underline flex items-center mt-1"
              >
                {showFullDescription ? (
                  <>Show less <ChevronUp className="w-3 h-3 ml-1" /></>
                ) : (
                  <>Read more <ChevronDown className="w-3 h-3 ml-1" /></>
                )}
              </button>
            )}
          </div>
          
          {item.location && (
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-t dark:border-gray-700 pt-3 gap-2">
            <div className="flex items-center min-w-0">
              <User className="w-3 h-3 text-[#66b032] mr-1 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 truncate">{item.reporter_name}</span>
              {isOwnPost && <span className="ml-1 text-[10px] text-[#66b032] flex-shrink-0">(You)</span>}
            </div>
            <span className="text-gray-500 flex-shrink-0">
              {new Date(item.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Roll No and Course */}
          {(item.roll_no || item.course) && (
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mt-2">
              {item.roll_no && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">#{item.roll_no}</span>}
              {item.course && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{item.course}</span>}
            </div>
          )}

          {/* Contact Button - Shows for items that are NOT user's own posts */}
          {!isOwnPost && item.reporter_contact && (
            <button
              onClick={() => onContact(item)}
              className="w-full mt-3 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </button>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(item.id)}
        itemTitle={item.title}
      />
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'materials', 'extracurricular', 'electronics', 
    'documents', 'accessories', 'other'
  ];

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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile && !formData.image_url) {
      toast.error('Please upload an image');
      return;
    }

    setUploading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Report Lost/Found Item</h2>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={uploading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                required
                disabled={uploading}
              >
                <option value="lost">🔴 Lost Item</option>
                <option value="found">🟢 Found Item</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                disabled={uploading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              placeholder="e.g., Black Laptop Bag"
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              rows="3"
              placeholder="Detailed description..."
              required
              disabled={uploading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                placeholder="Where was it lost/found?"
                required
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                disabled={uploading}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Image *</label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative w-full max-w-xs">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg shadow-lg" 
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
                <label className="cursor-pointer block w-full">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 md:p-8 text-center hover:border-[#66b032] transition-colors">
                    <Camera className="w-8 h-8 md:w-10 md:h-10 text-[#66b032] mx-auto mb-2" />
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Info *</label>
            <input
              type="text"
              value={formData.reporter_contact}
              onChange={(e) => setFormData({ ...formData, reporter_contact: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              placeholder="Phone or email"
              required
              disabled={uploading}
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button 
              type="submit" 
              disabled={uploading}
              className="flex-1 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={uploading}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
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

  // Load all posts from Supabase
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading items:', error);
        toast.error('Failed to load items');
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
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
        type: formData.type,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        urgency: formData.urgency,
        status: 'pending',
        image_url: formData.image_url,
        reporter_name: formData.reporter_name,
        reporter_contact: formData.reporter_contact,
        roll_no: formData.roll_no,
        course: formData.course,
        user_id: user?.id, // This sets ownership for delete option
        date_reported: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('lost_items')
        .insert([newItem])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Error: ${error.message}`);
        return;
      }

      setItems([data[0], ...items]);
      setShowForm(false);
      toast.success('Item posted successfully!');
      
    } catch (error) {
      console.error('Error posting item:', error);
      toast.error('Failed to post item');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('lost_items')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('lost_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleContact = (item) => {
    const contact = item.reporter_contact;
    if (contact.includes('@')) {
      window.location.href = `mailto:${contact}`;
    } else {
      const phoneNumber = contact.replace(/\D/g, '');
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'lost') return matchesSearch && item.type === 'lost';
    if (filter === 'found') return matchesSearch && item.type === 'found';
    return matchesSearch;
  });

  // Stats
  const totalItems = items.length;
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Lost & Found</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Report lost items or help others find theirs</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'Post Item'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-[#66b032] mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-[#66b032]">{totalItems}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Total Items</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-red-500">{lostCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Lost</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-green-500">{foundCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Found</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Pending</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              >
                <option value="all">All Items</option>
                <option value="lost">Lost Only</option>
                <option value="found">Found Only</option>
              </select>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-3 md:px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4 md:w-5 md:h-5" /> : <Grid className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
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
                } gap-4 md:gap-6`}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 md:py-12"
              >
                <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2">No items found</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Be the first to post an item
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default LostFound;