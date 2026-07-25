import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiExternalLink, FiClock, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Useaxios from '../../../hooks/Useaxios';
import { Authcontext } from './../../../context/Authprovider';

const Applied = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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
                // Filter only "Applied" status applications
                const appliedApps = res.data.filter(app => app.status === 'Applied');
                setApplications(appliedApps);
                setFilteredApps(appliedApps);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    // Search filter
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

    // Status badge color
    const getStatusColor = (status) => {
        const colors = {
            'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
            'Saved': 'bg-gray-100 text-gray-700 border-gray-200',
            'Assessment': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Interview': 'bg-purple-100 text-purple-700 border-purple-200',
            'Offered': 'bg-green-100 text-green-700 border-green-200',
            'Rejected': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500">Loading applied applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FiBriefcase className="text-indigo-600" />
                        Applied Applications
                        <span className="text-sm font-normal bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                            {filteredApps.length} {filteredApps.length === 1 ? 'Application' : 'Applications'}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1">Track all your applied job applications in one place</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search by company or job title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Applications Grid */}
                {filteredApps.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                    >
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-700">No Applied Applications</h3>
                        <p className="text-gray-500 mt-2">
                            {searchTerm ? 'No results match your search' : 'You haven\'t applied to any jobs yet'}
                        </p>
                        {!searchTerm && (
                            <button 
                                onClick={() => window.location.href = '/add-application'}
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Add Your First Application
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredApps.map((app, index) => (
                            <motion.div
                                key={app._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 group"
                            >
                                {/* Company & Job Title */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">
                                            {app.companyName || 'Unknown Company'}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                            <FiBriefcase className="text-indigo-500 flex-shrink-0" />
                                            {app.jobTitle || 'Position not specified'}
                                        </p>
                                    </div>
                                    {app.jobUrl && (
                                        <a 
                                            href={app.jobUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0 ml-2"
                                        >
                                            <FiExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                                        {app.status || 'Applied'}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm">
                                    {app.source && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-gray-400">📌</span>
                                            <span>Source: {app.source}</span>
                                        </div>
                                    )}
                                    {app.appDate && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FiCalendar className="text-gray-400" />
                                            <span>Applied: {formatDate(app.appDate)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Notes (if any) */}
                                {app.notes && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            📝 {app.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Time ago */}
                                {app.appDate && (
                                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                                        <FiClock className="w-3 h-3" />
                                        <span>Applied {new Date(app.appDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applied;