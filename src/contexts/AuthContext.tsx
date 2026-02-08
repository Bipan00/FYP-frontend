/**
 * Authentication Context
 * 
 * Purpose: Manage authentication state across the application
 * This context provides login, logout, and user state management.
 * 
 * Academic Note: This demonstrates:
 * - React Context API for global state management
 * - JWT token storage and retrieval
 * - Protected route implementation
 * - Authentication flow in React
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

// Define the shape of our auth context
interface User {
    id: string;
    _id?: string; // MongoDB ID compatibility
    name: string;
    email: string;
    role: 'Tenant' | 'Owner' | 'Admin';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { }
});

/**
 * Custom hook to use auth context
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Load user from token on app start
     */
    useEffect(() => {
        const loadUser = () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    /**
     * Login Function
     * Calls login API and stores token + user data
     */
    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.post('/api/auth/login', { email, password });

            if (response.success) {
                const { user: userData, token } = response.data;

                // Store token and user data in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Update state
                setUser(userData);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    };

    /**
     * Register Function
     * Calls register API and stores token + user data
     */
    const register = async (name: string, email: string, password: string, role: string) => {
        try {
            const response = await apiService.post('/api/auth/register', {
                name,
                email,
                password,
                role
            });

            if (response.success) {
                const { user: userData, token } = response.data;

                // Store token and user data in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Update state
                setUser(userData);
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    };

    /**
     * Logout Function
     * Clears token and user data
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { Outlet, Navigate } from 'react-router-dom';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Renders Outlet for child routes if no children provided
 */
interface ProtectedRouteProps {
    children?: React.ReactNode;
    requiredRole?: 'Owner' | 'Admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole && user?.role !== 'Admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return children ? <>{children}</> : <Outlet />;
};
