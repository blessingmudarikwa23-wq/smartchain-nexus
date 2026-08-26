import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import api from "../services/api";

type SpendAnalyticsData = {
  total_spend: number;
  total_purchase_orders: number;
  average_order_value: number;
  top_supplier: string | null;
  top_supplier_spend: number;
  currency: string;
};

/* ==========================================================
   PROFESSIONAL SVG ICONS
   ========================================================== */

type IconName =
  | "chart"
  | "money"
  | "orders"
  | "average"
  | "supplier"
  | "trend"
  | "analytics"
  | "arrow"
  | "database"
  | "check"
  | "refresh"
  | "alert";

function Icon({
  name,
  size = 22,
  strokeWidth = 2,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19H20" />
          <path d="M7 15L10 11L13 13L18 7" />
          <circle cx="7" cy="15" r="1" />
          <circle cx="10" cy="11" r="1" />
          <circle cx="13" cy="13" r="1" />
          <circle cx="18" cy="7" r="1" />
        </svg>
      );

    case "money":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M7 9H7.01" />
          <path d="M17 15H17.01" />
        </svg>
      );

    case "orders":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 3.5V2.5H15V3.5" />
          <path d="M9 8H15" />
          <path d="M9 12H15" />
          <path d="M9 16H13" />
        </svg>
      );

    case "average":
      return (
        <svg {...common}>
          <path d="M5 19V10" />
          <path d="M12 19V5" />
          <path d="M19 19V8" />
          <path d="M3 19H21" />
        </svg>
      );

    case "supplier":
      return (
        <svg {...common}>
          <path d="M3 21H21" />
          <path d="M5 21V8L12 4L19 8V21" />
          <path d="M8 11H10" />
          <path d="M14 11H16" />
          <path d="M8 15H10" />
          <path d="M14 15H16" />
          <path d="M10 21V18H14V21" />
        </svg>
      );

    case "trend":
      return (
        <svg {...common}>
          <path d="M4 17L9 12L13 15L20 7" />
          <path d="M15 7H20V12" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19H20" />
          <rect x="7" y="12" width="2.5" height="4" rx="0.5" />
          <rect x="11" y="9" width="2.5" height="7" rx="0.5" />
          <rect x="15" y="6" width="2.5" height="10" rx="0.5" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12H19" />
          <path d="M13 6L19 12L13 18" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5V12C5 13.7 8.1 15 12 15C15.9 15 19 13.7 19 12V5" />
          <path d="M5 12V19C5 20.7 8.1 22 12 22C15.9 22 19 20.7 19 19V12" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="M5 12L10 17L19 7" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11A8.1 8.1 0 0 0 5.4 6.3L4 8" />
          <path d="M4 4V8H8" />
          <path d="M4 13A8.1 8.1 0 0 0 18.6 17.7L20 16" />
          <path d="M20 20V16H16" />
        </svg>
      );

    case "alert":
      return (
        <svg {...common}>
          <path d="M10.3 3.8L2.5 17.2C1.7 18.6 2.7 20.3 4.3 20.3H19.7C21.3 20.3 22.3 18.6 21.5 17.2L13.7 3.8C12.9 2.4 11.1 2.4 10.3 3.8Z" />
          <path d="M12 9V13" />
          <path d="M12 16H12.01" />
        </svg>
      );

    default:
      return null;
  }
}

/* ==========================================================
   MAIN COMPONENT
   ========================================================== */

