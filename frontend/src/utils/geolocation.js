// Utility for getting user's real location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocode(latitude, longitude);
          resolve(location);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error('Erro ao obter localização'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Reverse geocoding using Nominatim (free OpenStreetMap service)
const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=pt-BR`
    );
    
    if (!response.ok) {
      throw new Error('Erro na API de geocodificação');
    }
    
    const data = await response.json();
    
    return {
      city: data.address?.city || data.address?.town || data.address?.village || 'Cidade não identificada',
      state: data.address?.state || 'Estado não identificado',
      neighborhood: data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || null,
      country: data.address?.country || 'Brasil',
      coordinates: { lat, lon }
    };
  } catch (error) {
    console.warn('Erro na geocodificação reversa:', error);
    throw new Error('Não foi possível identificar a localização');
  }
};