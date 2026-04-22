import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiService from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Map as LeafletMap } from 'leaflet';

import { Loader2, MapPin, Navigation, Layers, Pin } from 'lucide-react';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';

import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ActiveIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [30, 47],
    iconAnchor: [15, 47],
    popupAnchor: [1, -38],
    className: 'active-marker',
});

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

const PROPERTY_TYPES = ['All', 'Room', 'Hostel', 'Apartment', 'Flat'];
const NEPAL_CENTER: [number, number] = [27.7172, 85.3240]; 

const MapController: React.FC<{
    target: [number, number] | null;
    mapRef: React.MutableRefObject<LeafletMap | null>;
}> = ({ target, mapRef }) => {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);

    useEffect(() => {
        if (target) {
            map.flyTo(target, 15, { duration: 0.6 });
        }
    }, [target, map]);

    return null;
};

const FlyToUser: React.FC<{ pos: [number, number] | null }> = ({ pos }) => {
    const map = useMap();
    useEffect(() => {
        if (pos) {
            map.flyTo(pos, 14, { duration: 0.8 });
        }
    }, [pos, map]);
    return null;
};

const HeatmapLayer: React.FC<{
    points: [number, number, number][];
    active: boolean;
}> = ({ points, active }) => {
    const map = useMap();
    const heatRef = useRef<any>(null);

    useEffect(() => {
        if (!active) {
            if (heatRef.current) {
                map.removeLayer(heatRef.current);
                heatRef.current = null;
            }
            return;
        }

        if (points.length === 0) return;

let cancelled = false;
        (async () => {
            (window as any).L = L;      
            await import('leaflet.heat');
            if (cancelled) return;       

const layer = (L as any).heatLayer(points, {
                radius: 30,
                blur: 20,
                maxZoom: 17,
                max: 1.0,
                minOpacity: 0.3,
                gradient: {
                    0.2: '#60a5fa',  
                    0.4: '#34d399',  
                    0.6: '#fbbf24',  
                    0.8: '#f97316',  
                    1.0: '#ef4444',  
                }
            });
            layer.addTo(map);
            heatRef.current = layer;
        })();

        return () => {
            cancelled = true;
            if (heatRef.current) {
                map.removeLayer(heatRef.current);
                heatRef.current = null;
            }
        };
    }, [points, active, map]);

    return null;
};

