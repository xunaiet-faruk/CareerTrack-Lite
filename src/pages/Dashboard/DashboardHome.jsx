import { motion } from 'framer-motion';
import { useContext, useState, useEffect } from 'react';
import { 
    FiFileText, 
    FiHeart, 
    FiCheckCircle, 
    FiAward, 
    FiCalendar, 
    FiXCircle, 
    FiBriefcase,
    FiClock,
    FiArrowUpRight,
    FiSearch,
    FiLoader
} from 'react-icons/fi';
import OverviewChart from './DashboardRoutes/OverviewChart';
import { Authcontext } from '../../context/Authprovider';
import Useaxios from '../../hooks/Useaxios';


const DashboardHome = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
            case 'Saved': return 'bg-pink-50 text-pink-600 border-pink-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const stats = [
        { id: 1, label: 'Total Applications', count: applications.length, icon: FiFileText, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/10' },
        { id: 2, label: 'Saved Jobs', count: applications.filter(app => app.status === 'Saved').length, icon: FiHeart, color: 'from-pink-500 to-rose-500', shadow: 'shadow-rose-500/10' },
        { id: 3, label: 'Applied Jobs', count: applications.filter(app => app.status === 'Applied').length, icon: FiBriefcase, color: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-500/10' },
        { id: 4, label: 'Assessments', count: applications.filter(app => app.status === 'Assessment').length, icon: FiAward, color: 'from-amber-500 to-orange-500', shadow: 'shadow-orange-500/10' },
        { id: 5, label: 'Interviews', count: applications.filter(app => app.status === 'Interview').length, icon: FiCalendar, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/10' },
        { id: 6, label: 'Rejections', count: applications.filter(app => app.status === 'Rejected').length, icon: FiXCircle, color: 'from-red-500 to-red-600', shadow: 'shadow-red-500/10' },
        { id: 7, label: 'Offers', count: applications.filter(app => app.status === 'Offered').length, icon: FiCheckCircle, color: 'from-emerald-500 to-green-600', shadow: 'shadow-green-500/10' },
    ];

    const filteredApplications = applications.filter(app => {
        const search = searchQuery.toLowerCase();
        return app.companyName?.toLowerCase().includes(search) || 
               app.jobTitle?.toLowerCase().includes(search);
    });

    const recentApplications = filteredApplications.slice(0, 5);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <FiLoader className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen px-6 py-8 text-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Welcome Back, {user?.displayName || 'Chief'}!
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Here is a quick overview of your career pipeline today.</p>
                </div>
                
                <div className="relative max-w-xs w-full">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search applications..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white/70 backdrop-blur-md border border-indigo-100 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-10"
            >
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.id}
                            variants={cardVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`bg-white/80 backdrop-blur-md border border-indigo-50 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-sm ${stat.shadow} cursor-pointer group`}
                        >
                            <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-500`} />

                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/10`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <FiArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stat.count}</h3>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5 whitespace-nowrap">{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
                    className="bg-white/80 backdrop-blur-md border border-indigo-50 rounded-3xl p-6 shadow-sm shadow-indigo-600/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                            <h2 className="text-xl font-bold text-gray-900">Recently Added Applications</h2>
                        </div>
                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors">
                            View All
                        </button>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm font-medium">No applications found</p>
                            <p className="text-gray-300 text-xs mt-1">Start adding your job applications</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-indigo-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                        <th className="pb-3 pl-2">Role & Company</th>
                                        <th className="pb-3">Source</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3 pr-2 text-right">Added Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50/50">
                                    {recentApplications.map((app) => (
                                        <tr key={app._id} className="group hover:bg-indigo-50/20 transition-colors duration-200">
                                            <td className="py-4 pl-2">
                                                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{app.jobTitle}</div>
                                                <div className="text-xs text-gray-400 font-medium mt-0.5">{app.companyName}</div>
                                            </td>
                                            
                                            <td className="py-4">
                                                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                                                    {app.source || 'N/A'}
                                                </span>
                                            </td>

                                            <td className="py-4">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>

                                            <td className="py-4 pr-2 text-right text-xs font-medium text-gray-400">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {app.appDate || 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
            <OverviewChart applications={applications} />
        </div>
    );
};

export default DashboardHome;