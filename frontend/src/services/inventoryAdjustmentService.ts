import api from "./api";

export interface InventoryAdjustment {
  id: number;
  inventory_item_id: number;

  item_name: string;
  sku: string;
  category: string;
  warehouse: string;

  adjustment_type: string;
  quantity: number;

  previous_quantity: number;
  new_quantity: number;
  current_quantity: number;

  reason?: string | null;
  adjusted_by: string;
  created_at?: string | null;
}

export interface InventoryAdjustmentCreate {
  inventory_item_id: number;
  adjustment_type: string;
  quantity: number;
  reason?: string;
  adjusted_by: string;
}

export interface InventoryAdjustmentUpdate {
  adjustment_type?: string;
  quantity?: number;
  reason?: string;
  adjusted_by?: string;
}

export const inventoryAdjustmentService = {
  async getAdjustments(): Promise<InventoryAdjustment[]> {
    const response = await api.get<InventoryAdjustment[]>(
      "/inventory/adjustments"
    );

    return response.data;
  },

  async getAdjustment(
    id: number
  ): Promise<InventoryAdjustment> {
    const response = await api.get<InventoryAdjustment>(
      `/inventory/adjustments/${id}`
    );

    return response.data;
  },

  async createAdjustment(
    data: InventoryAdjustmentCreate
  ): Promise<InventoryAdjustment> {
    const response = await api.post<InventoryAdjustment>(
      "/inventory/adjustments",
      data
    );

    return response.data;
  },

  async updateAdjustment(
    id: number,
    data: InventoryAdjustmentUpdate
  ): Promise<InventoryAdjustment> {
    const response = await api.put<InventoryAdjustment>(
      `/inventory/adjustments/${id}`,
      data
    );

    return response.data;
  },

  async deleteAdjustment(
    id: number
  ): Promise<void> {
    await api.delete(
      `/inventory/adjustments/${id}`
    );
  },
};