const MapPage: React.FC = () => {
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter state
    const [typeFilter, setTypeFilter] = useState('All');
    const [maxPrice, setMaxPrice] = useState('');

    // View mode: 'markers' (default) or 'heatmap'
    const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');

const [selectedId, setSelectedId] = useState<string | null>(null);

const mapRef = useRef<LeafletMap | null>(null);
    const markerRefs = useRef<Record<string, L.Marker>>({});
    const listItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [locatingMap, setLocatingMap] = useState(false);
    const [locMapError, setLocMapError] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await apiService.getAllListings();
                setAllListings(res.data || []);
            } catch {
                setError('Failed to load listings for map.');
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    // Apply filters client-side (fetched all once for map perf)
    const filteredListings = allListings.filter((l) => {
        const typeOk = typeFilter === 'All' || l.type === typeFilter;
        const priceOk = !maxPrice || l.price <= Number(maxPrice);
        return typeOk && priceOk;
    });

const mappableListings = filteredListings.filter(
        (l) => l.latitude && l.longitude
    );

const handleListClick = (listing: Listing) => {
        setSelectedId(listing._id);
        if (listing.latitude && listing.longitude) {
            setFlyTarget([listing.latitude, listing.longitude]);
            
            setTimeout(() => {
                markerRefs.current[listing._id]?.openPopup();
            }, 700);
        }
    };

const handleMarkerClick = (id: string) => {
        setSelectedId(id);
        const el = listItemRefs.current[id];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

const handleLocateMe = () => {
        setLocMapError('');

        if (!navigator.geolocation) {
            setLocMapError('Geolocation is not supported by your browser.');
            return;
        }

        setLocatingMap(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserPos([lat, lng]);
                    // Fetch nearby listings and replace the list
                    const res = await apiService.getNearbyListings(lat, lng, 5);
                    setAllListings(res.data || []);
                } catch {
                    setLocMapError('Failed to load nearby listings.');
                } finally {
                    setLocatingMap(false);
                }
            },
            (err) => {
                setLocatingMap(false);
                if (err.code === err.PERMISSION_DENIED) {
                    setLocMapError('Location access was denied.');
                } else {
                    setLocMapError('Could not get your location. Please try again.');
                }
            },
            { timeout: 10000 }
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="border-b border-gray-100" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 w-full flex-1 flex flex-col">
                <div className="mb-3">
                    <h1 className="text-lg font-semibold text-gray-900">Map View</h1>
                    <p className="text-xs text-gray-500">
                        {loading ? 'Loading...' : `${filteredListings.length} listings - ${mappableListings.length} on map`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3 border border-gray-200 rounded-md p-2.5 bg-white">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                            Property Type
                        </label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="form-input py-1 text-xs w-32"
                        >
                            {PROPERTY_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                            Max Rent (NPR)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 15000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="form-input py-1 text-xs w-28"
                            min={0}
                        />
                    </div>

                    {(typeFilter !== 'All' || maxPrice) && (
                        <button
                            onClick={() => { setTypeFilter('All'); setMaxPrice(''); }}
                            className="text-xs text-gray-400 hover:text-gray-700"
                        >
                            Clear filters
                        </button>
                    )}

                    <div className="ml-auto flex items-center rounded-md border border-gray-200 overflow-hidden text-xs">
                        <button
                            onClick={() => setViewMode('markers')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                                viewMode === 'markers'
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Show individual property markers"
                        >
                            <Pin className="w-3 h-3" />
                            Listings
                        </button>
                        <button
                            onClick={() => setViewMode('heatmap')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors border-l border-gray-200 ${
                                viewMode === 'heatmap'
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Show rental density heatmap"
                        >
                            <Layers className="w-3 h-3" />
                            Heatmap
                        </button>
                    </div>
                    <button
                        onClick={handleLocateMe}
                        disabled={locatingMap}
                        className="flex items-center gap-1.5 text-xs font-medium border border-gray-300 rounded-md py-1 px-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {locatingMap ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Navigation className="w-3.5 h-3.5 text-primary" />
                        )}
                        {locatingMap ? 'Locating...' : 'Locate Me'}
                    </button>
                </div>
                {locMapError && (
                    <div className="mb-3 border border-red-200 bg-red-50 rounded-md px-3 py-2 text-xs text-red-600">
                        {locMapError}
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="border border-red-200 rounded-md p-4 text-sm text-red-600">
                        {error}
                    </div>
                ) : (
                    <div className="flex flex-col-reverse md:flex-row gap-4 h-[calc(100vh-180px)] min-h-[550px]">
                        <div className="w-full md:w-[35%] lg:w-[30%] overflow-y-auto border border-gray-200 rounded-xl flex-shrink-0 bg-white shadow-sm">
                            {filteredListings.length === 0 ? (
                                <div className="p-4 text-sm text-center text-gray-400">
                                    No listings match your filters.
                                </div>
                            ) : (
                                filteredListings.map((listing) => (
                                    <div
                                        key={listing._id}
                                        ref={(el) => { listItemRefs.current[listing._id] = el; }}
                                        onClick={() => handleListClick(listing)}
                                        className={`flex gap-3 p-3 cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 ${selectedId === listing._id
                                                ? 'border-l-2 border-l-primary bg-gray-50'
                                                : 'border-l-2 border-l-transparent'
                                            }`}
                                    >
                                        <div className="w-16 h-12 rounded border border-gray-100 overflow-hidden shrink-0 bg-gray-100">
                                            {listing.images.length > 0 ? (
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            'https://placehold.co/80x60?text=No+Img';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-800 truncate">
                                                {listing.title}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                {listing.location}
                                            </p>
                                            <p className="text-xs font-medium text-primary mt-1">
                                                Rs. {listing.price.toLocaleString()}/mo
                                            </p>
                                            {!listing.latitude && (
                                                <span className="text-[10px] text-gray-300">
                                                    No coordinates
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="w-full md:flex-1 h-[50vh] md:h-full border border-gray-200 rounded-xl overflow-hidden relative shadow-sm">
                            <MapContainer
                                center={NEPAL_CENTER}
                                zoom={12}
                                scrollWheelZoom={true}
                                className="h-full w-full outline-none"
                                style={{ height: '100%', width: '100%', zIndex: 0 }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapController target={flyTarget} mapRef={mapRef} />
                                <FlyToUser pos={userPos} />
                                <HeatmapLayer
                                    active={viewMode === 'heatmap'}
                                    points={mappableListings.map(l => [
                                        l.latitude!,
                                        l.longitude!,
                                        0.6
                                    ])}
                                />
                                {userPos && (
                                    <CircleMarker
                                        center={userPos}
                                        radius={10}
                                        pathOptions={{
                                            color: '#2563eb',
                                            fillColor: '#3b82f6',
                                            fillOpacity: 0.8,
                                            weight: 2
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-sm font-medium text-gray-800">
                                                You are here
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                )}
                                {viewMode === 'markers' && mappableListings.map((listing) => (
                                    <Marker
                                        key={listing._id}
                                        position={[listing.latitude!, listing.longitude!]}
                                        icon={selectedId === listing._id ? ActiveIcon : DefaultIcon}
                                        ref={(ref) => {
                                            if (ref) markerRefs.current[listing._id] = ref;
                                        }}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(listing._id),
                                        }}
                                    >
                                        <Popup minWidth={180}>
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-800 mb-0.5">
                                                    {listing.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {listing.location}
                                                </p>
                                                <p className="text-xs font-medium text-primary mb-2">
                                                    Rs. {listing.price.toLocaleString()}/mo
                                                </p>
                                                <Link
                                                    to={`/listings/${listing._id}`}
                                                    className="block text-center text-xs btn-primary py-1 px-3"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                            {viewMode === 'heatmap' && (
                                <div className="absolute bottom-3 left-3 bg-white/90 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-600 pointer-events-none shadow-sm">
                                    <p className="font-medium mb-1">Rental Density</p>
                                    <div className="flex items-center gap-1">
                                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#60a5fa' }} />
                                        <span>Low</span>
                                        <span className="inline-block w-3 h-3 rounded-full ml-2" style={{ background: '#fbbf24' }} />
                                        <span>Medium</span>
                                        <span className="inline-block w-3 h-3 rounded-full ml-2" style={{ background: '#ef4444' }} />
                                        <span>High</span>
                                    </div>
                                </div>
                            )}
                            {filteredListings.length > 0 && mappableListings.length === 0 && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none">
                                    <p className="text-sm text-gray-500 border border-gray-200 rounded-md px-4 py-2 bg-white">
                                        None of the filtered listings have map coordinates.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;