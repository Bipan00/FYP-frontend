import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SectionTitle from '../components/SectionTitle';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, MapPin, User, Calendar, Tag, DollarSign, MessageCircle, CheckCircle } from 'lucide-react';
import NeighbourhoodInsights from '../components/NeighbourhoodInsights';

interface Listing {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    images: string[];
    isApproved: boolean;
    createdAt: string;
    ownerId?: {
        _id: string;
        name: string;
        email: string;
        kycStatus?: string;
    };
    latitude?: number;
    longitude?: number;
}

const ListingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [listing, setListing] = useState<Listing | null>(null);
    const [recommendations, setRecommendations] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(0);

    // Booking request state
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchListing = async () => {
            try {
                const response = await apiService.getListingById(id);
                setListing(response.data);

                try {
                    const recRes = await apiService.getRecommendations(id);
                    setRecommendations(recRes.data || []);
                } catch(e) {
                    console.error("Could not fetch recommendations", e);
                }
            } catch (err) {
                setError('Could not load listing details.');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const handleBookingRequest = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setBookingError('');
        try {
            await apiService.createBooking(id!, bookingMessage);
            setBookingSuccess(true);
            setShowBookingForm(false);
        } catch (err: any) {
            setBookingError(err.message || 'Failed to send request.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="page-container">
                    <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                        {error || 'Listing not found.'}
                    </div>
                </div>
            </div>
        );
    }

    const mainImage =
        listing.images.length > 0
            ? listing.images[activeImage]
            : 'https://placehold.co/800x400?text=No+Image';
    const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const isOwner = user?.id === listing.ownerId?._id || user?._id === listing.ownerId?._id;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="text-xs text-gray-400 mb-3">
                    <button onClick={() => navigate('/explore')} className="hover:text-primary">
                        Explore
                    </button>
                    <span className="mx-1">/</span>
                    <span className="text-gray-600">{listing.title}</span>
                </div>
                <div className="w-full overflow-hidden rounded-md border border-gray-200 mb-4" style={{ maxHeight: 280 }}>
                    <img
                        src={mainImage}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: 280 }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'https://placehold.co/800x400?text=No+Image';
                        }}
                    />
                </div>
                {listing.images.length > 1 && (
                    <div className="flex gap-2 mb-6">
                        {listing.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`w-16 h-12 rounded border overflow-hidden shrink-0 transition-colors ${idx === activeImage
                                        ? 'border-primary'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex gap-6 items-start">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">
                            {listing.title}
                        </h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{listing.location}</span>
                        </div>
                        <div className="section">
                            <SectionTitle title="Description" />
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {listing.description}
                            </p>
                        </div>
                        <div className="section">
                            <SectionTitle title="Property Details" />
                            <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="py-2.5 px-4 font-medium text-gray-600 bg-gray-50 w-36 flex items-center gap-2">
                                            <DollarSign className="w-3.5 h-3.5" /> Price
                                        </td>
                                        <td className="py-2.5 px-4 text-gray-800 font-semibold">
                                            Rs. {listing.price.toLocaleString()} / month
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-4 font-medium text-gray-600 bg-gray-50">
                                            <span className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5" /> Type
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 text-gray-800">
                                            {listing.type}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-4 font-medium text-gray-600 bg-gray-50">
                                            <span className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" /> Location
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 text-gray-800">
                                            {listing.location}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-4 font-medium text-gray-600 bg-gray-50">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" /> Posted
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 text-gray-800">
                                            {formattedDate}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-72 shrink-0">
                        <div className="card rounded-md p-4 mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2">
                                Property Owner
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-medium text-gray-800">
                                            {listing.ownerId?.name || 'Owner'}
                                        </p>
                                        {listing.ownerId?.kycStatus === 'verified' && (
                                            <span title="Verified Owner">
                                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {listing.ownerId?.email || ''}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                Price: <span className="font-semibold text-primary">Rs. {listing.price.toLocaleString()}/mo</span>
                            </p>
                        </div>

                        {/* Booking Section */}
                        {bookingSuccess ? (
                            <div className="border border-green-200 rounded-md p-3 text-sm text-green-700 bg-green-50">
                                 Booking request sent! The owner will respond shortly.
                            </div>
                        ) : isOwner ? (
                            <div className="border border-gray-200 rounded-md p-3 text-xs text-gray-500 text-center mb-4">
                                This is your listing.
                            </div>
                        ) : (
                            <>
                                {showBookingForm ? (
                                    <div className="card rounded-md p-4 mb-4">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Message to owner (optional)
                                        </label>
                                        <textarea
                                            value={bookingMessage}
                                            onChange={(e) => setBookingMessage(e.target.value)}
                                            rows={3}
                                            className="form-input mb-3 resize-none"
                                            placeholder="Introduce yourself or ask a question..."
                                        />
                                        {bookingError && (
                                            <p className="text-xs text-red-600 mb-2">{bookingError}</p>
                                        )}
                                        <button
                                            onClick={handleBookingRequest}
                                            disabled={bookingLoading}
                                            className="btn-primary w-full flex items-center justify-center gap-2"
                                        >
                                            {bookingLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Send Request'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowBookingForm(false)}
                                            className="w-full text-xs text-gray-500 hover:text-gray-700 mt-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() =>
                                            isAuthenticated
                                                ? setShowBookingForm(true)
                                                : navigate('/login')
                                        }
                                        className="btn-primary w-full mb-3"
                                    >
                                        {isAuthenticated ? 'Request Booking' : 'Login to Book'}
                                    </button>
                                )}
                                <button
                                    onClick={() => 
                                        isAuthenticated 
                                            ? navigate(`/chat/${listing._id}/${listing.ownerId?._id}`) 
                                            : navigate('/login')
                                    }
                                    className="btn-secondary w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {isAuthenticated ? 'Message Owner' : 'Login to Message'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {listing.latitude && listing.longitude ? (
                    <NeighbourhoodInsights 
                        listingId={listing._id} 
                        latitude={listing.latitude} 
                        longitude={listing.longitude} 
                    />
                ) : null}
                {recommendations.length > 0 && (
                    <div className="mt-12 mb-8 w-full border-t border-gray-200 pt-8">
                        <SectionTitle title="You may also like" />
                        <div className="flex gap-5 overflow-x-auto pb-6 pt-2 custom-scrollbar">
                            {recommendations.map(rec => (
                                <div 
                                    key={rec._id} 
                                    className="w-[280px] shrink-0 rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 bg-white relative group"
                                    onClick={() => {
                                        navigate(`/listings/${rec._id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="h-[180px] w-full overflow-hidden bg-gray-100 relative">
                                        <img 
                                            src={rec.images?.[0] || 'https://placehold.co/400x300?text=No+Image'} 
                                            alt={rec.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                                            }}
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                                            <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">
                                                {rec.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-primary" /> {rec.location}
                                        </p>
                                        <h4 className="font-semibold text-gray-900 truncate text-base mb-2 group-hover:text-primary transition-colors" title={rec.title}>
                                            {rec.title}
                                        </h4>
                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <p className="font-bold text-gray-900">
                                                Rs. {rec.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/mo</span>
                                            </p>
                                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                View
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ListingDetail;
