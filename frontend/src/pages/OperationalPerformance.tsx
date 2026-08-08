export default function OperationalPerformance() {
  const metrics = [
    {
      title: "Order Fulfillment",
      value: "98.5%",
      color: "#2563EB",
      icon: "📦",
    },
    {
      title: "Inventory Turnover",
      value: "12.4",
      color: "#16A34A",
      icon: "🔄",
    },
    {
      title: "Warehouse Utilization",
      value: "87%",
      color: "#F59E0B",
      icon: "🏭",
    },
    {
      title: "On-Time Delivery",
      value: "96%",
      color: "#9333EA",
      icon: "🚚",
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "30px",
          color: "#0F172A",
        }}
      >
        Operational Performance
      </h1>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {metrics.map((metric) => (
          <div
            key={metric.title}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "25px",
              borderLeft: `6px solid ${metric.color}`,
              boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ fontSize: "34px" }}>{metric.icon}</div>

            <h3
              style={{
                color: "#64748B",
                marginTop: "15px",
                marginBottom: "10px",
              }}
            >
              {metric.title}
            </h3>

            <h1
              style={{
                color: metric.color,
                margin: 0,
              }}
            >
              {metric.value}
            </h1>
          </div>
        ))}
      </div>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            height: "320px",
          }}
        >
          <h2>Warehouse Performance</h2>

          <div
            style={{
              height: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#94A3B8",
              fontSize: "20px",
            }}
          >
            📊 Warehouse Performance Chart
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            height: "320px",
          }}
        >
          <h2>Operational Trends</h2>

          <div
            style={{
              height: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#94A3B8",
              fontSize: "20px",
            }}
          >
            📈 Operational Trend Chart
          </div>
        </div>
      </div>
    </div>
  );
}