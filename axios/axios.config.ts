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

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const jsonValue = await AsyncStorage.getItem('auth_token');
      const { token } = JSON.parse(jsonValue!);
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['origin-login'] = 'app';
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
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token expirado. Redirigiendo a login...');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
