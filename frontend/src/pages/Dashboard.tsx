import { useEffect, useState } from "react";

import KPICard from "../components/dashboard/KPICard";
import InventoryAlerts from "../components/dashboard/InventoryAlerts";
import AIInsights from "../components/dashboard/AIInsights";

import InventoryChart from "../components/charts/InventoryChart";
import SalesChart from "../components/charts/SalesChart";

import RecentPurchaseOrders from "../components/tables/RecentPurchaseOrders";
import RecentSalesOrders from "../components/tables/RecentSalesOrders";

import { dashboardService } from "../services/dashboardService";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_products: 0,
    total_inventory_items: 0,
    total_suppliers: 0,
    total_customers: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Executive Dashboard</h1>

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <KPICard
          title="Products"
          value={summary.total_products}
          icon="📦"
          color="#2563EB"
        />

        <KPICard
          title="Inventory"
          value={summary.total_inventory_items}
          icon="🏬"
          color="#10B981"
        />

        <KPICard
          title="Suppliers"
          value={summary.total_suppliers}
          icon="🚚"
          color="#F59E0B"
        />

        <KPICard
          title="Customers"
          value={summary.total_customers}
          icon="👥"
          color="#8B5CF6"
        />
      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          marginTop: "35px",
        }}
      >
        <InventoryChart />

        <SalesChart />
      </div>

      {/* ALERTS + AI */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "35px",
        }}
      >
        <InventoryAlerts />

        <AIInsights />
      </div>

      {/* TABLES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "35px",
          marginBottom: "40px",
        }}
      >
        <RecentPurchaseOrders />

        <RecentSalesOrders />
      </div>
    </>
  );
}