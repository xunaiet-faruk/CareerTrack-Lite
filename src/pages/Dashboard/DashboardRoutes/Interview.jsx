import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FiCalendar, 
    FiBriefcase, 
    FiExternalLink, 
    FiClock, 
    FiFilter,
    FiUsers,
    FiMessageCircle,
    FiCheckCircle,
    FiAlertCircle,
    FiTrendingUp,
    FiStar,
    FiAward,
    FiMail
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Authcontext } from '../../../context/Authprovider';
import Useaxios from '../../../hooks/Useaxios';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';

const Interview = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingReminder, setSendingReminder] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/application?email=${user.email}`);
            
            if (res.data) {
                const interviewApps = res.data.filter(app => app.status === 'Interview');
                setApplications(interviewApps);
                setFilteredApps(interviewApps);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load interview applications');
        } finally {
            setLoading(false);
        }
    };

    // Send Reminder Function
    const handleSendReminder = async (applicationId) => {
        try {
            setSendingReminder(applicationId);
            const response = await axios.post('/api/send-reminder', { 
                applicationId: applicationId 
            });
            
            if (response.data.success) {
                toast.success(`📧 Reminder sent successfully to ${user.email}`);
            }
        } catch (error) {
            console.error('Error sending reminder:', error);
            toast.error(error.response?.data?.error || 'Failed to send reminder');
        } finally {
            setSendingReminder(null);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = applications.filter(app => 
                app.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredApps(filtered);
        } else {
            setFilteredApps(applications);
        }
    }, [searchTerm, applications]);

    const getStatusColor = (status) => {
        const colors = {
            'Applied': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'Saved': 'bg-gray-50 text-gray-700 border-gray-200',
            'Assessment': 'bg-amber-50 text-amber-700 border-amber-200',
            'Interview': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'Offered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Rejected': 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getInterviewStage = (notes) => {
        if (!notes) return '📅';
        const lowerNotes = notes.toLowerCase();
        if (lowerNotes.includes('first') || lowerNotes.includes('1st')) return '1️⃣';
        if (lowerNotes.includes('second') || lowerNotes.includes('2nd')) return '2️⃣';
        if (lowerNotes.includes('third') || lowerNotes.includes('3rd')) return '3️⃣';
        if (lowerNotes.includes('final')) return '🏆';
        if (lowerNotes.includes('technical')) return '💻';
        if (lowerNotes.includes('hr')) return '👥';
        return '📅';
    };

    const getProgressColor = (notes) => {
        if (!notes) return 'indigo';
        const lowerNotes = notes.toLowerCase();
        if (lowerNotes.includes('final')) return 'emerald';
        if (lowerNotes.includes('third') || lowerNotes.includes('3rd')) return 'blue';
        if (lowerNotes.includes('second') || lowerNotes.includes('2nd')) return 'indigo';
        if (lowerNotes.includes('first') || lowerNotes.includes('1st')) return 'amber';
        return 'indigo';
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="w-full min-h-screen px-4 sm:px-6 py-8 bg-gray-50/30">
            <div className="max-w-7xl mx-auto">
                {/* Header Section with Stats */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-xl">
                                    <FiUsers className="text-indigo-600 text-xl" />
                                </div>
                                Interview Pipeline
                                <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                    {filteredApps.length} {filteredApps.length === 1 ? 'Interview' : 'Interviews'}
                                </span>
                            </h1>
                            <p className="text-gray-500 mt-1 ml-2">Track and prepare for your upcoming interviews</p>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                <FiTrendingUp className="text-emerald-500" />
                                <span className="text-sm text-gray-600">
                                    {filteredApps.length > 0 ? `${filteredApps.length} Active` : 'No Active'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                <FiAward className="text-amber-500" />
                                <span className="text-sm text-gray-600">
                                    {filteredApps.filter(app => app.notes?.toLowerCase().includes('final')).length} Final
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search companies or positions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-11 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                        />
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {filteredApps.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <div className="text-7xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-700">No Interviews Scheduled</h3>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            {searchTerm ? 'No results match your search criteria' : 'Start applying to jobs and schedule interviews to track them here'}
                        </p>
                        {!searchTerm && (
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/add-application'}
                                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                            >
                                Add New Application
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredApps.map((app, index) => (
                            <motion.div
                                key={app._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                            >
                                {/* Top gradient bar */}
                                <div className="h-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>

                                <div className="p-5">
                                    {/* Company & Job Title */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-indigo-600 text-sm font-bold">
                                                        {app.companyName?.charAt(0).toUpperCase() || 'C'}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-800 truncate">
                                                    {app.companyName || 'Unknown Company'}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 ml-10 truncate flex items-center gap-1">
                                                <FiBriefcase className="text-indigo-400 flex-shrink-0" />
                                                {app.jobTitle || 'Position not specified'}
                                            </p>
                                        </div>
                                        {app.jobUrl && (
                                            <a 
                                                href={app.jobUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0 p-1 hover:bg-indigo-50 rounded-lg"
                                            >
                                                <FiExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Status & Stage */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                                            {app.status || 'Interview'}
                                        </span>
                                        {app.notes && (
                                            <span className="text-xl" title={app.notes}>
                                                {getInterviewStage(app.notes)}
                                            </span>
                                        )}
                                        {/* Progress indicator */}
                                        {app.notes && (
                                            <div className="flex-1">
                                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-${getProgressColor(app.notes)}-500 rounded-full transition-all duration-500`}
                                                        style={{ 
                                                            width: app.notes.toLowerCase().includes('first') ? '25%' :
                                                                   app.notes.toLowerCase().includes('second') ? '50%' :
                                                                   app.notes.toLowerCase().includes('third') ? '75%' :
                                                                   app.notes.toLowerCase().includes('final') ? '100%' : '25%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 text-sm">
                                        {app.source && (
                                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                                                <span className="text-gray-400 text-xs">📌</span>
                                                <span className="text-xs">Source: {app.source}</span>
                                            </div>
                                        )}
                                        {app.appDate && (
                                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                                                <FiCalendar className="text-gray-400 text-xs" />
                                                <span className="text-xs">Applied: {formatDate(app.appDate)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {app.notes && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg">
                                                <FiMessageCircle className="text-indigo-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {app.notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer with Send Reminder Button */}
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <FiClock className="w-3 h-3" />
                                            <span>Applied {new Date(app.appDate).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSendReminder(app._id)}
                                                disabled={sendingReminder === app._id}
                                                className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                                            >
                                                {sendingReminder === app._id ? (
                                                    <>
                                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                        </svg>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiMail className="w-3 h-3" />
                                                        Send Reminder
                                                    </>
                                                )}
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    toast.info('Update interview status feature coming soon!');
                                                }}
                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 px-3 py-1 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <FiCheckCircle className="w-3 h-3" />
                                                Update
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interview;