import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function ExecutiveReporting() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    total_reports: 0,
    total_revenue: 0,
    total_cost: 0,
    total_profit: 0,
    average_profit_margin: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchExecutiveReporting = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/business-intelligence/executive-reporting/summary`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load executive reports. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setSummary({
        total_reports: data.total_reports || 0,
        total_revenue: data.total_revenue || 0,
        total_cost: data.total_cost || 0,
        total_profit: data.total_profit || 0,
        average_profit_margin: data.average_profit_margin || 0,
      });

      setReports(data.reports || []);
    } catch (err) {
      setError(err.message || "Unable to load executive reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutiveReporting();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.report_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        report.reporting_period
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        report.status?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const generatedReports = reports.filter(
    (report) =>
      report.status?.toLowerCase() === "published" ||
      report.status?.toLowerCase() === "generated"
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status?.toLowerCase() === "pending"
  ).length;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${Number(value || 0).toFixed(1)}%`;
  };

  const getStatusStyle = (status) => {
    const normalized = status?.toLowerCase();

    if (
      normalized === "published" ||
      normalized === "generated" ||
      normalized === "active"
    ) {
      return {
        background: "#ECFDF3",
        color: "#059669",
        border: "1px solid #A7F3D0",
      };
    }

    if (normalized === "pending") {
      return {
        background: "#FFFBEB",
        color: "#D97706",
        border: "1px solid #FDE68A",
      };
    }

    return {
      background: "#F1F5F9",
      color: "#475569",
      border: "1px solid #E2E8F0",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "34px",
        color: "#0F172A",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: "#EEF4FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                fontWeight: "700",
              }}
            >
              ▣
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "800",
                letterSpacing: "-1px",
              }}
            >
              Executive Reporting
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "15px",
            }}
          >
            Monitor executive performance, financial results and supply chain
            intelligence directly inside SmartChain Nexus.
          </p>
        </div>

        <button
          onClick={fetchExecutiveReporting}
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "13px 20px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 8px 18px rgba(37,99,235,0.22)",
          }}
        >
          ↻ &nbsp; Refresh Data
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "16px 18px",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: "18px",
          marginBottom: "26px",
        }}
      >
        <SummaryCard
          title="Total Reports"
          value={summary.total_reports}
          subtitle="Executive reports"
          icon="▦"
          background="#EEF4FF"
          iconColor="#2563EB"
        />

        <SummaryCard
          title="Generated"
          value={generatedReports}
          subtitle="Published reports"
          icon="✓"
          background="#ECFDF5"
          iconColor="#10B981"
        />

        <SummaryCard
          title="Pending"
          value={pendingReports}
          subtitle="Awaiting completion"
          icon="◷"
          background="#FFF7ED"
          iconColor="#F59E0B"
        />

        <SummaryCard
          title="Total Profit"
          value={formatCurrency(summary.total_profit)}
          subtitle="Across all reports"
          icon="R"
          background="#F5F3FF"
          iconColor="#7C3AED"
        />
      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 310px",
          gap: "22px",
          alignItems: "start",
        }}
      >
        {/* =================================================
            REPORT LIBRARY
        ================================================= */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
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
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                <span style={{ color: "#2563EB" }}>▣</span>
                Executive Report Library
              </div>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Select a report to view executive insights and performance.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports..."
                  style={{
                    width: "220px",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    outline: "none",
                    fontSize: "13px",
                    color: "#0F172A",
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "11px 13px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#334155",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Generated">Generated</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "#64748B",
              }}
            >
              Loading executive reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "#64748B",
              }}
            >
              No executive reports found.
            </div>
          ) : (
            <div style={{ padding: "14px 18px" }}>
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px minmax(0,1fr) auto auto auto 30px",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 14px",
                    borderRadius: "12px",
                    border:
                      selectedReport?.id === report.id
                        ? "1px solid #93C5FD"
                        : "1px solid transparent",
                    background:
                      selectedReport?.id === report.id
                        ? "#F8FBFF"
                        : "#FFFFFF",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "13px",
                      background: "#EEF4FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: "18px",
                    }}
                  >
                    ▤
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "750",
                        fontSize: "14px",
                        marginBottom: "5px",
                      }}
                    >
                      {report.report_name}
                    </div>

                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "430px",
                      }}
                    >
                      {report.executive_summary ||
                        "Executive performance report"}
                    </div>
                  </div>

                  <Badge text={report.reporting_period} />

                  <Badge text="Executive" />

                  <span
                    style={{
                      ...getStatusStyle(report.status),
                      padding: "7px 11px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ● {report.status}
                  </span>

                  <span
                    style={{
                      color: "#2563EB",
                      fontSize: "20px",
                    }}
                  >
                    ›
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              padding: "16px",
              textAlign: "center",
              color: "#2563EB",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>

        {/* =================================================
            REPORT PREVIEW
        ================================================= */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              padding: "17px 18px",
              borderBottom: "1px solid #E2E8F0",
              fontWeight: "800",
              fontSize: "13px",
              color: "#475569",
              letterSpacing: "0.4px",
            }}
          >
            REPORT PREVIEW
          </div>

          {selectedReport ? (
            <ReportPreview
              report={selectedReport}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              getStatusStyle={getStatusStyle}
            />
          ) : (
            <div
              style={{
                padding: "45px 25px",
                textAlign: "center",
                color: "#64748B",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "15px",
                  background: "#EEF4FF",
                  color: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  fontSize: "22px",
                }}
              >
                ▤
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0F172A",
                }}
              >
                Select a Report
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                Select an executive report from the library to view its
                performance details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          BUSINESS OVERVIEW
      ===================================================== */}

      <div
        style={{
          marginTop: "22px",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "22px",
          boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "800",
            }}
          >
            Executive Business Overview
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Key performance indicators across executive reports.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "14px",
          }}
        >
          <OverviewMetric
            title="Total Revenue"
            value={formatCurrency(summary.total_revenue)}
            color="#2563EB"
          />

          <OverviewMetric
            title="Total Cost"
            value={formatCurrency(summary.total_cost)}
            color="#F59E0B"
          />

          <OverviewMetric
            title="Total Profit"
            value={formatCurrency(summary.total_profit)}
            color="#10B981"
          />

          <OverviewMetric
            title="Average Profit Margin"
            value={formatPercentage(summary.average_profit_margin)}
            color="#7C3AED"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  background,
  iconColor,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "13px",
            background,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "18px",
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          marginTop: "17px",
          color: iconColor,
          fontSize: "13px",
          fontWeight: "750",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "27px",
          fontWeight: "800",
          marginTop: "5px",
          color: "#0F172A",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: "12px",
          marginTop: "5px",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

