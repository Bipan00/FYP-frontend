import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const DEMO_EMAIL = 'superadmin@gharsathi.com';
const DEMO_PASSWORD = 'SuperAdmin123';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Both fields are required.');
            return;
        }
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    //  Demo Super Admin login 
    // This is for academic demo purpose only.
    // Uses the real /api/auth/login endpoint with pre-set demo credentials.
    // JWT is stored via the standard auth context login() function.
    const handleDemoLogin = async () => {
        setDemoLoading(true);
        setError('');
        try {
            await login(DEMO_EMAIL, DEMO_PASSWORD);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(
                err.message ||
                'Demo login failed. Ensure the demo admin account exists in the database.'
            );
        } finally {
            setDemoLoading(false);
        }
    };

return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-card">
                <div className="mb-6">
                    <Link to="/" className="text-primary font-bold text-xl">
                        GharSathi
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900 mt-2">
                        Sign in to your account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter your registered email and password below
                    </p>
                </div>
                {error && (
                    <div className="mb-4 border border-red-200 rounded-md p-2.5 text-xs text-red-600 bg-red-50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
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
                    <div className="mb-6">
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
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your password"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            Minimum 6 characters required
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || demoLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary font-semibold hover:underline">
                        Register here
                    </Link>
                </p>
                {DEMO_MODE && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-wide">
                            Demo Access
                        </p>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={loading || demoLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                        >
                            {demoLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                            {demoLoading ? 'Logging in...' : 'Login as Super Admin (Demo)'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
