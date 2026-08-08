import React from "react";

const kpis = [
  {
    title: "Total Revenue",
    value: "R 0.00",
    color: "#16A34A",
    icon: "💰",
  },
  {
    title: "Gross Profit",
    value: "R 0.00",
    color: "#2563EB",
    icon: "📈",
  },
  {
    title: "Net Profit",
    value: "R 0.00",
    color: "#9333EA",
    icon: "🏆",
  },
  {
    title: "Inventory Value",
    value: "R 0.00",
    color: "#EA580C",
    icon: "🏬",
  },
  {
    title: "Purchase Spend",
    value: "R 0.00",
    color: "#DC2626",
    icon: "📦",
  },
  {
    title: "Customer Growth",
    value: "0%",
    color: "#0891B2",
    icon: "👥",
  },
  {
    title: "Supplier Performance",
    value: "0%",
    color: "#0F766E",
    icon: "🚚",
  },
  {
    title: "Inventory Turnover",
    value: "0",
    color: "#B45309",
    icon: "🔄",
  },
];

export default function BusinessKPIs() {
  return (
    <div style={{ padding: 30 }}>
      <h1
        style={{
          marginBottom: 30,
          color: "#0F172A",
        }}
      >
        Business KPIs
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
        }}
      >
        {kpis.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 15,
              borderLeft: `6px solid ${item.color}`,
              boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            }}
          >
            <div
              style={{
                fontSize: 35,
                marginBottom: 12,
              }}
            >
              {item.icon}
            </div>

            <h3
              style={{
                color: "#64748B",
                marginBottom: 10,
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