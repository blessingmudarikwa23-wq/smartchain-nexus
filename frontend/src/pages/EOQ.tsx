import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import {
  eoqAnalysisService,
  type EOQAnalysis,
} from "../services/eoqAnalysisService";

export default function EOQ() {
  const [products, setProducts] = useState<EOQAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Highest EOQ");

  useEffect(() => {
    loadEOQAnalysis();
  }, []);

  async function loadEOQAnalysis() {
    try {
      setLoading(true);
      setError("");

      const data = await eoqAnalysisService.getAll();

      setProducts(data);
    } catch (err) {
      console.error("Failed to load EOQ analysis:", err);
      setError("Failed to load EOQ analysis.");
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     KPI CALCULATIONS
  ========================================================= */

  const totalProducts = products.length;

  const totalAnnualDemand = products.reduce(
    (total, item) =>
      total + Number(item.annual_demand || 0),
    0
  );

  const totalEOQ = products.reduce(
    (total, item) =>
      total +
      Number(item.economic_order_quantity || 0),
    0
  );

  const averageEOQ =
    totalProducts > 0
      ? totalEOQ / totalProducts
      : 0;

  const totalOrderingCost = products.reduce(
    (total, item) =>
      total + Number(item.ordering_cost || 0),
    0
  );

  const totalHoldingCost = products.reduce(
    (total, item) =>
      total + Number(item.holding_cost || 0),
    0
  );

  const highestEOQProduct =
    products.length > 0
      ? [...products].sort(
          (a, b) =>
            Number(
              b.economic_order_quantity || 0
            ) -
            Number(
              a.economic_order_quantity || 0
            )
        )[0]
      : null;

  /* =========================================================
     SEARCH + SORT
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    const filtered = products.filter(
      (item) => {
        if (!search) {
          return true;
        }

        return (
          item.item_name
            ?.toLowerCase()
            .includes(search) ||
          String(item.id)
            .toLowerCase()
            .includes(search) ||
          String(item.annual_demand)
            .toLowerCase()
            .includes(search)
        );
      }
    );

    return [...filtered].sort(
      (a, b) => {
        if (sortOrder === "Highest EOQ") {
          return (
            Number(
              b.economic_order_quantity || 0
            ) -
            Number(
              a.economic_order_quantity || 0
            )
          );
        }

        if (sortOrder === "Lowest EOQ") {
          return (
            Number(
              a.economic_order_quantity || 0
            ) -
            Number(
              b.economic_order_quantity || 0
            )
          );
        }

        if (sortOrder === "Highest Demand") {
          return (
            Number(b.annual_demand || 0) -
            Number(a.annual_demand || 0)
          );
        }

        if (sortOrder === "Lowest Demand") {
          return (
            Number(a.annual_demand || 0) -
            Number(b.annual_demand || 0)
          );
        }

        if (sortOrder === "Product A-Z") {
          return (
            a.item_name || ""
          ).localeCompare(
            b.item_name || ""
          );
        }

        return 0;
      }
    );
  }, [
    products,
    searchTerm,
    sortOrder,
  ]);

  function getProductInitial(
    itemName: string
  ) {
    return (
      itemName
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "P"
    );
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      "en-ZA",
      {
        maximumFractionDigits: 2,
      }
    ).format(value);
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat(
      "en-ZA",
      {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  }

  return (
    <div style={pageContainer}>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div style={pageHeader}>
        <div style={headerLeft}>
          <div style={headerIcon}>
            <span
              style={headerIconSymbol}
            >
              📦
            </span>
          </div>

          <div>
            <h1 style={pageTitle}>
              Economic Order Quantity
            </h1>

            <p style={pageSubtitle}>
              Optimize inventory ordering quantities,
              reduce costs and improve stock efficiency
            </p>
          </div>
        </div>

        <div style={headerBadge}>
          <span style={headerBadgeDot} />
          Inventory Optimization
        </div>
      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div style={summaryGrid}>
        {/* TOTAL PRODUCTS */}

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIconWrapper,
                background: "#EEF4FF",
                color: "#2563EB",
              }}
            >
              📦
            </div>

            <div>
              <div
                style={{
                  ...summaryLabel,
                  color: "#2563EB",
                }}
              >
                Total Products
              </div>

              <div style={summaryValue}>
                {totalProducts}
              </div>
            </div>
          </div>

          <div style={summaryFooter}>
            Products currently analyzed
          </div>
        </div>

        {/* ANNUAL DEMAND */}

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIconWrapper,
                background: "#ECFDF5",
                color: "#16A34A",
              }}
            >
              📈
            </div>

            <div>
              <div
                style={{
                  ...summaryLabel,
                  color: "#16A34A",
                }}
              >
                Annual Demand
              </div>

              <div style={summaryValue}>
                {formatNumber(
                  totalAnnualDemand
                )}
              </div>
            </div>
          </div>

          <div style={summaryFooter}>
            Combined annual product demand
          </div>
        </div>

        {/* TOTAL EOQ */}

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIconWrapper,
                background: "#FFF7ED",
                color: "#EA580C",
              }}
            >
              🔄
            </div>

            <div>
              <div
                style={{
                  ...summaryLabel,
                  color: "#EA580C",
                }}
              >
                Total EOQ
              </div>

              <div style={summaryValue}>
                {formatNumber(
                  totalEOQ
                )}
              </div>
            </div>
          </div>

          <div style={summaryFooter}>
            Recommended combined order quantity
          </div>
        </div>

        {/* AVERAGE EOQ */}

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIconWrapper,
                background: "#F5F3FF",
                color: "#7C3AED",
              }}
            >
              📊
            </div>

            <div>
              <div
                style={{
                  ...summaryLabel,
                  color: "#7C3AED",
                }}
              >
                Average EOQ
              </div>

              <div style={summaryValue}>
                {formatNumber(
                  averageEOQ
                )}
              </div>
            </div>
          </div>

          <div style={summaryFooter}>
            Average recommended order quantity
          </div>
        </div>
      </div>

      {/* =====================================================
          FORMULA / EXPLANATION
      ===================================================== */}

      <div style={formulaCard}>
        <div style={formulaIcon}>
          √
        </div>

        <div style={formulaContent}>
          <div style={formulaHeadingRow}>
            <h2 style={formulaTitle}>
              Economic Order Quantity
            </h2>

            <span style={formulaBadge}>
              Inventory Control
            </span>
          </div>

          <p style={formulaDescription}>
            EOQ identifies the most economical quantity
            to order by balancing ordering and holding
            costs.
          </p>

          <div style={formulaBox}>
            <span style={formulaText}>
              EOQ = √((2 × Demand × Ordering Cost) ÷ Holding Cost)
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div style={errorCard}>
          <div style={errorIcon}>
            !
          </div>

          <div style={errorContent}>
            <strong style={errorTitle}>
              Unable to load EOQ analysis
            </strong>

            <p style={errorMessage}>
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadEOQAnalysis}
            style={retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          MAIN ANALYSIS CARD
      ===================================================== */}

      {!error && (
        <div style={tableCard}>
          {/* TABLE HEADER */}

          <div style={tableHeaderSection}>
            <div style={tableTitleWrapper}>
              <div style={tableTitleIcon}>
                ↻
              </div>

              <div>
                <h2 style={tableTitle}>
                  EOQ Analysis
                </h2>

                <p style={tableSubtitle}>
                  Recommended inventory order quantities
                  by product
                </p>
              </div>
            </div>

            <div style={recordBadge}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "Product"
                : "Products"}
            </div>
          </div>

          {/* SEARCH / SORT */}

          {!loading && (
            <div style={toolbar}>
              <div style={searchWrapper}>
                <span style={searchIcon}>
                  ⌕
                </span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search products or product ID..."
                  style={searchInput}
                />
              </div>

              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value
                  )
                }
                style={sortSelect}
              >
                <option value="Highest EOQ">
                  Highest EOQ
                </option>

                <option value="Lowest EOQ">
                  Lowest EOQ
                </option>

                <option value="Highest Demand">
                  Highest Demand
                </option>

                <option value="Lowest Demand">
                  Lowest Demand
                </option>

                <option value="Product A-Z">
                  Product A-Z
                </option>
              </select>
            </div>
          )}

          {/* FILTER RESULT */}

          {!loading &&
            (searchTerm.trim() !== "") && (
              <div style={resultBar}>
                Showing{" "}
                <strong>
                  {filteredProducts.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {products.length}
                </strong>{" "}
                products
              </div>
            )}

          {/* LOADING */}

          {loading ? (
            <div style={loadingContainer}>
              <div style={loadingSpinner}>
                ⟳
              </div>

              <p style={loadingText}>
                Loading EOQ analysis...
              </p>

              <span style={loadingSubtext}>
                Retrieving inventory optimization data
              </span>
            </div>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={header}>
                      Product
                    </th>

                    <th style={header}>
                      Annual Demand
                    </th>

                    <th style={header}>
                      Ordering Cost
                    </th>

                    <th style={header}>
                      Holding Cost
                    </th>

                    <th
                      style={{
                        ...header,
                        color: "#2563EB",
                      }}
                    >
                      Recommended EOQ
                    </th>

                    <th style={header}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (item) => {
                      const eoq = Number(
                        item.economic_order_quantity ||
                          0
                      );

                      const isHighest =
                        highestEOQProduct?.id ===
                        item.id;

                      return (
                        <tr
                          key={item.id}
                          style={tableRow}
                        >
                          {/* PRODUCT */}

                          <td
                            style={productCell}
                          >
                            <div
                              style={
                                productWrapper
                              }
                            >
                              <div
                                style={
                                  productAvatar
                                }
                              >
                                {getProductInitial(
                                  item.item_name
                                )}
                              </div>

                              <div>
                                <div
                                  style={
                                    productName
                                  }
                                >
                                  {item.item_name}
                                </div>

                                <div
                                  style={
                                    productId
                                  }
                                >
                                  EOQ-
                                  {String(
                                    item.id
                                  ).padStart(
                                    4,
                                    "0"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* DEMAND */}

                          <td style={cell}>
                            <div
                              style={
                                metricValueWrapper
                              }
                            >
                              <strong
                                style={
                                  demandValue
                                }
                              >
                                {formatNumber(
                                  Number(
                                    item.annual_demand ||
                                      0
                                  )
                                )}
                              </strong>

                              <span
                                style={
                                  metricUnit
                                }
                              >
                                units / year
                              </span>
                            </div>
                          </td>

                          {/* ORDERING COST */}

                          <td style={cell}>
                            <span
                              style={
                                currencyValue
                              }
                            >
                              {formatCurrency(
                                Number(
                                  item.ordering_cost ||
                                    0
                                )
                              )}
                            </span>
                          </td>

                          {/* HOLDING COST */}

                          <td style={cell}>
                            <span
                              style={
                                currencyValue
                              }
                            >
                              {formatCurrency(
                                Number(
                                  item.holding_cost ||
                                    0
                                )
                              )}
                            </span>
                          </td>

                          {/* EOQ */}

                          <td style={cell}>
                            <div
                              style={{
                                ...eoqValueWrapper,
                                background:
                                  isHighest
                                    ? "#EFF6FF"
                                    : "#F8FAFC",
                                border:
                                  isHighest
                                    ? "1px solid #DBEAFE"
                                    : "1px solid #EEF2F7",
                              }}
                            >
                              <span
                                style={
                                  eoqValue
                                }
                              >
                                {formatNumber(
                                  eoq
                                )}
                              </span>

                              <span
                                style={
                                  eoqUnit
                                }
                              >
                                units / order
                              </span>
                            </div>
                          </td>

                          {/* STATUS */}

                          <td style={cell}>
                            <span
                              style={
                                statusBadge
                              }
                            >
                              <span
                                style={
                                  statusDot
                                }
                              />

                              Optimized
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}

                  {/* EMPTY */}

                  {filteredProducts.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={
                          emptyCell
                        }
                      >
                        <div
                          style={
                            emptyState
                          }
                        >
                          <div
                            style={
                              emptyIcon
                            }
                          >
                            📦
                          </div>

                          <strong
                            style={
                              emptyTitle
                            }
                          >
                            No products found
                          </strong>

                          <p
                            style={
                              emptyDescription
                            }
                          >
                            Try changing your
                            search criteria.
                          </p>

                          {searchTerm && (
                            <button
                              type="button"
                              onClick={() =>
                                setSearchTerm(
                                  ""
                                )
                              }
                              style={
                                clearButton
                              }
                            >
                              Clear Search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE FOOTER */}

          {!loading &&
            products.length > 0 && (
              <div style={tableFooter}>
                <span>
                  Showing{" "}
                  <strong
                    style={{
                      color: "#334155",
                    }}
                  >
                    {filteredProducts.length}
                  </strong>{" "}
                  of{" "}
                  <strong
                    style={{
                      color: "#334155",
                    }}
                  >
                    {products.length}
                  </strong>{" "}
                  products
                </span>

                <span
                  style={{
                    color: "#94A3B8",
                  }}
                >
                  EOQ optimization results
                </span>
              </div>
            )}
        </div>
      )}

      {/* =====================================================
          COST SUMMARY
      ===================================================== */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <div style={bottomGrid}>
            {/* ORDERING COST */}

            <div style={bottomSummary}>
              <div
                style={{
                  ...bottomSummaryIcon,
                  background: "#EFF6FF",
                  color: "#2563EB",
                }}
              >
                💰
              </div>

              <div>
                <span
                  style={
                    bottomSummaryLabel
                  }
                >
                  Total Ordering Cost
                </span>

                <strong
                  style={
                    bottomSummaryValue
                  }
                >
                  {formatCurrency(
                    totalOrderingCost
                  )}
                </strong>

                <span
                  style={
                    bottomSummaryDescription
                  }
                >
                  Combined across analyzed products
                </span>
              </div>
            </div>

            {/* HOLDING COST */}

            <div style={bottomSummary}>
              <div
                style={{
                  ...bottomSummaryIcon,
                  background: "#ECFDF5",
                  color: "#16A34A",
                }}
              >
                📦
              </div>

              <div>
                <span
                  style={
                    bottomSummaryLabel
                  }
                >
                  Total Holding Cost
                </span>

                <strong
                  style={
                    bottomSummaryValue
                  }
                >
                  {formatCurrency(
                    totalHoldingCost
                  )}
                </strong>

                <span
                  style={
                    bottomSummaryDescription
                  }
                >
                  Combined inventory holding cost
                </span>
              </div>
            </div>

            {/* HIGHEST EOQ */}

            <div style={bottomSummary}>
              <div
                style={{
                  ...bottomSummaryIcon,
                  background: "#FFF7ED",
                  color: "#EA580C",
                }}
              >
                📈
              </div>

              <div>
                <span
                  style={
                    bottomSummaryLabel
                  }
                >
                  Highest Recommended EOQ
                </span>

                <strong
                  style={
                    bottomSummaryValue
                  }
                >
                  {highestEOQProduct
                    ? formatNumber(
                        Number(
                          highestEOQProduct.economic_order_quantity ||
                            0
                        )
                      )
                    : "0"}
                </strong>

                <span
                  style={
                    bottomSummaryDescription
                  }
                >
                  {highestEOQProduct?.item_name ||
                    "No product"}
                </span>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

const pageContainer: CSSProperties = {
  padding: "30px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box",
};

/* =========================================================
   HEADER
========================================================= */

const pageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
};

const headerLeft: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const headerIcon: CSSProperties = {
  width: "58px",
  height: "58px",
  borderRadius: "17px",
  background:
    "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:
    "0 8px 20px rgba(37, 99, 235, 0.10)",
  border: "1px solid #DBEAFE",
};

const headerIconSymbol: CSSProperties = {
  fontSize: "27px",
};

const pageTitle: CSSProperties = {
  margin: 0,
  fontSize: "30px",
  lineHeight: "1.1",
  fontWeight: 800,
  color: "#0F172A",
  letterSpacing: "-0.5px",
};

const pageSubtitle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: "14px",
  color: "#64748B",
};

const headerBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  color: "#475569",
  padding: "10px 14px",
  borderRadius: "10px",
  fontSize: "12px",
  fontWeight: 700,
  boxShadow:
    "0 4px 12px rgba(15,23,42,.04)",
};

const headerBadgeDot: CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#16A34A",
};

/* =========================================================
   KPI CARDS
========================================================= */

const summaryGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const summaryCard: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E5EAF1",
  padding: "20px",
  minHeight: "132px",
  boxShadow:
    "0 7px 20px rgba(15, 23, 42, 0.05)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
};

const summaryTop: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const summaryIconWrapper: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
  flexShrink: 0,
};

const summaryLabel: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "5px",
};

const summaryValue: CSSProperties = {
  color: "#0F172A",
  fontSize: "25px",
  lineHeight: "1",
  fontWeight: 800,
  wordBreak: "break-word",
};

const summaryFooter: CSSProperties = {
  color: "#64748B",
  fontSize: "11px",
  marginTop: "13px",
};

/* =========================================================
   FORMULA
========================================================= */

const formulaCard: CSSProperties = {
  background:
    "linear-gradient(135deg, #EFF6FF 0%, #F8FBFF 100%)",
  border: "1px solid #DBEAFE",
  borderRadius: "16px",
  padding: "22px 24px",
  marginBottom: "25px",
  display: "flex",
  alignItems: "center",
  gap: "18px",
  boxShadow:
    "0 6px 18px rgba(37,99,235,.05)",
};

const formulaIcon: CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "13px",
  background: "#FFFFFF",
  color: "#2563EB",
  fontSize: "28px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #BFDBFE",
  flexShrink: 0,
};

const formulaContent: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const formulaHeadingRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const formulaTitle: CSSProperties = {
  margin: 0,
  color: "#1E3A8A",
  fontSize: "17px",
  fontWeight: 800,
};

const formulaDescription: CSSProperties = {
  margin: "5px 0 12px",
  color: "#64748B",
  fontSize: "13px",
};

