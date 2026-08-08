import { useEffect, useState } from "react";

type KPI = {
  title: string;
  value: string;
  color: string;
  icon: string;
};

export default function ExecutiveDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([]);

  useEffect(() => {
    setKpis([
      {
        title: "Total Inventory Value",
        value: "R 0.00",
        color: "#2563EB",
        icon: "🏬",
      },
      {
        title: "Purchase Orders",
        value: "0",
        color: "#059669",
        icon: "📦",
      },
      {
        title: "Sales Orders",
        value: "0",
        color: "#DC2626",
        icon: "💰",
      },
      {
        title: "Suppliers",
        value: "0",
        color: "#7C3AED",
        icon: "🚚",
      },
      {
        title: "Customers",
        value: "0",
        color: "#EA580C",
        icon: "👥",
      },
      {
        title: "Low Stock Alerts",
        value: "0",
        color: "#B91C1C",
        icon: "⚠️",
      },
    ]);
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          marginBottom: "30px",
          color: "#0F172A",
        }}
      >
        Executive Intelligence
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        {kpis.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              borderLeft: `6px solid ${item.color}`,
            }}
          >
            <div
              style={{
                fontSize: "36px",
                marginBottom: "10px",
              }}
            >
              {item.icon}
            </div>

            <h3
              style={{
                color: "#64748B",
                marginBottom: "10px",
              }}
            >
              {item.title}
            </h3>

            <h1
              style={{
                color: item.color,
                margin: 0,
              }}
            >
              {item.value}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}