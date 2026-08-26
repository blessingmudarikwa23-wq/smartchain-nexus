import api from "./api";

export interface Customer {
  id: number;
  customer_code: string;
  customer_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  customer_type: string;
  total_orders: number;
  total_spend: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  customer_code: string;
  customer_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  customer_type?: string;
  total_orders?: number;
  total_spend?: number;
  status?: string;
}

export interface CustomerUpdate {
  customer_code?: string;
  customer_name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  customer_type?: string;
  total_orders?: number;
  total_spend?: number;
  status?: string;
}

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await api.get("/sales/customers");
    return response.data;
  },

  async getCustomer(id: number): Promise<Customer> {
    const response = await api.get(`/sales/customers/${id}`);
    return response.data;
  },

  async createCustomer(
    customer: CustomerCreate
  ): Promise<Customer> {
    const response = await api.post(
      "/sales/customers",
      customer
    );

    return response.data;
  },

  async updateCustomer(
    id: number,
    customer: CustomerUpdate
  ): Promise<Customer> {
    const response = await api.put(
      `/sales/customers/${id}`,
      customer
    );

    return response.data;
  },

  async deleteCustomer(id: number): Promise<void> {
    await api.delete(`/sales/customers/${id}`);
  },
};