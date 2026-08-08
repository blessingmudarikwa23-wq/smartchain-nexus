export default function ReorderPoint() {
  const items = [
    {
      product: "Laptop Dell XPS 15",
      leadTime: "7 Days",
      avgDailyDemand: 12,
      safetyStock: 35,
      reorderPoint: 119,
    },
    {
      product: "27-inch Monitor",
      leadTime: "10 Days",
      avgDailyDemand: 15,
      safetyStock: 45,
      reorderPoint: 195,
    },
    {
      product: "Mechanical Keyboard",
      leadTime: "5 Days",
      avgDailyDemand: 20,
      safetyStock: 30,
      reorderPoint: 130,
    },
    {
      product: "Wireless Mouse",
      leadTime: "4 Days",
      avgDailyDemand: 35,
      safetyStock: 50,
      reorderPoint: 190,
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
        Reorder Point Analysis
      </h1>

      <div
        style={{
          background: "#DBEAFE",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h3>Formula</h3>

        <h2>
          Reorder Point = (Average Daily Demand × Lead Time) + Safety Stock
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
            <th>Lead Time</th>
            <th>Average Daily Demand</th>
            <th>Safety Stock</th>
            <th>Reorder Point</th>
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
              <td>{item.leadTime}</td>
              <td>{item.avgDailyDemand}</td>
              <td>{item.safetyStock}</td>
              <td>{item.reorderPoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}