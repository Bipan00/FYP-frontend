/**
 * Login Page
 * 
 * Purpose: Airbnb-style login page for user authentication
 * This page allows users to login with email and password.
 * 
 * Academic Note: This demonstrates:
 * - Form handling in React
 * - State management with useState
 * - Error handling and display
 * - Navigation with React Router
 * - Modern UI design with Tailwind CSS
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handle input changes
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (error) setError('');
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            // Redirect to home page on success
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex items-center justify-center gap-2 mb-6">
                    <Home className="h-10 w-10 text-primary" strokeWidth={2.5} />
                    <span className="text-3xl font-bold text-primary">GharSathi</span>
                </Link>
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Login to your account
                </p>
            </div>

            {/* Login Form */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-200">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </div>

                        {/* DEV SHORTCUT: Admin Login */}
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({ email: 'admin@gharsathi.com', password: 'admin123' });
                                    // Optional: automatically submit or just let user click login
                                    // If auto-submit is desired, we can call login directly here, 
                                    // but setting state and letting user click is safer for UX clarity.
                                }}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                            >
                                <Lock className="h-4 w-4" />
                                Auto-fill Admin Credentials
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">New to GharSathi?</span>
                            </div>
                        </div>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-6">
                        <Link
                            to="/signup"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>

                {/* Academic Disclaimer */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    Final Year Project - Academic Use Only
                </p>
            </div>
        </div>
    );
};

export default Login;
