import { useEffect, useMemo, useState } from "react";

type OperationalPerformanceData = {
  id: number;
  metric_name: string;
  value: number;
  target: number;
  unit: string;
  period: string;
  status: string;
};

const API_URL =
  "http://127.0.0.1:8000/executive-intelligence/operational-performance/";

type IconName =
  | "analytics"
  | "delivery"
  | "inventory"
  | "supplier"
  | "efficiency"
  | "quality"
  | "fulfillment"
  | "cost"
  | "performance";

function ProfessionalIcon({
  name,
  color,
}: {
  name: IconName;
  color: string;
}) {
  const commonProps = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "analytics":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19H20" />
          <path d="M7 15l3-4 3 2 5-6" />
          <circle cx="7" cy="15" r="1" fill={color} />
          <circle cx="10" cy="11" r="1" fill={color} />
          <circle cx="13" cy="13" r="1" fill={color} />
          <circle cx="18" cy="7" r="1" fill={color} />
        </svg>
      );

    case "delivery":
      return (
        <svg {...commonProps}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 9h4l3 3v4h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M14 13h7" />
        </svg>
      );

    case "inventory":
      return (
        <svg {...commonProps}>
          <path d="M4 8l8-4 8 4-8 4-8-4z" />
          <path d="M4 8v8l8 4 8-4V8" />
          <path d="M12 12v8" />
          <path d="M8 6l8 4" />
        </svg>
      );

    case "supplier":
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="8" r="3" />
          <path d="M3 19c.8-3 2.5-4.5 5-4.5S12.2 16 13 19" />
          <path d="M11 15c.8-.8 1.8-1.2 3-1.2 2.5 0 4.2 1.2 5 4.2" />
          <path d="M10 10l4 4" />
        </svg>
      );

    case "efficiency":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
          <path d="M8 4l-2-2" />
          <path d="M16 4l2-2" />
        </svg>
      );

    case "quality":
      return (
        <svg {...commonProps}>
          <path d="M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3z" />
          <path d="M8.5 12l2.2 2.2 4.8-5" />
        </svg>
      );

    case "fulfillment":
      return (
        <svg {...commonProps}>
          <path d="M4 7l8-4 8 4-8 4-8-4z" />
          <path d="M4 7v10l8 4 8-4V7" />
          <path d="M12 11v10" />
          <path d="M8 5l8 4" />
        </svg>
      );

    case "cost":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v10" />
          <path d="M15 9c-.7-1-1.6-1.5-3-1.5-1.6 0-2.7.8-2.7 2s1.1 2 2.7 2 2.7.8 2.7 2-1.1 2-2.7 2c-1.4 0-2.3-.5-3-1.5" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19H20" />
          <path d="M7 15l3-4 3 2 5-6" />
        </svg>
      );
  }
}

export default function OperationalPerformance() {
  const [operationalData, setOperationalData] = useState<
    OperationalPerformanceData[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperationalPerformance();
  }, []);

  async function loadOperationalPerformance() {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load Operational Performance"
        );
      }

      const data: OperationalPerformanceData[] =
        await response.json();

      console.log(
        "Operational Performance data:",
        data
      );

      setOperationalData(data);
    } catch (error) {
      console.error(
        "Failed to load Operational Performance:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function normalizeStatus(status: string) {
    return status.trim().toLowerCase();
  }

  function getStatusColor(status: string) {
    const normalized = normalizeStatus(status);

    if (
      normalized.includes("on track") ||
      normalized.includes("healthy") ||
      normalized.includes("good") ||
      normalized.includes("improving")
    ) {
      return "#059669";
    }

    if (
      normalized.includes("attention") ||
      normalized.includes("warning") ||
      normalized.includes("pending")
    ) {
      return "#D97706";
    }

    if (
      normalized.includes("critical") ||
      normalized.includes("poor") ||
      normalized.includes("declining")
    ) {
      return "#DC2626";
    }

    return "#2563EB";
  }

  function getStatusBackground(status: string) {
    const normalized = normalizeStatus(status);

    if (
      normalized.includes("on track") ||
      normalized.includes("healthy") ||
      normalized.includes("good") ||
      normalized.includes("improving")
    ) {
      return "#ECFDF5";
    }

    if (
      normalized.includes("attention") ||
      normalized.includes("warning") ||
      normalized.includes("pending")
    ) {
      return "#FFFBEB";
    }

    if (
      normalized.includes("critical") ||
      normalized.includes("poor") ||
      normalized.includes("declining")
    ) {
      return "#FEF2F2";
    }

    return "#EFF6FF";
  }

  function getIcon(metricName: string): IconName {
    const metric = metricName.toLowerCase();

    if (
      metric.includes("processing") ||
      metric.includes("order")
    ) {
      return "analytics";
    }

    if (
      metric.includes("delivery") ||
      metric.includes("lead")
    ) {
      return "delivery";
    }

    if (
      metric.includes("inventory") ||
      metric.includes("stock")
    ) {
      return "inventory";
    }

    if (
      metric.includes("supplier") ||
      metric.includes("vendor")
    ) {
      return "supplier";
    }

    if (
      metric.includes("efficiency") ||
      metric.includes("productivity")
    ) {
      return "efficiency";
    }

    if (
      metric.includes("quality") ||
      metric.includes("defect")
    ) {
      return "quality";
    }

    if (
      metric.includes("fulfillment") ||
      metric.includes("service")
    ) {
      return "fulfillment";
    }

    if (
      metric.includes("cost") ||
      metric.includes("expense")
    ) {
      return "cost";
    }

    return "performance";
  }

  function formatNumber(value: number) {
    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function getMetricDirection(metricName: string) {
    const metric = metricName.toLowerCase();

    const lowerIsBetterKeywords = [
      "processing time",
      "lead time",
      "delivery time",
      "cycle time",
      "cost",
      "expense",
      "defect",
      "error",
      "downtime",
      "delay",
      "return rate",
      "failure rate",
    ];

    return lowerIsBetterKeywords.some((keyword) =>
      metric.includes(keyword)
    )
      ? "lower"
      : "higher";
  }

  function calculateProgress(
    item: OperationalPerformanceData
  ) {
    if (item.target === 0) {
      return item.value === 0 ? 100 : 0;
    }

    const direction = getMetricDirection(
      item.metric_name
    );

    let progress = 0;

    if (direction === "lower") {
      if (item.value <= item.target) {
        progress = 100;
      } else {
        progress =
          (item.target / item.value) * 100;
      }
    } else {
      progress =
        (item.value / item.target) * 100;
    }

    return Math.max(
      0,
      Math.min(100, progress)
    );
  }

  function calculateVariance(
    item: OperationalPerformanceData
  ) {
    if (item.target === 0) {
      return 0;
    }

    return (
      ((item.value - item.target) /
        Math.abs(item.target)) *
      100
    );
  }

  function getVarianceLabel(
    item: OperationalPerformanceData
  ) {
    const direction = getMetricDirection(
      item.metric_name
    );

    const variance = calculateVariance(item);

    if (Math.abs(variance) < 0.01) {
      return "On Target";
    }

    if (direction === "lower") {
      return variance < 0
        ? "Better"
        : "Above Target";
    }

    return variance > 0
      ? "Better"
      : "Below Target";
  }

  function getVarianceColor(
    item: OperationalPerformanceData
  ) {
    const direction = getMetricDirection(
      item.metric_name
    );

    const variance = calculateVariance(item);

    if (Math.abs(variance) < 0.01) {
      return "#2563EB";
    }

    const isPositive =
      direction === "lower"
        ? variance < 0
        : variance > 0;

    return isPositive
      ? "#059669"
      : "#DC2626";
  }

  const summary = useMemo(() => {
    if (operationalData.length === 0) {
      return {
        total: 0,
        onTrack: 0,
        attention: 0,
        critical: 0,
      };
    }

    return {
      total: operationalData.length,

      onTrack: operationalData.filter((item) => {
        const status =
          normalizeStatus(item.status);

        return (
          status.includes("on track") ||
          status.includes("healthy") ||
          status.includes("good") ||
          status.includes("improving")
        );
      }).length,

      attention: operationalData.filter((item) => {
        const status =
          normalizeStatus(item.status);

        return (
          status.includes("attention") ||
          status.includes("warning") ||
          status.includes("pending")
        );
      }).length,

      critical: operationalData.filter((item) => {
        const status =
          normalizeStatus(item.status);

        return (
          status.includes("critical") ||
          status.includes("poor") ||
          status.includes("declining")
        );
      }).length,
    };
  }, [operationalData]);

  if (loading) {
    return (
      <div
        style={{
          padding: "32px",
          background: "#F8FAFC",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#0F172A",
            margin: 0,
            letterSpacing: "-0.6px",
          }}
        >
          Operational Performance
        </h1>

        <p
          style={{
            color: "#64748B",
            marginTop: "8px",
            fontSize: "14px",
          }}
        >
          Loading operational performance data...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        background: "#F8FAFC",
        minHeight: "100vh",
        boxSizing: "border-box",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#16A34A",
              display: "inline-block",
              boxShadow:
                "0 0 0 4px rgba(22, 163, 74, 0.10)",
            }}
          />

          <span
            style={{
              color: "#16A34A",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.1px",
              textTransform: "uppercase",
            }}
          >
            Live Operations
          </span>
        </div>

        <h1
          style={{
            fontSize: "34px",
            fontWeight: 800,
            color: "#0F172A",
            margin: 0,
            letterSpacing: "-0.9px",
          }}
        >
          Operational Performance
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "14px",
            marginTop: "7px",
            marginBottom: 0,
          }}
        >
          Real-time monitoring of operational efficiency,
          service levels and performance against targets.
        </p>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        {/* TOTAL METRICS */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 6px 20px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Total Metrics
            </div>

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProfessionalIcon
                name="analytics"
                color="#2563EB"
              />
            </div>
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#0F172A",
              marginTop: "14px",
              lineHeight: 1,
            }}
          >
            {summary.total}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#94A3B8",
              marginTop: "7px",
            }}
          >
            Operational indicators
          </div>
        </div>

        {/* ON TRACK */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #D1FAE5",
            borderLeft: "4px solid #059669",
            boxShadow:
              "0 6px 20px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              On Track
            </div>

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProfessionalIcon
                name="quality"
                color="#059669"
              />
            </div>
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#059669",
              marginTop: "14px",
              lineHeight: 1,
            }}
          >
            {summary.onTrack}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748B",
              marginTop: "7px",
            }}
          >
            Healthy indicators
          </div>
        </div>

        {/* ATTENTION */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #FEF3C7",
            borderLeft: "4px solid #D97706",
            boxShadow:
              "0 6px 20px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Attention
            </div>

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: "#FFFBEB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProfessionalIcon
                name="performance"
                color="#D97706"
              />
            </div>
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#D97706",
              marginTop: "14px",
              lineHeight: 1,
            }}
          >
            {summary.attention}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748B",
              marginTop: "7px",
            }}
          >
            Indicators requiring review
          </div>
        </div>

        {/* CRITICAL */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #FECACA",
            borderLeft: "4px solid #DC2626",
            boxShadow:
              "0 6px 20px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Critical
            </div>

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProfessionalIcon
                name="performance"
                color="#DC2626"
              />
            </div>
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#DC2626",
              marginTop: "14px",
              lineHeight: 1,
            }}
          >
            {summary.critical}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748B",
              marginTop: "7px",
            }}
          >
            Critical indicators
          </div>
        </div>
      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      {operationalData.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          {operationalData.map((item) => {
            const statusColor =
              getStatusColor(item.status);

            const statusBackground =
              getStatusBackground(item.status);

            const progress =
              calculateProgress(item);

            return (
              <div
                key={item.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "21px",
                  border: "1px solid #E2E8F0",
                  borderTop: `4px solid ${statusColor}`,
                  boxShadow:
                    "0 7px 22px rgba(15, 23, 42, 0.055)",
                }}
              >
                {/* ICON + STATUS */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "17px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "11px",
                      background:
                        statusBackground,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ProfessionalIcon
                      name={getIcon(
                        item.metric_name
                      )}
                      color={statusColor}
                    />
                  </div>

                  <span
                    style={{
                      padding: "5px 9px",
                      borderRadius: "999px",
                      background:
                        statusBackground,
                      color: statusColor,
                      fontSize: "11px",
                      fontWeight: 800,
                      border: `1px solid ${statusColor}20`,
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {/* METRIC NAME */}

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#64748B",
                    marginBottom: "8px",
                  }}
                >
                  {item.metric_name}
                </div>

                {/* CURRENT VALUE */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                    marginBottom: "17px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "27px",
                      lineHeight: 1,
                      fontWeight: 800,
                      color: statusColor,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {formatNumber(item.value)}
                  </span>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#64748B",
                    }}
                  >
                    {item.unit}
                  </span>
                </div>

                {/* TARGET */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    Target
                  </span>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#0F172A",
                    }}
                  >
                    {formatNumber(item.target)}{" "}
                    {item.unit}
                  </span>
                </div>

                {/* PROGRESS */}

                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "#E2E8F0",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: statusColor,
                      borderRadius: "999px",
                      transition:
                        "width 0.3s ease",
                    }}
                  />
                </div>

                {/* PROGRESS TEXT */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#94A3B8",
                  }}
                >
                  <span>
                    {Math.round(progress)}%
                    target achievement
                  </span>

                  <span>
                    {item.period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          METRICS TABLE
      ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "26px",
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 7px 22px rgba(15, 23, 42, 0.05)",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "19px",
          }}
        >
          <h2
            style={{
              fontSize: "21px",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            Operational Performance Metrics
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#64748B",
              marginTop: "5px",
              marginBottom: 0,
            }}
          >
            Detailed comparison of current
            performance against operational targets.
          </p>
        </div>

        {operationalData.length === 0 ? (
          <div
            style={{
              padding: "38px",
              background: "#F8FAFC",
              borderRadius: "12px",
              textAlign: "center",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            No operational performance records
            are currently available.
          </div>
        ) : (
          <div
            style={{
              minWidth: "850px",
            }}
          >
            {/* TABLE HEADER */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr 1.2fr 1fr",
                gap: "12px",
                padding: "11px 15px",
                background: "#F8FAFC",
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                fontSize: "10px",
                fontWeight: 800,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              <div>Metric</div>
              <div>Current</div>
              <div>Target</div>
              <div>Variance</div>
              <div>Status</div>
              <div>Period</div>
            </div>

            {/* TABLE ROWS */}

            <div
              style={{
                display: "grid",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              {operationalData.map((item) => {
                const variance =
                  calculateVariance(item);

                const varianceColor =
                  getVarianceColor(item);

                const varianceLabel =
                  getVarianceLabel(item);

                const statusColor =
                  getStatusColor(item.status);

                const statusBackground =
                  getStatusBackground(
                    item.status
                  );

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "2fr 1fr 1fr 1fr 1.2fr 1fr",
                      gap: "12px",
                      alignItems: "center",
                      padding: "14px 15px",
                      background: "#FFFFFF",
                      borderRadius: "9px",
                      border: "1px solid #EEF2F7",
                      transition:
                        "background 0.2s ease",
                    }}
                  >
                    {/* METRIC */}

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#0F172A",
                          fontSize: "12px",
                        }}
                      >
                        {item.metric_name}
                      </div>

                      <div
                        style={{
                          fontSize: "10px",
                          color: "#94A3B8",
                          marginTop: "3px",
                        }}
                      >
                        {item.unit}
                      </div>
                    </div>

                    {/* CURRENT */}

                    <div
                      style={{
                        fontWeight: 700,
                        color: "#2563EB",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatNumber(
                        item.value
                      )}{" "}
                      {item.unit}
                    </div>

                    {/* TARGET */}

                    <div
                      style={{
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatNumber(
                        item.target
                      )}{" "}
                      {item.unit}
                    </div>

                    {/* VARIANCE */}

                    <div
                      style={{
                        color: varianceColor,
                        fontWeight: 700,
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {variance > 0 ? "+" : ""}
                      {variance.toFixed(1)}%

                      <div
                        style={{
                          fontSize: "9px",
                          marginTop: "2px",
                          fontWeight: 600,
                        }}
                      >
                        {varianceLabel}
                      </div>
                    </div>

                    {/* STATUS */}

                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 8px",
                          borderRadius: "999px",
                          background:
                            statusBackground,
                          color: statusColor,
                          fontSize: "10px",
                          fontWeight: 800,
                          whiteSpace:
                            "nowrap",
                          border: `1px solid ${statusColor}20`,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* PERIOD */}

                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "11px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.period}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "6px",
          color: "#94A3B8",
          fontSize: "10px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#16A34A",
          }}
        />

        Connected to SmartChain Nexus
        Executive Intelligence API
      </div>
    </div>
  );
}