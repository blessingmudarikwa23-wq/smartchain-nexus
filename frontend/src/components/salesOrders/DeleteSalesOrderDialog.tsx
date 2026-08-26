import type { SalesOrder } from "../../services/salesOrderService";

type Props = {
  open: boolean;
  order: SalesOrder | null;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
};

export default function DeleteSalesOrderDialog({
  open,
  order,
  onClose,
  onDelete,
}: Props) {
  if (!open || !order) {
    return null;
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2
          style={{
            color: "#DC2626",
            marginTop: 0,
          }}
        >
          🗑 Delete Sales Order
        </h2>

        <p
          style={{
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to delete sales
          order{" "}
          <strong>{order.order_number}</strong>?
        </p>

        <p
          style={{
            color: "#64748B",
          }}
        >
          Customer:{" "}
          <strong>{order.customer_code}</strong>
          <br />
          Product:{" "}
          <strong>{order.product}</strong>
        </p>

        <div style={actions}>
          <button
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(order.id)}
            style={deleteButton}
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  padding: "20px",
};

const modal: React.CSSProperties = {
  width: "460px",
  maxWidth: "100%",
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 20px 50px rgba(0,0,0,.25)",
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "30px",
};

const cancelButton: React.CSSProperties = {
  background: "#E5E7EB",
  color: "#111827",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};