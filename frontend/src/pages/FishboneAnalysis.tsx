import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type FishboneAnalysisRecord = {
  id: number;
  problem: string;
  people: string;
  process: string;
  equipment: string;
  materials: string;
  environment: string;
  measurement: string;
  status: string;
};

type FishboneFormData = {
  problem: string;
  people: string;
  process: string;
  equipment: string;
  materials: string;
  environment: string;
  measurement: string;
  status: string;
};

const API_URL =
  "https://smartchain-nexus-3.onrender.com/lean-six-sigma/fishbone-analysis";

const emptyForm: FishboneFormData = {
  problem: "",
  people: "",
  process: "",
  equipment: "",
  materials: "",
  environment: "",
  measurement: "",
  status: "Active",
};

const categories = [
  {
    key: "people" as const,
    title: "People",
    icon: "👥",
    description: "Human factors",
    gradient: "linear-gradient(135deg, #2563EB, #60A5FA)",
    soft: "#EFF6FF",
    text: "#1D4ED8",
  },
  {
    key: "process" as const,
    title: "Process",
    icon: "⚙️",
    description: "Workflow factors",
    gradient: "linear-gradient(135deg, #059669, #34D399)",
    soft: "#ECFDF5",
    text: "#047857",
  },
  {
    key: "equipment" as const,
    title: "Equipment",
    icon: "🛠️",
    description: "Machine factors",
    gradient: "linear-gradient(135deg, #D97706, #FBBF24)",
    soft: "#FFFBEB",
    text: "#B45309",
  },
  {
    key: "materials" as const,
    title: "Materials",
    icon: "📦",
    description: "Input factors",
    gradient: "linear-gradient(135deg, #DB2777, #F472B6)",
    soft: "#FDF2F8",
    text: "#BE185D",
  },
  {
    key: "environment" as const,
    title: "Environment",
    icon: "🌍",
    description: "External factors",
    gradient: "linear-gradient(135deg, #0284C7, #38BDF8)",
    soft: "#F0F9FF",
    text: "#0369A1",
  },
  {
    key: "measurement" as const,
    title: "Measurement",
    icon: "📊",
    description: "Data factors",
    gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    soft: "#F5F3FF",
    text: "#6D28D9",
  },
];

export default function FishboneAnalysis() {
  const [analyses, setAnalyses] = useState<
    FishboneAnalysisRecord[]
  >([]);

  const [formData, setFormData] =
    useState<FishboneFormData>(emptyForm);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] =
    useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadFishboneAnalyses();
  }, []);

  async function loadFishboneAnalyses(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load Fishbone analyses. Status: ${response.status}`
        );
      }

      const data: FishboneAnalysisRecord[] =
        await response.json();

      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fishbone loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Fishbone analyses."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // FORM
  // =========================================================

  function handleInputChange(
    field: keyof FishboneFormData,
    value: string
  ): void {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!formData.problem.trim()) {
      setError("Please enter the problem statement.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${
              isEditing ? "update" : "create"
            } Fishbone analysis.`
        );
      }

      const savedRecord: FishboneAnalysisRecord =
        await response.json();

      if (isEditing) {
        setAnalyses((previous) =>
          previous.map((item) =>
            item.id === savedRecord.id
              ? savedRecord
              : item
          )
        );

        setSuccessMessage(
          "Fishbone analysis updated successfully."
        );
      } else {
        setAnalyses((previous) => [
          savedRecord,
          ...previous,
        ]);

        setSuccessMessage(
          "Fishbone analysis created successfully."
        );
      }

      resetForm();
    } catch (err) {
      console.error("Fishbone save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save Fishbone analysis."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // CREATE FORM
  // =========================================================

  function openCreateForm(): void {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // EDIT
  // =========================================================

  function handleEdit(
    analysis: FishboneAnalysisRecord
  ): void {
    setEditingId(analysis.id);

    setFormData({
      problem: analysis.problem || "",
      people: analysis.people || "",
      process: analysis.process || "",
      equipment: analysis.equipment || "",
      materials: analysis.materials || "",
      environment: analysis.environment || "",
      measurement: analysis.measurement || "",
      status: analysis.status || "Active",
    });

    setShowForm(true);
    setError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function handleDelete(
    analysisId: number
  ): Promise<void> {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Fishbone analysis?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(analysisId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/${analysisId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete Fishbone analysis."
        );
      }

      setAnalyses((previous) =>
        previous.filter(
          (item) => item.id !== analysisId
        )
      );

      setSuccessMessage(
        "Fishbone analysis deleted successfully."
      );

      if (editingId === analysisId) {
        resetForm();
      }
    } catch (err) {
      console.error("Fishbone delete error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete Fishbone analysis."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================================
  // RESET
  // =========================================================

  function resetForm(): void {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredAnalyses =
    useMemo<FishboneAnalysisRecord[]>(() => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      if (!search) return analyses;

      return analyses.filter((item) =>
        [
          item.problem,
          item.people,
          item.process,
          item.equipment,
          item.materials,
          item.environment,
          item.measurement,
          item.status,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(search)
        )
      );
    }, [analyses, searchTerm]);

  // =========================================================
  // KPI
  // =========================================================

  const totalAnalyses = analyses.length;

  const activeAnalyses = analyses.filter(
    (item) =>
      item.status?.toLowerCase() === "active"
  ).length;

  const completedAnalyses = analyses.filter(
    (item) =>
      item.status?.toLowerCase() === "completed"
  ).length;

  const resolvedAnalyses = analyses.filter(
    (item) =>
      item.status?.toLowerCase() === "resolved"
  ).length;

  const inProgressAnalyses = analyses.filter(
    (item) =>
      item.status?.toLowerCase() === "in progress"
  ).length;

  // =========================================================
  // CATEGORY COUNT
  // =========================================================

  function getCategoryCount(
    category: keyof FishboneFormData
  ): number {
    return analyses.filter((item) => {
      const value = item[category];

      return (
        typeof value === "string" &&
        value.trim().length > 0
      );
    }).length;
  }

  // =========================================================
  // STATUS STYLE
  // =========================================================

  function getStatusStyle(status: string) {
    const normalized =
      status?.toLowerCase();

    if (normalized === "resolved") {
      return {
        background: "#ECFDF5",
        color: "#047857",
        dot: "#10B981",
      };
    }

    if (normalized === "completed") {
      return {
        background: "#EFF6FF",
        color: "#1D4ED8",
        dot: "#3B82F6",
      };
    }

    if (normalized === "in progress") {
      return {
        background: "#F5F3FF",
        color: "#6D28D9",
        dot: "#8B5CF6",
      };
    }

    return {
      background: "#FFFBEB",
      color: "#B45309",
      dot: "#F59E0B",
    };
  }

  // =========================================================
  // CAUSE RENDER
  // =========================================================

  function renderCause(value: string): JSX.Element {
    if (!value || !value.trim()) {
      return (
        <span
          style={{
            color: "#94A3B8",
            fontStyle: "italic",
            fontSize: "12px",
          }}
        >
          Not specified
        </span>
      );
    }

    return (
      <span
        style={{
          color: "#475569",
          lineHeight: 1.5,
        }}
      >
        {value}
      </span>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .45; }
          }

          * {
            box-sizing: border-box;
          }
        `}</style>

        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 100%)",
            padding: "32px",
          }}
        >
          <div
            style={{
              maxWidth: "1500px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                height: "220px",
                borderRadius: "24px",
                background: "#E2E8F0",
                animation:
                  "pulse 1.5s infinite",
                marginBottom: "24px",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, 1fr)",
                gap: "18px",
              }}
            >
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  style={{
                    height: "145px",
                    borderRadius: "18px",
                    background: "#E2E8F0",
                    animation:
                      "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .fishbone-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(37,99,235,.08), transparent 28%),
            radial-gradient(circle at bottom left, rgba(124,58,237,.06), transparent 25%),
            #F8FAFC;
          padding: 30px;
          color: #0F172A;
        }

        .fishbone-container {
          max-width: 1500px;
          margin: 0 auto;
        }

        .fishbone-button {
          transition: all .2s ease;
        }

        .fishbone-button:hover {
          transform: translateY(-2px);
        }

        .fishbone-card {
          transition: all .2s ease;
        }

        .fishbone-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 35px rgba(15,23,42,.10) !important;
        }

        .fishbone-row {
          transition: all .2s ease;
        }

        .fishbone-row:hover {
          background: #F1F5F9 !important;
          transform: translateY(-1px);
        }

        .fishbone-input {
          transition: all .2s ease;
        }

        .fishbone-input:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 4px rgba(37,99,235,.10);
        }

        .fishbone-action {
          transition: all .2s ease;
        }

        .fishbone-action:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .fishbone-page {
            padding: 18px;
          }

          .fishbone-hero {
            padding: 26px !important;
          }

          .fishbone-title {
            font-size: 30px !important;
          }
        }

        @media (max-width: 600px) {
          .fishbone-page {
            padding: 12px;
          }

          .fishbone-hero {
            padding: 22px !important;
            border-radius: 18px !important;
          }

          .fishbone-title {
            font-size: 26px !important;
          }

          .fishbone-hero-actions {
            width: 100%;
          }

          .fishbone-hero-actions button {
            width: 100%;
          }
        }
      `}</style>

      <div className="fishbone-page">
        <div className="fishbone-container">

          {/* =================================================
              HERO
          ================================================= */}

          {!showForm && (
            <section
              className="fishbone-hero"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                padding: "34px",
                marginBottom: "24px",
                background:
                  "linear-gradient(135deg, #0F172A 0%, #172554 55%, #1D4ED8 100%)",
                boxShadow:
                  "0 20px 50px rgba(15,23,42,.18)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "260px",
                  height: "260px",
                  borderRadius: "50%",
                  background:
                    "rgba(255,255,255,.06)",
                  right: "-80px",
                  top: "-110px",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background:
                    "rgba(96,165,250,.08)",
                  right: "180px",
                  bottom: "-110px",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "25px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background:
                        "rgba(255,255,255,.10)",
                      border:
                        "1px solid rgba(255,255,255,.12)",
                      color: "#BFDBFE",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      marginBottom: "14px",
                    }}
                  >
                    <span>✦</span>
                    LEAN SIX SIGMA
                  </div>

                  <h1
                    className="fishbone-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontSize: "38px",
                      lineHeight: 1.1,
                      fontWeight: 850,
                      letterSpacing: "-1.2px",
                    }}
                  >
                    Fishbone Analysis
                  </h1>

                  <p
                    style={{
                      margin: "12px 0 0",
                      color: "#CBD5E1",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      maxWidth: "680px",
                    }}
                  >
                    Identify root causes, uncover process
                    weaknesses and turn operational problems
                    into actionable improvement opportunities.
                  </p>
                </div>

                <div
                  className="fishbone-hero-actions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    className="fishbone-button"
                    onClick={loadFishboneAnalyses}
                    style={{
                      border:
                        "1px solid rgba(255,255,255,.18)",
                      background:
                        "rgba(255,255,255,.10)",
                      color: "#FFFFFF",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    ↻ Refresh
                  </button>

                  <button
                    type="button"
                    className="fishbone-button"
                    onClick={openCreateForm}
                    style={{
                      border: "none",
                      background: "#FFFFFF",
                      color: "#1D4ED8",
                      borderRadius: "12px",
                      padding: "13px 18px",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,.18)",
                    }}
                  >
                    + New Analysis
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              CREATE / EDIT MAIN VIEW
          ================================================= */}

          {showForm ? (
            <div>
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DBEAFE",
                  borderRadius: "20px",
                  padding: "26px",
                  marginBottom: "28px",
                  boxShadow:
                    "0 15px 40px rgba(37,99,235,.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "15px",
                    marginBottom: "23px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "#EFF6FF",
                        color: "#2563EB",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: ".7px",
                        textTransform: "uppercase",
                        marginBottom: "9px",
                      }}
                    >
                      {editingId !== null
                        ? "Editing analysis"
                        : "New investigation"}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "23px",
                        fontWeight: 850,
                        color: "#0F172A",
                      }}
                    >
                      {editingId !== null
                        ? "Edit Fishbone Analysis"
                        : "Create Fishbone Analysis"}
                    </h2>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#64748B",
                        fontSize: "13px",
                      }}
                    >
                      Map the potential root causes using the
                      six Fishbone categories.
                    </p>
                  </div>
                </div>

                {/* PROBLEM */}

                <div
                  style={{
                    padding: "18px",
                    borderRadius: "15px",
                    background:
                      "linear-gradient(135deg,#F8FAFC,#EFF6FF)",
                    border: "1px solid #DBEAFE",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#334155",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: ".4px",
                    }}
                  >
                    Problem Statement
                  </label>

                  <input
                    className="fishbone-input"
                    type="text"
                    value={formData.problem}
                    onChange={(event) =>
                      handleInputChange(
                        "problem",
                        event.target.value
                      )
                    }
                    placeholder="Example: High inventory counting errors"
                    style={{
                      width: "100%",
                      padding: "13px 15px",
                      border:
                        "1px solid #CBD5E1",
                      borderRadius: "11px",
                      background: "#FFFFFF",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* SIX CATEGORIES */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {categories.map(
                    (category) => (
                      <div
                        key={category.key}
                        style={{
                          padding: "17px",
                          border:
                            "1px solid #E2E8F0",
                          borderRadius: "15px",
                          background: "#FFFFFF",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "10px",
                              background:
                                category.gradient,
                              color: "#FFFFFF",
                              fontSize: "16px",
                            }}
                          >
                            {category.icon}
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 800,
                                color: "#0F172A",
                              }}
                            >
                              {category.title}
                            </div>

                            <div
                              style={{
                                fontSize: "10px",
                                color: "#94A3B8",
                              }}
                            >
                              {category.description}
                            </div>
                          </div>
                        </div>

                        <textarea
                          className="fishbone-input"
                          value={
                            formData[
                              category.key
                            ]
                          }
                          onChange={(event) =>
                            handleInputChange(
                              category.key,
                              event.target.value
                            )
                          }
                          placeholder={
                            category.key ===
                            "people"
                              ? "Example: Insufficient staff training"
                              : category.key ===
                                "process"
                              ? "Example: Manual approval delays"
                              : category.key ===
                                "equipment"
                              ? "Example: Equipment downtime"
                              : category.key ===
                                "materials"
                              ? "Example: Supplier quality variation"
                              : category.key ===
                                "environment"
                              ? "Example: Warehouse temperature changes"
                              : "Example: Incorrect inventory counts"
                          }
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "12px",
                            border:
                              "1px solid #CBD5E1",
                            borderRadius: "10px",
                            background: "#F8FAFC",
                            fontSize: "13px",
                            resize: "vertical",
                            outline: "none",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    )
                  )}
                </div>

                {/* STATUS */}

                <div
                  style={{
                    marginTop: "18px",
                    maxWidth: "320px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#334155",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Analysis Status
                  </label>

                  <select
                    className="fishbone-input"
                    value={formData.status}
                    onChange={(event) =>
                      handleInputChange(
                        "status",
                        event.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "13px",
                      border:
                        "1px solid #CBD5E1",
                      borderRadius: "10px",
                      background: "#FFFFFF",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>
                </div>

                {/* BUTTONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "23px",
                    paddingTop: "20px",
                    borderTop:
                      "1px solid #E2E8F0",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="submit"
                    disabled={saving}
                    className="fishbone-button"
                    style={{
                      border: "none",
                      borderRadius: "11px",
                      padding: "13px 20px",
                      background: saving
                        ? "#94A3B8"
                        : "linear-gradient(135deg,#2563EB,#1D4ED8)",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: saving
                        ? "not-allowed"
                        : "pointer",
                      boxShadow:
                        "0 7px 18px rgba(37,99,235,.20)",
                    }}
                  >
                    {saving
                      ? "Saving..."
                      : editingId !== null
                      ? "✓ Update Analysis"
                      : "+ Create Analysis"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="fishbone-button"
                    style={{
                      border:
                        "1px solid #E2E8F0",
                      borderRadius: "11px",
                      padding: "13px 20px",
                      background: "#F8FAFC",
                      color: "#475569",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* =================================================
                  MESSAGES
              ================================================= */}

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "#FFF1F2",
                    border:
                      "1px solid #FECDD3",
                    color: "#BE123C",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "9px",
                      background: "#FFE4E6",
                    }}
                  >
                    !
                  </span>

                  {error}
                </div>
              )}

              {successMessage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "#ECFDF5",
                    border:
                      "1px solid #A7F3D0",
                    color: "#047857",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "9px",
                      background: "#D1FAE5",
                    }}
                  >
                    ✓
                  </span>

                  {successMessage}
                </div>
              )}

              {/* =================================================
                  KPI CARDS
              ================================================= */}

              <section
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "26px",
                }}
              >
                {[
                  {
                    title: "Total Analyses",
                    value: totalAnalyses,
                    icon: "◈",
                    label: "All investigations",
                    gradient:
                      "linear-gradient(135deg,#2563EB,#60A5FA)",
                  },
                  {
                    title: "Active",
                    value: activeAnalyses,
                    icon: "●",
                    label: "Currently active",
                    gradient:
                      "linear-gradient(135deg,#059669,#34D399)",
                  },
                  {
                    title: "In Progress",
                    value: inProgressAnalyses,
                    icon: "◌",
                    label: "Under investigation",
                    gradient:
                      "linear-gradient(135deg,#7C3AED,#A78BFA)",
                  },
                  {
                    title: "Resolved",
                    value: resolvedAnalyses,
                    icon: "✓",
                    label: "Root cause resolved",
                    gradient:
                      "linear-gradient(135deg,#DB2777,#F472B6)",
                  },
                ].map((stat) => (
                  <div
                    key={stat.title}
                    className="fishbone-card"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      background: "#FFFFFF",
                      border:
                        "1px solid #E2E8F0",
                      borderRadius: "18px",
                      padding: "21px",
                      boxShadow:
                        "0 8px 24px rgba(15,23,42,.05)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        background:
                          stat.gradient,
                        opacity: 0.08,
                        right: "-25px",
                        top: "-25px",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: 0,
                            color: "#64748B",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              ".5px",
                          }}
                        >
                          {stat.title}
                        </p>

                        <div
                          style={{
                            fontSize: "32px",
                            lineHeight: 1,
                            fontWeight: 850,
                            color: "#0F172A",
                            marginTop: "10px",
                          }}
                        >
                          {stat.value}
                        </div>

                        <p
                          style={{
                            margin:
                              "8px 0 0",
                            color: "#94A3B8",
                            fontSize: "12px",
                          }}
                        >
                          {stat.label}
                        </p>
                      </div>

                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          borderRadius: "13px",
                          background:
                            stat.gradient,
                          color: "#FFFFFF",
                          fontSize: "19px",
                          fontWeight: 800,
                          boxShadow:
                            "0 8px 18px rgba(37,99,235,.16)",
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* =================================================
                  FISHBONE CATEGORY OVERVIEW
              ================================================= */}

              <section
                style={{
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-end",
                    gap: "15px",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#2563EB",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform:
                          "uppercase",
                        marginBottom: "5px",
                      }}
                    >
                      Root Cause Framework
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "21px",
                        fontWeight: 850,
                        color: "#0F172A",
                      }}
                    >
                      The 6M Cause Categories
                    </h2>
                  </div>

                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "12px",
                    }}
                  >
                    Causes identified across all analyses
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: "13px",
                  }}
                >
                  {categories.map(
                    (category) => (
                      <div
                        key={category.key}
                        className="fishbone-card"
                        style={{
                          background: "#FFFFFF",
                          border:
                            "1px solid #E2E8F0",
                          borderRadius: "16px",
                          padding: "16px",
                          boxShadow:
                            "0 5px 16px rgba(15,23,42,.04)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              flexShrink: 0,
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              borderRadius:
                                "12px",
                              background:
                                category.gradient,
                              color: "#FFFFFF",
                              fontSize: "20px",
                              boxShadow:
                                "0 7px 15px rgba(15,23,42,.10)",
                            }}
                          >
                            {category.icon}
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize:
                                  "13px",
                                fontWeight:
                                  800,
                                color:
                                  "#0F172A",
                              }}
                            >
                              {category.title}
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "11px",
                                color:
                                  "#94A3B8",
                                marginTop:
                                  "2px",
                              }}
                            >
                              {
                                category.description
                              }
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            marginTop: "15px",
                            paddingTop:
                              "12px",
                            borderTop:
                              "1px solid #F1F5F9",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#64748B",
                            }}
                          >
                            Analyses with causes
                          </span>

                          <span
                            style={{
                              color:
                                category.text,
                              fontSize:
                                "20px",
                              fontWeight:
                                850,
                            }}
                          >
                            {getCategoryCount(
                              category.key
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* =================================================
                  DATA SECTION
              ================================================= */}

              <section
                style={{
                  background: "#FFFFFF",
                  border:
                    "1px solid #E2E8F0",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,.05)",
                }}
              >
                <div
                  style={{
                    padding: "23px 24px",
                    borderBottom:
                      "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        marginBottom: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius:
                            "50%",
                          background:
                            "#10B981",
                          boxShadow:
                            "0 0 0 4px rgba(16,185,129,.12)",
                        }}
                      />

                      <span
                        style={{
                          color: "#059669",
                          fontSize: "10px",
                          fontWeight: 800,
                          letterSpacing:
                            ".8px",
                          textTransform:
                            "uppercase",
                        }}
                      >
                        Live Analysis Repository
                      </span>
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        color: "#0F172A",
                        fontSize: "21px",
                        fontWeight: 850,
                      }}
                    >
                      Fishbone Analyses
                    </h2>

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                        color: "#64748B",
                        fontSize:
                          "12px",
                      }}
                    >
                      Review, search and manage
                      root-cause investigations.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "8px 13px",
                      borderRadius:
                        "999px",
                      background:
                        "#EFF6FF",
                      color:
                        "#1D4ED8",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    {filteredAnalyses.length}{" "}
                    {filteredAnalyses.length ===
                    1
                      ? "analysis"
                      : "analyses"}
                  </div>
                </div>

                {/* SEARCH */}

                <div
                  style={{
                    padding: "17px 24px",
                    background:
                      "#F8FAFC",
                    borderBottom:
                      "1px solid #E2E8F0",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position:
                          "absolute",
                        left: "14px",
                        top: "50%",
                        transform:
                          "translateY(-50%)",
                        fontSize:
                          "15px",
                        color:
                          "#94A3B8",
                      }}
                    >
                      ⌕
                    </span>

                    <input
                      className="fishbone-input"
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(
                          event.target.value
                        )
                      }
                      placeholder="Search problems, people, process, equipment, materials..."
                      style={{
                        width: "100%",
                        padding:
                          "12px 15px 12px 40px",
                        border:
                          "1px solid #CBD5E1",
                        borderRadius:
                          "11px",
                        background:
                          "#FFFFFF",
                        fontSize:
                          "13px",
                        outline:
                          "none",
                      }}
                    />
                  </div>
                </div>

                {/* EMPTY STATE */}

                {filteredAnalyses.length ===
                0 ? (
                  <div
                    style={{
                      padding:
                        "65px 25px",
                      textAlign:
                        "center",
                    }}
                  >
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        margin:
                          "0 auto 17px",
                        borderRadius:
                          "20px",
                        background:
                          "linear-gradient(135deg,#EFF6FF,#F5F3FF)",
                        fontSize:
                          "30px",
                      }}
                    >
                      {analyses.length ===
                      0
                        ? "🔎"
                        : "📭"}
                    </div>

                    <h3
                      style={{
                        margin:
                          "0 0 7px",
                        fontSize:
                          "18px",
                        fontWeight:
                          850,
                        color:
                          "#0F172A",
                      }}
                    >
                      {analyses.length ===
                      0
                        ? "No analyses yet"
                        : "No matching analyses"}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#64748B",
                        fontSize:
                          "13px",
                      }}
                    >
                      {analyses.length ===
                      0
                        ? "Create your first Fishbone investigation to start identifying root causes."
                        : "Try a different search term or clear the current search."}
                    </p>

                    {analyses.length ===
                      0 && (
                      <button
                        type="button"
                        onClick={openCreateForm}
                        className="fishbone-button"
                        style={{
                          marginTop:
                            "18px",
                          border: "none",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 16px",
                          background:
                            "#2563EB",
                          color:
                            "#FFFFFF",
                          fontWeight:
                            800,
                          fontSize:
                            "12px",
                          cursor:
                            "pointer",
                        }}
                      >
                        + Create First Analysis
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      overflowX:
                        "auto",
                      padding:
                        "18px",
                    }}
                  >
                    <div
                      style={{
                        minWidth:
                          "1350px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1.45fr 1.15fr 1.15fr 1.15fr 1.15fr 1.15fr 1.15fr .8fr 1fr",
                          gap: "10px",
                          padding:
                            "10px 14px",
                          color:
                            "#64748B",
                          fontSize:
                            "10px",
                          fontWeight:
                            850,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            ".6px",
                        }}
                      >
                        <div>Problem</div>
                        <div>People</div>
                        <div>Process</div>
                        <div>Equipment</div>
                        <div>Materials</div>
                        <div>Environment</div>
                        <div>Measurement</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gap: "8px",
                        }}
                      >
                        {filteredAnalyses.map(
                          (item) => {
                            const statusStyle =
                              getStatusStyle(
                                item.status
                              );

                            return (
                              <div
                                key={item.id}
                                className="fishbone-row"
                                style={{
                                  display:
                                    "grid",
                                  gridTemplateColumns:
                                    "1.45fr 1.15fr 1.15fr 1.15fr 1.15fr 1.15fr 1.15fr .8fr 1fr",
                                  gap: "10px",
                                  alignItems:
                                    "center",
                                  padding:
                                    "15px 14px",
                                  background:
                                    "#F8FAFC",
                                  border:
                                    "1px solid #F1F5F9",
                                  borderRadius:
                                    "13px",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      color:
                                        "#0F172A",
                                      fontSize:
                                        "13px",
                                      fontWeight:
                                        800,
                                      lineHeight:
                                        1.4,
                                    }}
                                  >
                                    {
                                      item.problem
                                    }
                                  </div>

                                  <div
                                    style={{
                                      marginTop:
                                        "5px",
                                      color:
                                        "#94A3B8",
                                      fontSize:
                                        "10px",
                                    }}
                                  >
                                    ID #{item.id}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  {renderCause(
                                    item.people
                                  )}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  {renderCause(
                                    item.process
                                  )}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  {renderCause(
                                    item.equipment
                                  )}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  {renderCause(
                                    item.materials
                                  )}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  {renderCause(
                                    item.environment
                                  )}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  {renderCause(
                                    item.measurement
                                  )}
                                </div>

                                <div>
                                  <span
                                    style={{
                                      display:
                                        "inline-flex",
                                      alignItems:
                                        "center",
                                      gap: "6px",
                                      padding:
                                        "6px 9px",
                                      borderRadius:
                                        "999px",
                                      background:
                                        statusStyle.background,
                                      color:
                                        statusStyle.color,
                                      fontSize:
                                        "10px",
                                      fontWeight:
                                        800,
                                      whiteSpace:
                                        "nowrap",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width:
                                          "6px",
                                        height:
                                          "6px",
                                        borderRadius:
                                          "50%",
                                        background:
                                          statusStyle.dot,
                                      }}
                                    />

                                    {
                                      item.status
                                    }
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    gap: "6px",
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="fishbone-action"
                                    onClick={() =>
                                      handleEdit(
                                        item
                                      )
                                    }
                                    style={{
                                      border:
                                        "1px solid #BFDBFE",
                                      background:
                                        "#EFF6FF",
                                      color:
                                        "#1D4ED8",
                                      borderRadius:
                                        "8px",
                                      padding:
                                        "7px 10px",
                                      fontSize:
                                        "10px",
                                      fontWeight:
                                        800,
                                      cursor:
                                        "pointer",
                                    }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="fishbone-action"
                                    onClick={() =>
                                      handleDelete(
                                        item.id
                                      )
                                    }
                                    disabled={
                                      deletingId ===
                                      item.id
                                    }
                                    style={{
                                      border:
                                        "1px solid #FECDD3",
                                      background:
                                        deletingId ===
                                        item.id
                                          ? "#E2E8F0"
                                          : "#FFF1F2",
                                      color:
                                        deletingId ===
                                        item.id
                                          ? "#64748B"
                                          : "#BE123C",
                                      borderRadius:
                                        "8px",
                                      padding:
                                        "7px 10px",
                                      fontSize:
                                        "10px",
                                      fontWeight:
                                        800,
                                      cursor:
                                        deletingId ===
                                        item.id
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                  >
                                    {deletingId ===
                                    item.id
                                      ? "..."
                                      : "Delete"}
                                  </button>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* FOOTER INSIGHT */}

              {analyses.length > 0 && (
                <div
                  style={{
                    marginTop: "18px",
                    padding:
                      "15px 18px",
                    borderRadius:
                      "14px",
                    background:
                      "linear-gradient(135deg,#EFF6FF,#F5F3FF)",
                    border:
                      "1px solid #DBEAFE",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      borderRadius:
                        "10px",
                      background:
                        "#FFFFFF",
                      boxShadow:
                        "0 4px 10px rgba(15,23,42,.05)",
                    }}
                  >
                    💡
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize:
                          "12px",
                        fontWeight:
                          800,
                        color:
                          "#334155",
                      }}
                    >
                      Continuous Improvement Insight
                    </div>

                    <div
                      style={{
                        fontSize:
                          "11px",
                        color:
                          "#64748B",
                        marginTop:
                          "2px",
                      }}
                    >
                      {totalAnalyses} root-cause{" "}
                      {totalAnalyses === 1
                        ? "investigation is"
                        : "investigations are"}{" "}
                      currently tracked in the
                      Lean Six Sigma workspace.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}