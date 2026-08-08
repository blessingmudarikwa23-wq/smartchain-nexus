export default function RevenueAnalysis() {
  const revenue = [
    {
      month: "January",
      sales: "R1,250,000",
      profit: "R320,000",
      growth: "+8%",
    },
    {
      month: "February",
      sales: "R1,380,000",
      profit: "R355,000",
      growth: "+10%",
    },
    {
      month: "March",
      sales: "R1,460,000",
      profit: "R389,000",
      growth: "+6%",
    },
    {
      month: "April",
      sales: "R1,620,000",
      profit: "R430,000",
      growth: "+11%",
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
        Revenue Analysis
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
          <h3>Total Revenue</h3>
          <h1>R5.71M</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Total Profit</h3>
          <h1>R1.49M</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Growth Rate</h3>
          <h1>+9%</h1>
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
            <th style={{ padding: "15px" }}>Month</th>
            <th>Revenue</th>
            <th>Profit</th>
            <th>Growth</th>
          </tr>
        </thead>

        <tbody>
          {revenue.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.month}</td>
              <td>{item.sales}</td>
              <td>{item.profit}</td>
              <td>{item.growth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}