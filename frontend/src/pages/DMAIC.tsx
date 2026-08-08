export default function DMAIC() {
  const phases = [
    {
      phase: "Define",
      objective: "Identify business problem",
      status: "Completed",
    },
    {
      phase: "Measure",
      objective: "Collect process data",
      status: "Completed",
    },
    {
      phase: "Analyze",
      objective: "Identify root causes",
      status: "In Progress",
    },
    {
      phase: "Improve",
      objective: "Implement solutions",
      status: "Pending",
    },
    {
      phase: "Control",
      objective: "Maintain improvements",
      status: "Pending",
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
        DMAIC Dashboard
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
          <h3>Projects</h3>
          <h1>18</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Completed</h3>
          <h1>11</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Active</h3>
          <h1>7</h1>
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
            <th style={{ padding: "15px" }}>Phase</th>
            <th>Objective</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {phases.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.phase}</td>
              <td>{item.objective}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}