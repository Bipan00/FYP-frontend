import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import icon from 'leaflet/dist/images/marker-icon.png';

import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Listing {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    type: string;
    latitude?: number;
    longitude?: number;
}

interface MapComponentProps {
    listings: Listing[];
    className?: string;
    center?: [number, number] | { lat: number; lng: number };
    zoom?: number;
}

const MapUpdater: React.FC<{ listings: Listing[] }> = ({ listings }) => {
    const map = useMap();

    useEffect(() => {
        if (listings.length > 0) {
            const validListings = listings.filter(l => l.latitude && l.longitude);
            if (validListings.length > 0) {
                const bounds = L.latLngBounds(validListings.map(l => [l.latitude!, l.longitude!]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [listings, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
    listings,
    className = "h-[calc(100vh-200px)] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative",
    center = [27.7172, 85.3240], 
    zoom = 13
}) => {
    
    const validListings = listings.filter(
        listing => listing.latitude && listing.longitude
    );

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validListings.map((listing) => (
                    <Marker
                        key={listing._id}
                        position={[listing.latitude!, listing.longitude!]}
                    >
                        <Popup className="min-w-[250px]">
                            <div className="flex flex-col gap-2">
                                <div className="relative aspect-video rounded-md overflow-hidden">
                                    <img
                                        src={listing.images[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                                        {listing.type}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm line-clamp-1">{listing.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-1">{listing.location}</p>
                                    <div className="font-bold text-primary mt-1">
                                        Rs. {listing.price.toLocaleString()}
                                        <span className="text-xs text-gray-400 font-normal">/mo</span>
                                    </div>
                                    <Link
                                        to={`/listings/${listing._id}`}
                                        className="mt-2 block w-full text-center py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapUpdater listings={validListings} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
