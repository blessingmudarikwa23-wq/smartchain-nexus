import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";

interface DistributionAnalytics {
  id: number;
  distribution_center: string;
  deliveries_completed: number;
  deliveries_failed: number;
  on_time_delivery_rate: number;
  average_delivery_time: number;
  customer_satisfaction: number;
  created_at: string;
  updated_at: string;
}

interface DistributionAnalyticsForm {
  distribution_center: string;
  deliveries_completed: number;
  deliveries_failed: number;
  on_time_delivery_rate: number;
  average_delivery_time: number;
  customer_satisfaction: number;
}

type SortOption =
  | "newest"
  | "oldest"
  | "center"
  | "completed"
  | "on_time";

const API_URL =
  "https://smartchain-nexus-3.onrender.com/logistics/distribution-analytics";

const emptyForm: DistributionAnalyticsForm = {
  distribution_center: "",
  deliveries_completed: 0,
  deliveries_failed: 0,
  on_time_delivery_rate: 0,
  average_delivery_time: 0,
  customer_satisfaction: 0,
};

export default function DistributionAnalytics(): ReactElement {
  const [records, setRecords] = useState<DistributionAnalytics[]>([]);
  const [form, setForm] =
    useState<DistributionAnalyticsForm>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] =
    useState<SortOption>("newest");

  const fetchDistributionAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to load distribution analytics records."
        );
      }

      const data: DistributionAnalytics[] =
        await response.json();

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load distribution analytics. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDistributionAnalytics();
  }, []);

  const metrics = useMemo(() => {
    const totalCompleted = records.reduce(
      (total, record) =>
        total + Number(record.deliveries_completed || 0),
      0
    );

    const totalFailed = records.reduce(
      (total, record) =>
        total + Number(record.deliveries_failed || 0),
      0
    );

    const totalDeliveries =
      totalCompleted + totalFailed;

    const averageOnTime =
      records.length > 0
        ? records.reduce(
            (total, record) =>
              total +
              Number(
                record.on_time_delivery_rate || 0
              ),
            0
          ) / records.length
        : 0;

    const averageDeliveryTime =
      records.length > 0
        ? records.reduce(
            (total, record) =>
              total +
              Number(
                record.average_delivery_time || 0
              ),
            0
          ) / records.length
        : 0;

    const averageSatisfaction =
      records.length > 0
        ? records.reduce(
            (total, record) =>
              total +
              Number(
                record.customer_satisfaction || 0
              ),
            0
          ) / records.length
        : 0;

    return {
      totalCompleted,
      totalFailed,
      totalDeliveries,
      averageOnTime,
      averageDeliveryTime,
      averageSatisfaction,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const filtered = records.filter((record) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        record.distribution_center
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );

        case "center":
          return a.distribution_center.localeCompare(
            b.distribution_center
          );

        case "completed":
          return (
            b.deliveries_completed -
            a.deliveries_completed
          );

        case "on_time":
          return (
            b.on_time_delivery_rate -
            a.on_time_delivery_rate
          );

        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });
  }, [records, searchTerm, sortOption]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "distribution_center"
          ? value
          : Number(value),
    }));
  };

  const openAddForm = (): void => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openEditForm = (
    record: DistributionAnalytics
  ): void => {
    setForm({
      distribution_center:
        record.distribution_center,
      deliveries_completed:
        record.deliveries_completed,
      deliveries_failed:
        record.deliveries_failed,
      on_time_delivery_rate:
        record.on_time_delivery_rate,
      average_delivery_time:
        record.average_delivery_time,
      customer_satisfaction:
        record.customer_satisfaction,
    });

    setEditingId(record.id);
    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = (): void => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const method =
        editingId === null ? "POST" : "PUT";

      const url =
        editingId === null
          ? API_URL
          : `${API_URL}/${editingId}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to save distribution analytics record."
        );
      }

      setSuccess(
        editingId === null
          ? "Distribution centre added successfully."
          : "Distribution centre updated successfully."
      );

      resetForm();

      await fetchDistributionAnalytics();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save distribution analytics record."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    recordId: number
  ): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this distribution analytics record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${recordId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete distribution analytics record."
        );
      }

      setSuccess(
        "Distribution analytics record deleted successfully."
      );

      await fetchDistributionAnalytics();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete distribution analytics record."
      );
    }
  };

  const getPerformance = (
    rate: number
  ): {
    label: string;
    background: string;
    color: string;
    dot: string;
  } => {
    if (rate >= 95) {
      return {
        label: "Excellent",
        background: "#ECFDF3",
        color: "#15803D",
        dot: "#16A34A",
      };
    }

    if (rate >= 85) {
      return {
        label: "Good",
        background: "#EFF6FF",
        color: "#1D4ED8",
        dot: "#2563EB",
      };
    }

    if (rate >= 70) {
      return {
        label: "Average",
        background: "#FFFBEB",
        color: "#B45309",
        dot: "#F59E0B",
      };
    }

    return {
      label: "Needs Attention",
      background: "#FEF2F2",
      color: "#B91C1C",
      dot: "#DC2626",
    };
  };

  const formatNumber = (value: number): string =>
    Number(value || 0).toLocaleString();

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <div>
            <div style={titleRowStyle}>
              <div style={titleIconStyle}>
                <span style={titleIconTextStyle}>◈</span>
              </div>

              <div>
                <h1 style={titleStyle}>
                  Distribution Analytics
                </h1>

                <p style={subtitleStyle}>
                  Monitor distribution centres, delivery
                  performance and customer satisfaction.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            style={primaryButtonStyle}
          >
            <span style={buttonIconStyle}>＋</span>
            Add Distribution Centre
          </button>
        </div>

        {/* ALERTS */}
        {error && (
          <div style={errorStyle}>
            <span style={alertIconStyle}>!</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={successStyle}>
            <span style={alertIconStyle}>✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div style={formCardStyle}>
            <div style={formHeaderStyle}>
              <div>
                <h2 style={formTitleStyle}>
                  {editingId === null
                    ? "Add Distribution Centre"
                    : "Edit Distribution Centre"}
                </h2>

                <p style={formSubtitleStyle}>
                  Enter the latest distribution
                  performance information.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                style={closeButtonStyle}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <FormField
                  label="Distribution Centre"
                  required
                >
                  <input
                    type="text"
                    name="distribution_center"
                    value={form.distribution_center}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Johannesburg DC"
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="Deliveries Completed" required>
                  <input
                    type="number"
                    name="deliveries_completed"
                    value={form.deliveries_completed}
                    onChange={handleInputChange}
                    min="0"
                    required
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="Deliveries Failed" required>
                  <input
                    type="number"
                    name="deliveries_failed"
                    value={form.deliveries_failed}
                    onChange={handleInputChange}
                    min="0"
                    required
                    style={inputStyle}
                  />
                </FormField>

                <FormField
                  label="On-Time Delivery Rate (%)"
                  required
                >
                  <input
                    type="number"
                    name="on_time_delivery_rate"
                    value={form.on_time_delivery_rate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    style={inputStyle}
                  />
                </FormField>

                <FormField
                  label="Average Delivery Time"
                  required
                >
                  <input
                    type="number"
                    name="average_delivery_time"
                    value={form.average_delivery_time}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    style={inputStyle}
                  />
                </FormField>

                <FormField
                  label="Customer Satisfaction"
                  required
                >
                  <input
                    type="number"
                    name="customer_satisfaction"
                    value={form.customer_satisfaction}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    style={inputStyle}
                  />
                </FormField>
              </div>

              <div style={formActionsStyle}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...saveButtonStyle,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingId === null
                      ? "Create Record"
                      : "Update Record"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KPI CARDS */}
        <div style={metricsGridStyle}>
          <MetricCard
            icon="▦"
            title="Total Deliveries"
            value={formatNumber(metrics.totalDeliveries)}
            description="Across all distribution centres"
            background="#EFF6FF"
            iconBackground="#DBEAFE"
            iconColor="#2563EB"
          />

          <MetricCard
            icon="✓"
            title="Completed"
            value={formatNumber(metrics.totalCompleted)}
            description="Successfully completed"
            background="#ECFDF3"
            iconBackground="#D1FAE5"
            iconColor="#16A34A"
          />

          <MetricCard
            icon="!"
            title="Failed"
            value={formatNumber(metrics.totalFailed)}
            description="Delivery exceptions"
            background="#FEF2F2"
            iconBackground="#FEE2E2"
            iconColor="#DC2626"
          />

          <MetricCard
            icon="%"
            title="Average On-Time Rate"
            value={`${metrics.averageOnTime.toFixed(1)}%`}
            description="Delivery performance"
            background="#FFFBEB"
            iconBackground="#FEF3C7"
            iconColor="#D97706"
          />

          <MetricCard
            icon="◷"
            title="Avg Delivery Time"
            value={metrics.averageDeliveryTime.toFixed(1)}
            description="Average delivery duration"
            background="#F5F3FF"
            iconBackground="#EDE9FE"
            iconColor="#7C3AED"
          />

          <MetricCard
            icon="★"
            title="Customer Satisfaction"
            value={metrics.averageSatisfaction.toFixed(1)}
            description="Customer experience score"
            background="#F0F9FF"
            iconBackground="#E0F2FE"
            iconColor="#0284C7"
          />
        </div>

        {/* SEARCH / FILTER BAR */}
        <div style={toolbarCardStyle}>
          <div style={searchWrapperStyle}>
            <span style={searchIconStyle}>⌕</span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search distribution centres..."
              style={searchInputStyle}
            />
          </div>

          <div style={toolbarActionsStyle}>
            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
              style={selectStyle}
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="center">
                Centre Name
              </option>

              <option value="completed">
                Most Completed
              </option>

              <option value="on_time">
                Best On-Time Rate
              </option>
            </select>

            <button
              type="button"
              onClick={() =>
                void fetchDistributionAnalytics()
              }
              disabled={loading}
              style={{
                ...refreshButtonStyle,
                opacity: loading ? 0.65 : 1,
              }}
            >
              ↻
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div style={tableCardStyle}>
          <div style={tableHeaderStyle}>
            <div>
              <div style={sectionTitleRowStyle}>
                <div style={sectionIconStyle}>
                  ▦
                </div>

                <h2 style={sectionTitleStyle}>
                  Distribution Records
                </h2>
              </div>

              <p style={sectionSubtitleStyle}>
                Showing {filteredRecords.length} of{" "}
                {records.length} distribution centres
              </p>
            </div>
          </div>

          {loading ? (
            <div style={emptyStateStyle}>
              <div style={loadingSpinnerStyle}>
                ◌
              </div>

              <h3 style={emptyTitleStyle}>
                Loading distribution analytics...
              </h3>

              <p style={emptySubtitleStyle}>
                Please wait while we retrieve the latest
                records.
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>▦</div>

              <h3 style={emptyTitleStyle}>
                No distribution records found
              </h3>

              <p style={emptySubtitleStyle}>
                {searchTerm
                  ? "Try adjusting your search."
                  : "Add your first distribution centre to begin tracking performance."}
              </p>

              {!searchTerm && (
                <button
                  type="button"
                  onClick={openAddForm}
                  style={primaryButtonStyle}
                >
                  ＋ Add Distribution Centre
                </button>
              )}
            </div>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>
                      Distribution Centre
                    </th>

                    <th style={headerCellStyle}>
                      Completed
                    </th>

                    <th style={headerCellStyle}>
                      Failed
                    </th>

                    <th style={headerCellStyle}>
                      On-Time Rate
                    </th>

                    <th style={headerCellStyle}>
                      Avg Delivery Time
                    </th>

                    <th style={headerCellStyle}>
                      Satisfaction
                    </th>

                    <th style={headerCellStyle}>
                      Performance
                    </th>

                    <th
                      style={{
                        ...headerCellStyle,
                        textAlign: "right",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => {
                    const performance =
                      getPerformance(
                        record.on_time_delivery_rate
                      );

                    return (
                      <tr
                        key={record.id}
                        style={tableRowStyle}
                      >
                        <td style={cellStyle}>
                          <div style={centreCellStyle}>
                            <div style={centreIconStyle}>
                              {record.distribution_center
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong
                                style={
                                  centreNameStyle
                                }
                              >
                                {
                                  record.distribution_center
                                }
                              </strong>

                              <span
                                style={
                                  centreIdStyle
                                }
                              >
                                DC-{String(record.id).padStart(
                                  4,
                                  "0"
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={completedValueStyle}
                          >
                            {formatNumber(
                              record.deliveries_completed
                            )}
                          </span>
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={failedValueStyle}
                          >
                            {formatNumber(
                              record.deliveries_failed
                            )}
                          </span>
                        </td>

                        <td style={cellStyle}>
                          <div
                            style={
                              performanceRateWrapperStyle
                            }
                          >
                            <strong
                              style={{
                                ...rateValueStyle,
                                color:
                                  record.on_time_delivery_rate >=
                                  95
                                    ? "#15803D"
                                    : record.on_time_delivery_rate >=
                                        85
                                      ? "#1D4ED8"
                                      : "#B45309",
                              }}
                            >
                              {Number(
                                record.on_time_delivery_rate
                              ).toFixed(1)}
                              %
                            </strong>

                            <div
                              style={
                                progressBackgroundStyle
                              }
                            >
                              <div
                                style={{
                                  ...progressBarStyle,
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      record.on_time_delivery_rate
                                    )
                                  )}%`,
                                  background:
                                    performance.dot,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td style={cellStyle}>
                          <strong
                            style={neutralValueStyle}
                          >
                            {Number(
                              record.average_delivery_time
                            ).toFixed(1)}
                          </strong>
                        </td>

                        <td style={cellStyle}>
                          <strong
                            style={neutralValueStyle}
                          >
                            {Number(
                              record.customer_satisfaction
                            ).toFixed(1)}
                          </strong>
                          <span
                            style={scoreLabelStyle}
                          >
                            / 100
                          </span>
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={{
                              ...statusBadgeStyle,
                              background:
                                performance.background,
                              color: performance.color,
                            }}
                          >
                            <span
                              style={{
                                ...statusDotStyle,
                                background:
                                  performance.dot,
                              }}
                            />
                            {performance.label}
                          </span>
                        </td>

                        <td
                          style={{
                            ...cellStyle,
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={actionGroupStyle}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(record)
                              }
                              style={
                                editActionStyle
                              }
                              title="Edit record"
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleDelete(
                                  record.id
                                )
                              }
                              style={
                                deleteActionStyle
                              }
                              title="Delete record"
                            >
                              ▫
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading &&
            filteredRecords.length > 0 && (
              <div style={tableFooterStyle}>
                <span>
                  Showing 1 to{" "}
                  {filteredRecords.length} of{" "}
                  {records.length} distribution centres
                </span>

                <span>
                  Updated{" "}
                  {records.length > 0
                    ? new Date(
                        records[0].updated_at
                      ).toLocaleString()
                    : "—"}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactElement;
}

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps): ReactElement {
  return (
    <div style={fieldWrapperStyle}>
      <label style={labelStyle}>
        {label}

        {required && (
          <span style={requiredStyle}> *</span>
        )}
      </label>

      {children}
    </div>
  );
}

