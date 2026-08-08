export default function ABCAnalysis() {
  const products = [
    {
      product: "Laptop Dell XPS 15",
      annualValue: "$250,000",
      category: "A",
    },
    {
      product: "27-inch Monitor",
      annualValue: "$120,000",
      category: "A",
    },
    {
      product: "Mechanical Keyboard",
      annualValue: "$60,000",
      category: "B",
    },
    {
      product: "Wireless Mouse",
      annualValue: "$18,000",
      category: "C",
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
        ABC Analysis
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
          <h3>Category A</h3>
          <h1>20%</h1>
          <p>Highest Value Items</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Category B</h3>
          <h1>30%</h1>
          <p>Medium Value Items</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Category C</h3>
          <h1>50%</h1>
          <p>Low Value Items</p>
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
            <th>Annual Consumption Value</th>
            <th>ABC Category</th>
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
              <td>{item.annualValue}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}