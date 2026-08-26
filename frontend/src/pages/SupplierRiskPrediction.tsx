import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function SupplierRiskPrediction() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All Risk Levels");
  const [sortOrder, setSortOrder] = useState("Newest First");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/data-science/supplier-risk-prediction`
      );

      if (!response.ok) {
        throw new Error("Failed to load supplier risk data.");
      }

      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load supplier risk data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((supplier) =>
        supplier.supplier?.toLowerCase().includes(query)
      );
    }

    if (riskFilter !== "All Risk Levels") {
      result = result.filter(
        (supplier) =>
          supplier.risk_level?.toLowerCase() === riskFilter.toLowerCase()
      );
    }

    if (sortOrder === "Highest Risk") {
      result.sort(
        (a, b) => Number(a.risk_score || 0) - Number(b.risk_score || 0)
      );
    }

    if (sortOrder === "Lowest Risk") {
      result.sort(
        (a, b) => Number(b.risk_score || 0) - Number(a.risk_score || 0)
      );
    }

    if (sortOrder === "Newest First") {
      result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    }

    if (sortOrder === "Oldest First") {
      result.sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
    }

    return result;
  }, [suppliers, search, riskFilter, sortOrder]);

  const totalSuppliers = suppliers.length;

  const lowRisk = suppliers.filter(
    (supplier) => supplier.risk_level?.toLowerCase() === "low"
  ).length;

  const mediumRisk = suppliers.filter(
    (supplier) => supplier.risk_level?.toLowerCase() === "medium"
  ).length;

  const highRisk = suppliers.filter(
    (supplier) => supplier.risk_level?.toLowerCase() === "high"
  ).length;

  const getRiskStyle = (riskLevel) => {
    const risk = riskLevel?.toLowerCase();

    if (risk === "low") {
      return {
        background: "#ECFDF5",
        color: "#059669",
        border: "1px solid #A7F3D0",
      };
    }

    if (risk === "medium") {
      return {
        background: "#FFFBEB",
        color: "#D97706",
        border: "1px solid #FDE68A",
      };
    }

    if (risk === "high") {
      return {
        background: "#FEF2F2",
        color: "#DC2626",
        border: "1px solid #FECACA",
      };
    }

    return {
      background: "#F8FAFC",
      color: "#64748B",
      border: "1px solid #E2E8F0",
    };
  };

  const getRecommendation = (riskLevel) => {
    const risk = riskLevel?.toLowerCase();

    if (risk === "low") {
      return "Continue Partnership";
    }

    if (risk === "medium") {
      return "Monitor Performance";
    }

    if (risk === "high") {
      return "Review Supplier";
    }

    return "Review Performance";
  };

  const formatScore = (value) => {
    const score = Number(value || 0);

    return `${Math.round(score)}%`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "34px 34px 40px",
        color: "#0F172A",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "32px",
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
              background: "#EDE9FE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow: "0 4px 12px rgba(124,58,237,0.08)",
            }}
          >
            🛡️
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                lineHeight: "1.15",
                fontWeight: 750,
                letterSpacing: "-1px",
                color: "#0F172A",
              }}
            >
              Supplier Risk Prediction
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "15px",
                color: "#64748B",
              }}
            >
              Monitor supplier risk and identify potential supply chain threats
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "14px 22px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 650,
            cursor: "pointer",
            boxShadow: "0 7px 16px rgba(37,99,235,0.22)",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "18px" }}>＋</span>
          Add Supplier
        </button>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <KpiCard
          background="#EFF6FF"
          iconBackground="#DBEAFE"
          icon="👥"
          title="Total Suppliers"
          value={totalSuppliers}
          subtitle="All registered suppliers"
          valueColor="#0F172A"
          iconColor="#2563EB"
        />

        <KpiCard
          background="#ECFDF5"
          iconBackground="#D1FAE5"
          icon="✓"
          title="Low Risk"
          value={lowRisk}
          subtitle="Suppliers performing well"
          valueColor="#0F172A"
          iconColor="#059669"
        />

        <KpiCard
          background="#FFFBEB"
          iconBackground="#FEF3C7"
          icon="!"
          title="Medium Risk"
          value={mediumRisk}
          subtitle="Requires monitoring"
          valueColor="#0F172A"
          iconColor="#D97706"
        />

        <KpiCard
          background="#FEF2F2"
          iconBackground="#FEE2E2"
          icon="⚠"
          title="High Risk"
          value={highRisk}
          subtitle="Immediate attention required"
          valueColor="#0F172A"
          iconColor="#DC2626"
        />
      </div>

      {/* SEARCH / FILTER BAR */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          padding: "12px",
          display: "grid",
          gridTemplateColumns: "1fr 190px 190px",
          gap: "14px",
          marginBottom: "20px",
          boxShadow: "0 4px 14px rgba(15,23,42,0.035)",
        }}
      >
        {/* SEARCH */}
        <div
          style={{
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            background: "#FFFFFF",
          }}
        >
          <span
            style={{
              color: "#64748B",
              fontSize: "20px",
              marginRight: "10px",
            }}
          >
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search suppliers by name..."
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              color: "#0F172A",
              background: "transparent",
            }}
          />
        </div>

        {/* RISK FILTER */}
        <select
          value={riskFilter}
          onChange={(event) => setRiskFilter(event.target.value)}
          style={{
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "0 14px",
            background: "#FFFFFF",
            color: "#334155",
            fontSize: "14px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option>All Risk Levels</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* SORT */}
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          style={{
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "0 14px",
            background: "#FFFFFF",
            color: "#334155",
            fontSize: "14px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Highest Risk</option>
          <option>Lowest Risk</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 7px 22px rgba(15,23,42,0.045)",
        }}
      >
        {/* TABLE HEADER */}
        <div
          style={{
            padding: "24px 24px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
              fontSize: "19px",
            }}
          >
            🛡
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Supplier Risk List
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#94A3B8",
              }}
            >
              AI-powered supplier risk assessment
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              margin: "0 24px 20px",
              padding: "13px 16px",
              borderRadius: "10px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
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
                  background: "#F8FAFC",
                  borderTop: "1px solid #F1F5F9",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <th style={headerStyle}>Supplier</th>
                <th style={headerStyle}>Risk Level</th>
                <th style={headerStyle}>AI Score</th>
                <th style={headerStyle}>Delivery</th>
                <th style={headerStyle}>Quality</th>
                <th style={headerStyle}>Financial</th>
                <th style={headerStyle}>Recommendation</th>
                <th style={headerStyle}>Status</th>
                <th style={{ ...headerStyle, textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      padding: "55px",
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    Loading supplier risk data...
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      padding: "55px",
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    No supplier risk records found.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => {
                  const riskStyle = getRiskStyle(supplier.risk_level);

                  return (
                    <tr
                      key={supplier.id}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        transition: "background 0.2s ease",
                      }}
                    >
                      {/* SUPPLIER */}
                      <td style={cellStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "#E0ECFF",
                              color: "#2563EB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "15px",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {supplier.supplier
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: 650,
                                color: "#0F172A",
                                fontSize: "14px",
                              }}
                            >
                              {supplier.supplier}
                            </div>

                            <div
                              style={{
                                marginTop: "4px",
                                fontSize: "11px",
                                color: "#2563EB",
                                background: "#EFF6FF",
                                display: "inline-block",
                                padding: "3px 7px",
                                borderRadius: "5px",
                              }}
                            >
                              SUP-{String(supplier.id).padStart(4, "0")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* RISK */}
                      <td style={cellStyle}>
                        <span
                          style={{
                            ...riskStyle,
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 650,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "currentColor",
                            }}
                          />
                          {supplier.risk_level || "Unknown"}
                        </span>
                      </td>

                      {/* AI SCORE */}
                      <td style={cellStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "14px",
                              color: "#0F172A",
                            }}
                          >
                            {formatScore(supplier.risk_score)}
                          </strong>

                          <div
                            style={{
                              width: "60px",
                              height: "6px",
                              background: "#E2E8F0",
                              borderRadius: "999px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    Number(supplier.risk_score || 0),
                                    0
                                  ),
                                  100
                                )}%`,
                                height: "100%",
                                background:
                                  Number(supplier.risk_score || 0) >= 80
                                    ? "#10B981"
                                    : Number(supplier.risk_score || 0) >= 60
                                      ? "#F59E0B"
                                      : "#EF4444",
                                borderRadius: "999px",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* DELIVERY */}
                      <td style={cellStyle}>
                        {formatScore(supplier.delivery_performance)}
                      </td>

                      {/* QUALITY */}
                      <td style={cellStyle}>
                        {formatScore(supplier.quality_score)}
                      </td>

                      {/* FINANCIAL */}
                      <td style={cellStyle}>
                        {formatScore(supplier.financial_score)}
                      </td>

                      {/* RECOMMENDATION */}
                      <td style={cellStyle}>
                        <span
                          style={{
                            color: "#475569",
                            fontSize: "13px",
                          }}
                        >
                          {getRecommendation(supplier.risk_level)}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td style={cellStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background:
                              supplier.status?.toLowerCase() === "active"
                                ? "#ECFDF5"
                                : "#F1F5F9",
                            color:
                              supplier.status?.toLowerCase() === "active"
                                ? "#059669"
                                : "#64748B",
                            fontSize: "12px",
                            fontWeight: 650,
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "currentColor",
                            }}
                          />
                          {supplier.status || "Unknown"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "center",
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
                          <button
                            type="button"
                            title="Edit supplier"
                            style={actionButtonStyle}
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            title="Delete supplier"
                            style={{
                              ...actionButtonStyle,
                              background: "#FEF2F2",
                              color: "#DC2626",
                              border: "1px solid #FECACA",
                            }}
                          >
                            🗑
                          </button>

                          <button
                            type="button"
                            title="More actions"
                            style={{
                              ...actionButtonStyle,
                              background: "#FFFFFF",
                              color: "#64748B",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            ⋮
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div
          style={{
            minHeight: "64px",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #E2E8F0",
            color: "#64748B",
            fontSize: "13px",
          }}
        >
          <span>
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              type="button"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#94A3B8",
                cursor: "pointer",
              }}
            >
              ‹
            </button>

            <button
              type="button"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                border: "none",
                background: "#2563EB",
                color: "#FFFFFF",
                fontWeight: 650,
              }}
            >
              1
            </button>

            <button
              type="button"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#64748B",
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  background,
  iconBackground,
  icon,
  title,
  value,
  subtitle,
  valueColor,
  iconColor,
}) {
  return (
    <div
      style={{
        position: "relative",
        background,
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        minHeight: "148px",
        padding: "20px",
        boxShadow: "0 5px 16px rgba(15,23,42,0.035)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "11px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "11px",
            background: iconBackground,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {icon}
        </div>

        <span
          style={{
            color: iconColor,
            fontSize: "14px",
            fontWeight: 650,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          fontSize: "28px",
          lineHeight: "1",
          fontWeight: 750,
          color: valueColor,
          marginBottom: "13px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#64748B",
        }}
      >
        {subtitle}
      </div>

      <div
        style={{
          position: "absolute",
          right: "18px",
          bottom: "24px",
          width: "62px",
          height: "25px",
          opacity: 0.85,
        }}
      >
        <svg
          viewBox="0 0 62 25"
          width="62"
          height="25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 21C9 19 10 18 16 18C21 18 23 13 29 14C35 15 36 10 41 10C47 10 49 5 54 7C58 9 59 3 61 2"
            stroke={iconColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

const headerStyle = {
  padding: "15px 18px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 700,
  color: "#475569",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "18px",
  fontSize: "13px",
  color: "#475569",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const actionButtonStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  border: "1px solid #DBEAFE",
  background: "#EFF6FF",
  color: "#2563EB",
  cursor: "pointer",
  fontSize: "15px",
};