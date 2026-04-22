import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import apiService from '../services/api';
import { Search, Loader2, ShieldCheck, Phone, MapPin } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    type: string;
}

const PROPERTY_TYPES = ['All Types', 'Room', 'Hostel', 'Apartment', 'Flat'];
const POPULAR_CITIES = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur'];

const WHY_BLOCKS = [
    {
        icon: ShieldCheck,
        title: 'Verified Listings',
        desc: 'Every property is reviewed by an admin before going live. No unvetted entries.',
    },
    {
        icon: Phone,
        title: 'Direct Owner Contact',
        desc: 'Send booking requests directly to owners  no middlemen, no hidden fees.',
    },
    {
        icon: MapPin,
        title: 'Location-Based Search',
        desc: 'Filter by city or neighbourhood to find rentals near your workplace or college.',
    },
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyType, setPropertyType] = useState('All Types');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (propertyType !== 'All Types') params.set('type', propertyType);
        navigate(`/explore?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleCityClick = (city: string) => {
        setSearchTerm(city);
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await apiService.getAllListings();
                setListings(response.data || []);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const featuredListings = listings.slice(0, 6);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="border-b border-gray-100" />
            <div
                style={{
                    background: 'linear-gradient(135deg, #6b1a1a 0%, #8b2e2e 30%, #b85c5c 60%, #f0d9c8 100%)',
                }}
                className="w-full"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <h1 className="text-2xl font-bold text-white leading-snug mb-1">
                        Find Rooms &amp; Hostels Across Nepal
                    </h1>
                    <p className="text-sm text-white/75 mb-6">
                        Affordable rental listings for students and working professionals.
                    </p>
                    <div className="flex items-center gap-0 border border-white/30 rounded-md overflow-hidden max-w-xl bg-white shadow-md">
                        <input
                            type="text"
                            placeholder="Enter location, e.g. Pokhara"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
                        />
                        <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="text-sm text-gray-600 bg-gray-50 border-l border-gray-200 px-2 py-2.5 outline-none"
                        >
                            {PROPERTY_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleSearch}
                            className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-none"
                        >
                            <Search className="w-4 h-4" />
                            <span>Search</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-xs text-white/60">Popular:</span>
                        {POPULAR_CITIES.map((city) => (
                            <button
                                key={city}
                                onClick={() => handleCityClick(city)}
                                className="text-xs px-2.5 py-1 border border-white/30 rounded-md text-white/80 hover:bg-white/20 transition-colors"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="page-container flex-1">
                <div className="section">
                    <div className="mb-3">
                        <h2 className="text-base font-semibold text-gray-900 border-l-2 border-primary pl-2">
                            Why GharSathi
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5 pl-2">
                            What sets this platform apart for renters in Nepal
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {WHY_BLOCKS.map((block) => {
                            const Icon = block.icon;
                            return (
                                <div
                                    key={block.title}
                                    className="border border-gray-200 rounded-md p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="w-4 h-4 text-primary shrink-0" />
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            {block.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {block.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="section">
                    <div className="mb-3">
                        <h2 className="text-base font-semibold text-gray-900 border-l-2 border-primary pl-2">
                            Featured Listings
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5 pl-2">
                            Recently approved properties available for rent
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : featuredListings.length === 0 ? (
                        <div className="border border-gray-200 rounded-md py-10 text-center text-sm text-gray-400">
                            No listings available yet. Check back soon.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {featuredListings.map((listing) => (
                                <PropertyCard key={listing._id} listing={listing} />
                            ))}
                        </div>
                    )}

                    {!loading && listings.length > 6 && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate('/explore')}
                                className="btn-outline"
                            >
                                View all {listings.length} listings
                            </button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default Home;
