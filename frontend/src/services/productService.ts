import api from "./api";

export interface Product {
  id: number;
  product_name: string;
  sku: string;
  category: string;
  unit_price: number;
  quantity_in_stock: number;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get("/products/");
    return response.data;
  },

  async createProduct(product: Omit<Product, "id">) {
    const response = await api.post("/products/", product);
    return response.data;
  },

  async updateProduct(id: number, product: Omit<Product, "id">) {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: number) {
    await api.delete(`/products/${id}`);
  },
};