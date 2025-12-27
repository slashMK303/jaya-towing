"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
const PickupIcon = L.icon({
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

const TruckIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png", // Alternative truck icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface MapViewProps {
    pickupLat?: number;
    pickupLng?: number;
    dropLat?: number;
    dropLng?: number;
    driverLat?: number;
    driverLng?: number;
    status?: string;
}

function ZoomToMarkers({ points }: { points: L.LatLngExpression[] }) {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points as L.LatLng[]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);
    return null;
}

export default function BookingMapView({
    pickupLat, pickupLng, dropLat, dropLng, driverLat, driverLng, status
}: MapViewProps) {
    const points: L.LatLngExpression[] = [];
    if (pickupLat && pickupLng) points.push([pickupLat, pickupLng]);
    if (dropLat && dropLng) points.push([dropLat, dropLng]);
    if (driverLat && driverLng) points.push([driverLat, driverLng]);

    const defaultCenter: L.LatLngExpression = [-6.200000, 106.816666];

    const [pickupRoute, setPickupRoute] = useState<L.LatLngExpression[]>([]);
    const [towingRoute, setTowingRoute] = useState<L.LatLngExpression[]>([]);
    const [activeRouteInfo, setActiveRouteInfo] = useState<{ dist: string, time: string, type: 'PICKUP' | 'DROPOFF' } | null>(null);

    // Helper: Fetch OSRM Route
    const fetchRoute = async (
        start: [number, number],
        end: [number, number],
        setRoute: (coords: L.LatLngExpression[]) => void,
        mode: 'STATIC_ONLY' | 'ACTIVE_PICKUP' | 'ACTIVE_DROPOFF'
    ) => {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            if (data.routes && data.routes[0]) {
                const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngExpression);
                setRoute(coordinates);

                const distanceMeters = data.routes[0].distance;
                const distanceKm = (distanceMeters / 1000).toFixed(1);
                const durationMins = Math.round(data.routes[0].duration / 60);

                if (mode === 'ACTIVE_PICKUP') {
                    // Check if "ARRIVED" at pickup (< 200m)
                    if (distanceMeters < 200) {
                        return 'ARRIVED';
                    }
                    setActiveRouteInfo({ dist: `${distanceKm} km`, time: `${durationMins} mnt`, type: 'PICKUP' });
                } else if (mode === 'ACTIVE_DROPOFF') {
                    setActiveRouteInfo({ dist: `${distanceKm} km`, time: `${durationMins} mnt`, type: 'DROPOFF' });
                }
                // 'STATIC_ONLY' does nothing to active info
            }
        } catch (error) {
            console.error("OSRM Fetch Error:", error);
            setRoute([start as L.LatLngExpression, end as L.LatLngExpression]);
        }
        return null;
    };

    useEffect(() => {
        const updateRoutes = async () => {
            // 1. Static Towing Route (Pickup -> Dropoff) - Visual Only
            // We use 'STATIC_ONLY' so it DOES NOT touch the active estimation info
            if (pickupLat && pickupLng && dropLat && dropLng) {
                fetchRoute([pickupLat, pickupLng], [dropLat, dropLng], setTowingRoute, 'STATIC_ONLY');
            }

            // 2. Active Driver Calculation based on STATUS only
            if (driverLat && driverLng && pickupLat && pickupLng && dropLat && dropLng) {
                if (status === "CONFIRMED") {
                    // Status CONFIRMED = Driver OTW to Pickup
                    fetchRoute([driverLat, driverLng], [pickupLat, pickupLng], setPickupRoute, 'ACTIVE_PICKUP');
                }
                else if (status === "IN_PROGRESS") {
                    // Status IN_PROGRESS = Unit Loaded, OTW to Dropoff
                    // Use Driver -> Dropoff route
                    fetchRoute([driverLat, driverLng], [dropLat, dropLng], setPickupRoute, 'ACTIVE_DROPOFF');
                } else {
                    // COMPLETED, PENDING, etc.
                    setPickupRoute([]);
                    setActiveRouteInfo(null);
                }
            } else {
                setPickupRoute([]);
                setActiveRouteInfo(null);
            }
        };

        updateRoutes();
    }, [pickupLat, pickupLng, dropLat, dropLng, driverLat, driverLng, status]);


    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700 relative">
            <MapContainer
                center={points[0] || defaultCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {pickupLat && pickupLng && (
                    <Marker position={[pickupLat, pickupLng]} icon={PickupIcon}>
                        <Popup>Titik Penjemputan</Popup>
                    </Marker>
                )}

                {dropLat && dropLng && (
                    <Marker position={[dropLat, dropLng]} icon={DropoffIcon}>
                        <Popup>Titik Tujuan</Popup>
                    </Marker>
                )}

                {driverLat && driverLng && (status === "IN_PROGRESS" || status === "CONFIRMED") && (
                    <Marker position={[driverLat, driverLng]} icon={TruckIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold mb-1">Mobil Derek</p>
                                {activeRouteInfo && (
                                    <p className="text-xs text-gray-600">
                                        {activeRouteInfo.type === 'PICKUP' ? 'Menuju Jemput' : 'Menuju Tujuan'} • {activeRouteInfo.time}
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Active Route (Orange): Driver -> Pickup OR Driver -> Dropoff */}
                {pickupRoute.length > 0 && (
                    <Polyline
                        positions={pickupRoute}
                        color="#f97316" // Orange
                        dashArray="10, 10" // Garis putus-putus
                        weight={5}
                        opacity={0.8}
                    >
                        <Popup>
                            <div className="text-xs font-semibold">
                                {activeRouteInfo?.type === 'PICKUP' ? 'Estimasi Jemput' : 'Estimasi Sampai'}: {activeRouteInfo?.time}
                            </div>
                        </Popup>
                    </Polyline>
                )}

                {/* Static Towing Route: Pickup -> Dropoff */}
                {/* Show when in PICKUP phase (Cyan) OR when COMPLETED (Green) */}
                {towingRoute.length > 0 && ((activeRouteInfo?.type === 'PICKUP') || (status === 'COMPLETED')) && (
                    <Polyline
                        positions={towingRoute}
                        color={status === 'COMPLETED' ? "#22c55e" : "#06b6d4"} // Green if Completed, else Cyan
                        weight={5}
                        opacity={status === 'COMPLETED' ? 0.8 : 0.4}
                    >
                        <Popup>{status === 'COMPLETED' ? 'Rute Perjalanan Selesai' : 'Rute Pengantaran'}</Popup>
                    </Polyline>
                )}

                <ZoomToMarkers points={points} />

                {/* Legend Overlay - Only show when active tracking */}
                {(status === 'IN_PROGRESS' || status === 'CONFIRMED') && (
                    <div className="leaflet-bottom leaflet-left m-4">
                        <div className="leaflet-control leaflet-bar bg-white/95 dark:bg-zinc-900/95 backdrop-blur p-4 rounded-xl shadow-xl shadow-zinc-900/20 border border-zinc-200 dark:border-zinc-700 text-xs space-y-3">
                            {activeRouteInfo && (
                                <div className="mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <p className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-1">
                                        {activeRouteInfo.type === 'PICKUP' ? 'Estimasi Jemput:' : 'Estimasi Sampai:'}
                                    </p>
                                    <p className="text-xl font-black text-orange-600 dark:text-orange-500 font-mono tracking-tight">
                                        {activeRouteInfo.time} <span className="text-xs text-zinc-500 font-bold">({activeRouteInfo.dist})</span>
                                    </p>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-1 bg-orange-500 border-b-2 border-orange-500 border-dashed block"></span>
                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                                    {activeRouteInfo?.type === 'DROPOFF' ? 'Menuju Tujuan' : 'Menuju Jemput'}
                                </span>
                            </div>
                            {activeRouteInfo?.type === 'PICKUP' && (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-1 bg-cyan-500 block"></span>
                                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">Rute Pengantaran</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </MapContainer>
        </div>
    );
}
