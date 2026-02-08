/**
 * Owner Dashboard
 * 
 * Purpose: Display and manage property listings for owners
 * Airbnb-inspired design with grid layout and status badges.
 * 
 * Academic Note: This demonstrates:
 * - Protected route for role-based access
 * - API integration with loading and error states
 * - CRUD operations from frontend
 * - Modern UI with Tailwind CSS
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Plus, Edit, Trash2, MapPin, Loader2, AlertCircle, Home as HomeIcon } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    type: string;
    images: string[];
    isApproved: boolean;
    createdAt: string;
}

const OwnerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Fetch owner's listings on component mount
     */
    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await apiService.getOwnerListings();
            setListings(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load listings');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle delete listing
     */
    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            await apiService.deleteListing(id);
            // Remove from local state
            setListings(listings.filter(listing => listing._id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete listing');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <HomeIcon className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl text-primary">GharSathi</span>
                        </Link>
                        <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Listings</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage and track your property listings
                        </p>
                    </div>
                    <Link
                        to="/listings/add"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Listing
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                            <p className="mt-4 text-gray-600">Loading your listings...</p>
                        </div>
                    </div>
                ) : listings.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <HomeIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">You haven't posted any properties yet. Get started by creating your first listing.</p>
                        <Link
                            to="/listings/add"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            Create Listing
                        </Link>
                    </div>
                ) : (
                    /* Listings Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((listing) => (
                            <div
                                key={listing._id}
                                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                    {listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <HomeIcon className="h-12 w-12 text-gray-300" />
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        {listing.isApproved ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm backdrop-blur-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm backdrop-blur-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
                                                Pending Review
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                        {listing.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                        {listing.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">{listing.location}</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Monthly Rent</span>
                                            <span className="text-lg font-bold text-primary">
                                                NPR {listing.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            to={`/listings/edit/${listing._id}`}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-all text-sm font-medium text-gray-700"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(listing._id, listing.title)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-200 transition-all text-sm font-medium"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
