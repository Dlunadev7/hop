import axiosInstance from '@/axios/axios.config';
import { CreateUserResponse, SignInPayload, SignInResponse, User } from '@/utils/interfaces/auth.interface';
import axios, { AxiosResponse } from 'axios';

export const createUser = async (userData: CreateUserResponse): Promise<User> => {
  try {
    const response: AxiosResponse = await axiosInstance.post('/user', userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const getUser = async (): Promise<Omit<User, 'userDocument'>> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/user');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const login = async (credentials: SignInPayload): Promise<SignInResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const refreshToken = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/auth/refresh');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const recoveryPassword = async (email: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.post('/mail/recoveryPassword', { email });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const getUserLogged = async (): Promise<User> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/user/logged');
    console.log('fromService', response.data)
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}