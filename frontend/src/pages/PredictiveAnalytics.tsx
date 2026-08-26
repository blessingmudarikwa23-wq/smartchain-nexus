import { useEffect, useState } from "react";

// ==========================================================
// PROFESSIONAL SVG ICONS
// ==========================================================

const Icons = {
  Forecast: ({ size = 22, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 19V5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 19H20"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 15L10 11L13 13L19 6"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6H19V9"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Target: ({ size = 22, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke={stroke}
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke={stroke}
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill={stroke}
      />
    </svg>
  ),

  Activity: ({ size = 22, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 12H6L9 5L13 19L16 12H21"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Brain: ({ size = 24, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.5 4.5C8.4 3.4 6.6 3.4 5.5 4.5C4.4 5.6 4.4 7.4 5.5 8.5C3.8 8.8 2.5 10.3 2.5 12C2.5 13.7 3.8 15.2 5.5 15.5C4.4 16.6 4.4 18.4 5.5 19.5C6.6 20.6 8.4 20.6 9.5 19.5C10.2 20.1 11.1 20.5 12 20.5V3.5C11.1 3.5 10.2 3.9 9.5 4.5Z"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 4.5C15.6 3.4 17.4 3.4 18.5 4.5C19.6 5.6 19.6 7.4 18.5 8.5C20.2 8.8 21.5 10.3 21.5 12C21.5 13.7 20.2 15.2 18.5 15.5C19.6 16.6 19.6 18.4 18.5 19.5C17.4 20.6 15.6 20.6 14.5 19.5C13.8 20.1 12.9 20.5 12 20.5V3.5C12.9 3.5 13.8 3.9 14.5 4.5Z"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.5C8.8 8.5 9.5 9.2 9.5 10"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 8.5C15.2 8.5 14.5 9.2 14.5 10"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 15.5C8.8 15.5 9.5 14.8 9.5 14"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 15.5C15.2 15.5 14.5 14.8 14.5 14"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  Database: ({ size = 22, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="5"
        rx="8"
        ry="3"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M4 5V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V5"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M4 12V19C4 20.66 7.58 22 12 22C16.42 22 20 20.66 20 19V12"
        stroke={stroke}
        strokeWidth="2"
      />
    </svg>
  ),

  Spark: ({ size = 22, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3L13.6 8.4L19 10L13.6 11.6L12 17L10.4 11.6L5 10L10.4 8.4L12 3Z"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 16L19.8 18.2L22 19L19.8 19.8L19 22L18.2 19.8L16 19L18.2 18.2L19 16Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Robot: ({ size = 30, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="7"
        width="16"
        height="13"
        rx="3"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M12 3V7"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="13"
        r="1.3"
        fill={stroke}
      />
      <circle
        cx="15"
        cy="13"
        r="1.3"
        fill={stroke}
      />
      <path
        d="M8 17H16"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M2 11V16"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 11V16"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  Alert: ({ size = 25, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3L21 19H3L12 3Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9V13"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="16.5"
        r="1"
        fill={stroke}
      />
    </svg>
  ),

  Chart: ({ size = 30, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 19V5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 19H20"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="7"
        y="12"
        width="2.5"
        height="5"
        rx="0.7"
        fill={stroke}
      />
      <rect
        x="11"
        y="9"
        width="2.5"
        height="8"
        rx="0.7"
        fill={stroke}
      />
      <rect
        x="15"
        y="6"
        width="2.5"
        height="11"
        rx="0.7"
        fill={stroke}
      />
    </svg>
  ),

  Chevron: ({ size = 18, stroke = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH PREDICTIONS
  // ==========================================================

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8000/artificial-intelligence/predictive-analytics"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load predictive analytics (${response.status})`
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPredictions(data);
        } else {
          setPredictions([]);
        }
      } catch (err) {
        console.error("Predictive Analytics Error:", err);
        setError(
          "Unable to load predictive analytics. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalPredictions = predictions.length;

  const averageConfidence =
    predictions.length > 0
      ? Math.round(
          predictions.reduce(
            (total, item) => total + Number(item.confidence || 0),
            0
          ) / predictions.length
        )
      : 0;

  const activePredictions = predictions.filter(
    (item) => item.status?.toLowerCase() === "active"
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#2563EB",
                letterSpacing: "0.5px",
              }}
            >
              ARTIFICIAL INTELLIGENCE
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: "700",
                color: "#0F172A",
                letterSpacing: "-0.8px",
              }}
            >
              Predictive Analytics
            </h1>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                fontSize: "15px",
                color: "#64748B",
                maxWidth: "700px",
                lineHeight: "1.6",
              }}
            >
              AI-powered predictions and confidence insights for smarter
              supply chain decisions.
            </p>
          </div>

          {/* LIVE AI DATA */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              padding: "10px 16px",
              color: "#475569",
              fontSize: "13px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 0 4px #DCFCE7",
              }}
            />

            Live AI Data
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "15px 18px",
            borderRadius: "10px",
            marginBottom: "25px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Icons.Alert size={20} stroke="#B91C1C" />

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* TOTAL PREDICTIONS */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #DBEAFE",
            borderRadius: "14px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px",
              color: "#2563EB",
            }}
          >
            <Icons.Forecast size={22} stroke="#2563EB" />
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Total Predictions
          </p>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "30px",
              color: "#0F172A",
            }}
          >
            {loading ? "—" : totalPredictions}
          </h2>
        </div>

        {/* AVERAGE CONFIDENCE */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #DCFCE7",
            borderRadius: "14px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px",
              color: "#16A34A",
            }}
          >
            <Icons.Target size={22} stroke="#16A34A" />
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Average Confidence
          </p>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "30px",
              color: "#0F172A",
            }}
          >
            {loading ? "—" : `${averageConfidence}%`}
          </h2>
        </div>

        {/* ACTIVE PREDICTIONS */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #FEF3C7",
            borderRadius: "14px",
            padding: "22px",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px",
              color: "#D97706",
            }}
          >
            <Icons.Activity size={22} stroke="#D97706" />
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Active Predictions
          </p>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "30px",
              color: "#0F172A",
            }}
          >
            {loading ? "—" : activePredictions}
          </h2>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
        }}
      >
        {/* =================================================
            TABLE HEADER
        ================================================== */}

        <div
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid #E2E8F0",
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
              gap: "13px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "11px",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.Brain size={22} stroke="#2563EB" />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color: "#0F172A",
                }}
              >
                AI Predictions
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Predictions returned directly from the SmartChain AI
                backend.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "7px 12px",
              borderRadius: "20px",
              background: "#EFF6FF",
              color: "#2563EB",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {loading ? "Loading..." : `${totalPredictions} records`}
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "14px",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                animation: "pulseAI 1.5s ease-in-out infinite",
              }}
            >
              <Icons.Robot size={30} stroke="#2563EB" />
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Loading AI predictions...
            </p>

            <p
              style={{
                margin: "7px 0 0",
                fontSize: "13px",
                color: "#94A3B8",
              }}
            >
              Connecting to SmartChain intelligence layer
            </p>

            <style>
              {`
                @keyframes pulseAI {
                  0% {
                    transform: scale(1);
                    opacity: 1;
                  }

                  50% {
                    transform: scale(1.08);
                    opacity: 0.65;
                  }

                  100% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </div>
        ) : predictions.length === 0 ? (
          /* =================================================
             EMPTY STATE
          ================================================== */

          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icons.Chart size={30} stroke="#2563EB" />
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#0F172A",
                fontSize: "18px",
              }}
            >
              No predictions available
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
              }}
            >
              There are currently no predictive analytics records in the
              backend.
            </p>
          </div>
        ) : (
          /* =================================================
             TABLE
          ================================================== */

          <div
            style={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "700px",
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
                      padding: "16px 20px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Category
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    AI Prediction
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Confidence
                  </th>

                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {predictions.map((item, index) => {
                  const confidence = Number(item.confidence || 0);

                  return (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                      }}
                    >
                      {/* CATEGORY */}

                      <td
                        style={{
                          padding: "18px 20px",
                          color: "#0F172A",
                          fontWeight: "600",
                          fontSize: "14px",
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
                              width: "34px",
                              height: "34px",
                              borderRadius: "9px",
                              background: "#EFF6FF",
                              color: "#2563EB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icons.Database
                              size={18}
                              stroke="#2563EB"
                            />
                          </div>

                          <span>{item.category}</span>
                        </div>
                      </td>

                      {/* AI PREDICTION */}

                      <td
                        style={{
                          padding: "18px 20px",
                          color: "#475569",
                          fontSize: "14px",
                          lineHeight: "1.5",
                        }}
                      >
                        {item.prediction}
                      </td>

                      {/* CONFIDENCE */}

                      <td
                        style={{
                          padding: "18px 20px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "80px",
                              height: "7px",
                              background: "#E2E8F0",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(
                                  Math.max(confidence, 0),
                                  100
                                )}%`,
                                height: "100%",
                                background:
                                  confidence >= 80
                                    ? "#16A34A"
                                    : confidence >= 60
                                    ? "#2563EB"
                                    : "#D97706",
                                borderRadius: "10px",
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              fontWeight: "700",
                              color: "#0F172A",
                              fontSize: "13px",
                            }}
                          >
                            {confidence}%
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          padding: "18px 20px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background:
                              item.status?.toLowerCase() === "active"
                                ? "#DCFCE7"
                                : "#F1F5F9",
                            color:
                              item.status?.toLowerCase() === "active"
                                ? "#166534"
                                : "#475569",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background:
                                item.status?.toLowerCase() === "active"
                                  ? "#16A34A"
                                  : "#94A3B8",
                            }}
                          />

                          {item.status || "Unknown"}
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