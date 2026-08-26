import React, { useState, useMemo } from "react";

interface InventoryItem {
  sku: string;
  product: string;
  quantity: number;
  reorderLevel: number;
  warehouse: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    sku: "SKU-001",
    product: "Laptop Dell XPS 15",
    quantity: 125,
    reorderLevel: 40,
    warehouse: "Warehouse A",
    status: "In Stock",
  },
  {
    sku: "SKU-002",
    product: "Wireless Mouse",
    quantity: 28,
    reorderLevel: 30,
    warehouse: "Warehouse B",
    status: "Low Stock",
  },
  {
    sku: "SKU-003",
    product: "Mechanical Keyboard",
    quantity: 0,
    reorderLevel: 20,
    warehouse: "Warehouse A",
    status: "Out of Stock",
  },
  {
    sku: "SKU-004",
    product: "27-inch Monitor",
    quantity: 65,
    reorderLevel: 25,
    warehouse: "Warehouse C",
    status: "In Stock",
  },
];

export default function StockMonitoring() {
  const [inventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter inventory based on search query
  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  // Dynamic KPI analytics derived from inventory array
  const metrics = useMemo(() => {
    const totalProducts = inventory.length;
    const inStock = inventory.filter((item) => item.status === "In Stock").length;
    const lowStock = inventory.filter((item) => item.status === "Low Stock").length;
    const outOfStock = inventory.filter((item) => item.status === "Out of Stock").length;

    return { totalProducts, inStock, lowStock, outOfStock };
  }, [inventory]);

  const getStatusBadge = (status: InventoryItem["status"]) => {
    if (status === "In Stock") {
      return (
        <span style={{ ...badgeBase, background: "#DCFCE7", color: "#15803D" }}>
          <span style={{ ...dotBase, background: "#16A34A" }}></span> In Stock
        </span>
      );
    }
    if (status === "Low Stock") {
      return (
        <span style={{ ...badgeBase, background: "#FEF3C7", color: "#B45309" }}>
          <span style={{ ...dotBase, background: "#F59E0B" }}></span> Low Stock
        </span>
      );
    }
    return (
      <span style={{ ...badgeBase, background: "#FEE2E2", color: "#B91C1C" }}>
        <span style={{ ...dotBase, background: "#DC2626" }}></span> Out of Stock
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
            <span style={liveTagText}>INVENTORY CONTROL CENTER</span>
          </div>
          <h1 style={pageTitle}>Stock Monitoring</h1>
          <p style={pageSubtitle}>
            Real-time tracking of warehouse inventory, reorder thresholds, and operational stock levels.
          </p>
        </div>

        <div style={headerActionCard}>
          <div style={headerActionIconBox}>
            <BoxesIcon />
          </div>
          <div>
            <div style={headerActionTitle}>SmartChain Inventory</div>
            <div style={headerActionSubtitle}>Enterprise Stock Tracker</div>
          </div>
        </div>
      </div>

      {/* KPI SECTION LABEL */}
      <div style={sectionHeaderLabel}>EXECUTIVE INVENTORY METRICS</div>

      {/* KPI CARDS GRID */}
      <div style={kpiGrid}>
        {/* KPI 1 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Total Products</span>
              <div style={kpiValue}>{metrics.totalProducts}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ Active</span> SKUs cataloged
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
              <span style={kpiLabel}>In Stock</span>
              <div style={kpiValue}>{metrics.inStock}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>▲ Available</span> for fulfillment
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #10B981 0%, #047857 100%)" }}>
              <CheckCircleIcon />
            </div>
          </div>
          <SparklineSVG color="#10B981" />
        </div>

        {/* KPI 3 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Low Stock</span>
              <div style={kpiValue}>{metrics.lowStock}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#B45309", fontWeight: 700 }}>⚠️ Threshold</span> trigger met
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
              <AlertTriangleIcon />
            </div>
          </div>
          <SparklineSVG color="#F59E0B" />
        </div>

        {/* KPI 4 */}
        <div style={kpiCard}>
          <div style={kpiHeader}>
            <div>
              <span style={kpiLabel}>Out of Stock</span>
              <div style={kpiValue}>{metrics.outOfStock}</div>
              <div style={kpiTrendText}>
                <span style={{ color: "#DC2626", fontWeight: 700 }}>▼ Depleted</span> needs reorder
              </div>
            </div>
            <div style={{ ...kpiIconWrapper, background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" }}>
              <XCircleIcon />
            </div>
          </div>
          <SparklineSVG color="#EF4444" />
        </div>
      </div>

      {/* REGISTER CARD */}
      <div style={premiumCard}>
        {/* CONTROLS HEADER */}
        <div style={tableControlsHeader}>
          <div style={searchWrapper}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search product, SKU, or warehouse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          <button style={primaryButtonStyle}>
            <PlusIcon /> Add Product
          </button>
        </div>

        <div style={cardHeaderFlex}>
          <div>
            <h2 style={cardTitle}>Inventory Stock Register</h2>
            <p style={cardSubtitle}>Granular SKU tracking, reorder levels, and location assignments</p>
          </div>
          <div>
            <span style={tablePill}>{`${filteredInventory.length} Items Found`}</span>
          </div>
        </div>

        {/* EMPTY SEARCH RESULT */}
        {filteredInventory.length === 0 ? (
          <div style={emptyStateBox}>
            <EmptyIcon />
            <div style={{ fontWeight: 600, color: "#1E293B", marginTop: "12px" }}>No Products Found</div>
            <p style={{ color: "#64748B", fontSize: "13px", margin: "4px 0 0 0" }}>
              No inventory records match your search query &quot;{searchTerm}&quot;.
            </p>
          </div>
        ) : (
          /* DATA TABLE */
          <div style={{ overflowX: "auto", margin: "0 -20px" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={{ ...thStyle, textAlign: "left" }}>SKU</th>
                  <th style={{ ...thStyle, textAlign: "left" }}>Product</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>Reorder Level</th>
                  <th style={thStyle}>Warehouse</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.sku} style={tableRowStyle}>
                    <td style={{ ...tdStyle, textAlign: "left", fontWeight: 700, color: "#0F172A" }}>
                      {item.sku}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, color: "#1E293B" }}>
                      {item.product}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: item.quantity === 0 ? "#DC2626" : "#0F172A" }}>
                      {item.quantity.toLocaleString("en-ZA")}
                    </td>
                    <td style={{ ...tdStyle, color: "#64748B", fontWeight: 600 }}>
                      {item.reorderLevel.toLocaleString("en-ZA")}
                    </td>
                    <td style={tdStyle}>
                      <span style={warehouseBadge}>{item.warehouse}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {getStatusBadge(item.status)}
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

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function BoxesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <line x1="9" y1="9" x2="15" y2="15" />
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

/* ==========================================================
   SMARTCHAIN STYLES
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
  fontSize: "26px",
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

const premiumCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "20px 24px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
};

const tableControlsHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "14px",
  marginBottom: "20px",
};

const searchWrapper: React.CSSProperties = {
  position: "relative",
  width: "320px",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px 10px 40px",
  fontSize: "13px",
  borderRadius: "10px",
  border: "1px solid #CBD5E1",
  outline: "none",
  background: "#F8FAFC",
  color: "#0F172A",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(37, 99, 235, 0.2)",
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

const warehouseBadge: React.CSSProperties = {
  background: "#F1F5F9",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 600,
  padding: "4px 8px",
  borderRadius: "6px",
  border: "1px solid #E2E8F0",
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
  minWidth: "750px",
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

const emptyStateBox: React.CSSProperties = {
  padding: "40px",
  textAlign: "center",
  background: "#F8FAFC",
  borderRadius: "12px",
  border: "1px dashed #CBD5E1",
};