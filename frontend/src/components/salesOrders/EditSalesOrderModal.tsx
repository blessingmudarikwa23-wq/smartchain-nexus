import type { SalesOrder } from "../../services/salesOrderService";

type Props = {
  open: boolean;
  order: SalesOrder | null;
  onClose: () => void;
};

export default function EditSalesOrderModal({
  open,
  order,
  onClose,
}: Props) {
  if (!open || !order) return null;

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
        <h2>✏️ Edit Sales Order</h2>

        <p style={{ marginTop: "20px" }}>
          Sales Order:
          <strong> #{order.id}</strong>
        </p>

        <p>
          Customer ID:
          <strong> {order.customer_id}</strong>
        </p>

        <p>
          Status:
          <strong> {order.status}</strong>
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