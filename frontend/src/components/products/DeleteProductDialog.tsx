import {
  productService,
  type Product,
} from "../../services/productService";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteProductDialog({
  open,
  product,
  onClose,
  onSuccess,
}: Props) {
  if (!open || !product) return null;

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(product.id);

      alert("✅ Product deleted successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete product.");
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
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2 style={{ color: "#dc2626" }}>
          🗑 Delete Product
        </h2>

        <p style={{ marginTop: "20px" }}>
          Are you sure you want to delete:
        </p>

        <h3>{product.product_name}</h3>

        <p>
          <strong>SKU:</strong> {product.sku}
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
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};