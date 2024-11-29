export const fetchLocationCurrent = async (address: string) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
            console.warn('Empty response body.');
            return null;
        }

        const data = JSON.parse(text);

        if (data && data.length > 0) {
            const { lat, lon } = data[0]; 
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }

        console.warn('No location data found for the provided address.');
        return null;
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
};