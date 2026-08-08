type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function DeleteSupplierDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  const handleDelete = () => {
    onConfirm?.();
    onClose();
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
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2>🗑 Delete Supplier</h2>

        <p
          style={{
            marginTop: "20px",
            color: "#6b7280",
            lineHeight: "1.6",
          }}
        >
          Are you sure you want to delete this supplier?
          <br />
          This action cannot be undone.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            style={deleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const cancelButton: React.CSSProperties = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  background: "#DC2626",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};