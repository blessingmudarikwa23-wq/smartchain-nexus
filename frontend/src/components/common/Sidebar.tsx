import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

/* ==========================================================
   ICON COMPONENT
========================================================== */

const Icon = ({
  type,
  size = 20,
}: {
  type: string;
  size?: number;
}) => {
  const icons: Record<string, string> = {
    dashboard:
      "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",

    executive:
      "M4 19V9m5 10V5m5 14v-7m5 7V3",

    procurement:
      "M3 6h18M5 6l1 14h12l1-14M9 6V4h6v2M9 10v6m6-6v6",

    inventory:
      "M4 6h16v14H4V6Zm0 0 8 5 8-5M8 3h8",

    warehouse:
      "M3 20V9l9-6 9 6v11M7 20v-6h10v6M9 10h6",

    logistics:
      "M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7ZM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",

    sales:
      "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2v2Zm2-7c-.4.7-1.2 1.1-2 1.5-.6.3-1 .7-1 1.5h-2c0-1.8.9-2.7 2-3.3.7-.4 1.2-.8 1.2-1.5 0-.8-.6-1.4-1.5-1.4S10.2 8 10 9H8c.1-2 1.7-3.5 4-3.5 2.4 0 4 1.4 4 3.5 0 .7-.2 1.3-.6 2Z",

    data:
      "M4 19V5m0 14h16M8 16v-3m4 3V8m4 8V5",

    business:
      "M4 19V5m0 14h16M7 16v-4m4 4V8m4 8V6m4 10v-9",

    ai:
      "M12 3a4 4 0 0 1 4 4c0 1-.4 1.9-1 2.6 1.8.4 3 1.9 3 3.9V16H6v-2.5c0-2 1.2-3.5 3-3.9A4 4 0 0 1 8 7a4 4 0 0 1 4-4Zm-2 18h4m-5-3h6",

    lean:
      "M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",

    settings:
      "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L7.4 8.6 9.1 7l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.6 1Z",

    user:
      "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",

    chevron:
      "m9 18 6-6-6-6",

    home:
      "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z",

    close:
      "M6 6l12 12M18 6 6 18",

    profile:
      "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[type] || icons.dashboard} />
    </svg>
  );
};

/* ==========================================================
   MAIN SIDEBAR
========================================================== */

