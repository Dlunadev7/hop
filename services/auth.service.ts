import axiosInstance from '@/axios/axios.config';
import { API_URL } from '@/config';
import { SignInPayload, SignInResponse, User, UserDocument, UserDocumentsPayload, UserInfo, VehicleUser } from '@/utils/interfaces/auth.interface';
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
    const response: AxiosResponse = await axiosInstance.put(`/user-info/${id}`, data);
    return response.data;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}

export const updateUserOne = async (id: string, data: Partial<User>): Promise<User> => {
  try {
    const response: AxiosResponse = await axiosInstance.put(`/user/one/${id}`, data);
    return response.data;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}

export const getUserById = async (id: string): Promise<Omit<User, 'userDocument'>> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(`/user/one/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const updateVehicleUser = async (id: string, data: VehicleUser): Promise<User> => {
  try {
    const response: AxiosResponse = await axiosInstance.patch(`/user-vehicle/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}
export const updateUserDocuments = async (
  id: string,
  data: Partial<UserDocumentsPayload>
): Promise<void> => {
  const uploadDocument = async (
    documentType: string,
    files: Array<{ uri: string; type?: string; name?: string }>
  ) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.name || "file.jpg",
      } as any);
    });

    formData.append("document", documentType);


    try {
      await axiosInstance.patch(`/user-documents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response || error;
      }
      throw error;
    }
  };
  const uploadPromises: Promise<void>[] = [];

  console.log(data.vehiclePictures)

  if (data.vehiclePictures && data.vehiclePictures.length > 0) {
    console.log('se ejecuto el de las fotos')
    uploadPromises.push(uploadDocument("vehiclePictures", data.vehiclePictures));
  }

  if (data.circulationPermit && data.circulationPermit.length > 0) {
    uploadPromises.push(uploadDocument("circulationPermit", data.circulationPermit));
  }

  if (data.seremiDecree && data.seremiDecree.length > 0) {
    uploadPromises.push(uploadDocument("seremiDecree", data.seremiDecree));
  }

  if (data.driverResume && data.driverResume.length > 0) {
    uploadPromises.push(uploadDocument("driverResume", data.driverResume));
  }

  if (data.passengerInsurance && data.passengerInsurance.length > 0) {
    uploadPromises.push(uploadDocument("passengerInsurance", data.passengerInsurance));
  }

  console.log(JSON.stringify(data, null, 2))

  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
  }
};