interface MetricCardProps {
  icon: string;
  title: string;
  value: string;
  description: string;
  background: string;
  iconBackground: string;
  iconColor: string;
}

function MetricCard({
  icon,
  title,
  value,
  description,
  background,
  iconBackground,
  iconColor,
}: MetricCardProps): ReactElement {
  return (
    <div
      style={{
        ...metricCardStyle,
        background,
      }}
    >
      <div
        style={{
          ...metricIconStyle,
          background: iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div style={metricContentStyle}>
        <span style={metricTitleStyle}>
          {title}
        </span>

        <strong style={metricValueStyle}>
          {value}
        </strong>

        <span style={metricDescriptionStyle}>
          {description}
        </span>
      </div>
    </div>
  );
}

/* PAGE */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#F8FAFC",
  padding: "32px",
  boxSizing: "border-box",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "1500px",
  margin: "0 auto",
};

/* HEADER */

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",
  flexWrap: "wrap",
  marginBottom: "28px",
};

const titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const titleIconStyle: React.CSSProperties = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #DCE8FF 0%, #C7D7FE 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const titleIconTextStyle: React.CSSProperties = {
  fontSize: "28px",
  color: "#2563EB",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "36px",
  lineHeight: 1.1,
  fontWeight: 750,
  color: "#0F172A",
  letterSpacing: "-0.8px",
};

const subtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#64748B",
  fontSize: "15px",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  padding: "13px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 650,
  fontSize: "14px",
  boxShadow:
    "0 5px 12px rgba(37, 99, 235, 0.22)",
};

const buttonIconStyle: React.CSSProperties = {
  fontSize: "19px",
  lineHeight: 1,
};

/* ALERTS */

const errorStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#FEF2F2",
  color: "#991B1B",
  border: "1px solid #FECACA",
  padding: "13px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
  fontSize: "14px",
};

const successStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#ECFDF3",
  color: "#166534",
  border: "1px solid #BBF7D0",
  padding: "13px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
  fontSize: "14px",
};

const alertIconStyle: React.CSSProperties = {
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,.7)",
  fontWeight: 800,
};

/* FORM */

const formCardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "14px",
  padding: "25px",
  marginBottom: "26px",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.06)",
};

const formHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  marginBottom: "24px",
};

const formTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: 700,
};

const formSubtitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const closeButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#F1F5F9",
  color: "#475569",
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "22px",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const fieldWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: "13px",
  fontWeight: 650,
  marginBottom: "7px",
};

const requiredStyle: React.CSSProperties = {
  color: "#DC2626",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 13px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#0F172A",
  background: "#FFFFFF",
  outline: "none",
};

const formActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "24px",
  flexWrap: "wrap",
};

const saveButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  padding: "11px 20px",
  borderRadius: "8px",
  fontWeight: 650,
  fontSize: "14px",
};

const cancelButtonStyle: React.CSSProperties = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#334155",
  padding: "11px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 650,
  fontSize: "14px",
};

/* KPI */

const metricsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const metricCardStyle: React.CSSProperties = {
  minHeight: "145px",
  padding: "20px",
  borderRadius: "14px",
  border: "1px solid rgba(226,232,240,.9)",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  boxShadow:
    "0 5px 15px rgba(15,23,42,.035)",
};

const metricIconStyle: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
  fontWeight: 750,
  flexShrink: 0,
};

const metricContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const metricTitleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "7px",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "28px",
  lineHeight: 1.1,
  fontWeight: 750,
  color: "#0F172A",
};

const metricDescriptionStyle: React.CSSProperties = {
  marginTop: "9px",
  color: "#64748B",
  fontSize: "11px",
};

/* TOOLBAR */

const toolbarCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
  background: "#FFFFFF",
  padding: "13px",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  marginBottom: "20px",
  boxShadow:
    "0 4px 14px rgba(15,23,42,.035)",
};

const searchWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flex: "1 1 350px",
  minWidth: "250px",
  height: "44px",
  border: "1px solid #CBD5E1",
  borderRadius: "9px",
  background: "#FFFFFF",
};

const searchIconStyle: React.CSSProperties = {
  paddingLeft: "14px",
  color: "#64748B",
  fontSize: "22px",
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  padding: "0 12px",
  fontSize: "14px",
  color: "#0F172A",
  background: "transparent",
};

const toolbarActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const selectStyle: React.CSSProperties = {
  height: "44px",
  minWidth: "160px",
  border: "1px solid #CBD5E1",
  borderRadius: "9px",
  background: "#FFFFFF",
  color: "#334155",
  padding: "0 12px",
  fontSize: "13px",
  outline: "none",
};

const refreshButtonStyle: React.CSSProperties = {
  height: "44px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#334155",
  padding: "0 15px",
  borderRadius: "9px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};

/* TABLE */

const tableCardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "14px",
  border: "1px solid #E2E8F0",
  overflow: "hidden",
  boxShadow:
    "0 7px 20px rgba(15,23,42,.045)",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "20px 22px",
  borderBottom: "1px solid #E2E8F0",
};

const sectionTitleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const sectionIconStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17px",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "17px",
  fontWeight: 700,
  color: "#0F172A",
};

const sectionSubtitleStyle: React.CSSProperties = {
  margin: "6px 0 0 42px",
  fontSize: "12px",
  color: "#64748B",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1180px",
};

