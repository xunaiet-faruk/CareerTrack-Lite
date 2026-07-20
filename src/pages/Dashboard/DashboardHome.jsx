import { motion } from 'framer-motion';
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
    FiSearch
} from 'react-icons/fi';
import OverviewChart from './DashboardRoutes/OverviewChart';


const DashboardHome = () => {
    const stats = [
        { id: 1, label: 'Total Applications', count: 148, icon: FiFileText, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/10' },
        { id: 2, label: 'Saved Jobs', count: 32, icon: FiHeart, color: 'from-pink-500 to-rose-500', shadow: 'shadow-rose-500/10' },
        { id: 3, label: 'Applied Jobs', count: 86, icon: FiBriefcase, color: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-500/10' },
        { id: 4, label: 'Assessments', count: 12, icon: FiAward, color: 'from-amber-500 to-orange-500', shadow: 'shadow-orange-500/10' },
        { id: 5, label: 'Interviews', count: 8, icon: FiCalendar, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/10' },
        { id: 6, label: 'Rejections', count: 14, icon: FiXCircle, color: 'from-red-500 to-red-600', shadow: 'shadow-red-500/10' },
        { id: 7, label: 'Offers', count: 3, icon: FiCheckCircle, color: 'from-emerald-500 to-green-600', shadow: 'shadow-green-500/10' },
    ];

    // Recently Added Applications-এর স্ট্যাটিক ডেটা লিস্ট
    const recentApplications = [
        { id: '1', role: 'Frontend Engineer', company: 'TechVibe Solutions', date: '2 hours ago', status: 'Interview', type: 'Remote', salary: '$45k - $60k' },
        { id: '2', role: 'UI/UX Designer', company: 'Creatix Studio', date: '5 hours ago', status: 'Assessment', type: 'Hybrid', salary: '$35k - $50k' },
        { id: '3', role: 'React Developer', company: 'SaaSify Inc', date: '1 day ago', status: 'Applied', type: 'Full-time', salary: '$55k - $70k' },
        { id: '4', role: 'Product Manager', company: 'Quantum Labs', date: '2 days ago', status: 'Saved', type: 'Remote', salary: '$80k - $100k' },
    ];

    // Framer Motion অ্যানিমেশন ভেরিয়েন্ট
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

    // স্ট্যাটাস ব্যাজের থিম কালার সিলেক্টর
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Interview': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
            case 'Assessment': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Applied': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Saved': return 'bg-pink-50 text-pink-600 border-pink-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="w-full min-h-screen px-6 py-8 text-gray-800">
            {/* ===== টপ হেডার সেকশন ===== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Welcome Back, Chief!
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Here is a quick overview of your career pipeline today.</p>
                </div>
                
                {/* সার্চ বার (ইউজার ফ্রেন্ডলি ফিল দেওয়ার জন্য) */}
                <div className="relative max-w-xs w-full">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search applications..." 
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

                    {/* টেবিল / লিস্ট ইন্টারফেস */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-indigo-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Role & Company</th>
                                    <th className="pb-3">Salary Matrix</th>
                                    <th className="pb-3">Environment</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 pr-2 text-right">Added Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-50/50">
                                {recentApplications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-indigo-50/20 transition-colors duration-200">
                                        {/* রোল ও কোম্পানি নাম */}
                                        <td className="py-4 pl-2">
                                            <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{app.role}</div>
                                            <div className="text-xs text-gray-400 font-medium mt-0.5">{app.company}</div>
                                        </td>
                                        
                                        {/* স্যালারি রেঞ্জ */}
                                        <td className="py-4 text-sm font-medium text-gray-600">
                                            {app.salary}
                                        </td>

                                        {/* এনভায়রনমেন্ট (Remote/Hybrid) */}
                                        <td className="py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                                                {app.type}
                                            </span>
                                        </td>

                                        {/* অ্যাপ্লিকেশন স্ট্যাটাস */}
                                        <td className="py-4">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>

                                        {/* সময় কাল (Time/Clock icon) */}
                                        <td className="py-4 pr-2 text-right text-xs font-medium text-gray-400">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <FiClock className="w-3.5 h-3.5" />
                                                {app.date}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
            <OverviewChart/>
        </div>
    );
};

export default DashboardHome;