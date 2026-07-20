import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    FiMoreVertical
} from 'react-icons/fi';
import ApplicationDetailsModal from './ApplicationDetailsModal';

const AllApplication = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [viewMode, setViewMode] = useState('card');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    
    const tabs = ['All', 'Applied', 'Assessment', 'Interview', 'Offered', 'Rejected'];

    const applications = [
        { id: 1, company: 'Google', title: 'Senior React Developer', source: 'LinkedIn', date: '2026-07-15', status: 'Interview', logo: 'G', color: 'from-cyan-500 to-blue-600', url: 'https://google.com/careers', notes: 'First round technical interview focused on system design and React performance optimization.' },
        { id: 2, company: 'TechVibe', title: 'Frontend Engineer', source: 'Indeed', date: '2026-07-18', status: 'Assessment', logo: '', color: 'from-amber-500 to-orange-500', url: 'https://techvibe.io/jobs', notes: 'Take-home assignment received. Need to build a production-ready dashboard within 48 hours.' },
        { id: 3, company: 'SaaSify Inc', title: 'UI/UX Designer', source: 'Referral', date: '2026-07-10', status: 'Offered', logo: 'S', color: 'from-emerald-500 to-green-600', url: '', notes: 'Received formal offer letter. Negotiating base salary and remote working allowance.' },
        { id: 4, company: 'Creatix Studio', title: 'Product Manager', source: 'Glassdoor', date: '2026-07-19', status: 'Applied', logo: '', color: 'from-indigo-600 to-purple-600', url: 'https://creatix.co', notes: 'Applied via company portal. Reached out to the hiring manager directly on LinkedIn.' },
        { id: 5, company: 'Quantum Labs', title: 'Full Stack Engineer', source: 'Website', date: '2026-07-05', status: 'Rejected', logo: 'Q', color: 'from-rose-500 to-red-600', url: '', notes: 'Automated rejection received after initial screening. Resume might need tailoring.' },
    ];

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

    const filteredApplications = applications.filter(app => {
        const matchesTab = activeTab === 'All' || app.status === activeTab;
        const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              app.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const toggleDropdown = (id, e) => {
        e.stopPropagation(); // কার্ডের ক্লিক ইভেন্ট আটকাবে
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    return (
        <div className="w-full min-h-screen px-6 py-8 text-gray-800" onClick={() => setActiveDropdown(null)}>
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

            {viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredApplications.map((app) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                            onClick={() => setSelectedApp(app)}
                            className="bg-white/95 backdrop-blur-md border-t-2 border-l-2 border-indigo-500/20 p-6 rounded-2xl flex flex-col justify-between shadow-[0_4px_20px_rgba(79,70,229,0.02)] relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${app.color} opacity-[0.02] group-hover:opacity-[0.06] rounded-full blur-xl group-hover:scale-150 transition-all duration-500`} />

                            <div>
                                <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                                    {app.logo ? (
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/5 group-hover:scale-105 transition-transform duration-300`}>
                                            {app.logo}
                                        </div>
                                    ) : (
                                        <div className="w-11 h-11 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-50 transition-colors duration-300">
                                            <FiBriefcase className="w-4 h-4" />
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1 relative" onClick={(e) => e.stopPropagation()}>
                                        <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                        <button 
                                            onClick={(e) => toggleDropdown(app.id, e)}
                                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors z-20 focus:outline-none"
                                        >
                                            <FiMoreVertical className="w-4 h-4" />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {activeDropdown === app.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute right-0 top-8 w-36 bg-white border border-indigo-50 rounded-xl shadow-xl py-1 z-30"
                                                >
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedApp(app);
                                                            setActiveDropdown(null);
                                                        }} 
                                                        className="w-full px-4 py-2 text-left text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 font-medium"
                                                    >
                                                        <FiEye className="w-3.5 h-3.5" /> View Details
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-left text-xs text-gray-600 hover:bg-amber-50 hover:text-amber-600 flex items-center gap-2 font-medium">
                                                        <FiEdit2 className="w-3.5 h-3.5" /> Edit Info
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-gray-50 mt-1">
                                                        <FiTrash2 className="w-3.5 h-3.5" /> Delete Application
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-5 relative z-10">
                                    <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1 flex items-center gap-1 justify-between">
                                        {app.title}
                                        <FiArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-500 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 flex-shrink-0" />
                                    </h3>
                                    <p className="text-gray-400 text-xs font-semibold line-clamp-1">{app.company}</p>
                                </div>
                            </div>

                            {/* Footer Area: Added app.date back right next to source info */}
                            <div className="space-y-3 pt-4 border-t border-indigo-50/60 relative z-10">
                                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold等">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-indigo-50/40 transition-colors">
                                        <FiGlobe className="w-3.5 h-3.5 text-indigo-400" /> {app.source}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-indigo-50/40 transition-colors">
                                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" /> {app.date}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {filteredApplications.map((app) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ x: 4 }}
                            onClick={() => setSelectedApp(app)}
                            className="bg-white/95 backdrop-blur-md border-t-2 border-l-2 border-indigo-500/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_2px_10px_rgba(79,70,229,0.01)] group cursor-pointer relative"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {app.logo ? (
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/5`}>
                                        {app.logo}
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center text-indigo-500">
                                        <FiBriefcase className="w-4 h-4" />
                                    </div>
                                )}

                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-indigo-600 transition-colors">
                                        {app.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs font-semibold">{app.company}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 flex-1 md:justify-end">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                    <FiGlobe className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{app.source}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                    <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{app.date}</span>
                                </div>

                                <div className="flex items-center">
                                    <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-end col-span-2 md:col-span-1 relative" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={(e) => toggleDropdown(app.id, e)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors focus:outline-none"
                                    >
                                        <FiMoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {activeDropdown === app.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 top-8 w-36 bg-white border border-indigo-50 rounded-xl shadow-xl py-1 z-30"
                                            >
                                                <button 
                                                    onClick={() => {
                                                        setSelectedApp(app);
                                                        setActiveDropdown(null);
                                                    }} 
                                                    className="w-full px-4 py-2 text-left text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 font-medium"
                                                >
                                                    <FiEye className="w-3.5 h-3.5" /> View Details
                                                </button>
                                                <button className="w-full px-4 py-2 text-left text-xs text-gray-600 hover:bg-amber-50 hover:text-amber-600 flex items-center gap-2 font-medium">
                                                    <FiEdit2 className="w-3.5 h-3.5" /> Edit Info
                                                </button>
                                                <button className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-gray-50 mt-1">
                                                    <FiTrash2 className="w-3.5 h-3.5" /> Delete Application
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

            {filteredApplications.length === 0 && (
                <div className="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-dashed border-indigo-100">
                    <FiBriefcase className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-medium">No applications found matching your filters.</p>
                </div>
            )}

            <ApplicationDetailsModal 
                isOpen={!!selectedApp} 
                onClose={() => setSelectedApp(null)} 
                application={selectedApp}
                getStatusStyle={getStatusStyle}
            />
        </div>
    );
};

export default AllApplication;