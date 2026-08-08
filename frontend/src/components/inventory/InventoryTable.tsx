import type { Inventory } from "../../services/inventoryService";

type Props = {
  inventory?: Inventory[];

  onEdit: (inventory: Inventory) => void;

  onDelete: (id: number) => void;
};

export default function InventoryTable({
  inventory = [],
  onEdit,
  onDelete,
}: Props) {
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
      <h3
        style={{
          marginBottom: "20px",
        }}
      >
        Inventory List
      </h3>

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
            <th style={header}>Product ID</th>
            <th style={header}>Warehouse</th>
            <th style={header}>Current Stock</th>
            <th style={header}>Minimum</th>
            <th style={header}>Reorder</th>
            <th style={header}>Status</th>
            <th style={header}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No inventory records found.
              </td>
            </tr>
          ) : (
            inventory.map((item) => (
              <tr key={item.id}>
                <td style={cell}>{item.product_id}</td>

                <td style={cell}>{item.warehouse}</td>

                <td style={cell}>{item.quantity_in_stock}</td>

                <td style={cell}>{item.minimum_stock}</td>

                <td style={cell}>{item.reorder_level}</td>

                <td style={cell}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "13px",
                      background:
                        item.quantity_in_stock >
                        item.reorder_level
                          ? "#DCFCE7"
                          : item.quantity_in_stock >
                            item.minimum_stock
                          ? "#FEF3C7"
                          : "#FEE2E2",

                      color:
                        item.quantity_in_stock >
                        item.reorder_level
                          ? "#166534"
                          : item.quantity_in_stock >
                            item.minimum_stock
                          ? "#92400E"
                          : "#991B1B",
                    }}
                  >
                    {item.quantity_in_stock >
                    item.reorder_level
                      ? "Healthy"
                      : item.quantity_in_stock >
                        item.minimum_stock
                      ? "Low"
                      : "Critical"}
                  </span>
                </td>

                <td style={cell}>
                  <button
                    onClick={() => onEdit(item)}
                    style={editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    style={deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
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
  borderBottom: "1px solid #E5E7EB",
};

const editButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  marginRight: "10px",
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
};