export default function SpendAnalytics() {
  const [analytics, setAnalytics] =
    useState<SpendAnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSpendAnalytics();
  }, []);

  const loadSpendAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<SpendAnalyticsData>(
        "/procurement/spend-analytics"
      );

      setAnalytics(response.data);
    } catch (error) {
      console.error(
        "Failed to load spend analytics:",
        error
      );

      setError(
        "Failed to load spend analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: analytics?.currency || "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const supplierShare = useMemo(() => {
    if (
      !analytics ||
      analytics.total_spend <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (analytics.top_supplier_spend /
          analytics.total_spend) *
          100
      )
    );
  }, [analytics]);

  /* ========================================================
     LOADING STATE
     ======================================================== */

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingContainerStyle}>
          <div style={loadingIconStyle}>
            <Icon
              name="analytics"
              size={28}
            />
          </div>

          <h2 style={loadingTitleStyle}>
            Loading Spend Analytics
          </h2>

          <p style={loadingTextStyle}>
            Preparing procurement intelligence and
            supplier performance insights...
          </p>

          <div style={loadingBarTrackStyle}>
            <div style={loadingBarStyle} />
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
     ERROR STATE
     ======================================================== */

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={eyebrowStyle}>
            <span style={eyebrowDotStyle} />
            PROCUREMENT INTELLIGENCE
          </div>

          <div style={headerRowStyle}>
            <div>
              <h1 style={headingStyle}>
                Spend Analytics
              </h1>

              <p style={subtitleStyle}>
                Procurement spending, supplier
                concentration and purchasing efficiency.
              </p>
            </div>
          </div>
        </div>

        <div style={errorStyle}>
          <div style={errorIconStyle}>
            <Icon
              name="alert"
              size={22}
            />
          </div>

          <div>
            <strong style={errorTitleStyle}>
              Unable to load Spend Analytics
            </strong>

            <p style={errorTextStyle}>
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadSpendAnalytics}
            style={retryButtonStyle}
          >
            <Icon
              name="refresh"
              size={16}
            />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================
     EMPTY STATE
     ======================================================== */

  if (!analytics) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={eyebrowStyle}>
            <span style={eyebrowDotStyle} />
            PROCUREMENT INTELLIGENCE
          </div>

          <h1 style={headingStyle}>
            Spend Analytics
          </h1>

          <p style={subtitleStyle}>
            No spend analytics data is currently
            available.
          </p>
        </div>

        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>
            <Icon
              name="database"
              size={30}
            />
          </div>

          <h2 style={emptyTitleStyle}>
            No Procurement Data
          </h2>

          <p style={emptyTextStyle}>
            Spend analytics will appear here once
            procurement data becomes available.
          </p>
        </div>
      </div>
    );
  }

  /* ========================================================
     MAIN PAGE
     ======================================================== */

  return (
    <div style={pageStyle}>
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <div style={headerStyle}>
        <div style={eyebrowStyle}>
          <span style={eyebrowDotStyle} />
          LIVE PROCUREMENT INTELLIGENCE
        </div>

        <div style={headerRowStyle}>
          <div>
            <h1 style={headingStyle}>
              Spend Analytics
            </h1>

            <p style={subtitleStyle}>
              Procurement spending, supplier
              concentration and purchasing efficiency.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSpendAnalytics}
            style={refreshButtonStyle}
          >
            <Icon
              name="refresh"
              size={17}
            />
            Refresh Data
          </button>
        </div>
      </div>

      {/* ====================================================
          KPI CARDS
      ==================================================== */}

      <div style={kpiGridStyle}>
        {/* TOTAL SPEND */}

        <AnalyticsCard
          title="Total Procurement Spend"
          value={formatCurrency(
            analytics.total_spend
          )}
          description="Total value of procurement activity"
          icon="money"
          accent="#16A34A"
          softBackground="#ECFDF3"
        />

        {/* PURCHASE ORDERS */}

        <AnalyticsCard
          title="Purchase Orders"
          value={analytics.total_purchase_orders.toLocaleString(
            "en-ZA"
          )}
          description="Total procurement orders recorded"
          icon="orders"
          accent="#2563EB"
          softBackground="#EFF6FF"
        />

        {/* AVERAGE ORDER */}

        <AnalyticsCard
          title="Average Order Value"
          value={formatCurrency(
            analytics.average_order_value
          )}
          description="Average value per purchase order"
          icon="average"
          accent="#7C3AED"
          softBackground="#F5F3FF"
        />

        {/* TOP SUPPLIER */}

        <AnalyticsCard
          title="Top Supplier"
          value={
            analytics.top_supplier ||
            "No supplier data"
          }
          description="Supplier with highest procurement spend"
          icon="supplier"
          accent="#D97706"
          softBackground="#FFFBEB"
          compact
        />
      </div>

      {/* ====================================================
          ANALYTICS OVERVIEW
      ==================================================== */}

      <div style={overviewGridStyle}>
        {/* TOP SUPPLIER PANEL */}

        <div style={largePanelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <div style={panelEyebrowStyle}>
                SUPPLIER PERFORMANCE
              </div>

              <h2 style={panelTitleStyle}>
                Top Supplier Spend
              </h2>

              <p style={panelSubtitleStyle}>
                Supplier contributing the highest
                procurement value.
              </p>
            </div>

            <div
              style={{
                ...panelIconStyle,
                background: "#FFF7E8",
                color: "#D97706",
              }}
            >
              <Icon
                name="supplier"
                size={21}
              />
            </div>
          </div>

          <div style={supplierHighlightStyle}>
            <div style={supplierMainStyle}>
              <div style={supplierAvatarStyle}>
                <Icon
                  name="supplier"
                  size={25}
                />
              </div>

              <div style={{ minWidth: 0 }}>
                <span style={smallLabelStyle}>
                  LEADING SUPPLIER
                </span>

                <div style={supplierNameStyle}>
                  {analytics.top_supplier ||
                    "No supplier data"}
                </div>
              </div>
            </div>

            <div style={supplierSpendStyle}>
              <span style={smallLabelStyle}>
                PROCUREMENT SPEND
              </span>

              <strong>
                {formatCurrency(
                  analytics.top_supplier_spend
                )}
              </strong>
            </div>
          </div>

          {/* SUPPLIER CONCENTRATION */}

          <div style={concentrationSectionStyle}>
            <div style={concentrationHeaderStyle}>
              <span>
                Share of total procurement spend
              </span>

              <strong>
                {supplierShare.toFixed(1)}%
              </strong>
            </div>

            <div style={progressTrackStyle}>
              <div
                style={{
                  ...progressFillStyle,
                  width: `${supplierShare}%`,
                }}
              />
            </div>

            <div style={concentrationFooterStyle}>
              <span>
                Top supplier contribution
              </span>

              <span>
                {formatCurrency(
                  analytics.top_supplier_spend
                )}
              </span>
            </div>
          </div>
        </div>

        {/* PROCUREMENT EFFICIENCY */}

        <div style={largePanelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <div style={panelEyebrowStyle}>
                PROCUREMENT PERFORMANCE
              </div>

              <h2 style={panelTitleStyle}>
                Purchasing Efficiency
              </h2>

              <p style={panelSubtitleStyle}>
                Current procurement activity and
                order-value indicators.
              </p>
            </div>

            <div
              style={{
                ...panelIconStyle,
                background: "#EEF4FF",
                color: "#2563EB",
              }}
            >
              <Icon
                name="trend"
                size={21}
              />
            </div>
          </div>

          <div style={efficiencyGridStyle}>
            <MetricRow
              label="Total Spend"
              value={formatCurrency(
                analytics.total_spend
              )}
              icon="money"
            />

            <MetricRow
              label="Purchase Orders"
              value={analytics.total_purchase_orders.toLocaleString(
                "en-ZA"
              )}
              icon="orders"
            />

            <MetricRow
              label="Average Order Value"
              value={formatCurrency(
                analytics.average_order_value
              )}
              icon="average"
            />

            <MetricRow
              label="Reporting Currency"
              value={
                analytics.currency ||
                "ZAR"
              }
              icon="chart"
            />
          </div>
        </div>
      </div>

      {/* ====================================================
          PROCUREMENT SUMMARY
      ==================================================== */}

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <div style={panelEyebrowStyle}>
              EXECUTIVE SUMMARY
            </div>

            <h2 style={sectionTitleStyle}>
              Procurement Overview
            </h2>

            <p style={sectionSubtitleStyle}>
              Consolidated indicators from the current
              purchase order dataset.
            </p>
          </div>

          <div
            style={{
              ...panelIconStyle,
              background: "#EEF4FF",
              color: "#2563EB",
            }}
          >
            <Icon
              name="analytics"
              size={21}
            />
          </div>
        </div>

        <div style={summaryGridStyle}>
          <SummaryCard
            label="Total Spend"
            value={formatCurrency(
              analytics.total_spend
            )}
            icon="money"
            accent="#16A34A"
          />

          <SummaryCard
            label="Purchase Orders"
            value={analytics.total_purchase_orders.toLocaleString(
              "en-ZA"
            )}
            icon="orders"
            accent="#2563EB"
          />

          <SummaryCard
            label="Average Order"
            value={formatCurrency(
              analytics.average_order_value
            )}
            icon="average"
            accent="#7C3AED"
          />

          <SummaryCard
            label="Currency"
            value={
              analytics.currency ||
              "ZAR"
            }
            icon="chart"
            accent="#D97706"
          />
        </div>
      </div>

      {/* ====================================================
          DATA STATUS
      ==================================================== */}

      <div style={statusBarStyle}>
        <div style={statusLeftStyle}>
          <div style={statusIndicatorStyle}>
            <Icon
              name="check"
              size={15}
            />
          </div>

          <div>
            <strong style={statusTitleStyle}>
              Procurement data synchronized
            </strong>

            <span style={statusTextStyle}>
              Analytics reflect the latest available
              purchase order information.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSpendAnalytics}
          style={statusRefreshButtonStyle}
        >
          <Icon
            name="refresh"
            size={15}
          />
          Update
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   REUSABLE COMPONENTS
   ========================================================== */

function AnalyticsCard({
  title,
  value,
  description,
  icon,
  accent,
  softBackground,
  compact = false,
}: {
  title: string;
  value: string;
  description: string;
  icon: IconName;
  accent: string;
  softBackground: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        borderTop: `3px solid ${accent}`,
      }}
    >
      <div style={cardTopStyle}>
        <div
          style={{
            ...iconStyle,
            background: softBackground,
            color: accent,
          }}
        >
          <Icon
            name={icon}
            size={23}
          />
        </div>

        <div style={cardAccentLineStyle}>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div style={titleStyle}>
        {title}
      </div>

      <div
        style={{
          ...valueStyle,
          color: compact
            ? "#0F172A"
            : accent,
          fontSize: compact
            ? "21px"
            : "27px",
        }}
      >
        {value}
      </div>

      <div style={cardFooterStyle}>
        {description}
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: IconName;
}) {
  return (
    <div style={metricRowStyle}>
      <div style={metricIconStyle}>
        <Icon
          name={icon}
          size={17}
        />
      </div>

      <div style={metricLabelWrapperStyle}>
        <span style={metricLabelStyle}>
          {label}
        </span>

        <strong style={metricValueStyle}>
          {value}
        </strong>
      </div>

      <Icon
        name="arrow"
        size={15}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: IconName;
  accent: string;
}) {
  return (
    <div style={summaryCardStyle}>
      <div
        style={{
          ...summaryIconStyle,
          color: accent,
          background: `${accent}10`,
        }}
      >
        <Icon
          name={icon}
          size={19}
        />
      </div>

      <div style={summaryContentStyle}>
        <span style={labelStyle}>
          {label}
        </span>

        <strong
          style={{
            ...summaryValueStyle,
            color: accent,
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

/* ==========================================================
   PAGE STYLES
   ========================================================== */

const pageStyle: CSSProperties = {
  padding: "36px 40px 45px",
  background:
    "linear-gradient(180deg, #F8FAFC 0%, #F6F8FC 100%)",
  minHeight: "100vh",
  boxSizing: "border-box",
  color: "#0F172A",
};

/* ==========================================================
   HEADER
   ========================================================== */

const headerStyle: CSSProperties = {
  marginBottom: "30px",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "25px",
  flexWrap: "wrap",
};

const eyebrowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  color: "#16A34A",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1.4px",
  marginBottom: "9px",
};

const eyebrowDotStyle: CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#16A34A",
  boxShadow:
    "0 0 0 4px rgba(22, 163, 74, 0.10)",
};

const headingStyle: CSSProperties = {
  fontSize: "36px",
  fontWeight: 800,
  color: "#0F172A",
  margin: 0,
  marginBottom: "8px",
  letterSpacing: "-1px",
  lineHeight: 1.15,
};

const subtitleStyle: CSSProperties = {
  color: "#64748B",
  margin: 0,
  fontSize: "14px",
  lineHeight: 1.6,
};

const refreshButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  border: "1px solid #DCE5F1",
  background: "#FFFFFF",
  color: "#334155",
  padding: "11px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "13px",
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.04)",
};

