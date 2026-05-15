import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import { API_CONFIG } from "../config/api.config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptador para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@token:pizzaria");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("@token:pizzaria");
      // Aqui você pode adicionar lógica para redirecionar o usuário para a tela de login, se necessário
      router.replace("/login");
    }

    if (!error.response) {
      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
      );
    }

    return Promise.reject(error);
  },
);

export default api;
