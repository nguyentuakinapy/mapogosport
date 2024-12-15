import { useCallback, useEffect, useRef } from "react";

interface MapComponentProps {
    coordinates: { lat: number; lon: number };
}

const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Lỗi khi tải script: ${src}`));
        document.head.appendChild(script);
    });
};

const loadHereMapsScripts = async (initializeMap: () => void) => {
    try {
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-ui.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js");
        initializeMap();
    } catch (error) {
        // console.error("Lỗi khi tải scripts HERE Maps:", error);
    }
};

const MapComponent = ({ coordinates }: MapComponentProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<H.Map | null>(null);
    const apiKey = "1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ";

    const initializeMap = useCallback(() => {
        if (typeof window.H !== "undefined" && coordinates && mapRef.current && !mapInstanceRef.current) {
            const platform = new window.H.service.Platform({ apikey: apiKey });
            const defaultLayers = platform.createDefaultLayers();
            const map = new window.H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 15,
                    center: { lat: coordinates.lat, lng: coordinates.lon },
                }
            );

            const marker = new window.H.map.Marker({ lat: coordinates.lat, lng: coordinates.lon });
            map.addObject(marker);

            new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
            window.H.ui.UI.createDefault(map, defaultLayers);

            map.addEventListener("tap", () => {
                window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`, "_blank");
            });

            mapInstanceRef.current = map;
        }
    }, [coordinates]);

    useEffect(() => {
        const currentMapRef = mapRef.current;
        loadHereMapsScripts(initializeMap);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.dispose();
                mapInstanceRef.current = null;
            }
            if (currentMapRef) {
                currentMapRef.innerHTML = "";
            }
        };
    }, [initializeMap]);

    return <div ref={mapRef} className="map-border" style={{ height: "480px", width: "100%" }}></div>;
};

export default MapComponent;
