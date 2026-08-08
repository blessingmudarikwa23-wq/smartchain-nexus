export default function AnomalyDetection() {
  const anomalies = [
    {
      event: "Inventory Spike",
      location: "Warehouse A",
      severity: "High",
      status: "Investigating",
    },
    {
      event: "Sales Drop",
      location: "Johannesburg",
      severity: "Medium",
      status: "Monitoring",
    },
    {
      event: "Delayed Shipment",
      location: "Cape Town",
      severity: "High",
      status: "Escalated",
    },
    {
      event: "Supplier Delay",
      location: "Pretoria",
      severity: "Low",
      status: "Resolved",
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
        Anomaly Detection
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
          <h3>Total Alerts</h3>
          <h1>42</h1>
        </div>

        <div
          style={{
            background: "#FEE2E2",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>High Severity</h3>
          <h1>8</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Resolved</h3>
          <h1>31</h1>
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
            <th style={{ padding: "15px" }}>Anomaly</th>
            <th>Location</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {anomalies.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.event}</td>
              <td>{item.location}</td>
              <td>{item.severity}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
