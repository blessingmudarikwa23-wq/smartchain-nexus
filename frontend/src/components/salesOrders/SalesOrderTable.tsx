import type { SalesOrder } from "../../services/salesOrderService";

type SalesOrderTableProps = {
  orders: SalesOrder[];
  onEdit: (order: SalesOrder) => void;
  onDelete: (order: SalesOrder) => void;
};

export default function SalesOrderTable({
  orders,
  onEdit,
  onDelete,
}: SalesOrderTableProps) {
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
      <h3 style={{ marginBottom: "20px" }}>
        Sales Orders
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={header}>Order ID</th>
            <th style={header}>Customer ID</th>
            <th style={header}>Order Date</th>
            <th style={header}>Delivery Date</th>
            <th style={header}>Status</th>
            <th style={header}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No sales orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td style={cell}>{order.id}</td>

                <td style={cell}>{order.customer_id}</td>

                <td style={cell}>{order.order_date}</td>

                <td style={cell}>{order.delivery_date}</td>

                <td style={cell}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "13px",
                      background:
                        order.status === "Delivered"
                          ? "#dcfce7"
                          : order.status === "Pending"
                          ? "#fef3c7"
                          : "#dbeafe",
                      color:
                        order.status === "Delivered"
                          ? "#166534"
                          : order.status === "Pending"
                          ? "#92400e"
                          : "#1d4ed8",
                    }}
                  >
                    {order.status}
                  </span>
                </td>

                <td style={cell}>
                  <button
                    onClick={() => onEdit(order)}
                    style={editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(order)}
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
  borderBottom: "1px solid #e5e7eb",
};

const editButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  marginRight: "10px",
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  background: "#DC2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
};