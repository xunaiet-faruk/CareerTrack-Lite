import React from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiActivity, FiBell, FiAward } from 'react-icons/fi';

const steps = [
    { icon: FiPlusCircle, title: 'Add Applications', desc: 'Log every job you apply to in seconds, with role, company, and status.', color: 'from-indigo-500 to-indigo-600', hoverColor: 'hover:shadow-indigo-100' },
    { icon: FiActivity, title: 'Track Progress', desc: 'Move applications through stages and see your pipeline at a glance.', color: 'from-purple-500 to-purple-600', hoverColor: 'hover:shadow-purple-100' },
    { icon: FiBell, title: 'Get Reminders', desc: 'Never miss a follow-up, interview, or deadline again.', color: 'from-pink-500 to-pink-600', hoverColor: 'hover:shadow-pink-100' },
    { icon: FiAward, title: 'Land the Offer', desc: 'Compare offers side by side and negotiate with confidence.', color: 'from-emerald-500 to-emerald-600', hoverColor: 'hover:shadow-emerald-100' },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15, // কার্ডগুলোর মধ্যে ডিলে
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    },
};

const HowItWorks = () => {
    return (
        <section className="relative py-24 overflow-hidden ">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'0 0 20 20\'%3Csvg%3E%3Cg fill=\'%23a5b4fc\' fill-opacity=\'1\'%3E%3Cpath d=\'M0 0h20L0 20z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                   
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Your Journey From <span className="text-indigo-600"> Application </span>to Offer</h2>
                    <p className="text-gray-600 mt-4 text-base leading-relaxed">Four simple steps to stay organized, save time, and land the job you deserve.</p>
                </motion.div>

                <motion.div 
                    className="relative grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    <motion.div
                        className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1 bg-gray-200 rounded-full origin-left overflow-hidden z-0"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.65, 0, 0.35, 1] }}
                        viewport={{ once: true }}
                    >
                        {/* Shimmering effect on the line */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.div>

                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.title}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                                className={`relative flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-lg border border-gray-100 group transition-shadow duration-300 ${s.hoverColor} hover:shadow-2xl hover:border-gray-200`}
                            >
                                <div className="flex items-center gap-4 mb-5 w-full">
                                    <motion.div 
                                        className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300`}
                                        whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </motion.div>
                                    <div className="text-left flex-grow">
                                        <div className="text-sm font-medium text-gray-500">Step {i+1}</div>
                                        <h3 className="font-bold text-gray-800 text-lg">{s.title}</h3>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-500 leading-relaxed text-left">{s.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;