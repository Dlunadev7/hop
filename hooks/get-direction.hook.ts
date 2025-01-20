import { MAPBOX_ACCESS_TOKEN, PUBLIC_MAPBOX_API_URL } from '@/config';
import { useState } from 'react';


export const useGetAddressFromCoordinates = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const getAddress = async (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
    setLoadingAddress(true);
    try {
      const response = await fetch(`${PUBLIC_MAPBOX_API_URL}/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const placeName = data.features[0].text + ' ' + (data.features[0].address ?? '');
        setAddress(placeName || 'Dirección no encontrada');
      } else {
        setAddress('Dirección no encontrada');
      }
    } catch (error) {
      setAddress('Error al obtener dirección');
    } finally {
      setLoadingAddress(false);
    }
  };

  return {
    selectedLocation,
    address,
    loadingAddress,
    getAddress,
  };
};
