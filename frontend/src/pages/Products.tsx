import { useEffect, useState } from "react";

import ProductTable from "../components/products/ProductTable";
import AddProductModal from "../components/products/AddProductModal";
import EditProductModal from "../components/products/EditProductModal";
import DeleteProductDialog from "../components/products/DeleteProductDialog";

import { productService } from "../services/productService";
import type { Product } from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  return (
    <>
      <h1>📦 Products</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          style={{
            width: "320px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          onClick={() => setOpenAdd(true)}
          style={{
            background: "#2563EB",
            color: "#ffffff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={(product) => {
          setSelectedProduct(product);
          setOpenEdit(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
          setOpenDelete(true);
        }}
      />

      <AddProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={loadProducts}
      />

      <EditProductModal
        open={openEdit}
        product={selectedProduct}
        onClose={() => {
          setOpenEdit(false);
          setSelectedProduct(null);
        }}
        onSuccess={loadProducts}
      />

      <DeleteProductDialog
        open={openDelete}
        product={selectedProduct}
        onClose={() => {
          setOpenDelete(false);
          setSelectedProduct(null);
        }}
        onSuccess={loadProducts}
      />
    </>
  );
}