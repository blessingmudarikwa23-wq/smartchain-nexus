export default function PredictiveAnalytics() {
  const predictions = [
    {
      category: "Sales",
      prediction: "+14%",
      confidence: "96%",
      action: "Increase inventory",
    },
    {
      category: "Demand",
      prediction: "+11%",
      confidence: "94%",
      action: "Prepare suppliers",
    },
    {
      category: "Revenue",
      prediction: "R2.8M",
      confidence: "95%",
      action: "Expand production",
    },
    {
      category: "Customer Orders",
      prediction: "+9%",
      confidence: "93%",
      action: "Increase warehouse staff",
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
        Predictive Analytics
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
          <h3>AI Models</h3>
          <h1>12</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Prediction Accuracy</h3>
          <h1>95%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Forecast Horizon</h3>
          <h1>90 Days</h1>
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
            <th style={{ padding: "15px" }}>Category</th>
            <th>Prediction</th>
            <th>Confidence</th>
            <th>Recommended Action</th>
          </tr>
        </thead>

        <tbody>
          {predictions.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.category}</td>
              <td>{item.prediction}</td>
              <td>{item.confidence}</td>
              <td>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}