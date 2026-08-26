import { FormEvent, useEffect, useMemo, useState } from "react";

type ParetoRecord = {
  id: number;
  problem: string;
  category: string;
  frequency: number;
  percentage: number;
  cumulative_percentage: number;
  status: string;
};

type ParetoFormData = {
  problem: string;
  category: string;
  frequency: string;
  status: string;
};

const API_URL =
  "http://127.0.0.1:8000/lean-six-sigma/pareto-analysis";

export default function ParetoAnalysis() {
  const [paretoData, setParetoData] = useState<ParetoRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ParetoFormData>({
    problem: "",
    category: "",
    frequency: "",
    status: "Active",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadParetoData();
  }, []);

  async function loadParetoData(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load Pareto data. Status: ${response.status}`
        );
      }

      const data: ParetoRecord[] = await response.json();

      setParetoData(data);
    } catch (err) {
      console.error("Pareto loading error:", err);

      setError(
        "Unable to load Pareto analysis data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const calculatedParetoData = useMemo(() => {
    const sorted = [...paretoData].sort(
      (a, b) => b.frequency - a.frequency
    );

    const totalFrequency = sorted.reduce(
      (total, item) => total + item.frequency,
      0
    );

    let cumulative = 0;

    return sorted.map((item) => {
      const percentage =
        totalFrequency > 0
          ? (item.frequency / totalFrequency) * 100
          : 0;

      cumulative += percentage;

      return {
        ...item,
        percentage,
        cumulative_percentage: cumulative,
      };
    });
  }, [paretoData]);

  // ==========================================================
  // KPI VALUES
  // ==========================================================

  const totalIssues = useMemo(() => {
    return calculatedParetoData.reduce(
      (total, item) => total + item.frequency,
      0
    );
  }, [calculatedParetoData]);

  const criticalIssues = useMemo(() => {
    return calculatedParetoData
      .filter((item) => item.percentage >= 15)
      .reduce(
        (total, item) => total + item.frequency,
        0
      );
  }, [calculatedParetoData]);

  const coverage80 = useMemo(() => {
    let total = 0;

    for (const item of calculatedParetoData) {
      total += item.percentage;

      if (total >= 80) {
        return total;
      }
    }

    return total;
  }, [calculatedParetoData]);

  const averageContribution = useMemo(() => {
    if (calculatedParetoData.length === 0) {
      return 0;
    }

    const totalContribution = calculatedParetoData.reduce(
      (total, item) => total + item.percentage,
      0
    );

    return totalContribution / calculatedParetoData.length;
  }, [calculatedParetoData]);

  // ==========================================================
  // FORM HELPERS
  // ==========================================================

  function resetForm(): void {
    setFormData({
      problem: "",
      category: "",
      frequency: "",
      status: "Active",
    });

    setEditingId(null);
  }

  function openCreateForm(): void {
    resetForm();
    setShowForm(true);
    setError("");
  }

  function openEditForm(item: ParetoRecord): void {
    setEditingId(item.id);

    setFormData({
      problem: item.problem,
      category: item.category,
      frequency: String(item.frequency),
      status: item.status,
    });

    setShowForm(true);
    setError("");
  }

  function closeForm(): void {
    setShowForm(false);
    resetForm();
  }

  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!formData.problem.trim()) {
      setError("Please enter the problem.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter the category.");
      return;
    }

    const frequency = Number(formData.frequency);

    if (!Number.isFinite(frequency) || frequency < 0) {
      setError(
        "Frequency must be a valid number greater than or equal to 0."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        problem: formData.problem.trim(),
        category: formData.category.trim(),
        frequency,
        percentage: 0,
        cumulative_percentage: 0,
        status: formData.status,
      };

      const url =
        editingId === null
          ? API_URL
          : `${API_URL}/${editingId}`;

      const method =
        editingId === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          responseText ||
            `Request failed with status ${response.status}`
        );
      }

      await loadParetoData();

      closeForm();
    } catch (err) {
      console.error("Pareto save error:", err);

      setError(
        "Unable to save the Pareto record. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function deletePareto(id: number): Promise<void> {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Pareto analysis record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Delete failed with status ${response.status}`
        );
      }

      await loadParetoData();
    } catch (err) {
      console.error("Pareto delete error:", err);

      setError(
        "Unable to delete the Pareto record."
      );
    }
  }

  // ==========================================================
  // FORMATTERS
  // ==========================================================

  function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "#16A34A";

      case "completed":
        return "#2563EB";

      case "pending":
        return "#D97706";

      case "resolved":
        return "#16A34A";

      default:
        return "#64748B";
    }
  }

  function getFrequencyBarWidth(
    frequency: number
  ): string {
    const maxFrequency =
      calculatedParetoData[0]?.frequency || 1;

    return `${Math.max(
      5,
      Math.min((frequency / maxFrequency) * 100, 100)
    )}%`;
  }

  function getContributionColor(
    percentage: number
  ): string {
    if (percentage >= 20) {
      return "#2563EB";
    }

    if (percentage >= 10) {
      return "#0EA5E9";
    }

    return "#94A3B8";
  }

  function getCumulativeColor(
    cumulative: number
  ): string {
    if (cumulative >= 80) {
      return "#F59E0B";
    }

    return "#16A34A";
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "#F8FAFC",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: "10px",
          }}
        >
          Pareto Analysis
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          Loading Pareto analysis...
        </p>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#F8FAFC",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Pareto Analysis
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Identify the vital few causes that contribute
            to the majority of process problems.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow:
              "0 6px 16px rgba(37, 99, 235, 0.22)",
          }}
        >
          + Create Analysis
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "14px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          FOUR KPI CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(210px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* TOTAL ISSUES */}

        <div
          style={{
            background: "#DBEAFE",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #BFDBFE",
            boxShadow:
              "0 6px 18px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              color: "#1D4ED8",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Total Issues
          </div>

          <div
            style={{
              color: "#1E3A8A",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {totalIssues}
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#3B82F6",
              fontSize: "11px",
            }}
          >
            Total problem frequency
          </div>
        </div>

        {/* CRITICAL ISSUES */}

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #BBF7D0",
            boxShadow:
              "0 6px 18px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              color: "#15803D",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Critical Issues
          </div>

          <div
            style={{
              color: "#166534",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {criticalIssues}
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#16A34A",
              fontSize: "11px",
            }}
          >
            High contribution issues
          </div>
        </div>

        {/* 80/20 COVERAGE */}

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #FDE68A",
            boxShadow:
              "0 6px 18px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              color: "#B45309",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            80/20 Coverage
          </div>

          <div
            style={{
              color: "#92400E",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {formatPercentage(coverage80)}
          </div>

          <div
            style={{
              marginTop: "8px",
              height: "6px",
              background: "#FDE68A",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(coverage80, 100)}%`,
                height: "100%",
                background: "#F59E0B",
                borderRadius: "999px",
              }}
            />
          </div>
        </div>

        {/* AVERAGE CONTRIBUTION */}

        <div
          style={{
            background: "#EDE9FE",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #DDD6FE",
            boxShadow:
              "0 6px 18px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              color: "#6D28D9",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Average Contribution
          </div>

          <div
            style={{
              color: "#5B21B6",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {formatPercentage(averageContribution)}
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#7C3AED",
              fontSize: "11px",
            }}
          >
            Average issue contribution
          </div>
        </div>
      </div>

      {/* =====================================================
          PARETO CHART
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "24px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.06)",
          marginBottom: "30px",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "22px",
              fontWeight: 800,
              marginBottom: "5px",
            }}
          >
            Pareto Chart
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Frequency bars ranked from highest to lowest,
            with cumulative contribution shown by the line.
          </p>
        </div>

        {calculatedParetoData.length === 0 ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748B",
              background: "#F8FAFC",
              borderRadius: "12px",
            }}
          >
            No Pareto data available. Create your first
            analysis above.
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                minWidth: "700px",
                height: "360px",
                position: "relative",
                padding:
                  "20px 50px 55px 55px",
                boxSizing: "border-box",
              }}
            >
              {/* 80% GUIDE */}

              <div
                style={{
                  position: "absolute",
                  left: "55px",
                  right: "50px",
                  top: "20%",
                  borderTop:
                    "2px dashed #F59E0B",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "-22px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#D97706",
                    background: "#FFFFFF",
                    padding: "2px 5px",
                  }}
                >
                  80%
                </span>
              </div>

              {/* CHART AREA */}

              <div
                style={{
                  position: "absolute",
                  left: "55px",
                  right: "50px",
                  top: "20px",
                  bottom: "55px",
                  borderLeft:
                    "1px solid #CBD5E1",
                  borderBottom:
                    "1px solid #CBD5E1",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent:
                    "space-around",
                  gap: "12px",
                }}
              >
                {calculatedParetoData.map(
                  (item) => {
                    const maxFrequency =
                      calculatedParetoData[0]
                        ?.frequency || 1;

                    const height =
                      (item.frequency /
                        maxFrequency) *
                      100;

                    return (
                      <div
                        key={item.id}
                        style={{
                          flex: 1,
                          height: "100%",
                          display: "flex",
                          flexDirection:
                            "column",
                          justifyContent:
                            "flex-end",
                          alignItems:
                            "center",
                          position:
                            "relative",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#475569",
                            marginBottom: "5px",
                          }}
                        >
                          {item.frequency}
                        </div>

                        <div
                          title={`${item.category}: ${item.frequency}`}
                          style={{
                            width: "70%",
                            maxWidth: "75px",
                            height: `${height}%`,
                            minHeight: "8px",
                            background:
                              "linear-gradient(180deg,#3B82F6,#2563EB)",
                            borderRadius:
                              "7px 7px 0 0",
                            transition:
                              "height 0.3s ease",
                          }}
                        />

                        <div
                          style={{
                            position:
                              "absolute",
                            bottom: "-42px",
                            width: "100%",
                            textAlign:
                              "center",
                            fontSize: "10px",
                            color: "#475569",
                            fontWeight: 600,
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                          title={item.category}
                        >
                          {item.category}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* CUMULATIVE LINE */}

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  left: "55px",
                  right: "50px",
                  top: "20px",
                  bottom: "55px",
                  width:
                    "calc(100% - 105px)",
                  height:
                    "calc(100% - 75px)",
                  overflow:
                    "visible",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              >
                {calculatedParetoData.length >
                  1 && (
                  <>
                    <polyline
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="1.8"
                      points={calculatedParetoData
                        .map(
                          (
                            item,
                            index
                          ) => {
                            const x =
                              ((index +
                                0.5) /
                                calculatedParetoData.length) *
                              100;

                            const y =
                              100 -
                              Math.min(
                                item.cumulative_percentage,
                                100
                              );

                            return `${x},${y}`;
                          }
                        )
                        .join(" ")}
                    />

                    {calculatedParetoData.map(
                      (
                        item,
                        index
                      ) => {
                        const x =
                          ((index +
                            0.5) /
                            calculatedParetoData.length) *
                          100;

                        const y =
                          100 -
                          Math.min(
                            item.cumulative_percentage,
                            100
                          );

                        return (
                          <circle
                            key={`point-${item.id}`}
                            cx={x}
                            cy={y}
                            r="1.8"
                            fill="#DC2626"
                            stroke="#FFFFFF"
                            strokeWidth="0.8"
                          />
                        );
                      }
                    )}
                  </>
                )}
              </svg>

              {/* LEFT AXIS */}

              <div
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "15px",
                  bottom: "50px",
                  display: "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "space-between",
                  fontSize: "10px",
                  color: "#64748B",
                }}
              >
                <span>
                  {calculatedParetoData[0]
                    ?.frequency || 0}
                </span>

                <span>
                  {Math.round(
                    (calculatedParetoData[0]
                      ?.frequency || 0) *
                      0.75
                  )}
                </span>

                <span>
                  {Math.round(
                    (calculatedParetoData[0]
                      ?.frequency || 0) *
                      0.5
                  )}
                </span>

                <span>
                  {Math.round(
                    (calculatedParetoData[0]
                      ?.frequency || 0) *
                      0.25
                  )}
                </span>

                <span>0</span>
              </div>

              {/* RIGHT AXIS */}

              <div
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "15px",
                  bottom: "50px",
                  display: "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "space-between",
                  fontSize: "10px",
                  color: "#DC2626",
                }}
              >
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE / EDIT FORM
      ====================================================== */}

      {showForm && (
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "16px",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.07)",
            marginBottom: "30px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                color: "#0F172A",
              }}
            >
              {editingId === null
                ? "Create Pareto Analysis"
                : "Edit Pareto Analysis"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              style={{
                border: "none",
                background: "#F1F5F9",
                color: "#475569",
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
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
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Problem
                </label>

                <input
                  type="text"
                  value={formData.problem}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      problem:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Delivery performance"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Category
                </label>

                <input
                  type="text"
                  value={formData.category}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      category:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Late Deliveries"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Frequency
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.frequency}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      frequency:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. 42"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      status:
                        event.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                    background:
                      "#FFFFFF",
                  }}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={closeForm}
                style={{
                  padding:
                    "11px 18px",
                  border:
                    "1px solid #CBD5E1",
                  background:
                    "#FFFFFF",
                  color: "#475569",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding:
                    "11px 20px",
                  border: "none",
                  background: saving
                    ? "#94A3B8"
                    : "#2563EB",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: 700,
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId === null
                  ? "Create Analysis"
                  : "Update Analysis"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          PHENOMENAL PARETO TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "24px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.06)",
          border: "1px solid #E2E8F0",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "22px",
              fontWeight: 800,
              marginBottom: "5px",
            }}
          >
            Pareto Issues
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Issues are automatically ranked from highest
            to lowest frequency, with visual contribution
            and cumulative indicators.
          </p>
        </div>

        {calculatedParetoData.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: "10px",
              color: "#64748B",
            }}
          >
            No Pareto records available.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: "1100px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#1E293B",
                  color: "#FFFFFF",
                }}
              >
                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    fontSize: "12px",
                  }}
                >
                  Issue
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    fontSize: "12px",
                  }}
                >
                  Category
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Frequency
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    fontSize: "12px",
                    minWidth: "200px",
                  }}
                >
                  Contribution
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    fontSize: "12px",
                    minWidth: "190px",
                  }}
                >
                  Cumulative
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {calculatedParetoData.map(
                (item, index) => {
                  const statusColor =
                    getStatusColor(item.status);

                  const contributionColor =
                    getContributionColor(
                      item.percentage
                    );

                  const cumulativeColor =
                    getCumulativeColor(
                      item.cumulative_percentage
                    );

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid #E2E8F0",
                        background:
                          index % 2 === 0
                            ? "#FFFFFF"
                            : "#F8FAFC",
                      }}
                    >
                      {/* ISSUE */}

                      <td
                        style={{
                          padding: "15px",
                          color: "#0F172A",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "9px",
                          }}
                        >
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius:
                                "50%",
                              background:
                                index === 0
                                  ? "#DC2626"
                                  : index === 1
                                  ? "#F59E0B"
                                  : "#2563EB",
                              flexShrink: 0,
                            }}
                          />

                          {item.problem}
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td
                        style={{
                          padding: "15px",
                          color: "#475569",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            display:
                              "inline-block",
                            background:
                              "#F1F5F9",
                            color: "#475569",
                            padding:
                              "5px 9px",
                            borderRadius:
                              "7px",
                            fontSize:
                              "11px",
                            fontWeight: 700,
                          }}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* FREQUENCY MINI CHART */}

                      <td
                        style={{
                          padding: "15px",
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            alignItems:
                              "center",
                            gap: "6px",
                          }}
                        >
                          <strong
                            style={{
                              color:
                                "#2563EB",
                              fontSize:
                                "14px",
                            }}
                          >
                            {item.frequency}
                          </strong>

                          <div
                            style={{
                              width:
                                "70px",
                              height:
                                "6px",
                              background:
                                "#DBEAFE",
                              borderRadius:
                                "999px",
                              overflow:
                                "hidden",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  getFrequencyBarWidth(
                                    item.frequency
                                  ),
                                height:
                                  "100%",
                                background:
                                  "linear-gradient(90deg,#60A5FA,#2563EB)",
                                borderRadius:
                                  "999px",
                                transition:
                                  "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* CONTRIBUTION GRAPH */}

                      <td
                        style={{
                          padding: "15px",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height:
                                "10px",
                              background:
                                "#E2E8F0",
                              borderRadius:
                                "999px",
                              overflow:
                                "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(
                                  item.percentage,
                                  100
                                )}%`,
                                height:
                                  "100%",
                                background:
                                  contributionColor,
                                borderRadius:
                                  "999px",
                                transition:
                                  "width 0.3s ease",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              minWidth:
                                "45px",
                              textAlign:
                                "right",
                              fontSize:
                                "12px",
                              fontWeight:
                                800,
                              color:
                                contributionColor,
                            }}
                          >
                            {formatPercentage(
                              item.percentage
                            )}
                          </span>
                        </div>
                      </td>

                      {/* CUMULATIVE MINI CHART */}

                      <td
                        style={{
                          padding: "15px",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize:
                                  "11px",
                                fontWeight:
                                  700,
                                color:
                                  "#64748B",
                              }}
                            >
                              Cumulative
                            </span>

                            <span
                              style={{
                                fontSize:
                                  "12px",
                                fontWeight:
                                  800,
                                color:
                                  cumulativeColor,
                              }}
                            >
                              {formatPercentage(
                                item.cumulative_percentage
                              )}
                            </span>
                          </div>

                          <div
                            style={{
                              position:
                                "relative",
                              height:
                                "10px",
                              background:
                                "#E2E8F0",
                              borderRadius:
                                "999px",
                              overflow:
                                "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(
                                  item.cumulative_percentage,
                                  100
                                )}%`,
                                height:
                                  "100%",
                                background:
                                  cumulativeColor,
                                borderRadius:
                                  "999px",
                              }}
                            />

                            {/* 80% MARKER */}

                            <div
                              style={{
                                position:
                                  "absolute",
                                left: "80%",
                                top: 0,
                                bottom: 0,
                                width:
                                  "2px",
                                background:
                                  "#F59E0B",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              fontSize:
                                "9px",
                              color:
                                "#94A3B8",
                            }}
                          >
                            <span>0%</span>
                            <span
                              style={{
                                color:
                                  "#D97706",
                                fontWeight:
                                  700,
                              }}
                            >
                              80%
                            </span>
                            <span>100%</span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          padding: "15px",
                          textAlign:
                            "center",
                        }}
                      >
                        <span
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "999px",
                            background:
                              `${statusColor}15`,
                            color:
                              statusColor,
                            fontSize:
                              "11px",
                            fontWeight:
                              800,
                            border:
                              `1px solid ${statusColor}30`,
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          padding: "15px",
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "center",
                            gap: "7px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                item
                              )
                            }
                            style={{
                              border:
                                "1px solid #BFDBFE",
                              background:
                                "#EFF6FF",
                              color:
                                "#2563EB",
                              padding:
                                "7px 11px",
                              borderRadius:
                                "7px",
                              cursor:
                                "pointer",
                              fontSize:
                                "11px",
                              fontWeight:
                                700,
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deletePareto(
                                item.id
                              )
                            }
                            style={{
                              border:
                                "1px solid #FECACA",
                              background:
                                "#FEF2F2",
                              color:
                                "#DC2626",
                              padding:
                                "7px 11px",
                              borderRadius:
                                "7px",
                              cursor:
                                "pointer",
                              fontSize:
                                "11px",
                              fontWeight:
                                700,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}