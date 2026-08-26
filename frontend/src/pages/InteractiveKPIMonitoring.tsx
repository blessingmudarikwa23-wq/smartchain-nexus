import { useEffect, useMemo, useState } from "react";

const API_URL =
  "http://localhost:8000/business-intelligence/interactive-kpi-monitoring";

export default function InteractiveKPIMonitoring() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD KPI DATA
  // ==========================================================

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to load KPI monitoring data. Status: ${response.status}`
        );
      }

      const data = await response.json();

      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.kpis)
        ? data.kpis
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setKpis(records);
    } catch (err) {
      console.error("Interactive KPI Monitoring Error:", err);

      setError(
        err.message ||
          "Unable to load KPI monitoring data. Please make sure the backend is running."
      );

      setKpis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  // ==========================================================
  // NORMALISE BACKEND DATA
  // ==========================================================

  const normalisedKPIs = useMemo(() => {
    return kpis.map((item, index) => ({
      id: item.id ?? item.kpi_id ?? index,

      kpi:
        item.kpi ||
        item.name ||
        item.kpi_name ||
        item.metric ||
        "Unnamed KPI",

      current:
        item.current ??
        item.current_value ??
        item.value ??
        item.actual ??
        "—",

      target:
        item.target ??
        item.target_value ??
        item.goal ??
        "—",

      status:
        item.status ||
        item.performance_status ||
        item.kpi_status ||
        "Unknown",
    }));
  }, [kpis]);

  // ==========================================================
  // DASHBOARD STATISTICS
  // ==========================================================

  const totalKPIs = normalisedKPIs.length;

  const onTargetKPIs = normalisedKPIs.filter((item) => {
    const status = String(item.status).toLowerCase();

    return (
      status.includes("target") ||
      status.includes("good") ||
      status.includes("on track") ||
      status.includes("above") ||
      status.includes("excellent")
    );
  }).length;

  const belowTargetKPIs = normalisedKPIs.filter((item) => {
    const status = String(item.status).toLowerCase();

    return (
      status.includes("below") ||
      status.includes("under") ||
      status.includes("poor") ||
      status.includes("risk")
    );
  }).length;

  const performanceScore =
    totalKPIs > 0
      ? Math.round((onTargetKPIs / totalKPIs) * 100)
      : 0;

  // ==========================================================
  // STATUS STYLE
  // ==========================================================

  const getStatusStyle = (status) => {
    const value = String(status).toLowerCase();

    if (
      value.includes("above") ||
      value.includes("on target") ||
      value.includes("on track") ||
      value.includes("good") ||
      value.includes("excellent")
    ) {
      return {
        background: "#DCFCE7",
        color: "#166534",
        border: "1px solid #BBF7D0",
      };
    }

    if (
      value.includes("below") ||
      value.includes("under") ||
      value.includes("poor") ||
      value.includes("risk")
    ) {
      return {
        background: "#FEE2E2",
        color: "#B91C1C",
        border: "1px solid #FECACA",
      };
    }

    if (value.includes("pending")) {
      return {
        background: "#FEF3C7",
        color: "#92400E",
        border: "1px solid #FDE68A",
      };
    }

    return {
      background: "#F1F5F9",
      color: "#475569",
      border: "1px solid #E2E8F0",
    };
  };

  // ==========================================================
  // PERFORMANCE CALCULATION
  // ==========================================================

  const getPerformancePercentage = (current, target) => {
    const currentNumber = parseFloat(
      String(current).replace("%", "").replace(/,/g, "")
    );

    const targetNumber = parseFloat(
      String(target).replace("%", "").replace(/,/g, "")
    );

    if (
      Number.isNaN(currentNumber) ||
      Number.isNaN(targetNumber) ||
      targetNumber === 0
    ) {
      return 0;
    }

    return (currentNumber / targetNumber) * 100;
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "30px 34px 50px",
        boxSizing: "border-box",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 8px",
              color: "#2563EB",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.8px",
            }}
          >
            BUSINESS INTELLIGENCE
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#14213D",
            }}
          >
            Interactive KPI Monitoring
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#64748B",
              fontSize: "15px",
              maxWidth: "760px",
              lineHeight: 1.6,
            }}
          >
            Monitor key business, supply chain, procurement, inventory,
            financial and operational performance indicators directly
            through the SmartChain Nexus platform.
          </p>
        </div>

        {/* REFRESH BUTTON */}

        <button
          onClick={fetchKPIs}
          disabled={loading}
          style={{
            border: "none",
            background: loading ? "#93C5FD" : "#2563EB",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
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

          {loading ? "Refreshing..." : "Refresh KPIs"}
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
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "25px",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          <strong>KPI Monitoring Error:</strong> {error}
        </div>
      )}

      {/* ======================================================
          TOP DASHBOARD AREA
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(300px, 320px)",
          gap: "22px",
          alignItems: "start",
          marginBottom: "22px",
        }}
      >
        {/* ====================================================
            LEFT SIDE
        ==================================================== */}

        <div>
          {/* ==================================================
              SUMMARY CARDS
          ================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            {/* TOTAL */}

            <SummaryCard
              icon="▦"
              iconBackground="#EEF4FF"
              iconColor="#2563EB"
              label="KPIs Tracked"
              value={loading ? "—" : totalKPIs}
            />

            {/* ON TARGET */}

            <SummaryCard
              icon="✓"
              iconBackground="#ECFDF5"
              iconColor="#10B981"
              label="On Target"
              value={loading ? "—" : onTargetKPIs}
            />

            {/* BELOW TARGET */}

            <SummaryCard
              icon="!"
              iconBackground="#FEF2F2"
              iconColor="#EF4444"
              label="Below Target"
              value={loading ? "—" : belowTargetKPIs}
            />

            {/* PERFORMANCE */}

            <SummaryCard
              icon="◎"
              iconBackground="#FFF7E8"
              iconColor="#F59E0B"
              label="Performance Score"
              value={
                loading
                  ? "—"
                  : `${performanceScore}%`
              }
            />
          </div>

          {/* ==================================================
              KPI PERFORMANCE OVERVIEW
          ================================================== */}

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8EEF7",
              borderRadius: "14px",
              padding: "22px",
              boxShadow:
                "0 3px 14px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#17233D",
                  }}
                >
                  KPI Performance Overview
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#94A3B8",
                    fontSize: "12px",
                  }}
                >
                  Current KPI performance against defined targets.
                </p>
              </div>

              <span
                style={{
                  background: "#EFF6FF",
                  color: "#2563EB",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {loading
                  ? "Loading..."
                  : `${totalKPIs} KPI records`}
              </span>
            </div>

            {loading ? (
              <div
                style={{
                  padding: "45px 20px",
                  textAlign: "center",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Loading KPI performance data...
              </div>
            ) : normalisedKPIs.length === 0 ? (
              <div
                style={{
                  padding: "45px 20px",
                  textAlign: "center",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                No KPI data available.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "14px",
                }}
              >
                {normalisedKPIs.slice(0, 6).map((item) => {
                  const percentage = getPerformancePercentage(
                    item.current,
                    item.target
                  );

                  const safePercentage = Math.min(
                    Math.max(percentage, 0),
                    150
                  );

                  const barWidth = Math.min(
                    safePercentage,
                    100
                  );

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: "11px",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <strong
                          style={{
                            color: "#17233D",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.kpi}
                        </strong>

                        <span
                          style={{
                            color: "#2563EB",
                            fontSize: "12px",
                            fontWeight: 800,
                          }}
                        >
                          {item.current}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          background: "#E2E8F0",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${barWidth}%`,
                            height: "100%",
                            background:
                              safePercentage >= 100
                                ? "#22C55E"
                                : "#2563EB",
                            borderRadius: "999px",
                            transition:
                              "width 0.4s ease",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          marginTop: "8px",
                          fontSize: "10px",
                          color: "#64748B",
                        }}
                      >
                        <span>
                          Target: {item.target}
                        </span>

                        <strong
                          style={{
                            color:
                              safePercentage >= 100
                                ? "#16A34A"
                                : "#2563EB",
                          }}
                        >
                          {Math.round(
                            safePercentage
                          )}
                          %
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ====================================================
            RIGHT SIDE - KPI WORKSPACE
        ==================================================== */}

        <div
          style={{
            background:
              "linear-gradient(145deg, #0F1D38 0%, #172640 100%)",
            borderRadius: "14px",
            minHeight: "275px",
            padding: "18px 20px 20px",
            color: "#FFFFFF",
            boxShadow:
              "0 8px 25px rgba(15, 23, 42, 0.14)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* DECORATIVE GLOW */}

          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "rgba(37, 99, 235, 0.12)",
              right: "-75px",
              top: "-75px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
            }}
          >
            {/* KPI ICON */}

            <div
              style={{
                width: "100%",
                height: "95px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "88px",
                  height: "64px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, #23385F, #152641)",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.2)",
                }}
              >
                ◎
              </div>
            </div>

            <h2
              style={{
                margin: "2px 0 7px",
                fontSize: "17px",
                fontWeight: 800,
              }}
            >
              KPI Monitoring Workspace
            </h2>

            <p
              style={{
                margin: 0,
                color: "#CBD5E1",
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              Centralized monitoring environment for
              <br />
              real-time business performance indicators.
            </p>

            {/* WORKSPACE STATS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  borderRight:
                    "1px solid rgba(255,255,255,.16)",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                  }}
                >
                  {loading ? "—" : totalKPIs}
                </div>

                <div
                  style={{
                    color: "#CBD5E1",
                    fontSize: "11px",
                  }}
                >
                  KPIs Tracked
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                  }}
                >
                  {loading
                    ? "—"
                    : `${performanceScore}%`}
                </div>

                <div
                  style={{
                    color: "#CBD5E1",
                    fontSize: "11px",
                  }}
                >
                  Performance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          KPI TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EEF7",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 3px 14px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #E8EEF7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 800,
                color: "#17233D",
              }}
            >
              Key Performance Indicators
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#94A3B8",
                fontSize: "12px",
              }}
            >
              Live KPI information retrieved directly from
              the SmartChain Nexus backend.
            </p>
          </div>

          <button
            onClick={fetchKPIs}
            disabled={loading}
            style={{
              border: "1px solid #BFDBFE",
              background: loading
                ? "#F8FBFF"
                : "#FFFFFF",
              color: "#2563EB",
              padding: "8px 13px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>
        </div>

        {/* TABLE CONTENT */}

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
                fontSize: "34px",
                marginBottom: "12px",
              }}
            >
              ◎
            </div>

            <p
              style={{
                margin: 0,
                fontWeight: 600,
              }}
            >
              Loading KPI performance data...
            </p>
          </div>
        ) : normalisedKPIs.length === 0 ? (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "12px",
              }}
            >
              ◎
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#17233D",
              }}
            >
              No KPI data available
            </h3>

            <p
              style={{
                margin: "0 auto 18px",
                maxWidth: "500px",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              The backend currently has no KPI records
              available for monitoring.
            </p>

            <button
              onClick={fetchKPIs}
              style={{
                border: "none",
                background: "#2563EB",
                color: "#FFFFFF",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Refresh Data
            </button>
          </div>
        ) : (
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
                      padding: "15px 20px",
                      textAlign: "left",
                      fontSize: "12px",
                    }}
                  >
                    KPI
                  </th>

                  <th
                    style={{
                      padding: "15px 20px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    Current
                  </th>

                  <th
                    style={{
                      padding: "15px 20px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    Target
                  </th>

                  <th
                    style={{
                      padding: "15px 20px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    Performance
                  </th>

                  <th
                    style={{
                      padding: "15px 20px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {normalisedKPIs.map((item) => {
                  const percentage =
                    getPerformancePercentage(
                      item.current,
                      item.target
                    );

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid #E8EEF7",
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          fontWeight: 700,
                          color: "#17233D",
                          fontSize: "13px",
                        }}
                      >
                        {item.kpi}
                      </td>

                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                          color: "#334155",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        {item.current}
                      </td>

                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                          color: "#64748B",
                          fontSize: "13px",
                        }}
                      >
                        {item.target}
                      </td>

                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                        }}
                      >
                        <strong
                          style={{
                            color:
                              percentage >= 100
                                ? "#16A34A"
                                : "#2563EB",
                            fontSize: "13px",
                          }}
                        >
                          {Number.isNaN(
                            percentage
                          )
                            ? "—"
                            : `${Math.round(
                                percentage
                              )}%`}
                        </strong>
                      </td>

                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            ...getStatusStyle(
                              item.status
                            ),
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================================
// SUMMARY CARD
// ==========================================================

function SummaryCard({
  icon,
  iconBackground,
  iconColor,
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8EEF7",
        borderRadius: "14px",
        padding: "18px",
        minHeight: "125px",
        boxShadow:
          "0 3px 14px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "11px",
          background: iconBackground,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "21px",
          fontWeight: 800,
          marginBottom: "13px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "27px",
          fontWeight: 800,
          color: "#17233D",
        }}
      >
        {value}
      </div>
    </div>
  );
}