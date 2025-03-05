import { MAPBOX_ACCESS_TOKEN, PUBLIC_MAPBOX_API_URL } from '@/config';
import { useState, useEffect, useRef } from 'react';
import * as Location from "expo-location";

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

export const useGetCoordinatesFromAddress = () => {
  const [locations, setLocations] = useState<
    { id: string; name: string; latitude: number; longitude: number }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<null | {
    latitude: number;
    longitude: number;
    name: "";
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
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=15&country=cl`;

      if (currentCoords) {
        url += `&proximity=${currentCoords.longitude},${currentCoords.latitude}`;
      }


      const response = await fetch(url);
      const data = await response.json();

      console.log(data)


      if (data.features && data.features.length > 0) {
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

export const useGetRouteTime = (origin: [number, number], destination: [number, number]) => {
  const [route, setRoute] = useState<{ distance: number; duration: number; geometry: any } | null>(null);
  const [loading, setLoading] = useState(false);

  // Guardamos las coordenadas previas para evitar llamadas innecesarias
  const prevOrigin = useRef<[number, number] | null>(null);
  const prevDestination = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (
      prevOrigin.current &&
      prevDestination.current &&
      prevOrigin.current[0] === origin[0] &&
      prevOrigin.current[1] === origin[1] &&
      prevDestination.current[0] === destination[0] &&
      prevDestination.current[1] === destination[1]
    ) {
      return;
    }

    const getRoute = async () => {
      setLoading(true);
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes.length) {
          setRoute({
            distance: data.routes[0].distance / 1000,
            duration: data.routes[0].duration / 60,
            geometry: data.routes[0].geometry,
          });
        }
      } catch (error) { } finally {
        setLoading(false);
      }
    };

    getRoute();

    prevOrigin.current = origin;
    prevDestination.current = destination;
  }, [origin, destination]);

  return { route, loading };
};

export const getGPSDirections = () => {
  const [route, setRoute] = useState<any>(null);
  const [instructions, setInstructions] = useState<string[]>([]);

  const handleGetDirections = async (origin: { latitude: number, longitude: number }, destination: { latitude: number, longitude: number }) => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al obtener la ruta");
      }

      const data = await response.json();

      if (data.routes.length > 0) {
        setRoute(data.routes[0].geometry.coordinates);

        // Extraer instrucciones paso a paso
        const steps = data.routes[0].legs[0].steps.map(
          (step: any) => `${step.maneuver.instruction} en ${step.distance} metros`
        );

        setInstructions(steps);
      }
    } catch (error) {
      console.error("Error obteniendo la ruta:", error);
    }
  }



  return {
    route,
    instructions,
    handleGetDirections
  }
};
