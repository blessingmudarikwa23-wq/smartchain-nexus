import { useEffect, useState } from "react";

import type {
  SalesOrder,
  SalesOrderUpdate,
} from "../../services/salesOrderService";

type Props = {
  open: boolean;
  order: SalesOrder | null;
  onClose: () => void;
  onSave: (
    id: number,
    data: SalesOrderUpdate
  ) => Promise<void>;
};

export default function EditSalesOrderModal({
  open,
  order,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] =
    useState<SalesOrderUpdate>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setForm({
        customer_code: order.customer_code,
        product: order.product,
        quantity: order.quantity,
        unit_price: order.unit_price,
        order_status: order.order_status,
        payment_status: order.payment_status,
      });
    }
  }, [order]);

  if (!open || !order) {
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
    try {
      setSaving(true);

      await onSave(order.id, form);
    } catch (error) {
      console.error(error);
      alert("Failed to update sales order.");
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
          ✏️ Edit Sales Order
        </h2>

        <p
          style={{
            color: "#64748B",
            marginBottom: "20px",
          }}
        >
          Order:{" "}
          <strong>{order.order_number}</strong>
        </p>

        <label style={label}>
          Customer Code
        </label>

        <input
          name="customer_code"
          value={form.customer_code ?? ""}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Product
        </label>

        <input
          name="product"
          value={form.product ?? ""}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Quantity
        </label>

        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity ?? 1}
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
          value={form.unit_price ?? 0}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Order Status
        </label>

        <select
          name="order_status"
          value={form.order_status ?? "Pending"}
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
          value={form.payment_status ?? "Pending"}
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
            {saving ? "Updating..." : "Update Order"}
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