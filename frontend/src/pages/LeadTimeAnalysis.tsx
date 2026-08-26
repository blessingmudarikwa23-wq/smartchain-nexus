import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";

interface LeadTimeData {
  purchase_order: string;
  supplier_name: string;
  order_date: string;
  expected_delivery: string;
  lead_time_days: number;
}

export default function LeadTimeAnalysis() {
  const [orders, setOrders] = useState<LeadTimeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadLeadTimeAnalysis();
  }, []);

  const loadLeadTimeAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/procurement/lead-time-analysis");
      setOrders(response.data || []);
    } catch (err) {
      console.error("Failed to load lead time analysis:", err);
      setError("Failed to synchronize procurement lead time metrics from the server.");
    } finally {
      setLoading(false);
    }
  };

  // Processed Analytics
  const analytics = useMemo(() => {
    if (!orders.length) {
      return {
        avgLeadTime: 0,
        fastestLeadTime: 0,
        slowestLeadTime: 0,
        uniqueSuppliersCount: 0,
        supplierConcentration: [],
        optimalOrdersCount: 0,
        atRiskOrdersCount: 0,
      };
    }

    const totalDays = orders.reduce((sum, item) => sum + item.lead_time_days, 0);
    const leadTimes = orders.map((o) => o.lead_time_days);

    // Supplier concentration calculations
    const supplierCounts: { [key: string]: { count: number; totalDays: number } } = {};
    let optimalCount = 0;
    let atRiskCount = 0;

    orders.forEach((ord) => {
      if (ord.lead_time_days <= 5) optimalCount++;
      if (ord.lead_time_days > 10) atRiskCount++;

      if (!supplierCounts[ord.supplier_name]) {
        supplierCounts[ord.supplier_name] = { count: 0, totalDays: 0 };
      }
      supplierCounts[ord.supplier_name].count += 1;
      supplierCounts[ord.supplier_name].totalDays += ord.lead_time_days;
    });

    const supplierConcentration = Object.entries(supplierCounts)
      .map(([name, data]) => ({
        name,
        ordersCount: data.count,
        sharePct: Math.round((data.count / orders.length) * 100),
        avgSupplierLeadTime: (data.totalDays / data.count).toFixed(1),
      }))
      .sort((a, b) => b.ordersCount - a.ordersCount);

    return {
      avgLeadTime: (totalDays / orders.length).toFixed(1),
      fastestLeadTime: Math.min(...leadTimes),
      slowestLeadTime: Math.max(...leadTimes),
      uniqueSuppliersCount: Object.keys(supplierCounts).length,
      supplierConcentration,
      optimalOrdersCount: optimalCount,
      atRiskOrdersCount: atRiskCount,
    };
  }, [orders]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (days: number) => {
    if (days <= 5) {
      return (
        <span style={{ ...badgeBase, background: "#DCFCE7", color: "#15803D" }}>
          <span style={{ ...dotBase, background: "#16A34A" }}></span> Optimal ({days}d)
        </span>
      );
    }
    if (days <= 10) {
      return (
        <span style={{ ...badgeBase, background: "#FEF3C7", color: "#B45309" }}>
          <span style={{ ...dotBase, background: "#F59E0B" }}></span> Moderate ({days}d)
        </span>
      );
    }
    return (
      <span style={{ ...badgeBase, background: "#FEE2E2", color: "#B91C1C" }}>
        <span style={{ ...dotBase, background: "#DC2626" }}></span> Delayed ({days}d)
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
            <span style={liveTagText}>PROCUREMENT INTELLIGENCE</span>
          </div>
          <h1 style={pageTitle}>Lead Time Analysis</h1>
          <p style={pageSubtitle}>
            Monitor procurement lead times, supplier delivery performance, and supply chain fulfilment efficiency.
          </p>
        </div>

        <div style={headerActionCard}>
          <div style={headerActionIconBox}>
            <LightningIcon />
          </div>
          <div>
            <div style={headerActionTitle}>SmartChain Intelligence</div>
            <div style={headerActionSubtitle}>Real-time Lead Time Engine</div>
          </div>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div style={errorContainer}>
          <AlertIcon />
          <span style={{ flex: 1 }}>{error}</span>
          <button style={retryButton} onClick={loadLeadTimeAnalysis}>
            Retry Sync
          </button>
        </div>
      )}

      {/* KPI SECTION LABEL */}
      <div style={sectionHeaderLabel}>KEY PERFORMANCE INDICATORS</div>

      {/* KPI CARDS GRID */}
      <div style={kpiGrid}>
        {/* KPI 1 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Avg Lead Time</span>
              <div style={kpiValue}>{loading ? "--" : `${analytics.avgLeadTime}`} <span style={kpiUnit}>Days</span></div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ 12%</span> vs last month
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" }}>
              <ClockIcon />
            </div>
          </div>
          <SparklineSVG color="#3B82F6" />
        </div>

        {/* KPI 2 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Fastest Delivery</span>
              <div style={kpiValue}>{loading ? "--" : `${analytics.fastestLeadTime}`} <span style={kpiUnit}>Days</span></div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ Peak</span> efficiency
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #10B981 0%, #047857 100%)" }}>
              <BoltIcon />
            </div>
          </div>
          <SparklineSVG color="#10B981" />
        </div>

        {/* KPI 3 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Slowest Lead Time</span>
              <div style={kpiValue}>{loading ? "--" : `${analytics.slowestLeadTime}`} <span style={kpiUnit}>Days</span></div>
              <div style={kpiTrendText}>
                <span style={{ color: "#DC2626", fontWeight: 700 }}>▼ Bottleneck</span> alert
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
              <TruckIcon />
            </div>
          </div>
          <SparklineSVG color="#F59E0B" />
        </div>

        {/* KPI 4 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Active Suppliers</span>
              <div style={kpiValue}>{loading ? "--" : analytics.uniqueSuppliersCount}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ 100%</span> active network
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}>
              <SupplierIcon />
            </div>
          </div>
          <SparklineSVG color="#8B5CF6" />
        </div>
      </div>

      {/* OPERATIONAL ANALYTICS HEADER */}
      <div style={sectionHeaderLabel}>OPERATIONAL ANALYTICS</div>

      {/* MIDDLE SECTION GRID: SUMMARY & SUPPLIER CONCENTRATION */}
      <div style={middleGrid}>
        {/* PROCUREMENT SUMMARY CARD */}
        <div style={premiumCard}>
          <div style={cardHeaderFlex}>
            <div>
              <h3 style={cardTitle}>Procurement Summary</h3>
              <p style={cardSubtitle}>Fulfillment performance metrics</p>
            </div>
            <button style={iconButtonStyle} onClick={loadLeadTimeAnalysis} title="Refresh data">
              <RefreshIcon />
            </button>
          </div>

          <div style={summaryGrid}>
            <div style={summaryBox}>
              <div style={summaryBoxNumber}>{loading ? "--" : orders.length}</div>
              <div style={summaryBoxLabel}>Total Orders</div>
            </div>
            <div style={summaryBox}>
              <div style={{ ...summaryBoxNumber, color: "#16A34A" }}>
                {loading ? "--" : analytics.optimalOrdersCount}
              </div>
              <div style={summaryBoxLabel}>Optimal (≤ 5 Days)</div>
            </div>
            <div style={summaryBox}>
              <div style={{ ...summaryBoxNumber, color: "#DC2626" }}>
                {loading ? "--" : analytics.atRiskOrdersCount}
              </div>
              <div style={summaryBoxLabel}>Delayed (&gt; 10 Days)</div>
            </div>
          </div>
        </div>

        {/* SUPPLIER CONCENTRATION CARD */}
        <div style={premiumCard}>
          <div style={cardHeaderFlex}>
            <div>
              <h3 style={cardTitle}>Supplier Concentration</h3>
              <p style={cardSubtitle}>Order distribution &amp; speed per supplier</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
            {loading ? (
              <SkeletonRows count={3} />
            ) : analytics.supplierConcentration.length === 0 ? (
              <div style={{ color: "#94A3B8", fontSize: "13px" }}>No concentration data available</div>
            ) : (
              analytics.supplierConcentration.slice(0, 3).map((item) => (
                <div key={item.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>{item.name}</span>
                    <span style={{ color: "#64748B" }}>
                      {item.ordersCount} orders ({item.sharePct}%) • Avg {item.avgSupplierLeadTime}d
                    </span>
                  </div>
                  <div style={progressBarBg}>
                    <div
                      style={{
                        ...progressBarFill,
                        width: `${item.sharePct}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* REGISTER TABLE CARD */}
      <div style={premiumCard}>
        <div style={cardHeaderFlex}>
          <div>
            <h2 style={cardTitle}>Procurement Lead Time Register</h2>
            <p style={cardSubtitle}>Detailed breakdown by purchase order and supplier</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={tablePill}>
              {loading ? "Syncing..." : `${orders.length} Records`}
            </span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <TableSkeleton />}

        {/* EMPTY STATE */}
        {!loading && !error && orders.length === 0 && (
          <div style={emptyStateBox}>
            <EmptyIcon />
            <div style={{ fontWeight: 600, color: "#1E293B", marginTop: "12px" }}>No Lead Time Records Found</div>
            <p style={{ color: "#64748B", fontSize: "13px", margin: "4px 0 0 0" }}>
              There are currently no purchase order records to analyze.
            </p>
          </div>
        )}

        {/* DATA TABLE */}
        {!loading && !error && orders.length > 0 && (
          <div style={{ overflowX: "auto", margin: "0 -20px" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={thStyle}>Purchase Order</th>
                  <th style={thStyle}>Supplier Name</th>
                  <th style={thStyle}>Order Date</th>
                  <th style={thStyle}>Expected Delivery</th>
                  <th style={thStyle}>Status / Lead Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={`${order.purchase_order}-${idx}`} style={tableRowStyle}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: "#2563EB" }}>
                      {order.purchase_order}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "#0F172A" }}>
                      {order.supplier_name}
                    </td>
                    <td style={tdStyle}>{formatDate(order.order_date)}</td>
                    <td style={tdStyle}>{formatDate(order.expected_delivery)}</td>
                    <td style={tdStyle}>{getStatusBadge(order.lead_time_days)}</td>
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

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function SupplierIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SparklineSVG({ color }: { color: string }) {
  return (
    <div style={{ marginTop: "12px", height: "28px", width: "100%", overflow: "hidden" }}>
      <svg viewBox="0 0 100 25" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d="M0 20 Q 25 5, 50 15 T 100 8 L 100 25 L 0 25 Z" fill={`url(#grad-${color})`} />
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
  background: "#FEF3C7",
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
  fontSize: "26px",
  fontWeight: 800,
  color: "#0F172A",
  marginTop: "4px",
  letterSpacing: "-0.02em",
};

const kpiUnit: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#64748B",
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
  background: "linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)",
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
  minWidth: "700px",
  textAlign: "left",
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