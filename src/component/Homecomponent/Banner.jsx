import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { FiArrowRight, FiPlayCircle, FiSend, FiUsers, FiAward, FiCheckCircle, FiZap, FiCheck } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const milestones = [
    {
        label: 'Applied',
        icon: FiSend,
        left: 6,
        top: 88,
        ring: 'ring-indigo-200',
        bg: 'bg-indigo-600',
        t: 0.06,
        card: { title: 'Application Sent', detail: 'Google · Frontend Developer' },
    },
    {
        label: 'Interview',
        icon: FiUsers,
        left: 34,
        top: 60,
        ring: 'ring-purple-200',
        bg: 'bg-purple-600',
        t: 0.37,
        card: { title: 'Interview Scheduled', detail: 'Round 1 · Tomorrow, 3 PM' },
    },
    {
        label: 'Offer',
        icon: FiAward,
        left: 62,
        top: 32,
        ring: 'ring-pink-200',
        bg: 'bg-pink-500',
        t: 0.68,
        card: { title: 'Offer Received', detail: '$120k · Negotiating' },
    },
    {
        label: 'Hired',
        icon: FiCheckCircle,
        left: 90,
        top: 8,
        ring: 'ring-emerald-200',
        bg: 'bg-emerald-500',
        t: 0.95,
        card: { title: 'Welcome Aboard 🎉', detail: 'Start date confirmed' },
    },
];

const pathD = 'M25,478 C95,425 115,354 160,319 C230,260 250,201 280,165 C330,106 340,71 375,41';

const useCountUp = (target, duration = 1500, start = false) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime;
        let frame;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [start, target, duration]);
    return value;
};

const MagneticLink = ({ to, className, children }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        setPos({ x: relX * 0.25, y: relY * 0.3 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.5 }}
        >
            <Link to={to} className={className}>
                {children}
            </Link>
        </motion.div>
    );
};

const JourneyPath = () => {
    const pathRef = useRef(null);
    const dotRef = useRef(null);
    const progress = useRef(0);
    const activeRef = useRef(null);
    const [drawn, setDrawn] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    useAnimationFrame((t, delta) => {
        if (!drawn) return;
        const path = pathRef.current;
        if (!path) return;
        const length = path.getTotalLength();
        progress.current = (progress.current + delta * 0.00016) % 1;
        const point = path.getPointAtLength(progress.current * length);
        if (dotRef.current) {
            dotRef.current.setAttribute('cx', point.x);
            dotRef.current.setAttribute('cy', point.y);
        }
        const near = milestones.findIndex((m) => Math.abs(progress.current - m.t) < 0.035);
        const next = near === -1 ? null : near;
        if (next !== activeRef.current) {
            activeRef.current = next;
            setActiveIndex(next);
        }
    });

    return (
        <div className="relative w-full max-w-md aspect-[400/520] mx-auto">
            <svg viewBox="0 0 400 520" className="absolute inset-0 w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="50%" stopColor="#9333EA" />
                        <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <path d={pathD} fill="none" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 10" />

                <motion.path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
                    onAnimationComplete={() => setDrawn(true)}
                />

                <motion.circle
                    ref={dotRef}
                    r="5"
                    fill="#ffffff"
                    stroke="url(#pathGradient)"
                    strokeWidth="3"
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: drawn ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                />
            </svg>

            {milestones.map((m, i) => {
                const Icon = m.icon;
                return (
                    <motion.div
                        key={m.label}
                        className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${m.left}%`, top: `${m.top}%` }}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div
                            className={`relative w-14 h-14 rounded-full ${m.bg} ring-8 ${m.ring} flex items-center justify-center text-white shadow-lg`}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                        >
                            <Icon className="w-6 h-6" />
                        </motion.div>
                        <span className="text-xs font-semibold text-gray-600 bg-white/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {m.label}
                        </span>

                        <AnimatePresence>
                            {activeIndex === i && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scaleY: 0.4, scaleX: 0.85 }}
                                    animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
                                    exit={{ opacity: 0, y: -8, scaleY: 0.5, scaleX: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 16, mass: 0.6 }}
                                    style={{ transformOrigin: 'top center' }}
                                    className={`absolute top-full mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 px-3 py-2.5 z-20 ${
                                        m.left < 50 ? 'left-0' : 'right-0'
                                    }`}
                                >
                                    <p className="text-xs font-semibold text-gray-800">{m.card.title}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">{m.card.detail}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};


const features = ['Free forever', 'No credit card', 'Setup in 2 minutes'];

const Banner = () => {
    const [statsVisible, setStatsVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setStatsVisible(true), 400);
        return () => clearTimeout(t);
    }, []);

    const users = useCountUp(10000, 1600, statsVisible);
    const applications = useCountUp(50000, 1800, statsVisible);
    const successRate = useCountUp(95, 1400, statsVisible);

    return (
        <section className="relative flex items-center overflow-hidden my-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="text-center lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                      

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
                        >
                            <span className="text-gray-800">Land Your</span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                                Dream Job
                            </span>
                            <br />
                            <span className="text-gray-800">With Ease</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Track all your job applications in one place. Stay organized,
                            monitor your progress, and never miss an opportunity again.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <MagneticLink
                                to="/register"
                                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-300/50 transition-shadow duration-300 overflow-hidden flex items-center justify-center gap-2"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started Free
                                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </MagneticLink>

                            <MagneticLink
                                to="/about"
                                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FiPlayCircle className="w-5 h-5" />
                                Learn More
                            </MagneticLink>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start mt-6"
                        >
                            {features.map((f) => (
                                <span key={f} className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                    <FiCheck className="w-4 h-4 text-emerald-500" />
                                    {f}
                                </span>
                            ))}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap gap-8 mt-10 justify-center lg:justify-start"
                        >
                            <div>
                                <p className="text-3xl font-bold text-indigo-600">{users.toLocaleString()}+</p>
                                <p className="text-sm text-gray-500">Active Users</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-purple-600">{applications.toLocaleString()}+</p>
                                <p className="text-sm text-gray-500">Applications Tracked</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-pink-500">{successRate}%</p>
                                <p className="text-sm text-gray-500">Success Rate</p>
                            </div>
                        </motion.div>

                    </motion.div>

                    <div className="hidden lg:block">
                        <JourneyPath />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;