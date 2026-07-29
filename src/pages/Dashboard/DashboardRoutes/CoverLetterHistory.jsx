import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, Clock, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';

const ITEMS_PER_PAGE = 6;

const CoverLetterHistory = ({
    letters,
    loading,
    onSelect,
    onDelete,
    activeLetterId
}) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(letters.length / ITEMS_PER_PAGE));

    // letters list বদলালে (নতুন generate/delete হলে) page 1 এ ফিরে যাও, out-of-range এড়াতে
    useEffect(() => {
        setPage(1);
    }, [letters.length]);

    const paginatedLetters = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return letters.slice(start, start + ITEMS_PER_PAGE);
    }, [letters, page]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    if (letters.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100"
            >
                <AlertCircle size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">এখনো কোনো cover letter বানাওনি।</p>
                <p className="text-slate-300 text-xs mt-1">উপরের ফর্ম পূরণ করে প্রথমটা তৈরি করো!</p>
            </motion.div>
        );
    }

    return (
        <div>
            <motion.div
                key={page}
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {paginatedLetters.map((letter) => (
                    <motion.div
                        key={letter._id}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        onClick={() => onSelect(letter)}
                        className={`cursor-pointer bg-white rounded-xl shadow-md p-4 border-2 transition-all duration-300 ${
                            activeLetterId === letter._id
                                ? 'border-indigo-500 shadow-lg shadow-indigo-100'
                                : 'border-slate-100 hover:border-indigo-300 hover:shadow-lg'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 flex items-center gap-1">
                                    <Briefcase size={14} className="text-indigo-600 flex-shrink-0" />
                                    <span className="truncate">{letter.jobTitle || 'Untitled'}</span>
                                </p>
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <Building size={12} className="flex-shrink-0" />
                                    <span className="truncate">{letter.companyName || 'Unknown Company'}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(letter.createdAt).toLocaleDateString()}
                                    {letter.edited && (
                                        <span className="ml-2 text-amber-500 text-[10px] font-medium">(edited)</span>
                                    )}
                                </p>
                            </div>
                            <motion.button
                                onClick={(e) => { e.stopPropagation(); onDelete(letter._id); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition flex-shrink-0 ml-2"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </motion.button>
                        </div>

                        <div className="mt-2">
                            <p className="text-xs text-slate-400 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                                {letter.content ? letter.content.substring(0, 100) : 'No content'}...
                            </p>
                        </div>

                        {activeLetterId === letter._id && (
                            <div className="mt-2 flex justify-end">
                                <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    Selected
                                </span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 transition"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                p === page
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400'
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 transition"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoverLetterHistory;