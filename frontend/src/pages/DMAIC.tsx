import { useEffect, useMemo, useState } from "react";

type DMAICProject = {
  id: number;
  project_name: string;
  define: string;
  measure: string;
  analyze: string;
  improve: string;
  control: string;
  improvement_percentage: number | null;
  status: string;
};

type DMAICFormData = {
  project_name: string;
  define: string;
  measure: string;
  analyze: string;
  improve: string;
  control: string;
  improvement_percentage: string;
  status: string;
};

const API_BASE_URL = "https://smartchain-nexus-3.onrender.com";

const emptyForm: DMAICFormData = {
  project_name: "",
  define: "",
  measure: "",
  analyze: "",
  improve: "",
  control: "",
  improvement_percentage: "",
  status: "Active",
};

export default function DMAIC() {
  const [projects, setProjects] = useState<DMAICProject[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [editingProject, setEditingProject] =
    useState<DMAICProject | null>(null);

  const [selectedProject, setSelectedProject] =
    useState<DMAICProject | null>(null);

  const [formData, setFormData] =
    useState<DMAICFormData>(emptyForm);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // ==========================================================
  // LOAD DMAIC PROJECTS
  // ==========================================================

  async function loadDMAICProjects(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/lean-six-sigma/dmaic`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load DMAIC projects. Status: ${response.status}`
        );
      }

      const data: DMAICProject[] =
        await response.json();

      setProjects(data);
    } catch (error) {
      console.error(
        "Failed to load DMAIC projects:",
        error
      );

      setError(
        "Unable to load DMAIC projects. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDMAICProjects();
  }, []);

  // ==========================================================
  // KPI CALCULATIONS
  // ==========================================================

  const totalProjects = projects.length;

  const completedProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        project.status.toLowerCase() === "completed"
    ).length;
  }, [projects]);

  const activeProjects = useMemo(() => {
    return projects.filter((project) => {
      const status = project.status.toLowerCase();

      return (
        status === "active" ||
        status === "in progress" ||
        status === "in-progress"
      );
    }).length;
  }, [projects]);

  // ==========================================================
  // FORM HANDLERS
  // ==========================================================

  function handleInputChange(
    field: keyof DMAICFormData,
    value: string
  ): void {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function openCreateForm(): void {
    setEditingProject(null);
    setSelectedProject(null);
    setFormData(emptyForm);
    setError("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function openEditForm(
    project: DMAICProject
  ): void {
    setEditingProject(project);
    setSelectedProject(null);

    setFormData({
      project_name: project.project_name,
      define: project.define,
      measure: project.measure,
      analyze: project.analyze,
      improve: project.improve,
      control: project.control,
      improvement_percentage:
        project.improvement_percentage !== null
          ? String(project.improvement_percentage)
          : "",
      status: project.status,
    });

    setError("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function closeForm(): void {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingProject(null);
    setFormData(emptyForm);
  }

  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!formData.project_name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!formData.define.trim()) {
      setError("Define phase is required.");
      return;
    }

    if (!formData.measure.trim()) {
      setError("Measure phase is required.");
      return;
    }

    if (!formData.analyze.trim()) {
      setError("Analyze phase is required.");
      return;
    }

    if (!formData.improve.trim()) {
      setError("Improve phase is required.");
      return;
    }

    if (!formData.control.trim()) {
      setError("Control phase is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const improvementValue =
        formData.improvement_percentage.trim() === ""
          ? null
          : Number(formData.improvement_percentage);

      if (
        improvementValue !== null &&
        Number.isNaN(improvementValue)
      ) {
        setError(
          "Improvement percentage must be a valid number."
        );
        setSaving(false);
        return;
      }

      const payload = {
        project_name:
          formData.project_name.trim(),

        define: formData.define.trim(),

        measure: formData.measure.trim(),

        analyze: formData.analyze.trim(),

        improve: formData.improve.trim(),

        control: formData.control.trim(),

        improvement_percentage:
          improvementValue,

        status: formData.status,
      };

      const url = editingProject
        ? `${API_BASE_URL}/lean-six-sigma/dmaic/${editingProject.id}`
        : `${API_BASE_URL}/lean-six-sigma/dmaic`;

      const method = editingProject
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseText =
          await response.text();

        throw new Error(
          responseText ||
            `Request failed with status ${response.status}`
        );
      }

      const savedProject: DMAICProject =
        await response.json();

      if (editingProject) {
        setProjects((previous) =>
          previous.map((project) =>
            project.id === savedProject.id
              ? savedProject
              : project
          )
        );

        setSuccessMessage(
          "DMAIC project updated successfully."
        );
      } else {
        setProjects((previous) => [
          savedProject,
          ...previous,
        ]);

        setSuccessMessage(
          "DMAIC project created successfully."
        );
      }

      setShowForm(false);
      setEditingProject(null);
      setFormData(emptyForm);
    } catch (error) {
      console.error(
        "Failed to save DMAIC project:",
        error
      );

      setError(
        "Unable to save the DMAIC project. Please check the backend and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete(
    project: DMAICProject
  ): Promise<void> {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.project_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(project.id);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/lean-six-sigma/dmaic/${project.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Delete failed with status ${response.status}`
        );
      }

      setProjects((previous) =>
        previous.filter(
          (item) => item.id !== project.id
        )
      );

      if (
        selectedProject &&
        selectedProject.id === project.id
      ) {
        setSelectedProject(null);
      }

      setSuccessMessage(
        "DMAIC project deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete DMAIC project:",
        error
      );

      setError(
        "Unable to delete the DMAIC project."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================================
  // VIEW PROJECT
  // ==========================================================

  function handleViewProject(
    project: DMAICProject
  ): void {
    setSelectedProject(project);
    setShowForm(false);
    setEditingProject(null);
  }

  // ==========================================================
  // STATUS STYLING
  // ==========================================================

  function getStatusColor(
    status: string
  ): string {
    const normalized =
      status.toLowerCase();

    if (normalized === "completed") {
      return "#15803D";
    }

    if (
      normalized === "active" ||
      normalized === "in progress" ||
      normalized === "in-progress"
    ) {
      return "#1D4ED8";
    }

    if (normalized === "pending") {
      return "#B45309";
    }

    return "#475569";
  }

  function getStatusBackground(
    status: string
  ): string {
    const normalized =
      status.toLowerCase();

    if (normalized === "completed") {
      return "#DCFCE7";
    }

    if (
      normalized === "active" ||
      normalized === "in progress" ||
      normalized === "in-progress"
    ) {
      return "#DBEAFE";
    }

    if (normalized === "pending") {
      return "#FEF3C7";
    }

    return "#F1F5F9";
  }

  // ==========================================================
  // PHASE STATUS
  // ==========================================================

  function getPhaseStatus(
    value: string
  ): string {
    return value.trim()
      ? "Defined"
      : "Pending";
  }

  function getPhaseColor(
    value: string
  ): string {
    return value.trim()
      ? "#15803D"
      : "#64748B";
  }

  function getPhaseBackground(
    value: string
  ): string {
    return value.trim()
      ? "#DCFCE7"
      : "#F1F5F9";
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          background: "#F8FAFC",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#0F172A",
            fontSize: "34px",
            fontWeight: 800,
          }}
        >
          DMAIC Dashboard
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "14px",
            marginTop: "8px",
          }}
        >
          Loading DMAIC projects...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        background: "#F8FAFC",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* ======================================================
          PAGE HEADER
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
          <h1
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "34px",
              fontWeight: 800,
              letterSpacing: "-0.7px",
            }}
          >
            DMAIC Dashboard
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Manage Lean Six Sigma improvement
            projects across Define, Measure, Analyze,
            Improve and Control.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={loadDMAICProjects}
            style={{
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              padding: "10px 16px",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            style={{
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              padding: "10px 17px",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow:
                "0 4px 12px rgba(37, 99, 235, 0.22)",
            }}
          >
            + Create DMAIC Project
          </button>
        </div>
      </div>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "13px 16px",
            borderRadius: "9px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            marginBottom: "20px",
            padding: "13px 16px",
            borderRadius: "9px",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#15803D",
            fontSize: "13px",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            background: "#DBEAFE",
            border: "1px solid #BFDBFE",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#1E40AF",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            TOTAL PROJECTS
          </div>

          <div
            style={{
              color: "#1E3A8A",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {totalProjects}
          </div>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            border: "1px solid #BBF7D0",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#166534",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            COMPLETED
          </div>

          <div
            style={{
              color: "#15803D",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {completedProjects}
          </div>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FDE68A",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#92400E",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            ACTIVE
          </div>

          <div
            style={{
              color: "#B45309",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {activeProjects}
          </div>
        </div>
      </div>

      {/* ======================================================
          PROJECT TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 24px rgba(15, 23, 42, 0.06)",
          overflowX: "auto",
          boxSizing: "border-box",
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
              fontSize: "21px",
              fontWeight: 800,
            }}
          >
            DMAIC Projects
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            View, manage and monitor all DMAIC
            improvement projects.
          </p>
        </div>

        {projects.length === 0 ? (
          <div
            style={{
              padding: "45px 20px",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px dashed #CBD5E1",
            }}
          >
            <div
              style={{
                fontSize: "35px",
                marginBottom: "10px",
              }}
            >
              📊
            </div>

            <strong
              style={{
                display: "block",
                color: "#334155",
                fontSize: "15px",
                marginBottom: "6px",
              }}
            >
              No DMAIC projects yet
            </strong>

            <span
              style={{
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              Click "Create DMAIC Project" to add
              your first improvement project.
            </span>
          </div>
        ) : (
          <div
            style={{
              minWidth: "1100px",
            }}
          >
            {/* TABLE HEADER */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr 1fr 1.5fr",
                gap: "10px",
                padding: "0 14px 11px",
                borderBottom:
                  "1px solid #E2E8F0",
                color: "#64748B",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              <div>Project</div>
              <div>Define</div>
              <div>Measure</div>
              <div>Analyze</div>
              <div>Improve</div>
              <div>Control</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* TABLE ROWS */}

            <div
              style={{
                display: "grid",
                gap: "9px",
                marginTop: "9px",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr 1fr 1.5fr",
                    gap: "10px",
                    alignItems: "center",
                    padding: "15px 14px",
                    background: "#F8FAFC",
                    borderRadius: "10px",
                    border:
                      "1px solid #F1F5F9",
                  }}
                >
                  {/* PROJECT */}

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        color: "#0F172A",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={project.project_name}
                    >
                      {project.project_name}
                    </strong>

                    <div
                      style={{
                        marginTop: "4px",
                        color: "#64748B",
                        fontSize: "10px",
                      }}
                    >
                      Project #{project.id}
                    </div>

                    {project.improvement_percentage !==
                      null && (
                      <div
                        style={{
                          marginTop: "4px",
                          color: "#16A34A",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        Improvement:{" "}
                        {project.improvement_percentage}%
                      </div>
                    )}
                  </div>

                  {/* DEFINE */}

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 7px",
                        borderRadius: "6px",
                        background:
                          getPhaseBackground(
                            project.define
                          ),
                        color:
                          getPhaseColor(
                            project.define
                          ),
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {getPhaseStatus(
                        project.define
                      )}
                    </span>
                  </div>

                  {/* MEASURE */}

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 7px",
                        borderRadius: "6px",
                        background:
                          getPhaseBackground(
                            project.measure
                          ),
                        color:
                          getPhaseColor(
                            project.measure
                          ),
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {getPhaseStatus(
                        project.measure
                      )}
                    </span>
                  </div>

                  {/* ANALYZE */}

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 7px",
                        borderRadius: "6px",
                        background:
                          getPhaseBackground(
                            project.analyze
                          ),
                        color:
                          getPhaseColor(
                            project.analyze
                          ),
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {getPhaseStatus(
                        project.analyze
                      )}
                    </span>
                  </div>

                  {/* IMPROVE */}

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 7px",
                        borderRadius: "6px",
                        background:
                          getPhaseBackground(
                            project.improve
                          ),
                        color:
                          getPhaseColor(
                            project.improve
                          ),
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {getPhaseStatus(
                        project.improve
                      )}
                    </span>
                  </div>

                  {/* CONTROL */}

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 7px",
                        borderRadius: "6px",
                        background:
                          getPhaseBackground(
                            project.control
                          ),
                        color:
                          getPhaseColor(
                            project.control
                          ),
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {getPhaseStatus(
                        project.control
                      )}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 9px",
                        borderRadius: "7px",
                        background:
                          getStatusBackground(
                            project.status
                          ),
                        color:
                          getStatusColor(
                            project.status
                          ),
                        fontSize: "10px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleViewProject(project)
                      }
                      style={{
                        border: "1px solid #CBD5E1",
                        background: "#FFFFFF",
                        color: "#334155",
                        padding: "6px 9px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(project)
                      }
                      style={{
                        border: "none",
                        background: "#DBEAFE",
                        color: "#1D4ED8",
                        padding: "6px 9px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId === project.id
                      }
                      onClick={() =>
                        handleDelete(project)
                      }
                      style={{
                        border: "none",
                        background: "#FEE2E2",
                        color: "#B91C1C",
                        padding: "6px 9px",
                        borderRadius: "6px",
                        cursor:
                          deletingId === project.id
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "10px",
                        fontWeight: 700,
                        opacity:
                          deletingId === project.id
                            ? 0.6
                            : 1,
                      }}
                    >
                      {deletingId === project.id
                        ? "..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          SELECTED PROJECT DETAILS
      ====================================================== */}

      {selectedProject && (
        <div
          style={{
            marginTop: "25px",
            background: "#FFFFFF",
            padding: "26px",
            borderRadius: "16px",
            boxShadow:
              "0 8px 24px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "22px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                DMAIC Project #{selectedProject.id}
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: "23px",
                  fontWeight: 800,
                }}
              >
                {selectedProject.project_name}
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  openEditForm(selectedProject)
                }
                style={{
                  border: "none",
                  background: "#DBEAFE",
                  color: "#1D4ED8",
                  padding: "9px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Edit Project
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedProject(null)
                }
                style={{
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#475569",
                  padding: "9px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Close
              </button>
            </div>
          </div>

          {/* STATUS + IMPROVEMENT */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "22px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background:
                  getStatusBackground(
                    selectedProject.status
                  ),
                color:
                  getStatusColor(
                    selectedProject.status
                  ),
                padding: "7px 11px",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {selectedProject.status}
            </span>

            {selectedProject.improvement_percentage !==
              null && (
              <span
                style={{
                  background: "#DCFCE7",
                  color: "#15803D",
                  padding: "7px 11px",
                  borderRadius: "7px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Improvement:{" "}
                {
                  selectedProject.improvement_percentage
                }
                %
              </span>
            )}
          </div>

          {/* PHASE DETAILS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "15px",
            }}
          >
            <PhaseCard
              title="Define"
              content={selectedProject.define}
              color="#2563EB"
              background="#EFF6FF"
            />

            <PhaseCard
              title="Measure"
              content={selectedProject.measure}
              color="#16A34A"
              background="#F0FDF4"
            />

            <PhaseCard
              title="Analyze"
              content={selectedProject.analyze}
              color="#EA580C"
              background="#FFF7ED"
            />

            <PhaseCard
              title="Improve"
              content={selectedProject.improve}
              color="#7C3AED"
              background="#F5F3FF"
            />

            <PhaseCard
              title="Control"
              content={selectedProject.control}
              color="#0F766E"
              background="#F0FDFA"
            />
          </div>
        </div>
      )}

      {/* ======================================================
          METHODOLOGY
      ====================================================== */}

      <div
        style={{
          marginTop: "25px",
          background: "#FFFFFF",
          padding: "26px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0F172A",
            fontSize: "21px",
            fontWeight: 800,
            marginBottom: "18px",
          }}
        >
          DMAIC Methodology
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "13px",
          }}
        >
          <MethodologyCard
            title="Define"
            text="Identify the business problem, customer requirements and project objectives."
            color="#1D4ED8"
            background="#EFF6FF"
          />

          <MethodologyCard
            title="Measure"
            text="Collect reliable process data and establish the current baseline."
            color="#15803D"
            background="#F0FDF4"
          />

          <MethodologyCard
            title="Analyze"
            text="Identify root causes and determine why process problems occur."
            color="#C2410C"
            background="#FFF7ED"
          />

          <MethodologyCard
            title="Improve"
            text="Implement solutions that address identified root causes."
            color="#7C3AED"
            background="#F5F3FF"
          />

          <MethodologyCard
            title="Control"
            text="Maintain improvements and monitor long-term process performance."
            color="#0F766E"
            background="#F0FDFA"
          />
        </div>
      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 2000,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              maxHeight: "92vh",
              overflowY: "auto",
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow:
                "0 25px 60px rgba(15, 23, 42, 0.25)",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                padding: "22px 25px",
                borderBottom:
                  "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#0F172A",
                    fontSize: "21px",
                    fontWeight: 800,
                  }}
                >
                  {editingProject
                    ? "Edit DMAIC Project"
                    : "Create DMAIC Project"}
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748B",
                    fontSize: "12px",
                  }}
                >
                  {editingProject
                    ? "Update the selected improvement project."
                    : "Create a new Lean Six Sigma improvement project."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
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

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              style={{
                padding: "25px",
              }}
            >
              {/* PROJECT NAME */}

              <FormField
                label="Project Name"
                required
              >
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(event) =>
                    handleInputChange(
                      "project_name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Supplier Lead Time Reduction"
                  style={inputStyle}
                />
              </FormField>

              {/* DEFINE */}

              <FormField
                label="Define"
                required
              >
                <textarea
                  value={formData.define}
                  onChange={(event) =>
                    handleInputChange(
                      "define",
                      event.target.value
                    )
                  }
                  placeholder="Describe the business problem and project objective..."
                  rows={3}
                  style={textareaStyle}
                />
              </FormField>

              {/* MEASURE */}

              <FormField
                label="Measure"
                required
              >
                <textarea
                  value={formData.measure}
                  onChange={(event) =>
                    handleInputChange(
                      "measure",
                      event.target.value
                    )
                  }
                  placeholder="Describe the baseline measurements and process data..."
                  rows={3}
                  style={textareaStyle}
                />
              </FormField>

              {/* ANALYZE */}

              <FormField
                label="Analyze"
                required
              >
                <textarea
                  value={formData.analyze}
                  onChange={(event) =>
                    handleInputChange(
                      "analyze",
                      event.target.value
                    )
                  }
                  placeholder="Describe the root cause analysis..."
                  rows={3}
                  style={textareaStyle}
                />
              </FormField>

              {/* IMPROVE */}

              <FormField
                label="Improve"
                required
              >
                <textarea
                  value={formData.improve}
                  onChange={(event) =>
                    handleInputChange(
                      "improve",
                      event.target.value
                    )
                  }
                  placeholder="Describe the improvement actions and solutions..."
                  rows={3}
                  style={textareaStyle}
                />
              </FormField>

              {/* CONTROL */}

              <FormField
                label="Control"
                required
              >
                <textarea
                  value={formData.control}
                  onChange={(event) =>
                    handleInputChange(
                      "control",
                      event.target.value
                    )
                  }
                  placeholder="Describe how the improvement will be maintained..."
                  rows={3}
                  style={textareaStyle}
                />
              </FormField>

              {/* BOTTOM ROW */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                }}
              >
                {/* IMPROVEMENT */}

                <FormField label="Improvement Percentage">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      formData.improvement_percentage
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "improvement_percentage",
                        event.target.value
                      )
                    }
                    placeholder="e.g. 22"
                    style={inputStyle}
                  />
                </FormField>

                {/* STATUS */}

                <FormField
                  label="Status"
                  required
                >
                  <select
                    value={formData.status}
                    onChange={(event) =>
                      handleInputChange(
                        "status",
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </FormField>
              </div>

              {/* FORM ERROR */}

              {error && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "11px 14px",
                    background: "#FEF2F2",
                    border:
                      "1px solid #FECACA",
                    borderRadius: "8px",
                    color: "#B91C1C",
                    fontSize: "12px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* FORM ACTIONS */}

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
                  onClick={closeForm}
                  disabled={saving}
                  style={{
                    border:
                      "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    color: "#475569",
                    padding: "10px 17px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    border: "none",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingProject
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================================
// PHASE CARD
// ==========================================================

type PhaseCardProps = {
  title: string;
  content: string;
  color: string;
  background: string;
};

function PhaseCard({
  title,
  content,
  color,
  background,
}: PhaseCardProps) {
  return (
    <div
      style={{
        background,
        borderRadius: "11px",
        padding: "18px",
        border: `1px solid ${color}22`,
      }}
    >
      <div
        style={{
          color,
          fontSize: "13px",
          fontWeight: 800,
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#475569",
          fontSize: "12px",
          lineHeight: 1.6,
        }}
      >
        {content}
      </div>
    </div>
  );
}

// ==========================================================
// METHODOLOGY CARD
// ==========================================================

type MethodologyCardProps = {
  title: string;
  text: string;
  color: string;
  background: string;
};

function MethodologyCard({
  title,
  text,
  color,
  background,
}: MethodologyCardProps) {
  return (
    <div
      style={{
        background,
        borderRadius: "10px",
        padding: "17px",
      }}
    >
      <strong
        style={{
          color,
          fontSize: "14px",
        }}
      >
        {title}
      </strong>

      <p
        style={{
          color: "#64748B",
          fontSize: "11px",
          lineHeight: 1.5,
          margin: "7px 0 0",
        }}
      >
        {text}
      </p>
    </div>
  );
}

// ==========================================================
// FORM FIELD
// ==========================================================

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div
      style={{
        marginBottom: "17px",
      }}
    >
      <label
        style={{
          display: "block",
          color: "#334155",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "7px",
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: "#DC2626",
              marginLeft: "3px",
            }}
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ==========================================================
// INPUT STYLE
// ==========================================================

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  outline: "none",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "12px",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  outline: "none",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "12px",
  lineHeight: 1.5,
  resize: "vertical",
  boxSizing: "border-box",
};