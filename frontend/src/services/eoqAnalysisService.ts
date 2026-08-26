import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface EOQAnalysis {
  id: number;
  sku: string;
  item_name: string;
  annual_demand: number;
  ordering_cost: number;
  holding_cost: number;
  economic_order_quantity: number;
}

export interface EOQAnalysisCreate {
  sku: string;
  item_name: string;
  annual_demand: number;
  ordering_cost: number;
  holding_cost: number;
}

export interface EOQAnalysisUpdate {
  sku?: string;
  item_name?: string;
  annual_demand?: number;
  ordering_cost?: number;
  holding_cost?: number;
}

export const eoqAnalysisService = {
  getAll: async (): Promise<EOQAnalysis[]> => {
    const response = await axios.get<EOQAnalysis[]>(
      `${API_URL}/inventory/eoq-analysis`
    );

    return response.data;
  },

  getById: async (id: number): Promise<EOQAnalysis> => {
    const response = await axios.get<EOQAnalysis>(
      `${API_URL}/inventory/eoq-analysis/${id}`
    );

    return response.data;
  },

  create: async (
    data: EOQAnalysisCreate
  ): Promise<EOQAnalysis> => {
    const response = await axios.post<EOQAnalysis>(
      `${API_URL}/inventory/eoq-analysis`,
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: EOQAnalysisUpdate
  ): Promise<EOQAnalysis> => {
    const response = await axios.put<EOQAnalysis>(
      `${API_URL}/inventory/eoq-analysis/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(
      `${API_URL}/inventory/eoq-analysis/${id}`
    );
  },
};