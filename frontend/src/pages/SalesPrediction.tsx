export default function SalesPrediction() {
  const predictions = [
    {
      month: "August",
      predictedSales: "R1,850,000",
      confidence: "97%",
      trend: "📈 High",
    },
    {
      month: "September",
      predictedSales: "R1,920,000",
      confidence: "96%",
      trend: "📈 High",
    },
    {
      month: "October",
      predictedSales: "R2,050,000",
      confidence: "95%",
      trend: "📈 Strong",
    },
    {
      month: "November",
      predictedSales: "R2,180,000",
      confidence: "94%",
      trend: "🚀 Peak",
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
        Sales Prediction
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
          <h3>Forecast Revenue</h3>
          <h1>R8.0M</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Prediction Accuracy</h3>
          <h1>96%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Expected Growth</h3>
          <h1>+14%</h1>
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
            <th>Predicted Sales</th>
            <th>Confidence</th>
            <th>Trend</th>
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
              <td style={{ padding: "15px" }}>{item.month}</td>
              <td>{item.predictedSales}</td>
              <td>{item.confidence}</td>
              <td>{item.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}