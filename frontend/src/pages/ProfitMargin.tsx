import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";


// ==========================================================
// ICON COMPONENT
// ==========================================================

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    chart: (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-5 3 3 5-7" />
      </svg>
    ),

    plus: (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),

    search: (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    ),

    filter: (
      <svg {...common}>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    ),

    sort: (
      <svg {...common}>
        <path d="M8 6h13" />
        <path d="M8 12h9" />
        <path d="M8 18h5" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </svg>
    ),

    edit: (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    ),

    trash: (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    ),

    chevronDown: (
      <svg {...common}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),

    chevronLeft: (
      <svg {...common}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    ),

    chevronRight: (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),

    money: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M16 8h-5a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4H8" />
        <path d="M12 6v2" />
        <path d="M12 16v2" />
      </svg>
    ),

    cost: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </svg>
    ),

    profit: (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-6" />
      </svg>
    ),

    percent: (
      <svg {...common}>
        <path d="M19 5 5 19" />
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  };

  return icons[name] || null;
}


// ==========================================================
// FORMAT CURRENCY
// ==========================================================

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}


// ==========================================================
// FORMAT PERCENTAGE
// ==========================================================

function formatPercentage(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}


// ==========================================================
// PROFIT MARGIN COMPONENT
// ==========================================================

export default function ProfitMargin() {
  const [analyses, setAnalyses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("All Periods");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [showModal, setShowModal] = useState(false);
  const [editingAnalysis, setEditingAnalysis] = useState(null);

  const [formData, setFormData] = useState({
    analysis_period: "",
    total_revenue: "",
    total_cost: "",
    gross_profit: "",
    profit_margin_percentage: "",
  });

  const [saving, setSaving] = useState(false);


  // ========================================================
  // FETCH PROFIT MARGIN DATA
  // ========================================================

  const fetchProfitMargins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/sales/profit-margin`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch profit margin data (${response.status})`
        );
      }

      const data = await response.json();

      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Profit Margin API Error:", err);

      setError(
        err.message ||
          "Unable to load profit margin data."
      );
    } finally {
      setLoading(false);
    }
  };


  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {
    fetchProfitMargins();
  }, []);


  // ========================================================
  // CALCULATE KPI DATA
  // ========================================================

  const totalRevenue = useMemo(() => {
    return analyses.reduce(
      (total, item) =>
        total + Number(item.total_revenue || 0),
      0
    );
  }, [analyses]);


  const totalCost = useMemo(() => {
    return analyses.reduce(
      (total, item) =>
        total + Number(item.total_cost || 0),
      0
    );
  }, [analyses]);


  const totalGrossProfit = useMemo(() => {
    return analyses.reduce(
      (total, item) =>
        total + Number(item.gross_profit || 0),
      0
    );
  }, [analyses]);


  const averageMargin = useMemo(() => {
    if (!analyses.length) return 0;

    const total = analyses.reduce(
      (sum, item) =>
        sum +
        Number(
          item.profit_margin_percentage || 0
        ),
      0
    );

    return total / analyses.length;
  }, [analyses]);


  // ========================================================
  // PERIOD OPTIONS
  // ========================================================

  const periodOptions = useMemo(() => {
    const periods = analyses.map(
      (item) => item.analysis_period
    );

    return [...new Set(periods)];
  }, [analyses]);


  // ========================================================
  // FILTER + SEARCH + SORT
  // ========================================================

  const filteredAnalyses = useMemo(() => {
    let result = [...analyses];

    if (search.trim()) {
      const searchValue =
        search.toLowerCase();

      result = result.filter((item) =>
        String(
          item.analysis_period || ""
        )
          .toLowerCase()
          .includes(searchValue)
      );
    }

    if (periodFilter !== "All Periods") {
      result = result.filter(
        (item) =>
          item.analysis_period ===
          periodFilter
      );
    }

    if (sortOrder === "Newest First") {
      result.sort((a, b) => b.id - a.id);
    }

    if (sortOrder === "Oldest First") {
      result.sort((a, b) => a.id - b.id);
    }

    if (sortOrder === "Highest Margin") {
      result.sort(
        (a, b) =>
          Number(
            b.profit_margin_percentage || 0
          ) -
          Number(
            a.profit_margin_percentage || 0
          )
      );
    }

    if (sortOrder === "Lowest Margin") {
      result.sort(
        (a, b) =>
          Number(
            a.profit_margin_percentage || 0
          ) -
          Number(
            b.profit_margin_percentage || 0
          )
      );
    }

    return result;
  }, [
    analyses,
    search,
    periodFilter,
    sortOrder,
  ]);


  // ========================================================
  // FORM HANDLING
  // ========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ========================================================
  // OPEN CREATE MODAL
  // ========================================================

  const openCreateModal = () => {
    setEditingAnalysis(null);

    setFormData({
      analysis_period: "",
      total_revenue: "",
      total_cost: "",
      gross_profit: "",
      profit_margin_percentage: "",
    });

    setShowModal(true);
  };


  // ========================================================
  // OPEN EDIT MODAL
  // ========================================================

  const openEditModal = (analysis) => {
    setEditingAnalysis(analysis);

    setFormData({
      analysis_period:
        analysis.analysis_period || "",

      total_revenue:
        analysis.total_revenue ?? "",

      total_cost:
        analysis.total_cost ?? "",

      gross_profit:
        analysis.gross_profit ?? "",

      profit_margin_percentage:
        analysis.profit_margin_percentage ?? "",
    });

    setShowModal(true);
  };


  // ========================================================
  // SUBMIT CREATE / UPDATE
  // ========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        analysis_period:
          formData.analysis_period,

        total_revenue:
          Number(formData.total_revenue) || 0,

        total_cost:
          Number(formData.total_cost) || 0,

        gross_profit:
          Number(formData.gross_profit) || 0,

        profit_margin_percentage:
          Number(
            formData.profit_margin_percentage
          ) || 0,
      };

      const url = editingAnalysis
        ? `${API_BASE_URL}/sales/profit-margin/${editingAnalysis.id}`
        : `${API_BASE_URL}/sales/profit-margin`;

      const method = editingAnalysis
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
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to save profit margin analysis."
        );
      }

      setShowModal(false);

      setEditingAnalysis(null);

      await fetchProfitMargins();
    } catch (err) {
      console.error(
        "Save Profit Margin Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save profit margin analysis."
      );
    } finally {
      setSaving(false);
    }
  };


  // ========================================================
  // DELETE ANALYSIS
  // ========================================================

  const handleDelete = async (analysisId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profit margin analysis?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/sales/profit-margin/${analysisId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete analysis."
        );
      }

      await fetchProfitMargins();
    } catch (err) {
      console.error(
        "Delete Profit Margin Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete analysis."
      );
    }
  };


  // ========================================================
  // MARGIN BADGE
  // ========================================================

  const getMarginStyle = (margin) => {
    const value = Number(margin || 0);

    if (value >= 30) {
      return {
        background: "#DCFCE7",
        color: "#15803D",
      };
    }

    if (value >= 20) {
      return {
        background: "#FEF3C7",
        color: "#B45309",
      };
    }

    return {
      background: "#FEE2E2",
      color: "#B91C1C",
    };
  };


  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "30px",
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
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#7C3AED,#A78BFA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow:
                "0 8px 20px rgba(124,58,237,.20)",
            }}
          >
            <Icon name="chart" size={29} />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                lineHeight: 1.1,
                fontWeight: "750",
                color: "#0F172A",
                letterSpacing: "-1px",
              }}
            >
              Profit Margin
            </h1>

            <p
              style={{
                margin:
                  "8px 0 0",
                color: "#64748B",
                fontSize: "15px",
              }}
            >
              Analyze profitability and monitor
              financial performance
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            border: "none",
            background:
              "linear-gradient(135deg,#2563EB,#1D4ED8)",
            color: "#ffffff",
            padding:
              "14px 20px",
            borderRadius: "11px",
            fontSize: "15px",
            fontWeight: "650",
            cursor: "pointer",
            boxShadow:
              "0 8px 18px rgba(37,99,235,.22)",
          }}
        >
          <Icon name="plus" size={19} />
          Add Analysis
        </button>
      </div>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border:
              "1px solid #FECACA",
            color: "#B91C1C",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}


      {/* ====================================================
          KPI CARDS
      ==================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        {/* TOTAL REVENUE */}

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "13px",
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 5px 16px rgba(15,23,42,.05)",
            minHeight: "110px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#2563EB",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Total Revenue
              </p>

              <h2
                style={{
                  margin:
                    "10px 0 0",
                  fontSize: "28px",
                  color: "#0F172A",
                }}
              >
                {loading
                  ? "..."
                  : formatCurrency(
                      totalRevenue
                    )}
              </h2>
            </div>

            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#DBEAFE",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="money" size={23} />
            </div>
          </div>

          <p
            style={{
              margin:
                "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Total revenue analyzed
          </p>
        </div>


        {/* TOTAL COST */}

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "13px",
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 5px 16px rgba(15,23,42,.05)",
            minHeight: "110px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#EA580C",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Total Cost
              </p>

              <h2
                style={{
                  margin:
                    "10px 0 0",
                  fontSize: "28px",
                  color: "#0F172A",
                }}
              >
                {loading
                  ? "..."
                  : formatCurrency(
                      totalCost
                    )}
              </h2>
            </div>

            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#FFEDD5",
                color: "#EA580C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="cost" size={23} />
            </div>
          </div>

          <p
            style={{
              margin:
                "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Total operating cost
          </p>
        </div>


        {/* GROSS PROFIT */}

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "13px",
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 5px 16px rgba(15,23,42,.05)",
            minHeight: "110px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#16A34A",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Gross Profit
              </p>

              <h2
                style={{
                  margin:
                    "10px 0 0",
                  fontSize: "28px",
                  color: "#0F172A",
                }}
              >
                {loading
                  ? "..."
                  : formatCurrency(
                      totalGrossProfit
                    )}
              </h2>
            </div>

            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="profit" size={23} />
            </div>
          </div>

          <p
            style={{
              margin:
                "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Revenue less total cost
          </p>
        </div>


        {/* AVERAGE MARGIN */}

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "13px",
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 5px 16px rgba(15,23,42,.05)",
            minHeight: "110px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#9333EA",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Average Margin
              </p>

              <h2
                style={{
                  margin:
                    "10px 0 0",
                  fontSize: "28px",
                  color: "#0F172A",
                }}
              >
                {loading
                  ? "..."
                  : formatPercentage(
                      averageMargin
                    )}
              </h2>
            </div>

            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#F3E8FF",
                color: "#9333EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="percent" size={23} />
            </div>
          </div>

          <p
            style={{
              margin:
                "14px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Average across analyses
          </p>
        </div>
      </div>


      {/* ====================================================
          SEARCH + FILTER BAR
      ==================================================== */}

      <div
        style={{
          background: "#ffffff",
          padding: "10px",
          borderRadius: "13px",
          border:
            "1px solid #E2E8F0",
          boxShadow:
            "0 5px 16px rgba(15,23,42,.04)",
          display: "grid",
          gridTemplateColumns:
            "minmax(260px,1fr) 180px 190px",
          gap: "10px",
          marginBottom: "18px",
        }}
      >

        {/* SEARCH */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border:
              "1px solid #E2E8F0",
            borderRadius: "10px",
            padding:
              "0 14px",
            minHeight: "44px",
          }}
        >
          <span
            style={{
              color: "#64748B",
            }}
          >
            <Icon
              name="search"
              size={19}
            />
          </span>

          <input
            type="text"
            placeholder="Search analysis periods..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              color: "#0F172A",
              background:
                "transparent",
            }}
          />
        </div>


        {/* PERIOD FILTER */}

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            border:
              "1px solid #E2E8F0",
            borderRadius: "10px",
            minHeight: "44px",
          }}
        >
          <span
            style={{
              marginLeft: "12px",
              color: "#64748B",
            }}
          >
            <Icon
              name="filter"
              size={18}
            />
          </span>

          <select
            value={periodFilter}
            onChange={(event) =>
              setPeriodFilter(
                event.target.value
              )
            }
            style={{
              appearance: "none",
              border: "none",
              outline: "none",
              background:
                "transparent",
              padding:
                "0 34px 0 9px",
              width: "100%",
              height: "44px",
              fontSize: "14px",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <option>
              All Periods
            </option>

            {periodOptions.map(
              (period) => (
                <option
                  key={period}
                  value={period}
                >
                  {period}
                </option>
              )
            )}
          </select>

          <span
            style={{
              position: "absolute",
              right: "10px",
              pointerEvents:
                "none",
              color: "#64748B",
            }}
          >
            <Icon
              name="chevronDown"
              size={16}
            />
          </span>
        </div>


        {/* SORT */}

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            border:
              "1px solid #E2E8F0",
            borderRadius: "10px",
            minHeight: "44px",
          }}
        >
          <span
            style={{
              marginLeft: "12px",
              color: "#64748B",
            }}
          >
            <Icon
              name="sort"
              size={18}
            />
          </span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
            style={{
              appearance: "none",
              border: "none",
              outline: "none",
              background:
                "transparent",
              padding:
                "0 34px 0 9px",
              width: "100%",
              height: "44px",
              fontSize: "14px",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <option>
              Newest First
            </option>

            <option>
              Oldest First
            </option>

            <option>
              Highest Margin
            </option>

            <option>
              Lowest Margin
            </option>
          </select>

          <span
            style={{
              position: "absolute",
              right: "10px",
              pointerEvents:
                "none",
              color: "#64748B",
            }}
          >
            <Icon
              name="chevronDown"
              size={16}
            />
          </span>
        </div>
      </div>


      {/* ====================================================
          TABLE CARD
      ==================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "13px",
          border:
            "1px solid #E2E8F0",
          boxShadow:
            "0 5px 18px rgba(15,23,42,.05)",
          overflow: "hidden",
        }}
      >

        {/* TABLE TITLE */}

        <div
          style={{
            padding:
              "20px 22px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom:
              "1px solid #EEF2F7",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "#EEF2FF",
              color: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name="chart"
              size={18}
            />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "700",
              color: "#0F172A",
            }}
          >
            Profit Margin Analysis
          </h2>
        </div>


        {/* TABLE */}

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "850px",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#F8FAFC",
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                <th
                  style={{
                    padding:
                      "17px 20px",
                    textAlign:
                      "left",
                    fontWeight:
                      "650",
                  }}
                >
                  Analysis Period
                </th>

                <th
                  style={{
                    padding:
                      "17px 20px",
                    textAlign:
                      "right",
                    fontWeight:
                      "650",
                  }}
                >
                  Revenue
                </th>

                <th
                  style={{
                    padding:
                      "17px 20px",
                    textAlign:
                      "right",
                    fontWeight:
                      "650",
                  }}
                >
                  Cost
                </th>

                <th
                  style={{
                    padding:
                      "17px 20px",
                    textAlign:
                      "right",
                    fontWeight:
                      "650",
                  }}
                >
                  Gross Profit
                </th>

                <th
                  style={{
                    padding:
                      "17px 20px",
                    textAlign:
                      "center",
                    fontWeight:
                      "650",
                  }}
                >
                  Profit Margin
                </th>

                <th
                  style={{
                    padding:
                      "17px 20px",
                    textAlign:
                      "center",
                    fontWeight:
                      "650",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>


            <tbody>

              {/* LOADING */}

              {loading && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding:
                        "50px",
                      textAlign:
                        "center",
                      color: "#64748B",
                    }}
                  >
                    Loading profit margin
                    analyses...
                  </td>
                </tr>
              )}


              {/* EMPTY */}

              {!loading &&
                filteredAnalyses.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding:
                          "55px",
                        textAlign:
                          "center",
                        color: "#64748B",
                      }}
                    >
                      No profit margin
                      analyses found.
                    </td>
                  </tr>
                )}


              {/* DATA */}

              {!loading &&
                filteredAnalyses.map(
                  (item) => {
                    const marginStyle =
                      getMarginStyle(
                        item.profit_margin_percentage
                      );

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom:
                            "1px solid #EEF2F7",
                          transition:
                            "background .2s",
                        }}
                      >

                        {/* PERIOD */}

                        <td
                          style={{
                            padding:
                              "19px 20px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  "40px",
                                height:
                                  "40px",
                                borderRadius:
                                  "50%",
                                background:
                                  "#EEF2FF",
                                color:
                                  "#4F46E5",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight:
                                  "700",
                              }}
                            >
                              {String(
                                item.analysis_period ||
                                  "A"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <div
                                style={{
                                  fontWeight:
                                    "650",
                                  color:
                                    "#0F172A",
                                  marginBottom:
                                    "5px",
                                }}
                              >
                                {
                                  item.analysis_period
                                }
                              </div>

                              <span
                                style={{
                                  fontSize:
                                    "11px",
                                  padding:
                                    "4px 8px",
                                  borderRadius:
                                    "6px",
                                  background:
                                    "#EFF6FF",
                                  color:
                                    "#2563EB",
                                  fontWeight:
                                    "600",
                                }}
                              >
                                PM-
                                {String(
                                  item.id
                                ).padStart(
                                  4,
                                  "0"
                                )}
                              </span>
                            </div>
                          </div>
                        </td>


                        {/* REVENUE */}

                        <td
                          style={{
                            padding:
                              "19px 20px",
                            textAlign:
                              "right",
                            fontWeight:
                              "600",
                            color:
                              "#334155",
                          }}
                        >
                          {formatCurrency(
                            item.total_revenue
                          )}
                        </td>


                        {/* COST */}

                        <td
                          style={{
                            padding:
                              "19px 20px",
                            textAlign:
                              "right",
                            color:
                              "#475569",
                          }}
                        >
                          {formatCurrency(
                            item.total_cost
                          )}
                        </td>


                        {/* PROFIT */}

                        <td
                          style={{
                            padding:
                              "19px 20px",
                            textAlign:
                              "right",
                            fontWeight:
                              "650",
                            color:
                              "#16A34A",
                          }}
                        >
                          {formatCurrency(
                            item.gross_profit
                          )}
                        </td>


                        {/* MARGIN */}

                        <td
                          style={{
                            padding:
                              "19px 20px",
                            textAlign:
                              "center",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: "7px",
                              padding:
                                "7px 12px",
                              borderRadius:
                                "20px",
                              background:
                                marginStyle.background,
                              color:
                                marginStyle.color,
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                            }}
                          >
                            <span
                              style={{
                                width:
                                  "7px",
                                height:
                                  "7px",
                                borderRadius:
                                  "50%",
                                background:
                                  "currentColor",
                              }}
                            />

                            {formatPercentage(
                              item.profit_margin_percentage
                            )}
                          </span>
                        </td>


                        {/* ACTIONS */}

                        <td
                          style={{
                            padding:
                              "19px 20px",
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
                              alignItems:
                                "center",
                              gap: "8px",
                            }}
                          >

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                openEditModal(
                                  item
                                )
                              }
                              title="Edit"
                              style={{
                                width:
                                  "40px",
                                height:
                                  "40px",
                                border:
                                  "none",
                                borderRadius:
                                  "10px",
                                background:
                                  "#EFF6FF",
                                color:
                                  "#2563EB",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                cursor:
                                  "pointer",
                              }}
                            >
                              <Icon
                                name="edit"
                                size={17}
                              />
                            </button>


                            {/* DELETE */}

                            <button
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              title="Delete"
                              style={{
                                width:
                                  "40px",
                                height:
                                  "40px",
                                border:
                                  "none",
                                borderRadius:
                                  "10px",
                                background:
                                  "#FEF2F2",
                                color:
                                  "#DC2626",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                cursor:
                                  "pointer",
                              }}
                            >
                              <Icon
                                name="trash"
                                size={17}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          style={{
            padding:
              "16px 22px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            borderTop:
              "1px solid #EEF2F7",
            color: "#64748B",
            fontSize: "13px",
          }}
        >
          <span>
            Showing{" "}
            {filteredAnalyses.length} of{" "}
            {analyses.length} analyses
          </span>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "8px",
            }}
          >
            <button
              disabled
              style={{
                width: "34px",
                height: "34px",
                border:
                  "1px solid #E2E8F0",
                borderRadius:
                  "8px",
                background:
                  "#F8FAFC",
                color:
                  "#94A3B8",
                cursor:
                  "not-allowed",
              }}
            >
              <Icon
                name="chevronLeft"
                size={16}
              />
            </button>

            <button
              style={{
                width: "34px",
                height: "34px",
                border: "none",
                borderRadius:
                  "8px",
                background:
                  "#2563EB",
                color:
                  "#ffffff",
                fontWeight:
                  "650",
              }}
            >
              1
            </button>

            <button
              disabled
              style={{
                width: "34px",
                height: "34px",
                border:
                  "1px solid #E2E8F0",
                borderRadius:
                  "8px",
                background:
                  "#F8FAFC",
                color:
                  "#94A3B8",
                cursor:
                  "not-allowed",
              }}
            >
              <Icon
                name="chevronRight"
                size={16}
              />
            </button>
          </div>
        </div>
      </div>


      {/* ====================================================
          CREATE / EDIT MODAL
      ==================================================== */}

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15,23,42,.50)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              background:
                "#ffffff",
              borderRadius:
                "16px",
              boxShadow:
                "0 25px 60px rgba(15,23,42,.25)",
              overflow:
                "hidden",
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                padding:
                  "22px 25px",
                borderBottom:
                  "1px solid #E2E8F0",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      "21px",
                    color:
                      "#0F172A",
                  }}
                >
                  {editingAnalysis
                    ? "Edit Profit Margin"
                    : "Add Profit Margin Analysis"}
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    fontSize:
                      "13px",
                    color:
                      "#64748B",
                  }}
                >
                  Enter the financial analysis
                  information below.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                style={{
                  width: "34px",
                  height: "34px",
                  border: "none",
                  borderRadius:
                    "8px",
                  background:
                    "#F1F5F9",
                  color:
                    "#475569",
                  fontSize:
                    "20px",
                  cursor:
                    "pointer",
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

              {/* ANALYSIS PERIOD */}

              <div
                style={{
                  marginBottom:
                    "18px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "7px",
                    fontSize:
                      "13px",
                    fontWeight:
                      "650",
                    color:
                      "#334155",
                  }}
                >
                  Analysis Period
                </label>

                <input
                  type="text"
                  name="analysis_period"
                  value={
                    formData.analysis_period
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. January 2026"
                  required
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "12px 14px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius:
                      "9px",
                    outline:
                      "none",
                    fontSize:
                      "14px",
                  }}
                />
              </div>


              {/* REVENUE + COST */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                  marginBottom:
                    "18px",
                }}
              >
                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "7px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "650",
                      color:
                        "#334155",
                    }}
                  >
                    Total Revenue
                  </label>

                  <input
                    type="number"
                    name="total_revenue"
                    value={
                      formData.total_revenue
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    required
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      padding:
                        "12px 14px",
                      border:
                        "1px solid #CBD5E1",
                      borderRadius:
                        "9px",
                      outline:
                        "none",
                      fontSize:
                        "14px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "7px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "650",
                      color:
                        "#334155",
                    }}
                  >
                    Total Cost
                  </label>

                  <input
                    type="number"
                    name="total_cost"
                    value={
                      formData.total_cost
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    required
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      padding:
                        "12px 14px",
                      border:
                        "1px solid #CBD5E1",
                      borderRadius:
                        "9px",
                      outline:
                        "none",
                      fontSize:
                        "14px",
                    }}
                  />
                </div>
              </div>


              {/* PROFIT + MARGIN */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                  marginBottom:
                    "25px",
                }}
              >
                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "7px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "650",
                      color:
                        "#334155",
                    }}
                  >
                    Gross Profit
                  </label>

                  <input
                    type="number"
                    name="gross_profit"
                    value={
                      formData.gross_profit
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    required
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      padding:
                        "12px 14px",
                      border:
                        "1px solid #CBD5E1",
                      borderRadius:
                        "9px",
                      outline:
                        "none",
                      fontSize:
                        "14px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "7px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "650",
                      color:
                        "#334155",
                    }}
                  >
                    Profit Margin %
                  </label>

                  <input
                    type="number"
                    name="profit_margin_percentage"
                    value={
                      formData.profit_margin_percentage
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      padding:
                        "12px 14px",
                      border:
                        "1px solid #CBD5E1",
                      borderRadius:
                        "9px",
                      outline:
                        "none",
                      fontSize:
                        "14px",
                    }}
                  />
                </div>
              </div>


              {/* BUTTONS */}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  style={{
                    padding:
                      "11px 18px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius:
                      "9px",
                    background:
                      "#ffffff",
                    color:
                      "#475569",
                    fontWeight:
                      "600",
                    cursor:
                      "pointer",
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
                    borderRadius:
                      "9px",
                    background:
                      "#2563EB",
                    color:
                      "#ffffff",
                    fontWeight:
                      "650",
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      saving
                        ? 0.7
                        : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingAnalysis
                    ? "Update Analysis"
                    : "Create Analysis"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}