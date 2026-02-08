import React from 'react';
import { MapPin, Heart, BedDouble, Bath, Square, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListingProps {
    listing: {
        _id: string;
        title: string;
        location: string;
        price: number;
        type: string;
        images: string[];
        description: string;
    };
}

const ListingCard: React.FC<ListingProps> = ({ listing }) => {
    // Format price to NPR currency
    const formattedPrice = new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        maximumFractionDigits: 0,
    }).format(listing.price);

    // Use placeholder if no images
    const coverImage = listing.images && listing.images.length > 0
        ? listing.images[0]
        : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; // Fallback image

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={coverImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                        <Heart className="h-5 w-5" />
                    </button>
                </div>
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary shadow-sm">
                        {listing.type}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 group-hover:text-primary transition-colors">
                        {listing.title}
                    </h3>
                    <div className="text-primary font-bold whitespace-nowrap">
                        {formattedPrice}
                        <span className="text-xs text-gray-500 font-normal">/mo</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{listing.location}</span>
                </div>

                {/* Features (Mock data for now as schema might not have all these yet) */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 py-3 border-y border-gray-100">
                    <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        <span>2 Bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>1 Bath</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>1200 sqft</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Link
                        to={`/listings/${listing._id}`}
                        className="w-full py-2.5 rounded-lg border border-primary/20 text-primary font-medium hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
