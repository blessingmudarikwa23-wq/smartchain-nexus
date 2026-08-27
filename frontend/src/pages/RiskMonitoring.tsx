import { useEffect, useState } from "react";

type Risk = {
  id: number;
  risk_name: string;
  category: string;
  score: number;
  severity: string;
  description: string | null;
  period: string;
};

type RiskSummary = {
  title: string;
  value: number;
  color: string;
  icon: string;
};

/* ==========================================================
   PROFESSIONAL SVG ICON
========================================================== */

function ProfessionalIcon({
  name,
  size = 24,
  stroke = "currentColor",
}: {
  name: string;
  size?: number;
  stroke?: string;
}) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "factory":
      return (
        <svg {...commonProps}>
          <path d="M3 21V9l7 4V9l7 4V5h4v16H3Z" />
          <path d="M7 21v-4" />
          <path d="M11 21v-4" />
          <path d="M15 21v-4" />
          <path d="M19 21v-4" />
        </svg>
      );

    case "inventory":
      return (
        <svg {...commonProps}>
          <path d="M21 8.5 12 4 3 8.5l9 4.5 9-4.5Z" />
          <path d="M3 8.5V16l9 4 9-4V8.5" />
          <path d="M12 13v7" />
          <path d="m7.5 6.25 9 4.5" />
        </svg>
      );

    case "truck":
      return (
        <svg {...commonProps}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "finance":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10" />
          <path d="M15 9.5c-.7-1-1.7-1.5-3-1.5-1.7 0-3 1-3 2.3 0 3.4 6 1.7 6 5 0 1.4-1.3 2.7-3 2.7-1.3 0-2.5-.5-3.2-1.5" />
        </svg>
      );

    case "operations":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.6v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.4V14h-.4a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );

    case "customers":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
          <path d="M15 14c3 0 5 1.8 5 4.5" />
        </svg>
      );

    case "alert":
      return (
        <svg {...commonProps}>
          <path d="M12 3 2.8 20h18.4L12 3Z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r=".8" fill="currentColor" />
        </svg>
      );

    case "critical":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6" />
          <circle cx="12" cy="16.5" r=".8" fill="currentColor" />
        </svg>
      );

    case "high":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8" />
        </svg>
      );

    case "medium":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      );

    case "low":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-6" />
          <circle cx="7" cy="15" r="1" />
          <circle cx="10" cy="11" r="1" />
          <circle cx="13" cy="13" r="1" />
          <circle cx="18" cy="7" r="1" />
        </svg>
      );

    case "trend":
      return (
        <svg {...commonProps}>
          <path d="m4 16 5-5 3 3 7-8" />
          <path d="M14 6h5v5" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...commonProps}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );

    case "activity":
      return (
        <svg {...commonProps}>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function RiskMonitoring() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRisks();
  }, []);

  async function loadRisks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://smartchain-nexus-3.onrender.com/executive-intelligence/risk-monitoring/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch risk monitoring data");
      }

      const data = await response.json();

      console.log("Risk Monitoring data:", data);

      setRisks(data);
    } catch (error) {
      console.error("Failed to load risk monitoring:", error);

      setError("Unable to load risk monitoring data.");
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     SEVERITY COLORS
  ========================================================== */

  function getSeverityColor(severity: string) {
    const value = severity.toLowerCase();

    if (value === "critical") {
      return "#991B1B";
    }

    if (value === "high") {
      return "#DC2626";
    }

    if (value === "medium") {
      return "#D97706";
    }

    return "#16A34A";
  }

  function getSeverityBackground(severity: string) {
    const value = severity.toLowerCase();

    if (value === "critical") {
      return "#FEF2F2";
    }

    if (value === "high") {
      return "#FEF2F2";
    }

    if (value === "medium") {
      return "#FFFBEB";
    }

    return "#F0FDF4";
  }

  /* ==========================================================
     PROFESSIONAL CATEGORY ICONS
  ========================================================== */

  function getRiskIcon(category: string) {
    const value = category.toLowerCase();

    if (value.includes("supplier")) {
      return "factory";
    }

    if (value.includes("inventory")) {
      return "inventory";
    }

    if (value.includes("logistics")) {
      return "truck";
    }

    if (value.includes("financial")) {
      return "finance";
    }

    if (value.includes("operational")) {
      return "operations";
    }

    if (value.includes("customer")) {
      return "customers";
    }

    return "alert";
  }

  /* ==========================================================
     RISK SCORE
  ========================================================== */

  function getRiskScoreColor(score: number) {
    if (score >= 80) {
      return "#DC2626";
    }

    if (score >= 50) {
      return "#D97706";
    }

    return "#16A34A";
  }

  function getRiskScoreWidth(score: number) {
    return `${Math.min(Math.max(score, 0), 100)}%`;
  }

  /* ==========================================================
     KPI SUMMARY
  ========================================================== */

  const severitySummary: RiskSummary[] = [
    {
      title: "Critical Risks",
      value: risks.filter(
        (risk) => risk.severity.toLowerCase() === "critical"
      ).length,
      color: "#991B1B",
      icon: "critical",
    },
    {
      title: "High Risks",
      value: risks.filter(
        (risk) => risk.severity.toLowerCase() === "high"
      ).length,
      color: "#DC2626",
      icon: "high",
    },
    {
      title: "Medium Risks",
      value: risks.filter(
        (risk) => risk.severity.toLowerCase() === "medium"
      ).length,
      color: "#D97706",
      icon: "medium",
    },
    {
      title: "Low Risks",
      value: risks.filter(
        (risk) => risk.severity.toLowerCase() === "low"
      ).length,
      color: "#16A34A",
      icon: "low",
    },
  ];

  const criticalCount = severitySummary[0].value;
  const highCount = severitySummary[1].value;
  const mediumCount = severitySummary[2].value;
  const lowCount = severitySummary[3].value;

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F4F7FB",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#E8F0FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProfessionalIcon name="shield" size={25} />
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.8px",
              }}
            >
              Risk Monitoring
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "15px",
            }}
          >
            Loading enterprise risk intelligence...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F7FB",
        padding: "30px 40px 50px",
        boxSizing: "border-box",
        color: "#0F172A",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
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
            gap: "25px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "9px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#16A34A",
                  display: "inline-block",
                  boxShadow: "0 0 0 5px rgba(22,163,74,0.10)",
                }}
              />

              <span
                style={{
                  color: "#16A34A",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                }}
              >
                Live Intelligence
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: "-1px",
                color: "#0F172A",
              }}
            >
              Risk Monitoring
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                color: "#64748B",
                fontSize: "15px",
                lineHeight: 1.5,
              }}
            >
              Real-time visibility across enterprise risks,
              exposure and operational resilience.
            </p>
          </div>

          {/* Intelligence card */}

          <div
            style={{
              minWidth: "270px",
              background: "#FFFFFF",
              border: "1px solid #E5EAF2",
              borderRadius: "16px",
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProfessionalIcon name="analytics" size={25} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                SmartChain
              </div>

              <div
                style={{
                  fontSize: "16px",
                  color: "#2563EB",
                  fontWeight: 800,
                }}
              >
                Risk Intelligence
              </div>
            </div>

            <div style={{ color: "#64748B" }}>
              <ProfessionalIcon name="chevron" size={20} />
            </div>
          </div>
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
              padding: "16px 18px",
              borderRadius: "12px",
              marginBottom: "25px",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ProfessionalIcon name="alert" size={19} />
            {error}
          </div>
        )}

        {!error && (
          <>
            {/* ==================================================
                KPI SECTION
            ================================================== */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Key Risk Indicators
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginBottom: "34px",
              }}
            >
              {severitySummary.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E4E9F1",
                    borderRadius: "16px",
                    padding: "21px",
                    minHeight: "145px",
                    boxShadow:
                      "0 7px 20px rgba(15,23,42,0.045)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#64748B",
                          fontSize: "13px",
                          fontWeight: 650,
                          marginBottom: "7px",
                        }}
                      >
                        {item.title}
                      </div>

                      <div
                        style={{
                          fontSize: "31px",
                          lineHeight: 1,
                          fontWeight: 800,
                          color: "#0F172A",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>

                    <div
                      style={{
                        width: "49px",
                        height: "49px",
                        borderRadius: "14px",
                        background: `${item.color}12`,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ProfessionalIcon
                        name={item.icon}
                        size={25}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: item.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* ==================================================
                RISK OVERVIEW STRIP
            ================================================== */}

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E4E9F1",
                borderRadius: "15px",
                padding: "17px 22px",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
                boxShadow:
                  "0 5px 18px rgba(15,23,42,0.035)",
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
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#EFF6FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ProfessionalIcon
                    name="activity"
                    size={20}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 750,
                      color: "#0F172A",
                    }}
                  >
                    Enterprise Risk Overview
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                      marginTop: "2px",
                    }}
                  >
                    Current exposure across monitored business areas
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "22px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    Total Risks
                  </span>

                  <strong
                    style={{
                      marginLeft: "7px",
                      fontSize: "14px",
                      color: "#0F172A",
                    }}
                  >
                    {risks.length}
                  </strong>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "25px",
                    background: "#E2E8F0",
                  }}
                />

                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    Elevated
                  </span>

                  <strong
                    style={{
                      marginLeft: "7px",
                      fontSize: "14px",
                      color: "#DC2626",
                    }}
                  >
                    {criticalCount + highCount}
                  </strong>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "25px",
                    background: "#E2E8F0",
                  }}
                />

                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    Moderate
                  </span>

                  <strong
                    style={{
                      marginLeft: "7px",
                      fontSize: "14px",
                      color: "#D97706",
                    }}
                  >
                    {mediumCount}
                  </strong>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "25px",
                    background: "#E2E8F0",
                  }}
                />

                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    Controlled
                  </span>

                  <strong
                    style={{
                      marginLeft: "7px",
                      fontSize: "14px",
                      color: "#16A34A",
                    }}
                  >
                    {lowCount}
                  </strong>
                </div>
              </div>
            </div>

            {/* ==================================================
                ENTERPRISE RISK REGISTER
            ================================================== */}

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E4E9F1",
                borderRadius: "17px",
                boxShadow:
                  "0 8px 25px rgba(15,23,42,0.05)",
                overflow: "hidden",
              }}
            >
              {/* REGISTER HEADER */}

              <div
                style={{
                  padding: "22px 24px",
                  borderBottom: "1px solid #E7ECF2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
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
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "#EFF6FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ProfessionalIcon
                      name="shield"
                      size={21}
                    />
                  </div>

                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "19px",
                        fontWeight: 800,
                        color: "#0F172A",
                      }}
                    >
                      Enterprise Risk Register
                    </h2>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#64748B",
                        fontSize: "13px",
                      }}
                    >
                      Monitor identified risks, severity,
                      exposure and business impact.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "8px 12px",
                    borderRadius: "9px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    color: "#475569",
                    fontSize: "12px",
                    fontWeight: 650,
                  }}
                >
                  <ProfessionalIcon
                    name="calendar"
                    size={15}
                  />
                  {risks.length} Records
                </div>
              </div>

              {/* ==================================================
                  EMPTY STATE
              ================================================== */}

              {risks.length === 0 ? (
                <div
                  style={{
                    padding: "65px 30px",
                    background: "#F8FAFC",
                    margin: "24px",
                    borderRadius: "13px",
                    textAlign: "center",
                    color: "#64748B",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "16px",
                      background: "#EFF6FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <ProfessionalIcon
                      name="shield"
                      size={31}
                    />
                  </div>

                  <strong
                    style={{
                      display: "block",
                      color: "#334155",
                      fontSize: "16px",
                      marginBottom: "6px",
                    }}
                  >
                    No Risk Records
                  </strong>

                  <span
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    No enterprise risk records are currently
                    available.
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    padding: "22px",
                    display: "grid",
                    gap: "14px",
                  }}
                >
                  {risks.map((risk) => {
                    const severityColor =
                      getSeverityColor(risk.severity);

                    const severityBackground =
                      getSeverityBackground(risk.severity);

                    const scoreColor =
                      getRiskScoreColor(risk.score);

                    return (
                      <div
                        key={risk.id}
                        style={{
                          background: "#F8FAFC",
                          borderRadius: "14px",
                          padding: "21px",
                          border: "1px solid #E2E8F0",
                          borderLeft: `4px solid ${severityColor}`,
                          transition:
                            "transform .2s ease, box-shadow .2s ease",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "28px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* RISK INFORMATION */}

                          <div
                            style={{
                              flex: 1,
                              minWidth: "280px",
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
                                  width: "46px",
                                  height: "46px",
                                  borderRadius: "12px",
                                  background: "#FFFFFF",
                                  color: "#2563EB",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border:
                                    "1px solid #E4E9F1",
                                  boxShadow:
                                    "0 3px 10px rgba(15,23,42,.04)",
                                }}
                              >
                                <ProfessionalIcon
                                  name={getRiskIcon(
                                    risk.category
                                  )}
                                  size={24}
                                />
                              </div>

                              <div>
                                <h3
                                  style={{
                                    margin: 0,
                                    color: "#0F172A",
                                    fontSize: "16px",
                                    fontWeight: 800,
                                  }}
                                >
                                  {risk.risk_name}
                                </h3>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginTop: "5px",
                                    color: "#64748B",
                                    fontSize: "12px",
                                  }}
                                >
                                  <ProfessionalIcon
                                    name="analytics"
                                    size={13}
                                  />
                                  {risk.category}
                                </div>
                              </div>
                            </div>

                            {risk.description && (
                              <p
                                style={{
                                  margin: "14px 0 0",
                                  color: "#475569",
                                  fontSize: "13px",
                                  lineHeight: 1.6,
                                  maxWidth: "800px",
                                }}
                              >
                                {risk.description}
                              </p>
                            )}
                          </div>

                          {/* RISK METRICS */}

                          <div
                            style={{
                              minWidth: "240px",
                              width: "240px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems: "center",
                                marginBottom: "9px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#64748B",
                                  fontWeight: 750,
                                  textTransform: "uppercase",
                                  letterSpacing: ".6px",
                                }}
                              >
                                Risk Level
                              </span>

                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "5px 9px",
                                  borderRadius: "20px",
                                  background:
                                    severityBackground,
                                  color: severityColor,
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  textTransform:
                                    "uppercase",
                                  letterSpacing: ".5px",
                                }}
                              >
                                <span
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background:
                                      severityColor,
                                  }}
                                />

                                {risk.severity}
                              </span>
                            </div>

                            {/* SCORE BAR */}

                            <div
                              style={{
                                width: "100%",
                                height: "7px",
                                background: "#E2E8F0",
                                borderRadius: "20px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width:
                                    getRiskScoreWidth(
                                      risk.score
                                    ),
                                  height: "100%",
                                  background:
                                    scoreColor,
                                  borderRadius: "20px",
                                  transition:
                                    "width .4s ease",
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems: "center",
                                marginTop: "9px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#64748B",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                }}
                              >
                                Risk Score
                              </span>

                              <strong
                                style={{
                                  color: scoreColor,
                                  fontSize: "20px",
                                  fontWeight: 800,
                                }}
                              >
                                {risk.score}
                              </strong>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                marginTop: "8px",
                                color: "#94A3B8",
                                fontSize: "11px",
                              }}
                            >
                              <ProfessionalIcon
                                name="calendar"
                                size={13}
                              />

                              {risk.period}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* REGISTER FOOTER */}

              {risks.length > 0 && (
                <div
                  style={{
                    padding: "15px 22px",
                    borderTop: "1px solid #E7ECF2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    flexWrap: "wrap",
                    color: "#64748B",
                    fontSize: "12px",
                  }}
                >
                  <span>
                    Showing{" "}
                    <strong
                      style={{
                        color: "#334155",
                      }}
                    >
                      {risks.length}
                    </strong>{" "}
                    monitored risk records
                  </span>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#16A34A",
                      }}
                    />

                    Monitoring active
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}