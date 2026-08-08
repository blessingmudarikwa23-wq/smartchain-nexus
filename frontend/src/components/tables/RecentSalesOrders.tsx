type SalesOrder = {
  customer: string;
  reference: string;
  amount: string;
};

const salesOrders: SalesOrder[] = [
  {
    customer: "ABC Retail",
    reference: "SO-2001",
    amount: "$12,450",
  },
  {
    customer: "Tech Solutions",
    reference: "SO-2002",
    amount: "$8,920",
  },
  {
    customer: "Global Traders",
    reference: "SO-2003",
    amount: "$15,730",
  },
];

export default function RecentSalesOrders() {
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
        💰 Recent Sales Orders
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Customer</th>
            <th align="left">Reference</th>
            <th align="right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {salesOrders.map((order) => (
            <tr key={order.reference}>
              <td style={{ padding: "12px 0" }}>
                {order.customer}
              </td>

              <td>{order.reference}</td>

              <td
                align="right"
                style={{
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                {order.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}