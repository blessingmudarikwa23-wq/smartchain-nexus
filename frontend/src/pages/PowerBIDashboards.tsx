export default function PowerBIDashboards() {
  const dashboards = [
    {
      dashboard: "Sales Dashboard",
      users: 24,
      status: "Active",
      refresh: "Every Hour",
    },
    {
      dashboard: "Inventory Dashboard",
      users: 18,
      status: "Active",
      refresh: "30 Minutes",
    },
    {
      dashboard: "Procurement Dashboard",
      users: 12,
      status: "Active",
      refresh: "Every Hour",
    },
    {
      dashboard: "Executive Dashboard",
      users: 8,
      status: "Premium",
      refresh: "Real Time",
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
        Power BI Dashboards
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
          <h3>Total Dashboards</h3>
          <h1>16</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Active Users</h3>
          <h1>62</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Live Reports</h3>
          <h1>9</h1>
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
            <th style={{ padding: "15px" }}>Dashboard</th>
            <th>Users</th>
            <th>Status</th>
            <th>Refresh Rate</th>
          </tr>
        </thead>

        <tbody>
          {dashboards.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.dashboard}</td>
              <td>{item.users}</td>
              <td>{item.status}</td>
              <td>{item.refresh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}