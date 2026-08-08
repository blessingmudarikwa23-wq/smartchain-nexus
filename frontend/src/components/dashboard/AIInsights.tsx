export default function AIInsights() {
  const insights = [
    {
      title: "Inventory Optimization",
      message:
        "Reduce Warehouse A stock by 18% to minimize holding costs.",
      color: "#2563EB",
    },
    {
      title: "Supplier Risk",
      message:
        "Dell Technologies delivery performance has dropped by 12% this month.",
      color: "#F59E0B",
    },
    {
      title: "Demand Forecast",
      message:
        "Laptop demand is predicted to increase by 22% next month.",
      color: "#10B981",
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
        }}
      >
        🤖 AI Insights
      </h3>

      {insights.map((item) => (
        <div
          key={item.title}
          style={{
            borderLeft: `5px solid ${item.color}`,
            padding: "15px",
            marginBottom: "15px",
            background: "#f8fafc",
            borderRadius: "10px",
          }}
        >
          <strong>{item.title}</strong>

          <p
            style={{
              marginTop: "8px",
              color: "#64748B",
            }}
          >
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
}