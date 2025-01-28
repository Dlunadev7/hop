import { API_URL } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedRequestsQueue: Array<() => void> = [];

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const jsonValue = await AsyncStorage.getItem('auth_token');
      if (jsonValue) {
        const { token } = JSON.parse(jsonValue);
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['origin-login'] = 'app';
      }
    } catch (error) {
      console.error('Error obteniendo el token del almacenamiento:', error);
    }

    return config;
  },
  (error) => {
    console.error('Error en el interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshTokenValue = await AsyncStorage.getItem('auth_token') as string;
          const refreshTokenParsed = JSON.parse(refreshTokenValue);
          const refreshResponse = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken: refreshTokenParsed.refreshToken,
          });

          const { token, refreshToken } = refreshResponse.data;

          await AsyncStorage.setItem('auth_token', JSON.stringify({ token, refreshToken }));
          await AsyncStorage.setItem('refresh_token', refreshToken);

          failedRequestsQueue.forEach((callback) => callback());
          failedRequestsQueue = [];
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError);
          failedRequestsQueue = [];
          isRefreshing = false;
          return Promise.reject(refreshError);
        }

        isRefreshing = false;
      }

      // Agregar la solicitud fallida a la cola
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push(() => {
          axiosInstance(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
