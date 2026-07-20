import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* ===== কলাম ১: লোগো ও বিবরণ ===== */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🚀</span>
                            <span className="text-xl font-bold text-gray-800">
                                Career<span className="text-indigo-600">Track</span>
                                <span className="font-light text-gray-400">Lite</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Track your job applications easily and efficiently. 
                            Stay organized and never miss an opportunity.
                        </p>
                    </div>

                    {/* ===== কলাম ২: কুইক লিংকস ===== */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ===== কলাম ৩: সাপোর্ট ===== */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wider mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/faq" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ===== কলাম ৪: যোগাযোগ ===== */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wider mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-gray-500 text-sm">
                                <span>📧</span>
                                <a href="mailto:your.email@example.com" className="hover:text-indigo-600 transition-colors duration-200">
                                    your.email@example.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-500 text-sm">
                                <span>📱</span>
                                <span>+880 1XXX-XXXXXX</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-500 text-sm">
                                <span>📍</span>
                                <span>Bangladesh</span>
                            </li>
                        </ul>

                        {/* সোশ্যাল আইকন */}
                        <div className="flex gap-3 mt-4">
                            <a 
                                href="#" 
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a 
                                href="#" 
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                aria-label="Twitter"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a 
                                href="#" 
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a 
                                href="#" 
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                aria-label="GitHub"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399 1.02 0 2.04.132 3 .399 2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.577C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ===== কপিরাইট লাইন ===== */}
                <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} <span className="font-medium text-gray-700">CareerTrack Lite</span>. 
                        All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Developed by <span className="font-medium text-indigo-600">Md. Nahid Hassan</span> 
                        | Student ID: <span className="font-medium text-indigo-600">2024-XXXXX</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;