import api from "./api";

export interface Inventory {
  id: number;
  sku: string;
  barcode: string | null;
  item_name: string;
  category: string;
  warehouse: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  minimum_stock: number;
  maximum_stock: number;
  status: boolean;
}

export interface InventoryPayload {
  sku: string;
  barcode?: string | null;
  item_name: string;
  category: string;
  warehouse: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  minimum_stock: number;
  maximum_stock: number;
}

export const inventoryService = {
  async getInventory(): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>("/inventory/");
    return response.data;
  },

  async createInventory(
    data: InventoryPayload
  ): Promise<Inventory> {
    const response = await api.post<Inventory>(
      "/inventory/",
      data
    );

    return response.data;
  },

  async updateInventory(
    id: number,
    data: Partial<InventoryPayload>
  ): Promise<Inventory> {
    const response = await api.put<Inventory>(
      `/inventory/${id}`,
      data
    );

    return response.data;
  },

  async deleteInventory(id: number): Promise<void> {
    await api.delete(`/inventory/${id}`);
  },
};