import axiosInstance from "@/axios/axios.config";
import axios from "axios";

export interface Report {
  content: string,
  user: {
    id: string
  }
}

export interface ReportResponse {
  success: boolean;
  data: Report[];
}

export const createReport = async (reportData: Omit<Report, "id" | "createdAt">): Promise<Report> => {
  try {
    const response = await axiosInstance.post<Report>("/report", reportData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const getReports = async (): Promise<ReportResponse> => {
  try {
    const response = await axiosInstance.get<ReportResponse>("/report");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const deleteReport = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/report/${id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};
