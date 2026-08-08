export default function SupplierRiskPrediction() {
  const suppliers = [
    {
      supplier: "ABC Suppliers",
      risk: "Low",
      score: "94%",
      recommendation: "Continue Partnership",
    },
    {
      supplier: "Global Imports",
      risk: "Medium",
      score: "76%",
      recommendation: "Monitor Performance",
    },
    {
      supplier: "Prime Logistics",
      risk: "High",
      score: "48%",
      recommendation: "Review Contract",
    },
    {
      supplier: "Elite Manufacturing",
      risk: "Low",
      score: "91%",
      recommendation: "Preferred Supplier",
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
        Supplier Risk Prediction
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
          <h3>Total Suppliers</h3>
          <h1>48</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Low Risk</h3>
          <h1>36</h1>
        </div>

        <div
          style={{
            background: "#FEE2E2",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>High Risk</h3>
          <h1>4</h1>
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
            <th style={{ padding: "15px" }}>Supplier</th>
            <th>Risk Level</th>
            <th>AI Score</th>
            <th>Recommendation</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.supplier}</td>
              <td>{item.risk}</td>
              <td>{item.score}</td>
              <td>{item.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}