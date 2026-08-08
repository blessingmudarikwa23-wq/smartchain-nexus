export default function ControlCharts() {
  const processData = [
    {
      process: "Order Processing",
      average: "4.2 hrs",
      upperLimit: "5.0 hrs",
      lowerLimit: "3.5 hrs",
      status: "In Control",
    },
    {
      process: "Warehouse Picking",
      average: "2.1 hrs",
      upperLimit: "2.8 hrs",
      lowerLimit: "1.6 hrs",
      status: "In Control",
    },
    {
      process: "Supplier Delivery",
      average: "6.5 days",
      upperLimit: "7.5 days",
      lowerLimit: "5.5 days",
      status: "Monitor",
    },
    {
      process: "Customer Delivery",
      average: "3.0 days",
      upperLimit: "4.0 days",
      lowerLimit: "2.5 days",
      status: "In Control",
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
        Control Charts
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
          <h3>Processes Monitored</h3>
          <h1>16</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Stable Processes</h3>
          <h1>14</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Need Attention</h3>
          <h1>2</h1>
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
            <th style={{ padding: "15px" }}>Process</th>
            <th>Average</th>
            <th>Upper Control Limit</th>
            <th>Lower Control Limit</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {processData.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.process}</td>
              <td>{item.average}</td>
              <td>{item.upperLimit}</td>
              <td>{item.lowerLimit}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color:
                    item.status === "In Control" ? "#16A34A" : "#D97706",
                }}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}