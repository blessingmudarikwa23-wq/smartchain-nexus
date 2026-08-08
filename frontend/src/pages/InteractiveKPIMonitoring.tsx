export default function InteractiveKPIMonitoring() {
  const kpis = [
    {
      kpi: "Revenue Growth",
      current: "14%",
      target: "12%",
      status: "Above Target",
    },
    {
      kpi: "Inventory Turnover",
      current: "8.6",
      target: "8.0",
      status: "Above Target",
    },
    {
      kpi: "Order Fulfilment",
      current: "98%",
      target: "95%",
      status: "Above Target",
    },
    {
      kpi: "Customer Satisfaction",
      current: "94%",
      target: "90%",
      status: "Above Target",
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
        Interactive KPI Monitoring
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
          <h3>KPIs Tracked</h3>
          <h1>48</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>On Target</h3>
          <h1>44</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Performance Score</h3>
          <h1>96%</h1>
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
            <th style={{ padding: "15px" }}>KPI</th>
            <th>Current</th>
            <th>Target</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {kpis.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.kpi}</td>
              <td>{item.current}</td>
              <td>{item.target}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}