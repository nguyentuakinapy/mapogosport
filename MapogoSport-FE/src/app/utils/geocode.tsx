export const fetchCoordinates = async (address: string) => {
    const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=1L5jezTEO7ul4G9cekrrqiy14XhPi_yIOhSKnsrzkZQ`);
    const coordData = await response.json();
    if (coordData.items && coordData.items.length > 0) {
        const { lat, lng } = coordData.items[0].position;
        return { lat, lon: lng };
    }
    return null;
};


