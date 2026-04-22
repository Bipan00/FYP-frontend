import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiService from '../services/api';
import { Loader2, School, Hospital, ShoppingCart, Bus, MapPin, AlertCircle } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createDotIcon = (color: string) =>
    L.divIcon({
        className: '',
        html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });

const icons = {
    property: L.divIcon({
        className: '',
        html: `<div style="background-color:#7C3AED;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
                   <div style="width:7px;height:7px;background:white;border-radius:50%;"></div>
               </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
    }),
    school:      createDotIcon('#3B82F6'),  
    hospital:    createDotIcon('#EF4444'),  
    supermarket: createDotIcon('#10B981'),  
    busStop:     createDotIcon('#F59E0B'),  
};

interface Place {
    id: number;
    name: string;
    lat: number;
    lng: number;
    distance: number;
}

interface NeighbourhoodData {
    schools: Place[];
    hospitals: Place[];
    supermarkets: Place[];
    busStops: Place[];
}

interface Props {
    listingId: string;
    latitude: number;
    longitude: number;
}

const NeighbourhoodInsights: React.FC<Props> = ({ listingId, latitude, longitude }) => {
    const [data, setData]       = useState<NeighbourhoodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        if (!listingId) return;

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // apiService returns the full JSON object: { success, data }
                const res: any = await apiService.getNeighbourhoodInsights(listingId);
                if (res && res.data) {
                    setData(res.data);
                } else {
                    setError('No neighbourhood data was returned from the server.');
                }
            } catch (err: any) {
                console.error('Neighbourhood fetch error:', err);
                setError(err?.message || 'Failed to load neighbourhood insights. The map data service may be temporarily slow  please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [listingId]);

    //  Loading State 
    if (loading) {
        return (
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Neighbourhood Insights</h2>
                <div className="flex flex-col items-center justify-center gap-3 py-14 border border-gray-100 rounded-xl bg-gray-50">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-gray-500">Fetching nearby amenities from OpenStreetMap…</p>
                    <p className="text-xs text-gray-400">This may take a few seconds on first load.</p>
                </div>
            </div>
        );
    }

    //  Error State 
    if (error) {
        return (
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Neighbourhood Insights</h2>
                <div className="flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-sm">Could not load neighbourhood data</p>
                        <p className="text-xs mt-1 text-amber-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    //  Empty State 
    const hasData = data &&
        (data.schools.length > 0 || data.hospitals.length > 0 ||
         data.supermarkets.length > 0 || data.busStops.length > 0);

    if (!hasData) {
        return (
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Neighbourhood Insights</h2>
                <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">No nearby schools, hospitals, supermarkets, or bus stops found within 1 km.</span>
                </div>
            </div>
        );
    }

    //  Legend dot helper 
    const Dot = ({ color }: { color: string }) => (
        <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
    );

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Neighbourhood Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/*  Map  */}
                {/*
                    IMPORTANT: The outer div must have a positive z-index context.
                    The map container itself uses z-index:0 to sit below modals/headers.
                    The "relative z-0" on the inner div scopes Leaflet's internal z-indices.
                */}
                <div style={{ position: 'relative', zIndex: 0, height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[latitude, longitude]} icon={icons.property}>
                            <Popup><b> This Property</b></Popup>
                        </Marker>

                        {data!.schools.map((p) => (
                            <Marker key={`school-${p.id}`} position={[p.lat, p.lng]} icon={icons.school}>
                                <Popup> <b>{p.name}</b><br /><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.distance}m away</span></Popup>
                            </Marker>
                        ))}
                        {data!.hospitals.map((p) => (
                            <Marker key={`hospital-${p.id}`} position={[p.lat, p.lng]} icon={icons.hospital}>
                                <Popup> <b>{p.name}</b><br /><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.distance}m away</span></Popup>
                            </Marker>
                        ))}
                        {data!.supermarkets.map((p) => (
                            <Marker key={`supermarket-${p.id}`} position={[p.lat, p.lng]} icon={icons.supermarket}>
                                <Popup> <b>{p.name}</b><br /><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.distance}m away</span></Popup>
                            </Marker>
                        ))}
                        {data!.busStops.map((p) => (
                            <Marker key={`bus-${p.id}`} position={[p.lat, p.lng]} icon={icons.busStop}>
                                <Popup> <b>{p.name}</b><br /><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.distance}m away</span></Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <div className="absolute bottom-3 left-3 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
                        <span className="flex items-center gap-1"><Dot color="#7C3AED" /> Property</span>
                        {data!.schools.length > 0      && <span className="flex items-center gap-1"><Dot color="#3B82F6" /> School</span>}
                        {data!.hospitals.length > 0    && <span className="flex items-center gap-1"><Dot color="#EF4444" /> Hospital</span>}
                        {data!.supermarkets.length > 0 && <span className="flex items-center gap-1"><Dot color="#10B981" /> Market</span>}
                        {data!.busStops.length > 0     && <span className="flex items-center gap-1"><Dot color="#F59E0B" /> Bus Stop</span>}
                    </div>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">

                    {data!.schools.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-blue-600 mb-3 border-b pb-2 text-sm">
                                <School className="w-4 h-4" /> Schools
                            </h3>
                            <ul className="space-y-2">
                                {data!.schools.map(place => (
                                    <li key={place.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium truncate pr-4">{place.name}</span>
                                        <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{place.distance}m</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data!.hospitals.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-red-500 mb-3 border-b pb-2 text-sm">
                                <Hospital className="w-4 h-4" /> Hospitals
                            </h3>
                            <ul className="space-y-2">
                                {data!.hospitals.map(place => (
                                    <li key={place.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium truncate pr-4">{place.name}</span>
                                        <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{place.distance}m</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data!.supermarkets.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-green-600 mb-3 border-b pb-2 text-sm">
                                <ShoppingCart className="w-4 h-4" /> Supermarkets
                            </h3>
                            <ul className="space-y-2">
                                {data!.supermarkets.map(place => (
                                    <li key={place.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium truncate pr-4">{place.name}</span>
                                        <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{place.distance}m</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data!.busStops.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-amber-600 mb-3 border-b pb-2 text-sm">
                                <Bus className="w-4 h-4" /> Bus Stops
                            </h3>
                            <ul className="space-y-2">
                                {data!.busStops.map(place => (
                                    <li key={place.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium truncate pr-4">{place.name}</span>
                                        <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{place.distance}m</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default NeighbourhoodInsights;
