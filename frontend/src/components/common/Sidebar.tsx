import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuStyle = {
  color: "#ffffff",
  textDecoration: "none",
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  borderRadius: "8px",
  marginBottom: "5px",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

const subMenuStyle = {
  color: "#CBD5E1",
  textDecoration: "none",
  padding: "10px 20px 10px 40px",
  display: "block",
  borderRadius: "6px",
  marginBottom: "3px",
  fontSize: "15px",
  whiteSpace: "nowrap" as const,
};

export default function Sidebar() {
  const [executiveOpen, setExecutiveOpen] = useState(false);
  const [procurementOpen, setProcurementOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [logisticsOpen, setLogisticsOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [dataScienceOpen, setDataScienceOpen] = useState(false);
  const [businessIntelOpen, setBusinessIntelOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [leanOpen, setLeanOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      style={{
        width: 360,
        background: "#0F172A",
        color: "#ffffff",
        minHeight: "100vh",
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "35px",
        }}
      >
        SmartChain Nexus
      </h2>

      <NavLink to="/" style={menuStyle}>
        🏠 Dashboard
      </NavLink>

      {/* Executive Intelligence */}

      <div
        style={menuStyle}
        onClick={() => setExecutiveOpen(!executiveOpen)}
      >
  
  📊 Executive Intelligence
</div>

{executiveOpen && (
  <>
    <NavLink
      to="/executive-dashboard"
      style={subMenuStyle}
    >
      CEO Dashboard
    </NavLink>

    <NavLink
      to="/business-kpis"
      style={subMenuStyle}
    >
      Business KPIs
    </NavLink>

    <NavLink
      to="/financial-overview"
      style={subMenuStyle}
    >
      Financial Overview
    </NavLink>

    <NavLink
      to="/operational-performance"
      style={subMenuStyle}
    >
      Operational Performance
    </NavLink>

    <NavLink
      to="/risk-monitoring"
      style={subMenuStyle}
    >
      Risk Monitoring
    </NavLink>
  </>
)}

      {/* Procurement */}

      <div
        style={menuStyle}
        onClick={() => setProcurementOpen(!procurementOpen)}
      >
        📦 Procurement
      </div>

      {procurementOpen && (
        <>
          <NavLink to="/suppliers" style={subMenuStyle}>
            Supplier Management
          </NavLink>

          <NavLink to="/purchase-orders" style={subMenuStyle}>
            Purchase Orders
          </NavLink>

          <NavLink
  to="/spend-analytics"
  style={subMenuStyle}
>
  Spend Analytics
</NavLink>

          <NavLink
  to="/vendor-performance"
  style={subMenuStyle}
>
  Vendor Performance
</NavLink>

          <NavLink
  to="/lead-time-analysis"
  style={subMenuStyle}
>
  Lead Time Analysis
</NavLink>
        </>
      )}

      {/* Inventory */}

      <div
        style={menuStyle}
        onClick={() => setInventoryOpen(!inventoryOpen)}
      >
        🏬 Inventory
      </div>

      {inventoryOpen && (
        <>
          <NavLink
  to="/inventory"
  style={subMenuStyle}
>
  Stock Monitoring
</NavLink>

          <NavLink
  to="/inventory-transactions"
  style={subMenuStyle}
>
  Inventory Transactions
</NavLink>

          <NavLink
  to="/inventory-adjustments"
  style={subMenuStyle}
>
  Inventory Adjustments
</NavLink>

          <NavLink
  to="/abc-analysis"
  style={subMenuStyle}
>
  ABC Analysis
</NavLink>

          <NavLink
  to="/xyz-analysis"
  style={subMenuStyle}
>
  XYZ Analysis
</NavLink>

          <NavLink
  to="/eoq"
  style={subMenuStyle}
>
  EOQ
</NavLink>

          <NavLink
  to="/safety-stock"
  style={subMenuStyle}
>
  Safety Stock
</NavLink>

          <NavLink
  to="/reorder-point"
  style={subMenuStyle}
>
  Reorder Point
</NavLink>

          <NavLink
  to="/inventory-turnover"
  style={subMenuStyle}
>
  Inventory Turnover
</NavLink>
        </>
      )}
            {/* Warehouse */}

<div
  style={menuStyle}
  onClick={() => setWarehouseOpen(!warehouseOpen)}
>
  🏭 Warehouse
</div>

{warehouseOpen && (
  <>
    <NavLink
      to="/receiving"
      style={subMenuStyle}
    >
      Receiving
    </NavLink>

    <NavLink
  to="/picking"
  style={subMenuStyle}
>
  Picking
</NavLink>

    <NavLink
  to="/packing"
  style={subMenuStyle}
>
  Packing
</NavLink>

    <NavLink
  to="/dispatch"
  style={subMenuStyle}
>
  Dispatch
</NavLink>

    <NavLink
  to="/cycle-counts"
  style={subMenuStyle}
>
  Cycle Counts
</NavLink>

    <NavLink
  to="/warehouse-performance"
  style={subMenuStyle}
>
  Warehouse Performance
</NavLink>
  </>
)}

      {/* Logistics */}

      <div
        style={menuStyle}
        onClick={() => setLogisticsOpen(!logisticsOpen)}
      >
        🚚 Logistics
      </div>

      {logisticsOpen && (
        <>
          <NavLink
  to="/fleet-performance"
  style={subMenuStyle}
>
  Fleet Performance
</NavLink>

          <NavLink
  to="/route-optimization"
  style={subMenuStyle}
>
  Route Optimization
</NavLink>

          <NavLink
  to="/delivery-tracking"
  style={subMenuStyle}
>
  Delivery Tracking
</NavLink>

          <NavLink
  to="/fuel-analysis"
  style={subMenuStyle}
>
  Fuel Analysis
</NavLink>

          <NavLink
  to="/distribution-analytics"
  style={subMenuStyle}
>
  Distribution Analytics
</NavLink>
        </>
      )}

      {/* Sales */}

      <div
        style={menuStyle}
        onClick={() => setSalesOpen(!salesOpen)}
      >
        💰 Sales
      </div>

      {salesOpen && (
        <>
          <NavLink
            to="/customers"
            style={subMenuStyle}
          >
            Customer Management
          </NavLink>

          <NavLink
            to="/sales-orders"
            style={subMenuStyle}
          >
            Sales Orders
          </NavLink>

          <NavLink
  to="/revenue-analysis"
  style={subMenuStyle}
>
  Revenue Analysis
</NavLink>

          <NavLink
  to="/profit-margin"
  style={subMenuStyle}
>
  Profit Margin
</NavLink>
        </>
      )}

      {/* Data Science */}

      <div
        style={menuStyle}
        onClick={() => setDataScienceOpen(!dataScienceOpen)}
      >
        🧠 Data Science
      </div>

      {dataScienceOpen && (
        <>
          <NavLink
  to="/demand-forecasting"
  style={subMenuStyle}
>
  Demand Forecasting
</NavLink>

          <NavLink
  to="/sales-prediction"
  style={subMenuStyle}
>
  Sales Prediction
</NavLink>

          <NavLink
  to="/supplier-risk-prediction"
  style={subMenuStyle}
>
  Supplier Risk Prediction
</NavLink>

          <NavLink
  to="/customer-segmentation"
  style={subMenuStyle}
>
  Customer Segmentation
</NavLink>

          <NavLink
  to="/inventory-optimization"
  style={subMenuStyle}
>
  Inventory Optimization
</NavLink>

          <NavLink
  to="/anomaly-detection"
  style={subMenuStyle}
>
  Anomaly Detection
</NavLink>
        </>
      )}
            {/* Business Intelligence */}

      <div
        style={menuStyle}
        onClick={() => setBusinessIntelOpen(!businessIntelOpen)}
      >
        📈 Business Intelligence
      </div>

      {businessIntelOpen && (
        <>
          <NavLink
  to="/power-bi-dashboards"
  style={subMenuStyle}
>
  Power BI Dashboards
</NavLink>

          <NavLink
  to="/executive-reporting"
  style={subMenuStyle}
>
  Executive Reporting
</NavLink>

          <NavLink
  to="/operational-analytics"
  style={subMenuStyle}
>
  Operational Analytics
</NavLink>

          <NavLink
  to="/interactive-kpi-monitoring"
  style={subMenuStyle}
>
  Interactive KPI Monitoring
</NavLink>
        </>
      )}

      {/* Artificial Intelligence */}

      <div
        style={menuStyle}
        onClick={() => setAiOpen(!aiOpen)}
      >
        🤖 Artificial Intelligence
      </div>

      {aiOpen && (
        <>
          <NavLink
  to="/ai-supply-chain-assistant"
  style={subMenuStyle}
>
  AI Supply Chain Assistant
</NavLink>

          <NavLink
  to="/predictive-analytics"
  style={subMenuStyle}
>
  Predictive Analytics
</NavLink>

          <NavLink
  to="/intelligent-recommendations"
  style={subMenuStyle}
>
  Intelligent Recommendations
</NavLink>

          <NavLink
  to="/natural-language-queries"
  style={subMenuStyle}
>
  Natural Language Queries
</NavLink>
        </>
      )}

      {/* Lean Six Sigma */}

      <div
        style={menuStyle}
        onClick={() => setLeanOpen(!leanOpen)}
      >
        ⚙️ Lean Six Sigma
      </div>

      {leanOpen && (
        <>
          <NavLink
  to="/dmaic"
  style={subMenuStyle}
>
  DMAIC
</NavLink>

          <NavLink
  to="/sipoc"
  style={subMenuStyle}
>
  SIPOC
</NavLink>

          <NavLink
  to="/fishbone-analysis"
  style={subMenuStyle}
>
  Fishbone Analysis
</NavLink>

          <NavLink
  to="/pareto-analysis"
  style={subMenuStyle}
>
  Pareto Analysis
</NavLink>

          <NavLink
  to="/fmea"
  style={subMenuStyle}
>
  FMEA
</NavLink>

          <NavLink
  to="/control-charts"
  style={subMenuStyle}
>
  Control Charts
</NavLink>

          <NavLink
  to="/root-cause-analysis"
  style={subMenuStyle}
>
  Root Cause Analysis
</NavLink>
        </>
      )}
                  {/* ================= SETTINGS ================= */}

      <div
        style={menuStyle}
        onClick={() => setSettingsOpen(!settingsOpen)}
      >
        ⚙️ Settings
      </div>

      {settingsOpen && (
        <>
          <NavLink to="/settings/profile" style={subMenuStyle}>
            👤 Profile Settings
          </NavLink>

          <NavLink to="/settings/company" style={subMenuStyle}>
            🏢 Company Settings
          </NavLink>

          <NavLink to="/settings/users" style={subMenuStyle}>
            👥 User Management
          </NavLink>

          <NavLink to="/settings/notifications" style={subMenuStyle}>
            🔔 Notification Settings
          </NavLink>

          <NavLink to="/settings/appearance" style={subMenuStyle}>
            🎨 Appearance
          </NavLink>

          <NavLink to="/settings/security" style={subMenuStyle}>
            🔐 Security
          </NavLink>

          <NavLink to="/settings/backup" style={subMenuStyle}>
            💾 Backup & Restore
          </NavLink>

          <NavLink to="/settings/integrations" style={subMenuStyle}>
            🔌 Integrations
          </NavLink>

          <NavLink to="/settings/audit" style={subMenuStyle}>
            📜 Audit Logs
          </NavLink>

          <NavLink to="/settings/about" style={subMenuStyle}>
            ℹ️ About SmartChain Nexus
          </NavLink>
        </>
      )}
          </aside>
  );
}


