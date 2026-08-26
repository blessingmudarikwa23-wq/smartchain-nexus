import { useEffect, useState } from "react";

import { reorderPointService } from "../services/reorderPointService";

import type {
  ReorderPoint as ReorderPointRecord,
} from "../services/reorderPointService";

export default function ReorderPoint() {
  const [items, setItems] = useState<ReorderPointRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReorderPoints = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await reorderPointService.getAll();

        setItems(data);
      } catch (err) {
        console.error(
          "Failed to load reorder point analysis:",
          err
        );

        setError(
          "Unable to load reorder point analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReorderPoints();
  }, []);

  return (
    <div style={pageContainer}>
      {/* Page Header */}
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>
            Reorder Point Analysis
          </h1>

          <p style={pageSubtitle}>
            Determine when inventory should be replenished
            to avoid stockouts.
          </p>
        </div>
      </div>

      {/* Formula Card */}
      <div style={formulaCard}>
        <div style={formulaIcon}>
          ↻
        </div>

        <div style={formulaContent}>
          <h3 style={formulaTitle}>
            Reorder Point Formula
          </h3>

          <div style={formula}>
            Reorder Point = (Average Daily Demand × Lead Time)
            + Safety Stock
          </div>

          <p style={formulaDescription}>
            The reorder point indicates the inventory level
            at which a replenishment order should be placed.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={summaryGrid}>
        <div style={summaryCard}>
          <div style={summaryCardTop}>
            <span style={summaryLabel}>
              Total Products
            </span>

            <div style={blueIcon}>
              📦
            </div>
          </div>

          <div style={summaryValue}>
            {items.length}
          </div>

          <div style={summaryFooter}>
            Products analysed
          </div>
        </div>

        <div style={summaryCard}>
          <div style={summaryCardTop}>
            <span style={summaryLabel}>
              Average Lead Time
            </span>

            <div style={purpleIcon}>
              ⏱
            </div>
          </div>

          <div style={summaryValue}>
            {items.length > 0
              ? (
                  items.reduce(
                    (total, item) =>
                      total + item.lead_time_days,
                    0
                  ) / items.length
                ).toFixed(1)
              : "0"}
          </div>

          <div style={summaryFooter}>
            Days across products
          </div>
        </div>

        <div style={summaryCard}>
          <div style={summaryCardTop}>
            <span style={summaryLabel}>
              Average Safety Stock
            </span>

            <div style={greenIcon}>
              🛡
            </div>
          </div>

          <div style={summaryValue}>
            {items.length > 0
              ? (
                  items.reduce(
                    (total, item) =>
                      total + item.safety_stock,
                    0
                  ) / items.length
                ).toFixed(1)
              : "0"}
          </div>

          <div style={summaryFooter}>
            Units maintained as buffer
          </div>
        </div>

        <div style={summaryCard}>
          <div style={summaryCardTop}>
            <span style={summaryLabel}>
              Average Reorder Point
            </span>

            <div style={orangeIcon}>
              📊
            </div>
          </div>

          <div style={summaryValue}>
            {items.length > 0
              ? (
                  items.reduce(
                    (total, item) =>
                      total + item.reorder_point,
                    0
                  ) / items.length
                ).toFixed(1)
              : "0"}
          </div>

          <div style={summaryFooter}>
            Recommended replenishment level
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={statusCard}>
          <div style={loadingSpinner}>
            ⟳
          </div>

          <div>
            <strong style={statusTitle}>
              Loading reorder point analysis...
            </strong>

            <p style={statusDescription}>
              Retrieving inventory replenishment data.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={errorCard}>
          <div style={errorIcon}>
            !
          </div>

          <div>
            <strong style={errorTitle}>
              Unable to load analysis
            </strong>

            <p style={errorDescription}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div style={tableCard}>
          <div style={tableHeader}>
            <div>
              <h2 style={tableTitle}>
                Reorder Point Overview
              </h2>

              <p style={tableSubtitle}>
                Inventory replenishment recommendations
                by product.
              </p>
            </div>

            <div style={recordBadge}>
              {items.length}{" "}
              {items.length === 1
                ? "Record"
                : "Records"}
            </div>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={headerLeft}>
                    Product
                  </th>

                  <th style={header}>
                    Lead Time
                  </th>

                  <th style={header}>
                    Average Daily Demand
                  </th>

                  <th style={header}>
                    Safety Stock
                  </th>

                  <th style={headerHighlight}>
                    Reorder Point
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    style={
                      index % 2 === 0
                        ? tableRow
                        : alternateTableRow
                    }
                  >
                    <td style={productCell}>
                      <div style={productWrapper}>
                        <div style={productIcon}>
                          📦
                        </div>

                        <div>
                          <div style={productName}>
                            {item.item_name}
                          </div>

                          <div style={productReference}>
                            Inventory Item
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={cell}>
                      <span style={daysBadge}>
                        {item.lead_time_days} Days
                      </span>
                    </td>

                    <td style={cell}>
                      <span style={numericValue}>
                        {Number(
                          item.average_daily_usage
                        ).toLocaleString()}
                      </span>

                      <span style={unitText}>
                        units/day
                      </span>
                    </td>

                    <td style={cell}>
                      <span style={safetyStockValue}>
                        {Number(
                          item.safety_stock
                        ).toLocaleString()}
                      </span>

                      <span style={unitText}>
                        units
                      </span>
                    </td>

                    <td style={resultCell}>
                      <div style={reorderPointBadge}>
                        {Number(
                          item.reorder_point
                        ).toLocaleString()}
                      </div>

                      <span style={recommendedText}>
                        Recommended level
                      </span>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={emptyState}
                    >
                      <div style={emptyIcon}>
                        📦
                      </div>

                      <strong style={emptyTitle}>
                        No reorder point records found
                      </strong>

                      <p style={emptyDescription}>
                        There are currently no inventory
                        replenishment records available.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Information Card */}
      {!loading && !error && (
        <div style={infoCard}>
          <div style={infoIcon}>
            💡
          </div>

          <div>
            <h3 style={infoTitle}>
              Inventory Planning Insight
            </h3>

            <p style={infoText}>
              When inventory reaches the calculated reorder
              point, a replenishment order should be initiated.
              This helps maintain availability while accounting
              for lead time and safety stock requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================
   PAGE STYLES
================================ */

const pageContainer: React.CSSProperties = {
  padding: "32px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box",
};

const pageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
};

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "700",
  color: "#0F172A",
  letterSpacing: "-0.5px",
};

