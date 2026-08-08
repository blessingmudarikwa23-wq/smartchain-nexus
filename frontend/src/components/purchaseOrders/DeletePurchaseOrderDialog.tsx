import type { PurchaseOrder } from "../../services/purchaseOrderService";

type Props = {
  open: boolean;
  order: PurchaseOrder | null;
  onClose: () => void;
};

export default function DeletePurchaseOrderDialog({
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
          width: "460px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2 style={{ color: "#DC2626" }}>
          🗑 Delete Purchase Order
        </h2>

        <p style={{ marginTop: "20px" }}>
          Are you sure you want to delete
          Purchase Order
          <strong> #{order.id}</strong>?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            style={{
              background: "#DC2626",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}