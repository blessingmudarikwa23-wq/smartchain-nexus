export default function CustomerSegmentation() {
  const customers = [
    {
      segment: "Enterprise",
      customers: 48,
      revenue: "R5,200,000",
      growth: "+12%",
    },
    {
      segment: "SME",
      customers: 156,
      revenue: "R2,850,000",
      growth: "+9%",
    },
    {
      segment: "Retail",
      customers: 482,
      revenue: "R1,760,000",
      growth: "+6%",
    },
    {
      segment: "Wholesale",
      customers: 93,
      revenue: "R3,180,000",
      growth: "+10%",
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
        Customer Segmentation
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
          <h3>Total Customers</h3>
          <h1>779</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Highest Revenue Segment</h3>
          <h1>Enterprise</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Average Growth</h3>
          <h1>9%</h1>
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
            <th style={{ padding: "15px" }}>Segment</th>
            <th>Customers</th>
            <th>Revenue</th>
            <th>Growth</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.segment}</td>
              <td>{item.customers}</td>
              <td>{item.revenue}</td>
              <td>{item.growth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}