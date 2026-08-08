export default function FishboneAnalysis() {
  const causes = [
    {
      category: "People",
      issue: "Insufficient staff training",
      impact: "High",
    },
    {
      category: "Process",
      issue: "Manual approval delays",
      impact: "Medium",
    },
    {
      category: "Machines",
      issue: "Equipment downtime",
      impact: "High",
    },
    {
      category: "Materials",
      issue: "Supplier quality variation",
      impact: "Medium",
    },
    {
      category: "Environment",
      issue: "Warehouse temperature changes",
      impact: "Low",
    },
    {
      category: "Measurement",
      issue: "Incorrect inventory counts",
      impact: "High",
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
        Fishbone Analysis
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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
          <h3>Total Root Causes</h3>
          <h1>32</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Critical Issues</h3>
          <h1>9</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Resolved</h3>
          <h1>21</h1>
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
            <th>Possible Cause</th>
            <th>Impact</th>
          </tr>
        </thead>

        <tbody>
          {causes.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.category}</td>
              <td>{item.issue}</td>
              <td>{item.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}