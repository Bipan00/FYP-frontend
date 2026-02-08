import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Search, User, Menu, Home as HomeIcon, LogOut } from 'lucide-react'

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth()

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <HomeIcon className="h-8 w-8 text-primary" strokeWidth={2.5} />
                        <span className="font-bold text-2xl text-primary hidden sm:block">
                            GharSathi
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center ml-8 gap-6">
                        <Link to="/explore" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Explore
                        </Link>
                    </div>

                    {/* Search Bar - Airbnb Style */}
                    <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
                        <div className="w-full flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer p-1">
                            <input
                                type="text"
                                placeholder="Find rooms, hostels, flats..."
                                className="flex-1 px-6 py-2 rounded-full outline-none text-sm font-medium text-gray-700 placeholder:text-gray-500 bg-transparent"
                            />
                            <button className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-colors">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Menu */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {/* Dashboard link for owners */}
                                {user?.role === 'Owner' && (
                                    <Link
                                        to="/dashboard"
                                        className="text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {/* Dashboard link for Admin */}
                                {user?.role === 'Admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-sm font-semibold py-2 px-4 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <span className="hidden lg:block text-sm font-medium text-gray-700">
                                    Welcome, {user?.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm font-semibold py-2 px-4 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

