import { useEffect, useMemo, useState } from "react";

type AuditLog = {
  id: number;
  user_id?: number | null;
  username?: string | null;
  action: string;
  resource?: string | null;
  description?: string | null;
  ip_address?: string | null;
  created_at: string;
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // BACKEND URL
  // ==========================================================

  const API_URL = "https://smartchain-nexus-3.onrender.com/settings/audit";

  // ==========================================================
  // MODULES
  // ==========================================================

  const modules = [
    "All",
    "Authentication",
    "Dashboard",
    "Executive Intelligence",
    "Procurement",
    "Inventory",
    "Warehouse",
    "Logistics",
    "Sales",
    "Business Intelligence",
    "AI & Machine Learning",
    "Backup & Restore",
    "Security",
    "User Management",
    "Company Settings",
    "Appearance Settings",
    "Notification Settings",
    "Integrations",
    "System",
  ];

  // ==========================================================
  // LOAD AUDIT LOGS
  // ==========================================================

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load audit logs. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Audit log loading error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load audit logs.");
      }

      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAuditLogs();
  }, []);

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date: string) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-ZA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================================
  // GET MODULE FROM RESOURCE
  //
  // Your backend does not have a "module" column.
  // We therefore use "resource" as the module/resource.
  // ==========================================================

  const getModule = (log: AuditLog) => {
    if (log.resource && log.resource.trim() !== "") {
      return log.resource;
    }

    return "System";
  };

  // ==========================================================
  // FILTER LOGS
  // ==========================================================

  const filteredLogs = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return logs.filter((log) => {
      const module = getModule(log);

      const matchesModule =
        selectedModule === "All" ||
        module.toLowerCase() === selectedModule.toLowerCase();

      const matchesSearch =
        search === "" ||
        (log.username || "")
          .toLowerCase()
          .includes(search) ||
        log.action
          .toLowerCase()
          .includes(search) ||
        module
          .toLowerCase()
          .includes(search) ||
        (log.description || "")
          .toLowerCase()
          .includes(search) ||
        (log.ip_address || "")
          .toLowerCase()
          .includes(search);

      return matchesModule && matchesSearch;
    });
  }, [logs, searchTerm, selectedModule]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalLogs = logs.length;

  const totalUsers = new Set(
    logs
      .map((log) => log.username)
      .filter(Boolean)
  ).size;

  const totalModules = new Set(
    logs.map((log) => getModule(log))
  ).size;

  // ==========================================================
  // EXPORT CSV
  // ==========================================================

  const exportCSV = () => {
    if (filteredLogs.length === 0) {
      return;
    }

    const headers = [
      "Date",
      "User",
      "Action",
      "Module",
      "Description",
      "IP Address",
    ];

    const rows = filteredLogs.map((log) => [
      formatDate(log.created_at),
      log.username || "Unknown User",
      log.action,
      getModule(log),
      log.description || "",
      log.ip_address || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "smartchain-nexus-audit-logs.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedModule("All");
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1 style={pageTitleStyle}>
          Audit Logs
        </h1>

        <div style={loadingCardStyle}>
          Loading audit logs...
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div style={pageStyle}>

      {/* ======================================================
          TITLE
      ====================================================== */}

      <h1 style={pageTitleStyle}>
        Audit Logs
      </h1>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div style={statsGridStyle}>

        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>
            Total Logs
          </h3>

          <h1 style={statNumberStyle}>
            {totalLogs}
          </h1>
        </div>

        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>
            Users
          </h3>

          <h1 style={statNumberStyle}>
            {totalUsers}
          </h1>
        </div>

        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>
            Modules
          </h3>

          <h1 style={statNumberStyle}>
            {totalModules}
          </h1>
        </div>

      </div>

      {/* ======================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div style={filterBarStyle}>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={searchInputStyle}
        />

        {/* MODULE DROPDOWN */}

        <select
          value={selectedModule}
          onChange={(e) =>
            setSelectedModule(e.target.value)
          }
          style={selectStyle}
        >
          {modules.map((module) => (
            <option
              key={module}
              value={module}
            >
              {module}
            </option>
          ))}
        </select>

        {/* REFRESH */}

        <button
          onClick={loadAuditLogs}
          style={refreshButtonStyle}
        >
          Refresh
        </button>

        {/* EXPORT */}

        <button
          onClick={exportCSV}
          disabled={filteredLogs.length === 0}
          style={{
            ...exportButtonStyle,
            opacity:
              filteredLogs.length === 0 ? 0.6 : 1,
            cursor:
              filteredLogs.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Export CSV
        </button>

        {/* CLEAR */}

        {(searchTerm ||
          selectedModule !== "All") && (
          <button
            onClick={clearFilters}
            style={clearButtonStyle}
          >
            Clear
          </button>
        )}

      </div>

      {/* ======================================================
          FILTER RESULT
      ====================================================== */}

      {(searchTerm ||
        selectedModule !== "All") && (
        <div style={filterInfoStyle}>
          Showing{" "}
          <strong>
            {filteredLogs.length}
          </strong>{" "}
          of{" "}
          <strong>{totalLogs}</strong>{" "}
          audit logs
        </div>
      )}

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div style={tableContainerStyle}>

        <table style={tableStyle}>

          <thead>
            <tr style={tableHeaderStyle}>

              <th style={tableHeaderCellStyle}>
                Date
              </th>

              <th style={tableHeaderCellStyle}>
                User
              </th>

              <th style={tableHeaderCellStyle}>
                Action
              </th>

              <th style={tableHeaderCellStyle}>
                Module
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredLogs.length > 0 ? (

              filteredLogs.map((log) => (

                <tr
                  key={log.id}
                  style={tableRowStyle}
                >

                  <td style={tableCellStyle}>
                    {formatDate(log.created_at)}
                  </td>

                  <td style={tableCellStyle}>
                    {log.username ||
                      "Unknown User"}
                  </td>

                  <td style={tableCellStyle}>
                    {log.action}
                  </td>

                  <td style={tableCellStyle}>

                    <span
                      style={moduleBadgeStyle}
                    >
                      {getModule(log)}
                    </span>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={4}
                  style={emptyStateStyle}
                >

                  <div>
                    No audit logs found.
                  </div>

                  {(searchTerm ||
                    selectedModule !== "All") && (
                    <button
                      onClick={clearFilters}
                      style={clearFiltersButtonStyle}
                    >
                      Clear Filters
                    </button>
                  )}

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

// ==========================================================
// PAGE
// ==========================================================

const pageStyle = {
  padding: "30px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box" as const,
};

// ==========================================================
// TITLE
// ==========================================================

const pageTitleStyle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#0F172A",
  marginBottom: "20px",
  marginTop: "0",
};

// ==========================================================
// ERROR
// ==========================================================

const errorStyle = {
  background: "#FEE2E2",
  color: "#DC2626",
  padding: "14px 16px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontSize: "15px",
};

// ==========================================================
// STATISTICS
// ==========================================================

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "25px",
};

// ==========================================================
// STAT CARD
// ==========================================================

const statCardStyle = {
  background: "#DBEAFE",
  padding: "20px",
  borderRadius: "12px",
  minHeight: "90px",
  boxSizing: "border-box" as const,
};

// ==========================================================
// STAT TITLE
// ==========================================================

const statTitleStyle = {
  margin: "0",
  fontSize: "18px",
  fontWeight: "700",
  color: "#0F172A",
};

// ==========================================================
// STAT NUMBER
// ==========================================================

const statNumberStyle = {
  margin: "2px 0 0 0",
  fontSize: "42px",
  fontWeight: "800",
  color: "#000000",
};

// ==========================================================
// FILTER BAR
// ==========================================================

const filterBarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "15px",
  flexWrap: "wrap" as const,
};

// ==========================================================
// SEARCH
// ==========================================================

const searchInputStyle = {
  width: "220px",
  padding: "12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "14px",
  boxSizing: "border-box" as const,
};

// ==========================================================
// DROPDOWN
// ==========================================================

const selectStyle = {
  width: "220px",
  padding: "12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "14px",
  cursor: "pointer",
  boxSizing: "border-box" as const,
};

// ==========================================================
// REFRESH BUTTON
// ==========================================================

const refreshButtonStyle = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  padding: "12px 22px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

// ==========================================================
// EXPORT BUTTON
// ==========================================================

const exportButtonStyle = {
  background: "#16A34A",
  color: "#FFFFFF",
  border: "none",
  padding: "12px 22px",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "14px",
};

// ==========================================================
// CLEAR BUTTON
// ==========================================================

const clearButtonStyle = {
  background: "#64748B",
  color: "#FFFFFF",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

// ==========================================================
// FILTER INFO
// ==========================================================

const filterInfoStyle = {
  background: "#EFF6FF",
  color: "#1E40AF",
  padding: "10px 14px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "14px",
};

// ==========================================================
// TABLE CONTAINER
// ==========================================================

const tableContainerStyle = {
  background: "#FFFFFF",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  width: "100%",
  overflowX: "auto" as const,
};

// ==========================================================
// TABLE
// ==========================================================

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  minWidth: "700px",
};

// ==========================================================
// TABLE HEADER
// ==========================================================

const tableHeaderStyle = {
  background: "#1E293B",
  color: "#FFFFFF",
};

// ==========================================================
// TABLE HEADER CELL
// ==========================================================

const tableHeaderCellStyle = {
  padding: "15px",
  textAlign: "left" as const,
  fontSize: "15px",
  fontWeight: "700",
};

// ==========================================================
// TABLE ROW
// ==========================================================

const tableRowStyle = {
  borderBottom: "1px solid #E2E8F0",
};

// ==========================================================
// TABLE CELL
// ==========================================================

const tableCellStyle = {
  padding: "15px",
  color: "#334155",
  fontSize: "14px",
  verticalAlign: "middle" as const,
};

// ==========================================================
// MODULE BADGE
// ==========================================================

const moduleBadgeStyle = {
  display: "inline-block",
  background: "#DBEAFE",
  color: "#1D4ED8",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

// ==========================================================
// EMPTY STATE
// ==========================================================

const emptyStateStyle = {
  padding: "35px",
  textAlign: "center" as const,
  color: "#64748B",
  fontSize: "15px",
};

// ==========================================================
// CLEAR FILTERS
// ==========================================================

const clearFiltersButtonStyle = {
  marginTop: "12px",
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  padding: "9px 18px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "700",
};

// ==========================================================
// LOADING
// ==========================================================

const loadingCardStyle = {
  background: "#FFFFFF",
  borderRadius: "12px",
  padding: "50px",
  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  maxWidth: "900px",
  textAlign: "center" as const,
  color: "#475569",
};