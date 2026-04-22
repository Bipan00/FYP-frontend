import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import apiService from '../services/api';
import { Loader2, SlidersHorizontal, MapPin, X } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    type: string;
}

const PROPERTY_TYPES = ['All', 'Room', 'Hostel', 'Apartment', 'Flat'];

const Explore: React.FC = () => {
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        type: 'All',
        minPrice: '',
        maxPrice: '',
        bedrooms: 'Any',
    });

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Nearby mode state
    const [nearbyMode, setNearbyMode] = useState(false);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    const [nearbyError, setNearbyError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Fetch listings whenever applied filters change
    const fetchListings = async (appliedFilters: typeof filters) => {
        setLoading(true);
        setError('');
        try {
            const response = await apiService.getAllListings({
                search: appliedFilters.search || undefined,
                type: appliedFilters.type !== 'All' ? appliedFilters.type : undefined,
                bedrooms: appliedFilters.bedrooms !== 'Any' ? appliedFilters.bedrooms : undefined,
                minPrice: appliedFilters.minPrice || undefined,
                maxPrice: appliedFilters.maxPrice || undefined,
            });
            setListings(response.data || []);
        } catch (err) {
            setError('Failed to load listings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings(filters);
    }, []);

    const handleApplyFilters = () => {
        if (
            filters.minPrice &&
            filters.maxPrice &&
            Number(filters.minPrice) > Number(filters.maxPrice)
        ) {
            setError('Minimum price cannot be greater than maximum price');
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
            return;
        }
        setNearbyMode(false);
        setCurrentPage(1);
        fetchListings(filters);
    };

    const handleResetFilters = () => {
        const reset = { search: '', type: 'All', bedrooms: 'Any', minPrice: '', maxPrice: '' };
        setFilters(reset);
        setNearbyMode(false);
        setNearbyError('');
        setCurrentPage(1);
        fetchListings(reset);
    };

    const handleFindNearMe = () => {
        setNearbyError('');

        if (!navigator.geolocation) {
            setNearbyError('Geolocation is not supported by your browser.');
            return;
        }

        setNearbyLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await apiService.getNearbyListings(latitude, longitude, 5);
                    setListings(response.data || []);
                    setNearbyMode(true);
                    setCurrentPage(1);
                } catch (err: any) {
                    setNearbyError('Failed to fetch nearby listings. Please try again.');
                } finally {
                    setNearbyLoading(false);
                }
            },
            (err) => {
                setNearbyLoading(false);
                if (err.code === err.PERMISSION_DENIED) {
                    setNearbyError('Location access denied. Please allow location in your browser settings.');
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setNearbyError('Location unavailable. Try again or search manually.');
                } else {
                    setNearbyError('Could not get your location. Please try again.');
                }
            },
            { timeout: 10000 }
        );
    };

    const totalPages = Math.ceil(listings.length / itemsPerPage);
    const currentListings = listings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Explore Listings
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        {loading || nearbyLoading ? 'Loading...' : `${listings.length} properties found`}
                    </p>
                    
                    <div className="max-w-2xl bg-white border border-gray-200 rounded-lg p-2 flex shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                        <div className="flex-grow flex items-center px-3">
                            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search by location or keyword (e.g. Kathmandu)"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, search: e.target.value }))
                                }
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 py-2"
                            />
                        </div>
                        <button 
                            onClick={handleApplyFilters}
                            className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-md font-medium transition-colors"
                        >
                            Search
                        </button>
                    </div>
                    {nearbyMode && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full px-3 py-1">
                            <MapPin className="w-3 h-3" />
                            Within 5 km of your location
                            <button
                                onClick={handleResetFilters}
                                className="ml-1 hover:text-blue-900"
                                title="Clear and show all listings"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex gap-6 items-start">
                    <aside className="w-64 shrink-0 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                            <span className="text-base font-semibold text-gray-900">Filters</span>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, type: e.target.value }))
                                }
                                className="form-input"
                            >
                                {PROPERTY_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bedrooms
                            </label>
                            <select
                                value={filters.bedrooms}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, bedrooms: e.target.value }))
                                }
                                className="form-input"
                            >
                                <option value="Any">Any</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range (NPR/month)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) =>
                                        setFilters((f) => ({ ...f, minPrice: e.target.value }))
                                    }
                                    className="form-input w-1/2"
                                    min={0}
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) =>
                                        setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                                    }
                                    className="form-input w-1/2"
                                    min={0}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleApplyFilters}
                            className="btn-primary w-full mb-2"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors py-1"
                        >
                            Reset
                        </button>
                        <div className="border-t border-gray-100 my-3" />
                        <button
                            onClick={handleFindNearMe}
                            disabled={nearbyLoading}
                            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium border border-gray-300 rounded-md py-1.5 px-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {nearbyLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                            )}
                            {nearbyLoading ? 'Locating...' : ' Find Near Me'}
                        </button>
                        {nearbyError && (
                            <p className="text-xs text-red-500 mt-2 leading-snug">{nearbyError}</p>
                        )}
                    </aside>
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                                {error}
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="border border-gray-200 rounded-md py-12 text-center">
                                <p className="text-sm text-gray-500">
                                    No listings match your filters.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-3 text-sm text-primary hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="pb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentListings.map((listing) => (
                                        <PropertyCard key={listing._id} listing={listing} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-10 gap-3">
                                        <button
                                            onClick={() => {
                                                setCurrentPage((p) => Math.max(1, p - 1));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setCurrentPage((p) => Math.min(totalPages, p + 1));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
