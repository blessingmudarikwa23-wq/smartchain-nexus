import { useEffect, useState } from "react";

type FinancialOverviewData = {
  id: number;
  metric_name: string;
  value: number;
  previous_value: number;
  unit: string;
  period: string;
};

type FinancialCard = {
  title: string;
  value: FinancialOverviewData | undefined;
  color: string;
  icon: React.ReactNode;
};

function RevenueIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 8v8" />
      <path d="M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" />
    </svg>
  );
}

function ExpensesIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h6" />
      <path d="M7 16h4" />
      <path d="M17 13v4" />
      <path d="M15 15l2 2 2-2" />
    </svg>
  );
}

function ProfitIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

function CashFlowIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="M17 7.5c0-2-2.2-3.5-5-3.5S7 5.5 7 7.5 9.2 11 12 11s5 1.5 5 3.5-2.2 3.5-5 3.5-5-1.5-5-3.5" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7l6 6 4-4 8 9" />
      <path d="M15 18h6v-6" />
    </svg>
  );
}

export default function FinancialOverview() {
  const [financialData, setFinancialData] = useState<
    FinancialOverviewData[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialOverview();
  }, []);

  async function loadFinancialOverview() {
    try {
      setLoading(true);

      const response = await fetch(
        "https://smartchain-nexus-3.onrender.com/executive-intelligence/financial-overview/"
      );

      if (!response.ok) {
        throw new Error("Failed to load Financial Overview");
      }

      const data: FinancialOverviewData[] = await response.json();

      console.log("Financial Overview data:", data);

      setFinancialData(data);
    } catch (error) {
      console.error("Failed to load Financial Overview:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMetric(
    ...names: string[]
  ): FinancialOverviewData | undefined {
    return financialData.find((item) =>
      names.some(
        (name) =>
          item.metric_name.toLowerCase() === name.toLowerCase()
      )
    );
  }

  function formatAmount(value: number | undefined): string {
    if (value === undefined || value === null) {
      return "0.00";
    }

    return value.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatCurrency(item: FinancialOverviewData | undefined) {
    if (!item) {
      return {
        unit: "R",
        amount: "0.00",
      };
    }

    return {
      unit: "R",
      amount: formatAmount(item.value),
    };
  }

  const totalRevenue = getMetric(
    "Total Revenue",
    "Revenue"
  );

  const totalExpenses = getMetric(
    "Total Expenses",
    "Expenses",
    "Total Cost"
  );

  const netProfit = getMetric(
    "Net Profit",
    "Profit",
    "Gross Profit"
  );

  const cashFlow = getMetric(
    "Cash Flow",
    "Operating Cash Flow"
  );

  const financialCards: FinancialCard[] = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      color: "#16A34A",
      icon: <RevenueIcon />,
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      color: "#DC2626",
      icon: <ExpensesIcon />,
    },
    {
      title: "Net Profit",
      value: netProfit,
      color: "#2563EB",
      icon: <ProfitIcon />,
    },
    {
      title: "Cash Flow",
      value: cashFlow,
      color: "#9333EA",
      icon: <CashFlowIcon />,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          padding: "36px",
          background: "#F6F8FC",
          minHeight: "100vh",
          boxSizing: "border-box",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "40px",
            border: "1px solid #E7EBF2",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 750,
              color: "#0F172A",
              margin: 0,
              marginBottom: "8px",
              letterSpacing: "-0.6px",
            }}
          >
            Financial Overview
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Loading financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "36px",
        background: "#F6F8FC",
        minHeight: "100vh",
        boxSizing: "border-box",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
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
              boxShadow: "0 0 0 4px rgba(22, 163, 74, 0.10)",
            }}
          />

          <span
            style={{
              color: "#16A34A",
              fontSize: "12px",
              fontWeight: 750,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            Financial Intelligence
          </span>
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#0F172A",
            margin: 0,
            marginBottom: "7px",
            letterSpacing: "-0.9px",
          }}
        >
          Financial Overview
        </h1>

        <p
          style={{
            color: "#64748B",
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          Real-time visibility across revenue, expenses,
          profitability and cash flow.
        </p>
      </div>

      {/* KPI SECTION */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#475569",
              fontSize: "12px",
              fontWeight: 750,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Key Financial Indicators
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "18px",
          }}
        >
          {financialCards.map((card) => {
            const formatted = formatCurrency(card.value);

            return (
              <div
                key={card.title}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "15px",
                  padding: "20px",
                  border: "1px solid #E7EBF2",
                  boxShadow:
                    "0 5px 18px rgba(15, 23, 42, 0.045)",
                  minWidth: 0,
                  boxSizing: "border-box",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* TOP ACCENT */}

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: card.color,
                  }}
                />

                {/* ICON */}

                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "11px",
                    background: `${card.color}12`,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "15px",
                  }}
                >
                  {card.icon}
                </div>

                {/* TITLE */}

                <div
                  style={{
                    color: "#64748B",
                    fontSize: "13px",
                    fontWeight: 650,
                    marginBottom: "8px",
                  }}
                >
                  {card.title}
                </div>

                {/* VALUE */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "5px",
                    minWidth: 0,
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      color: card.color,
                      fontSize: "18px",
                      fontWeight: 750,
                      lineHeight: 1.1,
                      flexShrink: 0,
                    }}
                  >
                    R
                  </span>

                  <span
                    style={{
                      color: "#0F172A",
                      fontSize: "22px",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: "-0.5px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: 0,
                    }}
                    title={`R ${formatted.amount}`}
                  >
                    {formatted.amount}
                  </span>
                </div>

                {/* STATUS LINE */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "12px",
                    color: "#16A34A",
                    fontSize: "11px",
                    fontWeight: 650,
                  }}
                >
                  <TrendUpIcon />
                  Financial performance
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FINANCIAL METRICS */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "26px",
          borderRadius: "16px",
          border: "1px solid #E7EBF2",
          boxShadow:
            "0 6px 20px rgba(15, 23, 42, 0.045)",
          boxSizing: "border-box",
          overflowX: "auto",
        }}
      >
        {/* SECTION HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "22px",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                color: "#0F172A",
                fontSize: "20px",
                fontWeight: 800,
                margin: 0,
                marginBottom: "5px",
                letterSpacing: "-0.3px",
              }}
            >
              Financial Metrics
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              Detailed financial performance and period
              comparisons.
            </p>
          </div>

          <div
            style={{
              padding: "7px 11px",
              borderRadius: "8px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#64748B",
              fontSize: "11px",
              fontWeight: 650,
              whiteSpace: "nowrap",
            }}
          >
            Current Period
          </div>
        </div>

        {/* NO DATA */}

        {financialData.length === 0 ? (
          <div
            style={{
              padding: "40px",
              background: "#F8FAFC",
              borderRadius: "12px",
              textAlign: "center",
              color: "#64748B",
              fontSize: "13px",
              border: "1px solid #E2E8F0",
            }}
          >
            No financial records are currently available.
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
                  "2fr 1.2fr 1.2fr 1.2fr 1fr",
                gap: "15px",
                padding: "0 16px 11px",
                borderBottom: "1px solid #E2E8F0",
                color: "#64748B",
                fontSize: "10px",
                fontWeight: 750,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
              }}
            >
              <div>Metric</div>
              <div>Current Value</div>
              <div>Previous Value</div>
              <div>Change</div>
              <div>Trend</div>
            </div>

            {/* RECORDS */}

            <div
              style={{
                display: "grid",
                gap: "8px",
                marginTop: "9px",
              }}
            >
              {financialData.map((item) => {
                const change =
                  item.value - item.previous_value;

                const isImproving =
                  item.value >= item.previous_value;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "2fr 1.2fr 1.2fr 1.2fr 1fr",
                      alignItems: "center",
                      gap: "15px",
                      padding: "14px 16px",
                      background: "#F8FAFC",
                      border: "1px solid #EEF2F6",
                      borderRadius: "10px",
                      boxSizing: "border-box",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* METRIC */}

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <strong
                        style={{
                          color: "#1E293B",
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.metric_name}
                      </strong>

                      <div
                        style={{
                          fontSize: "10px",
                          color: "#94A3B8",
                          marginTop: "4px",
                        }}
                      >
                        {item.period}
                      </div>
                    </div>

                    {/* CURRENT VALUE */}

                    <div
                      style={{
                        color: "#2563EB",
                        fontWeight: 700,
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          marginRight: "4px",
                          fontWeight: 650,
                        }}
                      >
                        R
                      </span>

                      {formatAmount(item.value)}
                    </div>

                    {/* PREVIOUS VALUE */}

                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "11px",
                        fontWeight: 550,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          marginRight: "4px",
                        }}
                      >
                        R
                      </span>

                      {formatAmount(item.previous_value)}
                    </div>

                    {/* CHANGE */}

                    <div
                      style={{
                        color:
                          change >= 0
                            ? "#16A34A"
                            : "#DC2626",
                        fontWeight: 650,
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {change >= 0 ? "+" : "-"} R{" "}
                      {formatAmount(Math.abs(change))}
                    </div>

                    {/* TREND */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: isImproving
                          ? "#16A34A"
                          : "#DC2626",
                        fontWeight: 650,
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          width: "25px",
                          height: "25px",
                          borderRadius: "7px",
                          background: isImproving
                            ? "#DCFCE7"
                            : "#FEE2E2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isImproving ? (
                          <TrendUpIcon />
                        ) : (
                          <TrendDownIcon />
                        )}
                      </span>

                      {isImproving
                        ? "Improving"
                        : "Declining"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}