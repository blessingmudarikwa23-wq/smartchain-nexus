export default function InventoryTurnover() {
  const items = [
    {
      product: "Laptop Dell XPS 15",
      cogs: "$520,000",
      averageInventory: "$125,000",
      turnover: "4.16",
    },
    {
      product: "27-inch Monitor",
      cogs: "$410,000",
      averageInventory: "$105,000",
      turnover: "3.90",
    },
    {
      product: "Mechanical Keyboard",
      cogs: "$260,000",
      averageInventory: "$62,000",
      turnover: "4.19",
    },
    {
      product: "Wireless Mouse",
      cogs: "$180,000",
      averageInventory: "$38,000",
      turnover: "4.74",
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
        Inventory Turnover
      </h1>

      <div
        style={{
          background: "#F0FDF4",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h3>Formula</h3>

        <h2>
          Inventory Turnover = Cost of Goods Sold ÷ Average Inventory
        </h2>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <thead
          style={{
            background: "#1E293B",
            color: "#ffffff",
          }}
        >
          <tr>
            <th style={{ padding: "15px" }}>Product</th>
            <th>COGS</th>
            <th>Average Inventory</th>
            <th>Turnover Ratio</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.product}</td>
              <td>{item.cogs}</td>
              <td>{item.averageInventory}</td>
              <td>{item.turnover}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}