import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { setUnauthorizedHandler } from "../api/http";
import { UserResponse } from "../auth/models/auth.model";
import { AuthService } from "../auth/services/auth.service";

interface AuthContextType {
  token: string | null;
  user: UserResponse | null;
  isLoadingSession: boolean;
  saveSession: (token: string, user: UserResponse) => Promise<void>;
  clearSession: () => void;
  updateUserSession: (updateUser: UserResponse) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        //SI TENGO TOKEN GUARDADO
        const savedToken = await AsyncStorage.getItem("@auth_token");
        //SI TENGO EL USUARIO GUARDADO
        const savedUser = await AsyncStorage.getItem("@auth_user");

        if (savedToken !== null && savedUser !== null) {
          try {
            const isValid = await AuthService.validateToken(savedToken);
            if (isValid) {
              setToken(savedToken);
              setUser(JSON.parse(savedUser));
            } else {
              await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
            }
          } catch (error) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.log("Error al cargar la sesión!", error);
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadSession();
  }, []);

  const saveSession = async (newToken: string, newUser: UserResponse) => {
    try {
      await AsyncStorage.setItem("@auth_token", newToken);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.log("Error al persistir la data", error);
    }
  };

  const updateUserSession = async (updateUser: UserResponse) => {
    try {
      await AsyncStorage.setItem("@auth_user", JSON.stringify(updateUser));
      setUser(updateUser);
    } catch (error) {
      console.log("Error al actualizar la data en AsyncStorage", error);
    }
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem("@auth_token");
      await AsyncStorage.removeItem("@auth_user");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log("Error al limpiar data", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoadingSession, saveSession, updateUserSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};