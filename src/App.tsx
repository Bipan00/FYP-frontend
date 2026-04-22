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
import About from './pages/About'
import AIPredictor from './pages/AIPredictor'
import MapPage from './pages/MapPage'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import ChatPage from './pages/ChatPage'
import Inbox from './pages/Inbox'
import PaymentSuccess from './pages/PaymentSuccess'
import OwnerBookings from './pages/OwnerBookings'
import AgreementView from './pages/AgreementView'
import ForumPage from './pages/ForumPage'
import ForumPostPage from './pages/ForumPostPage'
import CreatePostPage from './pages/CreatePostPage'
import { SocketProvider } from './contexts/SocketContext'

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-white font-sans">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/ai-predictor" element={<AIPredictor />} />
                        <Route path="/listings/:id" element={<ListingDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/forum" element={<ForumPage />} />
                        <Route path="/forum/new" element={<CreatePostPage />} />
                        <Route path="/forum/:id" element={<ForumPostPage />} />
                        <Route element={(
                            <SocketProvider>
                                <ProtectedRoute />
                            </SocketProvider>
                        )}>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/my-bookings" element={<MyBookings />} />
                            <Route path="/agreement/:bookingId" element={<AgreementView />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/chat/:listingId/:receiverId" element={<ChatPage />} />
                            <Route path="/inbox" element={<Inbox />} />
                        </Route>
                        <Route element={(
                            <SocketProvider>
                                <ProtectedRoute requiredRole="Owner" />
                            </SocketProvider>
                        )}>
                            <Route path="/dashboard" element={<OwnerDashboard />} />
                            <Route path="/owner-bookings" element={<OwnerBookings />} />
                            <Route path="/listings/add" element={<AddListing />} />
                            <Route path="/listings/edit/:id" element={<EditListing />} />
                        </Route>
                        <Route element={<ProtectedRoute requiredRole="Admin" />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>
                        <Route path="*" element={
                            <div className="flex-1 flex flex-col justify-center items-center py-20">
                                <p className="text-5xl font-bold text-gray-200 mb-2">404</p>
                                <h1 className="text-lg font-semibold text-gray-700 mb-1">Page not found</h1>
                                <p className="text-sm text-gray-500">The page you're looking for doesn't exist.</p>
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
