import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUpload, 
    FiFile, 
    FiCheckCircle, 
    FiXCircle, 
    FiAlertCircle,
    FiTrendingUp,
    FiAward,
    FiStar,
    FiBarChart2,
    FiDownload,
    FiEye,
    FiRefreshCw,
    FiTrash2,
    FiLoader
} from 'react-icons/fi';

import { toast } from 'react-toastify';
import { Authcontext } from '../../../context/Authprovider';
import Useaxios from '../../../hooks/Useaxios';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';

// Custom Confirm Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, fileName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <FiTrash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Resume?</h3>
                    <p className="text-gray-600 text-sm mb-1">
                        Are you sure you want to delete
                    </p>
                    <p className="text-gray-800 font-medium text-sm mb-4">
                        "{fileName}"?
                    </p>
                    <p className="text-xs text-gray-400 mb-6">
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const AIResumeReview = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    
    // New states for custom confirm dialog
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);

    const jobRoleOptions = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'MERN Stack Developer',
        'React Developer',
        'Node.js Developer',
        'Python Developer',
        'Java Developer',
        'UI/UX Designer',
        'Graphics Designer',
        'Data Scientist',
        'DevOps Engineer',
        'Product Manager',
        'Project Manager',
        'QA Engineer',
        'Other'
    ];

    useEffect(() => {
        if (user?.email) {
            fetchResumes();
        }
    }, [user]);

    const fetchResumes = async () => {
        try {
            const res = await axios.get(`/api/resumes/${user.email}`);
            if (res.data.success) {
                setResumes(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedResume(res.data.data[0]);
                } else {
                    setSelectedResume(null);
                    setAnalysis(null);
                }
            }
        } catch (error) {
            console.error('Error fetching resumes:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload PDF, DOC, DOCX, or TXT files only');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('email', user.email);
        formData.append('jobRole', jobRole || 'Not specified');

        try {
            const res = await axios.post('/api/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                toast.success('Resume uploaded successfully!');
                setUploadedFile(res.data.data);
                setSelectedFile(null);
                await fetchResumes();
                
                setTimeout(() => {
                    handleAnalyze(res.data.data.id);
                }, 1000);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async (resumeId) => {
        setAnalyzing(true);
        try {
            const res = await axios.post('/api/resume/analyze', {
                resumeId: resumeId || selectedResume?._id,
                jobRole: jobRole || selectedResume?.jobRole
            });

            if (res.data.success) {
                setAnalysis(res.data.data);
                toast.success('Resume analysis complete!');
                await fetchResumes();
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Failed to analyze resume');
        } finally {
            setAnalyzing(false);
        }
    };

    // Show confirmation dialog instead of alert
    const handleDeleteClick = (resume) => {
        setResumeToDelete(resume);
        setShowConfirmDialog(true);
    };

    // Actual delete function
    const confirmDelete = async () => {
        if (!resumeToDelete) return;
        
        setDeletingId(resumeToDelete._id);
        setShowConfirmDialog(false);
        
        try {
            const res = await axios.delete(`/api/resume/${resumeToDelete._id}`);
            
            if (res.data.success) {
                toast.success(`"${resumeToDelete.fileName}" deleted successfully!`);
                
                const updatedResumes = resumes.filter(r => r._id !== resumeToDelete._id);
                setResumes(updatedResumes);
                
                if (selectedResume?._id === resumeToDelete._id) {
                    setSelectedResume(updatedResumes[0] || null);
                    setAnalysis(updatedResumes[0]?.analysis || null);
                }
                
                await fetchResumes();
            } else {
                toast.error(res.data.error || 'Failed to delete resume');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.error || 'Failed to delete resume');
        } finally {
            setDeletingId(null);
            setResumeToDelete(null);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-100';
        if (score >= 60) return 'bg-amber-100';
        return 'bg-red-100';
    };

    const getScoreEmoji = (score) => {
        if (score >= 80) return '🌟';
        if (score >= 60) return '💪';
        return '📈';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent!';
        if (score >= 60) return 'Good - Room for Improvement';
        return 'Needs Significant Improvement';
    };

    return (
        <div className="w-full min-h-screen px-4 sm:px-6 py-8 bg-gray-50/30">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <FiBarChart2 className="text-indigo-600" />
                            AI Resume Review
                        </h1>
                        <p className="text-gray-500 mt-1">Upload your resume for AI-powered analysis and scoring</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <FiAward className="text-indigo-500" />
                        <span>Get personalized feedback in seconds</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <FiUpload className="text-indigo-600" />
                                Upload Resume
                            </h3>

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    id="resumeUpload"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="resumeUpload" className="cursor-pointer">
                                    <div className="text-5xl mb-3">📄</div>
                                    <p className="text-sm text-gray-600">
                                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT (Max 5MB)</p>
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="mt-4 p-3 bg-indigo-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiFile className="text-indigo-600" />
                                        <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                            {selectedFile.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            )}

                            <div className="mt-4">
                                <select
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-700"
                                >
                                    <option value="">Select target job role (optional)</option>
                                    {jobRoleOptions.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || loading}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FiUpload className="w-4 h-4" />
                                        Upload & Analyze
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Resumes List with Delete Button */}
                        {resumes.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <FiEye className="text-indigo-600" />
                                        Your Resumes ({resumes.length})
                                    </span>
                                    <span className="text-xs text-gray-400">Click to view</span>
                                </h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {resumes.map((resume) => (
                                        <div
                                            key={resume._id}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                                selectedResume?._id === resume._id
                                                    ? 'bg-indigo-50 border border-indigo-200'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelectedResume(resume);
                                                    setAnalysis(resume.analysis || null);
                                                }}
                                                className="flex-1 text-left text-sm text-gray-600 truncate flex items-center gap-2"
                                            >
                                                <FiFile className="text-indigo-400 flex-shrink-0" />
                                                <span className="truncate">{resume.fileName}</span>
                                                {resume.analysis && (
                                                    <span className={`text-xs font-bold ${getScoreColor(resume.analysis.score)}`}>
                                                        {resume.analysis.score}%
                                                    </span>
                                                )}
                                            </button>
                                            
                                            {/* Delete Button - Now opens custom dialog */}
                                            <button
                                                onClick={() => handleDeleteClick(resume)}
                                                disabled={deletingId === resume._id}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete resume"
                                            >
                                                {deletingId === resume._id ? (
                                                    <FiLoader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <FiTrash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        {analyzing ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <LoadingSpinner size="lg" />
                                <p className="text-gray-500 mt-4">AI is analyzing your resume...</p>
                                <p className="text-sm text-gray-400 mt-1">This may take a few seconds</p>
                            </div>
                        ) : analysis ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Resume Analysis</h3>
                                            <p className="text-xs text-gray-400">
                                                {selectedResume?.fileName} • Analyzed on {new Date(selectedResume?.analyzedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleAnalyze(selectedResume?._id)}
                                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600"
                                            title="Re-analyze"
                                        >
                                            <FiRefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className={`w-24 h-24 rounded-full ${getScoreBg(analysis.score)} flex items-center justify-center mx-auto`}>
                                                <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                                                    {analysis.score}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500 block mt-1">/ 100</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{getScoreEmoji(analysis.score)}</span>
                                                <span className="font-bold text-gray-800">{getScoreLabel(analysis.score)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{analysis.recommendation}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {['Content', 'Formatting', 'Keywords', 'Achievements', 'Relevance'].map((label, i) => (
                                            <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                                                    <div 
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${Math.min(100, analysis.score + (i - 2) * 5)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-gray-500">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                                        <h4 className="font-semibold text-emerald-800 flex items-center gap-2 mb-3">
                                            <FiCheckCircle className="w-4 h-4" />
                                            Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.strengths.map((strength, index) => (
                                                <li key={index} className="text-sm text-emerald-700 flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-0.5">✅</span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                                        <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
                                            <FiAlertCircle className="w-4 h-4" />
                                            Areas for Improvement
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.weaknesses.map((weakness, index) => (
                                                <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                                                    <span className="text-amber-500 mt-0.5">⚠️</span>
                                                    {weakness}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                    <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-3">
                                        <FiStar className="w-4 h-4" />
                                        Specific Suggestions
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {analysis.suggestions.map((suggestion, index) => (
                                            <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                                <span className="text-blue-500 mt-0.5">💡</span>
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                                        <h4 className="font-semibold text-purple-800 flex items-center gap-2 mb-3">
                                            <FiTrendingUp className="w-4 h-4" />
                                            Missing Keywords for {jobRole || selectedResume?.jobRole || 'Your Role'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.missingKeywords.map((keyword, index) => (
                                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-xl font-semibold text-gray-700">No Resume Analyzed Yet</h3>
                                <p className="text-gray-500 text-center max-w-sm mt-2">
                                    Upload your resume to get an AI-powered analysis with detailed feedback and improvement suggestions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog 
                isOpen={showConfirmDialog}
                onClose={() => {
                    setShowConfirmDialog(false);
                    setResumeToDelete(null);
                }}
                onConfirm={confirmDelete}
                fileName={resumeToDelete?.fileName}
            />
        </div>
    );
};

export default AIResumeReview;