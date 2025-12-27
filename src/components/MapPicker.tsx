"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import debounce from "lodash.debounce";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    initialLat?: number;
    initialLng?: number;
}

function LocationMarker({
    position,
    setPosition,
    onLocationSelect
}: {
    position: L.LatLng | null;
    setPosition: (pos: L.LatLng) => void;
    onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
    const map = useMap();

    const fetchAddress = useCallback(
        debounce(async (lat: number, lng: number) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                onLocationSelect(lat, lng, data.display_name || `${lat}, ${lng}`);
            } catch (error) {
                console.error("Error fetching address:", error);
                onLocationSelect(lat, lng, `${lat}, ${lng}`);
            }
        }, 500),
        [onLocationSelect]
    );

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            fetchAddress(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        initialLat && initialLng ? L.latLng(initialLat, initialLng) : null
    );

    const defaultCenter: L.LatLngExpression = [-6.200000, 106.816666]; // Jakarta

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <MapContainer
                center={position || defaultCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationSelect={onLocationSelect}
                />
            </MapContainer>
        </div>
    );
}
