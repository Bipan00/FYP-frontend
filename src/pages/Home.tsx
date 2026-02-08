import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import apiService from '../services/api';
import { Loader2, Search, Home as HomeIcon, Building, BedDouble } from 'lucide-react';

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

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await apiService.getAllListings();
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const filteredListings = listings.filter(listing => {
        const matchesType = selectedType === 'All' || listing.type === selectedType;
        const matchesSearch = listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const categories = [
        { name: 'All', icon: <HomeIcon className="w-5 h-5" /> },
        { name: 'Room', icon: <BedDouble className="w-5 h-5" /> },
        { name: 'Hostel', icon: <Building className="w-5 h-5" /> },
        { name: 'Apartment', icon: <Building className="w-5 h-5" /> },
        { name: 'Flat', icon: <HomeIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 w-full max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
                        Find your perfect stay in Nepal
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Discover rooms, hostels, and flats tailored for students and travelers.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex-1 px-6 border-r border-gray-200">
                            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full text-gray-700 outline-none placeholder:text-gray-400 bg-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-primary hover:bg-red-600 text-white p-4 rounded-full transition-colors flex items-center justify-center gap-2 font-semibold"
                        >
                            <Search className="h-5 w-5" />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories Filter */}
                <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-8 border-b border-gray-200 min-w-max px-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedType(cat.name)}
                                className={`flex flex-col items-center gap-2 pb-4 px-2 transition-all relative group ${selectedType === cat.name
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                <div className={`p-2 rounded-full transition-colors ${selectedType === cat.name ? 'bg-gray-100' : 'group-hover:bg-gray-50'}`}>
                                    {cat.icon}
                                </div>
                                <span className={`text-sm font-medium ${selectedType === cat.name ? 'font-bold' : ''}`}>
                                    {cat.name}
                                </span>
                                {selectedType === cat.name && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listings Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {filteredListings.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
