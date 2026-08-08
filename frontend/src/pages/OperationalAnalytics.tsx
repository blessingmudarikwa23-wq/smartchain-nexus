export default function OperationalAnalytics() {
  const analytics = [
    {
      metric: "Order Fulfilment",
      value: "98%",
      target: "95%",
      status: "Exceeded",
    },
    {
      metric: "Warehouse Utilization",
      value: "84%",
      target: "80%",
      status: "On Target",
    },
    {
      metric: "Supplier Performance",
      value: "91%",
      target: "90%",
      status: "On Target",
    },
    {
      metric: "Delivery Success",
      value: "96%",
      target: "95%",
      status: "Exceeded",
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
        Operational Analytics
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
          <h3>Operational KPIs</h3>
          <h1>42</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Performance Score</h3>
          <h1>94%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Processes Monitored</h3>
          <h1>18</h1>
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
            <th style={{ padding: "15px" }}>Metric</th>
            <th>Current Value</th>
            <th>Target</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {analytics.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.metric}</td>
              <td>{item.value}</td>
              <td>{item.target}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}