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
    ownerId?: {
        name: string;
    };
    message?: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    createdAt: string;
    rentDueDate?: string;
}

const MyBookings: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    // Redirect if not authenticated  must be in useEffect to comply with React Hooks rules
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;
        const fetchBookings = async () => {
            try {
                const response = await apiService.getMyBookings();
                setBookings(response.data || []);
            } catch (err) {
                setError('Failed to load your booking requests.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [isLoading, isAuthenticated]);

    const handlePayment = async (booking: Booking) => {
        try {
            const response = await apiService.initiateKhaltiPayment(booking._id, 10000, `Rent for ${booking.listingId.title}`);
            if (response.payment_url) {
                window.location.href = response.payment_url;
            }
        } catch (err: any) {
            alert(err.message || 'Failed to initiate payment');
        }
    };

    const handleDownloadAgreement = async (bookingId: string) => {
        setDownloadingId(bookingId);
        try {
            const res = await apiService.getAgreement(bookingId);
            if (res.pdfUrl) {
                window.open(res.pdfUrl, '_blank');
            }
        } catch (err: any) {
            alert('No agreement generated yet. Please ask your owner to generate it first.');
        } finally {
            setDownloadingId(null);
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
                            className="text-sm font-medium text-primary hover:underline"
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
            header: 'Owner',
            key: 'ownerId',
            render: (val) => val?.name || '',
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
            header: 'Status',
            key: 'status',
            render: (val) => <StatusBadge status={val} />,
        },
        {
            header: 'Action',
            key: '_id',
            render: (_val, row: Booking) => {
                if (row.status === 'Accepted') {
                    const isDownloading = downloadingId === row._id;
                    return (
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handlePayment(row)}
                                className="bg-[#5D2E8E] text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-[#4d2675] transition-colors"
                            >
                                Pay Rent
                            </button>
                            <button
                                onClick={() => handleDownloadAgreement(row._id)}
                                disabled={isDownloading}
                                title="Download Rental Agreement PDF"
                                className="flex items-center gap-1 border border-purple-300 text-purple-700 text-xs px-3 py-1.5 rounded font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
                            >
                                {isDownloading ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <FileText className="w-3 h-3" />
                                )}
                                Agreement
                            </button>
                        </div>
                    );
                }
                return <span className="text-gray-400 text-xs"></span>;
            },
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Viewing requests you have sent to property owners
                    </p>
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
                        rows={bookings}
                        emptyMessage="You haven't sent any booking requests yet. Explore listings to get started."
                    />
                )}

                {!loading && bookings.length === 0 && !error && (
                    <div className="mt-4 text-center">
                        <Link to="/explore" className="text-sm text-primary hover:underline">
                            Browse available properties 
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
