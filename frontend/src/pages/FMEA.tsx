export default function FMEA() {
  const failures = [
    {
      process: "Inventory Receiving",
      failure: "Incorrect Quantity",
      severity: 9,
      occurrence: 5,
      detection: 3,
      rpn: 135,
    },
    {
      process: "Warehouse Picking",
      failure: "Wrong Item Picked",
      severity: 8,
      occurrence: 4,
      detection: 4,
      rpn: 128,
    },
    {
      process: "Dispatch",
      failure: "Late Shipment",
      severity: 7,
      occurrence: 6,
      detection: 3,
      rpn: 126,
    },
    {
      process: "Procurement",
      failure: "Supplier Delay",
      severity: 8,
      occurrence: 5,
      detection: 4,
      rpn: 160,
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
        Failure Mode and Effects Analysis (FMEA)
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
          <h3>Total Risks</h3>
          <h1>24</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Critical Risks</h3>
          <h1>8</h1>
        </div>

        <div
          style={{
            background: "#FEE2E2",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Highest RPN</h3>
          <h1>160</h1>
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
            <th style={{ padding: "15px" }}>Process</th>
            <th>Failure Mode</th>
            <th>Severity</th>
            <th>Occurrence</th>
            <th>Detection</th>
            <th>RPN</th>
          </tr>
        </thead>

        <tbody>
          {failures.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.process}</td>
              <td>{item.failure}</td>
              <td>{item.severity}</td>
              <td>{item.occurrence}</td>
              <td>{item.detection}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color: item.rpn >= 150 ? "#DC2626" : "#0F172A",
                }}
              >
                {item.rpn}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}