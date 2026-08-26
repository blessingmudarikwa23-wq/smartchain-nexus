import api from "./api";

export interface Supplier {
  id: number;
  supplier_code: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  tax_number?: string | null;
  payment_terms?: string | null;
  status: boolean;
}

export interface SupplierCreate {
  supplier_code: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  tax_number?: string;
  payment_terms?: string;
}

export interface SupplierUpdate {
  supplier_code?: string;
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  tax_number?: string;
  payment_terms?: string;
  status?: boolean;
}

export const supplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    const response = await api.get("/procurement/suppliers");
    return response.data;
  },

  async getSupplier(id: number): Promise<Supplier> {
    const response = await api.get(`/procurement/suppliers/${id}`);
    return response.data;
  },

  async createSupplier(
    supplier: SupplierCreate
  ): Promise<Supplier> {
    const response = await api.post(
      "/procurement/suppliers",
      supplier
    );

    return response.data;
  },

  async updateSupplier(
    id: number,
    supplier: SupplierUpdate
  ): Promise<Supplier> {
    const response = await api.put(
      `/procurement/suppliers/${id}`,
      supplier
    );

    return response.data;
  },

  async deleteSupplier(id: number): Promise<void> {
    await api.delete(
      `/procurement/suppliers/${id}`
    );
  },
};