export default function Sidebar() {
  const location = useLocation();

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

  /* ==========================================================
     ROUTE GROUPS
  ========================================================== */

  const executiveRoutes = [
    "/executive-dashboard",
    "/business-kpis",
    "/financial-overview",
    "/operational-performance",
    "/risk-monitoring",
  ];

  const procurementRoutes = [
    "/suppliers",
    "/purchase-orders",
    "/spend-analytics",
    "/vendor-performance",
    "/lead-time-analysis",
  ];

  const inventoryRoutes = [
    "/inventory",
    "/inventory-transactions",
    "/inventory-adjustments",
    "/abc-analysis",
    "/xyz-analysis",
    "/eoq",
    "/safety-stock",
    "/reorder-point",
    "/inventory-turnover",
  ];

  const warehouseRoutes = [
    "/receiving",
    "/picking",
    "/packing",
    "/dispatch",
    "/cycle-counts",
    "/warehouse-performance",
  ];

  const logisticsRoutes = [
    "/fleet-performance",
    "/route-optimization",
    "/delivery-tracking",
    "/fuel-analysis",
    "/distribution-analytics",
  ];

  const salesRoutes = [
    "/customers",
    "/sales-orders",
    "/revenue-analysis",
    "/profit-margin",
  ];

  const dataScienceRoutes = [
    "/demand-forecasting",
    "/sales-prediction",
    "/supplier-risk-prediction",
    "/customer-segmentation",
    "/inventory-optimization",
    "/anomaly-detection",
  ];

  const businessIntelRoutes = [
    "/power-bi-dashboards",
    "/executive-reporting",
    "/operational-analytics",
    "/interactive-kpi-monitoring",
  ];

  const aiRoutes = [
    "/ai-supply-chain-assistant",
    "/predictive-analytics",
    "/intelligent-recommendations",
    "/natural-language-queries",
  ];

  const leanRoutes = [
    "/dmaic",
    "/sipoc",
    "/fishbone-analysis",
    "/pareto-analysis",
    "/fmea",
    "/control-charts",
    "/root-cause-analysis",
  ];

  const settingsRoutes = [
    "/settings/profile",
    "/settings/company",
    "/settings/users",
    "/settings/notifications",
    "/settings/appearance",
    "/settings/security",
    "/settings/backup",
    "/settings/integrations",
    "/settings/audit",
    "/settings/about",
  ];

  /* ==========================================================
     ROUTE MATCHING
  ========================================================== */

  const normalizePath = (path: string) => {
    if (path === "/") {
      return "/";
    }

    return path.replace(/\/+$/, "");
  };

  const currentPath = normalizePath(location.pathname);

  const routeIsActive = (route: string) => {
    const normalizedRoute = normalizePath(route);

    if (normalizedRoute === "/") {
      return currentPath === "/";
    }

    return (
      currentPath === normalizedRoute ||
      currentPath.startsWith(`${normalizedRoute}/`)
    );
  };

  const sectionIsActive = (routes: string[]) =>
    routes.some((route) => routeIsActive(route));

  /* ==========================================================
     AUTO OPEN CURRENT SECTION
     
     IMPORTANT:
     The sidebar now follows the current URL automatically.
     Only the section containing the current page is opened.
  ========================================================== */

  useEffect(() => {
    setExecutiveOpen(sectionIsActive(executiveRoutes));
    setProcurementOpen(sectionIsActive(procurementRoutes));
    setInventoryOpen(sectionIsActive(inventoryRoutes));
    setWarehouseOpen(sectionIsActive(warehouseRoutes));
    setLogisticsOpen(sectionIsActive(logisticsRoutes));
    setSalesOpen(sectionIsActive(salesRoutes));
    setDataScienceOpen(sectionIsActive(dataScienceRoutes));
    setBusinessIntelOpen(sectionIsActive(businessIntelRoutes));
    setAiOpen(sectionIsActive(aiRoutes));
    setLeanOpen(sectionIsActive(leanRoutes));
    setSettingsOpen(sectionIsActive(settingsRoutes));
  }, [location.pathname]);

  /* ==========================================================
     STYLES
  ========================================================== */

  const sidebarStyle = {
    width: "280px",
    minWidth: "280px",
    height: "100vh",
    position: "sticky" as const,
    top: 0,
    left: 0,
    flexShrink: 0,
    background:
      "linear-gradient(180deg, #06152F 0%, #081B3A 45%, #07152F 100%)",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column" as const,
    boxSizing: "border-box" as const,
    borderRight: "1px solid rgba(148, 163, 184, 0.10)",
    overflow: "hidden",
    zIndex: 1000,
  };

  const logoAreaStyle = {
    height: "96px",
    minHeight: "96px",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    boxSizing: "border-box" as const,
    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
  };

  const logoBoxStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563EB, #3B82F6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.30)",
    flexShrink: 0,
  };

  const menuContainerStyle = {
    flex: 1,
    overflowY: "auto" as const,
    padding: "18px 15px 15px",
    boxSizing: "border-box" as const,
  };

  const sectionLabelStyle = {
    color: "#64748B",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.4px",
    padding: "10px 13px 8px",
    textTransform: "uppercase" as const,
  };

  /* ==========================================================
     MENU ITEM
  ========================================================== */

  const menuItemStyle = (
    active: boolean,
    open: boolean = false
  ) => ({
    width: "100%",
    minHeight: "46px",
    boxSizing: "border-box" as const,
    color: active || open ? "#FFFFFF" : "#CBD5E1",
    background: active
      ? "linear-gradient(90deg, #1558C7 0%, #1D4ED8 100%)"
      : open
      ? "rgba(37, 99, 235, 0.10)"
      : "transparent",
    textDecoration: "none",
    padding: "11px 13px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "9px",
    marginBottom: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,

    fontSize: "15px",

    fontWeight: active ? 700 : 550,
    transition: "all 0.2s ease",
    border: "1px solid transparent",
    boxShadow: active
      ? "0 6px 16px rgba(37, 99, 235, 0.24)"
      : "none",
  });

  const submenuStyle = (active: boolean) => ({
    position: "relative" as const,
    color: active ? "#FFFFFF" : "#94A3B8",
    background: active
      ? "rgba(37, 99, 235, 0.20)"
      : "transparent",
    textDecoration: "none",
    padding: "9px 12px 9px 52px",
    display: "flex",
    alignItems: "center",
    minHeight: "38px",
    boxSizing: "border-box" as const,
    borderRadius: "7px",
    marginBottom: "2px",

    fontSize: "14px",

    fontWeight: active ? 650 : 500,
    whiteSpace: "nowrap" as const,
    transition: "all 0.2s ease",
  });

  /* ==========================================================
     GROUP COMPONENT
  ========================================================== */

  const Section = ({
    title,
    icon,
    open,
    setOpen,
    routes,
    children,
  }: {
    title: string;
    icon: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    routes: string[];
    children: React.ReactNode;
  }) => {
    const active = sectionIsActive(routes);

    return (
      <div style={{ marginBottom: "3px" }}>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          style={{
            ...menuItemStyle(active, open),
            border: "none",
            fontFamily: "inherit",
            textAlign: "left" as const,
          }}
        >
          <span
            style={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active || open ? "#FFFFFF" : "#94A3B8",
              flexShrink: 0,
            }}
          >
            <Icon type={icon} size={19} />
          </span>

          <span style={{ flex: 1 }}>{title}</span>

          <span
            style={{
              width: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              color: "#94A3B8",
            }}
          >
            <Icon type="chevron" size={15} />
          </span>
        </button>

        {open && (
          <div
            style={{
              marginLeft: "10px",
              paddingLeft: "9px",
              borderLeft: "1px solid rgba(148, 163, 184, 0.16)",
              marginBottom: "7px",
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  /* ==========================================================
     SIMPLE NAV ITEM
  ========================================================== */

  const SimpleNav = ({
    to,
    title,
    icon,
  }: {
    to: string;
    title: string;
    icon: string;
  }) => (
    <NavLink
      to={to}
      end={to === "/"}
      style={() => menuItemStyle(routeIsActive(to))}
    >
      {() => {
        const isActive = routeIsActive(to);

        return (
          <>
            <span
              style={{
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "#FFFFFF" : "#94A3B8",
                flexShrink: 0,
              }}
            >
              <Icon type={icon} size={19} />
            </span>

            <span style={{ flex: 1 }}>{title}</span>

            {isActive && (
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#60A5FA",
                  boxShadow: "0 0 8px rgba(96,165,250,.8)",
                }}
              />
            )}
          </>
        );
      }}
    </NavLink>
  );

  /* ==========================================================
     SUB NAV
  ========================================================== */

  const SubNav = ({
    to,
    title,
  }: {
    to: string;
    title: string;
  }) => (
    <NavLink
      to={to}
      style={() => submenuStyle(routeIsActive(to))}
    >
      {() => {
        const isActive = routeIsActive(to);

        return (
          <>
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  left: "-10px",
                  width: "5px",
                  height: "22px",
                  borderRadius: "4px",
                  background: "#3B82F6",
                  boxShadow: "0 0 10px rgba(59,130,246,.65)",
                }}
              />
            )}

            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isActive ? "#3B82F6" : "#475569",
                marginRight: "2px",
                flexShrink: 0,
              }}
            />

            <span>{title}</span>
          </>
        );
      }}
    </NavLink>
  );

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <aside style={sidebarStyle}>
      {/* ======================================================
          BRAND
      ====================================================== */}

      <div style={logoAreaStyle}>
        <div style={logoBoxStyle}>
          <div
            style={{
              width: "18px",
              height: "18px",
              border: "3px solid #FFFFFF",
              borderRadius: "4px",
              transform: "rotate(45deg)",
              opacity: 0.95,
            }}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 800,
              letterSpacing: "-0.4px",
              lineHeight: 1.1,
            }}
          >
            SmartChain{" "}
            <span style={{ color: "#3B82F6" }}>Nexus</span>
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: "9px",
              marginTop: "5px",
              letterSpacing: "0.35px",
              fontWeight: 600,
            }}
          >
            SUPPLY CHAIN INTELLIGENCE
          </div>
        </div>
      </div>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <div
        style={{
          ...menuContainerStyle,
          scrollbarWidth: "thin",
          scrollbarColor: "#1E3A67 transparent",
        }}
      >
        <div style={sectionLabelStyle}>Main Navigation</div>

        <SimpleNav
          to="/"
          title="Dashboard"
          icon="home"
        />

        {/* ====================================================
            EXECUTIVE INTELLIGENCE
        ==================================================== */}

        <Section
          title="Executive Intelligence"
          icon="executive"
          open={executiveOpen}
          setOpen={setExecutiveOpen}
          routes={executiveRoutes}
        >
          <SubNav
            to="/executive-dashboard"
            title="CEO Dashboard"
          />

          <SubNav
            to="/business-kpis"
            title="Business KPIs"
          />

          <SubNav
            to="/financial-overview"
            title="Financial Overview"
          />

          <SubNav
            to="/operational-performance"
            title="Operational Performance"
          />

          <SubNav
            to="/risk-monitoring"
            title="Risk Monitoring"
          />
        </Section>

        {/* ====================================================
            PROCUREMENT
        ==================================================== */}

        <Section
          title="Procurement"
          icon="procurement"
          open={procurementOpen}
          setOpen={setProcurementOpen}
          routes={procurementRoutes}
        >
          <SubNav
            to="/suppliers"
            title="Supplier Management"
          />

          <SubNav
            to="/purchase-orders"
            title="Purchase Orders"
          />

          <SubNav
            to="/spend-analytics"
            title="Spend Analytics"
          />

          <SubNav
            to="/vendor-performance"
            title="Vendor Performance"
          />

          <SubNav
            to="/lead-time-analysis"
            title="Lead Time Analysis"
          />
        </Section>

        {/* ====================================================
            INVENTORY
        ==================================================== */}

        <Section
          title="Inventory"
          icon="inventory"
          open={inventoryOpen}
          setOpen={setInventoryOpen}
          routes={inventoryRoutes}
        >
          <SubNav
            to="/inventory"
            title="Stock Monitoring"
          />

          <SubNav
            to="/inventory-transactions"
            title="Inventory Transactions"
          />

          <SubNav
            to="/inventory-adjustments"
            title="Inventory Adjustments"
          />

          <SubNav
            to="/abc-analysis"
            title="ABC Analysis"
          />

          <SubNav
            to="/xyz-analysis"
            title="XYZ Analysis"
          />

          <SubNav
            to="/eoq"
            title="EOQ"
          />

          <SubNav
            to="/safety-stock"
            title="Safety Stock"
          />

          <SubNav
            to="/reorder-point"
            title="Reorder Point"
          />

          <SubNav
            to="/inventory-turnover"
            title="Inventory Turnover"
          />
        </Section>

        {/* ====================================================
            WAREHOUSE
        ==================================================== */}

        <Section
          title="Warehouse"
          icon="warehouse"
          open={warehouseOpen}
          setOpen={setWarehouseOpen}
          routes={warehouseRoutes}
        >
          <SubNav
            to="/receiving"
            title="Receiving"
          />

          <SubNav
            to="/picking"
            title="Picking"
          />

          <SubNav
            to="/packing"
            title="Packing"
          />

          <SubNav
            to="/dispatch"
            title="Dispatch"
          />

          <SubNav
            to="/cycle-counts"
            title="Cycle Counts"
          />

          <SubNav
            to="/warehouse-performance"
            title="Warehouse Performance"
          />
        </Section>

        {/* ====================================================
            LOGISTICS
        ==================================================== */}

        <Section
          title="Logistics"
          icon="logistics"
          open={logisticsOpen}
          setOpen={setLogisticsOpen}
          routes={logisticsRoutes}
        >
          <SubNav
            to="/fleet-performance"
            title="Fleet Performance"
          />

          <SubNav
            to="/route-optimization"
            title="Route Optimization"
          />

          <SubNav
            to="/delivery-tracking"
            title="Delivery Tracking"
          />

          <SubNav
            to="/fuel-analysis"
            title="Fuel Analysis"
          />

          <SubNav
            to="/distribution-analytics"
            title="Distribution Analytics"
          />
        </Section>

        {/* ====================================================
            SALES
        ==================================================== */}

        <Section
          title="Sales"
          icon="sales"
          open={salesOpen}
          setOpen={setSalesOpen}
          routes={salesRoutes}
        >
          <SubNav
            to="/customers"
            title="Customer Management"
          />

          <SubNav
            to="/sales-orders"
            title="Sales Orders"
          />

          <SubNav
            to="/revenue-analysis"
            title="Revenue Analysis"
          />

          <SubNav
            to="/profit-margin"
            title="Profit Margin"
          />
        </Section>

        <div
          style={{
            height: "1px",
            background: "rgba(148,163,184,.08)",
            margin: "14px 8px",
          }}
        />

        <div style={sectionLabelStyle}>
          Intelligence & Analytics
        </div>

        {/* ====================================================
            DATA SCIENCE
        ==================================================== */}

        <Section
          title="Data Science"
          icon="data"
          open={dataScienceOpen}
          setOpen={setDataScienceOpen}
          routes={dataScienceRoutes}
        >
          <SubNav
            to="/demand-forecasting"
            title="Demand Forecasting"
          />

          <SubNav
            to="/sales-prediction"
            title="Sales Prediction"
          />

          <SubNav
            to="/supplier-risk-prediction"
            title="Supplier Risk Prediction"
          />

          <SubNav
            to="/customer-segmentation"
            title="Customer Segmentation"
          />

          <SubNav
            to="/inventory-optimization"
            title="Inventory Optimization"
          />

          <SubNav
            to="/anomaly-detection"
            title="Anomaly Detection"
          />
        </Section>

        {/* ====================================================
            BUSINESS INTELLIGENCE
        ==================================================== */}

        <Section
          title="Business Intelligence"
          icon="business"
          open={businessIntelOpen}
          setOpen={setBusinessIntelOpen}
          routes={businessIntelRoutes}
        >
          <SubNav
            to="/power-bi-dashboards"
            title="Power BI Dashboards"
          />

          <SubNav
            to="/executive-reporting"
            title="Executive Reporting"
          />

          <SubNav
            to="/operational-analytics"
            title="Operational Analytics"
          />

          <SubNav
            to="/interactive-kpi-monitoring"
            title="Interactive KPI Monitoring"
          />
        </Section>

        {/* ====================================================
            ARTIFICIAL INTELLIGENCE
        ==================================================== */}

        <Section
          title="Artificial Intelligence"
          icon="ai"
          open={aiOpen}
          setOpen={setAiOpen}
          routes={aiRoutes}
        >
          <SubNav
            to="/ai-supply-chain-assistant"
            title="AI Supply Chain Assistant"
          />

          <SubNav
            to="/predictive-analytics"
            title="Predictive Analytics"
          />

          <SubNav
            to="/intelligent-recommendations"
            title="Intelligent Recommendations"
          />

          <SubNav
            to="/natural-language-queries"
            title="Natural Language Queries"
          />
        </Section>

        <div
          style={{
            height: "1px",
            background: "rgba(148,163,184,.08)",
            margin: "14px 8px",
          }}
        />

        <div style={sectionLabelStyle}>
          Process Excellence
        </div>

        {/* ====================================================
            LEAN SIX SIGMA
        ==================================================== */}

        <Section
          title="Lean Six Sigma"
          icon="lean"
          open={leanOpen}
          setOpen={setLeanOpen}
          routes={leanRoutes}
        >
          <SubNav
            to="/dmaic"
            title="DMAIC"
          />

          <SubNav
            to="/sipoc"
            title="SIPOC"
          />

          <SubNav
            to="/fishbone-analysis"
            title="Fishbone Analysis"
          />

          <SubNav
            to="/pareto-analysis"
            title="Pareto Analysis"
          />

          <SubNav
            to="/fmea"
            title="FMEA"
          />

          <SubNav
            to="/control-charts"
            title="Control Charts"
          />

          <SubNav
            to="/root-cause-analysis"
            title="Root Cause Analysis"
          />
        </Section>

        <div
          style={{
            height: "1px",
            background: "rgba(148,163,184,.08)",
            margin: "14px 8px",
          }}
        />

        <div style={sectionLabelStyle}>
          System
        </div>

        {/* ====================================================
            SETTINGS
        ==================================================== */}

        <Section
          title="Settings"
          icon="settings"
          open={settingsOpen}
          setOpen={setSettingsOpen}
          routes={settingsRoutes}
        >
          <SubNav
            to="/settings/profile"
            title="Profile Settings"
          />

          <SubNav
            to="/settings/company"
            title="Company Settings"
          />

          <SubNav
            to="/settings/users"
            title="User Management"
          />

          <SubNav
            to="/settings/notifications"
            title="Notification Settings"
          />

          <SubNav
            to="/settings/appearance"
            title="Appearance"
          />

          <SubNav
            to="/settings/security"
            title="Security"
          />

          <SubNav
            to="/settings/backup"
            title="Backup & Restore"
          />

          <SubNav
            to="/settings/integrations"
            title="Integrations"
          />

          <SubNav
            to="/settings/audit"
            title="Audit Logs"
          />

          <SubNav
            to="/settings/about"
            title="About SmartChain Nexus"
          />
        </Section>
      </div>

      {/* ======================================================
          USER PROFILE CARD
      ====================================================== */}

      <div
        style={{
          padding: "12px 15px 15px",
          borderTop: "1px solid rgba(148,163,184,.10)",
          background:
            "linear-gradient(180deg, rgba(8,27,58,.25), rgba(5,18,42,.8))",
        }}
      >
        <div
          style={{
            background: "rgba(15, 39, 76, 0.72)",
            border: "1px solid rgba(96,165,250,.13)",
            borderRadius: "12px",
            padding: "11px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Avatar */}

          <div
            style={{
              position: "relative",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "14px",
              flexShrink: 0,
              boxShadow: "0 5px 14px rgba(37,99,235,.3)",
            }}
          >
            BM

            <span
              style={{
                position: "absolute",
                right: "-1px",
                bottom: "0px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#10B981",
                border: "2px solid #102B52",
              }}
            />
          </div>

          {/* User details */}

          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 750,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Blessing Mudarikwa
            </div>

            <div
              style={{
                color: "#94A3B8",
                fontSize: "10px",
                marginTop: "3px",
              }}
            >
              Administrator
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "#10B981",
                fontSize: "10px",
                marginTop: "3px",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10B981",
                }}
              />

              Online
            </div>
          </div>

          {/* Profile icon */}

          <NavLink
            to="/settings/profile"
            style={{
              width: "27px",
              height: "27px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              borderRadius: "6px",
              textDecoration: "none",
            }}
            title="Profile Settings"
          >
            <Icon type="chevron" size={15} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}