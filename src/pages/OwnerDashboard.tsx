import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardTable, { TableColumn } from '../components/DashboardTable';
import KYCVerificationBanner from '../components/KYCVerificationBanner';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Plus, AlertCircle } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
    isApproved: boolean;
    createdAt: string;
}

const OwnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await apiService.getOwnerListings();
            setListings(response.data || []);
        } catch (err) {
            setError('Failed to load your listings.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this listing permanently?')) return;
        setDeleting(id);
        try {
            await apiService.deleteListing(id);
            setListings((prev) => prev.filter((l) => l._id !== id));
        } catch (err) {
            alert('Failed to delete listing.');
        } finally {
            setDeleting(null);
        }
    };

    // Calculate summary stats
    const total = listings.length;
    const approved = listings.filter((l) => l.isApproved).length;
    const pending = listings.filter((l) => !l.isApproved).length;

    // Table column definitions
    const columns: TableColumn[] = [
        { header: 'Title', key: 'title' },
        { header: 'Location', key: 'location' },
        {
            header: 'Price (NPR)',
            key: 'price',
            render: (val) => `Rs. ${val.toLocaleString()}`,
        },
        {
            header: 'Status',
            key: 'isApproved',
            render: (val) =>
                val ? (
                    <span className="badge-approved">Approved</span>
                ) : (
                    <span className="badge-pending">Pending</span>
                ),
        },
        {
            header: 'Actions',
            key: '_id',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/listings/edit/${row._id}`)}
                        className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-700 hover:border-gray-500 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        disabled={deleting === row._id}
                        className="text-xs px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        {deleting === row._id ? '...' : 'Delete'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Owner Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Manage your property listings
                        </p>
                    </div>
                    {user?.kycStatus === 'verified' ? (
                        <button
                            onClick={() => navigate('/listings/add')}
                            className="btn-primary flex items-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" />
                            Add Listing
                        </button>
                    ) : (
                        <button
                            disabled
                            title="Complete KYC to add listing"
                            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed flex items-center gap-1.5 font-medium"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Verify to Add Listing
                        </button>
                    )}
                </div>
                {user?.kycStatus !== 'verified' && (
                    <KYCVerificationBanner 
                        kycStatus={user?.kycStatus || 'not_submitted'} 
                        onVerifyClick={() => navigate('/profile')} 
                    />
                )}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="border border-gray-200 rounded-md p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                        <p className="text-xs text-gray-500 mt-1">Total Listings</p>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4 text-center">
                        <p className="text-2xl font-bold text-green-700">{approved}</p>
                        <p className="text-xs text-gray-500 mt-1">Approved</p>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                        <p className="text-xs text-gray-500 mt-1">Pending Review</p>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                        {error}
                    </div>
                ) : (
                    <DashboardTable
                        columns={columns}
                        rows={listings}
                        emptyMessage="You haven't added any listings yet. Click 'Add Listing' to get started."
                    />
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
