import api from "./api";

export interface XYZAnalysis {
  id: number;
  sku: string;
  item_name: string;
  average_demand: number;
  demand_variability: number;
  coefficient_of_variation: number;
  classification: string;
  created_at?: string;
  updated_at?: string;
}

export interface XYZAnalysisCreate {
  sku: string;
  item_name: string;
  average_demand: number;
  demand_variability: number;
  coefficient_of_variation: number;
  classification: string;
}

export interface XYZAnalysisUpdate {
  sku?: string;
  item_name?: string;
  average_demand?: number;
  demand_variability?: number;
  coefficient_of_variation?: number;
  classification?: string;
}

export const xyzAnalysisService = {
  async getXYZAnalysis(): Promise<XYZAnalysis[]> {
    const response = await api.get("/inventory/xyz-analysis");

    return response.data;
  },

  async getSingleXYZAnalysis(
    id: number
  ): Promise<XYZAnalysis> {
    const response = await api.get(
      `/inventory/xyz-analysis/${id}`
    );

    return response.data;
  },

  async createXYZAnalysis(
    data: XYZAnalysisCreate
  ): Promise<XYZAnalysis> {
    const response = await api.post(
      "/inventory/xyz-analysis",
      data
    );

    return response.data;
  },

  async updateXYZAnalysis(
    id: number,
    data: XYZAnalysisUpdate
  ): Promise<XYZAnalysis> {
    const response = await api.put(
      `/inventory/xyz-analysis/${id}`,
      data
    );

    return response.data;
  },

  async deleteXYZAnalysis(
    id: number
  ): Promise<void> {
    await api.delete(
      `/inventory/xyz-analysis/${id}`
    );
  },
};