const formulaBox: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#FFFFFF",
  borderRadius: "9px",
  border: "1px solid #BFDBFE",
  padding: "10px 15px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const formulaText: CSSProperties = {
  color: "#0F172A",
  fontWeight: 700,
  fontSize: "14px",
};

const formulaBadge: CSSProperties = {
  background: "#DBEAFE",
  color: "#1D4ED8",
  borderRadius: "20px",
  padding: "7px 11px",
  fontSize: "11px",
  fontWeight: 700,
};

/* =========================================================
   ERROR
========================================================= */

const errorCard: CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#991B1B",
  padding: "15px 18px",
  borderRadius: "12px",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const errorIcon: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "#FEE2E2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  color: "#DC2626",
  flexShrink: 0,
};

const errorContent: CSSProperties = {
  minWidth: 0,
};

const errorTitle: CSSProperties = {
  display: "block",
  fontSize: "14px",
};

const errorMessage: CSSProperties = {
  margin: "3px 0 0",
  fontSize: "13px",
  color: "#B91C1C",
};

const retryButton: CSSProperties = {
  marginLeft: "auto",
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "9px 15px",
  fontWeight: 700,
  cursor: "pointer",
  flexShrink: 0,
};

/* =========================================================
   TABLE CARD
========================================================= */

const tableCard: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "17px",
  border: "1px solid #E5EAF1",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const tableHeaderSection: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  padding: "21px 24px",
  borderBottom: "1px solid #EEF2F7",
};

const tableTitleWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const tableTitleIcon: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "11px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
  fontWeight: 800,
};

const tableTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 800,
};

const tableSubtitle: CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const recordBadge: CSSProperties = {
  background: "#F1F5F9",
  color: "#475569",
  padding: "8px 13px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

/* =========================================================
   TOOLBAR
========================================================= */

const toolbar: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(300px, 1fr) 190px",
  gap: "12px",
  padding: "16px 24px",
  background: "#FAFBFD",
  borderBottom: "1px solid #EEF2F7",
};

const searchWrapper: CSSProperties = {
  position: "relative",
};

const searchIcon: CSSProperties = {
  position: "absolute",
  left: "15px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "18px",
  color: "#64748B",
  pointerEvents: "none",
};

const searchInput: CSSProperties = {
  width: "100%",
  height: "46px",
  padding: "0 15px 0 43px",
  borderRadius: "10px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const sortSelect: CSSProperties = {
  width: "100%",
  height: "46px",
  padding: "0 12px",
  borderRadius: "10px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#334155",
  fontSize: "13px",
  outline: "none",
  cursor: "pointer",
};

const resultBar: CSSProperties = {
  padding: "11px 24px",
  background: "#F8FAFC",
  borderBottom: "1px solid #EEF2F7",
  color: "#64748B",
  fontSize: "12px",
};

