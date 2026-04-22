import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DashboardTable, { TableColumn } from '../components/DashboardTable';
import apiService from '../services/api';
import { Loader2 } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
    isApproved: boolean;
    ownerId?: { name: string; email: string };
}

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'listings' | 'kyc'>('listings');
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    const [kycUsers, setKycUsers] = useState<any[]>([]);
    const [loadingKyc, setLoadingKyc] = useState(false);
    const [updatingKyc, setUpdatingKyc] = useState<string | null>(null);
    const [pendingKycCount, setPendingKycCount] = useState<number>(0);

    useEffect(() => {
        if (activeTab === 'listings' && listings.length === 0) fetchListings();
        if (activeTab === 'kyc') {
            if (kycUsers.length === 0) fetchKycUsers();
            fetchPendingKycCount();
        }
    }, [activeTab]);

    const fetchListings = async () => {
        try {
            const response = await apiService.getAdminListings();
            setListings(response.data || []);
        } catch (err) {
            setError('Failed to load listings.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, approve: boolean) => {
        setUpdating(id);
        try {
            await apiService.updateListingStatus(id, approve);
            
            setListings((prev) =>
                prev.map((l) => (l._id === id ? { ...l, isApproved: approve } : l))
            );
        } catch (err) {
            alert('Failed to update status.');
        } finally {
            setUpdating(null);
        }
    };

    const fetchKycUsers = async () => {
        setLoadingKyc(true);
        try {
            const response = await apiService.getKycUsers();
            setKycUsers(response.data || []);
        } catch (err) {
            setError('Failed to load KYC users.');
        } finally {
            setLoadingKyc(false);
        }
    };

    const fetchPendingKycCount = async () => {
        try {
            const response = await apiService.getPendingKycCount();
            setPendingKycCount(response.count || 0);
        } catch (err) {
            
        }
    };

    const handleKycStatusUpdate = async (id: string, approve: boolean) => {
        if (!approve) {
            const reason = window.prompt('Enter reason for rejection (optional):');
            if (reason === null) return; 

            setUpdatingKyc(id);
            try {
                await apiService.rejectKyc(id, reason);
                setKycUsers((prev) =>
                    prev.map((u) => (u._id === id ? { ...u, kycStatus: 'rejected', kycRejectionReason: reason } : u))
                );
                
                setPendingKycCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                alert('Failed to update KYC status.');
            } finally {
                setUpdatingKyc(null);
            }
        } else {
            setUpdatingKyc(id);
            try {
                await apiService.approveKyc(id);
                setKycUsers((prev) =>
                    prev.map((u) => (u._id === id ? { ...u, kycStatus: 'verified' } : u))
                );
                
                setPendingKycCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                alert('Failed to update KYC status.');
            } finally {
                setUpdatingKyc(null);
            }
        }
    };

const total = listings.length;
    const approved = listings.filter((l) => l.isApproved).length;
    const pending = listings.filter((l) => !l.isApproved).length;

    const columns: TableColumn[] = [
        {
            header: 'Title',
            key: 'title',
            render: (val) => (
                <span className="font-medium text-gray-800 text-sm">{val}</span>
            ),
        },
        {
            header: 'Owner',
            key: 'ownerId',
            render: (val) =>
                val ? (
                    <div>
                        <p className="text-sm text-gray-700">{val.name}</p>
                        <p className="text-xs text-gray-400">{val.email}</p>
                    </div>
                ) : (
                    <span className="text-gray-400"></span>
                ),
        },
        {
            header: 'Price',
            key: 'price',
            render: (val) => `Rs. ${val.toLocaleString()}`,
        },
        { header: 'Type', key: 'type' },
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
                    {!row.isApproved && (
                        <button
                            onClick={() => handleStatusUpdate(row._id, true)}
                            disabled={updating === row._id}
                            className="text-xs px-3 py-1 rounded border border-green-400 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                            {updating === row._id ? '...' : 'Approve'}
                        </button>
                    )}
                    {row.isApproved && (
                        <button
                            onClick={() => handleStatusUpdate(row._id, false)}
                            disabled={updating === row._id}
                            className="text-xs px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            {updating === row._id ? '...' : 'Reject'}
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const kycColumns: TableColumn[] = [
        {
            header: 'User',
            key: 'name',
            render: (val, row) => (
                <div>
                    <span className="font-medium text-gray-800 text-sm">{val}</span>
                    <p className="text-xs text-gray-500">{row.email}</p>
                </div>
            )
        },
        { header: 'Role', key: 'role' },
        {
            header: 'Submitted',
            key: 'kycSubmittedAt',
            render: (val) => val ? new Date(val).toLocaleDateString() : <span className="text-gray-400 text-xs"></span>
        },
        {
            header: 'Document',
            key: 'kycDocument',
            render: (val) => val ? (
                <a href={val} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">
                    View Document
                </a>
            ) : <span className="text-gray-400 text-xs">No Upload</span>
        },
        {
            header: 'Status',
            key: 'kycStatus',
            render: (val) => {
                if (val === 'verified') return <span className="badge-approved">Verified</span>;
                if (val === 'rejected') return <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Rejected</span>;
                if (val === 'pending') return <span className="badge-pending">Pending</span>;
                return <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">Not Submitted</span>;
            }
        },
        {
            header: 'Actions',
            key: '_id',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    {row.kycStatus === 'pending' && (
                        <>
                            <button
                                onClick={() => handleKycStatusUpdate(row._id, true)}
                                disabled={updatingKyc === row._id}
                                className="text-xs px-3 py-1 rounded border border-green-400 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                            >
                                {updatingKyc === row._id ? '...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => handleKycStatusUpdate(row._id, false)}
                                disabled={updatingKyc === row._id}
                                className="text-xs px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                {updatingKyc === row._id ? '...' : 'Reject'}
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="mt-2">
                    <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage property listings and user verifications
                    </p>
                </div>
                <div className="flex border-b border-gray-200 mb-6 mt-6">
                    <button
                        className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'listings'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('listings')}
                    >
                        Property Listings
                    </button>
                    <button
                        className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'kyc'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('kyc')}
                    >
                        KYC Verification
                        {pendingKycCount > 0 && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                {pendingKycCount}
                            </span>
                        )}
                    </button>
                </div>
                {activeTab === 'listings' && (
                    <>
                <div className="flex gap-4 mb-5">
                    <div className="border border-gray-200 rounded-md px-4 py-2 text-center">
                        <p className="text-lg font-bold text-gray-900">{total}</p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="border border-gray-200 rounded-md px-4 py-2 text-center">
                        <p className="text-lg font-bold text-green-700">{approved}</p>
                        <p className="text-xs text-gray-500">Approved</p>
                    </div>
                    <div className="border border-gray-200 rounded-md px-4 py-2 text-center">
                        <p className="text-lg font-bold text-yellow-600">{pending}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : error && activeTab === 'listings' ? (
                    <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                        {error}
                    </div>
                ) : (
                    <DashboardTable
                        columns={columns}
                        rows={listings}
                        emptyMessage="No listings have been submitted yet."
                    />
                )}
                    </>
                )}

                {activeTab === 'kyc' && (
                    <>
                        {loadingKyc ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : error && activeTab === 'kyc' ? (
                            <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                                {error}
                            </div>
                        ) : (
                            <DashboardTable
                                columns={kycColumns}
                                rows={kycUsers}
                                emptyMessage="No users found for KYC verification."
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
