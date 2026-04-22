import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

interface User {
    id: string;
    _id?: string; 
    name: string;
    email: string;
    role: 'Tenant' | 'Owner' | 'Admin';
    kycStatus?: 'not_submitted' | 'pending' | 'verified' | 'rejected';
    kycDocument?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { }
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

const login = async (email: string, password: string) => {
        try {
            const response = await apiService.post('/api/auth/login', { email, password });

            if (response.success) {
                const { user: userData, token } = response.data;

localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

setUser(userData);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    };

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

localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

setUser(userData);
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    };

const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { Outlet, Navigate } from 'react-router-dom';

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
