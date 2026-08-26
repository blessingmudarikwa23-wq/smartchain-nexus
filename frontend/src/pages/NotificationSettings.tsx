import { useEffect, useState } from "react";

export default function NotificationSettings() {
  const API_URL = "http://localhost:8000/settings/notifications";

  const [notificationId, setNotificationId] = useState(null);

  const [settings, setSettings] = useState({
    email_notifications: true,
    system_notifications: true,
    workflow_notifications: true,
    alert_notifications: true,
    weekly_summary: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD NOTIFICATION SETTINGS
  // ==========================================================

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to load notification settings: ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Your backend returns a list from:
         * GET /settings/notifications
         *
         * We use the latest record.
         */
        if (Array.isArray(data) && data.length > 0) {
          const latestSettings = data[0];

          setNotificationId(latestSettings.id);

          setSettings({
            email_notifications:
              latestSettings.email_notifications ?? true,

            system_notifications:
              latestSettings.system_notifications ?? true,

            workflow_notifications:
              latestSettings.workflow_notifications ?? true,

            alert_notifications:
              latestSettings.alert_notifications ?? true,

            weekly_summary:
              latestSettings.weekly_summary ?? true,
          });
        }
      } catch (err) {
        console.error(
          "Error loading notification settings:",
          err
        );

        setError(
          "Unable to load notification settings from the server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotificationSettings();
  }, []);

  // ==========================================================
  // HANDLE CHECKBOX CHANGES
  // ==========================================================

  const handleChange = (event) => {
    const { name, checked } = event.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: checked,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================================
  // SAVE NOTIFICATION SETTINGS
  // ==========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      let response;

      /*
       * If a notification record already exists,
       * update it.
       */
      if (notificationId) {
        response = await fetch(
          `${API_URL}/${notificationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
          }
        );
      } else {
        /*
         * If no record exists, create one.
         *
         * Change this user_id later if your authentication
         * system provides the actual logged-in user's ID.
         */
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 1,
            ...settings,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to save settings: ${response.status}`
        );
      }

      const savedSettings = await response.json();

      setNotificationId(savedSettings.id);

      setSettings({
        email_notifications:
          savedSettings.email_notifications ?? true,

        system_notifications:
          savedSettings.system_notifications ?? true,

        workflow_notifications:
          savedSettings.workflow_notifications ?? true,

        alert_notifications:
          savedSettings.alert_notifications ?? true,

        weekly_summary:
          savedSettings.weekly_summary ?? true,
      });

      setMessage(
        "Notification settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Error saving notification settings:",
        err
      );

      setError(
        err.message ||
          "Unable to save notification settings."
      );
    } finally {
      setSaving(false);
    }
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
          Notification Settings
        </h1>

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            maxWidth: "900px",
          }}
        >
          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
            }}
          >
            Loading notification settings...
          </p>
        </div>
      </div>
    );
  }

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
        Notification Settings
      </h1>

      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          maxWidth: "900px",
        }}
      >
        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div
            style={{
              background: "#DCFCE7",
              color: "#166534",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div
            style={{
              background: "#FEE2E2",
              color: "#991B1B",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {/* ==================================================
            EMAIL NOTIFICATIONS
        ================================================== */}

        <h2
          style={{
            color: "#0F172A",
            marginBottom: "20px",
          }}
        >
          Email Notifications
        </h2>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="workflow_notifications"
            checked={settings.workflow_notifications}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Receive procurement alerts
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="alert_notifications"
            checked={settings.alert_notifications}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Receive inventory and supply chain alerts
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="email_notifications"
            checked={settings.email_notifications}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Receive AI recommendations
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="weekly_summary"
            checked={settings.weekly_summary}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Receive weekly reports
        </label>

        <hr style={{ margin: "30px 0", border: "none", borderTop: "1px solid #E2E8F0" }} />

        {/* ==================================================
            SYSTEM NOTIFICATIONS
        ================================================== */}

        <h2
          style={{
            color: "#0F172A",
            marginBottom: "20px",
          }}
        >
          System Notifications
        </h2>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="system_notifications"
            checked={settings.system_notifications}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Dashboard alerts
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="alert_notifications"
            checked={settings.alert_notifications}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Critical supply chain alerts
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            name="system_notifications"
            checked={settings.system_notifications}
            onChange={handleChange}
            style={checkboxStyle}
          />

          Maintenance reminders
        </label>

        {/* ==================================================
            SAVE BUTTON
        ================================================== */}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: "30px",
            background: saving ? "#93C5FD" : "#2563EB",
            color: "#fff",
            border: "none",
            padding: "12px 28px",
            borderRadius: "8px",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {saving
            ? "Saving..."
            : "Save Notification Settings"}
        </button>
      </div>
    </div>
  );
}

// ==========================================================
// LABEL STYLE
// ==========================================================

const labelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "18px",
  fontSize: "16px",
  color: "#334155",
  cursor: "pointer",
};

// ==========================================================
// CHECKBOX STYLE
// ==========================================================

const checkboxStyle = {
  width: "18px",
  height: "18px",
  cursor: "pointer",
};