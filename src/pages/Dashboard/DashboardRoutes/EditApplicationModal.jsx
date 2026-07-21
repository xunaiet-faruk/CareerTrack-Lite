import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, 
    FiBriefcase, 
    FiLayers, 
    FiLink2, 
    FiGlobe, 
    FiCheckCircle, 
    FiCalendar, 
    FiFileText,
    FiSave
} from 'react-icons/fi';

import { toast } from 'react-toastify';
import Useaxios from '../../../hooks/Useaxios';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';


const EditApplicationModal = ({ isOpen, onClose, application, onSuccess }) => {
    const axios = Useaxios();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobUrl: '',
        source: '',
        status: 'Applied',
        appDate: '',
        notes: ''
    });

    const sourceOptions = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other'];
    const statusOptions = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offered', 'Rejected'];

    useEffect(() => {
        if (application) {
            setFormData({
                companyName: application.companyName || '',
                jobTitle: application.jobTitle || '',
                jobUrl: application.jobUrl || '',
                source: application.source || '',
                status: application.status || 'Applied',
                appDate: application.appDate || '',
                notes: application.notes || ''
            });
        }
    }, [application]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.patch(`/applications/${application._id}`, formData);
            if (res.data) {
                toast.success('✅ Application updated successfully!');
                const updatedApp = { ...application, ...formData };
                onSuccess(updatedApp);
                onClose();
            }
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('❌ Failed to update application!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-50/80 p-8 z-50 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Edit Application
                                </h2>
                                <p className="text-gray-400 text-xs mt-1">Update your application details below.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiLayers className="text-indigo-500" /> Company Name
                                    </label>
                                    <input 
                                        type="text"
                                        name="companyName"
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="e.g. Google, TechVibe"
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiBriefcase className="text-indigo-500" /> Job Title
                                    </label>
                                    <input 
                                        type="text"
                                        name="jobTitle"
                                        required
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        placeholder="e.g. Frontend Developer"
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FiLink2 className="text-indigo-500" /> Job URL
                                </label>
                                <input 
                                    type="url"
                                    name="jobUrl"
                                    value={formData.jobUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/jobs/designer"
                                    className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FiGlobe className="text-indigo-500" /> Source
                                </label>
                                <select 
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="text-gray-300">Select where you found the job</option>
                                    {sourceOptions.map(opt => (
                                        <option key={opt} value={opt} className="text-gray-700">{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiCheckCircle className="text-indigo-500" /> Status
                                    </label>
                                    <select 
                                        name="status"
                                        required
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-700 cursor-pointer"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiCalendar className="text-indigo-500" /> Date
                                    </label>
                                    <input 
                                        type="date"
                                        name="appDate"
                                        required
                                        value={formData.appDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FiFileText className="text-indigo-500" /> Notes
                                </label>
                                <textarea 
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add specific keywords, HR contacts, or quick reminders here..."
                                    className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-indigo-50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner size="sm" color="white" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="w-4 h-4" /> Update Application
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditApplicationModal;