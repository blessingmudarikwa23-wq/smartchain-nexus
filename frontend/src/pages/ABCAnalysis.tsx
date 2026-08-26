import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  abcAnalysisService,
  type ABCAnalysis as ABCAnalysisRecord,
  type ABCAnalysisCreate,
} from "../services/abcAnalysisService";

const INITIAL_FORM: ABCAnalysisCreate = {
  sku: "",
  item_name: "",
  annual_consumption: 0,
  annual_value: 0,
  percentage_of_total: 0,
  cumulative_percentage: 0,
  classification: "",
};

const CLASSIFICATIONS = ["A", "B", "C"];

export default function ABCAnalysis() {
  const [analyses, setAnalyses] = useState<
    ABCAnalysisRecord[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [classificationFilter, setClassificationFilter] =
    useState("All Categories");
  const [sortOrder, setSortOrder] =
    useState("Highest Value");

  const [formData, setFormData] =
    useState<ABCAnalysisCreate>({
      ...INITIAL_FORM,
    });

  useEffect(() => {
    void loadAnalyses();
  }, []);

  async function loadAnalyses() {
    try {
      setLoading(true);

      const data =
        await abcAnalysisService.getAnalyses();

      setAnalyses(data);
    } catch (error) {
      console.error(
        "Failed to load ABC analysis:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);

    setFormData({
      ...INITIAL_FORM,
    });

    setShowForm(true);
  }

  function openEditForm(
    analysis: ABCAnalysisRecord
  ) {
    setEditingId(analysis.id);

    setFormData({
      sku: analysis.sku,
      item_name: analysis.item_name,
      annual_consumption:
        analysis.annual_consumption,
      annual_value:
        analysis.annual_value,
      percentage_of_total:
        analysis.percentage_of_total,
      cumulative_percentage:
        analysis.cumulative_percentage,
      classification:
        analysis.classification,
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setFormData({
      ...INITIAL_FORM,
    });
  }

  function handleChange(
    field: keyof ABCAnalysisCreate,
    value: string | number
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      if (editingId !== null) {
        await abcAnalysisService.updateAnalysis(
          editingId,
          formData
        );
      } else {
        await abcAnalysisService.createAnalysis(
          formData
        );
      }

      await loadAnalyses();

      setShowForm(false);
      setEditingId(null);

      setFormData({
        ...INITIAL_FORM,
      });
    } catch (error) {
      console.error(
        "Failed to save ABC analysis:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ABC analysis?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await abcAnalysisService.deleteAnalysis(id);

      await loadAnalyses();
    } catch (error) {
      console.error(
        "Failed to delete ABC analysis:",
        error
      );
    }
  }

  const categoryA = analyses.filter(
    (item) =>
      item.classification
        .trim()
        .toUpperCase() === "A"
  ).length;

  const categoryB = analyses.filter(
    (item) =>
      item.classification
        .trim()
        .toUpperCase() === "B"
  ).length;

  const categoryC = analyses.filter(
    (item) =>
      item.classification
        .trim()
        .toUpperCase() === "C"
  ).length;

  const totalAnnualValue = analyses.reduce(
    (total, item) =>
      total + Number(item.annual_value || 0),
    0
  );

  const filteredAnalyses = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    const result = analyses.filter(
      (item) => {
        const matchesSearch =
          !search ||
          item.sku
            .toLowerCase()
            .includes(search) ||
          item.item_name
            .toLowerCase()
            .includes(search) ||
          item.classification
            .toLowerCase()
            .includes(search);

        const matchesClassification =
          classificationFilter ===
            "All Categories" ||
          item.classification
            .trim()
            .toUpperCase() ===
            classificationFilter;

        return (
          matchesSearch &&
          matchesClassification
        );
      }
    );

    return [...result].sort(
      (a, b) => {
        if (
          sortOrder ===
          "Lowest Value"
        ) {
          return (
            Number(a.annual_value || 0) -
            Number(b.annual_value || 0)
          );
        }

        if (
          sortOrder ===
          "A → C"
        ) {
          return (
            getClassificationRank(
              a.classification
            ) -
            getClassificationRank(
              b.classification
            )
          );
        }

        if (
          sortOrder ===
          "C → A"
        ) {
          return (
            getClassificationRank(
              b.classification
            ) -
            getClassificationRank(
              a.classification
            )
          );
        }

        return (
          Number(b.annual_value || 0) -
          Number(a.annual_value || 0)
        );
      }
    );
  }, [
    analyses,
    searchTerm,
    classificationFilter,
    sortOrder,
  ]);

  return (
    <div style={page}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={headerRow}>
        <div style={headerContent}>
          <div style={pageIcon}>
            <ChartIcon color="#2563EB" />
          </div>

          <div>
            <h1 style={pageTitle}>
              ABC Analysis
            </h1>

            <p style={pageSubtitle}>
              Analyze inventory value and classify
              items by importance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          style={addButton}
        >
          <span style={plusCircle}>
            +
          </span>

          Add Analysis
        </button>
      </div>

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div style={statsGrid}>
        <StatCard
          title="Category A"
          value={categoryA}
          subtitle="Highest Value Items"
          icon="A"
          iconBackground="#EFF6FF"
          iconColor="#2563EB"
          accent="#2563EB"
        />

        <StatCard
          title="Category B"
          value={categoryB}
          subtitle="Medium Value Items"
          icon="B"
          iconBackground="#ECFDF5"
          iconColor="#16A34A"
          accent="#16A34A"
        />

        <StatCard
          title="Category C"
          value={categoryC}
          subtitle="Low Value Items"
          icon="C"
          iconBackground="#FFF7ED"
          iconColor="#F59E0B"
          accent="#F59E0B"
        />

        <StatCard
          title="Annual Value"
          value={formatCurrency(
            totalAnnualValue
          )}
          subtitle="Total inventory value"
          icon="value"
          iconBackground="#F5F3FF"
          iconColor="#7C3AED"
          accent="#7C3AED"
        />
      </div>

      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div style={filterRow}>
        <div style={searchBox}>
          <SearchIcon />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search by SKU or item name..."
            aria-label="Search ABC analysis"
            style={searchInput}
          />
        </div>

        <div style={selectWrapper}>
          <FilterIcon />

          <select
            value={classificationFilter}
            onChange={(event) =>
              setClassificationFilter(
                event.target.value
              )
            }
            aria-label="Filter ABC category"
            style={selectInput}
          >
            <option value="All Categories">
              All Categories
            </option>

            {CLASSIFICATIONS.map(
              (classification) => (
                <option
                  key={classification}
                  value={classification}
                >
                  Category {classification}
                </option>
              )
            )}
          </select>
        </div>

        <div style={selectWrapper}>
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
            aria-label="Sort ABC analysis"
            style={selectInput}
          >
            <option value="Highest Value">
              Highest Value
            </option>

            <option value="Lowest Value">
              Lowest Value
            </option>

            <option value="A → C">
              Category A → C
            </option>

            <option value="C → A">
              Category C → A
            </option>
          </select>
        </div>
      </div>

      {/* ======================================================
          TABLE CARD
      ====================================================== */}

      <div style={tableCard}>
        <div style={tableHeader}>
          <div style={tableTitleWrapper}>
            <div style={tableTitleIcon}>
              <AnalysisIcon color="#2563EB" />
            </div>

            <div>
              <h2 style={tableTitle}>
                ABC Inventory Classification
              </h2>

              <span style={tableSubtitle}>
                Inventory items ranked by annual
                consumption value
              </span>
            </div>
          </div>

          <span style={resultCount}>
            {filteredAnalyses.length}{" "}
            item
            {filteredAnalyses.length !==
            1
              ? "s"
              : ""}
          </span>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div style={tableScroll}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={headerCell}>
                    SKU
                  </th>

                  <th style={headerCell}>
                    Product
                  </th>

                  <th style={headerCell}>
                    Annual Consumption
                  </th>

                  <th style={headerCell}>
                    Annual Value
                  </th>

                  <th style={headerCell}>
                    % of Total
                  </th>

                  <th style={headerCell}>
                    Cumulative %
                  </th>

                  <th style={headerCell}>
                    ABC Category
                  </th>

                  <th
                    style={{
                      ...headerCell,
                      textAlign:
                        "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAnalyses.length ===
                0 ? (
                  <EmptyState />
                ) : (
                  filteredAnalyses.map(
                    (item) => (
                      <tr
                        key={item.id}
                        style={tableRow}
                      >
                        {/* SKU */}

                        <td
                          style={bodyCell}
                        >
                          <span
                            style={skuBadge}
                          >
                            {item.sku}
                          </span>
                        </td>

                        {/* PRODUCT */}

                        <td
                          style={bodyCell}
                        >
                          <div
                            style={
                              productCell
                            }
                          >
                            <div
                              style={
                                productAvatar
                              }
                            >
                              {getInitials(
                                item.item_name
                              )}
                            </div>

                            <div>
                              <strong
                                style={
                                  productName
                                }
                              >
                                {
                                  item.item_name
                                }
                              </strong>

                              <span
                                style={
                                  productDescription
                                }
                              >
                                Inventory
                                Item
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ANNUAL CONSUMPTION */}

                        <td
                          style={bodyCell}
                        >
                          <strong
                            style={
                              consumptionValue
                            }
                          >
                            {formatNumber(
                              Number(
                                item.annual_consumption ||
                                  0
                              )
                            )}
                          </strong>

                          <span
                            style={
                              smallUnitText
                            }
                          >
                            units / year
                          </span>
                        </td>

                        {/* ANNUAL VALUE */}

                        <td
                          style={bodyCell}
                        >
                          <strong
                            style={
                              annualValue
                            }
                          >
                            {formatCurrency(
                              Number(
                                item.annual_value ||
                                  0
                              )
                            )}
                          </strong>
                        </td>

                        {/* PERCENTAGE */}

                        <td
                          style={bodyCell}
                        >
                          <div
                            style={
                              percentageCell
                            }
                          >
                            <strong>
                              {formatPercentage(
                                item.percentage_of_total
                              )}
                            </strong>

                            <div
                              style={
                                progressTrack
                              }
                            >
                              <div
                                style={{
                                  ...progressFill,
                                  width: `${Math.min(
                                    Math.max(
                                      Number(
                                        item.percentage_of_total ||
                                          0
                                      ),
                                      0
                                    ),
                                    100
                                  )}%`,
                                  background:
                                    getClassificationColor(
                                      item.classification
                                    ),
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* CUMULATIVE */}

                        <td
                          style={bodyCell}
                        >
                          <span
                            style={
                              cumulativeValue
                            }
                          >
                            {formatPercentage(
                              item.cumulative_percentage
                            )}
                          </span>
                        </td>

                        {/* CLASSIFICATION */}

                        <td
                          style={bodyCell}
                        >
                          <ClassificationBadge
                            classification={
                              item.classification
                            }
                          />
                        </td>

                        {/* ACTIONS */}

                        <td
                          style={{
                            ...bodyCell,
                            textAlign:
                              "center",
                          }}
                        >
                          <div
                            style={
                              actionButtons
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
                                iconButton
                              }
                              title="Edit ABC analysis"
                              aria-label="Edit ABC analysis"
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleDelete(
                                  item.id
                                )
                              }
                              style={{
                                ...iconButton,
                                ...deleteIconButton,
                              }}
                              title="Delete ABC analysis"
                              aria-label="Delete ABC analysis"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading &&
          filteredAnalyses.length > 0 && (
            <div
              style={tableFooter}
            >
              <span>
                Showing{" "}
                <strong>
                  {
                    filteredAnalyses.length
                  }
                </strong>{" "}
                of{" "}
                <strong>
                  {analyses.length}
                </strong>{" "}
                ABC analysis records
              </span>

              <span
                style={
                  footerHint
                }
              >
                A = Highest Value · B =
                Medium Value · C = Low Value
              </span>
            </div>
          )}
      </div>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showForm && (
        <div
          style={modalOverlay}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <div style={modal}>
            <div
              style={modalHeader}
            >
              <div>
                <div
                  style={
                    modalHeadingRow
                  }
                >
                  <div
                    style={
                      modalIcon
                    }
                  >
                    <AnalysisIcon
                      color="#2563EB"
                    />
                  </div>

                  <div>
                    <h2
                      style={
                        modalTitle
                      }
                    >
                      {editingId !== null
                        ? "Edit ABC Analysis"
                        : "Add ABC Analysis"}
                    </h2>

                    <p
                      style={
                        modalSubtitle
                      }
                    >
                      {editingId !== null
                        ? "Update the ABC classification details for this inventory item."
                        : "Add annual consumption and value information for an inventory item."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeForm}
                style={
                  modalClose
                }
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div
                style={modalBody}
              >
                <div
                  style={formGrid}
                >
                  <FormField
                    label="SKU"
                    required
                  >
                    <input
                      type="text"
                      value={
                        formData.sku
                      }
                      onChange={(event) =>
                        handleChange(
                          "sku",
                          event.target.value
                        )
                      }
                      required
                      disabled={saving}
                      placeholder="e.g. SKU-001"
                      style={
                        formInput
                      }
                    />
                  </FormField>

                  <FormField
                    label="Item Name"
                    required
                  >
                    <input
                      type="text"
                      value={
                        formData.item_name
                      }
                      onChange={(event) =>
                        handleChange(
                          "item_name",
                          event.target.value
                        )
                      }
                      required
                      disabled={saving}
                      placeholder="Enter item name"
                      style={
                        formInput
                      }
                    />
                  </FormField>

                  <FormField
                    label="Annual Consumption"
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        formData.annual_consumption
                      }
                      onChange={(event) =>
                        handleChange(
                          "annual_consumption",
                          Number(
                            event.target.value
                          )
                        )
                      }
                      required
                      disabled={saving}
                      placeholder="Enter annual units"
                      style={
                        formInput
                      }
                    />

                    <span
                      style={
                        formHelpText
                      }
                    >
                      Total units consumed
                      during the year.
                    </span>
                  </FormField>

                  <FormField
                    label="Annual Value"
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        formData.annual_value
                      }
                      onChange={(event) =>
                        handleChange(
                          "annual_value",
                          Number(
                            event.target.value
                          )
                        )
                      }
                      required
                      disabled={saving}
                      placeholder="Enter annual value"
                      style={
                        formInput
                      }
                    />

                    <span
                      style={
                        formHelpText
                      }
                    >
                      Annual consumption
                      value in South
                      African Rand.
                    </span>
                  </FormField>

                  <FormField
                    label="Percentage of Total"
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={
                        formData.percentage_of_total
                      }
                      onChange={(event) =>
                        handleChange(
                          "percentage_of_total",
                          Number(
                            event.target.value
                          )
                        )
                      }
                      required
                      disabled={saving}
                      placeholder="e.g. 25.50"
                      style={
                        formInput
                      }
                    />
                  </FormField>

                  <FormField
                    label="Cumulative Percentage"
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={
                        formData.cumulative_percentage
                      }
                      onChange={(event) =>
                        handleChange(
                          "cumulative_percentage",
                          Number(
                            event.target.value
                          )
                        )
                      }
                      required
                      disabled={saving}
                      placeholder="e.g. 75.25"
                      style={
                        formInput
                      }
                    />
                  </FormField>

                  <FormField
                    label="ABC Classification"
                    required
                  >
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
                      disabled={saving}
                      style={
                        formInput
                      }
                    >
                      <option value="">
                        Select Category
                      </option>

                      <option value="A">
                        Category A
                      </option>

                      <option value="B">
                        Category B
                      </option>

                      <option value="C">
                        Category C
                      </option>
                    </select>
                  </FormField>
                </div>

                <div
                  style={
                    informationBox
                  }
                >
                  <div
                    style={
                      informationIcon
                    }
                  >
                    <InfoIcon />
                  </div>

                  <div>
                    <strong
                      style={
                        informationTitle
                      }
                    >
                      ABC Classification
                    </strong>

                    <p
                      style={
                        informationText
                      }
                    >
                      Category A represents
                      the highest-value
                      inventory items,
                      Category B represents
                      medium-value items,
                      and Category C
                      represents lower-value
                      items.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={modalFooter}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  style={
                    cancelButton
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={
                    saveButton
                  }
                  disabled={saving}
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
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   STAT CARD
========================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBackground,
  iconColor,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
  accent: string;
}) {
  return (
    <div style={statCard}>
      <div
        style={{
          ...statIcon,
          background:
            iconBackground,
          color: iconColor,
        }}
      >
        {icon === "A" && (
          <span
            style={letterIcon}
          >
            A
          </span>
        )}

        {icon === "B" && (
          <span
            style={letterIcon}
          >
            B
          </span>
        )}

        {icon === "C" && (
          <span
            style={letterIcon}
          >
            C
          </span>
        )}

        {icon === "value" && (
          <ValueIcon
            color={iconColor}
          />
        )}
      </div>

      <div
        style={statContent}
      >
        <span
          style={{
            ...statTitle,
            color: accent,
          }}
        >
          {title}
        </span>

        <strong
          style={statValue}
        >
          {value}
        </strong>

        <span
          style={statSubtitle}
        >
          {subtitle}
        </span>
      </div>

      <div
        style={{
          ...miniChart,
          borderBottomColor:
            accent,
        }}
      >
        <span
          style={{
            ...chartLine,
            borderColor:
              accent,
          }}
        />
      </div>
    </div>
  );
}

/* ==========================================================
   FORM FIELD
========================================================== */

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        style={formLabel}
      >
        {label}

        {required && (
          <span
            style={
              requiredMark
            }
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* ==========================================================
   CLASSIFICATION BADGE
========================================================== */

function ClassificationBadge({
  classification,
}: {
  classification: string;
}) {
  const value =
    classification
      .trim()
      .toUpperCase();

  const colors =
    getClassificationStyles(
      value
    );

  return (
    <span
      style={{
        ...classificationBadge,
        background:
          colors.background,
        color:
          colors.color,
        borderColor:
          colors.border,
      }}
    >
      <span
        style={{
          ...classificationDot,
          background:
            colors.color,
        }}
      />

      Category {value || "—"}
    </span>
  );
}

/* ==========================================================
   LOADING STATE
========================================================== */

function LoadingState() {
  return (
    <div
      style={
        loadingContainer
      }
    >
      <div
        style={spinner}
      />

      <p
        style={loadingText}
      >
        Loading ABC analysis...
      </p>
    </div>
  );
}

/* ==========================================================
   EMPTY STATE
========================================================== */

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={8}
        style={
          emptyCell
        }
      >
        <div
          style={emptyState}
        >
          <div
            style={emptyIcon}
          >
            <AnalysisIcon
              color="#94A3B8"
            />
          </div>

          <strong
            style={
              emptyTitle
            }
          >
            No ABC analysis
            records found
          </strong>

          <span
            style={
              emptySubtitle
            }
          >
            Add an analysis or
            change your search
            filters.
          </span>
        </div>
      </td>
    </tr>
  );
}

/* ==========================================================
   HELPERS
========================================================== */

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-ZA",
    {
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value || 0)
  );
}

function formatCurrency(
  value: number
) {
  return `R ${new Intl.NumberFormat(
    "en-ZA",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  )}`;
}

function formatPercentage(
  value: number
) {
  return `${new Intl.NumberFormat(
    "en-ZA",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value || 0)
  )}%`;
}

function getClassificationRank(
  classification: string
) {
  const value =
    classification
      .trim()
      .toUpperCase();

  if (value === "A") {
    return 1;
  }

  if (value === "B") {
    return 2;
  }

  if (value === "C") {
    return 3;
  }

  return 4;
}

function getClassificationColor(
  classification: string
) {
  const value =
    classification
      .trim()
      .toUpperCase();

  if (value === "A") {
    return "#2563EB";
  }

  if (value === "B") {
    return "#16A34A";
  }

  if (value === "C") {
    return "#F59E0B";
  }

  return "#94A3B8";
}

function getClassificationStyles(
  classification: string
) {
  if (
    classification === "A"
  ) {
    return {
      background: "#EFF6FF",
      color: "#2563EB",
      border: "#BFDBFE",
    };
  }

  if (
    classification === "B"
  ) {
    return {
      background: "#ECFDF5",
      color: "#15803D",
      border: "#BBF7D0",
    };
  }

  if (
    classification === "C"
  ) {
    return {
      background: "#FFF7ED",
      color: "#D97706",
      border: "#FED7AA",
    };
  }

  return {
    background: "#F1F5F9",
    color: "#475569",
    border: "#E2E8F0",
  };
}

function getInitials(
  name: string
) {
  if (!name?.trim()) {
    return "?";
  }

  const parts =
    name
      .trim()
      .split(/\s+/);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

/* ==========================================================
   ICONS
========================================================== */

function ChartIcon({
  color = "#2563EB",
}: {
  color?: string;
}) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 2 5-6" />
    </svg>
  );
}

function AnalysisIcon({
  color = "#2563EB",
}: {
  color?: string;
}) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15v-3" />
      <path d="M11 15V8" />
      <path d="M15 15v-5" />
      <path d="M19 15V6" />
    </svg>
  );
}

function ValueIcon({
  color = "#7C3AED",
}: {
  color?: string;
}) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 6v12" />
      <path d="m5 9 3-3 3 3" />
      <path d="M16 18V6" />
      <path d="m13 15 3 3 3-3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/* ==========================================================
   PAGE STYLES
========================================================== */

const page: CSSProperties = {
  padding:
    "32px 36px 40px",
  background: "#F8FAFC",
  minHeight: "100%",
  boxSizing: "border-box",
};

const headerRow: CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: "24px",
  marginBottom: "28px",
};

const headerContent: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const pageIcon: CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background:
    "linear-gradient(145deg, #DBEAFE, #EEF6FF)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border:
    "1px solid #BFDBFE",
  boxShadow:
    "0 8px 20px rgba(37, 99, 235, 0.10)",
};

const pageTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "34px",
  lineHeight: 1.15,
  fontWeight: 750,
  letterSpacing:
    "-0.8px",
};

const pageSubtitle: CSSProperties = {
  margin: "7px 0 0",
  color: "#64748B",
  fontSize: "14px",
};

const addButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "10px",
  padding:
    "13px 19px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow:
    "0 8px 18px rgba(37, 99, 235, 0.22)",
};

const plusCircle: CSSProperties = {
  width: "21px",
  height: "21px",
  borderRadius: "50%",
  background: "#FFFFFF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17px",
  lineHeight: 1,
  fontWeight: 800,
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "26px",
};

const statCard: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  background: "#FFFFFF",
  border:
    "1px solid #E8EEF6",
  borderRadius: "14px",
  padding: "19px",
  minHeight: "118px",
  boxSizing: "border-box",
  boxShadow:
    "0 7px 20px rgba(15, 23, 42, 0.055)",
  overflow: "hidden",
};

const statIcon: CSSProperties = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const letterIcon: CSSProperties = {
  fontSize: "22px",
  fontWeight: 800,
};

const statContent: CSSProperties = {
  display: "flex",
  flexDirection:
    "column",
  minWidth: 0,
};

const statTitle: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "5px",
};

const statValue: CSSProperties = {
  color: "#0F172A",
  fontSize: "27px",
  lineHeight: 1.1,
  fontWeight: 750,
};

const statSubtitle: CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "8px",
};

const miniChart: CSSProperties = {
  position: "absolute",
  right: "17px",
  bottom: "27px",
  width: "62px",
  height: "28px",
  borderBottom:
    "1px solid",
  opacity: 0.9,
};

const chartLine: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: "5px",
  width: "58px",
  height: "18px",
  borderTop:
    "2px solid",
  borderRight:
    "2px solid",
  transform:
    "skewY(-20deg)",
};

const filterRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(280px, 1fr) 210px 210px",
  gap: "14px",
  marginBottom: "20px",
};

const searchBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  height: "52px",
  background: "#FFFFFF",
  border:
    "1px solid #E2E8F0",
  borderRadius: "11px",
  padding: "0 16px",
  boxSizing: "border-box",
  color: "#64748B",
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.025)",
};

const searchInput: CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  color: "#334155",
  background:
    "transparent",
};

const selectWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  height: "52px",
  background: "#FFFFFF",
  border:
    "1px solid #E2E8F0",
  borderRadius: "11px",
  padding: "0 13px",
  boxSizing: "border-box",
  color: "#64748B",
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.025)",
};

const selectInput: CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  background:
    "transparent",
  color: "#334155",
  fontSize: "14px",
  cursor: "pointer",
};

const tableCard: CSSProperties = {
  background: "#FFFFFF",
  border:
    "1px solid #E8EEF6",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 7px 20px rgba(15, 23, 42, 0.055)",
};

const tableHeader: CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  padding:
    "19px 21px",
  borderBottom:
    "1px solid #EEF2F7",
};

const tableTitleWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const tableTitleIcon: CSSProperties = {
  width: "35px",
  height: "35px",
  borderRadius: "9px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const tableTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 700,
};

const tableSubtitle: CSSProperties = {
  display: "block",
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
};

const resultCount: CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
};

const tableScroll: CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  borderCollapse:
    "collapse",
  minWidth:
    "1250px",
};

const headerCell: CSSProperties = {
  padding:
    "16px 16px",
  background: "#F8FAFC",
  color: "#475569",
  fontSize: "11px",
  fontWeight: 700,
  textAlign: "left",
  whiteSpace: "nowrap",
  textTransform:
    "uppercase",
  letterSpacing:
    "0.35px",
};

const tableRow: CSSProperties = {
  transition:
    "background 0.15s ease",
};

const bodyCell: CSSProperties = {
  padding:
    "17px 16px",
  color: "#334155",
  fontSize: "13px",
  borderBottom:
    "1px solid #EEF2F7",
  verticalAlign:
    "middle",
};

const skuBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding:
    "5px 9px",
  borderRadius: "7px",
  background: "#EFF6FF",
  color: "#2563EB",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace:
    "nowrap",
};

const productCell: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  minWidth: "220px",
};

const productAvatar: CSSProperties = {
  width: "39px",
  height: "39px",
  borderRadius: "50%",
  background:
    "linear-gradient(145deg, #DBEAFE, #EEF6FF)",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 800,
};

const productName: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "14px",
  marginBottom: "3px",
  whiteSpace:
    "nowrap",
};

const productDescription: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "10px",
};

const consumptionValue: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: 700,
};

const smallUnitText: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "10px",
  marginTop: "3px",
};

const annualValue: CSSProperties = {
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: 750,
  whiteSpace:
    "nowrap",
};

const percentageCell: CSSProperties = {
  minWidth: "105px",
};

const progressTrack: CSSProperties = {
  width: "82px",
  height: "5px",
  background: "#E2E8F0",
  borderRadius: "10px",
  marginTop: "7px",
  overflow: "hidden",
};

const progressFill: CSSProperties = {
  height: "100%",
  borderRadius: "10px",
  transition:
    "width 0.2s ease",
};

const cumulativeValue: CSSProperties = {
  color: "#475569",
  fontWeight: 650,
  whiteSpace:
    "nowrap",
};

const classificationBadge: CSSProperties = {
  display:
    "inline-flex",
  alignItems:
    "center",
  gap: "7px",
  border:
    "1px solid",
  borderRadius:
    "20px",
  padding:
    "6px 10px",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace:
    "nowrap",
};

const classificationDot: CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
};

const actionButtons: CSSProperties = {
  display: "flex",
  justifyContent:
    "center",
  alignItems: "center",
  gap: "7px",
};

const iconButton: CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "9px",
  border:
    "1px solid #DBEAFE",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  cursor: "pointer",
};

const deleteIconButton: CSSProperties = {
  background: "#FEF2F2",
  borderColor:
    "#FECACA",
};

const tableFooter: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
  gap: "20px",
  padding:
    "15px 20px",
  color: "#64748B",
  fontSize: "12px",
};

const footerHint: CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
};

const emptyCell: CSSProperties = {
  padding: 0,
};

const emptyState: CSSProperties = {
  minHeight: "250px",
  display: "flex",
  flexDirection:
    "column",
  alignItems: "center",
  justifyContent:
    "center",
  gap: "8px",
  color: "#64748B",
};

const emptyIcon: CSSProperties = {
  width: "54px",
  height: "54px",
  borderRadius: "50%",
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "5px",
};

const emptyTitle: CSSProperties = {
  color: "#334155",
  fontSize: "14px",
};

const emptySubtitle: CSSProperties = {
  color: "#94A3B8",
  fontSize: "12px",
};

const loadingContainer: CSSProperties = {
  minHeight: "280px",
  display: "flex",
  flexDirection:
    "column",
  alignItems: "center",
  justifyContent:
    "center",
  gap: "14px",
};

const spinner: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border:
    "3px solid #DBEAFE",
  borderTopColor:
    "#2563EB",
  animation:
    "spin 1s linear infinite",
};

const loadingText: CSSProperties = {
  color: "#64748B",
  fontSize: "14px",
  margin: 0,
};

/* ==========================================================
   MODAL
========================================================== */

const modalOverlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  padding: "24px",
  zIndex: 1000,
};

const modal: CSSProperties = {
  width:
    "min(760px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "16px",
  boxShadow:
    "0 25px 70px rgba(15, 23, 42, 0.25)",
};

const modalHeader: CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems:
    "flex-start",
  gap: "20px",
  padding: "24px",
  borderBottom:
    "1px solid #EEF2F7",
};

const modalHeadingRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const modalIcon: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "11px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: 750,
};

const modalSubtitle: CSSProperties = {
  margin: "5px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const modalClose: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  border:
    "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#64748B",
  fontSize: "23px",
  lineHeight: 1,
  cursor: "pointer",
};

const modalBody: CSSProperties = {
  padding: "24px",
};

const formGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "19px",
};

const formLabel: CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
};

const requiredMark: CSSProperties = {
  color: "#DC2626",
  marginLeft: "3px",
};

const formInput: CSSProperties = {
  width: "100%",
  height: "44px",
  boxSizing:
    "border-box",
  border:
    "1px solid #CBD5E1",
  borderRadius: "9px",
  padding: "0 12px",
  outline: "none",
  color: "#334155",
  fontSize: "14px",
  background:
    "#FFFFFF",
};

const formHelpText: CSSProperties = {
  display: "block",
  marginTop: "6px",
  color: "#94A3B8",
  fontSize: "11px",
  lineHeight: 1.4,
};

const informationBox: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginTop: "22px",
  padding: "14px",
  background: "#EFF6FF",
  border:
    "1px solid #DBEAFE",
  borderRadius: "10px",
};

const informationIcon: CSSProperties = {
  width: "36px",
  height: "36px",
  minWidth: "36px",
  borderRadius: "9px",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const informationTitle: CSSProperties = {
  display: "block",
  color: "#1E40AF",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "3px",
};

const informationText: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontSize: "12px",
  lineHeight: 1.5,
};

const modalFooter: CSSProperties = {
  display: "flex",
  justifyContent:
    "flex-end",
  gap: "10px",
  padding:
    "18px 24px",
  borderTop:
    "1px solid #EEF2F7",
};

const cancelButton: CSSProperties = {
  height: "42px",
  padding:
    "0 18px",
  borderRadius: "9px",
  border:
    "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#475569",
  fontWeight: 650,
  cursor: "pointer",
};

const saveButton: CSSProperties = {
  height: "42px",
  padding:
    "0 19px",
  borderRadius: "9px",
  border: "none",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  fontWeight: 700,
  cursor: "pointer",
};