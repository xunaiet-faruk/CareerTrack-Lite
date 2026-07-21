import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    FiBriefcase, 
    FiLayers, 
    FiLink2, 
    FiGlobe, 
    FiCheckCircle, 
    FiCalendar, 
    FiFileText,
    FiPlusCircle,
    FiCheck
} from 'react-icons/fi';
import { Authcontext } from '../../context/Authprovider';
import Useaxios from '../../hooks/Useaxios';

const AddApplication = () => {
    const {user} = useContext(Authcontext);
    const axios = Useaxios();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobUrl: '',
        source: '',
        status: 'Applied', 
        appDate: new Date().toISOString().split('T')[0], 
        notes: ''
    });

    const sourceOptions = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other'];
    const statusOptions = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offered', 'Rejected'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            companyName: '',
            jobTitle: '',
            jobUrl: '',
            source: '',
            status: 'Applied',
            appDate: new Date().toISOString().split('T')[0],
            notes: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const applicationData = {
            ...formData,
            userEmail: user?.email || ''
        };

        try {
            const res = await axios.post('/application', applicationData);
            
            if (res.data) {
                toast.success('🎉 Application added successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    icon: <FiCheck className="text-green-500" />
                });
                
                resetForm();
            }
        } catch (error) {
            console.log(error);
            toast.error('❌ Failed to add application. Please try again.', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen px-6 py-8 text-gray-800 flex items-center justify-center">
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="w-full max-w-2xl bg-white/80 backdrop-blur-md border border-indigo-50/80 rounded-3xl p-8 shadow-xl shadow-indigo-600/5 relative overflow-hidden"
            >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="mb-8 relative z-10">
                    <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Add New Application
                    </h1>
                    <p className="text-gray-400 text-xs mt-1">Track your next big career move by filling out the details below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
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
                                className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
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
                                className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <FiLink2 className="text-indigo-500" /> Job URL
                        </label>
                        <input 
                            type="url"
                            name="jobUrl"
                            value={formData.jobUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/jobs/designer"
                            className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <FiGlobe className="text-indigo-500" /> Source Dropdown
                        </label>
                        <select 
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600 appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="text-gray-300">Select where you found the job</option>
                            {sourceOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-700">{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <FiCheckCircle className="text-indigo-500" /> Application Status <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="status"
                                required
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-700 cursor-pointer"
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <FiCalendar className="text-indigo-500" /> Application Date <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date"
                                name="appDate"
                                required
                                value={formData.appDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <FiFileText className="text-indigo-500" /> Notes (Optional)
                        </label>
                        <textarea 
                            name="notes"
                            rows="4"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add specific keywords, HR contacts, or quick reminders here..."
                            className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-gray-300 resize-none"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0px 10px 25px rgba(79, 70, 229, 0.25)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding Application...
                            </>
                        ) : (
                            <>
                                <FiPlusCircle className="w-4 h-4" /> Add Application
                            </>
                        )}
                    </motion.button>

                </form>
            </motion.div>
        </div>
    );
};

export default AddApplication;