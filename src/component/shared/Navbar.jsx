import  { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav 
            className={`
                fixed top-0 left-0 right-0 z-50 
                transition-all duration-300 
                ${isScrolled 
                    ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
                    : 'bg-transparent py-5'
                }
            `}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    
                    {/* ===== লোগো ===== */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 group"
                        onClick={closeMenu}
                    >
                        <span className="text-3xl transition-transform group-hover:scale-110 duration-300">
                            🚀
                        </span>
                        <span className={`
                            text-2xl font-bold tracking-tight
                            ${isScrolled ? 'text-gray-800' : 'text-gray-800'}
                        `}>
                            Career
                            <span className="text-indigo-600">
                                Track
                            </span>
                            <span className="font-light text-gray-400">
                                Lite
                            </span>
                        </span>
                    </Link>

                    {/* ===== ডেস্কটপ নেভ লিংকস ===== */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            About
                        </NavLink>
                        <NavLink 
                            to="/services" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            Services
                        </NavLink>
                        <NavLink 
                            to="/contact" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            Contact
                        </NavLink>
                    </div>

                    {/* ===== লগইন বাটন ===== */}
                    <div className="hidden md:block">
                        <Link 
                            to="/login" 
                            className={`
                                px-6 py-2.5 rounded-lg text-sm font-semibold 
                                transition-all duration-300 
                                bg-indigo-600 text-white
                                hover:bg-indigo-700
                                shadow-sm hover:shadow-md
                                hover:scale-105 active:scale-95
                            `}
                        >
                            Log In
                        </Link>
                    </div>

                    {/* ===== হ্যামবার্গার বাটন (মোবাইল) ===== */}
                    <button 
                        onClick={toggleMenu}
                        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span className={`
                            w-7 h-0.5 rounded-full transition-all duration-300 bg-gray-700
                            ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}
                        `}></span>
                        <span className={`
                            w-7 h-0.5 rounded-full transition-all duration-300 bg-gray-700
                            ${isMenuOpen ? 'opacity-0' : ''}
                        `}></span>
                        <span className={`
                            w-7 h-0.5 rounded-full transition-all duration-300 bg-gray-700
                            ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}
                        `}></span>
                    </button>
                </div>
            </div>

            {/* ===== মোবাইল মেনু (স্লাইড) ===== */}
            <div className={`
                md:hidden fixed top-0 right-0 h-full w-72 
                bg-white shadow-2xl
                transition-all duration-400 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* মোবাইল মেনু হেডার */}
                <div className="flex items-center justify-between p-6 border-b">
                    <span className="text-xl font-bold text-gray-800">
                        Career<span className="text-indigo-600">Track</span>Lite
                    </span>
                    <button 
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* মোবাইল মেনু লিংকস */}
                <div className="p-6 space-y-2">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        🏠 Home
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        ℹ️ About
                    </NavLink>
                    <NavLink 
                        to="/services" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        ⚡ Services
                    </NavLink>
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        📞 Contact
                    </NavLink>

                    {/* মোবাইলে লগইন বাটন */}
                    <div className="pt-4 mt-4 border-t">
                        <Link 
                            to="/login" 
                            className="block w-full text-center px-4 py-3 rounded-lg text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
                            onClick={closeMenu}
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>

            {/* মোবাইল মেনু ওভারলে */}
            {isMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
                    onClick={toggleMenu}
                ></div>
            )}
        </nav>
    );
};

export default Navbar;