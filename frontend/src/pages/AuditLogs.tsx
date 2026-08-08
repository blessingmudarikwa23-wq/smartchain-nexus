export default function AuditLogs() {
  const logs = [
    {
      date: "2026-08-02 09:15",
      user: "John Doe",
      action: "Logged into system",
      module: "Authentication",
    },
    {
      date: "2026-08-02 09:32",
      user: "Sarah Smith",
      action: "Updated procurement order",
      module: "Procurement",
    },
    {
      date: "2026-08-02 10:01",
      user: "Michael Brown",
      action: "Created inventory backup",
      module: "Backup & Restore",
    },
    {
      date: "2026-08-02 10:20",
      user: "Linda Johnson",
      action: "Generated Executive Report",
      module: "Business Intelligence",
    },
    {
      date: "2026-08-02 10:35",
      user: "Administrator",
      action: "Changed security settings",
      module: "Security",
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
        Audit Logs
      </h1>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              background: "#1E293B",
              color: "#ffffff",
            }}
          >
            <tr>
              <th style={{ padding: "15px" }}>Date</th>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <td style={{ padding: "15px" }}>{log.date}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.module}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}