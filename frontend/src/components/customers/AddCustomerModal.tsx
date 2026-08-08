import { useState } from "react";

type CustomerData = {
  customer_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerData) => Promise<void>;
};

export default function AddCustomerModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<CustomerData>({
    customer_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

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

  const handleSave = async () => {
    try {
      await onSave(form);

      setForm({
        customer_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save customer.");
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
        <h2>👥 Add Customer</h2>

        <input
          name="customer_name"
          placeholder="Customer Name"
          value={form.customer_name}
          onChange={handleChange}
          style={input}
        />

        <input
          name="contact_person"
          placeholder="Contact Person"
          value={form.contact_person}
          onChange={handleChange}
          style={input}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={input}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={input}
        />

        <input
          name="address"
          placeholder="Address"
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
            onClick={handleSave}
            style={saveButton}
          >
            Save Customer
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