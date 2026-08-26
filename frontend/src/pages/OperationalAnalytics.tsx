import { useEffect, useMemo, useState } from "react";

const API_URL =
  "http://127.0.0.1:8000/business-intelligence/operational-analytics";

const EMPTY_FORM = {
  metric_name: "",
  metric_category: "",
  reporting_period: "",
  metric_value: "",
  target_value: "",
  variance: "",
  performance_percentage: "",
  status: "On Target",
};

export default function OperationalAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // ==========================================================
  // FETCH
  // ==========================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to load operational analytics. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setAnalytics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Operational Analytics Error:", err);

      setError(
        err.message ||
          "Unable to load operational analytics. Make sure the SmartChain Nexus backend is running."
      );

      setAnalytics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      metric_name: item.metric_name || "",
      metric_category: item.metric_category || "",
      reporting_period: item.reporting_period || "",
      metric_value: item.metric_value ?? "",
      target_value: item.target_value ?? "",
      variance: item.variance ?? "",
      performance_percentage: item.performance_percentage ?? "",
      status: item.status || "On Target",
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setError("");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.metric_name.trim() ||
      !formData.metric_category.trim() ||
      !formData.reporting_period.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        metric_name: formData.metric_name.trim(),
        metric_category: formData.metric_category.trim(),
        reporting_period: formData.reporting_period.trim(),
        metric_value: Number(formData.metric_value) || 0,
        target_value: Number(formData.target_value) || 0,
        variance: Number(formData.variance) || 0,
        performance_percentage:
          Number(formData.performance_percentage) || 0,
        status: formData.status,
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${
              editingId ? "update" : "create"
            } operational metric.`
        );
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ ...EMPTY_FORM });

      await fetchAnalytics();
    } catch (err) {
      console.error("Save Error:", err);

      setError(
        err.message ||
          "Unable to save the operational metric."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this operational metric?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete operational analytics."
        );
      }

      await fetchAnalytics();
    } catch (err) {
      console.error("Delete Error:", err);

      setError(
        err.message ||
          "Unable to delete the operational metric."
      );
    }
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const records = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return analytics;
    }

    return analytics.filter((item) => {
      return (
        String(item.metric_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.metric_category || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.reporting_period || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.status || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [analytics, search]);

  // ==========================================================
  // DASHBOARD CALCULATIONS
  // ==========================================================

  const totalMetrics = analytics.length;

  const averagePerformance =
    totalMetrics > 0
      ? Math.round(
          analytics.reduce(
            (total, item) =>
              total +
              Number(item.performance_percentage || 0),
            0
          ) / totalMetrics
        )
      : 0;

  const categories = new Set(
    analytics.map((item) => item.metric_category)
  ).size;

  const onTarget = analytics.filter((item) => {
    const status = String(item.status || "").toLowerCase();

    return (
      status.includes("target") ||
      status.includes("exceeded") ||
      status.includes("excellent")
    );
  }).length;

  // ==========================================================
  // STATUS
  // ==========================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("exceeded") ||
      value.includes("on target") ||
      value.includes("excellent")
    ) {
      return {
        background: "#DCFCE7",
        color: "#166534",
        border: "1px solid #BBF7D0",
      };
    }

    if (
      value.includes("below") ||
      value.includes("under") ||
      value.includes("poor")
    ) {
      return {
        background: "#FEE2E2",
        color: "#B91C1C",
        border: "1px solid #FECACA",
      };
    }

    if (value.includes("pending")) {
      return {
        background: "#FEF3C7",
        color: "#92400E",
        border: "1px solid #FDE68A",
      };
    }

    return {
      background: "#DBEAFE",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
    };
  };

  // ==========================================================
  // PERFORMANCE COLOR
  // ==========================================================

  const getPerformanceColor = (value) => {
    const performance = Number(value || 0);

    if (performance >= 100) return "#10B981";
    if (performance >= 90) return "#2563EB";
    if (performance >= 75) return "#F59E0B";

    return "#EF4444";
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "32px 34px 50px",
        boxSizing: "border-box",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0F172A",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 7px",
              color: "#2563EB",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            BUSINESS INTELLIGENCE
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#14213D",
            }}
          >
            Operational Analytics
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              maxWidth: "760px",
              color: "#64748B",
              fontSize: "14px",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Monitor operational efficiency, warehouse performance,
            supplier performance, logistics metrics and business
            process analytics across SmartChain Nexus.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            style={{
              border: "1px solid #D9E2F0",
              background: "#FFFFFF",
              color: "#334155",
              padding: "12px 17px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            onClick={handleCreate}
            style={{
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              padding: "12px 19px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow:
                "0 6px 15px rgba(37,99,235,.20)",
            }}
          >
            + New Metric
          </button>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "22px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "15px",
          marginBottom: "22px",
        }}
      >
        {/* TOTAL */}

        <SummaryCard
          icon="▦"
          iconBackground="#EEF4FF"
          iconColor="#2563EB"
          title="Operational KPIs"
          value={loading ? "—" : totalMetrics}
          description="Available operational metrics"
        />

        {/* PERFORMANCE */}

        <SummaryCard
          icon="↗"
          iconBackground="#ECFDF5"
          iconColor="#10B981"
          title="Performance Score"
          value={
            loading
              ? "—"
              : `${averagePerformance}%`
          }
          description="Average operational performance"
        />

        {/* CATEGORIES */}

        <SummaryCard
          icon="⚙"
          iconBackground="#FFF7E8"
          iconColor="#F59E0B"
          title="Categories"
          value={loading ? "—" : categories}
          description="Operational metric categories"
        />

        {/* TARGET */}

        <SummaryCard
          icon="✓"
          iconBackground="#ECFDF5"
          iconColor="#059669"
          title="On Target"
          value={loading ? "—" : onTarget}
          description="Metrics meeting target"
        />
      </div>

      {/* ======================================================
          FORM
      ====================================================== */}

      {showForm && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "22px",
            boxShadow:
              "0 5px 18px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#17233D",
                }}
              >
                {editingId
                  ? "Edit Operational Metric"
                  : "Create Operational Metric"}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Add or update operational performance data.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              style={{
                border: "none",
                background: "#F1F5F9",
                color: "#475569",
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              <FormField
                label="Metric Name"
                name="metric_name"
                value={formData.metric_name}
                onChange={handleChange}
                required
              />

              <FormField
                label="Metric Category"
                name="metric_category"
                value={formData.metric_category}
                onChange={handleChange}
                required
              />

              <FormField
                label="Reporting Period"
                name="reporting_period"
                value={formData.reporting_period}
                onChange={handleChange}
                required
              />

              <FormField
                label="Metric Value"
                name="metric_value"
                value={formData.metric_value}
                onChange={handleChange}
                type="number"
              />

              <FormField
                label="Target Value"
                name="target_value"
                value={formData.target_value}
                onChange={handleChange}
                type="number"
              />

              <FormField
                label="Variance"
                name="variance"
                value={formData.variance}
                onChange={handleChange}
                type="number"
              />

              <FormField
                label="Performance %"
                name="performance_percentage"
                value={formData.performance_percentage}
                onChange={handleChange}
                type="number"
              />

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: "43px",
                    padding: "0 12px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    background: "#FFFFFF",
                    color: "#334155",
                    outline: "none",
                    fontSize: "13px",
                  }}
                >
                  <option>On Target</option>
                  <option>Exceeded</option>
                  <option>Below Target</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "22px",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#475569",
                  padding: "11px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  border: "none",
                  background: saving
                    ? "#93C5FD"
                    : "#2563EB",
                  color: "#FFFFFF",
                  padding: "11px 20px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Metric"
                  : "Create Metric"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================
          PERFORMANCE OVERVIEW
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EEF7",
          borderRadius: "14px",
          padding: "22px",
          marginBottom: "22px",
          boxShadow:
            "0 4px 15px rgba(15,23,42,.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 800,
                color: "#17233D",
              }}
            >
              Operational Performance Overview
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#94A3B8",
                fontSize: "12px",
              }}
            >
              Live performance comparison against operational targets.
            </p>
          </div>

          <span
            style={{
              background: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid #DBEAFE",
              padding: "7px 11px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            Live Analytics
          </span>
        </div>

        {records.length === 0 ? (
          <div
            style={{
              padding: "35px",
              textAlign: "center",
              color: "#94A3B8",
              fontSize: "13px",
            }}
          >
            No performance data available.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {records.slice(0, 6).map((item) => {
              const performance = Number(
                item.performance_percentage || 0
              );

              const progress = Math.min(
                Math.max(performance, 0),
                100
              );

              const performanceColor =
                getPerformanceColor(performance);

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "11px",
                    padding: "17px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "#17233D",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.metric_name}
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "10px",
                          color: "#94A3B8",
                        }}
                      >
                        {item.metric_category}
                      </div>
                    </div>

                    <strong
                      style={{
                        color: performanceColor,
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {performance}%
                    </strong>
                  </div>

                  <div
                    style={{
                      height: "8px",
                      background: "#E2E8F0",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: performanceColor,
                        borderRadius: "20px",
                        transition:
                          "width .3s ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "9px",
                      fontSize: "10px",
                      color: "#64748B",
                    }}
                  >
                    <span>
                      Current: {item.metric_value}
                    </span>

                    <span>
                      Target: {item.target_value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================
          METRICS TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EEF7",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 4px 15px rgba(15,23,42,.04)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #E8EEF7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 800,
                color: "#17233D",
              }}
            >
              Operational Metrics
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#94A3B8",
                fontSize: "12px",
              }}
            >
              Operational analytics retrieved directly from the backend.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              width: "220px",
            }}
          >
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search metrics..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: "38px",
                border: "1px solid #E2E8F0",
                borderRadius: "9px",
                padding: "0 13px",
                outline: "none",
                fontSize: "12px",
                color: "#334155",
                background: "#FFFFFF",
              }}
            />
          </div>
        </div>

        {/* TABLE BODY */}

        {loading ? (
          <div
            style={{
              padding: "70px",
              textAlign: "center",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Loading operational analytics...
          </div>
        ) : records.length === 0 ? (
          <div
            style={{
              padding: "70px",
              textAlign: "center",
              color: "#94A3B8",
              fontSize: "13px",
            }}
          >
            {search
              ? "No metrics match your search."
              : "No operational analytics available."}
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "1050px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#17233D",
                    color: "#FFFFFF",
                  }}
                >
                  {[
                    "Metric",
                    "Category",
                    "Period",
                    "Current",
                    "Target",
                    "Variance",
                    "Performance",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "14px 12px",
                        fontSize: "11px",
                        fontWeight: 800,
                        textAlign:
                          heading === "Metric"
                            ? "left"
                            : "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {records.map((item) => {
                  const performance = Number(
                    item.performance_percentage || 0
                  );

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid #E8EEF7",
                      }}
                    >
                      {/* METRIC */}

                      <td
                        style={{
                          padding: "15px 12px",
                          fontWeight: 800,
                          color: "#17233D",
                          fontSize: "12px",
                        }}
                      >
                        {item.metric_name}
                      </td>

                      {/* CATEGORY */}

                      <td
                        style={{
                          textAlign: "center",
                          color: "#475569",
                          fontSize: "11px",
                        }}
                      >
                        {item.metric_category}
                      </td>

                      {/* PERIOD */}

                      <td
                        style={{
                          textAlign: "center",
                          color: "#64748B",
                          fontSize: "11px",
                        }}
                      >
                        {item.reporting_period}
                      </td>

                      {/* CURRENT */}

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#17233D",
                          fontSize: "11px",
                        }}
                      >
                        {item.metric_value}
                      </td>

                      {/* TARGET */}

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#17233D",
                          fontSize: "11px",
                        }}
                      >
                        {item.target_value}
                      </td>

                      {/* VARIANCE */}

                      <td
                        style={{
                          textAlign: "center",
                          color:
                            Number(item.variance || 0) >= 0
                              ? "#059669"
                              : "#DC2626",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        {item.variance}
                      </td>

                      {/* PERFORMANCE */}

                      <td
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <strong
                          style={{
                            color:
                              getPerformanceColor(
                                performance
                              ),
                            fontSize: "12px",
                          }}
                        >
                          {performance}%
                        </strong>
                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 10px",
                            borderRadius: "999px",
                            fontSize: "10px",
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            ...getStatusStyle(
                              item.status
                            ),
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "7px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(item)
                            }
                            style={{
                              border:
                                "1px solid #BFDBFE",
                              background:
                                "#EFF6FF",
                              color: "#2563EB",
                              padding:
                                "7px 11px",
                              borderRadius: "7px",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: 800,
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            style={{
                              border:
                                "1px solid #FECACA",
                              background:
                                "#FEF2F2",
                              color: "#DC2626",
                              padding:
                                "7px 11px",
                              borderRadius: "7px",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: 800,
                            }}
                          >
                            Delete
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
      </div>
    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  icon,
  iconBackground,
  iconColor,
  title,
  value,
  description,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8EEF7",
        borderRadius: "14px",
        padding: "20px",
        minHeight: "125px",
        boxShadow:
          "0 3px 14px rgba(15,23,42,.04)",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "11px",
          background: iconBackground,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: 800,
          marginBottom: "13px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "5px",
          fontSize: "27px",
          fontWeight: 800,
          color: "#17233D",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "4px",
          color: "#94A3B8",
          fontSize: "10px",
        }}
      >
        {description}
      </div>
    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "12px",
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: "#EF4444",
              marginLeft: "3px",
            }}
          >
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          boxSizing: "border-box",
          height: "43px",
          padding: "0 12px",
          border: "1px solid #CBD5E1",
          borderRadius: "8px",
          background: "#FFFFFF",
          color: "#334155",
          outline: "none",
          fontSize: "13px",
        }}
      />
    </div>
  );
}