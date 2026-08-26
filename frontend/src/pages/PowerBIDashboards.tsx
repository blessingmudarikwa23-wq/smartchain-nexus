import { useEffect, useMemo, useState } from "react";

export default function PowerBIDashboards() {
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    "http://127.0.0.1:8000/business-intelligence/power-bi-dashboards";

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load Power BI dashboards");
      }

      const data = await response.json();

      setDashboards(data);

      if (data.length > 0) {
        setSelectedDashboard((current) => current || data[0]);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard data. Make sure the SmartChain Nexus backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredDashboards = useMemo(() => {
    const searchText = search.toLowerCase();

    return dashboards.filter((dashboard) => {
      return (
        dashboard.dashboard_name?.toLowerCase().includes(searchText) ||
        dashboard.description?.toLowerCase().includes(searchText) ||
        dashboard.dashboard_type?.toLowerCase().includes(searchText) ||
        dashboard.status?.toLowerCase().includes(searchText)
      );
    });
  }, [dashboards, search]);

  const totalDashboards = dashboards.length;

  const activeDashboards = dashboards.filter(
    (dashboard) => dashboard.status?.toLowerCase() === "active"
  ).length;

  const liveReports = dashboards.filter((dashboard) => {
    const frequency = dashboard.refresh_frequency?.toLowerCase() || "";

    return (
      frequency.includes("real") ||
      frequency.includes("hour") ||
      frequency.includes("minute")
    );
  }).length;

  const activeUsers = dashboards.reduce(
    (total, dashboard) => total + (dashboard.users || 0),
    0
  );

  const getDashboardIcon = (type = "") => {
    const value = type.toLowerCase();

    if (value.includes("executive")) return "▦";
    if (value.includes("sales")) return "⌁";
    if (value.includes("inventory")) return "◇";
    if (value.includes("procurement")) return "🛒";
    if (value.includes("logistics")) return "▣";

    return "▦";
  };

  const getIconStyle = (type = "") => {
    const value = type.toLowerCase();

    if (value.includes("executive")) {
      return {
        background: "#EEF4FF",
        color: "#2563EB",
      };
    }

    if (value.includes("sales")) {
      return {
        background: "#ECFDF5",
        color: "#10B981",
      };
    }

    if (value.includes("inventory")) {
      return {
        background: "#FFF8E7",
        color: "#F59E0B",
      };
    }

    if (value.includes("procurement")) {
      return {
        background: "#F5F0FF",
        color: "#7C3AED",
      };
    }

    if (value.includes("logistics")) {
      return {
        background: "#ECF9FC",
        color: "#0891B2",
      };
    }

    return {
      background: "#EEF4FF",
      color: "#2563EB",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "32px 34px 50px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0F172A",
      }}
    >
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
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
            Power BI Dashboards
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            Monitor, analyze and explore business intelligence directly inside
            SmartChain Nexus.
          </p>
        </div>

        {/* REFRESH BUTTON */}

        <button
          type="button"
          onClick={fetchDashboards}
          disabled={loading}
          style={{
            border: "none",
            background: loading ? "#93C5FD" : "#2563EB",
            color: "#FFFFFF",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            boxShadow: "0 5px 14px rgba(37, 99, 235, 0.22)",
          }}
        >
          <span
            style={{
              fontSize: "17px",
              lineHeight: 1,
            }}
          >
            ↻
          </span>

          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* ========================================================= */}
      {/* ERROR */}
      {/* ========================================================= */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "22px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP AREA */}
      {/* ========================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 320px)",
          gap: "22px",
          alignItems: "start",
        }}
      >
        {/* ======================================================= */}
        {/* LEFT CONTENT */}
        {/* ======================================================= */}

        <div>
          {/* ===================================================== */}
          {/* KPI CARDS */}
          {/* ===================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            {/* TOTAL DASHBOARDS */}

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8EEF7",
                borderRadius: "14px",
                padding: "20px",
                minHeight: "128px",
                boxShadow: "0 3px 14px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "13px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "11px",
                    background: "#EEF4FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: 700,
                  }}
                >
                  ▦
                </div>

                <div>
                  <div
                    style={{
                      color: "#2563EB",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Total Dashboards
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#17233D",
                    }}
                  >
                    {loading ? "—" : totalDashboards}
                  </div>

                  <div
                    style={{
                      marginTop: "7px",
                      fontSize: "12px",
                      color: "#94A3B8",
                    }}
                  >
                    Available dashboards
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE DASHBOARDS */}

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8EEF7",
                borderRadius: "14px",
                padding: "20px",
                minHeight: "128px",
                boxShadow: "0 3px 14px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "13px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "11px",
                    background: "#ECFDF5",
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "21px",
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>

                <div>
                  <div
                    style={{
                      color: "#10A66A",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Active Dashboards
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#17233D",
                    }}
                  >
                    {loading ? "—" : activeDashboards}
                  </div>

                  <div
                    style={{
                      marginTop: "7px",
                      fontSize: "12px",
                      color: "#94A3B8",
                    }}
                  >
                    Currently available
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE REPORTS */}

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8EEF7",
                borderRadius: "14px",
                padding: "20px",
                minHeight: "128px",
                boxShadow: "0 3px 14px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "13px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "11px",
                    background: "#FFF7E8",
                    color: "#F59E0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: 800,
                  }}
                >
                  ∿
                </div>

                <div>
                  <div
                    style={{
                      color: "#D88A00",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Live Reports
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#17233D",
                    }}
                  >
                    {loading ? "—" : liveReports}
                  </div>

                  <div
                    style={{
                      marginTop: "7px",
                      fontSize: "12px",
                      color: "#94A3B8",
                    }}
                  >
                    Frequently refreshed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* DASHBOARD LIBRARY */}
          {/* ===================================================== */}

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8EEF7",
              borderRadius: "14px",
              boxShadow: "0 3px 14px rgba(15, 23, 42, 0.04)",
              overflow: "hidden",
            }}
          >
            {/* LIBRARY HEADER */}

            <div
              style={{
                padding: "20px 20px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#17233D",
                  }}
                >
                  <span
                    style={{
                      color: "#2563EB",
                      fontSize: "20px",
                    }}
                  >
                    ▣
                  </span>

                  Dashboard Library
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    marginLeft: "30px",
                    fontSize: "12px",
                    color: "#94A3B8",
                  }}
                >
                  Select a dashboard to view insights and analytics
                </div>
              </div>

              {/* SEARCH */}

              <div
                style={{
                  position: "relative",
                  width: "200px",
                }}
              >
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dashboards..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: "38px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "9px",
                    padding: "0 38px 0 13px",
                    outline: "none",
                    fontSize: "12px",
                    color: "#334155",
                    background: "#FFFFFF",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "9px",
                    color: "#64748B",
                    fontSize: "17px",
                  }}
                >
                  ⌕
                </span>
              </div>
            </div>

            {/* DASHBOARDS */}

            <div
              style={{
                padding: "0 18px 18px",
              }}
            >
              {loading ? (
                <div
                  style={{
                    padding: "50px 20px",
                    textAlign: "center",
                    color: "#64748B",
                    fontSize: "14px",
                  }}
                >
                  Loading dashboards...
                </div>
              ) : filteredDashboards.length === 0 ? (
                <div
                  style={{
                    padding: "50px 20px",
                    textAlign: "center",
                    color: "#64748B",
                    fontSize: "14px",
                  }}
                >
                  No dashboards found.
                </div>
              ) : (
                filteredDashboards.map((dashboard) => {
                  const iconStyle = getIconStyle(
                    dashboard.dashboard_type
                  );

                  const isSelected =
                    selectedDashboard?.id === dashboard.id;

                  return (
                    <div
                      key={dashboard.id}
                      onClick={() => setSelectedDashboard(dashboard)}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "48px minmax(0, 1fr) auto 28px",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 10px",
                        border: isSelected
                          ? "1px solid #BFDBFE"
                          : "1px solid #E8EEF7",
                        borderRadius: "10px",
                        marginBottom: "8px",
                        background: isSelected
                          ? "#F8FBFF"
                          : "#FFFFFF",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* ICON */}

                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: iconStyle.background,
                          color: iconStyle.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "21px",
                          fontWeight: 800,
                        }}
                      >
                        {getDashboardIcon(
                          dashboard.dashboard_type ||
                            dashboard.dashboard_name
                        )}
                      </div>

                      {/* NAME */}

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 800,
                            color: "#17233D",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dashboard.dashboard_name}
                        </div>

                        <div
                          style={{
                            marginTop: "4px",
                            fontSize: "11px",
                            color: "#64748B",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dashboard.description ||
                            "Business intelligence dashboard for SmartChain Nexus."}
                        </div>
                      </div>

                      {/* BADGES */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#475569",
                            padding: "5px 9px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dashboard.dashboard_type || "Operational"}
                        </span>

                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#64748B",
                            padding: "5px 9px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dashboard.refresh_frequency || "Daily"}
                        </span>

                        <span
                          style={{
                            background: "#ECFDF5",
                            color: "#059669",
                            padding: "5px 9px",
                            borderRadius: "999px",
                            fontSize: "10px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          ● {dashboard.status || "Active"}
                        </span>
                      </div>

                      {/* ARROW */}

                      <div
                        style={{
                          fontSize: "20px",
                          color: "#334155",
                          textAlign: "right",
                        }}
                      >
                        ›
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* VIEW ALL */}

            <div
              style={{
                borderTop: "1px solid #E8EEF7",
                padding: "13px",
                textAlign: "center",
              }}
            >
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#2563EB",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ▦ &nbsp; View All Dashboards
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN */}
        {/* ======================================================= */}

        <div>
          {/* ===================================================== */}
          {/* BI WORKSPACE IMAGE */}
          {/* ===================================================== */}

          <div
            style={{
              background: "#0F1D38",
              borderRadius: "14px",
              height: "275px",
              padding: 0,
              color: "#FFFFFF",
              boxShadow: "0 8px 25px rgba(15, 23, 42, 0.14)",
              position: "relative",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <img
              src="/powerbi-workspace-image.png"
              alt="Business Intelligence Workspace"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* ===================================================== */}
          {/* DASHBOARD PREVIEW */}
          {/* ===================================================== */}

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8EEF7",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 3px 14px rgba(15, 23, 42, 0.04)",
            }}
          >
            {/* PREVIEW HEADER */}

            <div
              style={{
                padding: "15px 17px",
                borderBottom: "1px solid #E8EEF7",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  fontWeight: 800,
                  letterSpacing: ".4px",
                }}
              >
                DASHBOARD PREVIEW
              </span>

              <span
                style={{
                  color: "#64748B",
                  fontSize: "16px",
                }}
              >
                ↗
              </span>
            </div>

            {selectedDashboard ? (
              <div
                style={{
                  padding: "18px",
                }}
              >
                {/* PREVIEW ICON */}

                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "11px",
                    background: "#EEF4FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: 800,
                    marginBottom: "17px",
                  }}
                >
                  ▦
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: 1.35,
                    fontWeight: 800,
                    color: "#17233D",
                  }}
                >
                  {selectedDashboard.dashboard_name}
                </h2>

                <p
                  style={{
                    margin: "8px 0 18px",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: "#64748B",
                  }}
                >
                  {selectedDashboard.description ||
                    "Business intelligence dashboard for monitoring supply chain performance."}
                </p>

                {/* DETAILS */}

                <div
                  style={{
                    borderTop: "1px solid #E8EEF7",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "13px 0",
                      borderBottom: "1px solid #E8EEF7",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                      }}
                    >
                      Type
                    </span>

                    <strong
                      style={{
                        fontSize: "11px",
                        color: "#17233D",
                      }}
                    >
                      {selectedDashboard.dashboard_type || "Executive"}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "13px 0",
                      borderBottom: "1px solid #E8EEF7",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                      }}
                    >
                      Workspace
                    </span>

                    <strong
                      style={{
                        fontSize: "11px",
                        color: "#17233D",
                      }}
                    >
                      {selectedDashboard.workspace || "SmartChain Nexus"}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "13px 0",
                      borderBottom: "1px solid #E8EEF7",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                      }}
                    >
                      Refresh
                    </span>

                    <strong
                      style={{
                        fontSize: "11px",
                        color: "#17233D",
                      }}
                    >
                      {selectedDashboard.refresh_frequency || "Daily"}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "13px 0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                      }}
                    >
                      Status
                    </span>

                    <strong
                      style={{
                        fontSize: "11px",
                        color: "#059669",
                      }}
                    >
                      ● {selectedDashboard.status || "Active"}
                    </strong>
                  </div>
                </div>

                {/* OPEN DASHBOARD */}

                <button
                  type="button"
                  onClick={() => {
                    if (selectedDashboard.report_url) {
                      window.open(
                        selectedDashboard.report_url,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    borderRadius: "9px",
                    padding: "12px 14px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: selectedDashboard.report_url
                      ? "pointer"
                      : "not-allowed",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "5px",
                    opacity: selectedDashboard.report_url ? 1 : 0.65,
                  }}
                >
                  <span>Open Dashboard</span>

                  <span
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    →
                  </span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#94A3B8",
                  fontSize: "13px",
                }}
              >
                Select a dashboard from the library.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BUSINESS OVERVIEW */}
      {/* ========================================================= */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EEF7",
          borderRadius: "14px",
          boxShadow: "0 3px 14px rgba(15, 23, 42, 0.04)",
          marginTop: "22px",
          padding: "20px",
        }}
      >
        {/* OVERVIEW HEADER */}

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
                fontSize: "16px",
                fontWeight: 800,
                color: "#17233D",
              }}
            >
              Business Overview
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "12px",
                color: "#94A3B8",
              }}
            >
              Key performance indicators across all dashboards
            </p>
          </div>

          <select
            defaultValue="Last 6 Months"
            style={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              background: "#FFFFFF",
              padding: "9px 12px",
              fontSize: "11px",
              color: "#475569",
              outline: "none",
            }}
          >
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>Last 12 Months</option>
          </select>
        </div>

        {/* OVERVIEW CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          <OverviewCard
            title="Overall Performance"
            value="87.4%"
            change="8.6%"
            positive
            line="blue"
          />

          <OverviewCard
            title="Revenue Growth"
            value="+24.8%"
            change="12.4%"
            positive
            line="green"
          />

          <OverviewCard
            title="Cost Efficiency"
            value="92.1%"
            change="5.3%"
            positive
            line="green"
          />

          <OverviewCard
            title="Supply Chain Health"
            value="91.3%"
            change="6.8%"
            positive
            line="green"
          />

          <OverviewCard
            title="On-Time Delivery"
            value="89.7%"
            change="4.2%"
            positive
            line="green"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* OVERVIEW CARD */
/* ============================================================= */

function OverviewCard({
  title,
  value,
  change,
  positive,
  line,
}) {
  return (
    <div
      style={{
        border: "1px solid #E8EEF7",
        borderRadius: "11px",
        padding: "15px",
        background: "#FFFFFF",
        minHeight: "108px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#64748B",
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: 800,
          color: "#17233D",
          marginTop: "8px",
        }}
      >
        {value}
      </div>

      {/* MINI CHART */}

      <div
        style={{
          height: "24px",
          marginTop: "3px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="30"
          viewBox="0 0 150 30"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,24 15,20 30,21 45,12 60,16 75,8 90,13 105,5 120,11 135,6 150,8"
            fill="none"
            stroke={line === "blue" ? "#2563EB" : "#10B981"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        style={{
          marginTop: "3px",
          fontSize: "10px",
          fontWeight: 700,
          color: positive ? "#10A66A" : "#EF4444",
        }}
      >
        ↑ {change} vs previous period
      </div>
    </div>
  );
}