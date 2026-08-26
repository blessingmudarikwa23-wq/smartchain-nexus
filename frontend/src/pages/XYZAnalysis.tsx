import { useEffect, useMemo, useState } from "react";

import {
  xyzAnalysisService,
  type XYZAnalysis as XYZAnalysisRecord,
  type XYZAnalysisCreate,
} from "../services/xyzAnalysisService";

export default function XYZAnalysis() {
  const [products, setProducts] = useState<
    XYZAnalysisRecord[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [sortOrder, setSortOrder] =
    useState("NEWEST");

  const [formData, setFormData] =
    useState<XYZAnalysisCreate>({
      sku: "",
      item_name: "",
      average_demand: 0,
      demand_variability: 0,
      coefficient_of_variation: 0,
      classification: "Z",
    });

  useEffect(() => {
    loadXYZAnalysis();
  }, []);

  async function loadXYZAnalysis() {
    try {
      setLoading(true);

      const data =
        await xyzAnalysisService.getXYZAnalysis();

      setProducts(data);
    } catch (error) {
      console.error(
        "Failed to load XYZ analysis:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);

    setFormData({
      sku: "",
      item_name: "",
      average_demand: 0,
      demand_variability: 0,
      coefficient_of_variation: 0,
      classification: "Z",
    });

    setShowForm(true);
  }

  function openEditForm(
    product: XYZAnalysisRecord
  ) {
    setEditingId(product.id);

    setFormData({
      sku: product.sku,
      item_name: product.item_name,
      average_demand: product.average_demand,
      demand_variability:
        product.demand_variability,
      coefficient_of_variation:
        product.coefficient_of_variation,
      classification: product.classification,
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleChange(
    field: keyof XYZAnalysisCreate,
    value: string | number
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      if (editingId !== null) {
        await xyzAnalysisService.updateXYZAnalysis(
          editingId,
          formData
        );
      } else {
        await xyzAnalysisService.createXYZAnalysis(
          formData
        );
      }

      await loadXYZAnalysis();

      closeForm();
    } catch (error) {
      console.error(
        "Failed to save XYZ analysis:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this XYZ analysis?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await xyzAnalysisService.deleteXYZAnalysis(id);

      await loadXYZAnalysis();
    } catch (error) {
      console.error(
        "Failed to delete XYZ analysis:",
        error
      );
    }
  }

  function getCategoryDescription(
    category: string
  ) {
    if (category === "X") {
      return "High Predictability";
    }

    if (category === "Y") {
      return "Medium Predictability";
    }

    return "Low Predictability";
  }

  function getCategoryColor(category: string) {
    if (category === "X") {
      return {
        background: "#EFF6FF",
        color: "#2563EB",
        border: "#BFDBFE",
      };
    }

    if (category === "Y") {
      return {
        background: "#FFF7ED",
        color: "#EA580C",
        border: "#FED7AA",
      };
    }

    return {
      background: "#F5F3FF",
      color: "#7C3AED",
      border: "#DDD6FE",
    };
  }

  const categoryX = products.filter(
    (item) =>
      item.classification?.toUpperCase() === "X"
  ).length;

  const categoryY = products.filter(
    (item) =>
      item.classification?.toUpperCase() === "Y"
  ).length;

  const categoryZ = products.filter(
    (item) =>
      item.classification?.toUpperCase() === "Z"
  ).length;

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((item) => {
      const searchValue =
        `${item.sku} ${item.item_name}`.toLowerCase();

      const matchesSearch =
        searchValue.includes(
          searchTerm.toLowerCase()
        );

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.classification?.toUpperCase() ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "OLDEST") {
        return a.id - b.id;
      }

      if (sortOrder === "SKU") {
        return a.sku.localeCompare(b.sku);
      }

      if (sortOrder === "NAME") {
        return a.item_name.localeCompare(
          b.item_name
        );
      }

      return b.id - a.id;
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
    sortOrder,
  ]);

  return (
    <div style={page}>
      {/* PAGE HEADER */}
      <div style={pageHeader}>
        <div style={titleSection}>
          <div style={titleIcon}>
            <span style={titleIconSymbol}>
              ≋
            </span>
          </div>

          <div>
            <h1 style={pageTitle}>
              XYZ Analysis
            </h1>

            <p style={pageSubtitle}>
              Analyze demand predictability and
              inventory variability
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          style={addButton}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform =
              "translateY(-1px)";
            event.currentTarget.style.boxShadow =
              "0 8px 18px rgba(37, 99, 235, 0.25)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform =
              "translateY(0)";
            event.currentTarget.style.boxShadow =
              "0 4px 10px rgba(37, 99, 235, 0.15)";
          }}
        >
          <span style={addIcon}>+</span>
          Add Analysis
        </button>
      </div>

      {/* KPI CARDS */}
      <div style={summaryGrid}>
        <div style={summaryCard}>
          <div
            style={{
              ...summaryIcon,
              background: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            <span>▦</span>
          </div>

          <div style={summaryContent}>
            <div style={summaryLabel}>
              Total Items
            </div>

            <div style={summaryValue}>
              {products.length}
            </div>

            <div style={summaryDescriptionSmall}>
              All analyzed items
            </div>
          </div>

          <div style={miniTrendBlue}>
            ↗
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
            <span>◉</span>
          </div>

          <div style={summaryContent}>
            <div style={summaryLabel}>
              Category X
            </div>

            <div style={summaryValue}>
              {categoryX}
            </div>

            <div style={summaryDescriptionSmall}>
              High predictability
            </div>
          </div>

          <div style={miniTrendGreen}>
            ↗
          </div>
        </div>

        <div style={summaryCard}>
          <div
            style={{
              ...summaryIcon,
              background: "#FFF7ED",
              color: "#EA580C",
            }}
          >
            <span>◐</span>
          </div>

          <div style={summaryContent}>
            <div style={summaryLabel}>
              Category Y
            </div>

            <div style={summaryValue}>
              {categoryY}
            </div>

            <div style={summaryDescriptionSmall}>
              Medium predictability
            </div>
          </div>

          <div style={miniTrendOrange}>
            ↗
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
            <span>◌</span>
          </div>

          <div style={summaryContent}>
            <div style={summaryLabel}>
              Category Z
            </div>

            <div style={summaryValue}>
              {categoryZ}
            </div>

            <div style={summaryDescriptionSmall}>
              Low predictability
            </div>
          </div>

          <div style={miniTrendPurple}>
            ↗
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={filterRow}>
        <div style={searchBox}>
          <span style={searchIcon}>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search items by SKU or name..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            style={searchInput}
          />
        </div>

        <div style={selectWrapper}>
          <span style={filterIcon}>
            ▽
          </span>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            style={filterSelect}
          >
            <option value="ALL">
              All Categories
            </option>

            <option value="X">
              Category X
            </option>

            <option value="Y">
              Category Y
            </option>

            <option value="Z">
              Category Z
            </option>
          </select>
        </div>

        <div style={selectWrapper}>
          <span style={sortIcon}>
            ↕
          </span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
            style={filterSelect}
          >
            <option value="NEWEST">
              Newest First
            </option>

            <option value="OLDEST">
              Oldest First
            </option>

            <option value="SKU">
              SKU
            </option>

            <option value="NAME">
              Item Name
            </option>
          </select>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div style={formCard}>
          <div style={formHeader}>
            <div>
              <h2 style={formTitle}>
                {editingId !== null
                  ? "Edit XYZ Analysis"
                  : "Add XYZ Analysis"}
              </h2>

              <p style={formSubtitle}>
                Enter demand information and
                classification details
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              style={closeFormButton}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              <div>
                <label style={label}>
                  SKU
                </label>

                <input
                  type="text"
                  value={formData.sku}
                  onChange={(event) =>
                    handleChange(
                      "sku",
                      event.target.value
                    )
                  }
                  required
                  style={input}
                  placeholder="e.g. SKU-001"
                />
              </div>

              <div>
                <label style={label}>
                  Item Name
                </label>

                <input
                  type="text"
                  value={formData.item_name}
                  onChange={(event) =>
                    handleChange(
                      "item_name",
                      event.target.value
                    )
                  }
                  required
                  style={input}
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label style={label}>
                  Average Demand
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.average_demand
                  }
                  onChange={(event) =>
                    handleChange(
                      "average_demand",
                      Number(
                        event.target.value
                      )
                    )
                  }
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>
                  Demand Variability
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.demand_variability
                  }
                  onChange={(event) =>
                    handleChange(
                      "demand_variability",
                      Number(
                        event.target.value
                      )
                    )
                  }
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>
                  Coefficient of Variation
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.coefficient_of_variation
                  }
                  onChange={(event) =>
                    handleChange(
                      "coefficient_of_variation",
                      Number(
                        event.target.value
                      )
                    )
                  }
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>
                  XYZ Classification
                </label>

                <select
                  value={
                    formData.classification
                  }
                  onChange={(event) =>
                    handleChange(
                      "classification",
                      event.target.value
                    )
                  }
                  required
                  style={input}
                >
                  <option value="X">
                    X — High Predictability
                  </option>

                  <option value="Y">
                    Y — Medium Predictability
                  </option>

                  <option value="Z">
                    Z — Low Predictability
                  </option>
                </select>
              </div>
            </div>

            <div style={formActions}>
              <button
                type="button"
                onClick={closeForm}
                style={cancelButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...saveButton,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Analysis"
                  : "Save Analysis"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE CARD */}
      <div style={tableCard}>
        <div style={tableTop}>
          <div style={tableTitleSection}>
            <div style={tableIcon}>
              ≋
            </div>

            <div>
              <h2 style={tableTitle}>
                XYZ Analysis List
              </h2>

              <p style={tableSubtitle}>
                Demand predictability classification
              </p>
            </div>
          </div>

          <div style={recordCount}>
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong>{products.length}</strong>{" "}
            items
          </div>
        </div>

        {loading ? (
          <div style={loadingContainer}>
            <div style={loadingSpinner} />

            <p style={loadingText}>
              Loading XYZ analysis...
            </p>
          </div>
        ) : (
          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={header}>
                    SKU
                  </th>

                  <th style={header}>
                    Product
                  </th>

                  <th style={header}>
                    Average Demand
                  </th>

                  <th style={header}>
                    Demand Variability
                  </th>

                  <th style={header}>
                    Coefficient of Variation
                  </th>

                  <th style={header}>
                    XYZ Category
                  </th>

                  <th
                    style={{
                      ...header,
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={
                        emptyStateCell
                      }
                    >
                      <div
                        style={
                          emptyStateIcon
                        }
                      >
                        ≋
                      </div>

                      <div
                        style={
                          emptyStateTitle
                        }
                      >
                        No XYZ analysis records
                        found
                      </div>

                      <div
                        style={
                          emptyStateDescription
                        }
                      >
                        Try changing your search
                        or filter, or add a new
                        analysis.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(
                    (item) => {
                      const category =
                        item.classification?.toUpperCase();

                      const categoryStyle =
                        getCategoryColor(
                          category
                        );

                      return (
                        <tr
                          key={item.id}
                          style={
                            tableRow
                          }
                          onMouseEnter={(
                            event
                          ) => {
                            event.currentTarget.style.background =
                              "#F8FAFC";
                          }}
                          onMouseLeave={(
                            event
                          ) => {
                            event.currentTarget.style.background =
                              "#FFFFFF";
                          }}
                        >
                          <td
                            style={
                              cell
                            }
                          >
                            <div
                              style={
                                skuCell
                              }
                            >
                              <div
                                style={
                                  skuAvatar
                                }
                              >
                                {item.sku
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "S"}
                              </div>

                              <div>
                                <div
                                  style={
                                    skuText
                                  }
                                >
                                  {
                                    item.sku
                                  }
                                </div>

                                <div
                                  style={
                                    skuSubtext
                                  }
                                >
                                  XYZ
                                  Analysis
                                </div>
                              </div>
                            </div>
                          </td>

                          <td
                            style={
                              cell
                            }
                          >
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
                              Demand
                              profile
                            </div>
                          </td>

                          <td
                            style={
                              cell
                            }
                          >
                            <span
                              style={
                                metricValue
                              }
                            >
                              {Number(
                                item.average_demand
                              ).toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </td>

                          <td
                            style={
                              cell
                            }
                          >
                            <span
                              style={
                                metricValue
                              }
                            >
                              {Number(
                                item.demand_variability
                              ).toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </td>

                          <td
                            style={
                              cell
                            }
                          >
                            <span
                              style={
                                cvValue
                              }
                            >
                              {Number(
                                item.coefficient_of_variation
                              ).toFixed(2)}
                            </span>
                          </td>

                          <td
                            style={
                              cell
                            }
                          >
                            <span
                              style={{
                                ...categoryBadge,
                                background:
                                  categoryStyle.background,
                                color:
                                  categoryStyle.color,
                                borderColor:
                                  categoryStyle.border,
                              }}
                            >
                              <span
                                style={{
                                  ...categoryDot,
                                  background:
                                    categoryStyle.color,
                                }}
                              />

                              Category{" "}
                              {category}
                            </span>
                          </td>

                          <td
                            style={{
                              ...cell,
                              textAlign:
                                "center",
                            }}
                          >
                            <div
                              style={
                                actionGroup
                              }
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  openEditForm(
                                    item
                                  )
                                }
                                style={
                                  editButton
                                }
                                title="Edit analysis"
                              >
                                ✎
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    item.id
                                  )
                                }
                                style={
                                  deleteButton
                                }
                                title="Delete analysis"
                              >
                                ♢
                              </button>

                              <button
                                type="button"
                                style={
                                  moreButton
                                }
                                title="More actions"
                              >
                                ⋮
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
  gap: "20px",
  marginBottom: "28px",
};

const titleSection: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const titleIcon: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #2563EB, #60A5FA)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:
    "0 8px 20px rgba(37, 99, 235, 0.20)",
};

const titleIconSymbol: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "32px",
  fontWeight: "700",
};

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "34px",
  lineHeight: "1.1",
  fontWeight: "750",
  color: "#0F172A",
  letterSpacing: "-0.8px",
};

const pageSubtitle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#64748B",
  fontSize: "15px",
};

const addButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "10px",
  padding: "13px 20px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 4px 10px rgba(37, 99, 235, 0.15)",
  transition:
    "all 0.2s ease",
};

const addIcon: React.CSSProperties = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17px",
  fontWeight: "700",
};

/* =========================================================
   SUMMARY CARDS
========================================================= */

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const summaryCard: React.CSSProperties = {
  position: "relative",
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "14px",
  minHeight: "142px",
  padding: "20px",
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  boxSizing: "border-box",
  boxShadow:
    "0 5px 16px rgba(15, 23, 42, 0.05)",
};

const summaryIcon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
};

const summaryContent: React.CSSProperties = {
  minWidth: 0,
};

const summaryLabel: React.CSSProperties = {
  color: "#2563EB",
  fontSize: "14px",
  fontWeight: "700",
  marginBottom: "6px",
};

const summaryValue: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "28px",
  fontWeight: "750",
  lineHeight: "1.1",
};

const summaryDescriptionSmall: React.CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
  marginTop: "8px",
};

const miniTrendBlue: React.CSSProperties = {
  position: "absolute",
  right: "18px",
  bottom: "20px",
  color: "#2563EB",
  fontSize: "28px",
};

const miniTrendGreen: React.CSSProperties = {
  position: "absolute",
  right: "18px",
  bottom: "20px",
  color: "#16A34A",
  fontSize: "28px",
};

const miniTrendOrange: React.CSSProperties = {
  position: "absolute",
  right: "18px",
  bottom: "20px",
  color: "#F59E0B",
  fontSize: "28px",
};

const miniTrendPurple: React.CSSProperties = {
  position: "absolute",
  right: "18px",
  bottom: "20px",
  color: "#7C3AED",
  fontSize: "28px",
};

/* =========================================================
   SEARCH / FILTERS
========================================================= */

const filterRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(300px, 1fr) 220px 220px",
  gap: "14px",
  marginBottom: "22px",
};

const searchBox: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "11px",
  minHeight: "52px",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  boxSizing: "border-box",
  boxShadow:
    "0 3px 10px rgba(15, 23, 42, 0.03)",
};

const searchIcon: React.CSSProperties = {
  color: "#64748B",
  fontSize: "26px",
  marginRight: "9px",
  lineHeight: 1,
};

const searchInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: "#0F172A",
};

const selectWrapper: React.CSSProperties = {
  position: "relative",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "11px",
  minHeight: "52px",
  display: "flex",
  alignItems: "center",
  boxShadow:
    "0 3px 10px rgba(15, 23, 42, 0.03)",
};

const filterIcon: React.CSSProperties = {
  position: "absolute",
  left: "15px",
  color: "#64748B",
  fontSize: "18px",
  pointerEvents: "none",
};

const sortIcon: React.CSSProperties = {
  position: "absolute",
  left: "15px",
  color: "#64748B",
  fontSize: "18px",
  pointerEvents: "none",
};

const filterSelect: React.CSSProperties = {
  width: "100%",
  height: "52px",
  border: "none",
  outline: "none",
  background: "transparent",
  padding:
    "0 35px 0 42px",
  fontSize: "14px",
  color: "#334155",
  cursor: "pointer",
};

/* =========================================================
   FORM
========================================================= */

const formCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "14px",
  padding: "24px",
  marginBottom: "22px",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.07)",
};

const formHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "22px",
};

const formTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: "700",
};

const formSubtitle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const closeFormButton: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  background: "#F8FAFC",
  color: "#64748B",
  fontSize: "22px",
  cursor: "pointer",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "18px",
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "650",
  color: "#334155",
  fontSize: "13px",
};

const input: React.CSSProperties = {
  width: "100%",
  height: "44px",
  boxSizing: "border-box",
  padding: "0 12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#0F172A",
  outline: "none",
  background: "#FFFFFF",
};

const formActions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "24px",
  paddingTop: "20px",
  borderTop: "1px solid #E2E8F0",
};

const cancelButton: React.CSSProperties = {
  background: "#FFFFFF",
  color: "#475569",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  padding: "10px 17px",
  fontWeight: "650",
  cursor: "pointer",
};

const saveButton: React.CSSProperties = {
  background:
    "linear-gradient(135deg, #16A34A, #15803D)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "10px 18px",
  fontWeight: "650",
  cursor: "pointer",
};

/* =========================================================
   TABLE
========================================================= */

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "14px",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const tableTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "21px 22px",
  borderBottom: "1px solid #E2E8F0",
};

const tableTitleSection: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const tableIcon: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  fontWeight: "700",
};

const tableTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#0F172A",
};

const tableSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const recordCount: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1050px",
};

const tableHeaderRow: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #F8FAFC, #F1F5F9)",
};

const header: React.CSSProperties = {
  padding: "15px 16px",
  textAlign: "left",
  fontWeight: "700",
  color: "#475569",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  borderBottom: "1px solid #E2E8F0",
};

const tableRow: React.CSSProperties = {
  background: "#FFFFFF",
  transition:
    "background 0.15s ease",
};

const cell: React.CSSProperties = {
  padding: "15px 16px",
  borderBottom: "1px solid #F1F5F9",
  color: "#334155",
  fontSize: "13px",
  verticalAlign: "middle",
};

const skuCell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const skuAvatar: React.CSSProperties = {
  width: "38px",
  height: "38px",
  minWidth: "38px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #DBEAFE, #EFF6FF)",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "15px",
  fontWeight: "750",
};

const skuText: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: "700",
  fontSize: "13px",
};

const skuSubtext: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "3px",
};

const productName: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: "650",
  fontSize: "13px",
};

const productSubtext: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "3px",
};

const metricValue: React.CSSProperties = {
  color: "#334155",
  fontWeight: "600",
};

const cvValue: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: "700",
};

const categoryBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  border: "1px solid",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const categoryDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
};

const actionGroup: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

const editButton: React.CSSProperties = {
  width: "38px",
  height: "38px",
  background: "#EFF6FF",
  color: "#2563EB",
  border: "1px solid #DBEAFE",
  borderRadius: "9px",
  fontSize: "19px",
  fontWeight: "700",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const deleteButton: React.CSSProperties = {
  width: "38px",
  height: "38px",
  background: "#FEF2F2",
  color: "#DC2626",
  border: "1px solid #FECACA",
  borderRadius: "9px",
  fontSize: "19px",
  fontWeight: "700",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const moreButton: React.CSSProperties = {
  width: "38px",
  height: "38px",
  background: "#FFFFFF",
  color: "#475569",
  border: "1px solid #E2E8F0",
  borderRadius: "9px",
  fontSize: "20px",
  fontWeight: "700",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

/* =========================================================
   LOADING
========================================================= */

const loadingContainer: React.CSSProperties = {
  minHeight: "260px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const loadingSpinner: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "3px solid #DBEAFE",
  borderTopColor: "#2563EB",
  marginBottom: "14px",
};

const loadingText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "14px",
};

/* =========================================================
   EMPTY STATE
========================================================= */

const emptyStateCell: React.CSSProperties = {
  padding: "60px 20px",
  textAlign: "center",
  borderBottom: "none",
};

const emptyStateIcon: React.CSSProperties = {
  width: "56px",
  height: "56px",
  margin: "0 auto 14px",
  borderRadius: "50%",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};

const emptyStateTitle: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "16px",
  fontWeight: "700",
};

const emptyStateDescription: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  marginTop: "6px",
};