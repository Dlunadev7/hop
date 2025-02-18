import axiosInstance from "@/axios/axios.config";
import { User, UserDocument } from "@/utils/interfaces/auth.interface";
import { VehicleResponse } from "@/utils/types/vehicle";
import axios, { AxiosResponse } from "axios";

type File = {
  uri: string;
  type?: string;
  name?: string;
}

export const uploadPicture = async (id: string, file: File): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "file.jpg",
    } as any);

    const response: AxiosResponse<User> = await axiosInstance.patch(
      `/user-info/profilepic/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export const updateUserData = async (id: string, data: Partial<User>): Promise<User> => {
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

export const getVehicleData = async (id: string): Promise<VehicleResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(`/user-vehicle/user/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}

export const getUserDocumentation = async (id: string): Promise<UserDocument> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(`/user-documents/user/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
}


// export const getUserRate = async (id: string): Promise<UserDocument> => {
//   try {
//     const response: AxiosResponse = await axiosInstance.get(`/user-documents/user/${id}`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       throw error.response || error;
//     }
//     throw error;
//   }
// }

