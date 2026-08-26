import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";

interface VendorPerformanceData {
  supplier_name: string;
  total_orders: number;
  total_spend: number;
  on_time_deliveries: number;
  late_deliveries: number;
  delivery_success_rate: number;
}

// Formats currency as full raw numbers with commas (e.g., R 5,000,000.00)
const formatZARCurrency = (value: number) => {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function VendorPerformance() {
  const [vendors, setVendors] = useState<VendorPerformanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadVendorPerformance();
  }, []);

  const loadVendorPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/procurement/vendor-performance");
      setVendors(response.data || []);
    } catch (err) {
      console.error("Failed to load vendor performance:", err);
      setError("Failed to synchronize vendor performance metrics from the server.");
    } finally {
      setLoading(false);
    }
  };

  // Executive level aggregations
  const analytics = useMemo(() => {
    if (!vendors.length) {
      return {
        totalOrders: 0,
        totalSpend: 0,
        totalOnTimeDeliveries: 0,
        averageDeliverySuccess: "0.0",
        topVendorsBySpend: [],
        atRiskVendorsCount: 0,
      };
    }

    const totalOrders = vendors.reduce((acc, v) => acc + v.total_orders, 0);
    const totalSpend = vendors.reduce((acc, v) => acc + v.total_spend, 0);
    const totalOnTimeDeliveries = vendors.reduce((acc, v) => acc + v.on_time_deliveries, 0);
    const averageDeliverySuccess =
      vendors.reduce((acc, v) => acc + v.delivery_success_rate, 0) / vendors.length;

    const atRiskVendorsCount = vendors.filter((v) => v.delivery_success_rate < 75).length;

    const topVendorsBySpend = [...vendors]
      .sort((a, b) => b.total_spend - a.total_spend)
      .slice(0, 3)
      .map((v) => ({
        name: v.supplier_name,
        spend: v.total_spend,
        sharePct: totalSpend > 0 ? Math.round((v.total_spend / totalSpend) * 100) : 0,
        successRate: v.delivery_success_rate,
      }));

    return {
      totalOrders,
      totalSpend,
      totalOnTimeDeliveries,
      averageDeliverySuccess: averageDeliverySuccess.toFixed(1),
      topVendorsBySpend,
      atRiskVendorsCount,
    };
  }, [vendors]);

  const getSuccessBadge = (rate: number) => {
    if (rate >= 90) {
      return (
        <span style={{ ...badgeBase, background: "#DCFCE7", color: "#15803D" }}>
          <span style={{ ...dotBase, background: "#16A34A" }}></span> Excellent ({rate.toFixed(1)}%)
        </span>
      );
    }
    if (rate >= 75) {
      return (
        <span style={{ ...badgeBase, background: "#FEF3C7", color: "#B45309" }}>
          <span style={{ ...dotBase, background: "#F59E0B" }}></span> Moderate ({rate.toFixed(1)}%)
        </span>
      );
    }
    return (
      <span style={{ ...badgeBase, background: "#FEE2E2", color: "#B91C1C" }}>
        <span style={{ ...dotBase, background: "#DC2626" }}></span> At Risk ({rate.toFixed(1)}%)
      </span>
    );
  };

  return (
    <div style={pageContainer}>
      {/* PAGE HEADER */}
      <div style={headerSection}>
        <div>
          <div style={liveTagContainer}>
            <span style={liveDot} />
            <span style={liveTagText}>SUPPLIER RELIABILITY HUB</span>
          </div>
          <h1 style={pageTitle}>Vendor Performance</h1>
          <p style={pageSubtitle}>
            Monitor supplier expenditure, delivery fulfillment success, and active vendor portfolio reliability.
          </p>
        </div>

        <div style={headerActionCard}>
          <div style={headerActionIconBox}>
            <ShieldIcon />
          </div>
          <div>
            <div style={headerActionTitle}>SmartChain Compliance</div>
            <div style={headerActionSubtitle}>Enterprise Vendor Scorecard</div>
          </div>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div style={errorContainer}>
          <AlertIcon />
          <span style={{ flex: 1 }}>{error}</span>
          <button style={retryButton} onClick={loadVendorPerformance}>
            Retry Sync
          </button>
        </div>
      )}

      {/* KPI SECTION LABEL */}
      <div style={sectionHeaderLabel}>EXECUTIVE PERFORMANCE METRICS</div>

      {/* KPI CARDS GRID */}
      <div style={kpiGrid}>
        {/* KPI 1 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Total Orders</span>
              <div style={kpiValue}>{loading ? "--" : analytics.totalOrders.toLocaleString("en-ZA")}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ Active</span> purchase orders
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" }}>
              <PackageIcon />
            </div>
          </div>
          <SparklineSVG color="#3B82F6" />
        </div>

        {/* KPI 2 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Total Vendor Spend</span>
              <div style={kpiValue}>{loading ? "--" : formatZARCurrency(analytics.totalSpend)}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ Allocated</span> expenditure
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #10B981 0%, #047857 100%)" }}>
              <BanknoteIcon />
            </div>
          </div>
          <SparklineSVG color="#10B981" />
        </div>

        {/* KPI 3 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>On-Time Deliveries</span>
              <div style={kpiValue}>{loading ? "--" : analytics.totalOnTimeDeliveries.toLocaleString("en-ZA")}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ Fulfilled</span> on schedule
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}>
              <TruckCheckIcon />
            </div>
          </div>
          <SparklineSVG color="#8B5CF6" />
        </div>

        {/* KPI 4 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Avg Success Rate</span>
              <div style={kpiValue}>{loading ? "--" : `${analytics.averageDeliverySuccess}%`}</div>
              <div style={kpiTrendText}>
                <span style={{ color: Number(analytics.averageDeliverySuccess) >= 80 ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
                  {Number(analytics.averageDeliverySuccess) >= 80 ? "▲ Stable" : "▼ Needs Attention"}
                </span>{" "}
                portfolio score
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
              <TrendingUpIcon />
            </div>
          </div>
          <SparklineSVG color="#F59E0B" />
        </div>
      </div>

      {/* OPERATIONAL ANALYTICS HEADER */}
      <div style={sectionHeaderLabel}>FINANCIAL &amp; RELIABILITY ANALYTICS</div>

      {/* MIDDLE SECTION GRID */}
      <div style={middleGrid}>
        {/* SPEND DISTRIBUTION CARD */}
        <div style={premiumCard}>
          <div style={cardHeaderFlex}>
            <div>
              <h3 style={cardTitle}>Top Vendor Spend Concentration</h3>
              <p style={cardSubtitle}>Expenditure allocation across key suppliers</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
            {loading ? (
              <SkeletonRows count={3} />
            ) : analytics.topVendorsBySpend.length === 0 ? (
              <div style={{ color: "#94A3B8", fontSize: "13px" }}>No vendor spend data available</div>
            ) : (
              analytics.topVendorsBySpend.map((vendor) => (
                <div key={vendor.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>{vendor.name}</span>
                    <span style={{ color: "#64748B" }}>
                      {formatZARCurrency(vendor.spend)} ({vendor.sharePct}%)
                    </span>
                  </div>
                  <div style={progressBarBg}>
                    <div style={{ ...progressBarFill, width: `${vendor.sharePct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PORTFOLIO RELIABILITY SUMMARY */}
        <div style={premiumCard}>
          <div style={cardHeaderFlex}>
            <div>
              <h3 style={cardTitle}>Vendor Health Summary</h3>
              <p style={cardSubtitle}>Portfolio delivery compliance status</p>
            </div>
            <button style={iconButtonStyle} onClick={loadVendorPerformance} title="Refresh metrics">
              <RefreshIcon />
            </button>
          </div>

          <div style={summaryGrid}>
            <div style={summaryBox}>
              <div style={summaryBoxNumber}>{loading ? "--" : vendors.length}</div>
              <div style={summaryBoxLabel}>Active Vendors</div>
            </div>
            <div style={summaryBox}>
              <div style={{ ...summaryBoxNumber, color: "#16A34A" }}>
                {loading ? "--" : vendors.filter((v) => v.delivery_success_rate >= 90).length}
              </div>
              <div style={summaryBoxLabel}>Top Performers</div>
            </div>
            <div style={summaryBox}>
              <div style={{ ...summaryBoxNumber, color: "#DC2626" }}>
                {loading ? "--" : analytics.atRiskVendorsCount}
              </div>
              <div style={summaryBoxLabel}>At Risk (&lt; 75%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTER TABLE CARD */}
      <div style={premiumCard}>
        <div style={cardHeaderFlex}>
          <div>
            <h2 style={cardTitle}>Vendor Performance Register</h2>
            <p style={cardSubtitle}>Granular metrics on delivery success, orders, and total expenditure</p>
          </div>
          <div>
            <span style={tablePill}>{loading ? "Syncing..." : `${vendors.length} Vendors`}</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <TableSkeleton />}

        {/* EMPTY STATE */}
        {!loading && !error && vendors.length === 0 && (
          <div style={emptyStateBox}>
            <EmptyIcon />
            <div style={{ fontWeight: 600, color: "#1E293B", marginTop: "12px" }}>No Vendor Data Available</div>
            <p style={{ color: "#64748B", fontSize: "13px", margin: "4px 0 0 0" }}>
              There are currently no supplier performance metrics recorded in the system.
            </p>
          </div>
        )}

        {/* DATA TABLE */}
        {!loading && !error && vendors.length > 0 && (
          <div style={{ overflowX: "auto", margin: "0 -20px" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={{ ...thStyle, textAlign: "left" }}>Supplier</th>
                  <th style={thStyle}>Total Orders</th>
                  <th style={thStyle}>Total Spend</th>
                  <th style={thStyle}>On-Time Deliveries</th>
                  <th style={thStyle}>Late Deliveries</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, idx) => (
                  <tr key={`${vendor.supplier_name}-${idx}`} style={tableRowStyle}>
                    <td style={{ ...tdStyle, textAlign: "left", fontWeight: 700, color: "#0F172A" }}>
                      {vendor.supplier_name}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {vendor.total_orders.toLocaleString("en-ZA")}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: "#16A34A" }}>
                      {formatZARCurrency(vendor.total_spend)}
                    </td>
                    <td style={{ ...tdStyle, color: "#16A34A", fontWeight: 600 }}>
                      {vendor.on_time_deliveries.toLocaleString("en-ZA")}
                    </td>
                    <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>
                      {vendor.late_deliveries.toLocaleString("en-ZA")}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {getSuccessBadge(vendor.delivery_success_rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================
   INLINE SVG ICON COMPONENTS
========================================================== */

function PackageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function TruckCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <path d="M5 9l2 2 4-4" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SparklineSVG({ color }: { color: string }) {
  return (
    <div style={{ marginTop: "12px", height: "28px", width: "100%", overflow: "hidden" }}>
      <svg viewBox="0 0 100 25" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d="M0 20 Q 25 5, 50 15 T 100 8 L 100 25 L 0 25 Z" fill={`url(#grad-${color.replace("#", "")})`} />
        <path d="M0 20 Q 25 5, 50 15 T 100 8" fill="none" stroke={color} strokeWidth="2" />
      </svg>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "10px 0" }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={skeletonPulseStyle} />
      ))}
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...skeletonPulseStyle, height: "16px" }} />
      ))}
    </>
  );
}

