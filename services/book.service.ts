import axiosInstance from "@/axios/axios.config";
import { userRoles } from "@/utils/enum/role.enum";
import { BookingPagination, BookingResponse } from "@/utils/interfaces/booking.interface";
import axios, { AxiosResponse } from "axios";

export const createTravel = async (travelData: Partial<BookingResponse>): Promise<BookingResponse> => {
  try {
    const response: AxiosResponse<BookingResponse> = await axiosInstance.post("/travels", travelData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const getTravels = async (
  id?: string,
  type?: 'hoppy' | 'hopper',
  booking?: boolean,
  history?: boolean,
  page: number = 0,
  itemsPerPage: number = 10
): Promise<BookingPagination> => {
  try {
    const queryParams = new URLSearchParams({
      ...(type === "hoppy" && { hoppy: id }),
      ...(type === "hopper" && { hopper: id }),
      ...(booking && { booking: String(booking) }),
      ...(history && { history: String(history) }),
      order: "DESC",
      page: String(page),
      itemsPerPage: String(itemsPerPage),
    });

    const response: AxiosResponse<BookingPagination> = await axiosInstance.get(
      `/travels?${queryParams.toString()}`
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};


export const getTravelHistory = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await axiosInstance.get("/travels/history");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const getTravelById = async (id: string): Promise<BookingResponse> => {
  console.log(`/travels/one/${id}`)
  try {
    const response: AxiosResponse<BookingResponse> = await axiosInstance.get(`/travels/one/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.log('eror', error)
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const updateTravel = async (id: string, travelData: any): Promise<any> => {
  console.log(id, travelData)
  try {
    const response: AxiosResponse<any> = await axiosInstance.patch(`/travels/${id}`, travelData);
    console.log(response.data)
    return response.data;
  } catch (error: unknown) {
    console.log('erorr', error)
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const deleteTravel = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.delete(`/ travels / ${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};
