import { useEffect, useMemo, useState } from "react";

// ==========================================================
// SIMPLE ICON COMPONENTS
// ==========================================================

const Icon = ({ children, size = 20, strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const RevenueIcon = () => (
  <Icon size={22}>
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="M7 15l3-4 3 2 5-7" />
  </Icon>
);

const ProfitIcon = () => (
  <Icon size={22}>
    <path d="M12 3v18" />
    <path d="M17 7.5c-.8-1-2.2-1.5-4-1.5-2.8 0-4.5 1.2-4.5 3s1.5 2.7 4.5 3c3 .3 4.5 1.2 4.5 3s-1.7 3-4.5 3c-1.9 0-3.4-.6-4.3-1.7" />
  </Icon>
);

const GrowthIcon = () => (
  <Icon size={22}>
    <path d="M3 17l6-6 4 4 8-9" />
    <path d="M15 6h6v6" />
  </Icon>
);

const OrdersIcon = () => (
  <Icon size={22}>
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
  </Icon>
);

const SearchIcon = () => (
  <Icon size={20}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </Icon>
);

const FilterIcon = () => (
  <Icon size={18}>
    <path d="M4 5h16" />
    <path d="M7 12h10" />
    <path d="M10 19h4" />
  </Icon>
);

const SortIcon = () => (
  <Icon size={18}>
    <path d="M8 6h13" />
    <path d="M8 12h9" />
    <path d="M8 18h5" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </Icon>
);

const ChevronDown = () => (
  <Icon size={16}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

const ChevronLeft = () => (
  <Icon size={18}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

const ChevronRight = () => (
  <Icon size={18}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

const TrendingUp = () => (
  <Icon size={16}>
    <path d="M3 17l6-6 4 4 8-9" />
    <path d="M15 6h6v6" />
  </Icon>
);

// ==========================================================
// MAIN COMPONENT
// ==========================================================

export default function RevenueAnalysis() {
  const [revenueData, setRevenueData] = useState([]);
  const [profitData, setProfitData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("All Periods");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ==========================================================
  // FETCH DATA FROM BACKEND
  // ==========================================================

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError("");

        const [revenueResponse, profitResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/sales/revenue-analysis`
            ),
            fetch(
              `${API_BASE_URL}/sales/profit-margin`
            ),
          ]);

        if (!revenueResponse.ok) {
          throw new Error(
            `Revenue API returned ${revenueResponse.status}`
          );
        }

        if (!profitResponse.ok) {
          throw new Error(
            `Profit API returned ${profitResponse.status}`
          );
        }

        const revenueResult =
          await revenueResponse.json();

        const profitResult =
          await profitResponse.json();

        setRevenueData(
          Array.isArray(revenueResult)
            ? revenueResult
            : []
        );

        setProfitData(
          Array.isArray(profitResult)
            ? profitResult
            : []
        );
      } catch (err) {
        console.error(
          "Revenue analysis error:",
          err
        );

        setError(
          "Unable to load revenue analysis data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [API_BASE_URL]);

  // ==========================================================
  // CURRENCY FORMATTER
  // ==========================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // ==========================================================
  // PERCENTAGE FORMATTER
  // ==========================================================

  const formatPercentage = (value) => {
    const number = Number(value) || 0;

    return `${number >= 0 ? "+" : ""}${number.toFixed(
      1
    )}%`;
  };

  // ==========================================================
  // COMBINE REVENUE AND PROFIT RECORDS
  // ==========================================================

  const combinedData = useMemo(() => {
    return revenueData.map((revenue) => {
      const matchingProfit = profitData.find(
        (profit) =>
          profit.analysis_period ===
          revenue.analysis_period
      );

      return {
        ...revenue,

        gross_profit:
          matchingProfit?.gross_profit || 0,

        total_cost:
          matchingProfit?.total_cost || 0,

        profit_margin_percentage:
          matchingProfit?.profit_margin_percentage ||
          0,
      };
    });
  }, [revenueData, profitData]);

  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const filteredData = useMemo(() => {
    let data = [...combinedData];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      data = data.filter((item) =>
        String(item.analysis_period)
          .toLowerCase()
          .includes(search)
      );
    }

    if (periodFilter !== "All Periods") {
      data = data.filter(
        (item) =>
          item.analysis_period ===
          periodFilter
      );
    }

    if (sortOrder === "Highest Revenue") {
      data.sort(
        (a, b) =>
          Number(b.total_revenue || 0) -
          Number(a.total_revenue || 0)
      );
    } else if (sortOrder === "Lowest Revenue") {
      data.sort(
        (a, b) =>
          Number(a.total_revenue || 0) -
          Number(b.total_revenue || 0)
      );
    } else if (sortOrder === "Highest Profit") {
      data.sort(
        (a, b) =>
          Number(b.gross_profit || 0) -
          Number(a.gross_profit || 0)
      );
    } else {
      data.sort((a, b) => {
        const dateA = new Date(
          a.created_at || 0
        );

        const dateB = new Date(
          b.created_at || 0
        );

        return dateB - dateA;
      });
    }

    return data;
  }, [
    combinedData,
    searchTerm,
    periodFilter,
    sortOrder,
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length / itemsPerPage
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    periodFilter,
    sortOrder,
  ]);

  // ==========================================================
  // KPI CALCULATIONS
  // ==========================================================

  const totalRevenue = revenueData.reduce(
    (sum, item) =>
      sum + Number(item.total_revenue || 0),
    0
  );

  const totalProfit = profitData.reduce(
    (sum, item) =>
      sum + Number(item.gross_profit || 0),
    0
  );

  const totalOrders = revenueData.reduce(
    (sum, item) =>
      sum + Number(item.total_orders || 0),
    0
  );

  const latestRevenue =
    revenueData.length > 0
      ? revenueData[0]
      : null;

  const growthRate =
    latestRevenue?.revenue_growth_rate || 0;

  // ==========================================================
  // PERIOD OPTIONS
  // ==========================================================

  const periodOptions = [
    "All Periods",
    ...new Set(
      revenueData.map(
        (item) => item.analysis_period
      )
    ),
  ];

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>

          <p style={styles.loadingText}>
            Loading revenue analysis...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>
            Revenue Analysis
          </h2>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            style={styles.retryButton}
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div style={styles.page}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <RevenueIcon />
          </div>

          <div>
            <h1 style={styles.title}>
              Revenue Analysis
            </h1>

            <p style={styles.subtitle}>
              Monitor and analyze your revenue
              performance
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div style={styles.statsGrid}>
        {/* TOTAL REVENUE */}

        <div
          style={{
            ...styles.statCard,
            background: "#FFFFFF",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#E8F0FF",
                color: "#2563EB",
              }}
            >
              <RevenueIcon />
            </div>

            <div style={styles.miniChartBlue}>
              <TrendingUp />
            </div>
          </div>

          <p
            style={{
              ...styles.statLabel,
              color: "#2563EB",
            }}
          >
            Total Revenue
          </p>

          <h2 style={styles.statValue}>
            {formatCurrency(totalRevenue)}
          </h2>

          <p style={styles.statDescription}>
            Total revenue generated
          </p>
        </div>

        {/* TOTAL PROFIT */}

        <div
          style={{
            ...styles.statCard,
            background: "#FFFFFF",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#E7F8EF",
                color: "#16A34A",
              }}
            >
              <ProfitIcon />
            </div>

            <div style={styles.miniChartGreen}>
              <TrendingUp />
            </div>
          </div>

          <p
            style={{
              ...styles.statLabel,
              color: "#16A34A",
            }}
          >
            Total Profit
          </p>

          <h2 style={styles.statValue}>
            {formatCurrency(totalProfit)}
          </h2>

          <p style={styles.statDescription}>
            Gross profit generated
          </p>
        </div>

        {/* TOTAL ORDERS */}

        <div
          style={{
            ...styles.statCard,
            background: "#FFFFFF",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#FFF4D9",
                color: "#F59E0B",
              }}
            >
              <OrdersIcon />
            </div>

            <div style={styles.miniChartOrange}>
              <TrendingUp />
            </div>
          </div>

          <p
            style={{
              ...styles.statLabel,
              color: "#D97706",
            }}
          >
            Total Orders
          </p>

          <h2 style={styles.statValue}>
            {totalOrders.toLocaleString()}
          </h2>

          <p style={styles.statDescription}>
            Orders across all periods
          </p>
        </div>

        {/* GROWTH */}

        <div
          style={{
            ...styles.statCard,
            background: "#FFFFFF",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#F1E8FF",
                color: "#7C3AED",
              }}
            >
              <GrowthIcon />
            </div>

            <div style={styles.miniChartPurple}>
              <TrendingUp />
            </div>
          </div>

          <p
            style={{
              ...styles.statLabel,
              color: "#7C3AED",
            }}
          >
            Revenue Growth
          </p>

          <h2 style={styles.statValue}>
            {formatPercentage(growthRate)}
          </h2>

          <p style={styles.statDescription}>
            Latest recorded growth rate
          </p>
        </div>
      </div>

      {/* ======================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div style={styles.filterContainer}>
        <div style={styles.searchBox}>
          <SearchIcon />

          <input
            type="text"
            placeholder="Search revenue by period..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            style={styles.searchInput}
          />
        </div>

        <div style={styles.selectWrapper}>
          <FilterIcon />

          <select
            value={periodFilter}
            onChange={(event) =>
              setPeriodFilter(
                event.target.value
              )
            }
            style={styles.select}
          >
            {periodOptions.map(
              (period) => (
                <option
                  key={period}
                  value={period}
                >
                  {period}
                </option>
              )
            )}
          </select>

          <ChevronDown />
        </div>

        <div style={styles.selectWrapper}>
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
            style={styles.select}
          >
            <option value="Newest First">
              Newest First
            </option>

            <option value="Highest Revenue">
              Highest Revenue
            </option>

            <option value="Lowest Revenue">
              Lowest Revenue
            </option>

            <option value="Highest Profit">
              Highest Profit
            </option>
          </select>

          <ChevronDown />
        </div>
      </div>

      {/* ======================================================
          REVENUE LIST
      ====================================================== */}

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div style={styles.tableTitleWrapper}>
            <div style={styles.tableIcon}>
              <RevenueIcon />
            </div>

            <h2 style={styles.tableTitle}>
              Revenue Performance
            </h2>
          </div>
        </div>

        {/* TABLE */}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th
                  style={{
                    ...styles.th,
                    textAlign: "left",
                  }}
                >
                  Period
                </th>

                <th style={styles.th}>
                  Revenue
                </th>

                <th style={styles.th}>
                  Profit
                </th>

                <th style={styles.th}>
                  Orders
                </th>

                <th style={styles.th}>
                  Units Sold
                </th>

                <th style={styles.th}>
                  Growth
                </th>

                <th style={styles.th}>
                  Profit Margin
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map(
                  (item) => (
                    <tr
                      key={item.id}
                      style={styles.tableRow}
                    >
                      {/* PERIOD */}

                      <td
                        style={{
                          ...styles.td,
                          textAlign: "left",
                        }}
                      >
                        <div style={styles.periodCell}>
                          <div style={styles.periodAvatar}>
                            {String(
                              item.analysis_period ||
                                "R"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={
                                styles.periodName
                              }
                            >
                              {
                                item.analysis_period
                              }
                            </div>

                            <span
                              style={
                                styles.recordBadge
                              }
                            >
                              REV-
                              {String(
                                item.id
                              ).padStart(
                                4,
                                "0"
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* REVENUE */}

                      <td style={styles.td}>
                        <strong
                          style={
                            styles.revenueAmount
                          }
                        >
                          {formatCurrency(
                            item.total_revenue
                          )}
                        </strong>
                      </td>

                      {/* PROFIT */}

                      <td style={styles.td}>
                        <span
                          style={
                            styles.profitAmount
                          }
                        >
                          {formatCurrency(
                            item.gross_profit
                          )}
                        </span>
                      </td>

                      {/* ORDERS */}

                      <td style={styles.td}>
                        {Number(
                          item.total_orders || 0
                        ).toLocaleString()}
                      </td>

                      {/* UNITS */}

                      <td style={styles.td}>
                        {Number(
                          item.total_units_sold ||
                            0
                        ).toLocaleString()}
                      </td>

                      {/* GROWTH */}

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.growthBadge,
                            background:
                              Number(
                                item.revenue_growth_rate
                              ) >= 0
                                ? "#E9F9EF"
                                : "#FEECEC",
                            color:
                              Number(
                                item.revenue_growth_rate
                              ) >= 0
                                ? "#16A34A"
                                : "#DC2626",
                          }}
                        >
                          <TrendingUp />

                          {formatPercentage(
                            item.revenue_growth_rate
                          )}
                        </span>
                      </td>

                      {/* PROFIT MARGIN */}

                      <td style={styles.td}>
                        <span
                          style={
                            styles.marginBadge
                          }
                        >
                          {Number(
                            item.profit_margin_percentage ||
                              0
                          ).toFixed(1)}
                          %
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={
                      styles.emptyState
                    }
                  >
                    <div
                      style={
                        styles.emptyIcon
                      }
                    >
                      <RevenueIcon />
                    </div>

                    <h3>
                      No revenue records
                    </h3>

                    <p>
                      No revenue analysis
                      data matches your
                      current filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ====================================================
            TABLE FOOTER / PAGINATION
        ==================================================== */}

        <div style={styles.tableFooter}>
          <div style={styles.resultsText}>
            Showing{" "}
            {filteredData.length === 0
              ? 0
              : (currentPage - 1) *
                  itemsPerPage +
                1}{" "}
            to{" "}
            {Math.min(
              currentPage *
                itemsPerPage,
              filteredData.length
            )}{" "}
            of{" "}
            {filteredData.length}{" "}
            revenue records
          </div>

          <div style={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              style={{
                ...styles.pageButton,
                opacity:
                  currentPage === 1
                    ? 0.45
                    : 1,
                cursor:
                  currentPage === 1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <ChevronLeft />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                style={{
                  ...styles.pageNumber,
                  background:
                    currentPage ===
                    page
                      ? "#2563EB"
                      : "#FFFFFF",
                  color:
                    currentPage ===
                    page
                      ? "#FFFFFF"
                      : "#475569",
                  border:
                    currentPage ===
                    page
                      ? "1px solid #2563EB"
                      : "1px solid #E2E8F0",
                }}
              >
                {page}
              </button>
            ))}

            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              style={{
                ...styles.pageButton,
                opacity:
                  currentPage ===
                  totalPages
                    ? 0.45
                    : 1,
                cursor:
                  currentPage ===
                  totalPages
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #F8FAFF 0%, #FFFFFF 45%, #F8FAFC 100%)",
    padding: "34px 38px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#0F172A",
    boxSizing: "border-box",
  },

  // ========================================================
  // HEADER
  // ========================================================

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  headerIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #8BA8FF, #5B7FF0)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 8px 20px rgba(59,130,246,.18)",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.15,
    fontWeight: 750,
    letterSpacing: "-0.8px",
    color: "#0F172A",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748B",
    fontSize: "14px",
    fontWeight: 450,
  },

  // ========================================================
  // STAT CARDS
  // ========================================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  statCard: {
    minHeight: "148px",
    border: "1px solid #E7EBF3",
    borderRadius: "13px",
    padding: "20px",
    boxSizing: "border-box",
    boxShadow:
      "0 7px 22px rgba(15,23,42,.055)",
    position: "relative",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "9px",
  },

  statIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  miniChartBlue: {
    color: "#2563EB",
    opacity: 0.95,
  },

  miniChartGreen: {
    color: "#16A34A",
    opacity: 0.95,
  },

  miniChartOrange: {
    color: "#F59E0B",
    opacity: 0.95,
  },

  miniChartPurple: {
    color: "#7C3AED",
    opacity: 0.95,
  },

  statLabel: {
    margin: "0 0 5px",
    fontSize: "13px",
    fontWeight: 600,
  },

  statValue: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 750,
    color: "#0F172A",
    letterSpacing: "-0.5px",
  },

  statDescription: {
    margin: "7px 0 0",
    color: "#64748B",
    fontSize: "12px",
  },

  // ========================================================
  // FILTER BAR
  // ========================================================

  filterContainer: {
    background: "#FFFFFF",
    border: "1px solid #E7EBF3",
    borderRadius: "13px",
    padding: "13px",
    marginBottom: "17px",
    display: "grid",
    gridTemplateColumns:
      "minmax(280px, 1fr) 180px 190px",
    gap: "12px",
    boxShadow:
      "0 6px 18px rgba(15,23,42,.045)",
    boxSizing: "border-box",
  },

  searchBox: {
    height: "46px",
    border: "1px solid #E1E7F0",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px",
    color: "#64748B",
    boxSizing: "border-box",
    background: "#FFFFFF",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "#0F172A",
    background: "transparent",
    fontFamily: "inherit",
  },

  selectWrapper: {
    height: "46px",
    border: "1px solid #E1E7F0",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 12px",
    color: "#64748B",
    position: "relative",
    boxSizing: "border-box",
  },

  select: {
    appearance: "none",
    WebkitAppearance: "none",
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "13px",
    color: "#334155",
    fontFamily: "inherit",
    cursor: "pointer",
  },

  // ========================================================
  // TABLE CARD
  // ========================================================

  tableCard: {
    background: "#FFFFFF",
    border: "1px solid #E7EBF3",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow:
      "0 8px 25px rgba(15,23,42,.055)",
  },

  tableHeader: {
    padding: "21px 20px",
    borderBottom: "1px solid #EEF2F7",
  },

  tableTitleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  tableIcon: {
    color: "#2563EB",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  tableTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    color: "#0F172A",
  },

  // ========================================================
  // TABLE
  // ========================================================

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "920px",
  },

  tableHeadRow: {
    background:
      "linear-gradient(180deg, #F5F8FD 0%, #F0F4FA 100%)",
  },

  th: {
    padding: "17px 14px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#475569",
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  tableRow: {
    borderBottom:
      "1px solid #EDF1F6",
    transition:
      "background .2s ease",
  },

  td: {
    padding: "17px 14px",
    fontSize: "13px",
    color: "#475569",
    textAlign: "right",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },

  periodCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  periodAvatar: {
    width: "43px",
    height: "43px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #DBEAFE, #EFF6FF)",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 700,
    flexShrink: 0,
  },

  periodName: {
    fontSize: "13px",
    color: "#0F172A",
    fontWeight: 650,
    marginBottom: "5px",
    textAlign: "left",
  },

  recordBadge: {
    display: "inline-block",
    padding: "3px 7px",
    borderRadius: "6px",
    background: "#EEF4FF",
    color: "#2563EB",
    fontSize: "10px",
    fontWeight: 700,
  },

  revenueAmount: {
    color: "#0F172A",
    fontSize: "13px",
  },

  profitAmount: {
    color: "#15803D",
    fontWeight: 650,
  },

  growthBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 9px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 700,
  },

  marginBadge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#F1E8FF",
    color: "#7C3AED",
    fontSize: "11px",
    fontWeight: 700,
  },

  // ========================================================
  // EMPTY STATE
  // ========================================================

  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#64748B",
  },

  emptyIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#EEF4FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },

  // ========================================================
  // TABLE FOOTER
  // ========================================================

  tableFooter: {
    padding: "16px 20px",
    borderTop: "1px solid #EDF1F6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  resultsText: {
    color: "#64748B",
    fontSize: "12px",
  },

  pagination: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  pageButton: {
    width: "35px",
    height: "35px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pageNumber: {
    width: "35px",
    height: "35px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  // ========================================================
  // LOADING
  // ========================================================

  loadingContainer: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingSpinner: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "4px solid #E2E8F0",
    borderTop:
      "4px solid #2563EB",
    animation:
      "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "15px",
    color: "#64748B",
    fontSize: "14px",
  },

  // ========================================================
  // ERROR
  // ========================================================

  errorContainer: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "30px",
    background: "#FFFFFF",
    borderRadius: "14px",
    border: "1px solid #FECACA",
    boxShadow:
      "0 8px 25px rgba(15,23,42,.06)",
    textAlign: "center",
  },

  errorTitle: {
    margin: "0 0 10px",
    color: "#0F172A",
  },

  errorText: {
    color: "#B91C1C",
    marginBottom: "20px",
  },

  retryButton: {
    border: "none",
    background: "#2563EB",
    color: "#FFFFFF",
    padding: "11px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};