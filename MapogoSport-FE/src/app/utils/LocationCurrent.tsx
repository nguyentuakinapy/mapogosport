export const fetchLocationCurrent = async (address: string) => {
    const searchAddress = async (query: string) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
            // console.warn('Empty response body.');
            return null;
        }

        const data = JSON.parse(text);

        if (data && data.length > 0) {
            const { lat, lon } = data[0]; 
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }

        return null;
    };

    let location = await searchAddress(address);
    if (location) {
        return location;
    }

    // if api search address undefined
    const keywords = ["phường", "xã", "thị trấn"];
    const lowerCaseAddress = address.toLowerCase();
    for (const keyword of keywords) {
        const index = lowerCaseAddress.indexOf(keyword);
        if(index !==-1){
            const locationAddress = address.slice(index).trim();
            location = await searchAddress(locationAddress);
            if (location) {
                return location;
            }
        }
    }
    return null;
};