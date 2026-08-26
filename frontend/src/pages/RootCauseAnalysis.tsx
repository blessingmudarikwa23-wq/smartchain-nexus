import { FormEvent, useMemo, useState } from "react";

type Priority = "High" | "Medium" | "Low";
type Status = "Open" | "In Progress" | "Resolved";

type RootCauseRecord = {
  id: number;
  problem: string;
  rootCause: string;
  action: string;
  priority: Priority;
  status: Status;
};

type RootCauseFormData = {
  problem: string;
  rootCause: string;
  action: string;
  priority: Priority;
  status: Status;
};

const initialCauses: RootCauseRecord[] = [
  {
    id: 1,
    problem: "Late Deliveries",
    rootCause: "Supplier Lead Time Variability",
    action: "Review Supplier Contracts",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    problem: "Inventory Shortages",
    rootCause: "Poor Demand Forecasting",
    action: "Improve Forecast Model",
    priority: "High",
    status: "Open",
  },
  {
    id: 3,
    problem: "Production Delays",
    rootCause: "Machine Downtime",
    action: "Preventive Maintenance",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 4,
    problem: "Picking Errors",
    rootCause: "Insufficient Staff Training",
    action: "Employee Training",
    priority: "Medium",
    status: "Resolved",
  },
];

export default function RootCauseAnalysis(): JSX.Element {
  const [causes, setCauses] =
    useState<RootCauseRecord[]>(initialCauses);

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [priorityFilter, setPriorityFilter] =
    useState<"All" | Priority>("All");

  const [statusFilter, setStatusFilter] =
    useState<"All" | Status>("All");

  const [formData, setFormData] =
    useState<RootCauseFormData>({
      problem: "",
      rootCause: "",
      action: "",
      priority: "Medium",
      status: "Open",
    });

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // FORM HELPERS
  // ==========================================================

  function resetForm(): void {
    setFormData({
      problem: "",
      rootCause: "",
      action: "",
      priority: "Medium",
      status: "Open",
    });

    setEditingId(null);
  }

  function openCreateForm(): void {
    resetForm();
    setError("");
    setShowForm(true);
  }

  function openEditForm(
    item: RootCauseRecord
  ): void {
    setEditingId(item.id);

    setFormData({
      problem: item.problem,
      rootCause: item.rootCause,
      action: item.action,
      priority: item.priority,
      status: item.status,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm(): void {
    setShowForm(false);
    resetForm();
    setError("");
  }

  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): void {
    event.preventDefault();

    if (!formData.problem.trim()) {
      setError("Please enter the problem.");
      return;
    }

    if (!formData.rootCause.trim()) {
      setError("Please enter the root cause.");
      return;
    }

    if (!formData.action.trim()) {
      setError("Please enter the corrective action.");
      return;
    }

    if (editingId === null) {
      const newRecord: RootCauseRecord = {
        id:
          causes.length > 0
            ? Math.max(...causes.map((item) => item.id)) + 1
            : 1,
        problem: formData.problem.trim(),
        rootCause: formData.rootCause.trim(),
        action: formData.action.trim(),
        priority: formData.priority,
        status: formData.status,
      };

      setCauses((previous) => [
        ...previous,
        newRecord,
      ]);
    } else {
      setCauses((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                problem: formData.problem.trim(),
                rootCause: formData.rootCause.trim(),
                action: formData.action.trim(),
                priority: formData.priority,
                status: formData.status,
              }
            : item
        )
      );
    }

    closeForm();
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  function deleteCause(id: number): void {
    const confirmed = window.confirm(
      "Are you sure you want to delete this root cause analysis?"
    );

    if (!confirmed) {
      return;
    }

    setCauses((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  // ==========================================================
  // FILTERING
  // ==========================================================

  const filteredCauses = useMemo(() => {
    return causes.filter((item) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === "" ||
        item.problem.toLowerCase().includes(search) ||
        item.rootCause.toLowerCase().includes(search) ||
        item.action.toLowerCase().includes(search);

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    causes,
    searchTerm,
    priorityFilter,
    statusFilter,
  ]);

  // ==========================================================
  // KPI VALUES
  // ==========================================================

  const totalProblems = causes.length;

  const resolvedProblems = causes.filter(
    (item) => item.status === "Resolved"
  ).length;

  const criticalProblems = causes.filter(
    (item) => item.priority === "High"
  ).length;

  const inProgressProblems = causes.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolutionRate =
    totalProblems > 0
      ? (resolvedProblems / totalProblems) * 100
      : 0;

  // ==========================================================
  // PRIORITY COUNTS
  // ==========================================================

  const highPriorityCount = causes.filter(
    (item) => item.priority === "High"
  ).length;

  const mediumPriorityCount = causes.filter(
    (item) => item.priority === "Medium"
  ).length;

  const lowPriorityCount = causes.filter(
    (item) => item.priority === "Low"
  ).length;

  const maxPriorityCount = Math.max(
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    1
  );

  // ==========================================================
  // COLORS
  // ==========================================================

  function getPriorityColor(
    priority: Priority
  ): string {
    switch (priority) {
      case "High":
        return "#DC2626";

      case "Medium":
        return "#D97706";

      case "Low":
        return "#16A34A";

      default:
        return "#64748B";
    }
  }

  function getPriorityBackground(
    priority: Priority
  ): string {
    switch (priority) {
      case "High":
        return "#FEF2F2";

      case "Medium":
        return "#FFFBEB";

      case "Low":
        return "#F0FDF4";

      default:
        return "#F8FAFC";
    }
  }

  function getStatusColor(
    status: Status
  ): string {
    switch (status) {
      case "Resolved":
        return "#16A34A";

      case "In Progress":
        return "#2563EB";

      case "Open":
        return "#D97706";

      default:
        return "#64748B";
    }
  }

  function getStatusBackground(
    status: Status
  ): string {
    switch (status) {
      case "Resolved":
        return "#DCFCE7";

      case "In Progress":
        return "#DBEAFE";

      case "Open":
        return "#FEF3C7";

      default:
        return "#F1F5F9";
    }
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
      {/* =====================================================
          HEADER
      ====================================================== */}

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
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Root Cause Analysis
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Identify root causes, assign corrective actions,
            prioritize problems, and track resolution.
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
              "0 6px 16px rgba(37,99,235,0.22)",
          }}
        >
          + Create Analysis
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
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
        <div
          style={{
            background: "#DBEAFE",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #BFDBFE",
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
            Problems Identified
          </div>

          <div
            style={{
              color: "#1E3A8A",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {totalProblems}
          </div>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #BBF7D0",
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
            Resolved
          </div>

          <div
            style={{
              color: "#166534",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {resolvedProblems}
          </div>
        </div>

        <div
          style={{
            background: "#FEE2E2",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #FECACA",
          }}
        >
          <div
            style={{
              color: "#B91C1C",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Critical
          </div>

          <div
            style={{
              color: "#991B1B",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {criticalProblems}
          </div>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #FDE68A",
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
            Resolution Rate
          </div>

          <div
            style={{
              color: "#92400E",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {resolutionRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* =====================================================
          VISUAL ANALYTICS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* PRIORITY CHART */}

        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "5px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Priority Distribution
          </h2>

          <p
            style={{
              margin: 0,
              marginBottom: "22px",
              fontSize: "13px",
              color: "#64748B",
            }}
          >
            Root causes by priority level.
          </p>

          {[
            {
              label: "High",
              count: highPriorityCount,
              color: "#DC2626",
            },
            {
              label: "Medium",
              count: mediumPriorityCount,
              color: "#D97706",
            },
            {
              label: "Low",
              count: lowPriorityCount,
              color: "#16A34A",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "7px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#475569",
                }}
              >
                <span>{item.label}</span>
                <span>{item.count}</span>
              </div>

              <div
                style={{
                  height: "9px",
                  background: "#E2E8F0",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${
                      (item.count /
                        maxPriorityCount) *
                      100
                    }%`,
                    height: "100%",
                    background: item.color,
                    borderRadius: "999px",
                    transition:
                      "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* STATUS SUMMARY */}

        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "5px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Analysis Status
          </h2>

          <p
            style={{
              margin: 0,
              marginBottom: "20px",
              fontSize: "13px",
              color: "#64748B",
            }}
          >
            Current progress of corrective actions.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: `conic-gradient(
                  #16A34A ${resolutionRate}%,
                  #E2E8F0 ${resolutionRate}% 100%
                )`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "78px",
                  height: "78px",
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "#166534",
                  fontSize: "15px",
                }}
              >
                {resolutionRate.toFixed(0)}%
              </div>
            </div>

            <div>
              <div
                style={{
                  marginBottom: "10px",
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                <strong
                  style={{ color: "#16A34A" }}
                >
                  {resolvedProblems}
                </strong>{" "}
                Resolved
              </div>

              <div
                style={{
                  marginBottom: "10px",
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                <strong
                  style={{ color: "#2563EB" }}
                >
                  {inProgressProblems}
                </strong>{" "}
                In Progress
              </div>

              <div
                style={{
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                <strong
                  style={{ color: "#D97706" }}
                >
                  {
                    causes.filter(
                      (item) =>
                        item.status === "Open"
                    ).length
                  }
                </strong>{" "}
                Open
              </div>
            </div>
          </div>
        </div>
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
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.06)",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              {editingId === null
                ? "Create Root Cause Analysis"
                : "Edit Root Cause Analysis"}
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

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                color: "#B91C1C",
                border:
                  "1px solid #FECACA",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

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
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
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
                  placeholder="e.g. Late Deliveries"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Root Cause
                </label>

                <input
                  type="text"
                  value={formData.rootCause}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      rootCause:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Supplier Delays"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Corrective Action
                </label>

                <input
                  type="text"
                  value={formData.action}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      action:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Review Supplier Contracts"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Priority
                </label>

                <select
                  value={formData.priority}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      priority:
                        event.target
                          .value as Priority,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    background: "#FFFFFF",
                    boxSizing: "border-box",
                    fontSize: "14px",
                  }}
                >
                  <option value="High">
                    High
                  </option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
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
                        event.target
                          .value as Status,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    background: "#FFFFFF",
                    boxSizing: "border-box",
                    fontSize: "14px",
                  }}
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
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
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={closeForm}
                style={{
                  padding: "11px 18px",
                  border:
                    "1px solid #CBD5E1",
                  background: "#FFFFFF",
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
                style={{
                  padding: "11px 20px",
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {editingId === null
                  ? "Create Analysis"
                  : "Update Analysis"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "18px",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search problems, causes or actions..."
          style={{
            flex: 1,
            minWidth: "240px",
            padding: "11px 12px",
            border:
              "1px solid #CBD5E1",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(
              event.target.value as
                | "All"
                | Priority
            )
          }
          style={{
            padding: "11px 12px",
            border:
              "1px solid #CBD5E1",
            borderRadius: "8px",
            background: "#FFFFFF",
          }}
        >
          <option value="All">
            All Priorities
          </option>
          <option value="High">
            High
          </option>
          <option value="Medium">
            Medium
          </option>
          <option value="Low">
            Low
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "All"
                | Status
            )
          }
          style={{
            padding: "11px 12px",
            border:
              "1px solid #CBD5E1",
            borderRadius: "8px",
            background: "#FFFFFF",
          }}
        >
          <option value="All">
            All Statuses
          </option>
          <option value="Open">
            Open
          </option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Resolved">
            Resolved
          </option>
        </select>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.06)",
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
              marginBottom: "5px",
              fontSize: "22px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Root Cause Register
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#64748B",
            }}
          >
            Track identified problems, root causes,
            corrective actions and priorities.
          </p>
        </div>

        {filteredCauses.length === 0 ? (
          <div
            style={{
              padding: "45px",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: "10px",
              color: "#64748B",
            }}
          >
            No root cause records match your filters.
          </div>
        ) : (
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
                  Problem
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    fontSize: "12px",
                  }}
                >
                  Root Cause
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    fontSize: "12px",
                  }}
                >
                  Corrective Action
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Priority
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
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCauses.map(
                (item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      background:
                        index % 2 === 0
                          ? "#FFFFFF"
                          : "#F8FAFC",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    <td
                      style={{
                        padding: "15px",
                        fontWeight: 700,
                        color: "#0F172A",
                        fontSize: "13px",
                      }}
                    >
                      {item.problem}
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        color: "#475569",
                        fontSize: "13px",
                      }}
                    >
                      {item.rootCause}
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        color: "#475569",
                        fontSize: "13px",
                      }}
                    >
                      {item.action}
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          display:
                            "inline-block",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background:
                            getPriorityBackground(
                              item.priority
                            ),
                          color:
                            getPriorityColor(
                              item.priority
                            ),
                          fontSize: "11px",
                          fontWeight: 800,
                        }}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          display:
                            "inline-block",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background:
                            getStatusBackground(
                              item.status
                            ),
                          color:
                            getStatusColor(
                              item.status
                            ),
                          fontSize: "11px",
                          fontWeight: 800,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "center",
                          gap: "7px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(item)
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
                            cursor:
                              "pointer",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCause(item.id)
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
                            cursor:
                              "pointer",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}