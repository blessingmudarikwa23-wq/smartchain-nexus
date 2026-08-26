import { useEffect, useState } from "react";

import {
  customerService,
  type Customer,
  type CustomerUpdate,
} from "../../services/customerService";

type Props = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onUpdated?: () => Promise<void>;
};

export default function EditCustomerModal({
  open,
  customer,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<CustomerUpdate>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        customer_code: customer.customer_code,
        customer_name: customer.customer_name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        customer_type: customer.customer_type,
        total_orders: customer.total_orders,
        total_spend: customer.total_spend,
        status: customer.status,
      });
    }
  }, [customer]);

  if (!open || !customer) {
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
        name === "total_orders"
          ? Number(value)
          : name === "total_spend"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (!form.customer_code?.trim()) {
      alert("Customer code is required.");
      return;
    }

    if (!form.customer_name?.trim()) {
      alert("Customer name is required.");
      return;
    }

    try {
      setSaving(true);

      await customerService.updateCustomer(
        customer.id,
        form
      );

      if (onUpdated) {
        await onUpdated();
      }

      onClose();
    } catch (error) {
      console.error(
        "Failed to update customer:",
        error
      );

      alert("Failed to update customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <div>
            <h2 style={title}>✏️ Edit Customer</h2>

            <p style={subtitle}>
              Update customer information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={closeButton}
          >
            ×
          </button>
        </div>

        <div style={formGrid}>
          <div style={field}>
            <label style={label}>
              Customer Code
            </label>

            <input
              name="customer_code"
              value={form.customer_code ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div style={field}>
            <label style={label}>
              Customer Name
            </label>

            <input
              name="customer_name"
              value={form.customer_name ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div style={field}>
            <label style={label}>
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div style={field}>
            <label style={label}>
              Phone
            </label>

            <input
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div style={fieldFull}>
            <label style={label}>
              Address
            </label>

            <input
              name="address"
              value={form.address ?? ""}
              onChange={handleChange}
              style={input}
            />
          </div>

          <div style={field}>
            <label style={label}>
              Customer Type
            </label>

            <select
              name="customer_type"
              value={form.customer_type ?? "Regular"}
              onChange={handleChange}
              style={input}
            >
              <option value="Regular">
                Regular
              </option>

              <option value="VIP">
                VIP
              </option>

              <option value="Wholesale">
                Wholesale
              </option>

              <option value="Corporate">
                Corporate
              </option>
            </select>
          </div>

          <div style={field}>
            <label style={label}>
              Status
            </label>

            <select
              name="status"
              value={form.status ?? "Active"}
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

        <div style={actions}>
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.48)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

const modal: React.CSSProperties = {
  width: "560px",
  maxWidth: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "28px",
  boxSizing: "border-box",
  boxShadow: "0 25px 70px rgba(15, 23, 42, 0.25)",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: "24px",
};

const title: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "23px",
  fontWeight: 800,
};

const subtitle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const closeButton: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "none",
  borderRadius: "9px",
  background: "#F1F5F9",
  color: "#64748B",
  fontSize: "24px",
  cursor: "pointer",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const fieldFull: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gridColumn: "1 / -1",
};

const label: React.CSSProperties = {
  marginBottom: "7px",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 12px",
  border: "1px solid #D9E1EC",
  borderRadius: "9px",
  boxSizing: "border-box",
  outline: "none",
  color: "#0F172A",
  background: "#FFFFFF",
  fontSize: "13px",
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "26px",
  paddingTop: "20px",
  borderTop: "1px solid #EEF2F7",
};

const cancelButton: React.CSSProperties = {
  border: "1px solid #D9E1EC",
  background: "#FFFFFF",
  color: "#475569",
  padding: "11px 18px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 600,
};

const saveButton: React.CSSProperties = {
  border: "none",
  background: "linear-gradient(135deg, #2563EB, #315FEA)",
  color: "#FFFFFF",
  padding: "11px 20px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.22)",
};