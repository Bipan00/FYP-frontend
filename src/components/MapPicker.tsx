import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface MapPickerProps {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number) => void;
}

const NEPAL_CENTER: [number, number] = [27.7172, 85.3240];

const LocationMarker: React.FC<{
    position: [number, number] | null;
    setPosition: (pos: [number, number]) => void;
}> = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker
            position={position}
            icon={DefaultIcon}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    setPosition([pos.lat, pos.lng]);
                },
            }}
        />
    );
};

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onChange }) => {
    const [position, setPosition] = useState<[number, number] | null>(
        lat && lng ? [lat, lng] : null
    );

    useEffect(() => {
        if (position) {
            onChange(position[0], position[1]);
        }
    }, [position, onChange]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            () => {
                alert('Could not get your location.');
            }
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Click on the map to mark the property location accurately.
                </p>
                <button
                    type="button"
                    onClick={handleLocateMe}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                >
                    <Navigation className="w-3 h-3" />
                    Detect My Location
                </button>
            </div>

            <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
                <MapContainer
                    center={position || NEPAL_CENTER}
                    zoom={position ? 15 : 12}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
                
                {!position && (
                    <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center pointer-events-none z-[400]">
                        <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="w-4 h-4 text-primary" />
                            Click to set location
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPicker;
