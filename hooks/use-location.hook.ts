import { RelativePathString, useRouter } from "expo-router";
import * as ExpoLocation from "expo-location";
import { useAuth } from "@/context/auth.context";

type UseRequestLocationPermissionProps = {
  url: RelativePathString | any;
  step: number;
};

export const useRequestLocationPermission = ({ url, step }: UseRequestLocationPermissionProps) => {
  const router = useRouter();
  const { location } = useAuth();

  const requestLocationPermission = async () => {
    try {
      if (!location) {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        console.log(status)
        if (status !== "granted") {
          alert("Permiso de ubicación denegado");
          return;
        }

      }
      router.push({
        pathname: url,
        params: { step: step },
      });
    } catch (error) {
      console.error("Error solicitando permisos de ubicación:", error);
      alert("Ocurrió un error al solicitar permisos de ubicación.");
    }
  };

  return {
    requestLocationPermission,
  };
};
