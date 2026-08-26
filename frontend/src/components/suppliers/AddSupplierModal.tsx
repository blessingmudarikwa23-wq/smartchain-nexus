import { useState } from "react";

import type { SupplierCreate } from "../../services/supplierService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: SupplierCreate) => Promise<void>;
};

const emptyForm: SupplierCreate = {
  supplier_code: "",
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "South Africa",
  tax_number: "",
  payment_terms: "",
};

export default function AddSupplierModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] =
    useState<SupplierCreate>(emptyForm);

  const [saving, setSaving] = useState(false);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.supplier_code.trim() ||
      !form.company_name.trim() ||
      !form.contact_person.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.country.trim()
    ) {
      alert(
        "Please complete all required supplier fields."
      );
      return;
    }

    try {
      setSaving(true);

      await onSave({
        supplier_code: form.supplier_code.trim(),
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        tax_number: form.tax_number?.trim() || "",
        payment_terms:
          form.payment_terms?.trim() || "",
      });

      setForm({ ...emptyForm });

      onClose();
    } catch (error) {
      console.error(
        "Failed to save supplier:",
        error
      );

      alert(
        "Failed to save supplier. Please check the server and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <div style={icon}>🏢</div>

          <div style={headerText}>
            <h2 style={title}>Add Supplier</h2>

            <p style={subtitle}>
              Add a new supplier to your procurement
              network
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

        <form onSubmit={handleSave}>
          <div style={formGrid}>
            <div style={field}>
              <label style={label}>
                Supplier Code *
              </label>

              <input
                name="supplier_code"
                value={form.supplier_code}
                onChange={handleChange}
                placeholder="e.g. SUP-001"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>
                Company Name *
              </label>

              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Enter company name"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>
                Contact Person *
              </label>

              <input
                name="contact_person"
                value={form.contact_person}
                onChange={handleChange}
                placeholder="Enter contact person"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>Email *</label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="supplier@example.com"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>Phone *</label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+27 XX XXX XXXX"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>City *</label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={fullField}>
              <label style={label}>
                Address *
              </label>

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter supplier address"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>
                Country *
              </label>

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter country"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={field}>
              <label style={label}>
                Tax Number
              </label>

              <input
                name="tax_number"
                value={form.tax_number ?? ""}
                onChange={handleChange}
                placeholder="Optional"
                style={input}
                disabled={saving}
              />
            </div>

            <div style={fullField}>
              <label style={label}>
                Payment Terms
              </label>

              <input
                name="payment_terms"
                value={form.payment_terms ?? ""}
                onChange={handleChange}
                placeholder="e.g. 30 Days, 60 Days"
                style={input}
                disabled={saving}
              />
            </div>
          </div>

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
              type="submit"
              disabled={saving}
              style={{
                ...saveButton,
                opacity: saving ? 0.7 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : "Save Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  width: "100%",
  maxWidth: "720px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "20px",
  boxShadow:
    "0 25px 70px rgba(15, 23, 42, 0.25)",
  border: "1px solid #E5EAF1",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "24px 26px",
  borderBottom: "1px solid #EEF2F7",
};

const icon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
};

const headerText: React.CSSProperties = {
  flex: 1,
};

const title: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: 800,
};

const subtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const closeButton: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: "none",
  background: "#F1F5F9",
  color: "#64748B",
  fontSize: "24px",
  cursor: "pointer",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
  padding: "24px 26px",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

const fullField: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  gridColumn: "1 / -1",
};

const label: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#334155",
};

const input: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 13px",
  borderRadius: "10px",
  border: "1px solid #D8E0EA",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  padding: "18px 26px",
  borderTop: "1px solid #EEF2F7",
  background: "#FAFBFD",
  borderRadius: "0 0 20px 20px",
};

const cancelButton: React.CSSProperties = {
  border: "1px solid #D8E0EA",
  background: "#FFFFFF",
  color: "#334155",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "13px",
};

const saveButton: React.CSSProperties = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563EB 0%, #315FEA 100%)",
  color: "#FFFFFF",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "13px",
};