/* ==========================================================
   SMARTCHAIN NEXUS STYLES
========================================================== */

const pageContainer: React.CSSProperties = {
  padding: "32px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#0F172A",
};

const headerSection: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "28px",
};

const liveTagContainer: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "6px",
};

const liveDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#16A34A",
};

const liveTagText: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#16A34A",
  textTransform: "uppercase",
};

const pageTitle: React.CSSProperties = {
  fontSize: "30px",
  fontWeight: 800,
  color: "#0F172A",
  margin: "0 0 6px 0",
  letterSpacing: "-0.02em",
};

const pageSubtitle: React.CSSProperties = {
  color: "#64748B",
  margin: 0,
  fontSize: "14px",
  maxWidth: "600px",
  lineHeight: 1.5,
};

const headerActionCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#FFFFFF",
  padding: "12px 18px",
  borderRadius: "14px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  border: "1px solid #E2E8F0",
};

const headerActionIconBox: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const headerActionTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#0F172A",
};

const headerActionSubtitle: React.CSSProperties = {
  fontSize: "11px",
  color: "#2563EB",
  fontWeight: 600,
};

const sectionHeaderLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#64748B",
  marginBottom: "14px",
};

const kpiGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "28px",
};

const kpiCard: React.CSSProperties = {
  background: "#FFFFFF",
  padding: "20px 20px 10px 20px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const kpiHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const kpiLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#64748B",
};

