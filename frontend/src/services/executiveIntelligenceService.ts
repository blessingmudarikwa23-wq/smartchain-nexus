import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const executiveIntelligenceService = {
  // ==========================================================
  // CEO DASHBOARD
  // ==========================================================

  async getCEODashboard() {
    const response = await axios.get(
      `${API_URL}/executive-intelligence/ceo-dashboard/`
    );

    return response.data;
  },

  // ==========================================================
  // BUSINESS KPIs
  // ==========================================================

  async getBusinessKPIs() {
    const response = await axios.get(
      `${API_URL}/executive-intelligence/business-kpis/`
    );

    return response.data;
  },

  async getBusinessKPI(kpiId: number) {
    const response = await axios.get(
      `${API_URL}/executive-intelligence/business-kpis/${kpiId}`
    );

    return response.data;
  },

  async createBusinessKPI(kpiData: {
    name: string;
    category: string;
    value: number;
    target: number;
    unit: string;
    status: string;
  }) {
    const response = await axios.post(
      `${API_URL}/executive-intelligence/business-kpis/`,
      kpiData
    );

    return response.data;
  },

  async updateBusinessKPI(
    kpiId: number,
    kpiData: {
      name?: string;
      category?: string;
      value?: number;
      target?: number;
      unit?: string;
      status?: string;
    }
  ) {
    const response = await axios.put(
      `${API_URL}/executive-intelligence/business-kpis/${kpiId}`,
      kpiData
    );

    return response.data;
  },

  async deleteBusinessKPI(kpiId: number) {
    await axios.delete(
      `${API_URL}/executive-intelligence/business-kpis/${kpiId}`
    );
  },
};