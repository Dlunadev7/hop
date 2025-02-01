import { MAPBOX_ACCESS_TOKEN, PUBLIC_MAPBOX_API_URL } from '@/config';
import { useState, useEffect } from 'react';
import * as Location from "expo-location";


export const useGetAddressFromCoordinates = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const getAddress = async (latitude: number, longitude: number) => {
    console.log('click')
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
      console.log(error)
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

export const useGetCoordinatesFromAddress = () => {
  const [locations, setLocations] = useState<
    { id: string; name: string; latitude: number; longitude: number }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<null | {
    latitude: number;
    longitude: number;
    name: "",
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentCoords, setCurrentCoords] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          throw new Error("Permiso de ubicación denegado");
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setCurrentCoords({ latitude, longitude });
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error al obtener la ubicación actual");
      }
    };

    getCurrentLocation();
  }, []);

  const geocodeAddress = async (address: string) => {
    if (!currentCoords) {
      setError("Esperando ubicación actual...");
      return;
    }

    try {
      let url = `${PUBLIC_MAPBOX_API_URL}/${encodeURIComponent(
        address
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=15`;

      if (currentCoords) {
        url += `&proximity=${currentCoords.longitude},${currentCoords.latitude}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0 && address.trim().length > 0) {
        const options = data.features
          .filter((feature: any) => {
            return feature.place_name && feature.place_name.split(',').length > 2;
          })
          .map((feature: any) => ({
            id: feature.id,
            name: feature.place_name,
            latitude: feature.center[1],
            longitude: feature.center[0],
          }));

        setLocations(options);
        setError(null);
      } else {
        throw new Error("Dirección no encontrada");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    }
  };

  return {
    locations,
    selectedLocation,
    setSelectedLocation,
    error,
    geocodeAddress,
  };
};
