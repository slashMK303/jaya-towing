"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, Save } from "lucide-react";
import { updateDriverLocation } from "@/app/actions/bookings";

// Fix for default marker icons
const DriverIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const LocationIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const DropoffIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface DriverLocationModalProps {
    bookingId: string;
    currentLat?: number;
    currentLng?: number;
    pickupLat?: number;
    pickupLng?: number;
    dropLat?: number;
    dropLng?: number;
    onClose: () => void;
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function DriverLocationModal({
    bookingId,
    currentLat,
    currentLng,
    pickupLat,
    pickupLng,
    dropLat,
    dropLng,
    onClose
}: DriverLocationModalProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        currentLat && currentLng ? L.latLng(currentLat, currentLng) : null
    );
    const [loading, setLoading] = useState(false);

    // Default center: Current driver pos -> Pickup pos -> Default Jakarta
    const center: L.LatLngExpression =
        currentLat && currentLng ? [currentLat, currentLng] :
            pickupLat && pickupLng ? [pickupLat, pickupLng] :
                [-6.200000, 106.816666];

    const handleSave = async () => {
        if (!position) return;
        setLoading(true);
        try {
            await updateDriverLocation(bookingId, position.lat, position.lng);
            alert("Lokasi driver berhasil diupdate!");
            onClose();
        } catch (error) {
            alert("Gagal menyimpan lokasi.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // OSRM Logic for Admin Modal
    const [routePath, setRoutePath] = useState<L.LatLngExpression[]>([]);
    const [towingRoute, setTowingRoute] = useState<L.LatLngExpression[]>([]);

    useEffect(() => {
        // Driver -> Pickup
        const fetchDriverRoute = async () => {
            if (position && pickupLat && pickupLng) {
                try {
                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${position.lng},${position.lat};${pickupLng},${pickupLat}?overview=full&geometries=geojson`
                    );
                    const data = await response.json();
                    if (data.routes && data.routes[0]) {
                        const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngExpression);
                        setRoutePath(coordinates);
                    }
                } catch {
                    setRoutePath([[position.lat, position.lng], [pickupLat, pickupLng]]);
                }
            }
        };

        // Pickup -> Dropoff
        const fetchTowingRoute = async () => {
            if (pickupLat && pickupLng && dropLat && dropLng) {
                try {
                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropLng},${dropLat}?overview=full&geometries=geojson`
                    );
                    const data = await response.json();
                    if (data.routes && data.routes[0]) {
                        const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngExpression);
                        setTowingRoute(coordinates);
                    }
                } catch {
                    setTowingRoute([[pickupLat, pickupLng], [dropLat, dropLng]]);
                }
            }
        };

        const timeout = setTimeout(() => {
            fetchDriverRoute();
            fetchTowingRoute();
        }, 500);
        return () => clearTimeout(timeout);
    }, [position, pickupLat, pickupLng, dropLat, dropLng]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Update Posisi Driver</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Tutup
                    </button>
                </div>

                <div className="flex-1 relative min-h-[400px]">
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: "100%", width: "100%", position: "absolute" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapEvents onLocationSelect={(lat, lng) => setPosition(L.latLng(lat, lng))} />

                        {/* Pickup Marker Reference */}
                        {pickupLat && pickupLng && (
                            <Marker position={[pickupLat, pickupLng]} icon={LocationIcon} opacity={0.5}>
                                <Popup>Lokasi Jemput (Referensi)</Popup>
                            </Marker>
                        )}

                        {/* Dropoff Marker Reference */}
                        {dropLat && dropLng && (
                            <Marker position={[dropLat, dropLng]} icon={DropoffIcon} opacity={0.5}>
                                <Popup>Lokasi Tujuan (Referensi)</Popup>
                            </Marker>
                        )}

                        {/* Driver Marker */}
                        {position && (
                            <Marker position={position} icon={DriverIcon}>
                                <Popup>Posisi Driver Baru</Popup>
                            </Marker>
                        )}

                        {/* Route: Driver -> Pickup */}
                        {routePath.length > 0 && (
                            <Polyline
                                positions={routePath}
                                color="#f97316"
                                dashArray="10, 10"
                                weight={4}
                                opacity={0.6}
                            />
                        )}

                        {/* Route: Pickup -> Dropoff */}
                        {towingRoute.length > 0 && (
                            <Polyline
                                positions={towingRoute}
                                color="#06b6d4"
                                weight={4}
                                opacity={0.6}
                            />
                        )}
                    </MapContainer>

                    {/* Floating Info Panel */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-xl shadow-lg z-[1000] flex justify-between items-center border border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">Koordinat Baru</p>
                            <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">
                                {position ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}` : "Klik di peta untuk set posisi"}
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!position || loading}
                            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Simpan Lokasi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
