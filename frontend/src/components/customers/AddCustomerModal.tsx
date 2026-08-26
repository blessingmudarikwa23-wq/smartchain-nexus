import { useState } from "react";

import type { CustomerCreate } from "../../services/customerService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerCreate) => Promise<void>;
};

const initialForm: CustomerCreate = {
  customer_code: "",
  customer_name: "",
  email: "",
  phone: "",
  address: "",
  customer_type: "Retail",
  total_orders: 0,
  total_spend: 0,
  status: "Active",
};

export default function AddCustomerModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<CustomerCreate>(initialForm);
  const [saving, setSaving] = useState(false);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "total_orders" || name === "total_spend"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (!form.customer_code.trim()) {
      alert("Please enter a customer code.");
      return;
    }

    if (!form.customer_name.trim()) {
      alert("Please enter a customer name.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        ...form,
        customer_code: form.customer_code.trim(),
        customer_name: form.customer_name.trim(),
        email: form.email?.trim() || null,
        phone: form.phone?.trim() || null,
        address: form.address?.trim() || null,
      });

      setForm(initialForm);
      onClose();
    } catch (error) {
      console.error("Failed to save customer:", error);
      alert("Failed to save customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Header */}
        <div style={header}>
          <div style={headerIcon}>👥</div>

          <div>
            <h2 style={title}>Add Customer</h2>

            <p style={subtitle}>
              Create a new customer record
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={formGrid}>
          <div>
            <label style={label}>
              Customer Code
            </label>

            <input
              name="customer_code"
              placeholder="CUS-001"
              value={form.customer_code}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div>
            <label style={label}>
              Customer Name
            </label>

            <input
              name="customer_name"
              placeholder="Customer name"
              value={form.customer_name}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div>
            <label style={label}>
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="customer@example.com"
              value={form.email ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div>
            <label style={label}>
              Phone
            </label>

            <input
              name="phone"
              placeholder="+27 00 000 0000"
              value={form.phone ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div style={fullWidth}>
            <label style={label}>
              Address
            </label>

            <input
              name="address"
              placeholder="Customer address"
              value={form.address ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div>
            <label style={label}>
              Customer Type
            </label>

            <select
              name="customer_type"
              value={form.customer_type}
              onChange={handleChange}
              style={input}
            >
              <option value="Retail">
                Retail
              </option>

              <option value="Wholesale">
                Wholesale
              </option>

              <option value="Corporate">
                Corporate
              </option>

              <option value="Distributor">
                Distributor
              </option>
            </select>
          </div>

          <div>
            <label style={label}>
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={input}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={footer}>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={saveButton}
          >
            {saving ? "Saving..." : "Save Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  padding: "20px",
};

const modal: React.CSSProperties = {
  width: "620px",
  maxWidth: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#ffffff",
  borderRadius: "18px",
  boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
  border: "1px solid #E2E8F0",
  padding: "30px",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  paddingBottom: "22px",
  marginBottom: "24px",
  borderBottom: "1px solid #E2E8F0",
};

const headerIcon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  background: "#E8F0FE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

const title: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "24px",
  fontWeight: 700,
};

const subtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "14px",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

const fullWidth: React.CSSProperties = {
  gridColumn: "1 / -1",
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  color: "#334155",
  fontSize: "14px",
  fontWeight: 600,
};

const input: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 13px",
  borderRadius: "9px",
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "28px",
  paddingTop: "20px",
  borderTop: "1px solid #E2E8F0",
};

const cancelButton: React.CSSProperties = {
  height: "42px",
  padding: "0 18px",
  borderRadius: "9px",
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#334155",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const saveButton: React.CSSProperties = {
  height: "42px",
  padding: "0 20px",
  borderRadius: "9px",
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
};