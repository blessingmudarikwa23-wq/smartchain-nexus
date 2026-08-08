import api from "./api";

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  order_date: string;
  expected_delivery_date: string;
  status: string;
}

export const purchaseOrderService = {
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const response = await api.get("/purchase-orders/");
    return response.data;
  },

  async createPurchaseOrder(
    order: Omit<PurchaseOrder, "id">
  ): Promise<PurchaseOrder> {
    const response = await api.post("/purchase-orders/", order);
    return response.data;
  },

  async updatePurchaseOrder(
    id: number,
    order: Omit<PurchaseOrder, "id">
  ): Promise<PurchaseOrder> {
    const response = await api.put(`/purchase-orders/${id}`, order);
    return response.data;
  },

  async deletePurchaseOrder(id: number): Promise<void> {
    await api.delete(`/purchase-orders/${id}`);
  },
};