export default function ExecutiveReporting() {
  const reports = [
    {
      report: "Monthly Executive Report",
      department: "Executive",
      frequency: "Monthly",
      status: "Generated",
    },
    {
      report: "Supply Chain Summary",
      department: "Operations",
      frequency: "Weekly",
      status: "Generated",
    },
    {
      report: "Financial Performance",
      department: "Finance",
      frequency: "Monthly",
      status: "Pending",
    },
    {
      report: "Procurement Report",
      department: "Procurement",
      frequency: "Weekly",
      status: "Generated",
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
        Executive Reporting
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
          <h3>Total Reports</h3>
          <h1>28</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Generated</h3>
          <h1>24</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Pending</h3>
          <h1>4</h1>
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
            <th style={{ padding: "15px" }}>Report</th>
            <th>Department</th>
            <th>Frequency</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.report}</td>
              <td>{item.department}</td>
              <td>{item.frequency}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}