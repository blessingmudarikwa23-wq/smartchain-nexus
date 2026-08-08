export default function InventoryOptimization() {
  const inventory = [
    {
      product: "Laptop",
      currentStock: 420,
      optimalStock: 500,
      recommendation: "Increase Stock",
    },
    {
      product: "Monitor",
      currentStock: 315,
      optimalStock: 300,
      recommendation: "Maintain",
    },
    {
      product: "Keyboard",
      currentStock: 650,
      optimalStock: 540,
      recommendation: "Reduce Stock",
    },
    {
      product: "Mouse",
      currentStock: 720,
      optimalStock: 680,
      recommendation: "Maintain",
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
        Inventory Optimization
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
          <h3>Optimized Products</h3>
          <h1>148</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Potential Savings</h3>
          <h1>R485,000</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Optimization Score</h3>
          <h1>95%</h1>
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
            <th>Current Stock</th>
            <th>Optimal Stock</th>
            <th>Recommendation</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.product}</td>
              <td>{item.currentStock}</td>
              <td>{item.optimalStock}</td>
              <td>{item.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}