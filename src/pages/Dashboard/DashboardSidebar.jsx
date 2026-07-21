import { useState, useContext } from 'react';
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
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiBarChart2
} from 'react-icons/fi';
import { Authcontext } from '../../context/Authprovider';

const DashboardSidebar = () => {
    const { user, logOut } = useContext(Authcontext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const getUserInitial = () => {
        if (user?.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const getUserName = () => {
        if (user?.displayName) {
            return user.displayName;
        }
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    const getUserEmail = () => {
        return user?.email || 'user@example.com';
    };

    const getProfilePhoto = () => {
        return user?.photoURL || null;
    };

    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: FiHome, emoji: '📊' },
        { path: '/dashboard/add-application', name: 'Add Application', icon: FiPieChart, emoji: '➕' },
        { path: '/dashboard/all-applications', name: 'All Applications', icon: FiGrid, emoji: '📋' },
        { path: '/dashboard/applied', name: 'Applied', icon: FiFileText, emoji: '📤' },
        { path: '/dashboard/interview', name: 'Interview', icon: FiUsers, emoji: '🎯' },
        { path: '/dashboard/offers', name: 'Offers', icon: FiCheckCircle, emoji: '🎉' },
        { path: '/dashboard/rejected', name: 'Rejected', icon: FiClock, emoji: '❌' },
        { path: '/dashboard/analytics', name: 'Analytics', icon: FiBarChart2, emoji: '📈' },
        { path: '/dashboard/settings', name: 'Settings', icon: FiSettings, emoji: '⚙️' },
    ];

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <motion.div 
            animate={{ width: isCollapsed ? '80px' : '280px' }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-screen bg-white/80 backdrop-blur-md border-r border-indigo-100 flex flex-col shadow-[4px_0_24px_rgba(79,70,229,0.03)] select-none flex-shrink-0 sticky top-0"
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-8 -right-3.5 bg-white border border-indigo-100 text-indigo-600 rounded-full p-1.5 hover:bg-indigo-50 shadow-md transition-all duration-200 z-50"
            >
                <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FiChevronLeft className="w-4 h-4" />
                </motion.div>
            </button>

            <div className="flex flex-col h-full">
                <div className="flex-shrink-0 my-5">
                   

                    <div className="px-4 py-4 border-b border-indigo-50/50">
                        <Link to="/" className="block">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative flex-shrink-0">
                                    {getProfilePhoto() ? (
                                        <img
                                            src={getProfilePhoto()}
                                            alt={getUserName()}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400 ring-offset-2"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-indigo-400 ring-offset-2 shadow-lg">
                                            {getUserInitial()}
                                        </div>
                                    )}
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                </div>

                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex-1 min-w-0"
                                        >
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {getUserName()}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {getUserEmail()}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-1 custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link key={item.path} to={item.path} className="block relative">
                                <motion.div
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors relative z-10 ${
                                        isActive 
                                            ? 'text-white' 
                                            : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10 shadow-lg shadow-indigo-600/20"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}

                                    <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                                        {isCollapsed ? (
                                            <span className="text-base">{item.emoji}</span>
                                        ) : (
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -5 }}
                                                className="whitespace-nowrap text-sm"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {item.name}
                                        </div>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex-shrink-0 p-4 border-t border-indigo-50/50">
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors group relative"
                    >
                        <FiLogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600 flex-shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    className="whitespace-nowrap text-sm"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                Logout
                            </div>
                        )}
                    </motion.button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c4b5fd;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #8b5cf6;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #c4b5fd transparent;
                }
            `}</style>
        </motion.div>
    );
};

export default DashboardSidebar;