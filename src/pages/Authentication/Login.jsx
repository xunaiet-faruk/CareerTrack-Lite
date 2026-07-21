import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiMail, 
    FiLock, 
    FiEye, 
    FiEyeOff, 
    FiArrowRight,
    FiAlertCircle,
    FiGithub,
    FiLinkedin
} from 'react-icons/fi';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { Authcontext } from '../../context/Authprovider';

const Login = () => {
    const navigate = useNavigate();
    const { signInUser, googleSignIn, setLoading } = useContext(Authcontext);
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);

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
    };

    const validate = () => {
        const newErrors = {};
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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setIsLoading(true);
        setLoading(true);

        try {
            await signInUser(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    // গুগল দিয়ে লগইন
    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        setLoading(true);

        try {
            await googleSignIn();
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Google sign in failed. Please try again.');
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-[500px]"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
                    {/* হেডার */}
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
                            Welcome Back!
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Sign in to continue your job tracking journey
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600"
                        >
                            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* ফর্ম */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ইমেইল ফিল্ড */}
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

                        <div>
                          
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

                        {/* রিমেম্বার মি */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                        </div>

                        {/* লগইন বাটন */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" color="white" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <FiArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* অল্টারনেটিভ লগইন */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/80 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className=" mt-6">
                            <button 
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Google</span>
                            </button>
                           
                        </div>
                    </div>

                    {/* রেজিস্টার লিংক */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;