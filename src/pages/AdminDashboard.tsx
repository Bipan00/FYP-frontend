/**
 * Admin Dashboard Page
 * 
 * Purpose: Allow admins to view all listings and approve/reject them.
 * 
 * Features:
 * - Table view of all listings
 * - Status badges (Pending, Approved, Rejected)
 * - Actions to Approve or Reject listings
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { Home as HomeIcon, CheckCircle, XCircle, Clock, Loader2, AlertCircle, Search } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    price: number;
    type: string;
    location: string;
    isApproved: boolean | undefined; // undefined/null = pending
    ownerId: {
        name: string;
        email: string;
    };
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await apiService.getAdminListings();
            if (response.success) {
                setListings(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch listings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, isApproved: boolean) => {
        setActionLoading(id);
        try {
            const response = await apiService.updateListingStatus(id, isApproved);
            if (response.success) {
                setListings(prev => prev.map(listing =>
                    listing._id === id ? { ...listing, isApproved } : listing
                ));
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredListings = listings.filter(listing => {
        if (filter === 'all') return true;
        if (filter === 'pending') return listing.isApproved === undefined;
        if (filter === 'approved') return listing.isApproved === true;
        if (filter === 'rejected') return listing.isApproved === false;
        return true;
    });

    const getStatusBadge = (isApproved: boolean | undefined) => {
        if (isApproved === true) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3" />
                    Approved
                </span>
            );
        } else if (isApproved === false) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3" />
                    Rejected
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3" />
                    Pending
                </span>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <HomeIcon className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl text-primary">GharSathi Admin</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Administrator View</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Listing Verification</h1>
                        <p className="mt-1 text-sm text-gray-600">Review and approve property listings</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Filter Tabs */}
                        <div className="bg-white rounded-lg p-1 border border-gray-200 flex">
                            {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Listings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                            <p className="mt-4 text-gray-500">Loading listings...</p>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="p-12 text-center">
                            <Search className="h-12 w-12 text-gray-300 mx-auto" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No listings found</h3>
                            <p className="mt-2 text-gray-500">
                                {filter === 'all'
                                    ? 'There are no listings in the system.'
                                    : `No ${filter} listings found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredListings.map((listing) => (
                                        <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                                                <div className="text-xs text-gray-500">{listing.location}</div>
                                                <div className="text-xs text-gray-400 mt-1">ID: {listing._id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{listing.ownerId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{listing.ownerId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Rs. {listing.price.toLocaleString()}</div>
                                                <div className="text-xs text-gray-500">{listing.type}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(listing.isApproved)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {actionLoading === listing._id ? (
                                                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(listing._id, true)}
                                                                disabled={listing.isApproved === true}
                                                                className={`p-1 rounded hover:bg-green-50 ${listing.isApproved === true ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:text-green-900'}`}
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(listing._id, false)}
                                                                disabled={listing.isApproved === false}
                                                                className={`p-1 rounded hover:bg-red-50 ${listing.isApproved === false ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                                                title="Reject"
                                                            >
                                                                <XCircle className="h-5 w-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
