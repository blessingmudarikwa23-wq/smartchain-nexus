export default function SafetyStock() {
  const items = [
    {
      product: "Laptop Dell XPS 15",
      leadTime: "7 Days",
      avgDemand: 12,
      safetyStock: 35,
    },
    {
      product: "27-inch Monitor",
      leadTime: "10 Days",
      avgDemand: 15,
      safetyStock: 45,
    },
    {
      product: "Mechanical Keyboard",
      leadTime: "5 Days",
      avgDemand: 20,
      safetyStock: 30,
    },
    {
      product: "Wireless Mouse",
      leadTime: "4 Days",
      avgDemand: 35,
      safetyStock: 50,
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
        Safety Stock Analysis
      </h1>

      <div
        style={{
          background: "#DCFCE7",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h3>Purpose</h3>

        <p>
          Safety Stock protects the business against demand variability
          and supplier lead time uncertainty.
        </p>
      </div>

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
            <th style={{ padding: "15px" }}>Product</th>
            <th>Lead Time</th>
            <th>Average Daily Demand</th>
            <th>Recommended Safety Stock</th>
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
              <td>{item.avgDemand}</td>
              <td>{item.safetyStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}