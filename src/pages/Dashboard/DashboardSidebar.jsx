import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiHome, 
    FiGrid, 
    FiUsers, 
    FiSettings, 
    FiPieChart, 
    FiLogOut,
    FiChevronLeft,
    FiMenu
} from 'react-icons/fi';

const DashboardSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', name: 'Overview', icon: FiHome },
        { path: '/dashboard/analytics', name: 'Analytics', icon: FiPieChart },
        { path: '/dashboard/management', name: 'Management', icon: FiGrid },
        { path: '/dashboard/riders', name: 'Riders', icon: FiUsers },
        { path: '/dashboard/settings', name: 'Settings', icon: FiSettings },
    ];

    return (
        <motion.div 
            animate={{ width: isCollapsed ? '80px' : '280px' }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-screen bg-white/80 backdrop-blur-md border-r border-indigo-100 flex flex-col justify-between relative shadow-[4px_0_24px_rgba(79,70,229,0.03)] select-none z-50 flex-shrink-0"
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-8 -right-3.5 bg-white border border-indigo-100 text-indigo-600 rounded-full p-1.5 hover:bg-indigo-50 shadow-md transition-all duration-200"
            >
                <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FiChevronLeft className="w-4 h-4" />
                </motion.div>
            </button>

            <div>
                {/* ===== ব্র্যান্ড লোগো সেকশন ===== */}
                <div className="h-24 flex items-center px-6 border-b border-indigo-50/50">
                    <Link to="/" className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                            S
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
                                >
                                    SaaSBoard
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* ===== নেভিগেশন মেনু লিঙ্কস ===== */}
                <nav className="p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link key={item.path} to={item.path} className="block relative">
                                <motion.div
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-colors relative z-10 ${
                                        isActive 
                                            ? 'text-white' 
                                            : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* একটিভ আইটেমের ব্যাকগ্রাউন্ড গ্রাডিয়েন্ট অ্যানিমেশন */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10 shadow-lg shadow-indigo-600/10"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}

                                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -5 }}
                                                className="whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* ===== বটম প্রোফাইল বা লগআউট সেকশন ===== */}
            <div className="p-4 border-t border-indigo-50/50">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <FiLogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600 flex-shrink-0" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                className="whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardSidebar;