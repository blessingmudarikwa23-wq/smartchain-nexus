export default function XYZAnalysis() {
  const products = [
    {
      product: "Laptop Dell XPS 15",
      demand: "Very Stable",
      category: "X",
    },
    {
      product: "27-inch Monitor",
      demand: "Moderately Stable",
      category: "Y",
    },
    {
      product: "Mechanical Keyboard",
      demand: "Seasonal",
      category: "Y",
    },
    {
      product: "Wireless Mouse",
      demand: "Highly Variable",
      category: "Z",
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
        XYZ Analysis
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
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Category X</h3>
          <h1>High Predictability</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Category Y</h3>
          <h1>Medium Predictability</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Category Z</h3>
          <h1>Low Predictability</h1>
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
            <th style={{ padding: "15px" }}>Product</th>
            <th>Demand Pattern</th>
            <th>XYZ Category</th>
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
              <td>{item.demand}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}