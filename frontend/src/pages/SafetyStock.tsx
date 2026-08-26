import { useEffect, useMemo, useState } from "react";

import { safetyStockService } from "../services/safetyStockService";
import type { SafetyStock as SafetyStockRecord } from "../services/safetyStockService";

export default function SafetyStock() {
  const [items, setItems] = useState<SafetyStockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadSafetyStock = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await safetyStockService.getAll();

        setItems(data);
      } catch (err) {
        console.error(
          "Failed to load safety stock analysis:",
          err
        );

        setError(
          "Unable to load safety stock analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSafetyStock();
  }, []);

  const filteredItems = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return items;
    }

    return items.filter((item) =>
      item.item_name.toLowerCase().includes(search)
    );
  }, [items, searchTerm]);

  const totalItems = items.length;

  const averageLeadTime =
    items.length > 0
      ? items.reduce(
          (total, item) =>
            total + Number(item.lead_time_days || 0),
          0
        ) / items.length
      : 0;

  const averageDailyDemand =
    items.length > 0
      ? items.reduce(
          (total, item) =>
            total +
            Number(item.average_daily_demand || 0),
          0
        ) / items.length
      : 0;

  const totalSafetyStock = items.reduce(
    (total, item) =>
      total + Number(item.safety_stock || 0),
    0
  );

  function getStockLevel(
    safetyStock: number,
    averageDailyDemand: number
  ) {
    if (averageDailyDemand <= 0) {
      return "No Demand";
    }

    const coverage =
      safetyStock / averageDailyDemand;

    if (coverage >= 7) {
      return "High Buffer";
    }

    if (coverage >= 3) {
      return "Balanced";
    }

    return "Low Buffer";
  }

  function getStockLevelStyle(
    safetyStock: number,
    averageDailyDemand: number
  ): React.CSSProperties {
    const level = getStockLevel(
      safetyStock,
      averageDailyDemand
    );

    if (level === "High Buffer") {
      return highBufferBadge;
    }

    if (level === "Balanced") {
      return balancedBadge;
    }

    if (level === "Low Buffer") {
      return lowBufferBadge;
    }

    return neutralBadge;
  }

  return (
    <div style={page}>
      {/* Page Header */}
      <div style={pageHeader}>
        <div style={titleSection}>
          <div style={pageIcon}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
              <path d="M8.5 12.5 11 15l4.5-5" />
            </svg>
          </div>

          <div>
            <h1 style={pageTitle}>
              Safety Stock Analysis
            </h1>

            <p style={pageSubtitle}>
              Protect inventory against demand and
              supplier uncertainty
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={summaryGrid}>
        <div style={summaryCard}>
          <div
            style={{
              ...summaryIcon,
              background: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="16"
                rx="2"
              />
              <path d="M8 9h8" />
              <path d="M8 13h5" />
            </svg>
          </div>

          <div style={summaryContent}>
            <span style={summaryLabel}>
              Total Items
            </span>

            <strong style={summaryValue}>
              {totalItems}
            </strong>

            <span style={summaryDescription}>
              Items under analysis
            </span>
          </div>

          <div style={miniChart}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div style={summaryCard}>
          <div
            style={{
              ...summaryIcon,
              background: "#ECFDF5",
              color: "#16A34A",
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>

          <div style={summaryContent}>
            <span style={summaryLabel}>
              Average Lead Time
            </span>

            <strong style={summaryValue}>
              {averageLeadTime.toFixed(1)}
            </strong>

            <span style={summaryDescription}>
              Days across analysed items
            </span>
          </div>

          <div
            style={{
              ...miniChart,
              color: "#16A34A",
            }}
          >
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div style={summaryCard}>
          <div
            style={{
              ...summaryIcon,
              background: "#FFF7ED",
              color: "#F59E0B",
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h4l2-7 4 14 2-7h6" />
            </svg>
          </div>

          <div style={summaryContent}>
            <span style={summaryLabel}>
              Average Daily Demand
            </span>

            <strong style={summaryValue}>
              {averageDailyDemand.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}
            </strong>

            <span style={summaryDescription}>
              Units demanded per day
            </span>
          </div>

          <div
            style={{
              ...miniChart,
              color: "#F59E0B",
            }}
          >
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div style={summaryCard}>
          <div
            style={{
              ...summaryIcon,
              background: "#F5F3FF",
              color: "#7C3AED",
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19h16" />
              <path d="M6 17V9" />
              <path d="M10 17V5" />
              <path d="M14 17v-7" />
              <path d="M18 17v-4" />
            </svg>
          </div>

          <div style={summaryContent}>
            <span style={summaryLabel}>
              Total Safety Stock
            </span>

            <strong style={summaryValue}>
              {totalSafetyStock.toLocaleString()}
            </strong>

            <span style={summaryDescription}>
              Recommended buffer units
            </span>
          </div>

          <div
            style={{
              ...miniChart,
              color: "#7C3AED",
            }}
          >
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      {/* Purpose Card */}
      <div style={purposeCard}>
        <div style={purposeIcon}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
            <path d="M12 8v4" />
            <circle cx="12" cy="16" r=".7" fill="currentColor" />
          </svg>
        </div>

        <div>
          <h3 style={purposeTitle}>
            Safety Stock Protection
          </h3>

          <p style={purposeText}>
            Safety Stock protects the business against
            demand variability and supplier lead time
            uncertainty, helping maintain service levels
            while reducing the risk of stockouts.
          </p>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div style={controlRow}>
        <div style={searchBox}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            style={searchInput}
          />
        </div>

        <div style={resultCount}>
          Showing{" "}
          <strong>{filteredItems.length}</strong>{" "}
          of <strong>{items.length}</strong> items
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={tableCard}>
          <div style={loadingState}>
            <div style={loadingSpinner} />

            <p>
              Loading safety stock analysis...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={errorCard}>
          <div style={errorIcon}>!</div>

          <div>
            <strong style={errorTitle}>
              Unable to load analysis
            </strong>

            <p style={errorText}>{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div style={tableCard}>
          <div style={tableHeaderSection}>
            <div>
              <h2 style={tableTitle}>
                Safety Stock Overview
              </h2>

              <p style={tableSubtitle}>
                Recommended inventory buffers by product
              </p>
            </div>

            <div style={tableBadge}>
              {items.length} Products
            </div>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={header}>Product</th>
                  <th style={header}>Lead Time</th>
                  <th style={header}>
                    Average Daily Demand
                  </th>
                  <th style={header}>
                    Recommended Safety Stock
                  </th>
                  <th style={header}>Buffer Level</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => {
                  const safetyStock =
                    Number(item.safety_stock || 0);

                  const averageDemand =
                    Number(
                      item.average_daily_demand || 0
                    );

                  const stockLevel =
                    getStockLevel(
                      safetyStock,
                      averageDemand
                    );

                  return (
                    <tr
                      key={item.id}
                      style={tableRow}
                    >
                      <td style={productCell}>
                        <div style={productWrapper}>
                          <div
                            style={productAvatar}
                          >
                            {item.item_name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong
                              style={productName}
                            >
                              {item.item_name}
                            </strong>

                            <span
                              style={productSubtitle}
                            >
                              Safety stock item
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={cell}>
                        <span
                          style={leadTimeBadge}
                        >
                          <span
                            style={greenDot}
                          />
                          {item.lead_time_days} Days
                        </span>
                      </td>

                      <td style={cell}>
                        <strong
                          style={numericValue}
                        >
                          {averageDemand.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>
                        <span style={unitText}>
                          units/day
                        </span>
                      </td>

                      <td style={cell}>
                        <strong
                          style={safetyStockValue}
                        >
                          {safetyStock.toLocaleString()}
                        </strong>
                        <span style={unitText}>
                          units
                        </span>
                      </td>

                      <td style={cell}>
                        <span
                          style={getStockLevelStyle(
                            safetyStock,
                            averageDemand
                          )}
                        >
                          <span style={statusDot} />
                          {stockLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={emptyCell}
                    >
                      <div style={emptyState}>
                        <div style={emptyIcon}>
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle
                              cx="11"
                              cy="11"
                              r="7"
                            />
                            <path d="m20 20-4-4" />
                          </svg>
                        </div>

                        <strong>
                          No safety stock records found
                        </strong>

                        <span>
                          Try adjusting your search.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={tableFooter}>
            <span>
              Showing{" "}
              <strong>
                {filteredItems.length}
              </strong>{" "}
              of{" "}
              <strong>{items.length}</strong>{" "}
              safety stock records
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

const page: React.CSSProperties = {
  padding: "30px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box",
};

/* =========================================================
   HEADER
========================================================= */

const pageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
};

const titleSection: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const pageIcon: React.CSSProperties = {
  width: "58px",
  height: "58px",
  borderRadius: "18px",
  background:
    "linear-gradient(135deg, #DBEAFE, #EFF6FF)",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:
    "0 8px 18px rgba(37, 99, 235, 0.12)",
};

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: "1.2",
  fontWeight: "700",
  color: "#0F172A",
};

const pageSubtitle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "15px",
  color: "#64748B",
};

/* =========================================================
   SUMMARY CARDS
========================================================= */

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(235px, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const summaryCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "20px",
  minHeight: "150px",
  display: "flex",
  alignItems: "flex-start",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const summaryIcon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const summaryContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginLeft: "14px",
  paddingRight: "10px",
};

const summaryLabel: React.CSSProperties = {
  color: "#2563EB",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "7px",
};

const summaryValue: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "26px",
  fontWeight: "700",
  lineHeight: "1.2",
};

const summaryDescription: React.CSSProperties = {
  marginTop: "7px",
  color: "#64748B",
  fontSize: "12px",
};

const miniChart: React.CSSProperties = {
  position: "absolute",
  right: "17px",
  bottom: "20px",
  display: "flex",
  alignItems: "flex-end",
  gap: "4px",
  height: "30px",
  opacity: 0.8,
};

const miniChartBar: React.CSSProperties = {
  width: "5px",
  borderRadius: "4px",
  background: "currentColor",
};

/* =========================================================
   PURPOSE
========================================================= */

const purposeCard: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  background:
    "linear-gradient(135deg, #ECFDF5, #F0FDF4)",
  border: "1px solid #BBF7D0",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "24px",
  boxShadow:
    "0 6px 18px rgba(22, 163, 74, 0.05)",
};

const purposeIcon: React.CSSProperties = {
  width: "46px",
  height: "46px",
  flexShrink: 0,
  borderRadius: "13px",
  background: "#DCFCE7",
  color: "#16A34A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const purposeTitle: React.CSSProperties = {
  margin: "1px 0 6px",
  color: "#166534",
  fontSize: "16px",
  fontWeight: "700",
};

const purposeText: React.CSSProperties = {
  margin: 0,
  color: "#3F6212",
  fontSize: "14px",
  lineHeight: "1.6",
};

/* =========================================================
   SEARCH
========================================================= */

const controlRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
  marginBottom: "18px",
};

const searchBox: React.CSSProperties = {
  flex: 1,
  maxWidth: "700px",
  minWidth: "250px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 15px",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  boxSizing: "border-box",
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.03)",
};

const searchInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "14px",
  color: "#0F172A",
  background: "transparent",
};

const resultCount: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

/* =========================================================
   TABLE CARD
========================================================= */

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 10px 28px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const tableHeaderSection: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 22px 18px",
};

const tableTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "18px",
  fontWeight: "700",
};

const tableSubtitle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const tableBadge: React.CSSProperties = {
  background: "#EFF6FF",
  color: "#2563EB",
  border: "1px solid #DBEAFE",
  borderRadius: "20px",
  padding: "7px 12px",
  fontSize: "12px",
  fontWeight: "600",
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  minWidth: "850px",
  borderCollapse: "collapse",
};

const header: React.CSSProperties = {
  padding: "15px 18px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "700",
  color: "#475569",
  background: "#F8FAFC",
  borderTop: "1px solid #E2E8F0",
  borderBottom: "1px solid #E2E8F0",
  whiteSpace: "nowrap",
};

const tableRow: React.CSSProperties = {
  borderBottom: "1px solid #F1F5F9",
  transition: "background 0.2s ease",
};

const cell: React.CSSProperties = {
  padding: "16px 18px",
  color: "#334155",
  fontSize: "13px",
  verticalAlign: "middle",
};

const productCell: React.CSSProperties = {
  padding: "16px 18px",
  verticalAlign: "middle",
};

const productWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const productAvatar: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "15px",
  fontWeight: "700",
  flexShrink: 0,
};

const productName: React.CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: "700",
};

const productSubtitle: React.CSSProperties = {
  display: "block",
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
};

const numericValue: React.CSSProperties = {
  display: "inline-block",
  color: "#334155",
  fontSize: "14px",
};

const safetyStockValue: React.CSSProperties = {
  display: "inline-block",
  color: "#2563EB",
  fontSize: "15px",
  fontWeight: "700",
};

const unitText: React.CSSProperties = {
  display: "inline-block",
  marginLeft: "5px",
  color: "#94A3B8",
  fontSize: "11px",
};

const leadTimeBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#ECFDF5",
  color: "#15803D",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "600",
};

const greenDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#16A34A",
};

const statusDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "currentColor",
};

const highBufferBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#F3E8FF",
  color: "#7E22CE",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "600",
};

const balancedBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#ECFDF5",
  color: "#15803D",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "600",
};

const lowBufferBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#FFF7ED",
  color: "#C2410C",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "600",
};

const neutralBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#F1F5F9",
  color: "#64748B",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "600",
};

const tableFooter: React.CSSProperties = {
  padding: "15px 22px",
  color: "#64748B",
  fontSize: "12px",
  borderTop: "1px solid #E2E8F0",
};

/* =========================================================
   LOADING
========================================================= */

const loadingState: React.CSSProperties = {
  minHeight: "220px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748B",
  fontSize: "14px",
};

const loadingSpinner: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "3px solid #DBEAFE",
  borderTopColor: "#2563EB",
  marginBottom: "12px",
};

/* =========================================================
   ERROR
========================================================= */

const errorCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  padding: "18px 20px",
  marginBottom: "20px",
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  borderRadius: "14px",
  color: "#991B1B",
};

const errorIcon: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#FEE2E2",
  color: "#DC2626",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const errorTitle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
};

const errorText: React.CSSProperties = {
  margin: "3px 0 0",
  fontSize: "13px",
};

/* =========================================================
   EMPTY STATE
========================================================= */

const emptyCell: React.CSSProperties = {
  padding: "40px",
  textAlign: "center",
};

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  color: "#64748B",
};

const emptyIcon: React.CSSProperties = {
  width: "54px",
  height: "54px",
  borderRadius: "50%",
  background: "#F8FAFC",
  color: "#94A3B8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "5px",
};