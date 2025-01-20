import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const updatePayload = (newData: Partial<typeof state>) => {
    setState((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("auth_token");
      if (savedToken) {
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

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: handleSetToken,
        clearToken: handleClearToken,
        state,
        updatePayload,
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
