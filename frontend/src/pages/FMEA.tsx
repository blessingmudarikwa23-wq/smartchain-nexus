import { FormEvent, useEffect, useMemo, useState } from "react";

type FMEARecord = {
  id: number;
  process: string;
  failure_mode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  status: string;
};

type FMEAFormData = {
  process: string;
  failure_mode: string;
  effect: string;
  cause: string;
  severity: string;
  occurrence: string;
  detection: string;
  status: string;
};

const API_URL =
  "http://127.0.0.1:8000/lean-six-sigma/fmea";

export default function FMEA() {
  const [fmeaData, setFmeaData] = useState<FMEARecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<FMEAFormData>({
    process: "",
    failure_mode: "",
    effect: "",
    cause: "",
    severity: "",
    occurrence: "",
    detection: "",
    status: "Active",
  });

  // ==========================================================
  // LOAD FMEA DATA
  // ==========================================================

  useEffect(() => {
    loadFMEAData();
  }, []);

  async function loadFMEAData(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load FMEA data. Status: ${response.status}`
        );
      }

      const data: FMEARecord[] = await response.json();

      setFmeaData(data);
    } catch (err) {
      console.error("FMEA loading error:", err);

      setError(
        "Unable to load FMEA data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // CALCULATE RPN
  // ==========================================================

  const calculatedFMEAData = useMemo(() => {
    return [...fmeaData]
      .map((item) => ({
        ...item,
        rpn:
          Number(item.severity) *
          Number(item.occurrence) *
          Number(item.detection),
      }))
      .sort((a, b) => b.rpn - a.rpn);
  }, [fmeaData]);

  // ==========================================================
  // KPI VALUES
  // ==========================================================

  const totalRisks = calculatedFMEAData.length;

  const criticalRisks = useMemo(() => {
    return calculatedFMEAData.filter(
      (item) => item.rpn >= 150
    ).length;
  }, [calculatedFMEAData]);

  const highestRPN = useMemo(() => {
    return calculatedFMEAData.length > 0
      ? Math.max(
          ...calculatedFMEAData.map((item) => item.rpn)
        )
      : 0;
  }, [calculatedFMEAData]);

  const averageRPN = useMemo(() => {
    if (calculatedFMEAData.length === 0) {
      return 0;
    }

    const total = calculatedFMEAData.reduce(
      (sum, item) => sum + item.rpn,
      0
    );

    return total / calculatedFMEAData.length;
  }, [calculatedFMEAData]);

  // ==========================================================
  // FORM HELPERS
  // ==========================================================

  function resetForm(): void {
    setFormData({
      process: "",
      failure_mode: "",
      effect: "",
      cause: "",
      severity: "",
      occurrence: "",
      detection: "",
      status: "Active",
    });

    setEditingId(null);
  }

  function openCreateForm(): void {
    resetForm();
    setShowForm(true);
    setError("");
  }

  function openEditForm(item: FMEARecord): void {
    setEditingId(item.id);

    setFormData({
      process: item.process,
      failure_mode: item.failure_mode,
      effect: item.effect,
      cause: item.cause,
      severity: String(item.severity),
      occurrence: String(item.occurrence),
      detection: String(item.detection),
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
  // FORM SUBMISSION
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!formData.process.trim()) {
      setError("Please enter the process.");
      return;
    }

    if (!formData.failure_mode.trim()) {
      setError("Please enter the failure mode.");
      return;
    }

    if (!formData.effect.trim()) {
      setError("Please enter the effect.");
      return;
    }

    if (!formData.cause.trim()) {
      setError("Please enter the cause.");
      return;
    }

    const severity = Number(formData.severity);
    const occurrence = Number(formData.occurrence);
    const detection = Number(formData.detection);

    if (
      !Number.isFinite(severity) ||
      severity < 1 ||
      severity > 10
    ) {
      setError("Severity must be between 1 and 10.");
      return;
    }

    if (
      !Number.isFinite(occurrence) ||
      occurrence < 1 ||
      occurrence > 10
    ) {
      setError("Occurrence must be between 1 and 10.");
      return;
    }

    if (
      !Number.isFinite(detection) ||
      detection < 1 ||
      detection > 10
    ) {
      setError("Detection must be between 1 and 10.");
      return;
    }

    const rpn =
      severity *
      occurrence *
      detection;

    try {
      setSaving(true);
      setError("");

      const payload = {
        process: formData.process.trim(),
        failure_mode: formData.failure_mode.trim(),
        effect: formData.effect.trim(),
        cause: formData.cause.trim(),
        severity,
        occurrence,
        detection,
        rpn,
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

      await loadFMEAData();

      closeForm();
    } catch (err) {
      console.error("FMEA save error:", err);

      setError(
        "Unable to save the FMEA record. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function deleteFMEA(id: number): Promise<void> {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FMEA risk?"
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

      await loadFMEAData();
    } catch (err) {
      console.error("FMEA delete error:", err);

      setError(
        "Unable to delete the FMEA record."
      );
    }
  }

  // ==========================================================
  // RISK HELPERS
  // ==========================================================

  function getRiskLevel(rpn: number): string {
    if (rpn >= 150) {
      return "Critical";
    }

    if (rpn >= 100) {
      return "High";
    }

    if (rpn >= 50) {
      return "Medium";
    }

    return "Low";
  }

  function getRiskColor(rpn: number): string {
    if (rpn >= 150) {
      return "#DC2626";
    }

    if (rpn >= 100) {
      return "#EA580C";
    }

    if (rpn >= 50) {
      return "#D97706";
    }

    return "#16A34A";
  }

  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "#2563EB";

      case "completed":
        return "#16A34A";

      case "pending":
        return "#D97706";

      case "resolved":
        return "#16A34A";

      default:
        return "#64748B";
    }
  }

  function getRPNBarWidth(rpn: number): string {
    if (highestRPN === 0) {
      return "0%";
    }

    return `${Math.max(
      8,
      (rpn / highestRPN) * 100
    )}%`;
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
            fontSize: "32px",
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: "10px",
          }}
        >
          Failure Mode and Effects Analysis
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          Loading FMEA risk analysis...
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
            Failure Mode and Effects Analysis
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Identify, evaluate and prioritize process
            risks using Severity × Occurrence × Detection.
          </p>
        </div>

        {/* ONLY BUTTON BEHAVIOUR CHANGED */}

        <button
          type="button"
          onClick={
            showForm
              ? closeForm
              : openCreateForm
          }
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
          {showForm
            ? "← Back to FMEA"
            : "+ Create FMEA"}
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

      {/* ==========================================================
          MAIN VIEW / FORM VIEW
      ========================================================== */}

      {showForm ? (
        /* ======================================================
           CREATE / EDIT FORM
        ====================================================== */

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
              justifyContent: "space-between",
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
                ? "Create FMEA Risk"
                : "Edit FMEA Risk"}
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
                  Process
                </label>

                <input
                  type="text"
                  value={formData.process}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      process:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Inventory Receiving"
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
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Failure Mode
                </label>

                <input
                  type="text"
                  value={
                    formData.failure_mode
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      failure_mode:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Incorrect Quantity"
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
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Effect
                </label>

                <input
                  type="text"
                  value={formData.effect}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      effect:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Inventory discrepancy"
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
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Cause
                </label>

                <input
                  type="text"
                  value={formData.cause}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      cause:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Manual counting error"
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
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Severity (1–10)
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      severity:
                        event.target.value,
                    })
                  }
                  placeholder="1 - 10"
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
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Occurrence (1–10)
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.occurrence}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      occurrence:
                        event.target.value,
                    })
                  }
                  placeholder="1 - 10"
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
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Detection (1–10)
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.detection}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      detection:
                        event.target.value,
                    })
                  }
                  placeholder="1 - 10"
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
                    boxSizing: "border-box",
                    fontSize: "14px",
                    background: "#FFFFFF",
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

            {/* LIVE RPN PREVIEW */}

            {formData.severity &&
              formData.occurrence &&
              formData.detection && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    borderRadius: "10px",
                    background: "#F8FAFC",
                    border:
                      "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748B",
                        marginBottom: "4px",
                      }}
                    >
                      Calculated Risk Priority
                      Number
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                      }}
                    >
                      Severity × Occurrence ×
                      Detection
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: getRiskColor(
                        Number(
                          formData.severity
                        ) *
                          Number(
                            formData.occurrence
                          ) *
                          Number(
                            formData.detection
                          )
                      ),
                    }}
                  >
                    {Number(formData.severity) *
                      Number(
                        formData.occurrence
                      ) *
                      Number(
                        formData.detection
                      )}
                  </div>
                </div>
              )}

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
                disabled={saving}
                style={{
                  padding: "11px 20px",
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
                  ? "Create FMEA"
                  : "Update FMEA"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ======================================================
           NORMAL FMEA DASHBOARD
        ====================================================== */

        <>
          {/* KPI CARDS */}

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
                Total Risks
              </div>

              <div
                style={{
                  color: "#1E3A8A",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                {totalRisks}
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
                Critical Risks
              </div>

              <div
                style={{
                  color: "#166534",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                {criticalRisks}
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
                Highest RPN
              </div>

              <div
                style={{
                  color: "#991B1B",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                {highestRPN}
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
                Average RPN
              </div>

              <div
                style={{
                  color: "#92400E",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                {averageRPN.toFixed(1)}
              </div>
            </div>
          </div>

          {/* RPN RISK CHART */}

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
            <h2
              style={{
                margin: 0,
                color: "#0F172A",
                fontSize: "22px",
                fontWeight: 800,
                marginBottom: "5px",
              }}
            >
              RPN Risk Overview
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: "13px",
                marginBottom: "24px",
              }}
            >
              Risks are ranked from the highest Risk Priority
              Number to the lowest.
            </p>

            {calculatedFMEAData.length === 0 ? (
              <div
                style={{
                  padding: "45px",
                  textAlign: "center",
                  background: "#F8FAFC",
                  borderRadius: "12px",
                  color: "#64748B",
                }}
              >
                No FMEA risks available. Create your first
                FMEA analysis above.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {calculatedFMEAData
                  .slice(0, 8)
                  .map((item) => (
                    <div key={item.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          marginBottom: "7px",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#334155",
                          }}
                        >
                          {item.failure_mode}
                        </span>

                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: getRiskColor(
                              item.rpn
                            ),
                          }}
                        >
                          RPN {item.rpn}
                        </span>
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
                            width: getRPNBarWidth(
                              item.rpn
                            ),
                            height: "100%",
                            background:
                              getRiskColor(
                                item.rpn
                              ),
                            borderRadius: "999px",
                            transition:
                              "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* FMEA TABLE */}

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
                FMEA Risk Register
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Risks are automatically ranked by RPN so the
                highest-priority failure modes appear first.
              </p>
            </div>

            {calculatedFMEAData.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  background: "#F8FAFC",
                  borderRadius: "10px",
                  color: "#64748B",
                }}
              >
                No FMEA records available.
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  minWidth: "1150px",
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
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "12px",
                      }}
                    >
                      Process
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "12px",
                      }}
                    >
                      Failure Mode
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "12px",
                      }}
                    >
                      Effect
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        fontSize: "12px",
                      }}
                    >
                      Cause
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Severity
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Occurrence
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Detection
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      RPN
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Risk
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Status
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {calculatedFMEAData.map(
                    (item, index) => {
                      const riskColor =
                        getRiskColor(item.rpn);

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
                          <td
                            style={{
                              padding: "14px",
                              color: "#0F172A",
                              fontWeight: 700,
                              fontSize: "13px",
                            }}
                          >
                            {item.process}
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              color: "#334155",
                              fontWeight: 700,
                              fontSize: "13px",
                            }}
                          >
                            {item.failure_mode}
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              color: "#64748B",
                              fontSize: "12px",
                              maxWidth: "180px",
                            }}
                          >
                            {item.effect}
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              color: "#64748B",
                              fontSize: "12px",
                              maxWidth: "180px",
                            }}
                          >
                            {item.cause}
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              textAlign: "center",
                              fontWeight: 800,
                              color:
                                item.severity >= 8
                                  ? "#DC2626"
                                  : "#475569",
                            }}
                          >
                            {item.severity}
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              textAlign: "center",
                              fontWeight: 800,
                              color:
                                item.occurrence >= 7
                                  ? "#DC2626"
                                  : "#475569",
                            }}
                          >
                            {item.occurrence}
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              textAlign: "center",
                              fontWeight: 800,
                              color:
                                item.detection >= 7
                                  ? "#DC2626"
                                  : "#475569",
                            }}
                          >
                            {item.detection}
                          </td>

                          {/* RPN GRAPHIC */}

                          <td
                            style={{
                              padding: "14px",
                              minWidth: "150px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  flex: 1,
                                  height: "8px",
                                  background:
                                    "#E2E8F0",
                                  borderRadius:
                                    "999px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width:
                                      getRPNBarWidth(
                                        item.rpn
                                      ),
                                    height: "100%",
                                    background:
                                      riskColor,
                                    borderRadius:
                                      "999px",
                                  }}
                                />
                              </div>

                              <span
                                style={{
                                  minWidth: "32px",
                                  textAlign: "right",
                                  fontSize: "12px",
                                  fontWeight: 800,
                                  color:
                                    riskColor,
                                }}
                              >
                                {item.rpn}
                              </span>
                            </div>
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{
                                display:
                                  "inline-block",
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "999px",
                                background:
                                  `${riskColor}15`,
                                color: riskColor,
                                fontSize: "10px",
                                fontWeight: 800,
                              }}
                            >
                              {getRiskLevel(
                                item.rpn
                              )}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{
                                display:
                                  "inline-block",
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "999px",
                                background:
                                  `${getStatusColor(
                                    item.status
                                  )}15`,
                                color:
                                  getStatusColor(
                                    item.status
                                  ),
                                fontSize: "10px",
                                fontWeight: 800,
                              }}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "14px",
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
                                    "6px 10px",
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
                                  deleteFMEA(
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
                                    "6px 10px",
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
        </>
      )}
    </div>
  );
}