/* ==========================================================
   KPI CARDS
   ========================================================== */

const kpiGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const cardStyle: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E5EAF1",
  padding: "21px",
  minHeight: "185px",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.055)",
  boxSizing: "border-box",
  overflow: "hidden",
};

const cardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const iconStyle: CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardAccentLineStyle: CSSProperties = {
  display: "flex",
  gap: "4px",
  alignItems: "center",
};

const cardFooterStyle: CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "12px",
  lineHeight: 1.4,
};

const titleStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
};

const valueStyle: CSSProperties = {
  margin: 0,
  fontWeight: 800,
  lineHeight: 1.2,
  wordBreak: "break-word",
  letterSpacing: "-0.5px",
};

/* ==========================================================
   OVERVIEW PANELS
   ========================================================== */

const overviewGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1.15fr) minmax(0, 0.85fr)",
  gap: "20px",
  marginBottom: "24px",
};

const largePanelStyle: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "17px",
  border: "1px solid #E5EAF1",
  padding: "25px",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.055)",
  boxSizing: "border-box",
};

const panelHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "18px",
  marginBottom: "23px",
};

const panelEyebrowStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "1.1px",
  marginBottom: "5px",
};

const panelTitleStyle: CSSProperties = {
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: 800,
  margin: 0,
  marginBottom: "5px",
  letterSpacing: "-0.3px",
};

const panelSubtitleStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
  margin: 0,
  lineHeight: 1.5,
};

const panelIconStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

/* ==========================================================
   SUPPLIER HIGHLIGHT
   ========================================================== */

const supplierHighlightStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) auto",
  gap: "20px",
  alignItems: "center",
  padding: "20px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #FFFBEB 0%, #FFFDF7 100%)",
  border: "1px solid #FDECC8",
  marginBottom: "22px",
};

const supplierMainStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  minWidth: 0,
};

const supplierAvatarStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "13px",
  background: "#FFFFFF",
  color: "#D97706",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.06)",
};

const smallLabelStyle: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: "1px",
  marginBottom: "4px",
};

const supplierNameStyle: CSSProperties = {
  color: "#0F172A",
  fontSize: "18px",
  fontWeight: 800,
  wordBreak: "break-word",
};

const supplierSpendStyle: CSSProperties = {
  textAlign: "right",
  whiteSpace: "nowrap",
};

const supplierSpendValueStyle: CSSProperties = {
  color: "#16A34A",
  fontSize: "18px",
  fontWeight: 800,
};

const concentrationSectionStyle: CSSProperties = {
  paddingTop: "2px",
};

const concentrationHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  color: "#64748B",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "9px",
};

const progressTrackStyle: CSSProperties = {
  width: "100%",
  height: "8px",
  borderRadius: "99px",
  background: "#E2E8F0",
  overflow: "hidden",
};

