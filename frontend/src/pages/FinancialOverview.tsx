import React from "react";

const financialCards = [
  {
    title: "Total Revenue",
    value: "R 0.00",
    color: "#16A34A",
    icon: "💰",
  },
  {
    title: "Total Expenses",
    value: "R 0.00",
    color: "#DC2626",
    icon: "💸",
  },
  {
    title: "Net Profit",
    value: "R 0.00",
    color: "#2563EB",
    icon: "📈",
  },
  {
    title: "Cash Flow",
    value: "R 0.00",
    color: "#9333EA",
    icon: "🏦",
  },
];

export default function FinancialOverview() {
  return (
    <div style={{ padding: 30 }}>

      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: "30px",
        }}
      >
        Financial Overview
      </h1>

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        {financialCards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "25px",
              borderLeft: `6px solid ${card.color}`,
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
          >
            <div
              style={{
                fontSize: "34px",
                marginBottom: "12px",
              }}
            >
              {card.icon}
            </div>

            <h3
              style={{
                color: "#64748B",
                marginBottom: "12px",
              }}
            >
              {card.title}
            </h3>

            <h1
              style={{
                color: card.color,
                margin: 0,
              }}
            >
              {card.value}
            </h1>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "25px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <h2>Revenue Trend</h2>

        <div
          style={{
            height: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#94A3B8",
            fontSize: "22px",
          }}
        >
          📈 Revenue Chart Coming Soon
        </div>
      </div>

      {/* Expenses Trend */}

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <h2>Expenses Trend</h2>

        <div
          style={{
            height: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#94A3B8",
            fontSize: "22px",
          }}
        >
          📊 Expense Chart Coming Soon
        </div>
      </div>

    </div>
  );
}