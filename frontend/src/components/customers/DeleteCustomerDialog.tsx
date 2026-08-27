import { useState } from "react";
import type { CSSProperties } from "react";

import {
  customerService,
  type Customer,
} from "../../services/customerService";

type Props = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onDeleted?: () => Promise<void>;
};

export default function DeleteCustomerDialog({
  open,
  customer,
  onClose,
  onDeleted,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  if (!open || !customer) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await customerService.deleteCustomer(customer.id);

      if (onDeleted) {
        await onDeleted();
      }

      onClose();
    } catch (error) {
      console.error(
        "Failed to delete customer:",
        error
      );

      alert("Failed to delete customer.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={iconWrapper}>
          🗑️
        </div>

        <h2 style={title}>
          Delete Customer
        </h2>

        <p style={message}>
          Are you sure you want to delete{" "}
          <strong>{customer.customer_name}</strong>?
        </p>

        <p style={warning}>
          This action cannot be undone.
        </p>

        <div style={actions}>
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
            style={deleteButton}
          >
            {deleting
              ? "Deleting..."
              : "Delete Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: CSSProperties = {
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

const modal: CSSProperties = {
  width: "430px",
  maxWidth: "100%",
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "30px",
  textAlign: "center",
  boxSizing: "border-box",
  boxShadow: "0 25px 70px rgba(15, 23, 42, 0.25)",
};

const iconWrapper: CSSProperties = {
  width: "58px",
  height: "58px",
  margin: "0 auto 16px",
  borderRadius: "50%",
  background: "#FEE2E2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
};

const title: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "22px",
  fontWeight: 800,
};

const message: CSSProperties = {
  margin: "14px 0 5px",
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.6,
};

const warning: CSSProperties = {
  margin: "5px 0 0",
  color: "#DC2626",
  fontSize: "12px",
  fontWeight: 600,
};

const actions: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "26px",
};

const cancelButton: CSSProperties = {
  border: "1px solid #D9E1EC",
  background: "#FFFFFF",
  color: "#475569",
  padding: "11px 18px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 600,
};

const deleteButton: CSSProperties = {
  border: "none",
  background: "#DC2626",
  color: "#FFFFFF",
  padding: "11px 18px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 700,
};