"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, Save, Activity } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-zinc-700 ring-1 ring-white/10">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-orange-500" />
                        <h3 className="font-black text-xl text-white uppercase tracking-tight">Update Posisi Driver</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
                    >
                        <span className="sr-only">Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 relative min-h-[400px]">
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: "100%", width: "100%", position: "absolute", background: "#18181b" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapEvents onLocationSelect={(lat, lng) => setPosition(L.latLng(lat, lng))} />

                        {/* Pickup Marker Reference */}
                        {pickupLat && pickupLng && (
                            <Marker position={[pickupLat, pickupLng]} icon={LocationIcon} opacity={0.5}>
                                <Popup className="font-sans text-sm font-semibold">Lokasi Jemput (Referensi)</Popup>
                            </Marker>
                        )}

                        {/* Dropoff Marker Reference */}
                        {dropLat && dropLng && (
                            <Marker position={[dropLat, dropLng]} icon={DropoffIcon} opacity={0.5}>
                                <Popup className="font-sans text-sm font-semibold">Lokasi Tujuan (Referensi)</Popup>
                            </Marker>
                        )}

                        {/* Driver Marker */}
                        {position && (
                            <Marker position={position} icon={DriverIcon}>
                                <Popup className="font-sans text-sm font-semibold">Posisi Driver Baru</Popup>
                            </Marker>
                        )}

                        {/* Route: Driver -> Pickup */}
                        {routePath.length > 0 && (
                            <Polyline
                                positions={routePath}
                                color="#f97316"
                                dashArray="10, 10"
                                weight={4}
                                opacity={0.8}
                            />
                        )}

                        {/* Route: Pickup -> Dropoff */}
                        {towingRoute.length > 0 && (
                            <Polyline
                                positions={towingRoute}
                                color="#22c55e"
                                weight={4}
                                opacity={0.6}
                            />
                        )}
                    </MapContainer>

                    {/* Floating Info Panel */}
                    <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl z-[1000] flex flex-col md:flex-row justify-between items-center border border-zinc-700/50 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                                <Activity className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Koordinat Baru</p>
                                <p className="font-mono text-sm font-bold text-white tracking-wide">
                                    {position ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}` : "Klik di peta untuk set posisi"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!position || loading}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            SIMPAN LOKASI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
