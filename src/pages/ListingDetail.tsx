import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Navbar from '../components/Navbar';
import MapComponent from '../components/MapComponent';
import { MapPin, BedDouble, Bath, Square, Loader2, Share2, Heart, CheckCircle2, MessageSquare, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Listing {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    type: string;
    description: string;
    latitude?: number;
    longitude?: number;
    ownerId?: {
        _id: string;
        name: string;
        email: string;
    };
    amenities?: string[]; // Assuming backend might support this later, or we mock
}

const ListingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchListing = async () => {
            try {
                if (!id) return;
                const response = await apiService.getListingById(id);
                setListing(response.data);
            } catch (err: any) {
                console.error('Error loading listing:', err);
                setError('Failed to load listing. It may have been removed.');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/listings/${id}` } });
            return;
        }

        try {
            setBookingLoading(true);
            await apiService.createBooking(id!, message);
            setShowModal(false);
            alert('Request sent successfully! The owner will contact you shortly.');
            setMessage('');
        } catch (err: any) {
            alert(err.message || 'Failed to send request');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center py-40"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    if (error || !listing) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col justify-center items-center">
                <p className="text-xl text-gray-600 mb-4">{error || 'Listing not found'}</p>
                <button
                    onClick={() => navigate('/explore')}
                    className="px-6 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
                >
                    Browse Listings
                </button>
            </div>
        </div>
    );

    const isOwner = user?.id === listing.ownerId?._id || user?._id === listing.ownerId?._id;
    const formattedPrice = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(listing.price);

    // Mock amenities if not present
    const amenities = listing.amenities || ['Wifi', 'Water Supply', 'Electricity', 'Parking'];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Title Section */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium underline">{listing.location}</span>
                            <span>•</span>
                            <span>{listing.type}</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium underline">
                                <Share2 className="h-4 w-4" /> Share
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium underline">
                                <Heart className="h-4 w-4" /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Images Grid (Airbnb Style) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[300px] md:h-[400px] mb-8 relative">
                    {/* Main Large Image */}
                    <div className="md:col-span-2 h-full">
                        <img
                            src={listing.images[0] || 'https://via.placeholder.com/800'}
                            className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
                            alt="Main"
                        />
                    </div>
                    {/* Secondary Images Grid */}
                    <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-full relative overflow-hidden">
                                {listing.images[i] ? (
                                    <img
                                        src={listing.images[i]}
                                        className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
                                        alt={`Gallery ${i}`}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="absolute bottom-4 right-4 bg-white px-4 py-1.5 rounded-lg border border-black shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
                        Show all photos
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2">
                        {/* Host Info */}
                        <div className="flex justify-between items-center py-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Hosted by {listing.ownerId?.name || 'Owner'}</h2>
                                <p className="text-gray-500 text-sm">{listing.type} • {listing.location}</p>
                            </div>
                            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl uppercase">
                                {listing.ownerId?.name?.charAt(0) || 'H'}
                            </div>
                        </div>

                        {/* Features Highlights */}
                        <div className="py-8 border-b border-gray-200 space-y-4">
                            <div className="flex gap-4">
                                <ShieldCheck className="h-6 w-6 text-gray-600" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Verified Listing</h3>
                                    <p className="text-sm text-gray-500">This property has been verified by our team.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle2 className="h-6 w-6 text-gray-600" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Great Location</h3>
                                    <p className="text-sm text-gray-500">90% of recent guests gave the location a 5-star rating.</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="py-8 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About this place</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="py-8 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">What this place offers</h2>
                            <div className="grid grid-cols-2 gap-y-4">
                                {amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-3 text-gray-600">
                                        <CheckCircle2 className="h-5 w-5 text-gray-400" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="py-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Where you'll be</h2>
                            <div className="h-[400px] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                                {(listing.latitude && listing.longitude) ? (
                                    <MapComponent
                                        listings={[listing]}
                                        className="h-full w-full"
                                        center={{ lat: listing.latitude, lng: listing.longitude }}
                                        zoom={15}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>Map location not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">{listing.location}</p>
                            <p className="text-gray-500 text-sm max-w-2xl">Usually, we show the exact location after booking to protect privacy.</p>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white rounded-xl border border-gray-200 p-6 shadow-xl ring-1 ring-black/5">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">
                                        {formattedPrice}
                                    </span>
                                    <span className="text-gray-500"> / month</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {!isOwner ? (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="w-full py-3.5 bg-gradient-to-r from-primary to-red-600 text-white rounded-xl font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 text-lg shadow-md"
                                    >
                                        Request Booking
                                    </button>
                                ) : (
                                    <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-medium text-center">
                                        This is your listing
                                    </div>
                                )}

                                <p className="text-xs text-center text-gray-500 mt-2">
                                    You won't be charged yet. The owner will review your request.
                                </p>
                            </div>

                            <div className="mt-6 space-y-3 text-gray-600 text-sm border-t border-gray-100 pt-4">
                                <div className="flex justify-between">
                                    <span className="underline">Monthly rent</span>
                                    <span>{formattedPrice}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-3 mt-3">
                                    <span>Total per month</span>
                                    <span>{formattedPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Contact Owner</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <ArrowLeft className="h-5 w-5 rotate-180" /> {/* Using arrow as close for now or fetch X icon */}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{listing.title}</h4>
                                <p className="text-sm text-gray-500">{listing.type} in {listing.location}</p>
                            </div>
                            <div className="h-12 w-16 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={listing.images[0]} className="w-full h-full object-cover" alt="Thumb" />
                            </div>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Message to Owner</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Hi, I'm interested in this property! Is it available?"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] mb-6 text-sm resize-none"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 transition-colors"
                            >
                                {bookingLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingDetail;
