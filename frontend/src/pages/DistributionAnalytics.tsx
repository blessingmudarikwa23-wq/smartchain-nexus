export default function DistributionAnalytics() {
  const distribution = [
    {
      region: "Gauteng",
      deliveries: 420,
      onTime: "98%",
      cost: "R145,000",
    },
    {
      region: "Western Cape",
      deliveries: 315,
      onTime: "97%",
      cost: "R118,000",
    },
    {
      region: "KwaZulu-Natal",
      deliveries: 280,
      onTime: "96%",
      cost: "R102,000",
    },
    {
      region: "Free State",
      deliveries: 160,
      onTime: "95%",
      cost: "R68,000",
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
        Distribution Analytics
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
          <h3>Total Deliveries</h3>
          <h1>1,175</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>On-Time Delivery</h3>
          <h1>97%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Total Distribution Cost</h3>
          <h1>R433,000</h1>
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
            <th style={{ padding: "15px" }}>Region</th>
            <th>Deliveries</th>
            <th>On-Time</th>
            <th>Distribution Cost</th>
          </tr>
        </thead>

        <tbody>
          {distribution.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.region}</td>
              <td>{item.deliveries}</td>
              <td>{item.onTime}</td>
              <td>{item.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}