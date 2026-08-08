type PurchaseOrder = {
  supplier: string;
  reference: string;
  status: string;
};

const orders: PurchaseOrder[] = [
  {
    supplier: "Dell Technologies",
    reference: "PO-1001",
    status: "Pending",
  },
  {
    supplier: "HP South Africa",
    reference: "PO-1002",
    status: "Approved",
  },
  {
    supplier: "Lenovo",
    reference: "PO-1003",
    status: "Delivered",
  },
];

export default function RecentPurchaseOrders() {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>
        📋 Recent Purchase Orders
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Supplier</th>
            <th align="left">Reference</th>
            <th align="right">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.reference}>
              <td style={{ padding: "12px 0" }}>
                {order.supplier}
              </td>

              <td>{order.reference}</td>

              <td
                align="right"
                style={{
                  fontWeight: "bold",
                  color:
                    order.status === "Delivered"
                      ? "#10b981"
                      : order.status === "Approved"
                      ? "#2563eb"
                      : "#f59e0b",
                }}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}