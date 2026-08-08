export default function ParetoAnalysis() {
  const paretoData = [
    {
      issue: "Late Deliveries",
      frequency: 42,
      percentage: "35%",
    },
    {
      issue: "Stock Shortages",
      frequency: 28,
      percentage: "23%",
    },
    {
      issue: "Supplier Delays",
      frequency: 20,
      percentage: "17%",
    },
    {
      issue: "Production Downtime",
      frequency: 18,
      percentage: "15%",
    },
    {
      issue: "Data Errors",
      frequency: 12,
      percentage: "10%",
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
        Pareto Analysis
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
          <h3>Total Issues</h3>
          <h1>120</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Critical Issues</h3>
          <h1>48</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>80/20 Coverage</h3>
          <h1>82%</h1>
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
            <th style={{ padding: "15px" }}>Issue</th>
            <th>Frequency</th>
            <th>Contribution</th>
          </tr>
        </thead>

        <tbody>
          {paretoData.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.issue}</td>
              <td>{item.frequency}</td>
              <td>{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}