const pageSubtitle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#64748B",
  fontSize: "15px",
};

const formulaCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  background:
    "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
  border: "1px solid #BFDBFE",
  borderRadius: "16px",
  padding: "22px 24px",
  marginBottom: "26px",
  boxShadow: "0 6px 18px rgba(37,99,235,0.08)",
};

const formulaIcon: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "14px",
  background: "#2563EB",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
  fontWeight: "700",
  flexShrink: 0,
};

const formulaContent: React.CSSProperties = {
  minWidth: 0,
};

const formulaTitle: React.CSSProperties = {
  margin: 0,
  color: "#1E3A8A",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const formula: React.CSSProperties = {
  marginTop: "7px",
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: "700",
  lineHeight: "1.5",
};

const formulaDescription: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#475569",
  fontSize: "14px",
  lineHeight: "1.5",
};

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "26px",
};

const summaryCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "16px",
  padding: "21px",
  boxShadow: "0 7px 20px rgba(15,23,42,0.06)",
};

const summaryCardTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const summaryLabel: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  fontWeight: "600",
};

const summaryValue: React.CSSProperties = {
  marginTop: "15px",
  color: "#0F172A",
  fontSize: "30px",
  fontWeight: "750",
  lineHeight: "1",
};

const summaryFooter: React.CSSProperties = {
  marginTop: "10px",
  color: "#94A3B8",
  fontSize: "12px",
};

const blueIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const purpleIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#F5F3FF",
  color: "#7C3AED",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const greenIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#ECFDF5",
  color: "#16A34A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orangeIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#FFF7ED",
  color: "#EA580C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statusCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "16px",
  padding: "22px",
  marginBottom: "22px",
  boxShadow: "0 7px 20px rgba(15,23,42,0.05)",
};

const loadingSpinner: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
};

const statusTitle: React.CSSProperties = {
  color: "#334155",
  fontSize: "15px",
};

const statusDescription: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#94A3B8",
  fontSize: "13px",
};

const errorCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "22px",
};

const errorIcon: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#DC2626",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "20px",
};

const errorTitle: React.CSSProperties = {
  color: "#991B1B",
  fontSize: "15px",
};

const errorDescription: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#B91C1C",
  fontSize: "13px",
};

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
  overflow: "hidden",
};

const tableHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "22px 24px",
  borderBottom: "1px solid #E2E8F0",
};

const tableTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: "700",
};

const tableSubtitle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const recordBadge: React.CSSProperties = {
  background: "#F1F5F9",
  color: "#475569",
  padding: "8px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "850px",
};

const tableHeaderRow: React.CSSProperties = {
  background: "#1E293B",
  color: "#FFFFFF",
};

const header: React.CSSProperties = {
  padding: "15px 18px",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const headerLeft: React.CSSProperties = {
  padding: "15px 18px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tableRow: React.CSSProperties = {
  background: "#FFFFFF",
  borderBottom: "1px solid #E2E8F0",
};

const alternateTableRow: React.CSSProperties = {
  background: "#F8FAFC",
  borderBottom: "1px solid #E2E8F0",
};

const productCell: React.CSSProperties = {
  padding: "16px 18px",
};

const productWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const productIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17px",
  flexShrink: 0,
};

const productName: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: "650",
  textAlign: "left",
};

const productReference: React.CSSProperties = {
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
  textAlign: "left",
};

const cell: React.CSSProperties = {
  padding: "16px 18px",
  textAlign: "center",
  color: "#475569",
  fontSize: "14px",
};

const daysBadge: React.CSSProperties = {
  display: "inline-block",
  background: "#F5F3FF",
  color: "#7C3AED",
  border: "1px solid #DDD6FE",
  borderRadius: "20px",
  padding: "6px 11px",
  fontSize: "12px",
  fontWeight: "700",
};

const numericValue: React.CSSProperties = {
  color: "#334155",
  fontWeight: "600",
};

const unitText: React.CSSProperties = {
  display: "block",
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
};

const safetyStockValue: React.CSSProperties = {
  color: "#16A34A",
  fontWeight: "700",
};

const headerHighlight: React.CSSProperties = {
  padding: "15px 18px",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: "700",
  background: "#0F766E",
  color: "#FFFFFF",
  whiteSpace: "nowrap",
};

const resultCell: React.CSSProperties = {
  padding: "13px 18px",
  textAlign: "center",
};

const reorderPointBadge: React.CSSProperties = {
  display: "inline-block",
  minWidth: "70px",
  background: "#ECFDF5",
  color: "#047857",
  border: "1px solid #A7F3D0",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "15px",
  fontWeight: "800",
};

const recommendedText: React.CSSProperties = {
  display: "block",
  marginTop: "4px",
  color: "#94A3B8",
  fontSize: "10px",
};

const emptyState: React.CSSProperties = {
  padding: "45px 25px",
  textAlign: "center",
  color: "#64748B",
};

const emptyIcon: React.CSSProperties = {
  fontSize: "32px",
  marginBottom: "10px",
};

const emptyTitle: React.CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "15px",
};

const emptyDescription: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#94A3B8",
  fontSize: "13px",
};

const infoCard: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "16px",
  padding: "20px 22px",
  marginTop: "22px",
  boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
};

const infoIcon: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#FEF3C7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const infoTitle: React.CSSProperties = {
  margin: 0,
  color: "#334155",
  fontSize: "15px",
  fontWeight: "700",
};

const infoText: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748B",
  fontSize: "13px",
  lineHeight: "1.6",
};