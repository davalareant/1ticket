import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Navigation } from 'lucide-react';

export default function RouteMiniMap({ originAirport, destAirport }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || !originAirport || !destAirport) return;

        const lat1 = parseFloat(originAirport.latitude);
        const lon1 = parseFloat(originAirport.longitude);
        const lat2 = parseFloat(destAirport.latitude);
        const lon2 = parseFloat(destAirport.longitude);

        if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return;

        // Cleanup previous map instance if exists
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize Leaflet map
        const map = L.map(mapContainerRef.current, {
            center: [(lat1 + lat2) / 2, (lon1 + lon2) / 2],
            zoom: 5,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: !L.Browser.mobile,
            doubleClickZoom: true,
        });

        // Add subtle zoom control in bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Professional dark/voyager map tile layer (CartoDB Voyager or OpenStreetMap)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            subdomains: 'abcd',
        }).addTo(map);

        // Generate curved flight arc points (Bezier interpolation)
        const pointsCount = 30;
        const curvedPoints = [];

        // Midpoint with curve offset
        const midLat = (lat1 + lat2) / 2;
        const midLon = (lon1 + lon2) / 2;
        const distance = Math.hypot(lat2 - lat1, lon2 - lon1);
        const arcOffset = Math.max(0.8, distance * 0.15); // Curve height
        const controlLat = midLat + arcOffset;
        const controlLon = midLon;

        for (let i = 0; i <= pointsCount; i++) {
            const t = i / pointsCount;
            // Quadratic Bezier formula
            const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
            const lon = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * controlLon + t * t * lon2;
            curvedPoints.push([lat, lon]);
        }

        // Flight arc glow backdrop
        L.polyline(curvedPoints, {
            color: '#F26A21',
            weight: 5,
            opacity: 0.25,
            lineCap: 'round',
        }).addTo(map);

        // Flight arc main dashed line
        L.polyline(curvedPoints, {
            color: '#F26A21',
            weight: 2.5,
            dashArray: '6, 6',
            opacity: 0.9,
            lineCap: 'round',
        }).addTo(map);

        // Custom airport markers
        const createAirportIcon = (iata, isDest = false) => {
            const bgClass = isDest ? 'bg-[#F26A21]' : 'bg-[#0E2A47]';
            const ringColor = isDest ? 'rgba(242, 106, 33, 0.4)' : 'rgba(14, 42, 71, 0.3)';

            return L.divIcon({
                className: 'custom-airport-pin',
                html: `
                    <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
                        <div style="
                            position: absolute;
                            width: 28px;
                            height: 28px;
                            border-radius: 9999px;
                            background: ${ringColor};
                            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
                        "></div>
                        <div style="
                            position: relative;
                            padding: 3px 8px;
                            border-radius: 8px;
                            background-color: ${isDest ? '#F26A21' : '#0E2A47'};
                            color: #FFFFFF;
                            font-family: monospace;
                            font-weight: 800;
                            font-size: 11px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                            border: 1.5px solid #FFFFFF;
                            letter-spacing: 0.5px;
                        ">
                            ${iata}
                        </div>
                        <div style="
                            width: 6px;
                            height: 6px;
                            background-color: ${isDest ? '#F26A21' : '#0E2A47'};
                            border-radius: 9999px;
                            margin-top: 2px;
                            border: 1px solid #FFFFFF;
                        "></div>
                    </div>
                `,
                iconSize: [0, 0],
            });
        };

        // Add origin marker
        L.marker([lat1, lon1], { icon: createAirportIcon(originAirport.iata_code, false) })
            .bindPopup(`<b>${originAirport.city} (${originAirport.iata_code})</b><br>${originAirport.name}`)
            .addTo(map);

        // Add destination marker
        L.marker([lat2, lon2], { icon: createAirportIcon(destAirport.iata_code, true) })
            .bindPopup(`<b>${destAirport.city} (${destAirport.iata_code})</b><br>${destAirport.name}`)
            .addTo(map);

        // Fit map bounds to contain both airports with nice padding
        const bounds = L.latLngBounds([
            [lat1, lon1],
            [lat2, lon2],
            [controlLat, controlLon],
        ]);
        map.fitBounds(bounds, { padding: [35, 45], maxZoom: 8 });

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [originAirport, destAirport]);

    if (!originAirport || !destAirport) return null;

    return (
        <div className="w-full bg-white rounded-2xl p-4 border border-[#CBD5E1]/70 shadow-xs my-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B] flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#F26A21]" />
                    Peta Rute Penerbangan Real-Time
                </span>
                <span className="text-xs font-mono font-bold text-[#0E2A47] bg-[#F6F8FA] px-2.5 py-1 rounded-lg border border-[#CBD5E1]/60">
                    {originAirport.iata_code} → {destAirport.iata_code}
                </span>
            </div>

            {/* Real Interactive Leaflet Map Container */}
            <div
                ref={mapContainerRef}
                className="w-full h-48 sm:h-56 rounded-xl border border-[#CBD5E1]/60 shadow-inner z-10"
                style={{ background: '#f8fafc' }}
            />
        </div>
    );
}
