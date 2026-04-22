import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface PropertyCardProps {
    listing: {
        _id: string;
        title: string;
        location: string;
        price: number;
        images: string[];
        type: string;
    };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ listing }) => {
    const imageUrl =
        listing.images && listing.images.length > 0
            ? listing.images[0]
            : 'https://placehold.co/400x250?text=No+Image';

    return (
        <Link
            to={`/listings/${listing._id}`}
            className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col h-full"
        >
            <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://placehold.co/400x250?text=No+Image';
                    }}
                />
                <span className="absolute top-2 left-2 bg-white text-gray-700 text-xs font-medium px-2 py-0.5 rounded border border-gray-200">
                    {listing.type}
                </span>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
                    {listing.title}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="text-sm line-clamp-1">{listing.location}</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-lg font-bold text-primary">
                        Rs. {listing.price.toLocaleString()}
                        <span className="text-xs font-normal text-gray-500 block sm:inline sm:ml-1">/month</span>
                    </p>
                    <span className="text-xs font-medium bg-red-50 text-primary px-3 py-1.5 rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
