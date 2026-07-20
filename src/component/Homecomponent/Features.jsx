import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiLock, 
    FiBarChart2, 
    FiSearch, 
    FiBell, 
    FiTrendingUp, 
    FiUsers,
    FiCheckCircle
} from 'react-icons/fi';

const features = [
    {
        icon: FiLock,
        title: 'Secure Authentication',
        description: 'JWT-based authentication with protected routes. Your data is safe and secure.',
        iconColor: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-100'
    },
    {
        icon: FiBarChart2,
        title: 'Dashboard Analytics',
        description: 'View statistics, track statuses, and monitor your job application progress.',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100'
    },
    {
        icon: FiSearch,
        title: 'Search & Filter',
        description: 'Search by company, filter by status, and sort applications effortlessly.',
        iconColor: 'text-pink-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-100'
    },
    {
        icon: FiBell,
        title: 'Status Tracking',
        description: 'Track every application from Applied to Offer with visual status badges.',
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-100'
    },
    {
        icon: FiTrendingUp,
        title: 'CRUD Operations',
        description: 'Create, Read, Update, and Delete job applications with ease.',
        iconColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100'
    },
    {
        icon: FiUsers,
        title: 'Personal Dashboard',
        description: 'Each user has their own dashboard. Only you can see your applications.',
        iconColor: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-100'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

const Features = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                        Everything You Need to{' '}
                        <span className="text-indigo-600">
                            Succeed
                        </span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                        Powerful features to help you track and manage your job applications
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`group relative bg-white rounded-2xl p-8 border ${feature.borderColor} hover:border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                            >
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                                    background: `linear-gradient(135deg, ${feature.bgColor}33, transparent)`
                                }} />
                                
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;