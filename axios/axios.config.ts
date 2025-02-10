import { API_URL } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100000,
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

      try {
        const refreshTokenValue = await AsyncStorage.getItem('auth_token');
        if (!refreshTokenValue) {
          console.warn('No hay refresh token, cerrando sesión.');
          return Promise.reject(error);
        }

        const refreshTokenParsed = JSON.parse(refreshTokenValue);
        if (!refreshTokenParsed?.refreshToken) {
          console.warn('No se encontró refreshToken en el almacenamiento.');
          return Promise.reject(error);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshResponse = await axios.get(`${API_URL}/auth/refresh`, {
              headers: {
                Authorization: `Bearer ${refreshTokenParsed.refreshToken}`,
              },
            });

            const { token, refreshToken } = refreshResponse.data;
            await AsyncStorage.setItem('auth_token', JSON.stringify({ token, refreshToken }));

            failedRequestsQueue.forEach((callback) => callback());
            failedRequestsQueue = [];

            isRefreshing = false;
          } catch (refreshError) {
            console.error('Error al refrescar el token:', refreshError);
            failedRequestsQueue = [];
            isRefreshing = false;
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push(() => {
            axiosInstance(originalRequest).then(resolve).catch(reject);
          });
        });

      } catch (refreshCatchError) {
        console.error('Error en el proceso de refresh:', refreshCatchError);
        return Promise.reject(refreshCatchError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
