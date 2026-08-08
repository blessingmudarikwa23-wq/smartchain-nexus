export default function InventoryAdjustments() {
  const adjustments = [
    {
      id: "ADJ-001",
      product: "Laptop Dell XPS 15",
      adjustment: "+10",
      reason: "Stock Count",
      date: "2026-07-31",
    },
    {
      id: "ADJ-002",
      product: "Wireless Mouse",
      adjustment: "-5",
      reason: "Damaged Items",
      date: "2026-07-30",
    },
    {
      id: "ADJ-003",
      product: "Mechanical Keyboard",
      adjustment: "+8",
      reason: "Supplier Correction",
      date: "2026-07-29",
    },
    {
      id: "ADJ-004",
      product: "27-inch Monitor",
      adjustment: "-2",
      reason: "Warehouse Audit",
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
        Inventory Adjustments
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
            <th style={{ padding: "15px" }}>Adjustment ID</th>
            <th>Product</th>
            <th>Adjustment</th>
            <th>Reason</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {adjustments.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.adjustment}</td>
              <td>{item.reason}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}