import { useEffect, useState } from "react";

import KPICard from "../components/dashboard/KPICard";
import InventoryAlerts from "../components/dashboard/InventoryAlerts";
import AIInsights from "../components/dashboard/AIInsights";

import InventoryChart from "../components/charts/InventoryChart";
import SalesChart from "../components/charts/SalesChart";

import RecentPurchaseOrders from "../components/tables/RecentPurchaseOrders";
import RecentSalesOrders from "../components/tables/RecentSalesOrders";

import { dashboardService } from "../services/dashboardService";

type InventoryChartData = {
  month: string;
  inventory: number;
};

type SalesChartData = {
  month: string;
  sales: number;
  purchase: number;
};

export default function Dashboard() {
  const [summary, setSummary] = useState({
    kpis: {
      products: 0,
      inventory: 0,
      suppliers: 0,
      customers: 0,
    },

    inventory_alerts: [],
    ai_insights: [],
    purchase_orders: [],
    sales_orders: [],

    inventory_chart: [] as InventoryChartData[],

    sales_chart: [] as SalesChartData[],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await dashboardService.getSummary();

      console.log("Dashboard data:", data);

      setSummary(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "35px 45px 60px 45px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#10B981",
              marginBottom: "10px",
            }}
          >
            ● LIVE OPERATIONS
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Executive Dashboard
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "15px",
              color: "#64748B",
            }}
          >
            Real-time visibility across inventory, procurement, sales and
            supply chain operations.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "18px 24px",
            boxShadow: "0 8px 25px rgba(15, 23, 42, 0.06)",
            minWidth: "170px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "5px" }}>⚡</div>

          <div
            style={{
              fontWeight: 700,
              color: "#334155",
              fontSize: "14px",
            }}
          >
            SmartChain
          </div>

          <div
            style={{
              fontWeight: 700,
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Intelligence
          </div>
        </div>
      </div>

      {/* KPI SECTION */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "1.4px",
            color: "#64748B",
          }}
        >
          KEY PERFORMANCE INDICATORS
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "22px",
          width: "100%",
        }}
      >
        <KPICard
          title="Products"
          value={summary.kpis.products}
          icon="📦"
          color="#2563EB"
        />

        <KPICard
          title="Inventory"
          value={summary.kpis.inventory}
          icon="🏬"
          color="#10B981"
        />

        <KPICard
          title="Suppliers"
          value={summary.kpis.suppliers}
          icon="🚚"
          color="#F59E0B"
        />

        <KPICard
          title="Customers"
          value={summary.kpis.customers}
          icon="👥"
          color="#8B5CF6"
        />
      </div>

      {/* ANALYTICS */}

      <div
        style={{
          textAlign: "center",
          marginTop: "45px",
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "1.4px",
            color: "#64748B",
          }}
        >
          OPERATIONAL ANALYTICS
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(360px, 1fr)",
          gap: "24px",
          width: "100%",
        }}
      >
        <InventoryChart data={summary.inventory_chart} />

        <SalesChart data={summary.sales_chart} />
      </div>

      {/* ALERTS + AI */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "24px",
          width: "100%",
          marginTop: "24px",
        }}
      >
        <InventoryAlerts data={summary.inventory_alerts} />

        <AIInsights data={summary.ai_insights} />
      </div>

      {/* TRANSACTIONS */}

      <div
        style={{
          textAlign: "center",
          marginTop: "45px",
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "1.4px",
            color: "#64748B",
          }}
        >
          RECENT TRANSACTIONS
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "24px",
          width: "100%",
        }}
      >
        <RecentPurchaseOrders data={summary.purchase_orders} />

        <RecentSalesOrders data={summary.sales_orders} />
      </div>
    </div>
  );
}