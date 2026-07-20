import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBriefcase, FiCalendar, FiGlobe, FiLink, FiFileText } from 'react-icons/fi';

const ApplicationDetailsModal = ({ isOpen, onClose, application, getStatusStyle }) => {
    if (!application) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white w-full max-w-lg rounded-2xl border border-indigo-50 shadow-2xl overflow-hidden relative z-10 p-6"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-indigo-50/60">
                            {application.logo ? (
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${application.color} flex items-center justify-center text-white font-black text-xl shadow-md`}>
                                    {application.logo}
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                                    <FiBriefcase className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">{application.title}</h2>
                                <p className="text-gray-400 text-sm font-semibold mt-0.5">{application.company}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                                    <span className={`text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border inline-block ${getStatusStyle(application.status)}`}>
                                        {application.status}
                                    </span>
                                </div>

                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Source</span>
                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                        <FiGlobe className="text-indigo-500 w-3.5 h-3.5" /> {application.source}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-indigo-500 w-4 h-4" />
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Application Date</span>
                                        <span className="text-xs font-bold text-gray-700">{application.date}</span>
                                    </div>
                                </div>
                            </div>

                            {application.url && (
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FiLink className="text-indigo-500 w-4 h-4 flex-shrink-0" />
                                        <div className="overflow-hidden">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Job URL</span>
                                            <a href={application.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline block truncate">
                                                {application.url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <FiFileText className="text-indigo-500 w-3.5 h-3.5" /> Notes / Description
                                </span>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                                    {application.notes || 'No notes added for this application.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApplicationDetailsModal;