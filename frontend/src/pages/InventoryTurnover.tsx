import { useEffect, useMemo, useState } from "react";
import { inventoryTurnoverService } from "../services/inventoryTurnoverService";

interface InventoryTurnoverItem {
  id: number;
  sku: string;
  item_name: string;
  beginning_inventory: number;
  ending_inventory: number;
  average_inventory: number;
  cost_of_goods_sold: number;
  inventory_turnover_ratio: number;
  days_in_inventory: number;
  created_at: string;
  updated_at: string;
}

export default function InventoryTurnover() {
  const [items, setItems] = useState<InventoryTurnoverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    loadInventoryTurnover();
  }, []);

  async function loadInventoryTurnover() {
    try {
      setLoading(true);
      setError("");

      const data =
        await inventoryTurnoverService.getInventoryTurnover();

      setItems(data);
    } catch (err) {
      console.error(
        "Inventory turnover error:",
        err
      );

      setError(
        "Unable to load inventory turnover data."
      );
    } finally {
      setLoading(false);
    }
  }

  const formatRand = (value: number) => {
    return `R ${value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (item) =>
          item.item_name
            .toLowerCase()
            .includes(search) ||
          item.sku
            .toLowerCase()
            .includes(search)
      );
    }

    if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
    }

    if (sortOrder === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );
    }

    if (sortOrder === "highest_turnover") {
      result.sort(
        (a, b) =>
          b.inventory_turnover_ratio -
          a.inventory_turnover_ratio
      );
    }

    if (sortOrder === "lowest_turnover") {
      result.sort(
        (a, b) =>
          a.inventory_turnover_ratio -
          b.inventory_turnover_ratio
      );
    }

    return result;
  }, [items, searchTerm, sortOrder]);

  const totalPages = Math.ceil(
    filteredItems.length / itemsPerPage
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalProducts = items.length;

  const averageTurnover =
    items.length > 0
      ? items.reduce(
          (total, item) =>
            total +
            item.inventory_turnover_ratio,
          0
        ) / items.length
      : 0;

  const averageDays =
    items.length > 0
      ? items.reduce(
          (total, item) =>
            total + item.days_in_inventory,
          0
        ) / items.length
      : 0;

  const totalCOGS = items.reduce(
    (total, item) =>
      total + item.cost_of_goods_sold,
    0
  );

  function handleSearch(
    value: string
  ) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleSort(
    value: string
  ) {
    setSortOrder(value);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  }

  return (
    <div style={pageContainer}>
      {/* PAGE HEADER */}
      <div style={pageHeader}>
        <div style={headerLeft}>
          <div style={headerIcon}>
            📦
          </div>

          <div>
            <h1 style={pageTitle}>
              Inventory Turnover
            </h1>

            <p style={pageSubtitle}>
              Monitor inventory efficiency,
              turnover ratio and days in
              inventory
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadInventoryTurnover}
          style={refreshButton}
        >
          <span style={buttonIcon}>
            ↻
          </span>

          Refresh Data
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div style={summaryGrid}>
        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIcon,
                background:
                  "#EFF6FF",
                color: "#2563EB",
              }}
            >
              📦
            </div>

            <div
              style={{
                ...miniChart,
                color: "#2563EB",
              }}
            >
              ╱╲╱
            </div>
          </div>

          <p style={summaryLabel}>
            Total Products
          </p>

          <h2 style={summaryValue}>
            {totalProducts}
          </h2>

          <p style={summaryDescription}>
            Products tracked
          </p>
        </div>

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIcon,
                background:
                  "#ECFDF5",
                color: "#16A34A",
              }}
            >
              ↻
            </div>

            <div
              style={{
                ...miniChart,
                color: "#16A34A",
              }}
            >
              ╱╲╱
            </div>
          </div>

          <p style={summaryLabel}>
            Average Turnover
          </p>

          <h2 style={summaryValue}>
            {averageTurnover.toFixed(2)}
          </h2>

          <p style={summaryDescription}>
            Inventory efficiency
          </p>
        </div>

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIcon,
                background:
                  "#FFF7ED",
                color: "#F59E0B",
              }}
            >
              ◷
            </div>

            <div
              style={{
                ...miniChart,
                color: "#F59E0B",
              }}
            >
              ╱╲╱
            </div>
          </div>

          <p style={summaryLabel}>
            Average Days
          </p>

          <h2 style={summaryValue}>
            {averageDays.toFixed(2)}
          </h2>

          <p style={summaryDescription}>
            Days in inventory
          </p>
        </div>

        <div style={summaryCard}>
          <div style={summaryTop}>
            <div
              style={{
                ...summaryIcon,
                background:
                  "#F3E8FF",
                color: "#7C3AED",
              }}
            >
              R
            </div>

            <div
              style={{
                ...miniChart,
                color: "#7C3AED",
              }}
            >
              ╱╲╱
            </div>
          </div>

          <p style={summaryLabel}>
            Total COGS
          </p>

          <h2
            style={{
              ...summaryValue,
              fontSize: "25px",
            }}
          >
            {formatRand(totalCOGS)}
          </h2>

          <p style={summaryDescription}>
            Cost of goods sold
          </p>
        </div>
      </div>

      {/* SEARCH / FILTER AREA */}
      <div style={filterArea}>
        <div style={searchBox}>
          <span style={searchIcon}>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(event) =>
              handleSearch(
                event.target.value
              )
            }
            style={searchInput}
          />
        </div>

        <div style={selectBox}>
          <span style={filterIcon}>
            ⚑
          </span>

          <select
            value={sortOrder}
            onChange={(event) =>
              handleSort(
                event.target.value
              )
            }
            style={selectInput}
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="highest_turnover">
              Highest Turnover
            </option>

            <option value="lowest_turnover">
              Lowest Turnover
            </option>
          </select>

          <span style={selectArrow}>
           ⌄
          </span>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div style={errorBox}>
          <strong>
            Error
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadInventoryTurnover}
            style={retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* INVENTORY TABLE CARD */}
      <div style={tableCard}>
        <div style={tableCardHeader}>
          <div style={listTitleWrapper}>
            <div style={listIcon}>
              📊
            </div>

            <div>
              <h2 style={listTitle}>
                Inventory Turnover List
              </h2>

              <p style={listSubtitle}>
                Inventory efficiency
                performance
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={loadingContainer}>
            <div style={loadingSpinner}>
              ⟳
            </div>

            <p>
              Loading inventory
              turnover data...
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table style={table}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={header}>
                      Product
                    </th>

                    <th style={header}>
                      SKU
                    </th>

                    <th style={header}>
                      Beginning
                    </th>

                    <th style={header}>
                      Ending
                    </th>

                    <th style={header}>
                      Average
                    </th>

                    <th style={header}>
                      COGS
                    </th>

                    <th style={header}>
                      Turnover
                    </th>

                    <th style={header}>
                      Days
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedItems.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={
                          emptyCell
                        }
                      >
                        No inventory
                        turnover records
                        found.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map(
                      (item) => (
                        <tr
                          key={item.id}
                          style={
                            tableRow
                          }
                        >
                          {/* PRODUCT */}
                          <td
                            style={{
                              ...cell,
                              textAlign:
                                "left",
                            }}
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
                                {item.item_name
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <div
                                  style={
                                    productName
                                  }
                                >
                                  {
                                    item.item_name
                                  }
                                </div>

                                <div
                                  style={
                                    productSubtext
                                  }
                                >
                                  Inventory
                                  Item
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td style={cell}>
                            <span
                              style={
                                skuBadge
                              }
                            >
                              {item.sku}
                            </span>
                          </td>

                          {/* BEGINNING */}
                          <td style={cell}>
                            {item.beginning_inventory.toLocaleString(
                              "en-ZA"
                            )}
                          </td>

                          {/* ENDING */}
                          <td style={cell}>
                            {item.ending_inventory.toLocaleString(
                              "en-ZA"
                            )}
                          </td>

                          {/* AVERAGE */}
                          <td style={cell}>
                            {item.average_inventory.toLocaleString(
                              "en-ZA"
                            )}
                          </td>

                          {/* COGS */}
                          <td style={cell}>
                            {formatRand(
                              item.cost_of_goods_sold
                            )}
                          </td>

                          {/* TURNOVER */}
                          <td
                            style={{
                              ...cell,
                              fontWeight:
                                "700",
                            }}
                          >
                            <span
                              style={
                                turnoverBadge
                              }
                            >
                              {item.inventory_turnover_ratio.toFixed(
                                2
                              )}
                            </span>
                          </td>

                          {/* DAYS */}
                          <td style={cell}>
                            <span
                              style={
                                daysBadge
                              }
                            >
                              {item.days_in_inventory.toFixed(
                                2
                              )}{" "}
                              days
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div style={tableFooter}>
              <div style={showingText}>
                Showing{" "}
                {filteredItems.length ===
                0
                  ? 0
                  : (currentPage - 1) *
                      itemsPerPage +
                    1}{" "}
                to{" "}
                {Math.min(
                  currentPage *
                    itemsPerPage,
                  filteredItems.length
                )}{" "}
                of{" "}
                {filteredItems.length}{" "}
                products
              </div>

              {totalPages > 0 && (
                <div
                  style={
                    pagination
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage -
                          1
                      )
                    }
                    disabled={
                      currentPage ===
                      1
                    }
                    style={{
                      ...pageButton,
                      opacity:
                        currentPage ===
                        1
                          ? 0.5
                          : 1,
                    }}
                  >
                    ‹
                  </button>

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        goToPage(
                          page
                        )
                      }
                      style={{
                        ...pageButton,
                        ...(currentPage ===
                        page
                          ? activePageButton
                          : {}),
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage +
                          1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    style={{
                      ...pageButton,
                      opacity:
                        currentPage ===
                        totalPages
                          ? 0.5
                          : 1,
                    }}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   PAGE
========================= */

const pageContainer: React.CSSProperties = {
  padding: "30px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box",
};

/* =========================
   HEADER
========================= */

const pageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  gap: "20px",
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const headerIcon: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#DBEAFE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  boxShadow:
    "0 6px 18px rgba(37,99,235,.15)",
};

const pageTitle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#0F172A",
  margin: 0,
};

const pageSubtitle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "15px",
};

const refreshButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "10px",
  padding: "13px 20px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow:
    "0 6px 16px rgba(37,99,235,.25)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const buttonIcon: React.CSSProperties = {
  fontSize: "19px",
};

/* =========================
   SUMMARY CARDS
========================= */

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const summaryCard: React.CSSProperties = {
  background: "#FFFFFF",
  padding: "20px",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  boxShadow:
    "0 8px 20px rgba(15,23,42,.07)",
  minHeight: "155px",
  boxSizing: "border-box",
};

const summaryTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "14px",
};

const summaryIcon: React.CSSProperties = {
  width: "45px",
  height: "45px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  fontWeight: "700",
};

const miniChart: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "700",
  letterSpacing: "-4px",
  opacity: 0.9,
};

const summaryLabel: React.CSSProperties = {
  margin: 0,
  color: "#2563EB",
  fontSize: "14px",
  fontWeight: "600",
};

const summaryValue: React.CSSProperties = {
  margin: "7px 0",
  color: "#0F172A",
  fontSize: "29px",
  fontWeight: "700",
};

const summaryDescription: React.CSSProperties = {
  margin: 0,
  color: "#64748B",
  fontSize: "13px",
};

/* =========================
   FILTER AREA
========================= */

const filterArea: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "1fr 220px",
  gap: "15px",
  marginBottom: "20px",
};

const searchBox: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "11px",
  height: "52px",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  boxSizing: "border-box",
};

const searchIcon: React.CSSProperties = {
  fontSize: "26px",
  color: "#64748B",
  marginRight: "10px",
};

const searchInput: React.CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  color: "#334155",
  background: "transparent",
};

const selectBox: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "11px",
  height: "52px",
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  position: "relative",
  boxSizing: "border-box",
};

const filterIcon: React.CSSProperties = {
  fontSize: "19px",
  color: "#475569",
  marginRight: "8px",
};

const selectInput: React.CSSProperties = {
  appearance: "none",
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: "14px",
  color: "#334155",
  cursor: "pointer",
};

const selectArrow: React.CSSProperties = {
  position: "absolute",
  right: "15px",
  pointerEvents: "none",
  color: "#475569",
  fontSize: "18px",
};

/* =========================
   ERROR
========================= */

const errorBox: React.CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#991B1B",
  padding: "15px 18px",
  borderRadius: "10px",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const retryButton: React.CSSProperties = {
  marginLeft: "auto",
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "7px",
  padding: "7px 13px",
  cursor: "pointer",
  fontWeight: "600",
};

/* =========================
   TABLE CARD
========================= */

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  boxShadow:
    "0 8px 25px rgba(15,23,42,.07)",
  overflow: "hidden",
};

const tableCardHeader: React.CSSProperties = {
  padding: "22px 20px",
  borderBottom:
    "1px solid #EEF2F7",
};

const listTitleWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const listIcon: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
};

const listTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "19px",
  fontWeight: "700",
};

const listSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

/* =========================
   TABLE
========================= */

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderRow: React.CSSProperties = {
  background: "#F8FAFC",
};

const header: React.CSSProperties = {
  padding: "16px 15px",
  textAlign: "center",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "700",
  borderBottom:
    "1px solid #E2E8F0",
  whiteSpace: "nowrap",
};

const tableRow: React.CSSProperties = {
  borderBottom:
    "1px solid #EEF2F7",
  transition: "background .2s ease",
};

const cell: React.CSSProperties = {
  padding: "16px 15px",
  textAlign: "center",
  color: "#475569",
  fontSize: "14px",
};

const productWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const productAvatar: React.CSSProperties = {
  width: "40px",
  height: "40px",
  minWidth: "40px",
  borderRadius: "50%",
  background: "#DBEAFE",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "16px",
};

const productName: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: "700",
  fontSize: "14px",
};

const productSubtext: React.CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
  marginTop: "3px",
};

const skuBadge: React.CSSProperties = {
  display: "inline-block",
  background: "#EFF6FF",
  color: "#2563EB",
  padding: "5px 9px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
};

const turnoverBadge: React.CSSProperties = {
  display: "inline-block",
  background: "#ECFDF5",
  color: "#15803D",
  padding: "6px 10px",
  borderRadius: "7px",
};

const daysBadge: React.CSSProperties = {
  display: "inline-block",
  background: "#F8FAFC",
  color: "#475569",
  padding: "6px 9px",
  borderRadius: "7px",
  fontSize: "13px",
};

const emptyCell: React.CSSProperties = {
  padding: "40px",
  textAlign: "center",
  color: "#64748B",
};

/* =========================
   LOADING
========================= */

const loadingContainer: React.CSSProperties = {
  padding: "60px 20px",
  textAlign: "center",
  color: "#64748B",
};

const loadingSpinner: React.CSSProperties = {
  fontSize: "32px",
  color: "#2563EB",
  marginBottom: "10px",
};

/* =========================
   FOOTER / PAGINATION
========================= */

const tableFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderTop:
    "1px solid #EEF2F7",
  gap: "20px",
};

const showingText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
};

const pagination: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const pageButton: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#334155",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
};

const activePageButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "1px solid #2563EB",
};