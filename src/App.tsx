import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OwnerDashboard from './pages/OwnerDashboard'
import AddListing from './pages/AddListing'
import EditListing from './pages/EditListing'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import ListingDetail from './pages/ListingDetail'
import Explore from './pages/Explore'

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/listings/:id" element={<ListingDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes (Owner) */}
                        <Route element={<ProtectedRoute requiredRole="Owner" />}>
                            <Route path="/dashboard" element={<OwnerDashboard />} />
                            <Route path="/listings/add" element={<AddListing />} />
                            <Route path="/listings/edit/:id" element={<EditListing />} />
                        </Route>

                        {/* Protected Routes (Admin) */}
                        <Route element={<ProtectedRoute requiredRole="Admin" />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>

                        {/* 404 Route */}
                        <Route path="*" element={
                            <div className="flex-1 flex flex-col justify-center items-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-gray-600">Page not found</p>
                            </div>
                        } />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
