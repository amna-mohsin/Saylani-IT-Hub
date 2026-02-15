import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  AlertCircle, Clock, CheckCircle, XCircle, 
  Wifi, Zap, Droplets, Wrench, Search, Plus,
  MapPin, User, Calendar, Filter, Grid, List,
  MoreVertical, Phone, Mail, Loader, ChevronDown,
  ChevronUp, Trash2, Camera, X, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Priority Badge
const PriorityBadge = ({ priority }) => {
  const config = {
    low: { color: 'bg-green-100 text-green-800', label: 'Low Priority', icon: Clock },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Priority', icon: Clock },
    high: { color: 'bg-red-100 text-red-800', label: 'High Priority', icon: AlertCircle }
  };
  const { color, label, icon: Icon } = config[priority] || config.medium;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color} flex items-center`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    submitted: { icon: Clock, text: 'Submitted', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'in-progress': { icon: Clock, text: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100' },
    resolved: { icon: CheckCircle, text: 'Resolved', color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { icon: XCircle, text: 'Rejected', color: 'text-red-600', bg: 'bg-red-100' }
  };
  const { icon: Icon, text, color, bg } = config[status] || config.submitted;
  
  return (
    <span className={`${bg} ${color} px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg`}>
      <Icon className="w-3 h-3 mr-1" />
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

  const categories = [
    { value: 'internet', label: 'Internet Issue', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-100' },
    { value: 'electricity', label: 'Electricity Problem', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { value: 'water', label: 'Water Issue', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100' },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-gray-500', bg: 'bg-gray-100' },
    { value: 'other', label: 'Other', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' }
  ];

  const category = categories.find(c => c.value === complaint.category) || categories[4];
  const CategoryIcon = category.icon;
  const isOwner = user?.id === complaint.user_id;

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

                {complaint.location && (
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{complaint.location}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-t dark:border-gray-700 pt-3 gap-2">
                  <div className="flex items-center min-w-0">
                    <User className="w-3 h-3 text-[#66b032] mr-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 truncate">{complaint.reporter_name}</span>
                    {isOwner && <span className="ml-1 text-[10px] text-[#66b032] flex-shrink-0">(You)</span>}
                  </div>
                  <span className="text-gray-500 flex-shrink-0">
                    {new Date(complaint.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Roll No and Course */}
                {(complaint.roll_no || complaint.course) && (
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mt-2">
                    {complaint.roll_no && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">#{complaint.roll_no}</span>}
                    {complaint.course && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{complaint.course}</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 ml-4">
              <StatusBadge status={complaint.status} />
              
              {/* Actions Menu - Only for owner */}
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
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
                            {complaint.status === 'submitted' && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(complaint.id, 'in-progress');
                                  setShowActions(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Mark In Progress</span>
                              </button>
                            )}
                            {complaint.status === 'in-progress' && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(complaint.id, 'resolved');
                                  setShowActions(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">Mark Resolved</span>
                              </button>
                            )}
                            {(complaint.status === 'submitted' || complaint.status === 'in-progress') && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(complaint.id, 'rejected');
                                  setShowActions(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium">Reject</span>
                              </button>
                            )}
                            <div className="border-t border-gray-200 my-2" />
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
          </div>
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
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'internet', label: 'Internet Issue', icon: Wifi },
    { value: 'electricity', label: 'Electricity Problem', icon: Zap },
    { value: 'water', label: 'Water Issue', icon: Droplets },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench },
    { value: 'other', label: 'Other', icon: AlertCircle }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Submit New Complaint</h2>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                required
                disabled={submitting}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
                required
                disabled={submitting}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              placeholder="e.g., Room 201, Lab 3, Cafeteria"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              rows="3"
              placeholder="Describe the issue in detail..."
              required
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={submitting}
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

// Main Component
const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  // Load complaints from Supabase
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading complaints:', error);
        toast.error('Failed to load complaints');
      } else {
        setComplaints(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (!formData.description || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      const newComplaint = {
        category: formData.category,
        description: formData.description,
        location: formData.location,
        priority: formData.priority,
        status: 'submitted',
        reporter_name: formData.reporter_name,
        reporter_contact: formData.reporter_contact,
        roll_no: formData.roll_no,
        course: formData.course,
        user_id: user?.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('complaints')
        .insert([newComplaint])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Error: ${error.message}`);
        return;
      }

      setComplaints([data[0], ...complaints]);
      setShowForm(false);
      toast.success('Complaint submitted successfully!');
      
    } catch (error) {
      console.error('Error posting complaint:', error);
      toast.error('Failed to submit complaint');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setComplaints(complaints.map(complaint => 
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
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
        .from('complaints')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComplaints(complaints.filter(complaint => complaint.id !== id));
      toast.success('Complaint deleted successfully');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'submitted') return matchesSearch && complaint.status === 'submitted';
    if (filter === 'in-progress') return matchesSearch && complaint.status === 'in-progress';
    if (filter === 'resolved') return matchesSearch && complaint.status === 'resolved';
    if (filter === 'rejected') return matchesSearch && complaint.status === 'rejected';
    if (filter === 'high') return matchesSearch && complaint.priority === 'high';
    return matchesSearch;
  });

  // Stats
  const totalComplaints = complaints.length;
  const submittedCount = complaints.filter(i => i.status === 'submitted').length;
  const inProgressCount = complaints.filter(i => i.status === 'in-progress').length;
  const resolvedCount = complaints.filter(i => i.status === 'resolved').length;

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Complaints</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Report issues and track their resolution</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'New Complaint'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-[#66b032] mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-[#66b032]">{totalComplaints}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Total Complaints</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-yellow-500">{submittedCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Submitted</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-blue-500">{inProgressCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">In Progress</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-green-500">{resolvedCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Resolved</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search complaints by description, location..."
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
                <option value="all">All Complaints</option>
                <option value="submitted">Submitted</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="high">High Priority</option>
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

        {/* Complaints Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
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
                } gap-4 md:gap-6`}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 md:py-12"
              >
                <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2">No complaints found</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search' : 'Be the first to submit a complaint'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default Complaints;