/* ============================================================
   BADGE
============================================================ */

function Badge({ text }) {
  return (
    <span
      style={{
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        color: "#475569",
        padding: "7px 10px",
        borderRadius: "8px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

/* ============================================================
   REPORT PREVIEW
============================================================ */

function ReportPreview({
  report,
  formatCurrency,
  formatPercentage,
  getStatusStyle,
}) {
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "#EEF4FF",
          color: "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "21px",
          marginBottom: "18px",
        }}
      >
        ▤
      </div>

      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "17px",
          fontWeight: "800",
          color: "#0F172A",
        }}
      >
        {report.report_name}
      </h3>

      <p
        style={{
          color: "#64748B",
          fontSize: "13px",
          lineHeight: 1.6,
          marginBottom: "20px",
        }}
      >
        {report.executive_summary ||
          "Executive performance and business intelligence report."}
      </p>

      <PreviewRow label="Reporting Period" value={report.reporting_period} />

      <PreviewRow
        label="Revenue"
        value={formatCurrency(report.total_revenue)}
      />

      <PreviewRow label="Cost" value={formatCurrency(report.total_cost)} />

      <PreviewRow
        label="Profit"
        value={formatCurrency(report.total_profit)}
      />

      <PreviewRow
        label="Profit Margin"
        value={formatPercentage(report.profit_margin)}
      />

      <PreviewRow
        label="Inventory Value"
        value={formatCurrency(report.inventory_value)}
      />

      <PreviewRow
        label="Supplier Performance"
        value={formatPercentage(report.supplier_performance)}
      />

      <PreviewRow
        label="Delivery Performance"
        value={formatPercentage(report.delivery_performance)}
      />

      <PreviewRow
        label="Overall Performance"
        value={formatPercentage(report.overall_performance)}
      />

      <div
        style={{
          marginTop: "18px",
          padding: "10px 12px",
          borderRadius: "9px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "700",
          ...getStatusStyle(report.status),
        }}
      >
        ● {report.status}
      </div>
    </div>
  );
}

/* ============================================================
   PREVIEW ROW
============================================================ */

function PreviewRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "15px",
        padding: "11px 0",
        borderTop: "1px solid #E2E8F0",
        fontSize: "12px",
      }}
    >
      <span style={{ color: "#64748B" }}>{label}</span>

      <strong
        style={{
          color: "#0F172A",
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* ============================================================
   OVERVIEW METRIC
============================================================ */

function OverviewMetric({ title, value, color }) {
  return (
    <div
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "17px",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#64748B",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: "800",
          color: "#0F172A",
        }}
      >
        {value}
      </div>

      <div
        style={{
          width: "42px",
          height: "3px",
          borderRadius: "99px",
          background: color,
          marginTop: "12px",
        }}
      />
    </div>
  );
}