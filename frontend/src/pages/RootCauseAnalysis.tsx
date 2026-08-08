export default function RootCauseAnalysis() {
  const causes = [
    {
      problem: "Late Deliveries",
      rootCause: "Supplier Lead Time Variability",
      action: "Review Supplier Contracts",
      priority: "High",
    },
    {
      problem: "Inventory Shortages",
      rootCause: "Poor Demand Forecasting",
      action: "Improve Forecast Model",
      priority: "High",
    },
    {
      problem: "Production Delays",
      rootCause: "Machine Downtime",
      action: "Preventive Maintenance",
      priority: "Medium",
    },
    {
      problem: "Picking Errors",
      rootCause: "Insufficient Staff Training",
      action: "Employee Training",
      priority: "Medium",
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
        Root Cause Analysis
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
          <h3>Problems Identified</h3>
          <h1>38</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Resolved</h3>
          <h1>29</h1>
        </div>

        <div
          style={{
            background: "#FEE2E2",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Critical</h3>
          <h1>9</h1>
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
            <th style={{ padding: "15px" }}>Problem</th>
            <th>Root Cause</th>
            <th>Corrective Action</th>
            <th>Priority</th>
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
              <td style={{ padding: "15px" }}>{item.problem}</td>
              <td>{item.rootCause}</td>
              <td>{item.action}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color:
                    item.priority === "High"
                      ? "#DC2626"
                      : "#D97706",
                }}
              >
                {item.priority}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}