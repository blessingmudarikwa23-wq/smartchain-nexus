import api from "./api";

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  order_date: string;
  expected_delivery: string;
  status: string;
  currency: string;
  total_amount: number;
  notes?: string | null;
}

export interface PurchaseOrderCreate {
  po_number: string;
  supplier_id: number;
  order_date: string;
  expected_delivery: string;
  currency: string;
  total_amount: number;
  notes?: string;
}

export interface PurchaseOrderUpdate {
  supplier_id?: number;
  order_date?: string;
  expected_delivery?: string;
  status?: string;
  currency?: string;
  total_amount?: number;
  notes?: string;
}

export const purchaseOrderService = {
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const response = await api.get("/procurement/purchase-orders");
    return response.data;
  },

  async createPurchaseOrder(
    order: PurchaseOrderCreate
  ): Promise<PurchaseOrder> {
    const response = await api.post(
      "/procurement/purchase-orders",
      order
    );

    return response.data;
  },

  async updatePurchaseOrder(
    id: number,
    order: PurchaseOrderUpdate
  ): Promise<PurchaseOrder> {
    const response = await api.put(
      `/procurement/purchase-orders/${id}`,
      order
    );

    return response.data;
  },

  async deletePurchaseOrder(id: number): Promise<void> {
    await api.delete(
      `/procurement/purchase-orders/${id}`
    );
  },
};