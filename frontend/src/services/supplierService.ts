import api from "./api";

export interface Supplier {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export const supplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    const response = await api.get("/suppliers/");
    return response.data;
  },

  async createSupplier(
    supplier: Omit<Supplier, "id">
  ): Promise<Supplier> {
    const response = await api.post("/suppliers/", supplier);
    return response.data;
  },

  async updateSupplier(
    id: number,
    supplier: Omit<Supplier, "id">
  ): Promise<Supplier> {
    const response = await api.put(`/suppliers/${id}`, supplier);
    return response.data;
  },

  async deleteSupplier(id: number): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  },
};