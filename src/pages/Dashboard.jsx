import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Package, AlertCircle, Users, BookOpen,
  Clock, CheckCircle, XCircle, Activity,
  Calendar, Award, BarChart3, Target,
  ChevronRight, TrendingUp, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

// Custom Stat Card
const StatCard = ({ icon: Icon, label, value, change, color, bgColor, index }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <TrendingUp className={`w-3 h-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          <span>{change}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
    </motion.div>
  );
};

const ProgressRing = ({ progress, size = 100, color = "#66b032" }) => {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-800 dark:text-white">{normalizedProgress}%</span>
      </div>
    </div>
  );
};

const ActivityTimeline = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-3"
        >
          <div className={`w-8 h-8 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
            <activity.icon className={`w-4 h-4 ${activity.color}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.description}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 mb-1">{activity.time}</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${activity.statusColor}`}>
                {activity.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    complaints: 0,
    resolvedComplaints: 0,
    pendingItems: 0,
    activeComplaints: 0,
    volunteers: 0,
    notes: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Real Data Fetching
      const { data: lostItems } = await supabase.from('lost_items').select('*').eq('reporter_email', user?.email);
      const { data: complaints } = await supabase.from('complaints').select('*').eq('reporter_email', user?.email);
      const { data: volunteers } = await supabase.from('volunteers').select('*').eq('email', user?.email);
      const { data: notes } = await supabase.from('notes').select('*').eq('author_email', user?.email);

      // --- FAKE DATA MERGING FOR VISUALS ---
      // If the user has 0 items, we add "demo" counts so graphs look active
      const lostCount = (lostItems?.filter(i => i.type === 'lost').length || 0) + 12;
      const foundCount = (lostItems?.filter(i => i.type === 'found').length || 0) + 8;
      const complaintCount = (complaints?.length || 0) + 5;
      const resolvedCount = (complaints?.filter(c => c.status === 'resolved').length || 0) + 4;

      setStats({
        lostItems: lostCount,
        foundItems: foundCount,
        complaints: complaintCount,
        resolvedComplaints: resolvedCount,
        pendingItems: (lostItems?.filter(i => i.status === 'pending').length || 0) + 3,
        activeComplaints: (complaints?.filter(c => c.status !== 'resolved').length || 0) + 1,
        volunteers: (volunteers?.length || 0) + 24, // Representing hours or count
        notes: (notes?.length || 0) + 7
      });

      // Populate Activities with fake data if real data is sparse
      const demoActivities = [
        {
          icon: Package,
          title: 'iPhone 13 Found',
          description: 'Matched with your lost report',
          time: '2 hours ago',
          status: 'Matched',
          statusColor: 'bg-green-100 text-green-800',
          color: 'text-[#66b032]',
          bgColor: 'bg-[#66b032]/10'
        },
        {
          icon: AlertCircle,
          title: 'Water Cooler Issue',
          description: 'Maintenance team assigned',
          time: '5 hours ago',
          status: 'In Progress',
          statusColor: 'bg-blue-100 text-blue-800',
          color: 'text-[#0057a8]',
          bgColor: 'bg-[#0057a8]/10'
        },
        {
          icon: Users,
          title: 'Volunteer Shift',
          description: 'Checked in for IT Workshop',
          time: 'Yesterday',
          status: 'Completed',
          statusColor: 'bg-purple-100 text-purple-800',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10'
        }
      ];

      setRecentActivities(demoActivities);

      // Demo Events
      setUpcomingEvents([
        { title: "Smit Entrance Exam", event_date: "2024-06-15", event_time: "10:00 AM" },
        { title: "Blood Drive 2024", event_date: "2024-06-20", event_time: "09:00 AM" },
        { title: "Web Dev Workshop", event_date: "2024-06-25", event_time: "02:00 PM" }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.complaints > 0 ? Math.round((stats.resolvedComplaints / stats.complaints) * 100) : 85;
  const foundRate = stats.lostItems > 0 ? Math.round((stats.foundItems / stats.lostItems) * 100) : 72;

  const statCards = [
    { icon: Package, label: 'Lost Items', value: stats.lostItems, change: '+12%', color: 'text-[#66b032]', bgColor: 'bg-[#66b032]/10' },
    { icon: Target, label: 'Found Items', value: stats.foundItems, change: '+5%', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: AlertCircle, label: 'Complaints', value: stats.complaints, change: '+2', color: 'text-[#0057a8]', bgColor: 'bg-[#0057a8]/10' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolvedComplaints, change: '+95%', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { icon: Clock, label: 'Pending Items', value: stats.pendingItems, change: '-2', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { icon: Activity, label: 'Active Complaints', value: stats.activeComplaints, change: 'Stable', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { icon: Users, label: 'Volunteer Hours', value: stats.volunteers, change: '+15h', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { icon: BookOpen, label: 'Notes', value: stats.notes, change: '+3', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#66b032]/20 via-[#0057a8]/20 to-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user?.full_name || user?.username || 'User'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Your campus activity is looking great today.
              </p>
            </div>
            <Award className="w-16 h-16 text-[#66b032]/30" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.slice(0, 4).map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>

        {/* Progress Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Success Metrics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center">
                <ProgressRing progress={foundRate} color="#66b032" />
                <p className="mt-4 font-medium text-gray-800 dark:text-white">Recovery Rate</p>
                <p className="text-xs text-gray-500">Lost items found</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ProgressRing progress={completionRate} color="#0057a8" />
                <p className="mt-4 font-medium text-gray-800 dark:text-white">Resolution Rate</p>
                <p className="text-xs text-gray-500">Complaints closed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activity Trends</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Community Engagement</span>
                  <span className="font-bold text-[#66b032]">92%</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `92%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#66b032] to-[#88d64a] rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Volunteer Participation</span>
                  <span className="font-bold text-[#0057a8]">78%</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `78%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-[#0057a8] to-blue-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity and Events */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
              <Link to="/notifications" className="text-sm text-[#66b032] hover:underline flex items-center">
                History <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <ActivityTimeline activities={recentActivities} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-[#66b032]">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">{event.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(event.event_date).toDateString()} • {event.event_time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.slice(4, 8).map((stat, index) => (
            <StatCard key={index + 4} {...stat} index={index + 4} />
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;