export default function WarehousePerformance() {
  const metrics = [
    {
      kpi: "Receiving Accuracy",
      value: "99.5%",
      target: "98%",
    },
    {
      kpi: "Picking Accuracy",
      value: "99.6%",
      target: "99%",
    },
    {
      kpi: "Packing Accuracy",
      value: "99.8%",
      target: "99%",
    },
    {
      kpi: "Dispatch Accuracy",
      value: "98.9%",
      target: "98%",
    },
    {
      kpi: "Inventory Accuracy",
      value: "99.3%",
      target: "99%",
    },
    {
      kpi: "Warehouse Utilization",
      value: "91%",
      target: "85%",
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
        Warehouse Performance
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
          <h3>Warehouse Efficiency</h3>
          <h1>96.8%</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Orders Processed</h3>
          <h1>2,845</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Labour Productivity</h3>
          <h1>94%</h1>
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
          </tr>
        </thead>

        <tbody>
          {metrics.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.kpi}</td>
              <td>{item.value}</td>
              <td>{item.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}