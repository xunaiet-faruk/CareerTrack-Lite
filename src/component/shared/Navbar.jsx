import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
    FiUser, 
    FiLogOut, 
    FiLayout, 
    FiSettings, 
    FiChevronDown,
    FiHome,
    FiInfo,
    FiBriefcase,
    FiMail,
    FiUserCheck
} from 'react-icons/fi';
import { Authcontext } from '../../context/Authprovider';
import LoadingSpinner from './LoadingSpinner';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logOut, loading } = useContext(Authcontext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    const handleLogout = async () => {
        try {
            await logOut();
            setIsDropdownOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // ইউজারের ইনিশিয়াল (প্রথম অক্ষর)
    const getUserInitial = () => {
        if (user?.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    // ইউজারের সম্পূর্ণ নাম
    const getUserName = () => {
        if (user?.displayName) {
            return user.displayName;
        }
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    // ইউজারের ইমেইল
    const getUserEmail = () => {
        return user?.email || '';
    };

    // প্রোফাইল ফটো
    const getProfilePhoto = () => {
        return user?.photoURL || null;
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
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            <FiHome className="w-4 h-4" />
                            Home
                        </NavLink>
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            <FiInfo className="w-4 h-4" />
                            About
                        </NavLink>
                        <NavLink 
                            to="/services" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            <FiBriefcase className="w-4 h-4" />
                            Services
                        </NavLink>
                        <NavLink 
                            to="/contact" 
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                        >
                            <FiMail className="w-4 h-4" />
                            Contact
                        </NavLink>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {loading ? (
                           <LoadingSpinner/>
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex cursor-pointer items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                                >
                                    {/* অ্যাভাটার */}
                                    <div className="relative">
                                        {getProfilePhoto() ? (
                                            <img
                                                src={getProfilePhoto()}
                                                alt={getUserName()}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400 ring-offset-2"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-indigo-400 ring-offset-2">
                                                {getUserInitial()}
                                            </div>
                                        )}
                                        {/* অনলাইন স্ট্যাটাস ডট */}
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    
                                    <div className="text-left hidden lg:block">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {getUserName()}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                            {getUserEmail()}
                                        </p>
                                    </div>
                                    
                                    <FiChevronDown className={`
                                        text-gray-400 transition-transform duration-300
                                        ${isDropdownOpen ? 'rotate-180' : ''}
                                    `} />
                                </button>

                                {/* ===== ড্রপডাউন মেনু ===== */}
                                {isDropdownOpen && (
                                    <>
                                        {/* ওভারলে */}
                                        <div 
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsDropdownOpen(false)}
                                        ></div>
                                        
                                        {/* ড্রপডাউন */}
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slideDown">
                                            {/* প্রোফাইল হেডার */}
                                            <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                                                <div className="flex items-center gap-3">
                                                    {getProfilePhoto() ? (
                                                        <img
                                                            src={getProfilePhoto()}
                                                            alt={getUserName()}
                                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-400"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl ring-2 ring-indigo-400">
                                                            {getUserInitial()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {getUserName()}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate max-w-[180px]">
                                                            {getUserEmail()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* মেনু আইটেম */}
                                            <div className="p-2">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        closeMenu();
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 group"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                                                        <FiLayout className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            Dashboard
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Manage your applications
                                                        </p>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/profile"
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        closeMenu();
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 group"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                                                        <FiUser className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            Profile
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            View your profile
                                                        </p>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/settings"
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        closeMenu();
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 group"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors">
                                                        <FiSettings className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            Settings
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Account preferences
                                                        </p>
                                                    </div>
                                                </Link>

                                                <div className="border-t my-2"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 group"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                                                        <FiLogOut className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-red-600">
                                                            Logout
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Sign out of your account
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            // ❌ ইউজার লগইন না থাকলে - লগইন বাটন
                            <Link 
                                to="/login" 
                                className={`
                                    px-6 py-2.5 rounded-lg text-sm font-semibold 
                                    transition-all duration-300 
                                    bg-indigo-600 text-white
                                    hover:bg-indigo-700
                                    shadow-sm hover:shadow-md
                                    hover:scale-105 active:scale-95
                                    flex items-center gap-2
                                `}
                            >
                                <FiUserCheck className="w-4 h-4" />
                                Log In
                            </Link>
                        )}
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

                {/* মোবাইলে ইউজার প্রোফাইল */}
                {user && (
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                        <div className="flex items-center gap-3">
                            {getProfilePhoto() ? (
                                <img
                                    src={getProfilePhoto()}
                                    alt={getUserName()}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-indigo-400">
                                    {getUserInitial()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {getUserName()}
                                </p>
                                <p className="text-sm text-gray-500 truncate max-w-[150px]">
                                    {getUserEmail()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* মোবাইল মেনু লিংকস */}
                <div className="p-6 space-y-2">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        <FiHome className="w-5 h-5" />
                        Home
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        <FiInfo className="w-5 h-5" />
                        About
                    </NavLink>
                    <NavLink 
                        to="/services" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        <FiBriefcase className="w-5 h-5" />
                        Services
                    </NavLink>
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) => `
                            block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3
                            ${isActive 
                                ? 'text-indigo-600 bg-indigo-50' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }
                        `}
                        onClick={closeMenu}
                    >
                        <FiMail className="w-5 h-5" />
                        Contact
                    </NavLink>

                    {/* মোবাইলে ড্যাশবোর্ড (লগইন থাকলে) */}
                    {user && (
                        <NavLink 
                            to="/dashboard" 
                            className={({ isActive }) => `
                                block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center gap-3
                                ${isActive 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }
                            `}
                            onClick={closeMenu}
                        >
                            <FiLayout className="w-5 h-5" />
                            Dashboard
                        </NavLink>
                    )}

                    {/* মোবাইলে লগইন/লগআউট বাটন */}
                    <div className="pt-4 mt-4 border-t">
                        {user ? (
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    closeMenu();
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <FiLogOut className="w-5 h-5" />
                                Logout
                            </button>
                        ) : (
                            <Link 
                                to="/login" 
                                className="block w-full text-center px-4 py-3 rounded-lg text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
                                onClick={closeMenu}
                            >
                                Log In
                            </Link>
                        )}
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

            {/* ===== ড্রপডাউন অ্যানিমেশন CSS ===== */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;