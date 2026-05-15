import { LoginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useState } from "react";
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
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
        return;
      }
      console.log(error);
    }
  }

  return (
    <AuthContext value={{ user, signed, loading, signIn }}>
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
