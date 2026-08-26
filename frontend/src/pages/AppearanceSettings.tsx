import { useEffect, useState } from "react";

export default function AppearanceSettings() {
  const API_URL = "http://127.0.0.1:8000/settings";

  // ==========================================================
  // APPEARANCE SETTINGS STATE
  // ==========================================================

  const [appearanceId, setAppearanceId] = useState(null);

  const [userId, setUserId] = useState(1);
  const [theme, setTheme] = useState("Light");
  const [accentColor, setAccentColor] = useState("Blue");
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD APPEARANCE SETTINGS
  // ==========================================================

  useEffect(() => {
    fetchAppearanceSettings();
  }, []);

  const fetchAppearanceSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/appearances`
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to load appearance settings.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Ignore JSON parsing errors
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // ======================================================
      // LOAD MOST RECENT APPEARANCE RECORD
      // ======================================================

      if (Array.isArray(data) && data.length > 0) {
        const appearance = data[0];

        setAppearanceId(appearance.id);

        setUserId(
          appearance.user_id ?? 1
        );

        setTheme(
          appearance.theme || "Light"
        );

        setAccentColor(
          appearance.accent_color || "Blue"
        );

        setCompactMode(
          appearance.compact_mode ?? false
        );

        setSidebarCollapsed(
          appearance.sidebar_collapsed ?? false
        );
      } else {
        // ====================================================
        // NO RECORD EXISTS
        // ====================================================

        setAppearanceId(null);

        setUserId(1);
        setTheme("Light");
        setAccentColor("Blue");
        setCompactMode(false);
        setSidebarCollapsed(false);
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to load appearance settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // SAVE APPEARANCE SETTINGS
  // ==========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      // ======================================================
      // PAYLOAD MATCHES AppearanceSettingsCreate / Update
      // ======================================================

      const payload = {
        theme: theme,
        accent_color: accentColor,
        compact_mode: compactMode,
        sidebar_collapsed: sidebarCollapsed,
      };

      let response;

      // ======================================================
      // UPDATE EXISTING RECORD
      // ======================================================

      if (appearanceId !== null) {
        response = await fetch(
          `${API_URL}/appearance/${appearanceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      // ======================================================
      // CREATE NEW RECORD
      // ======================================================

      else {
        response = await fetch(
          `${API_URL}/appearance`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              ...payload,
            }),
          }
        );
      }

      // ======================================================
      // HANDLE API ERROR
      // ======================================================

      if (!response.ok) {
        let errorMessage =
          "Failed to save appearance settings.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail
                .map(
                  (item) =>
                    item.msg ||
                    "Validation error"
                )
                .join(", ");
            } else {
              errorMessage = errorData.detail;
            }
          }
        } catch {
          // Ignore JSON parsing errors
        }

        throw new Error(errorMessage);
      }

      // ======================================================
      // GET SAVED RECORD
      // ======================================================

      const savedAppearance =
        await response.json();

      setAppearanceId(savedAppearance.id);

      setUserId(
        savedAppearance.user_id ?? userId
      );

      setTheme(
        savedAppearance.theme || "Light"
      );

      setAccentColor(
        savedAppearance.accent_color || "Blue"
      );

      setCompactMode(
        savedAppearance.compact_mode ?? false
      );

      setSidebarCollapsed(
        savedAppearance.sidebar_collapsed ??
          false
      );

      setMessage(
        "Appearance settings saved successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to save appearance settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE APPEARANCE SETTINGS
  // ==========================================================

  const handleDelete = async () => {
    if (appearanceId === null) {
      setError(
        "There are no appearance settings to delete."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your appearance settings?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/appearance/${appearanceId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to delete appearance settings.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Ignore JSON parsing errors
        }

        throw new Error(errorMessage);
      }

      // ======================================================
      // RESET FRONTEND TO BACKEND DEFAULTS
      // ======================================================

      setAppearanceId(null);

      setTheme("Light");
      setAccentColor("Blue");
      setCompactMode(false);
      setSidebarCollapsed(false);

      setMessage(
        "Appearance settings deleted successfully. Default settings restored."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete appearance settings."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // RESET FORM TO BACKEND DEFAULT VALUES
  // ==========================================================

  const handleReset = () => {
    setTheme("Light");
    setAccentColor("Blue");
    setCompactMode(false);
    setSidebarCollapsed(false);

    setMessage(
      "Appearance settings reset to default values. Click Save Appearance to apply them."
    );

    setError("");
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: "30px",
          }}
        >
          Appearance Settings
        </h1>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
            maxWidth: "900px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#475569",
            }}
          >
            Loading appearance settings...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN COMPONENT
  // ==========================================================

  return (
    <div style={{ padding: "30px" }}>
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: "10px",
        }}
      >
        Appearance Settings
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "30px",
        }}
      >
        Customize the appearance and layout of
        SmartChain Nexus.
      </p>

      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow:
            "0 8px 20px rgba(0,0,0,.08)",
          maxWidth: "900px",
        }}
      >
        {/* ====================================================
            SUCCESS MESSAGE
        ==================================================== */}

        {message && (
          <div
            style={{
              background: "#DCFCE7",
              color: "#166534",
              padding: "14px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border:
                "1px solid #BBF7D0",
            }}
          >
            {message}
          </div>
        )}

        {/* ====================================================
            ERROR MESSAGE
        ==================================================== */}

        {error && (
          <div
            style={{
              background: "#FEE2E2",
              color: "#991B1B",
              padding: "14px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border:
                "1px solid #FECACA",
            }}
          >
            {error}
          </div>
        )}

        {/* ====================================================
            USER ID
        ==================================================== */}

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label style={labelStyle}>
            User ID
          </label>

          <input
            type="number"
            value={userId}
            onChange={(e) =>
              setUserId(
                Number(e.target.value)
              )
            }
            disabled={appearanceId !== null}
            style={{
              ...inputStyle,
              background:
                appearanceId !== null
                  ? "#F1F5F9"
                  : "#ffffff",
              cursor:
                appearanceId !== null
                  ? "not-allowed"
                  : "text",
            }}
          />

          <small
            style={{
              display: "block",
              marginTop: "7px",
              color: "#64748B",
            }}
          >
            This corresponds to the
            backend user_id field.
          </small>
        </div>

        {/* ====================================================
            THEME
        ==================================================== */}

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label style={labelStyle}>
            Theme
          </label>

          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value)
            }
            style={inputStyle}
          >
            <option value="Light">
              Light
            </option>

            <option value="Dark">
              Dark
            </option>
          </select>

          <small
            style={{
              display: "block",
              marginTop: "7px",
              color: "#64748B",
            }}
          >
            Select the visual theme used by
            SmartChain Nexus.
          </small>
        </div>

        {/* ====================================================
            ACCENT COLOR
        ==================================================== */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <label style={labelStyle}>
            Accent Color
          </label>

          <select
            value={accentColor}
            onChange={(e) =>
              setAccentColor(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="Blue">
              Blue
            </option>

            <option value="Green">
              Green
            </option>

            <option value="Purple">
              Purple
            </option>

            <option value="Orange">
              Orange
            </option>

            <option value="Red">
              Red
            </option>
          </select>

          <small
            style={{
              display: "block",
              marginTop: "7px",
              color: "#64748B",
            }}
          >
            Choose the accent color for the
            application interface.
          </small>
        </div>

        {/* ====================================================
            COMPACT MODE
        ==================================================== */}

        <div
          style={{
            padding: "18px",
            border:
              "1px solid #E2E8F0",
            borderRadius: "10px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) =>
                setCompactMode(
                  e.target.checked
                )
              }
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />

            <div>
              <label
                style={{
                  fontWeight: "700",
                  color: "#0F172A",
                  cursor: "pointer",
                }}
              >
                Compact Mode
              </label>

              <p
                style={{
                  margin:
                    "5px 0 0 0",
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                Use a more compact layout
                throughout the application.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            SIDEBAR COLLAPSED
        ==================================================== */}

        <div
          style={{
            padding: "18px",
            border:
              "1px solid #E2E8F0",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <input
              type="checkbox"
              checked={sidebarCollapsed}
              onChange={(e) =>
                setSidebarCollapsed(
                  e.target.checked
                )
              }
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />

            <div>
              <label
                style={{
                  fontWeight: "700",
                  color: "#0F172A",
                  cursor: "pointer",
                }}
              >
                Sidebar Collapsed
              </label>

              <p
                style={{
                  margin:
                    "5px 0 0 0",
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                Keep the application sidebar
                collapsed by default.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            SETTINGS STATUS
        ==================================================== */}

        <div
          style={{
            background: "#F8FAFC",
            padding: "18px",
            borderRadius: "10px",
            marginBottom: "30px",
            border:
              "1px solid #E2E8F0",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "15px",
              color: "#0F172A",
            }}
          >
            Current Settings
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <strong>Theme:</strong>{" "}
              {theme}
            </div>

            <div>
              <strong>Accent:</strong>{" "}
              {accentColor}
            </div>

            <div>
              <strong>Compact:</strong>{" "}
              {compactMode
                ? "Enabled"
                : "Disabled"}
            </div>

            <div>
              <strong>Sidebar:</strong>{" "}
              {sidebarCollapsed
                ? "Collapsed"
                : "Expanded"}
            </div>
          </div>
        </div>

        {/* ====================================================
            ACTION BUTTONS
        ==================================================== */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* SAVE */}

          <button
            onClick={handleSave}
            disabled={
              saving || deleting
            }
            style={{
              background:
                saving || deleting
                  ? "#93C5FD"
                  : "#2563EB",
              color: "#ffffff",
              border: "none",
              padding:
                "12px 30px",
              borderRadius: "8px",
              cursor:
                saving || deleting
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
            }}
          >
            {saving
              ? "Saving..."
              : "Save Appearance"}
          </button>

          {/* RESET */}

          <button
            onClick={handleReset}
            disabled={
              saving || deleting
            }
            style={{
              background: "#E2E8F0",
              color: "#0F172A",
              border: "none",
              padding:
                "12px 30px",
              borderRadius: "8px",
              cursor:
                saving || deleting
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
            }}
          >
            Reset Defaults
          </button>

          {/* DELETE */}

          {appearanceId !== null && (
            <button
              onClick={handleDelete}
              disabled={
                saving || deleting
              }
              style={{
                background:
                  deleting
                    ? "#FCA5A5"
                    : "#DC2626",
                color: "#ffffff",
                border: "none",
                padding:
                  "12px 30px",
                borderRadius: "8px",
                cursor:
                  saving || deleting
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "bold",
              }}
            >
              {deleting
                ? "Deleting..."
                : "Delete Settings"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// LABEL STYLE
// ==========================================================

const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontWeight: "bold",
  color: "#0F172A",
};

// ==========================================================
// INPUT STYLE
// ==========================================================

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  background: "#ffffff",
  color: "#0F172A",
  boxSizing: "border-box",
};