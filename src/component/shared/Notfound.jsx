import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiHome, 
    FiArrowLeft, 
    FiSearch, 
    FiHelpCircle,
    FiAlertTriangle,
    FiRefreshCw,
    FiGithub,
    FiTwitter
} from 'react-icons/fi';

const NotFound = () => {
    const [time, setTime] = useState(0);
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => (prev + 1) % 60);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* ===== ডেকোরেটিভ এলিমেন্টস ===== */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-100/10 to-purple-100/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* ===== 404 নাম্বার ===== */}
                    <div className="relative inline-block mb-8">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.02, 1],
                                rotate: [0, 2, -2, 0]
                            }}
                            transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="text-8xl sm:text-9xl lg:text-[12rem] font-black leading-none"
                        >
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                404
                            </span>
                        </motion.div>

                        {/* ===== ফ্লোটিং এলিমেন্টস ===== */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 bg-white shadow-xl rounded-full p-3 sm:p-4"
                        >
                            <FiAlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 bg-white shadow-xl rounded-full p-3 sm:p-4"
                        >
                            <FiSearch className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        </motion.div>
                    </div>

                    {/* ===== টেক্সট কন্টেন্ট ===== */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                            Oops! Page Not Found
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-3">
                            Looks like you've wandered into the unknown territory.
                        </p>
                      
                    </motion.div>

              

                    {/* ===== বাটন গ্রুপ ===== */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center my-12"
                    >
                        <Link
                            to="/"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <FiHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Back to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <FiArrowLeft className="w-5 h-5 cursor-pointer group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                      
                    </motion.div>

                   

              

                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;