import { LoginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import api from "../services/api";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean; // SE FOR TRUE então está logado e se for false, não está logado
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      await loadStorageData();
    }
    loadData();
  }, []);

  async function loadStorageData() {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("@token:pizzaria");
      const storedUser = await AsyncStorage.getItem("@user:pizzaria");
      // console.log(storedToken);
      // console.log(storedUser);
      if (storedToken && storedUser) {
        await api.get("/me"); // 👈 se token expirou, retorna 401 → interceptor cuida
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("cai aqui ", error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post<LoginResponse>("/session", {
        email: email,
        password: password,
      });

      // console.log(response.data);
      const { token, ...userData } = response.data;
      await AsyncStorage.setItem("@token:pizzaria", token);
      await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.error);
        Alert.alert(
          "Erro",
          error.response?.data?.error || "Erro ao tentar fazer login.",
        );
      }
      console.log(error);
      throw error;
    }
  }

  async function signOut() {
    //await AsyncStorage.removeItem("@token:pizzaria");
    //await AsyncStorage.removeItem("@user:pizzaria");
    await AsyncStorage.multiRemove(["@token:pizzaria", "@user:pizzaria"]);
    setUser(null);
  }

  return (
    <AuthContext value={{ user, signed: !!user, loading, signIn, signOut }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Contexto não foi encontrado!");
  }

  return context;
}
