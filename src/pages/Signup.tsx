/**
 * Signup Page
 * 
 * Purpose: Airbnb-style signup page with role selection
 * This page allows new users to create an account and choose their role.
 * 
 * Academic Note: This demonstrates:
 * - Complex form handling with multiple inputs
 * - Radio button selection for roles
 * - Form validation
 * - Error handling and display
 * - Modern UI design with Tailwind CSS
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Mail, Lock, User, AlertCircle, Loader2, UserCircle, Building } from 'lucide-react';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Tenant' // Default role
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            // Redirect to home page on success
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
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
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join GharSathi today
                </p>
            </div>

            {/* Signup Form */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-200">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I want to
                            </label>
                            <div className="space-y-3">
                                {/* Tenant Option */}
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'Tenant'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Tenant"
                                        checked={formData.role === 'Tenant'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <div className="ml-3 flex items-center gap-3">
                                        <UserCircle className={`h-6 w-6 ${formData.role === 'Tenant' ? 'text-primary' : 'text-gray-400'
                                            }`} />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Find a place</p>
                                            <p className="text-xs text-gray-500">Browse and book properties</p>
                                        </div>
                                    </div>
                                </label>

                                {/* Owner Option */}
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'Owner'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Owner"
                                        checked={formData.role === 'Owner'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <div className="ml-3 flex items-center gap-3">
                                        <Building className={`h-6 w-6 ${formData.role === 'Owner' ? 'text-primary' : 'text-gray-400'
                                            }`} />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">List my property</p>
                                            <p className="text-xs text-gray-500">Manage and rent out properties</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create account'
                                )}
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
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                        >
                            Login instead
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

export default Signup;
