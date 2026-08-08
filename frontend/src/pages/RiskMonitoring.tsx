export default function RiskMonitoring() {
  const risks = [
    {
      title: "Supplier Risk",
      value: "Low",
      color: "#16A34A",
      icon: "🏭",
    },
    {
      title: "Inventory Risk",
      value: "Medium",
      color: "#F59E0B",
      icon: "📦",
    },
    {
      title: "Logistics Risk",
      value: "Low",
      color: "#2563EB",
      icon: "🚚",
    },
    {
      title: "Financial Risk",
      value: "High",
      color: "#DC2626",
      icon: "💰",
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
        Risk Monitoring
      </h1>

      {/* Risk Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {risks.map((risk) => (
          <div
            key={risk.title}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "25px",
              borderLeft: `6px solid ${risk.color}`,
              boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ fontSize: "34px" }}>{risk.icon}</div>

            <h3
              style={{
                marginTop: "15px",
                color: "#64748B",
              }}
            >
              {risk.title}
            </h3>

            <h1
              style={{
                color: risk.color,
                marginTop: "10px",
              }}
            >
              {risk.value}
            </h1>
          </div>
        ))}
      </div>

      {/* Risk Dashboard */}

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
          <h2>Enterprise Risk Matrix</h2>

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
            📊 Risk Matrix Coming Soon
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
          <h2>Risk Alerts</h2>

          <ul
            style={{
              marginTop: "20px",
              lineHeight: "2.2",
              color: "#334155",
              fontSize: "16px",
            }}
          >
            <li>⚠ Low stock alerts</li>
            <li>⚠ Delayed supplier deliveries</li>
            <li>⚠ High inventory holding cost</li>
            <li>⚠ Sales demand fluctuations</li>
            <li>⚠ Financial performance monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}