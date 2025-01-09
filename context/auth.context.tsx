import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

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
      value={{ token, setToken: handleSetToken, clearToken: handleClearToken }}
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
