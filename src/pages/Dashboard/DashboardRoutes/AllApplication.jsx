import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
    FiSearch, 
    FiFilter, 
    FiEye, 
    FiEdit2, 
    FiTrash2, 
    FiBriefcase,
    FiCalendar,
    FiGlobe,
    FiGrid,
    FiList,
    FiArrowUpRight,
    FiMoreVertical,
    FiLoader,
    FiX,
    FiCheck,
    FiInfo
} from 'react-icons/fi';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import Useaxios from '../../../hooks/Useaxios';
import { Authcontext } from '../../../context/Authprovider';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';
import EditApplicationModal from './EditApplicationModal';

const AllApplication = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [viewMode, setViewMode] = useState('card');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [editApp, setEditApp] = useState(null);
    const [actionApp, setActionApp] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    
    const tabs = ['All', 'Applied', 'Assessment', 'Interview', 'Offered', 'Rejected'];

    useEffect(() => {
        if (user?.email) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/application?email=${user?.email}`);
            setApplications(res.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Interview': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
            case 'Assessment': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Offered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Applied': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getInitials = (company) => {
        if (!company) return 'C';
        const words = company.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return company.substring(0, 2).toUpperCase();
    };

    const getColor = (company) => {
        const colors = [
            'from-cyan-500 to-blue-600',
            'from-amber-500 to-orange-500',
            'from-emerald-500 to-green-600',
            'from-indigo-600 to-purple-600',
            'from-rose-500 to-red-600',
            'from-pink-500 to-rose-500',
            'from-violet-500 to-purple-600',
            'from-teal-500 to-emerald-600'
        ];
        let hash = 0;
        if (company) {
            for (let i = 0; i < company.length; i++) {
                hash = company.charCodeAt(i) + ((hash << 5) - hash);
            }
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const filteredApplications = applications.filter(app => {
        const matchesTab = activeTab === 'All' || app.status === activeTab;
        const matchesSearch = app.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const toggleDropdown = (id, e) => {
        e.stopPropagation(); 
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const openActionMenu = (app, e) => {
        e.stopPropagation();
        setActionApp(app);
        setShowActionMenu(true);
        setActiveDropdown(null);
    };

    const closeActionMenu = () => {
        setShowActionMenu(false);
        setActionApp(null);
    };

    const handleViewDetails = (app, e) => {
        e.stopPropagation();
        setSelectedApp(app);
        closeActionMenu();
    };

    const handleEditClick = (app, e) => {
        e.stopPropagation();
        setEditApp(app);
        closeActionMenu();
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        closeActionMenu();
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await axios.delete(`/application/${id}`);
                setApplications(prev => prev.filter(app => app._id !== id));
                setActiveDropdown(null);
                toast.success('✅ Application deleted successfully!');
            } catch (error) {
                console.error('Error deleting application:', error);
                toast.error('❌ Failed to delete application!');
            }
        }
    };

    const handleEditSuccess = (updatedApp) => {
        setApplications(prev => prev.map(app => 
            app._id === updatedApp._id ? updatedApp : app
        ));
        setEditApp(null);
        toast.success('✅ Application updated successfully!');
    };

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <div className="w-full min-h-screen px-6 py-8 text-gray-800" onClick={closeActionMenu}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        All Applications
                    </h1>
                    <p className="text-gray-400 text-xs mt-1">Manage and track your absolute career pipeline milestones.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:flex-initial sm:w-64">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search company or role..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-indigo-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    
                    <div className="bg-indigo-50/50 p-1 rounded-xl flex items-center border border-indigo-100/30">
                        <button 
                            onClick={() => setViewMode('card')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <FiGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <FiList className="w-4 h-4" />
                        </button>
                    </div>

                    <button className="p-3 bg-white/80 backdrop-blur-md border border-indigo-50 rounded-xl text-gray-500 hover:text-indigo-600 transition-colors">
                        <FiFilter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-indigo-50/50 scrollbar-none">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-600/10' 
                            : 'bg-white text-gray-500 border-indigo-50 hover:border-indigo-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {filteredApplications.length === 0 ? (
                <div className="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-dashed border-indigo-100">
                    <FiBriefcase className="w-8 h-8 text-red-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-medium">No applications found matching your filters.</p>
                </div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredApplications.map((app) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                            className="bg-white/95 backdrop-blur-md border-t-2 border-l-2 border-indigo-500/20 p-6 rounded-2xl flex flex-col justify-between shadow-[0_4px_20px_rgba(79,70,229,0.02)] relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${getColor(app.companyName)} opacity-[0.02] group-hover:opacity-[0.06] rounded-full blur-xl group-hover:scale-150 transition-all duration-500`} />

                            <div>
                                <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getColor(app.companyName)} flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/5 group-hover:scale-105 transition-transform duration-300`}>
                                        {getInitials(app.companyName)}
                                    </div>
                                    
                                    <div className="flex items-center gap-1 relative" onClick={(e) => e.stopPropagation()}>
                                        <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                        <button 
                                            onClick={(e) => openActionMenu(app, e)}
                                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors z-20 focus:outline-none"
                                        >
                                            <FiMoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-5 relative z-10">
                                    <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1 flex items-center gap-1 justify-between">
                                        {app.jobTitle}
                                        <FiArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-500 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 flex-shrink-0" />
                                    </h3>
                                    <p className="text-gray-400 text-xs font-semibold line-clamp-1">{app.companyName}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-indigo-50/60 relative z-10">
                                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-indigo-50/40 transition-colors">
                                        <FiGlobe className="w-3.5 h-3.5 text-indigo-400" /> {app.source || 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-indigo-50/40 transition-colors">
                                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" /> {app.appDate || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showActionMenu && actionApp?._id === app._id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center z-40"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={closeActionMenu}
                                            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>

                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${getColor(app.companyName)} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                                                {getInitials(app.companyName)}
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg">{app.jobTitle}</h3>
                                            <p className="text-gray-400 text-sm">{app.companyName}</p>
                                            
                                            <div className="grid grid-cols-3 gap-3 w-full mt-2">
                                                <button
                                                    onClick={(e) => handleViewDetails(app, e)}
                                                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors group"
                                                >
                                                    <FiEye className="w-5 h-5 text-indigo-600" />
                                                    <span className="text-[10px] font-semibold text-indigo-600">View</span>
                                                </button>
                                                <button
                                                    onClick={(e) => handleEditClick(app, e)}
                                                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors group"
                                                >
                                                    <FiEdit2 className="w-5 h-5 text-amber-600" />
                                                    <span className="text-[10px] font-semibold text-amber-600">Edit</span>
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(app._id, e)}
                                                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors group"
                                                >
                                                    <FiTrash2 className="w-5 h-5 text-rose-600" />
                                                    <span className="text-[10px] font-semibold text-rose-600">Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {filteredApplications.map((app) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ x: 4 }}
                            className="bg-white/95 backdrop-blur-md border-t-2 border-l-2 border-indigo-500/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_2px_10px_rgba(79,70,229,0.01)] group relative"
                        >
                            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setSelectedApp(app)}>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getColor(app.companyName)} flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/5`}>
                                    {getInitials(app.companyName)}
                                </div>

                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-indigo-600 transition-colors">
                                        {app.jobTitle}
                                    </h3>
                                    <p className="text-gray-400 text-xs font-semibold">{app.companyName}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 flex-1 md:justify-end">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                    <FiGlobe className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{app.source || 'N/A'}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                    <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{app.appDate || 'N/A'}</span>
                                </div>

                                <div className="flex items-center">
                                    <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-end col-span-2 md:col-span-1 relative" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={(e) => openActionMenu(app, e)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors focus:outline-none"
                                    >
                                        <FiMoreVertical className="w-4 h-4" />
                                    </button>

                                    <AnimatePresence>
                                        {showActionMenu && actionApp?._id === app._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 top-10 w-48 bg-white border border-indigo-50 rounded-xl shadow-xl py-1 z-30"
                                            >
                                                <button 
                                                    onClick={(e) => handleViewDetails(app, e)}
                                                    className="w-full px-4 py-2.5 text-left text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 font-medium"
                                                >
                                                    <FiEye className="w-4 h-4" /> View Details
                                                </button>
                                                <button 
                                                    onClick={(e) => handleEditClick(app, e)}
                                                    className="w-full px-4 py-2.5 text-left text-xs text-gray-600 hover:bg-amber-50 hover:text-amber-600 flex items-center gap-3 font-medium"
                                                >
                                                    <FiEdit2 className="w-4 h-4" /> Edit Info
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(app._id, e)}
                                                    className="w-full px-4 py-2.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-3 font-medium border-t border-gray-50 mt-1"
                                                >
                                                    <FiTrash2 className="w-4 h-4" /> Delete Application
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <ApplicationDetailsModal 
                isOpen={!!selectedApp} 
                onClose={() => setSelectedApp(null)} 
                application={selectedApp}
                getStatusStyle={getStatusStyle}
            />

            <EditApplicationModal
                isOpen={!!editApp}
                onClose={() => setEditApp(null)}
                application={editApp}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default AllApplication;