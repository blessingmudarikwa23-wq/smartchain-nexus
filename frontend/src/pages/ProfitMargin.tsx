export default function ProfitMargin() {
  const products = [
    {
      product: "Product A",
      revenue: "R850,000",
      cost: "R590,000",
      margin: "30.6%",
    },
    {
      product: "Product B",
      revenue: "R720,000",
      cost: "R510,000",
      margin: "29.2%",
    },
    {
      product: "Product C",
      revenue: "R650,000",
      cost: "R430,000",
      margin: "33.8%",
    },
    {
      product: "Product D",
      revenue: "R540,000",
      cost: "R360,000",
      margin: "33.3%",
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
        Profit Margin
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
          <h3>Gross Profit</h3>
          <h1>R870,000</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Average Margin</h3>
          <h1>31.7%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Best Product</h3>
          <h1>Product C</h1>
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
            <th style={{ padding: "15px" }}>Product</th>
            <th>Revenue</th>
            <th>Cost</th>
            <th>Profit Margin</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.product}</td>
              <td>{item.revenue}</td>
              <td>{item.cost}</td>
              <td>{item.margin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}