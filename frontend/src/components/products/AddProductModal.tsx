import { useState } from "react";
import { productService } from "../../services/productService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddProductModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    product_name: "",
    sku: "",
    category: "",
    unit_price: 0,
    quantity_in_stock: 0,
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "unit_price" || name === "quantity_in_stock"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await productService.createProduct(form);

      alert("✅ Product added successfully!");

      setForm({
        product_name: "",
        sku: "",
        category: "",
        unit_price: 0,
        quantity_in_stock: 0,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create product.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2>Add Product</h2>

        <input
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
          placeholder="Product Name"
          style={input}
        />

        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          style={input}
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          style={input}
        />

        <input
          name="unit_price"
          type="number"
          value={form.unit_price}
          onChange={handleChange}
          placeholder="Price"
          style={input}
        />

        <input
          name="quantity_in_stock"
          type="number"
          value={form.quantity_in_stock}
          onChange={handleChange}
          placeholder="Quantity"
          style={input}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            style={saveButton}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
};

const cancelButton: React.CSSProperties = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const saveButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};