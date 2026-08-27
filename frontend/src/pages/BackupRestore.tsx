import { useEffect, useState } from "react";

export default function BackupRestore() {
  const API_URL = "https://smartchain-nexus-3.onrender.com/settings";

  const [backups, setBackups] = useState([]);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const [backupName, setBackupName] = useState("");
  const [backupType, setBackupType] = useState("Full Database");
  const [backupLocation, setBackupLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD BACKUP HISTORY
  // ==========================================================

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/backups`);

      if (!response.ok) {
        throw new Error(
          "Failed to load backup history."
        );
      }

      const data = await response.json();

      setBackups(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Failed to load backup history."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CREATE BACKUP
  // ==========================================================

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      setMessage("");
      setError("");

      const generatedName =
        backupName.trim() ||
        `SmartChain-Nexus-Backup-${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}`;

      const payload = {
        backup_name: generatedName,
        backup_type: backupType,
        backup_location:
          backupLocation.trim() || "Local Application Storage",
        backup_status: "Completed",
        backup_date: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_URL}/backup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to create backup.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.detail || errorMessage;
        } catch {
          // Keep default error message
        }

        throw new Error(errorMessage);
      }

      const savedBackup = await response.json();

      setBackups((previousBackups) => [
        savedBackup,
        ...previousBackups,
      ]);

      setBackupName("");
      setBackupLocation("");

      setMessage(
        "Backup record created successfully."
      );
    } catch (err) {
      setError(
        err.message || "Failed to create backup."
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================================
  // SELECT BACKUP
  // ==========================================================

  const handleSelectBackup = async (backupId) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/backup/${backupId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to retrieve backup details."
        );
      }

      const data = await response.json();

      setSelectedBackup(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to retrieve backup details."
      );
    }
  };

  // ==========================================================
  // RESTORE BACKUP
  // ==========================================================

  const handleRestore = async (backup) => {
    if (!backup) {
      setError(
        "Please select a backup before restoring."
      );

      return;
    }

    const confirmed = window.confirm(
      `Restore backup "${backup.backup_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRestoring(true);
      setMessage("");
      setError("");

      /*
       * IMPORTANT:
       *
       * The current backend does not expose a dedicated
       * physical database restore endpoint.
       *
       * The existing backend only supports updating the
       * backup record through:
       *
       * PUT /settings/backup/{backup_id}
       *
       * Therefore this updates the backup record status
       * rather than pretending to restore the database.
       */

      const response = await fetch(
        `${API_URL}/backup/${backup.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            backup_status: "Restore Requested",
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to request backup restore.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.detail || errorMessage;
        } catch {
          // Keep default error message
        }

        throw new Error(errorMessage);
      }

      const updatedBackup = await response.json();

      setBackups((previousBackups) =>
        previousBackups.map((item) =>
          item.id === updatedBackup.id
            ? updatedBackup
            : item
        )
      );

      setSelectedBackup(updatedBackup);

      setMessage(
        "Restore request recorded successfully. The current backend does not yet perform the physical database restore."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to request backup restore."
      );
    } finally {
      setRestoring(false);
    }
  };

  // ==========================================================
  // DELETE BACKUP RECORD
  // ==========================================================

  const handleDeleteBackup = async (backupId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this backup record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/backup/${backupId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to delete backup.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.detail || errorMessage;
        } catch {
          // Keep default error message
        }

        throw new Error(errorMessage);
      }

      setBackups((previousBackups) =>
        previousBackups.filter(
          (backup) => backup.id !== backupId
        )
      );

      if (
        selectedBackup &&
        selectedBackup.id === backupId
      ) {
        setSelectedBackup(null);
      }

      setMessage(
        "Backup record deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete backup."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleString();
  };

  // ==========================================================
  // STATUS COLOR
  // ==========================================================

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#16A34A";

      case "Restore Requested":
        return "#D97706";

      case "Failed":
        return "#DC2626";

      case "In Progress":
        return "#2563EB";

      default:
        return "#64748B";
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1 style={pageTitleStyle}>
          Backup & Restore
        </h1>

        <div style={mainCardStyle}>
          <div style={loadingStyle}>
            Loading backup information...
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={pageTitleStyle}>
        Backup & Restore
      </h1>

      {/* ====================================================
          SUCCESS MESSAGE
      ==================================================== */}

      {message && (
        <div style={successMessageStyle}>
          {message}
        </div>
      )}

      {/* ====================================================
          ERROR MESSAGE
      ==================================================== */}

      {error && (
        <div style={errorMessageStyle}>
          {error}
        </div>
      )}

      {/* ====================================================
          CREATE BACKUP
      ==================================================== */}

      <div style={mainCardStyle}>
        <h2 style={sectionTitleStyle}>
          Database Backup
        </h2>

        <p style={descriptionStyle}>
          Create and record a SmartChain Nexus backup.
          Backup information is stored through the
          SmartChain Nexus settings API.
        </p>

        <div style={formGridStyle}>
          <div>
            <label style={labelStyle}>
              Backup Name
            </label>

            <input
              type="text"
              value={backupName}
              onChange={(e) =>
                setBackupName(e.target.value)
              }
              placeholder="Enter backup name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Backup Type
            </label>

            <select
              value={backupType}
              onChange={(e) =>
                setBackupType(e.target.value)
              }
              style={inputStyle}
            >
              <option value="Full Database">
                Full Database
              </option>

              <option value="Database">
                Database
              </option>

              <option value="Configuration">
                Configuration
              </option>

              <option value="Reports">
                Reports
              </option>

              <option value="AI Models">
                AI Models
              </option>

              <option value="Full System">
                Full System
              </option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>
              Backup Location
            </label>

            <input
              type="text"
              value={backupLocation}
              onChange={(e) =>
                setBackupLocation(e.target.value)
              }
              placeholder="Example: /backups/smartchain"
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handleCreateBackup}
          disabled={creating}
          style={{
            ...buttonStyle,
            background: creating
              ? "#93C5FD"
              : "#2563EB",
            cursor: creating
              ? "not-allowed"
              : "pointer",
          }}
        >
          {creating
            ? "Creating Backup..."
            : "Create Backup"}
        </button>
      </div>

      {/* ====================================================
          BACKUP HISTORY
      ==================================================== */}

      <div
        style={{
          ...mainCardStyle,
          maxWidth: "none",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              Backup History
            </h2>

            <p style={descriptionStyle}>
              View and manage backup records stored in
              SmartChain Nexus.
            </p>
          </div>

          <button
            onClick={fetchBackups}
            style={secondaryButtonStyle}
          >
            Refresh
          </button>
        </div>

        {backups.length === 0 ? (
          <div style={emptyStateStyle}>
            No backup records found.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  <th style={tableCellHeaderStyle}>
                    ID
                  </th>

                  <th style={tableCellHeaderStyle}>
                    Backup Name
                  </th>

                  <th style={tableCellHeaderStyle}>
                    Type
                  </th>

                  <th style={tableCellHeaderStyle}>
                    Location
                  </th>

                  <th style={tableCellHeaderStyle}>
                    Status
                  </th>

                  <th style={tableCellHeaderStyle}>
                    Backup Date
                  </th>

                  <th style={tableCellHeaderStyle}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {backups.map((backup) => (
                  <tr
                    key={backup.id}
                    style={tableRowStyle}
                  >
                    <td style={tableCellStyle}>
                      #{backup.id}
                    </td>

                    <td style={tableCellStyle}>
                      <strong>
                        {backup.backup_name}
                      </strong>
                    </td>

                    <td style={tableCellStyle}>
                      {backup.backup_type}
                    </td>

                    <td style={tableCellStyle}>
                      {backup.backup_location ||
                        "Not specified"}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        fontWeight: "bold",
                        color: getStatusColor(
                          backup.backup_status
                        ),
                      }}
                    >
                      {backup.backup_status}
                    </td>

                    <td style={tableCellStyle}>
                      {formatDate(
                        backup.backup_date
                      )}
                    </td>

                    <td style={tableCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleSelectBackup(
                              backup.id
                            )
                          }
                          style={
                            smallButtonStyle
                          }
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleRestore(backup)
                          }
                          disabled={restoring}
                          style={{
                            ...smallButtonStyle,
                            background:
                              restoring
                                ? "#CBD5E1"
                                : "#D97706",
                          }}
                        >
                          {restoring
                            ? "Restoring..."
                            : "Restore"}
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteBackup(
                              backup.id
                            )
                          }
                          disabled={deleting}
                          style={{
                            ...smallButtonStyle,
                            background:
                              deleting
                                ? "#FCA5A5"
                                : "#DC2626",
                          }}
                        >
                          {deleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================================================
          SELECTED BACKUP DETAILS
      ==================================================== */}

      {selectedBackup && (
        <div
          style={{
            ...mainCardStyle,
            maxWidth: "900px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>
              Backup Details
            </h2>

            <button
              onClick={() =>
                setSelectedBackup(null)
              }
              style={closeButtonStyle}
            >
              Close
            </button>
          </div>

          <div style={detailsGridStyle}>
            <div>
              <span style={detailLabelStyle}>
                Backup ID
              </span>

              <strong>
                #{selectedBackup.id}
              </strong>
            </div>

            <div>
              <span style={detailLabelStyle}>
                Backup Name
              </span>

              <strong>
                {selectedBackup.backup_name}
              </strong>
            </div>

            <div>
              <span style={detailLabelStyle}>
                Backup Type
              </span>

              <strong>
                {selectedBackup.backup_type}
              </strong>
            </div>

            <div>
              <span style={detailLabelStyle}>
                Status
              </span>

              <strong
                style={{
                  color: getStatusColor(
                    selectedBackup.backup_status
                  ),
                }}
              >
                {selectedBackup.backup_status}
              </strong>
            </div>

            <div>
              <span style={detailLabelStyle}>
                Location
              </span>

              <strong>
                {selectedBackup.backup_location ||
                  "Not specified"}
              </strong>
            </div>

            <div>
              <span style={detailLabelStyle}>
                Backup Date
              </span>

              <strong>
                {formatDate(
                  selectedBackup.backup_date
                )}
              </strong>
            </div>

            <div>
              <span style={detailLabelStyle}>
                Created At
              </span>

              <strong>
                {formatDate(
                  selectedBackup.created_at
                )}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          RESTORE INFORMATION
      ==================================================== */}

      <div
        style={{
          ...mainCardStyle,
          maxWidth: "900px",
          marginTop: "30px",
        }}
      >
        <h2 style={sectionTitleStyle}>
          Restore Backup
        </h2>

        <p style={descriptionStyle}>
          Select a backup from the history above and
          use the Restore button to record a restore
          request.
        </p>

        <div
          style={{
            background: "#FEF3C7",
            color: "#92400E",
            padding: "15px",
            borderRadius: "8px",
            lineHeight: "1.6",
          }}
        >
          <strong>Important:</strong> The current
          SmartChain Nexus backend provides backup
          record management, but it does not yet expose
          an endpoint that physically restores the
          database or application files.
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// PAGE TITLE
// ==========================================================

const pageTitleStyle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#0F172A",
  marginBottom: "30px",
};

// ==========================================================
// MAIN CARD
// ==========================================================

const mainCardStyle = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  maxWidth: "900px",
};

// ==========================================================
// SECTION TITLE
// ==========================================================

const sectionTitleStyle = {
  marginTop: 0,
  color: "#0F172A",
};

// ==========================================================
// DESCRIPTION
// ==========================================================

const descriptionStyle = {
  color: "#64748B",
  lineHeight: "1.6",
  marginBottom: "25px",
};

// ==========================================================
// FORM GRID
// ==========================================================

const formGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

// ==========================================================
// LABEL
// ==========================================================

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#0F172A",
};

// ==========================================================
// INPUT
// ==========================================================

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  boxSizing: "border-box",
  fontSize: "15px",
  background: "#ffffff",
};

// ==========================================================
// BUTTON
// ==========================================================

const buttonStyle = {
  marginTop: "25px",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "15px",
};

// ==========================================================
// SECONDARY BUTTON
// ==========================================================

const secondaryButtonStyle = {
  background: "#E2E8F0",
  color: "#0F172A",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

// ==========================================================
// SMALL BUTTON
// ==========================================================

const smallButtonStyle = {
  background: "#2563EB",
  color: "#ffffff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};

// ==========================================================
// CLOSE BUTTON
// ==========================================================

const closeButtonStyle = {
  background: "#E2E8F0",
  color: "#0F172A",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

// ==========================================================
// TABLE
// ==========================================================

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "900px",
};

// ==========================================================
// TABLE HEADER
// ==========================================================

const tableHeaderStyle = {
  background: "#1E293B",
  color: "#ffffff",
};

// ==========================================================
// TABLE HEADER CELL
// ==========================================================

const tableCellHeaderStyle = {
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
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
  verticalAlign: "middle",
};

// ==========================================================
// DETAILS GRID
// ==========================================================

const detailsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px",
};

// ==========================================================
// DETAIL LABEL
// ==========================================================

const detailLabelStyle = {
  display: "block",
  color: "#64748B",
  fontSize: "13px",
  marginBottom: "6px",
};

// ==========================================================
// LOADING
// ==========================================================

const loadingStyle = {
  color: "#64748B",
  fontSize: "16px",
};

// ==========================================================
// EMPTY STATE
// ==========================================================

const emptyStateStyle = {
  padding: "40px",
  textAlign: "center",
  color: "#64748B",
  background: "#F8FAFC",
  borderRadius: "8px",
};

// ==========================================================
// SUCCESS MESSAGE
// ==========================================================

const successMessageStyle = {
  background: "#DCFCE7",
  color: "#166534",
  padding: "12px 15px",
  borderRadius: "8px",
  marginBottom: "20px",
};

// ==========================================================
// ERROR MESSAGE
// ==========================================================

const errorMessageStyle = {
  background: "#FEE2E2",
  color: "#991B1B",
  padding: "12px 15px",
  borderRadius: "8px",
  marginBottom: "20px",
};