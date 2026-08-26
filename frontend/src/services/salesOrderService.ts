import api from "./api";

export interface SalesOrder {
  id: number;
  order_number: string;
  customer_code: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export interface SalesOrderCreate {
  order_number: string;
  customer_code: string;
  product: string;
  quantity: number;
  unit_price: number;
  order_status: string;
  payment_status: string;
}

export interface SalesOrderUpdate {
  customer_code?: string;
  product?: string;
  quantity?: number;
  unit_price?: number;
  order_status?: string;
  payment_status?: string;
}

export const salesOrderService = {
  async getSalesOrders(): Promise<SalesOrder[]> {
    const response = await api.get<SalesOrder[]>("/sales/orders");
    return response.data;
  },

  async getSalesOrder(id: number): Promise<SalesOrder> {
    const response = await api.get<SalesOrder>(`/sales/orders/${id}`);
    return response.data;
  },

  async createSalesOrder(
    order: SalesOrderCreate
  ): Promise<SalesOrder> {
    const response = await api.post<SalesOrder>(
      "/sales/orders",
      order
    );

    return response.data;
  },

  async updateSalesOrder(
    id: number,
    order: SalesOrderUpdate
  ): Promise<SalesOrder> {
    const response = await api.put<SalesOrder>(
      `/sales/orders/${id}`,
      order
    );

    return response.data;
  },

  async deleteSalesOrder(id: number): Promise<void> {
    await api.delete(`/sales/orders/${id}`);
  },
};