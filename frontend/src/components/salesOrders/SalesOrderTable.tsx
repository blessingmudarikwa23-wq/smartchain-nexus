import type { SalesOrder } from "../../services/salesOrderService";

type Props = {
  orders: SalesOrder[];
  onEdit: (order: SalesOrder) => void;
  onDelete: (order: SalesOrder) => void;
};

export default function SalesOrderTable({
  orders,
  onEdit,
  onDelete,
}: Props) {
  const getOrderStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const value = status.toLowerCase();

    if (value === "completed") {
      return {
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (value === "processing") {
      return {
        background: "#DBEAFE",
        color: "#1D4ED8",
      };
    }

    if (value === "cancelled") {
      return {
        background: "#FEE2E2",
        color: "#991B1B",
      };
    }

    return {
      background: "#FEF3C7",
      color: "#92400E",
    };
  };

  const getPaymentStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const value = status.toLowerCase();

    if (value === "paid") {
      return {
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (value === "failed") {
      return {
        background: "#FEE2E2",
        color: "#991B1B",
      };
    }

    return {
      background: "#FEF3C7",
      color: "#92400E",
    };
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #E5E7EB",
        overflowX: "auto",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#0F172A",
        }}
      >
        Sales Orders
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "1100px",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#1E293B",
              color: "#FFFFFF",
            }}
          >
            <th style={header}>Order Number</th>
            <th style={header}>Customer</th>
            <th style={header}>Product</th>
            <th style={header}>Quantity</th>
            <th style={header}>Unit Price</th>
            <th style={header}>Total</th>
            <th style={header}>Order Status</th>
            <th style={header}>Payment</th>
            <th style={header}>Order Date</th>
            <th style={header}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#64748B",
                }}
              >
                No sales orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                style={{
                  borderBottom:
                    "1px solid #E5E7EB",
                }}
              >
                <td style={cellStrong}>
                  {order.order_number}
                </td>

                <td style={cell}>
                  {order.customer_code}
                </td>

                <td style={cell}>
                  {order.product}
                </td>

                <td style={cell}>
                  {order.quantity}
                </td>

                <td style={cell}>
                  R{" "}
                  {order.unit_price.toLocaleString(
                    "en-ZA",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </td>

                <td style={cellStrong}>
                  R{" "}
                  {order.total_amount.toLocaleString(
                    "en-ZA",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </td>

                <td style={cell}>
                  <span
                    style={{
                      ...getOrderStatusStyle(
                        order.order_status
                      ),
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "inline-block",
                    }}
                  >
                    {order.order_status}
                  </span>
                </td>

                <td style={cell}>
                  <span
                    style={{
                      ...getPaymentStatusStyle(
                        order.payment_status
                      ),
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "inline-block",
                    }}
                  >
                    {order.payment_status}
                  </span>
                </td>

                <td style={cell}>
                  {new Date(
                    order.order_date
                  ).toLocaleDateString("en-ZA")}
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
  padding: "14px",
  textAlign: "left",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const cell: React.CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #E5E7EB",
  color: "#334155",
  whiteSpace: "nowrap",
};

const cellStrong: React.CSSProperties = {
  ...cell,
  fontWeight: "700",
  color: "#0F172A",
};

const editButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "7px",
  padding: "7px 11px",
  marginRight: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const deleteButton: React.CSSProperties = {
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "7px",
  padding: "7px 11px",
  cursor: "pointer",
  fontWeight: "600",
};