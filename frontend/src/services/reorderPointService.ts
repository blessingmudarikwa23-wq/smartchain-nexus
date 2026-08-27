import axios from "axios";

export interface ReorderPoint {
  id: number;
  sku: string;
  item_name: string;
  average_daily_usage: number;
  lead_time_days: number;
  safety_stock: number;
  reorder_point: number;
  created_at: string;
  updated_at?: string;
}

export interface ReorderPointCreate {
  sku: string;
  item_name: string;
  average_daily_usage: number;
  lead_time_days: number;
  safety_stock: number;
}

export interface ReorderPointUpdate {
  sku?: string;
  item_name?: string;
  average_daily_usage?: number;
  lead_time_days?: number;
  safety_stock?: number;
}

const API_BASE_URL = "https://smartchain-nexus-3.onrender.com";

export const reorderPointService = {
  async getAll(): Promise<ReorderPoint[]> {
    const response = await axios.get<ReorderPoint[]>(
      `${API_BASE_URL}/inventory/reorder-point`
    );

    return response.data;
  },

  async getById(id: number): Promise<ReorderPoint> {
    const response = await axios.get<ReorderPoint>(
      `${API_BASE_URL}/inventory/reorder-point/${id}`
    );

    return response.data;
  },

  async create(
    data: ReorderPointCreate
  ): Promise<ReorderPoint> {
    const response = await axios.post<ReorderPoint>(
      `${API_BASE_URL}/inventory/reorder-point`,
      data
    );

    return response.data;
  },

  async update(
    id: number,
    data: ReorderPointUpdate
  ): Promise<ReorderPoint> {
    const response = await axios.put<ReorderPoint>(
      `${API_BASE_URL}/inventory/reorder-point/${id}`,
      data
    );

    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/inventory/reorder-point/${id}`
    );
  },
};