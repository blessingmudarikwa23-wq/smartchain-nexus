import { useState } from "react";

type PurchaseOrderData = {
  supplier_id: number;
  order_date: string;
  expected_delivery_date: string;
  status: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: PurchaseOrderData) => Promise<void>;
};

export default function AddPurchaseOrderModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<PurchaseOrderData>({
    supplier_id: 0,
    order_date: "",
    expected_delivery_date: "",
    status: "Pending",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "supplier_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(form);

      setForm({
        supplier_id: 0,
        order_date: "",
        expected_delivery_date: "",
        status: "Pending",
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save purchase order.");
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
          width: "520px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2>📦 Add Purchase Order</h2>

        <input
          name="supplier_id"
          type="number"
          placeholder="Supplier ID"
          value={form.supplier_id}
          onChange={handleChange}
          style={input}
        />

        <input
          name="order_date"
          type="date"
          value={form.order_date}
          onChange={handleChange}
          style={input}
        />

        <input
          name="expected_delivery_date"
          type="date"
          value={form.expected_delivery_date}
          onChange={handleChange}
          style={input}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={input}
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Delivered</option>
        </select>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={saveButton}
          >
            Save Purchase Order
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
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};