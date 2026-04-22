import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home as HomeIcon, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) =>
        `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${isActive(path)
            ? 'text-primary bg-red-50 font-semibold'
            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
        }`;

       return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <HomeIcon className="h-5 w-5 text-primary" strokeWidth={2.5} />
                        <span className="font-bold text-lg text-primary">GharSathi</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/explore" className={linkClass('/explore')}>
                            Explore
                        </Link>
                        <Link to="/ai-predictor" className={linkClass('/ai-predictor')}>
                            AI Predictor
                        </Link>
                        <Link to="/map" className={linkClass('/map')}>
                            Map
                        </Link>
                        <Link to="/forum" className={linkClass('/forum')}>
                            Forum
                        </Link>
                        <Link to="/about" className={linkClass('/about')}>
                            About
                        </Link>
                        <Link to="/contact" className={linkClass('/contact')}>
                            Contact
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'Owner' && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={linkClass('/dashboard')}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/owner-bookings"
                                            className={linkClass('/owner-bookings')}
                                        >
                                            Requests
                                        </Link>
                                    </>
                                )}
                                {user?.role === 'Admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className={linkClass('/admin/dashboard')}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                {user?.role === 'Tenant' && (
                                    <Link
                                        to="/my-bookings"
                                        className={linkClass('/my-bookings')}
                                    >
                                        My Bookings
                                    </Link>
                                )}
                                <Link to="/inbox" className={linkClass('/inbox')}>
                                    Messages
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`flex items-center gap-1.5 ${linkClass('/profile')}`}
                                    title={user?.name}
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline truncate max-w-24">
                                        {user?.name}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-all duration-200 ml-2"
                                    title="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-gray-700 hover:text-primary px-3 py-2 rounded-md hover:bg-gray-50 transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-primary"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
