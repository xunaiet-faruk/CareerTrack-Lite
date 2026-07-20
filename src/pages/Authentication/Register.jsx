import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser, 
    FiMail, 
    FiLock, 
    FiEye, 
    FiEyeOff, 
    FiArrowRight,
    FiAlertCircle,

    FiGithub,
    FiLinkedin
} from 'react-icons/fi';
import ErrorMessage from '../../component/shared/ErrorMessage';
import SuccessMessage from '../../component/shared/SuccessMessage';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
;

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = '';
        let color = '';

        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;

        if (password.length === 0) {
            message = '';
            color = 'text-gray-400';
        } else if (score <= 2) {
            message = 'Weak password';
            color = 'text-red-500';
        } else if (score <= 3) {
            message = 'Fair password';
            color = 'text-orange-500';
        } else if (score <= 4) {
            message = 'Good password';
            color = 'text-emerald-500';
        } else {
            message = 'Strong password!';
            color = 'text-emerald-600';
        }

        setPasswordStrength({ score, message, color });
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validate()) return;

        setIsLoading(true);
        
        // TODO: API কল করবে
        setTimeout(() => {
            setIsLoading(false);
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* ===== ডেকোরেটিভ এলিমেন্টস ===== */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* ===== মেইন কার্ড ===== */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-[530px]"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
                    {/* ===== হেডার ===== */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-300/50"
                        >
                            <span className="text-4xl">🚀</span>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Account
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Start tracking your job applications today
                        </p>
                    </div>

                    {/* ===== মেসেজ ===== */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4"
                            >
                                <ErrorMessage message={error} onClose={() => setError('')} />
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4"
                            >
                                <SuccessMessage message={success} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ===== ফর্ম ===== */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ফুল নেম */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                                        errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                                    } bg-white/50 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300`}
                                />
                            </div>
                            {errors.fullName && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                >
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.fullName}
                                </motion.p>
                            )}
                        </div>

                        {/* ইমেইল */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                                    } bg-white/50 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300`}
                                />
                            </div>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                >
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>

                        {/* পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 ${
                                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                                    } bg-white/50 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* পাসওয়ার্ড স্ট্রেংথ */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                    i < passwordStrength.score
                                                        ? passwordStrength.color.replace('text', 'bg')
                                                        : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                                        {passwordStrength.message}
                                    </p>
                                </div>
                            )}
                            
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                >
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        {/* কনফর্ম পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 ${
                                        errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                                    } bg-white/50 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                >
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        {/* রেজিস্টার বাটন */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" color="white" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <FiArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* ===== অল্টারনেটিভ রেজিস্টার ===== */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/80 text-gray-500">Or register with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105">
                                <FiGithub className="w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">GitHub</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105">
                                <FiLinkedin className="w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">LinkedIn</span>
                            </button>
                        </div>
                    </div>

                    {/* ===== লগইন লিংক ===== */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

        
            </motion.div>
        </div>
    );
};

export default Register;