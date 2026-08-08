type Product = {
  id: number;
  product_name: string;
  sku: string;
  category: string;
  unit_price: number;
  quantity_in_stock: number;
};

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f8fafc",
            }}
          >
            <th style={header}>Product</th>
            <th style={header}>SKU</th>
            <th style={header}>Category</th>
            <th style={header}>Price</th>
            <th style={header}>Stock</th>
            <th style={header}>Status</th>
            <th style={header}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={cell}>{product.product_name}</td>

              <td style={cell}>{product.sku}</td>

              <td style={cell}>{product.category}</td>

              <td style={cell}>
                ${product.unit_price.toFixed(2)}
              </td>

              <td style={cell}>
                {product.quantity_in_stock}
              </td>

              <td style={cell}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "13px",
                    background:
                      product.quantity_in_stock > 20
                        ? "#dcfce7"
                        : product.quantity_in_stock > 10
                        ? "#fef3c7"
                        : "#fee2e2",
                    color:
                      product.quantity_in_stock > 20
                        ? "#166534"
                        : product.quantity_in_stock > 10
                        ? "#92400e"
                        : "#991b1b",
                  }}
                >
                  {product.quantity_in_stock > 20
                    ? "In Stock"
                    : product.quantity_in_stock > 10
                    ? "Low Stock"
                    : "Critical"}
                </span>
              </td>

              <td style={cell}>
                <button
                  onClick={() => onEdit(product)}
                  style={editButton}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(product)}
                  style={deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const header: React.CSSProperties = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#374151",
};

const cell: React.CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #e5e7eb",
};

const editButton: React.CSSProperties = {
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  marginRight: "10px",
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
};