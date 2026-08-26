import { useEffect, useState } from "react";

// ==========================================================
// PROFESSIONAL SVG ICONS
// ==========================================================

function Icon({
  name,
  size = 22,
  strokeWidth = 1.8,
  color = "currentColor",
}) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
    },
  };

  const icons = {
    ai: (
      <svg {...commonProps}>
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3" />
        <path d="M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    ),

    brain: (
      <svg {...commonProps}>
        <path d="M9.5 3.5a3.5 3.5 0 0 0-3.2 2A3.5 3.5 0 0 0 4 9a3.5 3.5 0 0 0 1.5 2.9A3.5 3.5 0 0 0 7 18a3.5 3.5 0 0 0 2.5 2.5V4.5" />
        <path d="M14.5 3.5a3.5 3.5 0 0 1 3.2 2A3.5 3.5 0 0 1 20 9a3.5 3.5 0 0 1-1.5 2.9A3.5 3.5 0 0 1 17 18a3.5 3.5 0 0 1-2.5 2.5V4.5" />
        <path d="M9.5 8h2M12.5 12h-3M14.5 8h-2M12.5 16h2" />
      </svg>
    ),

    analytics: (
      <svg {...commonProps}>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <rect x="7" y="12" width="3" height="5" rx="1" />
        <rect x="12" y="8" width="3" height="9" rx="1" />
        <rect x="17" y="4" width="3" height="13" rx="1" />
      </svg>
    ),

    recommendation: (
      <svg {...commonProps}>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8.5 14.5A6 6 0 1 1 15.5 14" />
        <path d="M12 2v2" />
        <path d="M4.9 4.9l1.4 1.4" />
        <path d="M19.1 4.9l-1.4 1.4" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </svg>
    ),

    message: (
      <svg {...commonProps}>
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4.1-.9L3 21l1.9-4.3A8.1 8.1 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" />
      </svg>
    ),

    question: (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-1 .8-1.6 1.2-1.6 2.3" />
        <path d="M12 16.5h.01" />
      </svg>
    ),

    warning: (
      <svg {...commonProps}>
        <path d="M10.3 4.2 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  };

  return icons[name] || null;
}

// ==========================================================
// MAIN COMPONENT
// ==========================================================

export default function AISupplyChainAssistant() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH AI DASHBOARD
  // ==========================================================

  useEffect(() => {
    const fetchAIDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8000/artificial-intelligence/dashboard"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load AI dashboard. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setDashboard(data);
      } catch (err) {
        console.error("AI Dashboard Error:", err);

        setError(
          "Unable to load AI Supply Chain Assistant data. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAIDashboard();
  }, []);

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "30px",
          background:
            "linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 50%, #F8FAFC 100%)",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            background: "#FFFFFF",
            borderRadius: "22px",
            padding: "55px 40px",
            textAlign: "center",
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 22px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 12px 30px rgba(37, 99, 235, 0.25)",
            }}
          >
            <Icon name="ai" size={34} color="#FFFFFF" strokeWidth={1.7} />
          </div>

          <div
            style={{
              width: "38px",
              height: "38px",
              border: "3px solid #E2E8F0",
              borderTop: "3px solid #2563EB",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          />

          <h2
            style={{
              margin: "0 0 8px",
              color: "#0F172A",
              fontSize: "22px",
              fontWeight: "750",
            }}
          >
            Loading AI Supply Chain Assistant
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Connecting to SmartChain AI...
          </p>

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
            `}
          </style>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "30px",
          background:
            "linear-gradient(135deg, #F8FAFC 0%, #FFF7F7 100%)",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "620px",
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "38px",
            border: "1px solid #FECACA",
            boxShadow: "0 15px 40px rgba(127, 29, 29, 0.08)",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              background: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#DC2626",
              marginBottom: "18px",
            }}
          >
            <Icon name="warning" size={28} color="#DC2626" />
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              color: "#991B1B",
              fontSize: "22px",
              fontWeight: "750",
            }}
          >
            AI Dashboard Unavailable
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const predictiveAnalytics = dashboard?.predictive_analytics || [];
  const recommendations = dashboard?.recommendations || [];
  const naturalLanguageQueries =
    dashboard?.natural_language_queries || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background:
          "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 55%, #F8FAFC 100%)",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0F172A",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "9px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "17px",
                background:
                  "linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow:
                  "0 12px 28px rgba(37, 99, 235, 0.28)",
              }}
            >
              <Icon
                name="ai"
                size={30}
                color="#FFFFFF"
                strokeWidth={1.6}
              />
            </div>

            <div>
              <h1
                style={{
                  fontSize: "34px",
                  fontWeight: "800",
                  margin: 0,
                  color: "#0F172A",
                  letterSpacing: "-1px",
                }}
              >
                AI Supply Chain Assistant
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginTop: "5px",
                  color: "#64748B",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22C55E",
                    boxShadow: "0 0 0 4px #DCFCE7",
                  }}
                />
                SmartChain Intelligence Layer
              </div>
            </div>
          </div>

          <p
            style={{
              margin: "12px 0 0",
              color: "#64748B",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "720px",
            }}
          >
            Intelligent supply chain insights, predictions and
            recommendations powered by SmartChain AI.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            background: "#ECFDF5",
            border: "1px solid #BBF7D0",
            color: "#166534",
            padding: "11px 16px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "700",
            boxShadow: "0 4px 12px rgba(22, 101, 52, 0.06)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.12)",
            }}
          />
          AI System Online
        </div>
      </div>

      {/* =====================================================
          AI ASSISTANT MESSAGE
      ====================================================== */}

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)",
          border: "1px solid #DBEAFE",
          borderRadius: "20px",
          padding: "26px",
          marginBottom: "26px",
          boxShadow: "0 10px 30px rgba(37, 99, 235, 0.07)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(124, 58, 237, 0.06)",
            right: "-70px",
            top: "-80px",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div
            style={{
              minWidth: "52px",
              width: "52px",
              height: "52px",
              borderRadius: "15px",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
              boxShadow: "0 6px 18px rgba(37, 99, 235, 0.12)",
              border: "1px solid #E0EAFF",
            }}
          >
            <Icon
              name="brain"
              size={28}
              color="#2563EB"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <p
              style={{
                margin: "0 0 7px",
                fontSize: "12px",
                fontWeight: "800",
                color: "#2563EB",
                textTransform: "uppercase",
                letterSpacing: "0.9px",
              }}
            >
              SmartChain AI Assistant
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                color: "#0F172A",
                fontWeight: "700",
                lineHeight: 1.5,
              }}
            >
              {dashboard?.assistant?.message ||
                "SmartChain AI is ready to assist."}
            </h2>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {/* PREDICTIVE INSIGHTS */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "17px",
            padding: "22px",
            boxShadow: "0 7px 20px rgba(15, 23, 42, 0.045)",
            transition: "transform 0.2s ease",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "13px",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
              marginBottom: "16px",
              border: "1px solid #DBEAFE",
            }}
          >
            <Icon
              name="analytics"
              size={23}
              color="#2563EB"
            />
          </div>

          <p
            style={{
              margin: "0 0 5px",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            Predictive Insights
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "31px",
              fontWeight: "800",
              color: "#0F172A",
              letterSpacing: "-0.5px",
            }}
          >
            {predictiveAnalytics.length}
          </h2>
        </div>

        {/* RECOMMENDATIONS */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "17px",
            padding: "22px",
            boxShadow: "0 7px 20px rgba(15, 23, 42, 0.045)",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "13px",
              background: "#F0FDF4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16A34A",
              marginBottom: "16px",
              border: "1px solid #DCFCE7",
            }}
          >
            <Icon
              name="recommendation"
              size={23}
              color="#16A34A"
            />
          </div>

          <p
            style={{
              margin: "0 0 5px",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            AI Recommendations
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "31px",
              fontWeight: "800",
              color: "#0F172A",
              letterSpacing: "-0.5px",
            }}
          >
            {recommendations.length}
          </h2>
        </div>

        {/* NATURAL LANGUAGE */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "17px",
            padding: "22px",
            boxShadow: "0 7px 20px rgba(15, 23, 42, 0.045)",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "13px",
              background: "#FFFBEB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D97706",
              marginBottom: "16px",
              border: "1px solid #FEF3C7",
            }}
          >
            <Icon
              name="message"
              size={23}
              color="#D97706"
            />
          </div>

          <p
            style={{
              margin: "0 0 5px",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            Natural Language Queries
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "31px",
              fontWeight: "800",
              color: "#0F172A",
              letterSpacing: "-0.5px",
            }}
          >
            {naturalLanguageQueries.length}
          </h2>
        </div>
      </div>

      {/* =====================================================
          PREDICTIVE ANALYTICS
      ====================================================== */}

      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "20px",
          padding: "26px",
          marginBottom: "25px",
          boxShadow: "0 7px 22px rgba(15, 23, 42, 0.045)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "21px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9px",
                  background: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563EB",
                }}
              >
                <Icon
                  name="analytics"
                  size={17}
                  color="#2563EB"
                />
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  color: "#0F172A",
                  fontWeight: "750",
                }}
              >
                Predictive Analytics
              </h2>
            </div>

            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              AI-generated predictions and confidence levels.
            </p>
          </div>

          <span
            style={{
              background: "#EFF6FF",
              color: "#1D4ED8",
              padding: "8px 13px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "750",
              border: "1px solid #DBEAFE",
            }}
          >
            {predictiveAnalytics.length} Predictions
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {predictiveAnalytics.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "15px",
                padding: "20px",
                background:
                  "linear-gradient(135deg, #F8FAFC, #FFFFFF)",
                boxShadow:
                  "0 4px 12px rgba(15, 23, 42, 0.025)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Prediction {index + 1}
                </span>

                <span
                  style={{
                    background: "#ECFDF5",
                    color: "#166534",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "750",
                    border: "1px solid #BBF7D0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.confidence}% Confidence
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  fontWeight: "650",
                }}
              >
                {item.prediction}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          INTELLIGENT RECOMMENDATIONS
      ====================================================== */}

      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "20px",
          padding: "26px",
          marginBottom: "25px",
          boxShadow: "0 7px 22px rgba(15, 23, 42, 0.045)",
        }}
      >
        <div style={{ marginBottom: "21px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "#F0FDF4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#16A34A",
              }}
            >
              <Icon
                name="recommendation"
                size={17}
                color="#16A34A"
              />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                color: "#0F172A",
                fontWeight: "750",
              }}
            >
              Intelligent Recommendations
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Recommended actions based on current supply chain
            intelligence.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {recommendations.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "15px",
                padding: "20px",
                background: "#FFFFFF",
                boxShadow:
                  "0 5px 15px rgba(15, 23, 42, 0.035)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "#F0FDF4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#16A34A",
                    border: "1px solid #DCFCE7",
                  }}
                >
                  <Icon
                    name="recommendation"
                    size={20}
                    color="#16A34A"
                  />
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    color: "#0F172A",
                    fontWeight: "700",
                  }}
                >
                  {item.title}
                </h3>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          NATURAL LANGUAGE QUERIES
      ====================================================== */}

      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "20px",
          padding: "26px",
          boxShadow: "0 7px 22px rgba(15, 23, 42, 0.045)",
        }}
      >
        <div style={{ marginBottom: "21px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "#FFFBEB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D97706",
              }}
            >
              <Icon
                name="message"
                size={17}
                color="#D97706"
              />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                color: "#0F172A",
                fontWeight: "750",
              }}
            >
              Natural Language Queries
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Questions answered by the SmartChain AI intelligence
            layer.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {naturalLanguageQueries.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "15px",
                padding: "18px",
                background:
                  "linear-gradient(135deg, #F8FAFC, #FFFFFF)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    minWidth: "38px",
                    width: "38px",
                    height: "38px",
                    borderRadius: "11px",
                    background: "#FFFBEB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D97706",
                    border: "1px solid #FEF3C7",
                  }}
                >
                  <Icon
                    name="question"
                    size={19}
                    color="#D97706"
                  />
                </div>

                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      color: "#64748B",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      marginBottom: "5px",
                    }}
                  >
                    Question
                  </span>

                  <p
                    style={{
                      margin: 0,
                      color: "#0F172A",
                      fontWeight: "700",
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.question}
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginLeft: "50px",
                  padding: "14px 16px",
                  background: "#FFFFFF",
                  borderRadius: "11px",
                  border: "1px solid #E2E8F0",
                  boxShadow:
                    "0 3px 10px rgba(15, 23, 42, 0.025)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: "#2563EB",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    marginBottom: "6px",
                  }}
                >
                  AI Answer
                </span>

                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}