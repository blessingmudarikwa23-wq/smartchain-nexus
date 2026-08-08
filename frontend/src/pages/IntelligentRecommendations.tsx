export default function IntelligentRecommendations() {
  const recommendations = [
    {
      category: "Procurement",
      recommendation: "Increase orders from Supplier Alpha by 15%",
      impact: "High",
      status: "Recommended",
    },
    {
      category: "Inventory",
      recommendation: "Reduce excess stock of Office Chairs",
      impact: "Medium",
      status: "Pending",
    },
    {
      category: "Logistics",
      recommendation: "Optimize Route B to reduce fuel costs",
      impact: "High",
      status: "Recommended",
    },
    {
      category: "Sales",
      recommendation: "Launch promotion for slow-moving products",
      impact: "Medium",
      status: "Pending",
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
        Intelligent Recommendations
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
          <h3>Total Recommendations</h3>
          <h1>24</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>High Impact</h3>
          <h1>10</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Implemented</h3>
          <h1>16</h1>
        </div>
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
            <th style={{ padding: "15px" }}>Category</th>
            <th>Recommendation</th>
            <th>Impact</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {recommendations.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.category}</td>
              <td>{item.recommendation}</td>
              <td>{item.impact}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}