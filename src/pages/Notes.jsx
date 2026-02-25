import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Search, Plus, Grid, List, MoreVertical,
  X, Loader, ChevronDown, ChevronUp, Star,
  Clock, User, Calendar, Tag, Folder,
  Edit, Trash2, Eye, Download, Share2,
  AlertCircle, BookMarked, FileText, Heart,
  Sparkles, Layers, Filter, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Note Card Component
const NoteCard = ({ note, user, onEdit, onDelete, onToggleFavorite, onShare }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const actionMenuRef = useRef(null);

  const isOwner = user?.id === note.user_id;
  const previewContent = note.content.length > 150 
    ? note.content.substring(0, 150) + '...' 
    : note.content;

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'lecture': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      'assignment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      'exam': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      'project': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      'research': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      'personal': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
      'other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    };
    return colors[category] || colors.other;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'lecture': BookOpen,
      'assignment': PenTool,
      'exam': AlertCircle,
      'project': Layers,
      'research': Search,
      'personal': User,
      'other': FileText
    };
    return icons[category] || FileText;
  };

  const CategoryIcon = getCategoryIcon(note.category);

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
        {/* Header with category color */}
        <div className={`h-2 ${getCategoryColor(note.category).split(' ')[0]}`} />

        <div className="p-6">
          {/* Title and Actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${getCategoryColor(note.category)}`}>
                <CategoryIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex-1">
                {note.title}
              </h3>
            </div>

            <div className="flex items-center space-x-1">
              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite(note.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Star 
                  className={`w-4 h-4 ${
                    note.is_favorite 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-400'
                  }`} 
                />
              </motion.button>

              {/* Actions Menu - Only for owner */}
              {isOwner && (
                <div className="relative" ref={actionMenuRef}>
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
                           
                            
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                setShowActions(false);
                                onEdit(note);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Edit className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium block">Edit Note</span>
                                <span className="text-xs text-gray-500">Modify content</span>
                              </div>
                            </motion.button>

                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                setShowActions(false);
                                onShare(note);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            >
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Share2 className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium block">Share</span>
                                <span className="text-xs text-gray-500">Share with others</span>
                              </div>
                            </motion.button>

                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                setShowActions(false);
                                // Download functionality
                                const blob = new Blob([note.content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${note.title}.txt`;
                                a.click();
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            >
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Download className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium block">Download</span>
                                <span className="text-xs text-gray-500">Save as text file</span>
                              </div>
                            </motion.button>

                            <div className="border-t dark:border-gray-700 my-2" />

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
                                <span className="text-xs text-gray-500">Permanently remove</span>
                              </div>
                            </motion.button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Category Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
              {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
            </span>
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {note.tags.slice(0, 2).join(', ')}
                  {note.tags.length > 2 && ` +${note.tags.length - 2}`}
                </span>
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div className="relative">
            <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${!showFullContent ? 'line-clamp-3' : ''}`}>
              {showFullContent ? note.content : previewContent}
            </p>
            {note.content.length > 150 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-xs text-[#66b032] hover:underline flex items-center mt-1 transition-colors"
              >
                {showFullContent ? (
                  <>Show less <ChevronUp className="w-3 h-3 ml-1" /></>
                ) : (
                  <>Read more <ChevronDown className="w-3 h-3 ml-1" /></>
                )}
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t dark:border-gray-700 text-xs">
            <div className="flex items-center text-gray-500">
              <User className="w-3 h-3 mr-1 text-[#66b032]" />
              <span>{note.author_name}</span>
              {isOwner && (
                <span className="ml-1 text-[10px] bg-[#66b032]/10 text-[#66b032] px-1.5 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
            
            <div className="flex items-center text-gray-500">
              <Calendar className="w-3 h-3 mr-1 text-[#0057a8]" />
              {new Date(note.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>

            {note.course && (
              <div className="flex items-center text-gray-500">
                <BookMarked className="w-3 h-3 mr-1 text-purple-500" />
                {note.course}
              </div>
            )}
          </div>

          {/* View Count (if shared) */}
          {note.is_public && note.view_count > 0 && (
            <div className="mt-2 flex items-center text-xs text-gray-400">
              <Eye className="w-3 h-3 mr-1" />
              {note.view_count} views
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
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
                  Delete Note?
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Are you sure you want to delete <span className="font-semibold">"{note.title}"</span>? This action cannot be undone.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3"
                >
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete(note.id);
                      setShowDeleteModal(false);
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
    </>
  );
};

// Note Form Component
const NoteForm = ({ onSubmit, onCancel, initialData, user }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || 'lecture',
    tags: initialData?.tags?.join(', ') || '',
    course: initialData?.course || '',
    is_public: initialData?.is_public || false,
    is_favorite: initialData?.is_favorite || false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'lecture', label: '📚 Lecture Notes', icon: BookOpen },
    { value: 'assignment', label: '✍️ Assignment', icon: PenTool },
    { value: 'exam', label: '📝 Exam Prep', icon: AlertCircle },
    { value: 'project', label: '🚀 Project', icon: Layers },
    { value: 'research', label: '🔬 Research', icon: Search },
    { value: 'personal', label: '👤 Personal', icon: User },
    { value: 'other', label: '📄 Other', icon: FileText }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitting(true);
      
      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      await onSubmit({
        ...formData,
        tags: tagsArray
      });
      
      setSubmitting(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {initialData ? 'Edit Note' : 'Create New Note'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {initialData ? 'Update your notes' : 'Write down your thoughts and ideas'}
            </p>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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
              placeholder="e.g., React Hooks Notes, Physics Chapter 5..."
              disabled={submitting}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category and Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                disabled={submitting}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Course/Subject (Optional)</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
                placeholder="e.g., Computer Science, Mathematics..."
                disabled={submitting}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags (Optional, comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
              placeholder="e.g., react, javascript, exam, important"
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                setErrors({ ...errors, content: null });
              }}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all ${
                errors.content ? 'border-red-500' : ''
              }`}
              rows="8"
              placeholder="Write your notes here... Markdown supported"
              disabled={submitting}
            />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} / 10 minimum characters
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_favorite}
                onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
                className="w-4 h-4 text-[#66b032] rounded focus:ring-[#66b032]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Mark as favorite</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="w-4 h-4 text-[#66b032] rounded focus:ring-[#66b032]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Make public (share with others)</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Update Note' : 'Create Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Main Notes Component
const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    setLoading(true);
    try {
      const savedNotes = localStorage.getItem('userNotes');
      if (savedNotes) {
        const allNotes = JSON.parse(savedNotes);
        // Filter notes for current user
        setNotes(allNotes.filter(note => note.user_id === user?.id));
      } else {
        // Sample notes if none exist
        const sampleNotes = [
          {
            id: '1',
            title: 'React Hooks Overview',
            content: `useState - for managing local state
useEffect - for side effects and lifecycle
useContext - for consuming context
useReducer - for complex state logic
useMemo - for memoizing values
useCallback - for memoizing functions
useRef - for mutable references`,
            category: 'lecture',
            tags: ['react', 'hooks', 'javascript'],
            course: 'Web Development',
            author_name: user?.full_name || 'You',
            user_id: user?.id,
            is_favorite: true,
            is_public: false,
            view_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Database Design Principles',
            content: `1. Normalization - Eliminate redundancy
2. Primary Keys - Unique identifiers
3. Foreign Keys - Establish relationships
4. Indexes - Improve query performance
5. Constraints - Ensure data integrity
6. Transactions - Maintain consistency`,
            category: 'exam',
            tags: ['database', 'sql', 'design'],
            course: 'Database Systems',
            author_name: user?.full_name || 'You',
            user_id: user?.id,
            is_favorite: false,
            is_public: true,
            view_count: 5,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            title: 'Project Ideas 2024',
            content: `- AI-powered study assistant
- Campus navigation app
- Peer tutoring platform
- Event management system
- Lost and found tracker
- Digital library catalog`,
            category: 'project',
            tags: ['ideas', 'planning'],
            course: 'Final Year Project',
            author_name: user?.full_name || 'You',
            user_id: user?.id,
            is_favorite: true,
            is_public: false,
            view_count: 0,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setNotes(sampleNotes);
        localStorage.setItem('userNotes', JSON.stringify(sampleNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = (updatedNotes) => {
    try {
      // Get all notes from localStorage
      const allNotes = JSON.parse(localStorage.getItem('userNotes') || '[]');
      
      // Update only current user's notes
      const otherNotes = allNotes.filter(note => note.user_id !== user?.id);
      const newAllNotes = [...otherNotes, ...updatedNotes];
      
      localStorage.setItem('userNotes', JSON.stringify(newAllNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save note');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingNote) {
        // Update existing note
        const updatedNotes = notes.map(note => 
          note.id === editingNote.id 
            ? { 
                ...note, 
                ...formData,
                updated_at: new Date().toISOString()
              }
            : note
        );
        saveNotes(updatedNotes);
        toast.success('Note updated successfully!');
      } else {
        // Create new note
        const newNote = {
          id: Date.now().toString(),
          ...formData,
          author_name: user?.full_name || user?.username || 'Anonymous',
          user_id: user?.id,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const updatedNotes = [newNote, ...notes];
        saveNotes(updatedNotes);
        toast.success('Note created successfully!');
      }
      
      setShowForm(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleDelete = (id) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      saveNotes(updatedNotes);
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleToggleFavorite = (id) => {
    try {
      const updatedNotes = notes.map(note => 
        note.id === id 
          ? { ...note, is_favorite: !note.is_favorite }
          : note
      );
      saveNotes(updatedNotes);
      toast.success('Favorite status updated');
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleShare = (note) => {
    // Simulate sharing
    toast.success('Share link copied to clipboard!');
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           note.course?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      const matchesFavorite = showFavoritesOnly ? note.is_favorite : true;
      
      return matchesSearch && matchesCategory && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Stats
  const totalNotes = notes.length;
  const favoriteCount = notes.filter(n => n.is_favorite).length;
  const publicCount = notes.filter(n => n.is_public).length;

  const categories = [
    { value: 'all', label: 'All Notes', icon: BookOpen },
    { value: 'lecture', label: 'Lectures', icon: BookOpen },
    { value: 'assignment', label: 'Assignments', icon: PenTool },
    { value: 'exam', label: 'Exams', icon: AlertCircle },
    { value: 'project', label: 'Projects', icon: Layers },
    { value: 'research', label: 'Research', icon: Search },
    { value: 'personal', label: 'Personal', icon: User },
    { value: 'other', label: 'Other', icon: FileText }
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
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl font-bold">My Notes</h1>
            </div>
            <p className="text-white/90 max-w-2xl">
              Organize your study materials, lecture notes, and important information.
              Keep everything in one place for easy access.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{totalNotes}</p>
                <p className="text-xs text-white/80">Total Notes</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{favoriteCount}</p>
                <p className="text-xs text-white/80">Favorites</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{publicCount}</p>
                <p className="text-xs text-white/80">Public Notes</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">
                  {notes.reduce((sum, note) => sum + (note.content?.length || 0), 0)}
                </p>
                <p className="text-xs text-white/80">Total Words</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => {
              setEditingNote(null);
              setShowForm(!showForm);
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>{showForm ? 'Cancel' : 'Create New Note'}</span>
          </button>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Note Form */}
        <AnimatePresence>
          {showForm && (
            <NoteForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingNote(null);
              }}
              initialData={editingNote}
              user={user}
            />
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes by title, content, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-[#66b032] transition-all"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center space-x-2 ${
                showFavoritesOnly
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              <span className="text-sm">Favorites</span>
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your notes...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotes.length > 0 ? (
              <motion.div 
                layout
                className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                } gap-6`}
              >
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handleShare}
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
                  <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No notes found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchTerm || selectedCategory !== 'all' || showFavoritesOnly
                      ? 'Try adjusting your filters'
                      : 'Start creating notes to organize your study materials'}
                  </p>
                  {!showForm && (
                    <button
                      onClick={() => {
                        setEditingNote(null);
                        setShowForm(true);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Note
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

export default Notes;