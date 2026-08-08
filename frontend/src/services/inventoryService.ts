import api from "./api";

export interface Inventory {
  id: number;
  product_id: number;
  warehouse: string;
  quantity_in_stock: number;
  minimum_stock: number;
  reorder_level: number;
}

export interface InventoryPayload {
  product_id: number;
  warehouse: string;
  quantity_in_stock: number;
  minimum_stock: number;
  reorder_level: number;
}

export const inventoryService = {
  async getInventory(): Promise<Inventory[]> {
    const response = await api.get("/inventory/");

    return response.data.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      warehouse: item.warehouse ?? "",
      quantity_in_stock: item.quantity,
      minimum_stock: item.minimum_stock,
      reorder_level: item.minimum_stock + 10,
    }));
  },

  async createInventory(data: InventoryPayload) {
    return api.post("/inventory/", {
      product_id: data.product_id,
      quantity: data.quantity_in_stock,
      minimum_stock: data.minimum_stock,
    });
  },

  async updateInventory(id: number, data: InventoryPayload) {
    return api.put(`/inventory/${id}`, {
      product_id: data.product_id,
      quantity: data.quantity_in_stock,
      minimum_stock: data.minimum_stock,
    });
  },

  async deleteInventory(id: number) {
    return api.delete(`/inventory/${id}`);
  },
};