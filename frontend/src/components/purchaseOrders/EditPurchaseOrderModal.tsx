import type { PurchaseOrder } from "../../services/purchaseOrderService";

type Props = {
  open: boolean;
  order: PurchaseOrder | null;
  onClose: () => void;
};

export default function EditPurchaseOrderModal({
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
        <h2>✏️ Edit Purchase Order</h2>

        <p style={{ marginTop: "20px" }}>
          Purchase Order ID:
          <strong> {order.id}</strong>
        </p>

        <p>
          Supplier ID:
          <strong> {order.supplier_id}</strong>
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