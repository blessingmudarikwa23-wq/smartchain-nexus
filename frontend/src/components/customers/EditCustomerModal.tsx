import type { Customer } from "../../services/customerService";

type Props = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
};

export default function EditCustomerModal({
  open,
  customer,
  onClose,
}: Props) {
  if (!open || !customer) return null;

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
          width: "500px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2>✏️ Edit Customer</h2>

        <p style={{ marginTop: "20px" }}>
          Customer:
          <strong> {customer.customer_name}</strong>
        </p>

        <p>
          Contact Person:
          <strong> {customer.contact_person}</strong>
        </p>

        <p>
          Email:
          <strong> {customer.email}</strong>
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#2563EB",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}