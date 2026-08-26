import { useState } from "react";

import type { Supplier } from "../../services/supplierService";

type Props = {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

export default function DeleteSupplierDialog({
  open,
  supplier,
  onClose,
  onDelete,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  if (!open || !supplier) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await onDelete();
    } catch (error) {
      console.error(
        "Failed to delete supplier:",
        error
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={dialog}>
        <div style={warningIcon}>🗑️</div>

        <h2 style={title}>
          Delete Supplier?
        </h2>

        <p style={message}>
          Are you sure you want to delete
          <strong>
            {" "}
            {supplier.company_name}
          </strong>
          ?
        </p>

        <p style={warning}>
          This action cannot be undone.
        </p>

        <div style={footer}>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              ...deleteButton,
              opacity: deleting ? 0.7 : 1,
              cursor: deleting
                ? "not-allowed"
                : "pointer",
            }}
          >
            {deleting
              ? "Deleting..."
              : "Delete Supplier"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.55)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 9999,
};

const dialog: React.CSSProperties = {
  width: "430px",
  maxWidth: "100%",
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "30px",
  textAlign: "center",
  boxShadow:
    "0 25px 70px rgba(15,23,42,.25)",
};

const warningIcon: React.CSSProperties = {
  width: "58px",
  height: "58px",
  margin: "0 auto 16px",
  borderRadius: "50%",
  background: "#FEF2F2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
};

const title: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: 800,
};

const message: React.CSSProperties = {
  margin: "14px 0 6px",
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.6,
};

const warning: React.CSSProperties = {
  margin: 0,
  color: "#DC2626",
  fontSize: "12px",
};

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "25px",
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

const deleteButton: React.CSSProperties = {
  border: "none",
  background: "#DC2626",
  color: "#FFFFFF",
  padding: "11px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
};