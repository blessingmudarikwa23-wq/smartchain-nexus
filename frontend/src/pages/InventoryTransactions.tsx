export default function InventoryTransactions() {
  const transactions = [
    {
      id: "TXN-001",
      product: "Laptop Dell XPS 15",
      type: "Stock In",
      quantity: 50,
      date: "2026-07-31",
    },
    {
      id: "TXN-002",
      product: "Wireless Mouse",
      type: "Stock Out",
      quantity: 22,
      date: "2026-07-30",
    },
    {
      id: "TXN-003",
      product: "Mechanical Keyboard",
      type: "Adjustment",
      quantity: 8,
      date: "2026-07-29",
    },
    {
      id: "TXN-004",
      product: "27-inch Monitor",
      type: "Stock In",
      quantity: 35,
      date: "2026-07-28",
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: "30px",
        }}
      >
        Inventory Transactions
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <thead
          style={{
            background: "#1E293B",
            color: "#fff",
          }}
        >
          <tr>
            <th style={{ padding: "15px" }}>Transaction ID</th>
            <th>Product</th>
            <th>Transaction Type</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}