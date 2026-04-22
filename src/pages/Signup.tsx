import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Tenant',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-card">
                {/* Brand */}
                <div className="mb-6">
                    <Link to="/" className="text-primary font-bold text-xl">
                        GharSathi
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900 mt-2">
                        Create an account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in the details below to register
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 border border-red-200 rounded-md p-2.5 text-xs text-red-600 bg-red-50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Full Name */}
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    {/* Role */}
                    <div className="mb-6">
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Register as
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Tenant">Tenant  I'm looking for a property</option>
                            <option value="Owner">Owner  I want to list my property</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1.5">
                            Owners can add and manage property listings after registering.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary font-semibold hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
