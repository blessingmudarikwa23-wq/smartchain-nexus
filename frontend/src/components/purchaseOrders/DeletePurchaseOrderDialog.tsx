import type { PurchaseOrder } from "../../services/purchaseOrderService";

type Props = {
  open: boolean;
  order: PurchaseOrder | null;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

export default function DeletePurchaseOrderDialog({
  open,
  order,
  onClose,
  onDelete,
}: Props) {
  if (!open || !order) return null;

  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      console.error(error);
    }
  };

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
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "460px",
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2
          style={{
            color: "#DC2626",
            marginTop: 0,
            marginBottom: "15px",
          }}
        >
          🗑 Delete Purchase Order
        </h2>

        <p
          style={{
            color: "#334155",
            lineHeight: "1.6",
            marginBottom: "25px",
          }}
        >
          Are you sure you want to delete purchase order{" "}
          <strong>{order.po_number}</strong>?
        </p>

        <div
          style={{
            background: "#F8FAFC",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
          }}
        >
          <div>
            <strong>Supplier ID:</strong>{" "}
            {order.supplier_id}
          </div>

          <div style={{ marginTop: "8px" }}>
            <strong>Amount:</strong>{" "}
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: order.currency || "ZAR",
            }).format(order.total_amount)}
          </div>

          <div style={{ marginTop: "8px" }}>
            <strong>Status:</strong>{" "}
            {order.status}
          </div>
        </div>

        <p
          style={{
            color: "#DC2626",
            fontSize: "14px",
            marginBottom: "25px",
          }}
        >
          This action cannot be undone.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={deleteButton}
          >
            Delete Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}

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