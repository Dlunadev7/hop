import axiosInstance from "@/axios/axios.config";
import axios, { AxiosResponse } from "axios";

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  seen: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  order: "ASC" | "DESC";
}

export interface NotificationResponse {
  result: Notification[];
  pagination: Pagination;
}

export const getNotifications = async (id: string): Promise<NotificationResponse> => {
  try {
    const response: AxiosResponse<NotificationResponse> = await axiosInstance.get(`/notifications?user=${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const markNotificationsAsSeen = async (): Promise<void> => {
  try {
    await axiosInstance.put("/notifications/alreadySeen");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/notifications/${id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response || error;
    }
    throw error;
  }
};