const progressFillStyle: CSSProperties = {
  height: "100%",
  minWidth: "4px",
  borderRadius: "99px",
  background:
    "linear-gradient(90deg, #D97706, #F59E0B)",
  transition: "width 0.4s ease",
};

const concentrationFooterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  marginTop: "9px",
  color: "#94A3B8",
  fontSize: "10px",
};

/* ==========================================================
   EFFICIENCY PANEL
   ========================================================== */

const efficiencyGridStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const metricRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  padding: "12px",
  borderRadius: "11px",
  background: "#F8FAFC",
  border: "1px solid #EEF2F7",
  color: "#94A3B8",
};

const metricIconStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  background: "#FFFFFF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const metricLabelWrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  flex: 1,
  minWidth: 0,
};

const metricLabelStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "11px",
  fontWeight: 600,
};

const metricValueStyle: CSSProperties = {
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: 800,
  wordBreak: "break-word",
};

/* ==========================================================
   SECTION
   ========================================================== */

const sectionStyle: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "17px",
  border: "1px solid #E5EAF1",
  padding: "25px",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.055)",
  marginBottom: "20px",
  boxSizing: "border-box",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  marginBottom: "22px",
};

const sectionTitleStyle: CSSProperties = {
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: 800,
  margin: 0,
  marginBottom: "5px",
  letterSpacing: "-0.3px",
};

const sectionSubtitleStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
  margin: 0,
};

/* ==========================================================
   SUMMARY
   ========================================================== */

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "13px",
};

const summaryCardStyle: CSSProperties = {
  background: "#F8FAFC",
  border: "1px solid #EEF2F7",
  borderRadius: "13px",
  padding: "17px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
};

const summaryIconStyle: CSSProperties = {
  width: "39px",
  height: "39px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const summaryContentStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minWidth: 0,
};

const summaryValueStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 800,
  wordBreak: "break-word",
};

const labelStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "11px",
  fontWeight: 600,
};

/* ==========================================================
   STATUS BAR
   ========================================================== */

const statusBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "15px",
  padding: "13px 17px",
  borderRadius: "12px",
  background: "#FFFFFF",
  border: "1px solid #E5EAF1",
  boxShadow:
    "0 5px 16px rgba(15, 23, 42, 0.035)",
};

const statusLeftStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
};

const statusIndicatorStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "9px",
  background: "#ECFDF3",
  color: "#16A34A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const statusTitleStyle: CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "11px",
  fontWeight: 800,
};

const statusTextStyle: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "10px",
  marginTop: "2px",
};

const statusRefreshButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  border: "none",
  background: "transparent",
  color: "#2563EB",
  fontSize: "11px",
  fontWeight: 800,
  cursor: "pointer",
  padding: "7px 9px",
};

/* ==========================================================
   LOADING
   ========================================================== */

const loadingContainerStyle: CSSProperties = {
  maxWidth: "520px",
  margin: "120px auto",
  padding: "40px",
  background: "#FFFFFF",
  borderRadius: "18px",
  border: "1px solid #E5EAF1",
  boxShadow:
    "0 12px 35px rgba(15, 23, 42, 0.07)",
  textAlign: "center",
};

const loadingIconStyle: CSSProperties = {
  width: "60px",
  height: "60px",
  margin: "0 auto 18px",
  borderRadius: "16px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const loadingTitleStyle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: 800,
};

const loadingTextStyle: CSSProperties = {
  margin: "8px 0 22px",
  color: "#64748B",
  fontSize: "13px",
  lineHeight: 1.5,
};

const loadingBarTrackStyle: CSSProperties = {
  height: "5px",
  width: "100%",
  borderRadius: "99px",
  background: "#E2E8F0",
  overflow: "hidden",
};

const loadingBarStyle: CSSProperties = {
  height: "100%",
  width: "45%",
  borderRadius: "99px",
  background:
    "linear-gradient(90deg, #2563EB, #60A5FA)",
};

/* ==========================================================
   ERROR
   ========================================================== */

const errorStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "18px",
  background: "#FFFFFF",
  borderRadius: "15px",
  border: "1px solid #FECACA",
  boxShadow:
    "0 7px 20px rgba(15, 23, 42, 0.04)",
};

const errorIconStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "11px",
  background: "#FEF2F2",
  color: "#DC2626",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const errorTitleStyle: CSSProperties = {
  color: "#991B1B",
  fontSize: "13px",
};

const errorTextStyle: CSSProperties = {
  color: "#B91C1C",
  margin: "4px 0 0",
  fontSize: "12px",
};

const retryButtonStyle: CSSProperties = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  border: "1px solid #FECACA",
  background: "#FFFFFF",
  color: "#B91C1C",
  padding: "9px 13px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "12px",
};

/* ==========================================================
   EMPTY STATE
   ========================================================== */

const emptyStateStyle: CSSProperties = {
  maxWidth: "600px",
  margin: "60px auto",
  padding: "50px 30px",
  textAlign: "center",
  background: "#FFFFFF",
  borderRadius: "17px",
  border: "1px solid #E5EAF1",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.05)",
};

const emptyIconStyle: CSSProperties = {
  width: "62px",
  height: "62px",
  margin: "0 auto 17px",
  borderRadius: "16px",
  background: "#F1F5F9",
  color: "#64748B",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyTitleStyle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "19px",
  fontWeight: 800,
};

const emptyTextStyle: CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  lineHeight: 1.6,
  maxWidth: "430px",
  margin: "8px auto 0",
};