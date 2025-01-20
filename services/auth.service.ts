import axiosInstance from '@/axios/axios.config';
import { API_URL } from '@/config';
import { SignInPayload, SignInResponse, User, UserInfo } from '@/utils/interfaces/auth.interface';
import axios, { AxiosResponse } from 'axios';

export const createUser = async (userData: Partial<User & UserInfo>): Promise<User> => {
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
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}

export const updateUser = async (id: string, data: Partial<UserInfo>): Promise<User> => {
  try {
    console.log(`/user-info/${id}`, data)
    const response: AxiosResponse = await axiosInstance.put(`/user-info/${id}`, {
      body: {
        bank_name: {
          name: data.bank_name?.name,
          id: data.bank_name?.id
        },
        bank_account_holder: data.bank_account_holder,
        bank_account_rut: data.bank_account_rut,
        bank_account_type: data.bank_account_type,
        bank_account: data.bank_account,
      }
    },
    );
    console.log(JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: unknown) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}