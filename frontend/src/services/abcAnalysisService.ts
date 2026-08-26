import api from "./api";

export interface ABCAnalysis {
  id: number;
  sku: string;
  item_name: string;
  annual_consumption: number;
  annual_value: number;
  percentage_of_total: number;
  cumulative_percentage: number;
  classification: string;
}

export interface ABCAnalysisCreate {
  sku: string;
  item_name: string;
  annual_consumption: number;
  annual_value: number;
  percentage_of_total: number;
  cumulative_percentage: number;
  classification: string;
}

export interface ABCAnalysisUpdate {
  sku?: string;
  item_name?: string;
  annual_consumption?: number;
  annual_value?: number;
  percentage_of_total?: number;
  cumulative_percentage?: number;
  classification?: string;
}

export const abcAnalysisService = {
  async getAnalyses(): Promise<ABCAnalysis[]> {
    const response = await api.get("/inventory/abc-analysis");

    return response.data;
  },

  async createAnalysis(
    data: ABCAnalysisCreate
  ): Promise<ABCAnalysis> {
    const response = await api.post(
      "/inventory/abc-analysis",
      data
    );

    return response.data;
  },

  async updateAnalysis(
    id: number,
    data: ABCAnalysisUpdate
  ): Promise<ABCAnalysis> {
    const response = await api.put(
      `/inventory/abc-analysis/${id}`,
      data
    );

    return response.data;
  },

  async deleteAnalysis(id: number): Promise<void> {
    await api.delete(
      `/inventory/abc-analysis/${id}`
    );
  },
};