/* =========================================================
   TABLE
========================================================= */

const tableWrapper: CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  minWidth: "900px",
  borderCollapse: "collapse",
};

const tableHeaderRow: CSSProperties = {
  background: "#F7F9FC",
};

const header: CSSProperties = {
  padding: "14px 18px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 800,
  color: "#64748B",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #E2E8F0",
};

const tableRow: CSSProperties = {
  borderBottom: "1px solid #EDF2F7",
};

const cell: CSSProperties = {
  padding: "14px 18px",
  color: "#334155",
  fontSize: "13px",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
};

const productCell: CSSProperties = {
  padding: "14px 18px",
  color: "#334155",
  fontSize: "13px",
  verticalAlign: "middle",
};

const productWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const productAvatar: CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "15px",
  fontWeight: 800,
  flexShrink: 0,
  border: "1px solid #BFDBFE",
};

const productName: CSSProperties = {
  fontWeight: 700,
  color: "#0F172A",
  fontSize: "13px",
};

const productId: CSSProperties = {
  display: "inline-block",
  marginTop: "4px",
  padding: "3px 7px",
  borderRadius: "5px",
  background: "#F1F5F9",
  color: "#64748B",
  fontSize: "9px",
  fontWeight: 700,
};

const metricValueWrapper: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const demandValue: CSSProperties = {
  color: "#0F172A",
  fontSize: "13px",
  fontWeight: 700,
};

