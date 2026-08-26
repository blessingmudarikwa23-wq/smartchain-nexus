import { useEffect, useState } from "react";

import type {
  PurchaseOrder,
  PurchaseOrderUpdate,
} from "../../services/purchaseOrderService";

type Props = {
  open: boolean;
  order: PurchaseOrder | null;
  onClose: () => void;
  onUpdate: (
    id: number,
    data: PurchaseOrderUpdate
  ) => Promise<void>;
};

export default function EditPurchaseOrderModal({
  open,
  order,
  onClose,
  onUpdate,
}: Props) {
  const [form, setForm] = useState<PurchaseOrderUpdate>({
    supplier_id: 0,
    order_date: "",
    expected_delivery: "",
    status: "Pending",
    currency: "ZAR",
    total_amount: 0,
    notes: "",
  });

  useEffect(() => {
    if (order) {
      setForm({
        supplier_id: order.supplier_id,
        order_date: order.order_date,
        expected_delivery: order.expected_delivery,
        status: order.status,
        currency: order.currency || "ZAR",
        total_amount: order.total_amount,
        notes: order.notes || "",
      });
    }
  }, [order]);

  if (!open || !order) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "supplier_id" || name === "total_amount"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdate = async () => {
    if (!form.supplier_id || form.supplier_id <= 0) {
      alert("Please enter a valid Supplier ID.");
      return;
    }

    if (!form.order_date) {
      alert("Please select the order date.");
      return;
    }

    if (!form.expected_delivery) {
      alert("Please select the expected delivery date.");
      return;
    }

    if (
      form.total_amount !== undefined &&
      form.total_amount < 0
    ) {
      alert("Total amount cannot be negative.");
      return;
    }

    try {
      await onUpdate(order.id, form);
    } catch (error) {
      console.error(error);
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
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "560px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "10px",
            color: "#0F172A",
          }}
        >
          ✏️ Edit Purchase Order
        </h2>

        <p
          style={{
            color: "#64748B",
            marginBottom: "25px",
          }}
        >
          PO Number: <strong>{order.po_number}</strong>
        </p>

        <label style={label}>
          Supplier ID
        </label>

        <input
          name="supplier_id"
          type="number"
          min="1"
          value={form.supplier_id || ""}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Order Date
        </label>

        <input
          name="order_date"
          type="date"
          value={form.order_date || ""}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Expected Delivery
        </label>

        <input
          name="expected_delivery"
          type="date"
          value={form.expected_delivery || ""}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Status
        </label>

        <select
          name="status"
          value={form.status || "Pending"}
          onChange={handleChange}
          style={input}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Received">Received</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <label style={label}>
          Currency
        </label>

        <input
          name="currency"
          value="ZAR"
          readOnly
          style={{
            ...input,
            background: "#F8FAFC",
            color: "#475569",
            fontWeight: "600",
          }}
        />

        <label style={label}>
          Total Amount
        </label>

        <input
          name="total_amount"
          type="number"
          min="0"
          step="0.01"
          value={form.total_amount ?? 0}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>
          Notes
        </label>

        <textarea
          name="notes"
          value={form.notes || ""}
          onChange={handleChange}
          rows={4}
          style={textarea}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            style={updateButton}
          >
            Update Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  display: "block",
  marginTop: "15px",
  marginBottom: "6px",
  color: "#334155",
  fontWeight: "600",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  boxSizing: "border-box",
  fontSize: "15px",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  boxSizing: "border-box",
  fontSize: "15px",
  resize: "vertical",
};

const cancelButton: React.CSSProperties = {
  background: "#E5E7EB",
  color: "#111827",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const updateButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};