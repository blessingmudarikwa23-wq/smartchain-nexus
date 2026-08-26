import { useEffect, useMemo, useState } from "react";

const API_URL =
  "http://localhost:8000/artificial-intelligence/intelligent-recommendations";

/* ============================================================
   ICONS
============================================================ */

const Icon = ({ children, size = 20 }) => (
  <span
    style={{
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);

const BotIcon = ({ size = 22 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="6" width="16" height="13" rx="3" />
      <path d="M12 2v4" />
      <path d="M8 12h.01" />
      <path d="M16 12h.01" />
      <path d="M8 16h8" />
    </svg>
  </Icon>
);

const SearchIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  </Icon>
);

const FilterIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </svg>
  </Icon>
);

const PlusIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  </Icon>
);

const EditIcon = ({ size = 17 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  </Icon>
);

const DeleteIcon = ({ size = 17 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  </Icon>
);

const MoreIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  </Icon>
);

const LightbulbIcon = ({ size = 22 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5A7 7 0 1 1 15.5 14.5c-.8.7-1.5 1.6-1.7 2.5h-3.6c-.2-.9-.9-1.8-1.7-2.5Z" />
    </svg>
  </Icon>
);

const CheckIcon = ({ size = 22 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  </Icon>
);

const ClockIcon = ({ size = 22 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  </Icon>
);

const CloseIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  </Icon>
);

/* ============================================================
   COMPONENT
============================================================ */

export default function IntelligentRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [formData, setFormData] = useState({
    title: "",
    recommendation: "",
    category: "",
    status: "Active",
  });

  /* ==========================================================
     GET RECOMMENDATIONS
  ========================================================== */

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load recommendations (${response.status})`
        );
      }

      const data = await response.json();

      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Intelligent Recommendations Error:", err);

      setError(
        "Unable to load intelligent recommendations. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  /* ==========================================================
     FORM INPUT
  ========================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================================
     CREATE
  ========================================================== */

  const handleCreate = () => {
    setEditingId(null);

    setFormData({
      title: "",
      recommendation: "",
      category: "",
      status: "Active",
    });

    setShowForm(true);
    setError("");
  };

  /* ==========================================================
     EDIT
  ========================================================== */

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      recommendation: item.recommendation || "",
      category: item.category || "",
      status: item.status || "Active",
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     CREATE / UPDATE
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.recommendation.trim() ||
      !formData.category.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${editingId ? "update" : "create"} recommendation`
        );
      }

      setShowForm(false);
      setEditingId(null);

      setFormData({
        title: "",
        recommendation: "",
        category: "",
        status: "Active",
      });

      await fetchRecommendations();
    } catch (err) {
      console.error("Save Recommendation Error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recommendation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete intelligent recommendation."
        );
      }

      await fetchRecommendations();
    } catch (err) {
      console.error("Delete Recommendation Error:", err);
      setError(err.message);
    }
  };

  /* ==========================================================
     CANCEL
  ========================================================== */

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      title: "",
      recommendation: "",
      category: "",
      status: "Active",
    });

    setError("");
  };

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalRecommendations = recommendations.length;

  const activeRecommendations = recommendations.filter(
    (item) => item.status?.toLowerCase() === "active"
  ).length;

  const pendingRecommendations = recommendations.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  /* ==========================================================
     SEARCH + FILTER + SORT
  ========================================================== */

  const filteredRecommendations = useMemo(() => {
    let result = [...recommendations];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((item) => {
        return (
          item.title?.toLowerCase().includes(search) ||
          item.recommendation?.toLowerCase().includes(search) ||
          item.category?.toLowerCase().includes(search) ||
          item.status?.toLowerCase().includes(search)
        );
      });
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (item) =>
          item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (sortOrder === "A-Z") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }

    if (sortOrder === "Z-A") {
      result.sort((a, b) =>
        (b.title || "").localeCompare(a.title || "")
      );
    }

    if (sortOrder === "Newest First") {
      result.reverse();
    }

    return result;
  }, [recommendations, searchTerm, statusFilter, sortOrder]);

  /* ==========================================================
     STATUS BADGE
  ========================================================== */

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "active") {
      return {
        background: "#E8F8F0",
        color: "#059669",
        dot: "#10B981",
      };
    }

    if (value === "pending") {
      return {
        background: "#FFF7E6",
        color: "#D97706",
        dot: "#F59E0B",
      };
    }

    if (value === "implemented") {
      return {
        background: "#E8F0FF",
        color: "#2563EB",
        dot: "#3B82F6",
      };
    }

    if (value === "rejected") {
      return {
        background: "#FEECEC",
        color: "#DC2626",
        dot: "#EF4444",
      };
    }

    return {
      background: "#F1F5F9",
      color: "#475569",
      dot: "#64748B",
    };
  };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "34px",
        boxSizing: "border-box",
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
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#E8F0FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 5px 15px rgba(37, 99, 235, 0.10)",
            }}
          >
            <BotIcon size={31} />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                lineHeight: "1.15",
                fontWeight: "750",
                color: "#0F172A",
                letterSpacing: "-0.8px",
              }}
            >
              Intelligent Recommendations
            </h1>

            <p
              style={{
                margin: "7px 0 0",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              AI-powered recommendations for smarter business decisions
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "13px 20px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            boxShadow: "0 6px 14px rgba(37, 99, 235, 0.20)",
          }}
        >
          <PlusIcon size={18} />
          Add Recommendation
        </button>
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
            padding: "13px 16px",
            borderRadius: "10px",
            marginBottom: "22px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        {/* TOTAL */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E6EBF2",
            borderRadius: "14px",
            padding: "20px",
            minHeight: "130px",
            boxSizing: "border-box",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "11px",
                background: "#E8F0FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LightbulbIcon size={23} />
            </div>

            <span
              style={{
                color: "#2563EB",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              AI
            </span>
          </div>

          <p
            style={{
              margin: "15px 0 4px",
              color: "#2563EB",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Total Recommendations
          </p>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "750",
              color: "#0F172A",
            }}
          >
            {loading ? "—" : totalRecommendations}
          </div>
        </div>

        {/* ACTIVE */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E6EBF2",
            borderRadius: "14px",
            padding: "20px",
            minHeight: "130px",
            boxSizing: "border-box",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: "#E8F8F0",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckIcon size={23} />
          </div>

          <p
            style={{
              margin: "15px 0 4px",
              color: "#059669",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Active Recommendations
          </p>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "750",
              color: "#0F172A",
            }}
          >
            {loading ? "—" : activeRecommendations}
          </div>
        </div>

        {/* PENDING */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E6EBF2",
            borderRadius: "14px",
            padding: "20px",
            minHeight: "130px",
            boxSizing: "border-box",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: "#FFF7E6",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClockIcon size={23} />
          </div>

          <p
            style={{
              margin: "15px 0 4px",
              color: "#D97706",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Pending Recommendations
          </p>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "750",
              color: "#0F172A",
            }}
          >
            {loading ? "—" : pendingRecommendations}
          </div>
        </div>
      </div>

      {/* ======================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E6EBF2",
          borderRadius: "14px",
          padding: "14px",
          marginBottom: "18px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            flex: "1 1 420px",
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 14px",
            boxSizing: "border-box",
            color: "#64748B",
          }}
        >
          <SearchIcon size={19} />

          <input
            type="text"
            placeholder="Search recommendations by title, category or description..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "13px",
              color: "#334155",
              background: "transparent",
            }}
          />
        </div>

        <div
          style={{
            height: "46px",
            minWidth: "160px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "0 12px",
            boxSizing: "border-box",
            color: "#475569",
          }}
        >
          <FilterIcon size={18} />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              color: "#334155",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Implemented</option>
            <option>Rejected</option>
          </select>
        </div>

        <div
          style={{
            height: "46px",
            minWidth: "160px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            boxSizing: "border-box",
          }}
        >
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              color: "#334155",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <option>Newest First</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </select>
        </div>
      </div>

      {/* ======================================================
          CREATE / EDIT FORM
      ====================================================== */}

      {showForm && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            marginBottom: "22px",
            padding: "24px",
            boxShadow: "0 8px 25px rgba(15, 23, 42, 0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "22px",
              gap: "15px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: "750",
                  color: "#0F172A",
                }}
              >
                {editingId
                  ? "Edit Recommendation"
                  : "Add Recommendation"}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  color: "#64748B",
                }}
              >
                Manage intelligent recommendations through the SmartChain
                Nexus backend.
              </p>
            </div>

            <button
              onClick={handleCancel}
              style={{
                width: "36px",
                height: "36px",
                border: "none",
                borderRadius: "9px",
                background: "#F1F5F9",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#334155",
                  }}
                >
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Inventory Optimization"
                  style={{
                    width: "100%",
                    height: "44px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#334155",
                  }}
                >
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Procurement"
                  style={{
                    width: "100%",
                    height: "44px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: "700",
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
                    height: "44px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "13px",
                    background: "#FFFFFF",
                    color: "#334155",
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Implemented">Implemented</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#334155",
                }}
              >
                Recommendation
              </label>

              <textarea
                name="recommendation"
                value={formData.recommendation}
                onChange={handleChange}
                placeholder="Enter the recommendation..."
                rows="4"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "13px",
                  resize: "vertical",
                  color: "#334155",
                }}
              />
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
                onClick={handleCancel}
                style={{
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#475569",
                  padding: "11px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
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
                  background: saving ? "#93C5FD" : "#2563EB",
                  color: "#FFFFFF",
                  padding: "11px 20px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Recommendation"
                  : "Create Recommendation"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================
          RECOMMENDATIONS TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E6EBF2",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 5px 18px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #E8EDF3",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
            }}
          >
            <div
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "9px",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BotIcon size={18} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "750",
                  color: "#0F172A",
                }}
              >
                Recommendation List
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                AI recommendations retrieved from the backend
              </p>
            </div>
          </div>

          <span
            style={{
              background: "#EFF6FF",
              color: "#2563EB",
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            {loading
              ? "Loading..."
              : `${filteredRecommendations.length} records`}
          </span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid #DBEAFE",
                borderTopColor: "#2563EB",
                borderRadius: "50%",
                margin: "0 auto 15px",
                animation: "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Loading intelligent recommendations...
            </p>
          </div>
        ) : filteredRecommendations.length === 0 ? (
          /* EMPTY */

          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
              }}
            >
              <LightbulbIcon size={28} />
            </div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#0F172A",
                fontSize: "18px",
              }}
            >
              {searchTerm || statusFilter !== "All Status"
                ? "No matching recommendations"
                : "No recommendations available"}
            </h3>

            <p
              style={{
                margin: "0 0 18px",
                fontSize: "13px",
              }}
            >
              {searchTerm || statusFilter !== "All Status"
                ? "Try changing your search or filter."
                : "Your AI recommendation database currently has no records."}
            </p>

            {!searchTerm && statusFilter === "All Status" && (
              <button
                onClick={handleCreate}
                style={{
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Add Recommendation
              </button>
            )}
          </div>
        ) : (
          /* TABLE */

          <div
            style={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "950px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F5F8FC",
                    color: "#334155",
                  }}
                >
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Recommendation
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Category
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    AI Recommendation
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecommendations.map((item, index) => {
                  const statusStyle = getStatusStyle(item.status);

                  return (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom: "1px solid #E8EDF3",
                      }}
                    >
                      {/* TITLE */}

                      <td
                        style={{
                          padding: "18px 20px",
                          minWidth: "190px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "50%",
                              background: "#E8F0FF",
                              color: "#2563EB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "750",
                              fontSize: "14px",
                              flexShrink: 0,
                            }}
                          >
                            {(item.title || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "750",
                                color: "#0F172A",
                                marginBottom: "5px",
                              }}
                            >
                              {item.title || "Untitled Recommendation"}
                            </div>

                            <span
                              style={{
                                display: "inline-block",
                                background: "#EFF6FF",
                                color: "#2563EB",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: "750",
                              }}
                            >
                              REC-{String(item.id || index + 1).padStart(
                                4,
                                "0"
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td
                        style={{
                          padding: "18px 20px",
                          minWidth: "130px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "7px 10px",
                            borderRadius: "7px",
                            background: "#F1F5F9",
                            color: "#475569",
                            fontWeight: "650",
                            fontSize: "12px",
                          }}
                        >
                          {item.category || "—"}
                        </span>
                      </td>

                      {/* RECOMMENDATION */}

                      <td
                        style={{
                          padding: "18px 20px",
                          color: "#475569",
                          fontSize: "13px",
                          lineHeight: "1.6",
                          maxWidth: "440px",
                          minWidth: "350px",
                        }}
                      >
                        {item.recommendation || "—"}
                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          padding: "18px 20px",
                          textAlign: "center",
                          minWidth: "120px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            padding: "7px 11px",
                            borderRadius: "20px",
                            background: statusStyle.background,
                            color: statusStyle.color,
                            fontSize: "11px",
                            fontWeight: "750",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: statusStyle.dot,
                            }}
                          />

                          {item.status || "Unknown"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          padding: "18px 20px",
                          textAlign: "center",
                          minWidth: "150px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {/* EDIT */}

                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit recommendation"
                            style={{
                              width: "39px",
                              height: "39px",
                              border: "1px solid #D7E5FF",
                              background: "#EFF6FF",
                              color: "#2563EB",
                              borderRadius: "9px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <EditIcon size={17} />
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete recommendation"
                            style={{
                              width: "39px",
                              height: "39px",
                              border: "1px solid #FECACA",
                              background: "#FEF2F2",
                              color: "#DC2626",
                              borderRadius: "9px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <DeleteIcon size={17} />
                          </button>

                          {/* MORE */}

                          <button
                            title="More actions"
                            style={{
                              width: "35px",
                              height: "39px",
                              border: "none",
                              background: "transparent",
                              color: "#64748B",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <MoreIcon size={18} />
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

        {/* ====================================================
            TABLE FOOTER
        ==================================================== */}

        {!loading && filteredRecommendations.length > 0 && (
          <div
            style={{
              padding: "16px 22px",
              borderTop: "1px solid #E8EDF3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            <span>
              Showing {filteredRecommendations.length} of{" "}
              {recommendations.length} recommendations
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <button
                disabled
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  color: "#CBD5E1",
                  borderRadius: "8px",
                  cursor: "not-allowed",
                }}
              >
                ‹
              </button>

              <button
                style={{
                  width: "34px",
                  height: "34px",
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: "700",
                }}
              >
                1
              </button>

              <button
                disabled
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  color: "#CBD5E1",
                  borderRadius: "8px",
                  cursor: "not-allowed",
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          button {
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease,
              background 0.15s ease;
          }

          button:not(:disabled):hover {
            transform: translateY(-1px);
          }

          input::placeholder,
          textarea::placeholder {
            color: #94A3B8;
          }
        `}
      </style>
    </div>
  );
}