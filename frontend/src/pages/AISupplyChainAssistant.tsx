export default function AISupplyChainAssistant() {
  const insights = [
    {
      title: "Inventory Alert",
      recommendation: "Laptop stock will reach reorder level in 5 days.",
      priority: "High",
    },
    {
      title: "Supplier Advice",
      recommendation: "Shift 20% of purchases to Elite Manufacturing.",
      priority: "Medium",
    },
    {
      title: "Demand Insight",
      recommendation: "Demand expected to increase by 14% next month.",
      priority: "High",
    },
    {
      title: "Warehouse Optimization",
      recommendation: "Warehouse B has spare capacity of 38%.",
      priority: "Low",
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
        AI Supply Chain Assistant
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#DBEAFE",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>AI Insights Today</h3>
          <h1>18</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Resolved Alerts</h3>
          <h1>12</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Critical Alerts</h3>
          <h1>3</h1>
        </div>
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
            <th style={{ padding: "15px" }}>AI Insight</th>
            <th>Recommendation</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>
          {insights.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.title}</td>
              <td>{item.recommendation}</td>
              <td>{item.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}