import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUsers, FiAward, FiXCircle, FiClock } from 'react-icons/fi';

const activities = [
    { id: 1, type: 'offer', company: 'Stripe', role: 'Backend Engineer', time: '2m ago', icon: FiAward, color: 'bg-pink-500', label: 'Offer Received' },
    { id: 2, type: 'interview', company: 'Figma', role: 'Product Designer', time: '18m ago', icon: FiUsers, color: 'bg-purple-500', label: 'Interview Scheduled' },
    { id: 3, type: 'applied', company: 'Notion', role: 'Fullstack Developer', time: '1h ago', icon: FiSend, color: 'bg-indigo-500', label: 'Application Sent' },
    { id: 4, type: 'rejected', company: 'Meta', role: 'iOS Engineer', time: '3h ago', icon: FiXCircle, color: 'bg-gray-400', label: 'Not Selected' },
    { id: 5, type: 'interview', company: 'Airbnb', role: 'UX Researcher', time: '5h ago', icon: FiUsers, color: 'bg-purple-500', label: 'Interview Scheduled' },
    { id: 6, type: 'applied', company: 'Google', role: 'Frontend Developer', time: '1d ago', icon: FiSend, color: 'bg-indigo-500', label: 'Application Sent' },
];

const filters = ['All', 'Applied', 'Interview', 'Offer'];

const RecentActivity = () => {
    const [active, setActive] = useState('All');
    const filtered = active === 'All' ? activities : activities.filter((a) => a.type === active.toLowerCase());

    return (
        <section className="relative py-24 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 text-indigo-600 font-medium text-sm mb-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                            </span>
                            Live Feed
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Recent Activity</h2>
                        <p className="text-gray-500 mt-2 max-w-md">See what's happening across your job search, updated in real time.</p>
                    </div>

                    <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-full p-1 w-fit">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActive(f)}
                                className="relative px-4 py-1.5 text-sm font-medium rounded-full text-gray-600"
                            >
                                {active === f && (
                                    <motion.span
                                        layoutId="activityFilterPill"
                                        className="absolute inset-0 bg-white shadow rounded-full"
                                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                    />
                                )}
                                <span className={`relative z-10 ${active === f ? 'text-indigo-700' : ''}`}>{f}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((a, i) => {
                            const Icon = a.icon;
                            return (
                                <motion.div
                                    key={a.id}
                                    layout
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -3 }}
                                    className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-4"
                                >
                                    <div className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center text-white shrink-0`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-800 truncate">{a.role}</p>
                                        <p className="text-sm text-gray-500 truncate">{a.company} · {a.label}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                                        <FiClock className="w-3.5 h-3.5" />
                                        {a.time}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default RecentActivity;