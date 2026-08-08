import api from "./api";

export interface Customer {
  id: number;
  customer_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await api.get("/customers/");
    return response.data;
  },

  async createCustomer(
    customer: Omit<Customer, "id">
  ): Promise<Customer> {
    const response = await api.post("/customers/", customer);
    return response.data;
  },

  async updateCustomer(
    id: number,
    customer: Omit<Customer, "id">
  ): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },

  async deleteCustomer(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};