import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, Calendar, Clock, MapPin, CheckCircle, 
  XCircle, Plus, Search, Filter, Grid, List,
  User, BookOpen, MoreVertical, Trash2, X,
  Loader, ChevronDown, ChevronUp, Award,
  Sparkles, Activity, AlertCircle, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    pending: { icon: Clock, text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    approved: { icon: CheckCircle, text: 'Approved', color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { icon: XCircle, text: 'Rejected', color: 'text-red-600', bg: 'bg-red-100' }
  };
  const { icon: Icon, text, color, bg } = config[status] || config.pending;
  
  return (
    <span className={`${bg} ${color} px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg`}>
      <Icon className="w-3 h-3 mr-1" />
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
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{event.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            spotsLeft > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#66b032]" />
            {new Date(event.event_date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[#0057a8]" />
            {event.event_time}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
            {event.location}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {event.current_volunteers || 0}/{event.max_volunteers} volunteers
            </span>
          </div>
          
          {!isRegistered && spotsLeft > 0 && (
            <button
              onClick={() => onRegister(event)}
              className="px-4 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
            >
              Register
            </button>
          )}
          
          {isRegistered && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center">
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
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isOwnRegistration = user?.id === registration.user_id;

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
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#66b032] to-[#0057a8] rounded-xl flex items-center justify-center text-white font-bold">
                  {registration.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {registration.event_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registered by: {registration.full_name}
                    {isOwnRegistration && <span className="ml-1 text-[#66b032]">(You)</span>}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {registration.availability && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2 text-[#66b032]" />
                    <span className="truncate">
                      {typeof registration.availability === 'object' 
                        ? JSON.stringify(registration.availability) 
                        : registration.availability}
                    </span>
                  </div>
                )}
                
                {registration.skills && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Award className="w-4 h-4 mr-2 text-[#0057a8]" />
                    <span className="truncate">{registration.skills}</span>
                  </div>
                )}

                {registration.roll_no && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4 mr-2 text-purple-500" />
                    <span>#{registration.roll_no}</span>
                  </div>
                )}

                {registration.course && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{registration.course}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs text-gray-500 mt-4">
                <Calendar className="w-3 h-3 mr-1" />
                Registered on: {new Date(registration.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 ml-4">
              <StatusBadge status={registration.status} />
              
              {/* Actions Menu */}
              {(isAdmin || isOwnRegistration) && (
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
                            {isAdmin && registration.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    onUpdateStatus(registration.id, 'approved');
                                    setShowActions(false);
                                  }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium">Approve</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateStatus(registration.id, 'rejected');
                                    setShowActions(false);
                                  }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <span className="text-sm font-medium">Reject</span>
                                </button>
                              </>
                            )}
                            {isOwnRegistration && (
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
    course: user?.course || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.event_id || !formData.availability) {
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Volunteer Registration</h2>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Event *</label>
            <select
              value={formData.event_id}
              onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              required
              disabled={submitting}
            >
              <option value="">Choose an event...</option>
              {events.map(event => {
                const spotsLeft = (event.max_volunteers || 0) - (event.current_volunteers || 0);
                return (
                  <option key={event.id} value={event.id} disabled={spotsLeft <= 0}>
                    {event.title} - {new Date(event.event_date).toLocaleDateString()} 
                    ({spotsLeft} spots left)
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Availability *</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              placeholder="e.g., Weekends, Evenings, Full-time"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills (Optional)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-[#66b032] transition-all"
              placeholder="e.g., Teaching, Technical, Organizing"
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
                'Submit Registration'
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
const Volunteer = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.email === 'admin@saylani.com') {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [user]);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Load registrations
      let query = supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, only show user's registrations
      if (!isAdmin && user) {
        query = query.eq('user_id', user.id);
      }

      const { data: regData, error: regError } = await query;

      if (regError) throw regError;
      setRegistrations(regData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
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
        user_id: user?.id,
        full_name: formData.full_name,
        event_name: selectedEvent.title,
        availability: formData.availability,
        skills: formData.skills || null,
        status: 'pending',
        roll_no: formData.roll_no,
        course: formData.course,
        registered_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('volunteers')
        .insert([newRegistration])
        .select();

      if (error) throw error;

      // Update event volunteer count
      const { error: updateError } = await supabase
        .from('events')
        .update({ current_volunteers: (selectedEvent.current_volunteers || 0) + 1 })
        .eq('id', formData.event_id);

      if (updateError) throw updateError;

      setRegistrations([data[0], ...registrations]);
      
      // Update local events state
      setEvents(events.map(event => 
        event.id === formData.event_id 
          ? { ...event, current_volunteers: (event.current_volunteers || 0) + 1 }
          : event
      ));

      setShowForm(false);
      toast.success('Registration submitted successfully!');
      
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setRegistrations(registrations.map(reg => 
        reg.id === id ? { ...reg, status: newStatus } : reg
      ));
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Find the registration to get event info
      const registration = registrations.find(r => r.id === id);
      
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Find the event and decrease volunteer count
      const event = events.find(e => e.title === registration?.event_name);
      if (event) {
        await supabase
          .from('events')
          .update({ current_volunteers: Math.max((event.current_volunteers || 0) - 1, 0) })
          .eq('id', event.id);

        // Update local events state
        setEvents(events.map(e => 
          e.id === event.id 
            ? { ...e, current_volunteers: Math.max((e.current_volunteers || 0) - 1, 0) }
            : e
        ));
      }

      setRegistrations(registrations.filter(reg => reg.id !== id));
      toast.success('Registration deleted successfully');
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error('Failed to delete registration');
    }
  };

  // Check if user is registered for an event
  const isRegisteredForEvent = (eventId) => {
    return registrations.some(r => r.event_name === events.find(e => e.id === eventId)?.title);
  };

  // Get spots left for an event
  const getSpotsLeft = (event) => {
    return (event.max_volunteers || 0) - (event.current_volunteers || 0);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'pending') return matchesSearch && reg.status === 'pending';
    if (filter === 'approved') return matchesSearch && reg.status === 'approved';
    if (filter === 'rejected') return matchesSearch && reg.status === 'rejected';
    return matchesSearch;
  });

  // Stats
  const totalRegistrations = registrations.length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const totalEvents = events.length;

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Volunteer Program</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Make a difference in our community</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-[#66b032] to-[#0057a8] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'Register as Volunteer'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-[#66b032] mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-[#66b032]">{totalRegistrations}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Total Registrations</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#0057a8] mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-[#0057a8]">{totalEvents}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Total Events</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Pending</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 text-center">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto mb-1 md:mb-2" />
            <p className="text-lg md:text-2xl font-bold text-green-500">{approvedCount}</p>
            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Approved</p>
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

        {/* Upcoming Events Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
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
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search registrations..."
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
                <option value="all">All Registrations</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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

        {/* Registrations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
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
                } gap-4 md:gap-6`}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 md:py-12"
              >
                <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2">No registrations found</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search' : 'Be the first to register for an event'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default Volunteer;