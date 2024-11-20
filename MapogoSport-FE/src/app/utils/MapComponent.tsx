import { useEffect, useRef } from "react";

declare var H: any;

interface MapComponentProps {
    coordinates: { lat: number; lon: number };
}

const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Lỗi: ${src}`));
        document.head.appendChild(script);
    });
};

const loadHereMapsScripts = async (initializeMap: () => void) => {
    try {
        await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
        await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
        await loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js');
        await loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js');

        initializeMap();
    } catch (error) {
        console.error('Lỗi khi tải:', error);
    }
};

const MapComponent = ({ coordinates }: MapComponentProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const apiKey = '1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ';

    const initializeMap = () => {
        if (typeof H !== 'undefined' && coordinates && mapRef.current && !mapInstanceRef.current) {
            const platform = new H.service.Platform({ apikey: apiKey });
            const defaultLayers = platform.createDefaultLayers();
            const map = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 15,
                    center: { lat: coordinates.lat, lng: coordinates.lon },
                }
            );

            const marker = new H.map.Marker({ lat: coordinates.lat, lng: coordinates.lon });
            map.addObject(marker);
            new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
            H.ui.UI.createDefault(map, defaultLayers);

            map.addEventListener('tap', () => {
                window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`, '_blank');
            });

            mapInstanceRef.current = map;
        }
    };

    useEffect(() => {
        loadHereMapsScripts(initializeMap);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.dispose();
                mapInstanceRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }
        };
    }, [coordinates, apiKey]);

    return <div ref={mapRef} className="map-border"></div>;
};

export default MapComponent;
