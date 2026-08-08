import api from "./api";

export interface SalesOrder {
  id: number;
  customer_id: number;
  order_date: string;
  delivery_date: string;
  status: string;
}

export const salesOrderService = {
  async getSalesOrders(): Promise<SalesOrder[]> {
    const response = await api.get("/sales-orders/");
    return response.data;
  },

  async createSalesOrder(
    order: Omit<SalesOrder, "id">
  ): Promise<SalesOrder> {
    const response = await api.post("/sales-orders/", order);
    return response.data;
  },

  async updateSalesOrder(
    id: number,
    order: Omit<SalesOrder, "id">
  ): Promise<SalesOrder> {
    const response = await api.put(`/sales-orders/${id}`, order);
    return response.data;
  },

  async deleteSalesOrder(id: number): Promise<void> {
    await api.delete(`/sales-orders/${id}`);
  },
};