const metricUnit: CSSProperties = {
  color: "#94A3B8",
  fontSize: "10px",
};

const currencyValue: CSSProperties = {
  color: "#334155",
  fontWeight: 600,
  fontSize: "13px",
};

const eoqValueWrapper: CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "7px 10px",
  borderRadius: "9px",
  minWidth: "88px",
  boxSizing: "border-box",
};

const eoqValue: CSSProperties = {
  color: "#2563EB",
  fontSize: "14px",
  fontWeight: 800,
};

const eoqUnit: CSSProperties = {
  color: "#94A3B8",
  fontSize: "9px",
  marginTop: "2px",
};

const statusBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "#ECFDF5",
  color: "#15803D",
  border: "1px solid #BBF7D0",
  borderRadius: "20px",
  padding: "5px 9px",
  fontSize: "10px",
  fontWeight: 800,
};

const statusDot: CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#16A34A",
};

/* =========================================================
   LOADING
========================================================= */

const loadingContainer: CSSProperties = {
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const loadingSpinner: CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: 800,
};

const loadingText: CSSProperties = {
  margin: "14px 0 3px",
  color: "#334155",
  fontWeight: 700,
  fontSize: "14px",
};

const loadingSubtext: CSSProperties = {
  color: "#94A3B8",
  fontSize: "12px",
};

/* =========================================================
   EMPTY STATE
========================================================= */

const emptyCell: CSSProperties = {
  padding: 0,
};

const emptyState: CSSProperties = {
  minHeight: "250px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const emptyIcon: CSSProperties = {
  width: "58px",
  height: "58px",
  borderRadius: "16px",
  background: "#F1F5F9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  marginBottom: "12px",
};

const emptyTitle: CSSProperties = {
  color: "#334155",
  fontSize: "15px",
};

const emptyDescription: CSSProperties = {
  color: "#94A3B8",
  fontSize: "12px",
  margin: "5px 0 12px",
};

const clearButton: CSSProperties = {
  border: "1px solid #DBEAFE",
  background: "#EFF6FF",
  color: "#2563EB",
  borderRadius: "8px",
  padding: "7px 12px",
  fontSize: "11px",
  fontWeight: 700,
  cursor: "pointer",
};

/* =========================================================
   TABLE FOOTER
========================================================= */

const tableFooter: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 20px",
  color: "#64748B",
  fontSize: "11px",
  borderTop: "1px solid #EDF2F7",
};

/* =========================================================
   BOTTOM SUMMARY
========================================================= */

const bottomGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "16px",
  marginTop: "18px",
};

const bottomSummary: CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E5EAF1",
  borderRadius: "14px",
  padding: "17px 19px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  boxShadow:
    "0 6px 18px rgba(15,23,42,.04)",
  minWidth: 0,
};

const bottomSummaryIcon: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const bottomSummaryLabel: CSSProperties = {
  display: "block",
  color: "#64748B",
  fontSize: "11px",
  fontWeight: 600,
};

const bottomSummaryValue: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 800,
  marginTop: "3px",
};

const bottomSummaryDescription: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "10px",
  marginTop: "3px",
};