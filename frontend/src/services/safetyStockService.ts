import axios from "axios";

export interface SafetyStock {
  id: number;
  sku: string;
  item_name: string;
  average_daily_demand: number;
  lead_time_days: number;
  demand_std_dev: number;
  service_level: number;
  safety_stock: number;
}

export interface SafetyStockCreate {
  sku: string;
  item_name: string;
  average_daily_demand: number;
  lead_time_days: number;
  demand_std_dev: number;
  service_level?: number;
  safety_stock: number;
}

export interface SafetyStockUpdate {
  sku?: string;
  item_name?: string;
  average_daily_demand?: number;
  lead_time_days?: number;
  demand_std_dev?: number;
  service_level?: number;
  safety_stock?: number;
}

const API_BASE_URL = "https://smartchain-nexus-3.onrender.com";

export const safetyStockService = {
  async getAll(): Promise<SafetyStock[]> {
    const response = await axios.get<SafetyStock[]>(
      `${API_BASE_URL}/inventory/safety-stock`
    );

    return response.data;
  },

  async getById(id: number): Promise<SafetyStock> {
    const response = await axios.get<SafetyStock>(
      `${API_BASE_URL}/inventory/safety-stock/${id}`
    );

    return response.data;
  },

  async create(
    data: SafetyStockCreate
  ): Promise<SafetyStock> {
    const response = await axios.post<SafetyStock>(
      `${API_BASE_URL}/inventory/safety-stock`,
      data
    );

    return response.data;
  },

  async update(
    id: number,
    data: SafetyStockUpdate
  ): Promise<SafetyStock> {
    const response = await axios.put<SafetyStock>(
      `${API_BASE_URL}/inventory/safety-stock/${id}`,
      data
    );

    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/inventory/safety-stock/${id}`
    );
  },
};