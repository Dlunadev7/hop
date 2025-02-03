import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

type addressType = {
  address: string;
  latitude: string;
  longitude: string;
};

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  state: {
    user_info: addressType;
    hotel_info: addressType;
  };
  updatePayload: (newData: {}) => void;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState({
    user_info: {
      address: "",
      latitude: "",
      longitude: "",
    },
    hotel_info: {
      address: "",
      latitude: "",
      longitude: "",
    },
  });

  const [location, setLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  const updatePayload = (newData: Partial<typeof state>) => {
    setState((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("auth_token");
      const token = JSON.parse(savedToken!);

      if (token.token) {
        setToken(savedToken);
      }
    })();
  }, []);

  const handleSetToken = async (token: string) => {
    await AsyncStorage.setItem("auth_token", token);

    setToken(token);
  };

  const handleClearToken = async () => {
    await AsyncStorage.removeItem("auth_token");
    setToken(null);
  };
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc) => {
            const { latitude, longitude } = loc.coords;
            setLocation({ latitude, longitude });
          }
        );
      } else {
        console.warn("Permiso de ubicación denegado");
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        setLocation({ latitude, longitude });
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: handleSetToken,
        clearToken: handleClearToken,
        state,
        updatePayload,
        location,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
