type Props = {
  open: boolean;
  inventoryId: number | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteInventoryDialog({
  open,
  inventoryId,
  onClose,
  onConfirm,
}: Props) {
  if (!open || inventoryId === null) return null;

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
        <h2
          style={{
            color: "#DC2626",
            marginBottom: "20px",
          }}
        >
          🗑 Delete Inventory
        </h2>

        <p
          style={{
            marginBottom: "30px",
            fontSize: "16px",
            color: "#374151",
          }}
        >
          Are you sure you want to delete inventory record{" "}
          <strong>#{inventoryId}</strong>?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#E5E7EB",
              color: "#111827",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
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