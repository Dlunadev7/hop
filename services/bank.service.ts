import axiosInstance from "@/axios/axios.config";
import { Bank } from "@/utils/types/bank.type";
import axios, { AxiosResponse } from "axios";

export const getBanks = async (): Promise<Bank[]> => {
  try {
    const response: AxiosResponse<Bank[]> = await axiosInstance.get("/banks");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};