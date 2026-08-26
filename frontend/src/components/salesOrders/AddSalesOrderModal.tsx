import { useState } from "react";

import type {
  SalesOrderCreate,
} from "../../services/salesOrderService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: SalesOrderCreate) => Promise<void>;
};

const initialForm: SalesOrderCreate = {
  order_number: "",
  customer_code: "",
  product: "",
  quantity: 1,
  unit_price: 0,
  order_status: "Pending",
  payment_status: "Pending",
};

export default function AddSalesOrderModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] =
    useState<SalesOrderCreate>(initialForm);

  const [saving, setSaving] = useState(false);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "quantity" ||
        name === "unit_price"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (!form.order_number.trim()) {
      alert("Please enter an order number.");
      return;
    }

    if (!form.customer_code.trim()) {
      alert("Please enter a customer code.");
      return;
    }

    if (!form.product.trim()) {
      alert("Please enter a product.");
      return;
    }

    if (form.quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    if (form.unit_price < 0) {
      alert("Unit price cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      await onSave(form);

      setForm(initialForm);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create sales order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2
          style={{
            marginTop: 0,
            color: "#0F172A",
          }}
        >
          🛒 Add Sales Order
        </h2>

        <label style={label}>
          Order Number
        </label>

        <input
          name="order_number"
          value={form.order_number}
          onChange={handleChange}
          placeholder="SO-1001"
          style={input}
        />

        <label style={label}>
          Customer Code
        </label>

        <input
          name="customer_code"
          value={form.customer_code}
          onChange={handleChange}
          placeholder="CUS-001"
          style={input}
        />

        <label style={label}>
          Product
        </label>

        <input
          name="product"
          value={form.product}
          onChange={handleChange}
          placeholder="Product name"
          style={input}
        />

        <label style={label}>
          Quantity
        </label>

        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Unit Price
        </label>

        <input
          name="unit_price"
          type="number"
          min="0"
          step="0.01"
          value={form.unit_price}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Order Status
        </label>

        <select
          name="order_status"
          value={form.order_status}
          onChange={handleChange}
          style={input}
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Processing">
            Processing
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <label style={label}>
          Payment Status
        </label>

        <select
          name="payment_status"
          value={form.payment_status}
          onChange={handleChange}
          style={input}
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Failed">
            Failed
          </option>

          <option value="Refunded">
            Refunded
          </option>
        </select>

        <div style={actions}>
          <button
            onClick={onClose}
            disabled={saving}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={saveButton}
          >
            {saving ? "Saving..." : "Save Sales Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  padding: "20px",
};

const modal: React.CSSProperties = {
  width: "520px",
  maxWidth: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 20px 50px rgba(0,0,0,.25)",
};

const label: React.CSSProperties = {
  display: "block",
  marginTop: "15px",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#374151",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  boxSizing: "border-box",
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "25px",
};

const cancelButton: React.CSSProperties = {
  background: "#E5E7EB",
  color: "#111827",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const saveButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};