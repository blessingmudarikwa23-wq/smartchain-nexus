export default function DemandForecasting() {
  const forecast = [
    {
      product: "Laptop",
      current: 420,
      predicted: 470,
      confidence: "96%",
    },
    {
      product: "Monitor",
      current: 310,
      predicted: 345,
      confidence: "94%",
    },
    {
      product: "Keyboard",
      current: 520,
      predicted: 560,
      confidence: "97%",
    },
    {
      product: "Mouse",
      current: 610,
      predicted: 655,
      confidence: "95%",
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
        Demand Forecasting
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
          <h3>Forecast Accuracy</h3>
          <h1>96%</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Predicted Orders</h3>
          <h1>2,030</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Growth Forecast</h3>
          <h1>+12%</h1>
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
            <th>Current Demand</th>
            <th>Forecast</th>
            <th>Confidence</th>
          </tr>
        </thead>

        <tbody>
          {forecast.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.product}</td>
              <td>{item.current}</td>
              <td>{item.predicted}</td>
              <td>{item.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}