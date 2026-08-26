import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:8000";

const API_URL = `${API_BASE_URL}/artificial-intelligence/natural-language-queries`;

export default function NaturalLanguageQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingQuery, setEditingQuery] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOrder, setSortOrder] = useState("Newest First");

  // ==========================================================
  // ICONS
  // ==========================================================

  const MessageIcon = ({ size = 22, color = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.8L3 21l1.8-4.5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );

  const PlusIcon = ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );

  const SearchIcon = ({ size = 19 }) => (
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );

  const FilterIcon = ({ size = 18 }) => (
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
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );

  const SortIcon = ({ size = 18 }) => (
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
      <path d="M8 6h13" />
      <path d="M8 12h9" />
      <path d="M8 18h5" />
      <path d="m3 6 2-2 2 2" />
      <path d="M5 4v16" />
    </svg>
  );

  const EditIcon = ({ size = 17 }) => (
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
  );

  const DeleteIcon = ({ size = 17 }) => (
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
  );

  const RefreshIcon = ({ size = 18 }) => (
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
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
      <path d="M20 20v-5h-5" />
    </svg>
  );

  const CheckIcon = ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );

  const ClockIcon = ({ size = 18 }) => (
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );

  const DatabaseIcon = ({ size = 20 }) => (
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
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </svg>
  );

  const CloseIcon = ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );

  // ==========================================================
  // LOAD NATURAL LANGUAGE QUERIES
  // ==========================================================

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load natural language queries (${response.status}).`
        );
      }

      const data = await response.json();

      setQueries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Natural Language Queries Error:", err);

      setError(
        err.message ||
          "Unable to connect to the Natural Language Queries service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("");
    setStatus("Active");
    setEditingQuery(null);
    setShowForm(false);
  };

  // ==========================================================
  // OPEN CREATE FORM
  // ==========================================================

  const openCreateForm = () => {
    setEditingQuery(null);
    setQuestion("");
    setAnswer("");
    setCategory("");
    setStatus("Active");
    setError("");
    setShowForm(true);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  // ==========================================================
  // CREATE QUERY
  // ==========================================================

  const createQuery = async (event) => {
    event.preventDefault();

    if (!question.trim() || !answer.trim() || !category.trim()) {
      setError("Question, answer and category are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          category: category.trim(),
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to create natural language query."
        );
      }

      const newQuery = await response.json();

      setQueries((current) => [newQuery, ...current]);

      resetForm();
    } catch (err) {
      console.error("Create Query Error:", err);

      setError(err.message || "Failed to create query.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // EDIT QUERY
  // ==========================================================

  const startEditing = (item) => {
    setEditingQuery(item);

    setQuestion(item.question || "");
    setAnswer(item.answer || "");
    setCategory(item.category || "");
    setStatus(item.status || "Active");

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // UPDATE QUERY
  // ==========================================================

  const updateQuery = async (event) => {
    event.preventDefault();

    if (!editingQuery) {
      return;
    }

    if (!question.trim() || !answer.trim() || !category.trim()) {
      setError("Question, answer and category are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/${editingQuery.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          category: category.trim(),
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to update natural language query."
        );
      }

      const updatedQuery = await response.json();

      setQueries((current) =>
        current.map((item) =>
          item.id === updatedQuery.id ? updatedQuery : item
        )
      );

      resetForm();
    } catch (err) {
      console.error("Update Query Error:", err);

      setError(err.message || "Failed to update query.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE QUERY
  // ==========================================================

  const deleteQuery = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this natural language query?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to delete natural language query."
        );
      }

      setQueries((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete Query Error:", err);

      setError(err.message || "Failed to delete query.");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // DASHBOARD METRICS
  // ==========================================================

  const totalQueries = queries.length;

  const activeQueries = queries.filter(
    (item) => item.status?.toLowerCase() === "active"
  ).length;

  const completedQueries = queries.filter(
    (item) => item.status?.toLowerCase() === "completed"
  ).length;

  const categories = new Set(
    queries.map((item) => item.category).filter(Boolean)
  ).size;

  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  const categoryOptions = useMemo(() => {
    return [
      "All Categories",
      ...Array.from(
        new Set(queries.map((item) => item.category).filter(Boolean))
      ),
    ];
  }, [queries]);

  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const filteredQueries = useMemo(() => {
    let result = [...queries];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (item) =>
          item.question?.toLowerCase().includes(search) ||
          item.answer?.toLowerCase().includes(search) ||
          item.category?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (item) =>
          item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (categoryFilter !== "All Categories") {
      result = result.filter(
        (item) => item.category === categoryFilter
      );
    }

    if (sortOrder === "Newest First") {
      result.reverse();
    }

    if (sortOrder === "Oldest First") {
      result.reverse();
    }

    return result;
  }, [
    queries,
    searchTerm,
    statusFilter,
    categoryFilter,
    sortOrder,
  ]);

  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const getStatusStyle = (queryStatus) => {
    const normalizedStatus = queryStatus?.toLowerCase();

    if (
      normalizedStatus === "completed" ||
      normalizedStatus === "active" ||
      normalizedStatus === "resolved"
    ) {
      return {
        background: "#E8F8F0",
        color: "#078A4B",
      };
    }

    if (
      normalizedStatus === "pending" ||
      normalizedStatus === "processing"
    ) {
      return {
        background: "#FFF5DC",
        color: "#B77900",
      };
    }

    return {
      background: "#EEF2F7",
      color: "#475569",
    };
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F9FC",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
          gap: "25px",
          marginBottom: "28px",
          flexWrap: "wrap",
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
              background: "linear-gradient(135deg, #6D8FF0, #86A7FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.15)",
              flexShrink: 0,
            }}
          >
            <MessageIcon size={29} />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                color: "#13233F",
                fontSize: "34px",
                fontWeight: "750",
                letterSpacing: "-0.8px",
              }}
            >
              Natural Language Queries
            </h1>

            <p
              style={{
                margin: "7px 0 0",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Ask questions and explore AI-powered supply chain insights
            </p>
          </div>
        </div>

        <button
          onClick={showForm ? resetForm : openCreateForm}
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "14px 21px",
            borderRadius: "11px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            boxShadow: "0 7px 16px rgba(37, 99, 235, 0.22)",
          }}
        >
          {showForm ? <CloseIcon size={17} /> : <PlusIcon size={18} />}

          {showForm ? "Close Form" : "New AI Query"}
        </button>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            background: "#FFF1F2",
            border: "1px solid #FECDD3",
            color: "#BE123C",
            padding: "13px 17px",
            borderRadius: "10px",
            marginBottom: "22px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span style={{ fontWeight: "800" }}>!</span>
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
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        {/* TOTAL */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5EAF2",
            borderRadius: "13px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.045)",
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
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#E9F0FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageIcon size={22} />
            </div>

            <div
              style={{
                width: "70px",
                height: "30px",
                borderBottom: "3px solid #4F8DF7",
                borderRadius: "50%",
                transform: "rotate(-5deg)",
                opacity: 0.9,
              }}
            />
          </div>

          <p
            style={{
              margin: "16px 0 5px",
              color: "#2563EB",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            Total Queries
          </p>

          <h2
            style={{
              margin: 0,
              color: "#16233D",
              fontSize: "28px",
              fontWeight: "750",
            }}
          >
            {loading ? "—" : totalQueries}
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            All AI query records
          </p>
        </div>

        {/* ACTIVE */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5EAF2",
            borderRadius: "13px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.045)",
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
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#E7F8F0",
                color: "#00A86B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon size={22} />
            </div>

            <div
              style={{
                width: "70px",
                height: "30px",
                borderBottom: "3px solid #16B879",
                borderRadius: "50%",
                transform: "rotate(5deg)",
              }}
            />
          </div>

          <p
            style={{
              margin: "16px 0 5px",
              color: "#00A86B",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            Active Queries
          </p>

          <h2
            style={{
              margin: 0,
              color: "#16233D",
              fontSize: "28px",
              fontWeight: "750",
            }}
          >
            {loading ? "—" : activeQueries}
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Currently active queries
          </p>
        </div>

        {/* COMPLETED */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5EAF2",
            borderRadius: "13px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.045)",
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
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#FFF5DC",
                color: "#F59E0B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClockIcon size={22} />
            </div>

            <div
              style={{
                width: "70px",
                height: "30px",
                borderBottom: "3px solid #F4A91B",
                borderRadius: "50%",
                transform: "rotate(-4deg)",
              }}
            />
          </div>

          <p
            style={{
              margin: "16px 0 5px",
              color: "#E38B00",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            Completed
          </p>

          <h2
            style={{
              margin: 0,
              color: "#16233D",
              fontSize: "28px",
              fontWeight: "750",
            }}
          >
            {loading ? "—" : completedQueries}
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Successfully processed
          </p>
        </div>

        {/* CATEGORIES */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5EAF2",
            borderRadius: "13px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.045)",
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
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#F3EAFE",
                color: "#7C3AED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DatabaseIcon size={22} />
            </div>

            <div
              style={{
                width: "70px",
                height: "30px",
                borderBottom: "3px solid #8B5CF6",
                borderRadius: "50%",
                transform: "rotate(4deg)",
              }}
            />
          </div>

          <p
            style={{
              margin: "16px 0 5px",
              color: "#7C3AED",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            Categories
          </p>

          <h2
            style={{
              margin: 0,
              color: "#16233D",
              fontSize: "28px",
              fontWeight: "750",
            }}
          >
            {loading ? "—" : categories}
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Query categories
          </p>
        </div>
      </div>

      {/* ======================================================
          CREATE / EDIT FORM
      ====================================================== */}

      {showForm && (
        <form
          onSubmit={editingQuery ? updateQuery : createQuery}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "28px",
            boxShadow: "0 8px 25px rgba(15,23,42,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#13233F",
                  fontSize: "20px",
                  fontWeight: "750",
                }}
              >
                {editingQuery
                  ? "Edit Natural Language Query"
                  : "Create Natural Language Query"}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Manage AI-powered questions and business responses.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "9px",
                border: "none",
                background: "#F1F5F9",
                color: "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloseIcon size={17} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Question
              </label>

              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="e.g. Which suppliers have the highest risk?"
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "9px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  color: "#0F172A",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                AI Response
              </label>

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Enter the AI-generated response..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "9px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  color: "#0F172A",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Category
              </label>

              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Inventory"
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "9px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  color: "#0F172A",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Status
              </label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "9px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  background: "#FFFFFF",
                  color: "#0F172A",
                }}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
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
              onClick={resetForm}
              style={{
                padding: "11px 19px",
                borderRadius: "9px",
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#334155",
                fontWeight: "650",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "11px 21px",
                borderRadius: "9px",
                border: "none",
                background: saving ? "#93C5FD" : "#2563EB",
                color: "#FFFFFF",
                fontWeight: "700",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : editingQuery
                ? "Update Query"
                : "Create Query"}
            </button>
          </div>
        </form>
      )}

      {/* ======================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E5EAF2",
          padding: "13px",
          marginBottom: "17px",
          display: "grid",
          gridTemplateColumns:
            "minmax(260px, 1fr) 180px 190px 180px",
          gap: "12px",
          boxShadow: "0 4px 15px rgba(15,23,42,.035)",
        }}
      >
        <div
          style={{
            height: "45px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 13px",
            gap: "10px",
            color: "#64748B",
          }}
        >
          <SearchIcon />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search questions, responses or categories..."
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
            height: "45px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            color: "#64748B",
          }}
        >
          <FilterIcon />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Resolved</option>
          </select>
        </div>

        <div
          style={{
            height: "45px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            color: "#64748B",
          }}
        >
          <DatabaseIcon size={17} />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {categoryOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div
          style={{
            height: "45px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            color: "#64748B",
          }}
        >
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* ======================================================
          QUERY LIST
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "15px",
          border: "1px solid #E5EAF2",
          overflow: "hidden",
          boxShadow: "0 5px 18px rgba(15,23,42,.045)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #E7EBF2",
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
              gap: "10px",
            }}
          >
            <div
              style={{
                color: "#2563EB",
                display: "flex",
              }}
            >
              <MessageIcon size={21} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#17233D",
                  fontSize: "18px",
                  fontWeight: "750",
                }}
              >
                AI Query History
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                Natural language questions and AI-generated responses
              </p>
            </div>
          </div>

          <button
            onClick={fetchQueries}
            disabled={loading}
            style={{
              border: "1px solid #D9E2EF",
              background: "#FFFFFF",
              color: "#475569",
              padding: "9px 13px",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "650",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshIcon size={16} />
            Refresh
          </button>
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
                width: "45px",
                height: "45px",
                margin: "0 auto 15px",
                border: "4px solid #DBEAFE",
                borderTop: "4px solid #2563EB",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                margin: 0,
                fontWeight: "650",
              }}
            >
              Loading AI queries...
            </p>
          </div>
        ) : queries.length === 0 ? (
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
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#EEF4FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
              }}
            >
              <MessageIcon size={27} />
            </div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#17233D",
              }}
            >
              No AI queries yet
            </h3>

            <p
              style={{
                margin: "0 0 20px",
                fontSize: "13px",
              }}
            >
              Create your first natural language query.
            </p>

            <button
              onClick={openCreateForm}
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
              Create AI Query
            </button>
          </div>
        ) : filteredQueries.length === 0 ? (
          /* NO FILTER RESULTS */

          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <SearchIcon size={35} />

            <h3
              style={{
                margin: "14px 0 7px",
                color: "#17233D",
              }}
            >
              No matching queries
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
              }}
            >
              Try changing your search or filters.
            </p>
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
                minWidth: "1050px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F5F8FC",
                  }}
                >
                  <th
                    style={{
                      padding: "15px 18px",
                      textAlign: "left",
                      color: "#34435B",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Question
                  </th>

                  <th
                    style={{
                      padding: "15px 18px",
                      textAlign: "left",
                      color: "#34435B",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    AI Response
                  </th>

                  <th
                    style={{
                      padding: "15px 18px",
                      textAlign: "left",
                      color: "#34435B",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Category
                  </th>

                  <th
                    style={{
                      padding: "15px 18px",
                      textAlign: "left",
                      color: "#34435B",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      padding: "15px 18px",
                      textAlign: "center",
                      color: "#34435B",
                      fontSize: "12px",
                      fontWeight: "750",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredQueries.map((item, index) => (
                  <tr
                    key={item.id || index}
                    style={{
                      borderTop: "1px solid #E7EBF2",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* QUESTION */}

                    <td
                      style={{
                        padding: "19px 18px",
                        maxWidth: "300px",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "11px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            minWidth: "36px",
                            borderRadius: "50%",
                            background: "#E9F0FF",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MessageIcon size={17} />
                        </div>

                        <div>
                          <div
                            style={{
                              color: "#17233D",
                              fontWeight: "700",
                              fontSize: "13px",
                              lineHeight: "1.45",
                            }}
                          >
                            {item.question || "Untitled question"}
                          </div>

                          <div
                            style={{
                              marginTop: "5px",
                              color: "#94A3B8",
                              fontSize: "11px",
                            }}
                          >
                            Query #{item.id || index + 1}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* AI RESPONSE */}

                    <td
                      style={{
                        padding: "19px 18px",
                        maxWidth: "390px",
                        color: "#64748B",
                        fontSize: "13px",
                        lineHeight: "1.55",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.answer || "No AI response available."}
                    </td>

                    {/* CATEGORY */}

                    <td
                      style={{
                        padding: "19px 18px",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "7px 11px",
                          borderRadius: "20px",
                          background: "#EEF2FF",
                          color: "#4338CA",
                          fontSize: "11px",
                          fontWeight: "750",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.category || "General"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td
                      style={{
                        padding: "19px 18px",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        style={{
                          ...getStatusStyle(item.status),
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 11px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "750",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "currentColor",
                          }}
                        />

                        {item.status || "Active"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td
                      style={{
                        padding: "19px 18px",
                        textAlign: "center",
                        verticalAlign: "middle",
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
                          title="Edit query"
                          onClick={() => startEditing(item)}
                          style={{
                            width: "38px",
                            height: "38px",
                            border: "1px solid #D9E6FF",
                            background: "#EEF4FF",
                            color: "#2563EB",
                            borderRadius: "9px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <EditIcon size={16} />
                        </button>

                        {/* DELETE */}

                        <button
                          title="Delete query"
                          onClick={() => deleteQuery(item.id)}
                          disabled={deletingId === item.id}
                          style={{
                            width: "38px",
                            height: "38px",
                            border: "1px solid #FFD4D4",
                            background: "#FFF0F0",
                            color: "#DC2626",
                            borderRadius: "9px",
                            cursor:
                              deletingId === item.id
                                ? "not-allowed"
                                : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity:
                              deletingId === item.id ? 0.55 : 1,
                          }}
                        >
                          <DeleteIcon size={16} />
                        </button>

                        {/* MORE */}

                        <button
                          title="More options"
                          style={{
                            width: "35px",
                            height: "38px",
                            border: "none",
                            background: "transparent",
                            color: "#64748B",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                        >
                          ⋮
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ====================================================
            TABLE FOOTER
        ==================================================== */}

        {!loading && queries.length > 0 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #E7EBF2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            <span>
              Showing {filteredQueries.length} of {queries.length} AI
              queries
            </span>

            <span
              style={{
                background: "#EEF4FF",
                color: "#2563EB",
                padding: "7px 12px",
                borderRadius: "20px",
                fontWeight: "700",
              }}
            >
              {filteredQueries.length} Records
            </span>
          </div>
        )}
      </div>

      {/* ======================================================
          ANIMATION
      ====================================================== */}

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

          button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          input::placeholder,
          textarea::placeholder {
            color: #94A3B8;
          }

          @media (max-width: 900px) {
            .natural-language-query-filter {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}