import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, 
    FiLayers, 
    FiLink2, 
    FiGlobe, 
    FiCheckCircle, 
    FiCalendar, 
    FiFileText,
    FiSave,
    FiCode
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Useaxios from '../../../hooks/Useaxios';

const EditApplicationModal = ({ isOpen, onClose, application, onSuccess }) => {
    const axios = Useaxios();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        jobRole: '',      
        jobUrl: '',
        source: '',
        status: 'Applied',
        appDate: '',
        interviewDate: '',
        interviewTime: '',
        notes: ''
    });

    const sourceOptions = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other'];
    const statusOptions = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offered', 'Rejected'];
    const jobRoleOptions = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'MERN Stack Developer',
        'MEAN Stack Developer',
        'React Developer',
        'Angular Developer',
        'Vue.js Developer',
        'Node.js Developer',
        'Python Developer',
        'Java Developer',
        'PHP Developer',
        'WordPress Developer',
        'Mobile App Developer',
        'Flutter Developer',
        'React Native Developer',
        'iOS Developer',
        'Android Developer',
        'DevOps Engineer',
        'Cloud Engineer',
        'AWS Developer',
        'Data Scientist',
        'Machine Learning Engineer',
        'AI Engineer',
        'Database Administrator',
        'System Administrator',
        'Network Engineer',
        'Cybersecurity Analyst',
        'UI/UX Designer',
        'Graphics Designer',
        'Video Editor',
        'Motion Graphics Designer',
        'Content Writer',
        'SEO Specialist',
        'Digital Marketer',
        'Product Manager',
        'Project Manager',
        'Business Analyst',
        'QA Engineer',
        'Software Tester',
        'Other'
    ];

    useEffect(() => {
        if (application) {
            setFormData({
                companyName: application.companyName || '',
                jobRole: application.jobRole || '',      
                jobUrl: application.jobUrl || '',
                source: application.source || '',
                status: application.status || 'Applied',
                appDate: application.appDate || '',
                interviewDate: application.interviewDate || '',
                interviewTime: application.interviewTime || '',
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
        
        if (!application?._id) {
            toast.error('No application selected');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.patch(`/application/${application._id}`, formData);
            
            if (res.data) {
                toast.success('✅ Application updated successfully!');
                const updatedApp = { ...application, ...formData };
                if (onSuccess) {
                    onSuccess(updatedApp);
                }
                onClose();
            }
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error(error.response?.data?.error || '❌ Failed to update application!');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                            {/* Company Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FiLayers className="text-indigo-500" /> Company Name <span className="text-red-500">*</span>
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

                            {/* Job Role */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FiCode className="text-indigo-500" /> Job Role <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    name="jobRole"
                                    required
                                    value={formData.jobRole}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select your job role</option>
                                    {jobRoleOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400">🤖 AI will generate interview questions based on this role</p>
                            </div>

                            {/* Job URL */}
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

                            {/* Source */}
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
                                    <option value="" disabled>Select where you found the job</option>
                                    {sourceOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status & Application Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiCheckCircle className="text-indigo-500" /> Status <span className="text-red-500">*</span>
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
                                        <FiCalendar className="text-indigo-500" /> Application Date <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="date"
                                        name="appDate"
                                        required
                                        value={formData.appDate?.split('T')[0] || formData.appDate || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Interview Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiCalendar className="text-indigo-500" /> Interview Date
                                    </label>
                                    <input 
                                        type="date"
                                        name="interviewDate"
                                        value={formData.interviewDate?.split('T')[0] || formData.interviewDate || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <FiCalendar className="text-indigo-500" /> Interview Time
                                    </label>
                                    <input 
                                        type="time"
                                        name="interviewTime"
                                        value={formData.interviewTime || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
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

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-4 border-t border-indigo-50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                                    disabled={loading}
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
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
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