const kpiValue: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 800,
  color: "#0F172A",
  marginTop: "4px",
  letterSpacing: "-0.02em",
};

const kpiTrendText: React.CSSProperties = {
  fontSize: "11px",
  color: "#64748B",
  marginTop: "4px",
};

const kpiIconWrapper: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const middleGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
  marginBottom: "28px",
};

const premiumCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "20px 24px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
  marginBottom: "20px",
};

const cardHeaderFlex: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 700,
  color: "#0F172A",
};

const cardSubtitle: React.CSSProperties = {
  margin: "2px 0 0 0",
  fontSize: "12px",
  color: "#64748B",
};

const iconButtonStyle: React.CSSProperties = {
  background: "#F1F5F9",
  border: "none",
  borderRadius: "8px",
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  marginTop: "12px",
};

const summaryBox: React.CSSProperties = {
  background: "#F8FAFC",
  borderRadius: "12px",
  padding: "14px",
  textAlign: "center",
  border: "1px solid #E2E8F0",
};

const summaryBoxNumber: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
  color: "#0F172A",
};

const summaryBoxLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#64748B",
  fontWeight: 600,
  marginTop: "4px",
};

const progressBarBg: React.CSSProperties = {
  height: "6px",
  width: "100%",
  background: "#F1F5F9",
  borderRadius: "4px",
  overflow: "hidden",
};

const progressBarFill: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
  borderRadius: "4px",
};

const tablePill: React.CSSProperties = {
  background: "#F1F5F9",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: "20px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "850px",
  textAlign: "center",
};

const tableHeaderRow: React.CSSProperties = {
  borderBottom: "1px solid #E2E8F0",
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: "11px",
  fontWeight: 700,
  color: "#64748B",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #F1F5F9",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "#334155",
};

const badgeBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
};

const dotBase: React.CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
};

const errorContainer: React.CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FCA5A5",
  color: "#991B1B",
  padding: "12px 16px",
  borderRadius: "12px",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "13px",
};

const retryButton: React.CSSProperties = {
  background: "#991B1B",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

const emptyStateBox: React.CSSProperties = {
  padding: "40px",
  textAlign: "center",
  background: "#F8FAFC",
  borderRadius: "12px",
  border: "1px dashed #CBD5E1",
};

const skeletonPulseStyle: React.CSSProperties = {
  height: "40px",
  width: "100%",
  background: "#F1F5F9",
  borderRadius: "8px",
};