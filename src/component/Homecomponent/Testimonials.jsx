import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
    { name: 'Ayesha Rahman', role: 'Frontend Developer @ Shopify', initials: 'AR', bg: 'bg-indigo-500', quote: 'I went from scattered spreadsheets to a single dashboard. Landed 3 interviews in the first two weeks.', rating: 5 },
    { name: 'Sadman Khan', role: 'Product Designer @ Canva', initials: 'SK', bg: 'bg-purple-500', quote: 'The reminders alone saved me from missing two interviews. This tool paid for itself instantly.', rating: 5 },
    { name: 'Maria Jahan', role: 'Backend Engineer @ Stripe', initials: 'MJ', bg: 'bg-pink-500', quote: 'Seeing my whole pipeline at a glance changed how I approached my job search completely.', rating: 5 },
    { name: 'Priyo Lahiri', role: 'Data Analyst @ Notion', initials: 'PL', bg: 'bg-emerald-500', quote: 'Clean, fast, and genuinely useful. I recommend it to every friend job hunting right now.', rating: 5 },
];

const Testimonials = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const current = testimonials[active];

    return (
        <section className="relative py-24 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-14"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Loved by Job <span className="text-indigo-600">Seekers</span></h2>
                    <p className="text-gray-500 mt-3">Real stories from people who found their next role.</p>
                </motion.div>

                <div className="max-w-2xl mx-auto">
                    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 text-center min-h-[260px] flex flex-col justify-center">
                        <FaQuoteLeft className="w-8 h-8 text-indigo-100 absolute top-6 left-6" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="flex justify-center gap-1 text-amber-400 mb-5">
                                    {[...Array(current.rating)].map((_, i) => (
                                        <FaStar key={i} className="w-4 h-4" />
                                    ))}
                                </div>
                                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">"{current.quote}"</p>
                                <p className="font-semibold text-gray-800">{current.name}</p>
                                <p className="text-sm text-gray-500">{current.role}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((t, i) => (
                            <button key={t.name} onClick={() => setActive(i)}>
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-semibold ${t.bg} transition-all duration-300 ${
                                        active === i ? 'scale-110 ring-4 ring-offset-2 ring-indigo-200' : 'opacity-50 hover:opacity-80'
                                    }`}
                                >
                                    {t.initials}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;