const headerCellStyle: React.CSSProperties = {
  padding: "15px 16px",
  textAlign: "left",
  background: "#F8FAFC",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 700,
  borderBottom: "1px solid #E2E8F0",
  whiteSpace: "nowrap",
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #F1F5F9",
};

const cellStyle: React.CSSProperties = {
  padding: "17px 16px",
  color: "#334155",
  fontSize: "13px",
  verticalAlign: "middle",
};

const centreCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const centreIconStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#E8F0FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 750,
  fontSize: "14px",
  flexShrink: 0,
};

const centreNameStyle: React.CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "13px",
  fontWeight: 700,
};

const centreIdStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: "4px",
  color: "#2563EB",
  background: "#EFF6FF",
  padding: "3px 7px",
  borderRadius: "5px",
  fontSize: "10px",
  fontWeight: 700,
};

const completedValueStyle: React.CSSProperties = {
  color: "#15803D",
  fontWeight: 700,
};

const failedValueStyle: React.CSSProperties = {
  color: "#DC2626",
  fontWeight: 700,
};

const neutralValueStyle: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: 700,
};

const scoreLabelStyle: React.CSSProperties = {
  color: "#94A3B8",
  marginLeft: "3px",
  fontSize: "11px",
};

const performanceRateWrapperStyle: React.CSSProperties = {
  minWidth: "125px",
};

const rateValueStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  marginBottom: "6px",
};

const progressBackgroundStyle: React.CSSProperties = {
  width: "100%",
  height: "5px",
  borderRadius: "10px",
  background: "#E2E8F0",
  overflow: "hidden",
};

const progressBarStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: "10px",
  transition: "width .3s ease",
};

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const statusDotStyle: React.CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
};

const actionGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "7px",
};

const editActionStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #BFDBFE",
  background: "#EFF6FF",
  color: "#2563EB",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 700,
};

const deleteActionStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #FECACA",
  background: "#FEF2F2",
  color: "#DC2626",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 700,
};

const tableFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
  padding: "16px 22px",
  color: "#64748B",
  fontSize: "12px",
  borderTop: "1px solid #E2E8F0",
};

/* EMPTY / LOADING */

const emptyStateStyle: React.CSSProperties = {
  padding: "65px 25px",
  textAlign: "center",
};

const emptyIconStyle: React.CSSProperties = {
  width: "58px",
  height: "58px",
  margin: "0 auto 15px",
  borderRadius: "14px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "26px",
};

const loadingSpinnerStyle: React.CSSProperties = {
  width: "58px",
  height: "58px",
  margin: "0 auto 15px",
  borderRadius: "50%",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
};

const emptyTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 700,
};

const emptySubtitleStyle: React.CSSProperties = {
  margin: "7px auto 20px",
  maxWidth: "500px",
  color: "#64748B",
  fontSize: "13px",
};