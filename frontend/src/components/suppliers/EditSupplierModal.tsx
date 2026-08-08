import { useEffect, useState } from "react";
import type { Supplier } from "../../services/supplierService";

type Props = {
  open: boolean;
  supplier?: Supplier | null;
  onClose: () => void;
  onUpdate?: (data: Supplier) => void;
};

export default function EditSupplierModal({
  open,
  supplier,
  onClose,
  onUpdate,
}: Props) {
  const [form, setForm] = useState<Supplier>({
    id: 0,
    supplier_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm(supplier);
    }
  }, [supplier]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdate?.(form);
    onClose();
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
        <h2>✏ Edit Supplier</h2>

        <input
          name="supplier_name"
          value={form.supplier_name}
          onChange={handleChange}
          style={input}
        />

        <input
          name="contact_person"
          value={form.contact_person}
          onChange={handleChange}
          style={input}
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          style={input}
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          style={input}
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          style={input}
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
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            style={updateButton}
          >
            Update Supplier
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

const updateButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};