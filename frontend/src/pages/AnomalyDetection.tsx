import { useEffect, useState } from "react";
import axios from "axios";

export default function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8000/data-science/anomaly-detection"
      );

      setAnomalies(response.data);
    } catch (err) {
      console.error("Failed to fetch anomaly detection data:", err);
      setError(
        "Unable to load anomaly detection data from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Your backend currently stores:
   * module
   * anomaly
   * status
   *
   * It does NOT currently have a severity or location column.
   *
   * Therefore, severity is derived from the anomaly/status text
   * for the UI rather than pretending the backend has those fields.
   */
  const getSeverity = (item) => {
    const text = `${item.anomaly} ${item.status}`.toLowerCase();

    if (
      text.includes("critical") ||
      text.includes("urgent") ||
      text.includes("high") ||
      text.includes("escalated")
    ) {
      return "High";
    }

    if (
      text.includes("medium") ||
      text.includes("warning") ||
      text.includes("monitor")
    ) {
      return "Medium";
    }

    return "Low";
  };

  const getSeverityStyle = (severity) => {
    if (severity === "High") {
      return {
        background: "#FEE2E2",
        color: "#B91C1C",
        border: "1px solid #FECACA",
      };
    }

    if (severity === "Medium") {
      return {
        background: "#FEF3C7",
        color: "#B45309",
        border: "1px solid #FDE68A",
      };
    }

    return {
      background: "#DCFCE7",
      color: "#15803D",
      border: "1px solid #BBF7D0",
    };
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "resolved") {
      return {
        background: "#DCFCE7",
        color: "#15803D",
      };
    }

    if (
      normalizedStatus === "escalated" ||
      normalizedStatus === "critical"
    ) {
      return {
        background: "#FEE2E2",
        color: "#B91C1C",
      };
    }

    if (
      normalizedStatus === "investigating" ||
      normalizedStatus === "active"
    ) {
      return {
        background: "#DBEAFE",
        color: "#1D4ED8",
      };
    }

    return {
      background: "#FEF3C7",
      color: "#B45309",
    };
  };

  const filteredAnomalies =
    selectedSeverity === "All"
      ? anomalies
      : anomalies.filter(
          (item) => getSeverity(item) === selectedSeverity
        );

  const totalAlerts = anomalies.length;

  const highSeverity = anomalies.filter(
    (item) => getSeverity(item) === "High"
  ).length;

  const resolved = anomalies.filter(
    (item) => item.status?.toLowerCase() === "resolved"
  ).length;

  const activeInvestigations = anomalies.filter(
    (item) =>
      item.status?.toLowerCase() !== "resolved"
  ).length;

  const resolutionRate =
    totalAlerts > 0
      ? Math.round((resolved / totalAlerts) * 100)
      : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "32px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0F172A",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "800",
                color: "#4F46E5",
              }}
            >
              AI
            </div>

            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#4F46E5",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Data Science
            </span>
          </div>

          <h1
            style={{
              fontSize: "34px",
              fontWeight: "750",
              margin: "0 0 8px 0",
              letterSpacing: "-0.8px",
              color: "#0F172A",
            }}
          >
            Anomaly Detection
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "15px",
            }}
          >
            Monitor unusual business activity and AI-generated alerts.
          </p>
        </div>

        {/* BACKEND STATUS */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
          }}
        >
          <span
            style={{
              width: "9px",
              height: "9px",
              background: loading
                ? "#F59E0B"
                : error
                ? "#EF4444"
                : "#22C55E",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />

          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#64748B",
              }}
            >
              Backend Connection
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: loading
                  ? "#B45309"
                  : error
                  ? "#B91C1C"
                  : "#15803D",
              }}
            >
              {loading
                ? "Connecting..."
                : error
                ? "Connection Error"
                : "Connected"}
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "14px 18px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          {error}

          <button
            onClick={fetchAnomalies}
            style={{
              marginLeft: "15px",
              border: "none",
              background: "#B91C1C",
              color: "#FFFFFF",
              padding: "7px 12px",
              borderRadius: "7px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748B",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Total Alerts
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "750",
              color: "#0F172A",
            }}
          >
            {totalAlerts}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#2563EB",
              fontWeight: "600",
            }}
          >
            Backend records
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #FECACA",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748B",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            High Severity
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "750",
              color: "#B91C1C",
            }}
          >
            {highSeverity}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#B91C1C",
              fontWeight: "600",
            }}
          >
            Requires attention
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #BBF7D0",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748B",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Resolved
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "750",
              color: "#15803D",
            }}
          >
            {resolved}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#15803D",
              fontWeight: "600",
            }}
          >
            {resolutionRate}% resolution rate
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748B",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Active Alerts
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "750",
              color: "#4F46E5",
            }}
          >
            {activeInvestigations}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#64748B",
              fontWeight: "600",
            }}
          >
            Currently monitored
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 5px 0",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Detected Anomalies
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#64748B",
              }}
            >
              Live records from the anomaly detection service
            </p>
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) =>
              setSelectedSeverity(e.target.value)
            }
            style={{
              border: "1px solid #CBD5E1",
              borderRadius: "9px",
              padding: "9px 12px",
              background: "#FFFFFF",
              color: "#334155",
              fontSize: "13px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Severity</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "760px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#F8FAFC",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <th
                  style={{
                    padding: "15px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  Anomaly
                </th>

                <th
                  style={{
                    padding: "15px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  Module
                </th>

                <th
                  style={{
                    padding: "15px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  Severity
                </th>

                <th
                  style={{
                    padding: "15px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    padding: "15px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  Detected
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color: "#64748B",
                    }}
                  >
                    Loading anomaly data...
                  </td>
                </tr>
              ) : filteredAnomalies.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color: "#64748B",
                    }}
                  >
                    No anomaly records found.
                  </td>
                </tr>
              ) : (
                filteredAnomalies.map((item, index) => {
                  const severity = getSeverity(item);

                  return (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom:
                          index !==
                          filteredAnomalies.length - 1
                            ? "1px solid #F1F5F9"
                            : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "18px 24px",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#0F172A",
                        }}
                      >
                        {item.anomaly}
                      </td>

                      <td
                        style={{
                          padding: "18px 20px",
                          color: "#475569",
                          fontSize: "14px",
                        }}
                      >
                        {item.module}
                      </td>

                      <td
                        style={{
                          padding: "18px 20px",
                        }}
                      >
                        <span
                          style={{
                            ...getSeverityStyle(severity),
                            display: "inline-flex",
                            padding: "6px 11px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {severity}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "18px 20px",
                        }}
                      >
                        <span
                          style={{
                            ...getStatusStyle(item.status),
                            display: "inline-flex",
                            padding: "6px 11px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "18px 24px",
                          color: "#64748B",
                          fontSize: "13px",
                        }}
                      >
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "15px 24px",
            borderTop: "1px solid #E2E8F0",
            background: "#FAFAFA",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            Showing {filteredAnomalies.length} backend records
          </span>

          <span
            style={{
              fontSize: "12px",
              color: "#15803D",
              fontWeight: "600",
            }}
          >
            ● API Connected
          </span>
        </div>
      </div>
    </div>
  );
}