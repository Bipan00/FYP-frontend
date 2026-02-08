
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import MapComponent from '../components/MapComponent';
import apiService from '../services/api';
import { Loader2, Search, Filter, X } from 'lucide-react';

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
}

const Explore: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    // Filter States
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Fetch listings when filters change
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const filters = {
                    search: searchTerm,
                    type: selectedType,
                    minPrice: minPrice,
                    maxPrice: maxPrice
                };

                // Update URL params
                const params: any = {};
                if (searchTerm) params.search = searchTerm;
                if (selectedType !== 'All') params.type = selectedType;
                if (minPrice) params.minPrice = minPrice;
                if (maxPrice) params.maxPrice = maxPrice;
                setSearchParams(params);

                const response = await apiService.getAllListings(filters);
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchListings();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedType, minPrice, maxPrice, setSearchParams]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('All');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header & Mobile Filter Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Explore Listings</h1>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'map'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Map
                            </button>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 h-full">
                    {/* Sidebar Filters */}
                    <div className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-semibold text-lg">Filters</h2>
                                {(searchTerm || selectedType !== 'All' || minPrice || maxPrice) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" /> Clear
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location / Keyword</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                <div className="space-y-2">
                                    {['All', 'Room', 'Hostel', 'Apartment', 'Flat'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type}
                                                checked={selectedType === type}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                className="text-primary focus:ring-primary h-4 w-4"
                                            />
                                            <span className="text-gray-600">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (NPR)</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Listings Grid or Map */}
                    <div className="flex-1 min-h-[500px]">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                                <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    We couldn't find any matches for your search. Try adjusting your filters or search area.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : viewMode === 'list' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <ListingCard key={listing._id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <MapComponent listings={listings} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
