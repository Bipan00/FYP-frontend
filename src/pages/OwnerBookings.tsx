import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardTable, { TableColumn } from '../components/DashboardTable';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, FileText } from 'lucide-react';

interface Booking {
    _id: string;
    listingId: {
        _id: string;
        title: string;
        location: string;
    };
    tenantId?: {
        name: string;
        email: string;
    };
    message?: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    createdAt: string;
    agreementUrl?: string;  
}

const OwnerBookings: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [generatingAgreement, setGeneratingAgreement] = useState<string | null>(null);

    // Redirect if not authenticated or not an owner
    if (!isLoading && (!isAuthenticated || user?.role !== 'Owner')) {
        navigate('/explore');
        return null;
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await apiService.getOwnerBookings();
            setBookings(response.data || []);
        } catch (err) {
            setError('Failed to load incoming booking requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: 'Accepted' | 'Rejected') => {
        if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) return;
        
        setProcessingId(id);
        try {
            await apiService.updateBookingStatus(id, newStatus);
            
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        } catch (err: any) {
            alert(err.message || `Failed to ${newStatus.toLowerCase()} booking`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleGenerateAgreement = async (bookingId: string) => {
        setGeneratingAgreement(bookingId);
        try {
            const res = await apiService.generateAgreement(bookingId);
            if (res.pdfUrl) {
                
                window.open(res.pdfUrl, '_blank');
                
                setBookings(prev =>
                    prev.map(b => b._id === bookingId ? { ...b, agreementUrl: res.pdfUrl } : b)
                );
            }
        } catch (err: any) {
            alert(err.message || 'Failed to generate agreement');
        } finally {
            setGeneratingAgreement(null);
        }
    };

const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Accepted') return <span className="badge-approved">Accepted</span>;
        if (status === 'Rejected') return <span className="badge-rejected">Rejected</span>;
        return <span className="badge-pending">Pending</span>;
    };

    const columns: TableColumn[] = [
        {
            header: 'Property',
            key: 'listingId',
            render: (val) =>
                val ? (
                    <div>
                        <Link
                            to={`/listings/${val._id}`}
                            className="text-sm font-medium text-[#5D2E8E] hover:underline"
                        >
                            {val.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{val.location}</p>
                    </div>
                ) : (
                    <span className="text-gray-400">Listing removed</span>
                ),
        },
        {
            header: 'Tenant',
            key: 'tenantId',
            render: (val) => val ? (
                 <div>
                    <span className="text-sm font-medium text-gray-800">{val.name}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{val.email}</p>
                 </div>
            ) : ''
        },
        {
            header: 'Requested On',
            key: 'createdAt',
            render: (val) =>
                new Date(val).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            header: 'Initial Message',
            key: 'message',
            render: (val) => val ? <span className="text-xs text-gray-600 truncate max-w-xs inline-block" title={val}>{val}</span> : <span className="text-xs text-gray-400"></span>
        },
        {
            header: 'Status',
            key: 'status',
            render: (val) => <StatusBadge status={val} />,
        },
        {
            header: 'Actions',
            key: '_id',
            render: (val, row: Booking) => {
                if (row.status === 'Accepted') {
                    const isGenerating = generatingAgreement === val;
                    return (
                        <button
                            onClick={() => handleGenerateAgreement(val)}
                            disabled={isGenerating}
                            title={row.agreementUrl ? 'Re-download Agreement' : 'Generate PDF Agreement'}
                            className="flex items-center gap-1.5 bg-purple-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
                            ) : (
                                <><FileText className="w-3 h-3" /> {row.agreementUrl ? 'View Agreement' : 'Generate Agreement'}</>
                            )}
                        </button>
                    );
                }

                if (row.status === 'Rejected') {
                    return <span className="text-xs text-gray-400">Rejected</span>;
                }

return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleUpdateStatus(val, 'Accepted')}
                            disabled={processingId === val}
                            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {processingId === val ? '...' : 'Accept'}
                        </button>
                        <button
                            onClick={() => handleUpdateStatus(val, 'Rejected')}
                            disabled={processingId === val}
                            className="bg-white border border-red-200 text-red-600 text-xs px-3 py-1.5 rounded font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            {processingId === val ? '...' : 'Reject'}
                        </button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Tenant Requests</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Review and manage incoming booking and viewing requests
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-[#5D2E8E]" />
                    </div>
                ) : error ? (
                    <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                        {error}
                    </div>
                ) : (
                    <DashboardTable
                        columns={columns}
                        rows={bookings}
                        emptyMessage="You have no pending requests from tenants at this time."
                    />
                )}
            </div>
        </div>
    );
};

export default OwnerBookings;
