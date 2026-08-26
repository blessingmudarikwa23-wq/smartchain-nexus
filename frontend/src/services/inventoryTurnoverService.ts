import api from "./api";

export interface InventoryTurnover {
  id: number;
  sku: string;
  item_name: string;
  beginning_inventory: number;
  ending_inventory: number;
  average_inventory: number;
  cost_of_goods_sold: number;
  inventory_turnover_ratio: number;
  days_in_inventory: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryTurnoverCreate {
  sku: string;
  item_name: string;
  beginning_inventory: number;
  ending_inventory: number;
  cost_of_goods_sold: number;
}

export interface InventoryTurnoverUpdate {
  sku?: string;
  item_name?: string;
  beginning_inventory?: number;
  ending_inventory?: number;
  cost_of_goods_sold?: number;
}

export const inventoryTurnoverService = {
  async getInventoryTurnover(): Promise<InventoryTurnover[]> {
    const response = await api.get("/inventory/inventory-turnover");

    return response.data;
  },

  async getInventoryTurnoverById(
    id: number
  ): Promise<InventoryTurnover> {
    const response = await api.get(
      `/inventory/inventory-turnover/${id}`
    );

    return response.data;
  },

  async createInventoryTurnover(
    data: InventoryTurnoverCreate
  ): Promise<InventoryTurnover> {
    const response = await api.post(
      "/inventory/inventory-turnover",
      data
    );

    return response.data;
  },

  async updateInventoryTurnover(
    id: number,
    data: InventoryTurnoverUpdate
  ): Promise<InventoryTurnover> {
    const response = await api.put(
      `/inventory/inventory-turnover/${id}`,
      data
    );

    return response.data;
  },

  async deleteInventoryTurnover(id: number): Promise<void> {
    await api.delete(`/inventory/inventory-turnover/${id}`);
  },
};