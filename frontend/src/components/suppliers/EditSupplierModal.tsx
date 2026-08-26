import { useEffect, useState } from "react";

import type {
  Supplier,
  SupplierUpdate,
} from "../../services/supplierService";

type Props = {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onUpdate: (
    id: number,
    data: SupplierUpdate
  ) => Promise<void>;
};

type EditForm = {
  supplier_code: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  tax_number: string;
  payment_terms: string;
};

const emptyForm: EditForm = {
  supplier_code: "",
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  tax_number: "",
  payment_terms: "",
};

export default function EditSupplierModal({
  open,
  supplier,
  onClose,
  onUpdate,
}: Props) {
  const [form, setForm] =
    useState<EditForm>(emptyForm);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (supplier) {
      setForm({
        supplier_code: supplier.supplier_code,
        company_name: supplier.company_name,
        contact_person: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        city: supplier.city,
        country: supplier.country,
        tax_number: supplier.tax_number ?? "",
        payment_terms:
          supplier.payment_terms ?? "",
      });
    }
  }, [supplier]);

  if (!open || !supplier) {
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

  const handleUpdate = async () => {
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
      alert("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);

      await onUpdate(supplier.id, {
        supplier_code: form.supplier_code.trim(),
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        tax_number: form.tax_number.trim() || undefined,
        payment_terms:
          form.payment_terms.trim() || undefined,
      });
    } catch (error) {
      console.error(
        "Failed to update supplier:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalHeader}>
          <div style={modalIcon}>✏️</div>

          <div>
            <h2 style={modalTitle}>
              Edit Supplier
            </h2>

            <p style={modalSubtitle}>
              Update supplier information
            </p>
          </div>
        </div>

        <div style={formGrid}>
          <input
            name="supplier_code"
            placeholder="Supplier Code"
            value={form.supplier_code}
            onChange={handleChange}
            style={input}
          />

          <input
            name="company_name"
            placeholder="Company Name"
            value={form.company_name}
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
            type="email"
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
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            style={input}
          />

          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            style={input}
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            style={fullInput}
          />

          <input
            name="tax_number"
            placeholder="Tax Number"
            value={form.tax_number}
            onChange={handleChange}
            style={input}
          />

          <input
            name="payment_terms"
            placeholder="Payment Terms"
            value={form.payment_terms}
            onChange={handleChange}
            style={input}
          />
        </div>

        <div style={modalFooter}>
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
            onClick={handleUpdate}
            disabled={saving}
            style={{
              ...updateButton,
              opacity: saving ? 0.7 : 1,
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {saving
              ? "Updating..."
              : "Update Supplier"}
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
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  width: "620px",
  maxWidth: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "28px",
  boxShadow:
    "0 25px 70px rgba(15,23,42,.25)",
};

const modalHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "25px",
};

const modalIcon: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "12px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
};

const modalTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "22px",
  fontWeight: 800,
};

const modalSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "14px",
};

const input: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 13px",
  borderRadius: "10px",
  border: "1px solid #DCE3ED",
  outline: "none",
  boxSizing: "border-box",
  fontSize: "13px",
  color: "#0F172A",
};

const fullInput: React.CSSProperties = {
  ...input,
  gridColumn: "1 / -1",
};

const modalFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "25px",
  paddingTop: "20px",
  borderTop: "1px solid #EEF1F5",
};

const cancelButton: React.CSSProperties = {
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#475569",
  padding: "11px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
};

const updateButton: React.CSSProperties = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563EB, #315FEA)",
  color: "#FFFFFF",
  padding: "11px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow:
    "0 6px 16px rgba(37,99,235,.2)",
};