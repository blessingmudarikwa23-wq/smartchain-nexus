import { useEffect, useState } from "react";

import { executiveIntelligenceService } from "../services/executiveIntelligenceService";

type CEODashboardData = {
  id: number;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  profit_margin: number;
  inventory_value: number;
  order_fulfillment_rate: number;
  supplier_performance: number;
  operational_efficiency: number;
  active_risks: number;
  critical_risks: number;
  overall_status: string;
};

type KPI = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBackground: string;
  iconColor: string;
};

type MetricRowProps = {
  label: string;
  value: string;
  valueColor?: string;
};

type ProgressMetricProps = {
  label: string;
  value: number;
};

/* ==========================================================
   PROFESSIONAL ICONS
========================================================== */

function RevenueIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ProfitIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m7 16 4-5 3 3 6-8" />
    </svg>
  );
}

function InventoryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function MarginIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 2 5-6" />
    </svg>
  );
}

function FulfillmentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}

function SupplierIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  );
}

function EfficiencyIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="m16.24 16.24 2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="m16.24 7.76 2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function PerformanceIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m7 16 4-5 3 3 6-8" />
    </svg>
  );
}

function OperationsIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function InventoryPositionIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function ExecutiveDashboard() {
  const [dashboard, setDashboard] =
    useState<CEODashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExecutiveDashboard();
  }, []);

  async function loadExecutiveDashboard() {
    try {
      setLoading(true);

      const data =
        await executiveIntelligenceService.getCEODashboard();

      console.log("CEO Dashboard data:", data);

      if (data.length > 0) {
        setDashboard(data[0]);
      }
    } catch (error) {
      console.error(
        "Failed to load CEO dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     CURRENCY
  ========================================================== */

  const formatCurrency = (value: number) => {
    return `R ${Number(value || 0).toLocaleString(
      "en-ZA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  /* ==========================================================
     KPI DATA
  ========================================================== */

  const kpis: KPI[] = dashboard
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(
            dashboard.total_revenue
          ),
          description:
            "Total business revenue",
          icon: <RevenueIcon />,
          iconBackground: "#E8F0FF",
          iconColor: "#2563EB",
        },
        {
          title: "Gross Profit",
          value: formatCurrency(
            dashboard.gross_profit
          ),
          description:
            "Profit after direct costs",
          icon: <ProfitIcon />,
          iconBackground: "#E8FBF0",
          iconColor: "#16A34A",
        },
        {
          title: "Inventory Value",
          value: formatCurrency(
            dashboard.inventory_value
          ),
          description:
            "Current inventory valuation",
          icon: <InventoryIcon />,
          iconBackground: "#F3E9FF",
          iconColor: "#7C3AED",
        },
        {
          title: "Profit Margin",
          value: `${dashboard.profit_margin}%`,
          description:
            "Current gross margin",
          icon: <MarginIcon />,
          iconBackground: "#FFF3E8",
          iconColor: "#EA580C",
        },
        {
          title: "Order Fulfillment",
          value: `${dashboard.order_fulfillment_rate}%`,
          description:
            "Orders fulfilled successfully",
          icon: <FulfillmentIcon />,
          iconBackground: "#E6F8FC",
          iconColor: "#0891B2",
        },
        {
          title: "Supplier Performance",
          value: `${dashboard.supplier_performance}%`,
          description:
            "Supplier performance score",
          icon: <SupplierIcon />,
          iconBackground: "#E8FBF0",
          iconColor: "#16A34A",
        },
        {
          title: "Operational Efficiency",
          value: `${dashboard.operational_efficiency}%`,
          description:
            "Overall operational score",
          icon: <EfficiencyIcon />,
          iconBackground: "#F3E9FF",
          iconColor: "#9333EA",
        },
        {
          title: "Active Risks",
          value:
            dashboard.active_risks.toString(),
          description:
            "Currently identified risks",
          icon: <RiskIcon />,
          iconBackground: "#FFF0F0",
          iconColor: "#DC2626",
        },
      ]
    : [];

  /* ==========================================================
     STATUS COLOR
  ========================================================== */

  const statusColor =
    dashboard?.overall_status?.toLowerCase() ===
    "healthy"
      ? "#16A34A"
      : dashboard?.overall_status?.toLowerCase() ===
        "warning"
      ? "#F59E0B"
      : "#DC2626";

  return (
    <div style={page}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={header}>
        <div style={headerLeft}>
          <div style={headerIcon}>
            <DashboardIcon />
            <div style={onlineDot} />
          </div>

          <div>
            <h1 style={title}>
              Executive Intelligence
            </h1>

            <p style={subtitle}>
              CEO strategic overview and business
              performance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadExecutiveDashboard}
          style={refreshButton}
          disabled={loading}
        >
          <span style={refreshIcon}>
            ↻
          </span>

          {loading
            ? "Refreshing..."
            : "Refresh Dashboard"}
        </button>
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div style={loadingCard}>
          <div style={loadingIcon}>
            <DashboardIcon />
          </div>

          <div>
            <div style={loadingTitle}>
              Loading executive intelligence
            </div>

            <div style={loadingText}>
              Retrieving the latest CEO
              performance indicators...
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!loading && !dashboard && (
        <div style={emptyCard}>
          <div style={emptyIcon}>
            <RiskIcon />
          </div>

          <h2 style={emptyTitle}>
            No CEO dashboard data available
          </h2>

          <p style={emptyText}>
            The executive intelligence service did
            not return any dashboard data.
          </p>

          <button
            type="button"
            onClick={loadExecutiveDashboard}
            style={retryButton}
          >
            Try Again
          </button>
        </div>
      )}

      {/* ======================================================
          DASHBOARD
      ====================================================== */}

      {!loading && dashboard && (
        <>
          {/* ==================================================
              KPI GRID
          ================================================== */}

          <div style={statsGrid}>
            {kpis.map((item) => (
              <div
                key={item.title}
                style={statCard}
              >
                <div
                  style={{
                    ...statIcon,
                    background:
                      item.iconBackground,
                    color: item.iconColor,
                  }}
                >
                  {item.icon}
                </div>

                <div style={statContent}>
                  <div
                    style={{
                      ...statTitle,
                      color: item.iconColor,
                    }}
                  >
                    {item.title}
                  </div>

                  <div style={statValue}>
                    {item.value}
                  </div>

                  <div style={statDescription}>
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==================================================
              EXECUTIVE SUMMARY
          ================================================== */}

          <div style={summaryGrid}>
            {/* BUSINESS PERFORMANCE */}

            <div style={summaryCard}>
              <div style={cardHeader}>
                <div style={cardHeaderLeft}>
                  <div style={cardIconBlue}>
                    <PerformanceIcon />
                  </div>

                  <div>
                    <h2 style={cardTitle}>
                      Business Performance
                    </h2>

                    <p style={cardSubtitle}>
                      Financial performance overview
                    </p>
                  </div>
                </div>
              </div>

              <div style={metricList}>
                <MetricRow
                  label="Total Revenue"
                  value={formatCurrency(
                    dashboard.total_revenue
                  )}
                />

                <MetricRow
                  label="Total Cost"
                  value={formatCurrency(
                    dashboard.total_cost
                  )}
                />

                <MetricRow
                  label="Gross Profit"
                  value={formatCurrency(
                    dashboard.gross_profit
                  )}
                  valueColor="#16A34A"
                />

                <MetricRow
                  label="Profit Margin"
                  value={`${dashboard.profit_margin}%`}
                  valueColor="#2563EB"
                />
              </div>
            </div>

            {/* OPERATIONAL PERFORMANCE */}

            <div style={summaryCard}>
              <div style={cardHeader}>
                <div style={cardHeaderLeft}>
                  <div style={cardIconPurple}>
                    <OperationsIcon />
                  </div>

                  <div>
                    <h2 style={cardTitle}>
                      Operational Performance
                    </h2>

                    <p style={cardSubtitle}>
                      Supply chain efficiency
                      indicators
                    </p>
                  </div>
                </div>
              </div>

              <div style={performanceList}>
                <ProgressMetric
                  label="Order Fulfillment"
                  value={
                    dashboard.order_fulfillment_rate
                  }
                />

                <ProgressMetric
                  label="Supplier Performance"
                  value={
                    dashboard.supplier_performance
                  }
                />

                <ProgressMetric
                  label="Operational Efficiency"
                  value={
                    dashboard.operational_efficiency
                  }
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              RISK & STATUS
          ================================================== */}

          <div style={bottomGrid}>
            {/* STATUS */}

            <div style={statusCard}>
              <div style={statusCardHeader}>
                <div>
                  <h2 style={cardTitle}>
                    Overall Business Status
                  </h2>

                  <p style={cardSubtitle}>
                    Current executive health
                    indicator
                  </p>
                </div>

                <div
                  style={{
                    ...statusBadge,
                    background: `${statusColor}15`,
                    color: statusColor,
                  }}
                >
                  <span
                    style={{
                      ...statusDot,
                      background: statusColor,
                    }}
                  />

                  {dashboard.overall_status}
                </div>
              </div>

              <div style={statusBody}>
                <div style={statusMetric}>
                  <div
                    style={{
                      ...statusMetricIcon,
                      background: "#FFF5D8",
                      color: "#F59E0B",
                    }}
                  >
                    <RiskIcon />
                  </div>

                  <div>
                    <div style={statusMetricLabel}>
                      Active Risks
                    </div>

                    <div
                      style={statusMetricValue}
                    >
                      {dashboard.active_risks}
                    </div>
                  </div>
                </div>

                <div style={statusMetric}>
                  <div
                    style={{
                      ...statusMetricIcon,
                      background: "#FFF0F0",
                      color: "#DC2626",
                    }}
                  >
                    <RiskIcon />
                  </div>

                  <div>
                    <div style={statusMetricLabel}>
                      Critical Risks
                    </div>

                    <div
                      style={{
                        ...statusMetricValue,
                        color: "#DC2626",
                      }}
                    >
                      {dashboard.critical_risks}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INVENTORY */}

            <div style={inventoryCard}>
              <div style={cardHeader}>
                <div style={cardHeaderLeft}>
                  <div style={cardIconOrange}>
                    <InventoryPositionIcon />
                  </div>

                  <div>
                    <h2 style={cardTitle}>
                      Inventory Position
                    </h2>

                    <p style={cardSubtitle}>
                      Current inventory exposure
                    </p>
                  </div>
                </div>
              </div>

              <div style={inventoryValue}>
                {formatCurrency(
                  dashboard.inventory_value
                )}
              </div>

              <div style={inventoryDescription}>
                Current total inventory value
                across the business.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ==========================================================
   METRIC ROW
========================================================== */

function MetricRow({
  label,
  value,
  valueColor = "#0F172A",
}: MetricRowProps) {
  return (
    <div style={metricRow}>
      <span style={metricLabel}>
        {label}
      </span>

      <strong
        style={{
          ...metricValue,
          color: valueColor,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* ==========================================================
   PROGRESS METRIC
========================================================== */

function ProgressMetric({
  label,
  value,
}: ProgressMetricProps) {
  const safeValue = Math.min(
    Math.max(Number(value) || 0, 0),
    100
  );

  return (
    <div style={progressMetric}>
      <div style={progressHeader}>
        <span style={progressLabel}>
          {label}
        </span>

        <strong style={progressValue}>
          {safeValue}%
        </strong>
      </div>

      <div style={progressTrack}>
        <div
          style={{
            ...progressBar,
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ==========================================================
   PAGE
========================================================== */

const page: React.CSSProperties = {
  width: "100%",
  minHeight: "100%",
  padding: "8px 4px 40px",
  boxSizing: "border-box",
};

/* ==========================================================
   HEADER
========================================================== */

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "28px",
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const headerIcon: React.CSSProperties = {
  width: "60px",
  height: "60px",
  minWidth: "60px",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, #315FEA 0%, #1D4ED8 100%)",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxShadow:
    "0 8px 20px rgba(37,99,235,.18)",
};

const onlineDot: React.CSSProperties = {
  position: "absolute",
  right: "2px",
  bottom: "2px",
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#22C55E",
  border: "2px solid white",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#0F172A",
  letterSpacing: "-1px",
};

const subtitle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: "14px",
  color: "#64748B",
};

const refreshButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg, #2563EB 0%, #315FEA 100%)",
  color: "#FFFFFF",
  padding: "12px 18px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow:
    "0 7px 18px rgba(37,99,235,.22)",
};

const refreshIcon: React.CSSProperties = {
  fontSize: "18px",
};

/* ==========================================================
   KPI GRID
========================================================== */

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "16px",
  marginBottom: "26px",
};

const statCard: React.CSSProperties = {
  minWidth: 0,
  minHeight: "138px",
  background: "#FFFFFF",
  border: "1px solid #E6EBF3",
  borderRadius: "14px",
  padding: "17px",
  display: "flex",
  gap: "12px",
  boxSizing: "border-box",
  boxShadow:
    "0 5px 18px rgba(15,23,42,.055)",
};

const statIcon: React.CSSProperties = {
  width: "44px",
  height: "44px",
  minWidth: "44px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statContent: React.CSSProperties = {
  minWidth: 0,
  flex: 1,
  overflow: "hidden",
};

const statTitle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "6px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const statValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#0F172A",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  letterSpacing: "-0.3px",
};

const statDescription: React.CSSProperties = {
  marginTop: "10px",
  color: "#64748B",
  fontSize: "10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

/* ==========================================================
   SUMMARY
========================================================== */

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "18px",
};

const summaryCard: React.CSSProperties = {
  minWidth: 0,
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
};

const cardHeader: React.CSSProperties = {
  padding: "20px 21px",
  borderBottom: "1px solid #EEF1F5",
};

const cardHeaderLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const cardIconBlue: React.CSSProperties = {
  width: "34px",
  height: "34px",
  minWidth: "34px",
  borderRadius: "9px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardIconPurple: React.CSSProperties = {
  width: "34px",
  height: "34px",
  minWidth: "34px",
  borderRadius: "9px",
  background: "#F3E9FF",
  color: "#7C3AED",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardIconOrange: React.CSSProperties = {
  width: "34px",
  height: "34px",
  minWidth: "34px",
  borderRadius: "9px",
  background: "#FFF3E8",
  color: "#EA580C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "16px",
  fontWeight: 750,
};

const cardSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "11px",
};

/* ==========================================================
   FINANCIAL METRICS
========================================================== */

const metricList: React.CSSProperties = {
  padding: "4px 21px",
};

const metricRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  padding: "15px 0",
  borderBottom: "1px solid #F1F5F9",
  minWidth: 0,
};

const metricLabel: React.CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
  flexShrink: 0,
};

const metricValue: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 750,
  whiteSpace: "nowrap",
  textAlign: "right",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

/* ==========================================================
   PROGRESS METRICS
========================================================== */

const performanceList: React.CSSProperties = {
  padding: "21px",
};

const progressMetric: React.CSSProperties = {
  marginBottom: "21px",
};

const progressHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const progressLabel: React.CSSProperties = {
  color: "#334155",
  fontSize: "12px",
  fontWeight: 600,
};

const progressValue: React.CSSProperties = {
  color: "#2563EB",
  fontSize: "12px",
};

const progressTrack: React.CSSProperties = {
  width: "100%",
  height: "8px",
  background: "#EAF0F7",
  borderRadius: "20px",
  overflow: "hidden",
};

const progressBar: React.CSSProperties = {
  height: "100%",
  borderRadius: "20px",
  background:
    "linear-gradient(90deg, #2563EB, #5B7EF5)",
  transition: "width .3s ease",
};

/* ==========================================================
   BOTTOM SECTION
========================================================== */

const bottomGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "18px",
};

const statusCard: React.CSSProperties = {
  minWidth: 0,
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
  overflow: "hidden",
};

const statusCardHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "15px",
  padding: "20px 21px",
  borderBottom: "1px solid #EEF1F5",
};

const statusBadge: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const statusDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
};

const statusBody: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "14px",
  padding: "21px",
};

const statusMetric: React.CSSProperties = {
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: "11px",
  padding: "14px",
  background: "#F8FAFC",
  borderRadius: "12px",
};

const statusMetricIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  minWidth: "38px",
  borderRadius: "10px",
  background: "#FFF5D8",
  color: "#F59E0B",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statusMetricLabel: React.CSSProperties = {
  fontSize: "10px",
  color: "#64748B",
  marginBottom: "4px",
  whiteSpace: "nowrap",
};

const statusMetricValue: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
  color: "#0F172A",
};

const inventoryCard: React.CSSProperties = {
  minWidth: 0,
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
  overflow: "hidden",
};

const inventoryValue: React.CSSProperties = {
  padding: "22px 21px 4px",
  fontSize: "22px",
  fontWeight: 800,
  color: "#7C3AED",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const inventoryDescription: React.CSSProperties = {
  padding: "7px 21px 22px",
  fontSize: "11px",
  color: "#64748B",
  lineHeight: 1.6,
};

/* ==========================================================
   STATES
========================================================== */

const loadingCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  padding: "24px",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
};

const loadingIcon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "12px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const loadingTitle: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: 700,
  marginBottom: "4px",
};

const loadingText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
};

const emptyCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  padding: "50px 30px",
  textAlign: "center",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
};

const emptyIcon: React.CSSProperties = {
  width: "52px",
  height: "52px",
  margin: "0 auto 14px",
  borderRadius: "14px",
  background: "#FFF0F0",
  color: "#DC2626",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
};

const emptyText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  margin: "8px 0 20px",
};

const retryButton: React.CSSProperties = {
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  padding: "11px 18px",
  borderRadius: "9px",
  fontWeight: 700,
  cursor: "pointer",
};

/* ==========================================================
   RESPONSIVE DESIGN
========================================================== */

if (typeof window !== "undefined") {
  // Responsive behavior is handled primarily through the
  // dashboard container and browser layout.
}