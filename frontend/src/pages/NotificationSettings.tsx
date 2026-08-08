export default function NotificationSettings() {
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
        <h2>Email Notifications</h2>

        <label style={labelStyle}>
          <input type="checkbox" defaultChecked />
          Receive procurement alerts
        </label>

        <label style={labelStyle}>
          <input type="checkbox" defaultChecked />
          Receive inventory alerts
        </label>

        <label style={labelStyle}>
          <input type="checkbox" defaultChecked />
          Receive AI recommendations
        </label>

        <label style={labelStyle}>
          <input type="checkbox" />
          Receive weekly reports
        </label>

        <hr style={{ margin: "30px 0" }} />

        <h2>System Notifications</h2>

        <label style={labelStyle}>
          <input type="checkbox" defaultChecked />
          Dashboard alerts
        </label>

        <label style={labelStyle}>
          <input type="checkbox" defaultChecked />
          Critical supply chain alerts
        </label>

        <label style={labelStyle}>
          <input type="checkbox" />
          Maintenance reminders
        </label>

        <button
          style={{
            marginTop: "30px",
            background: "#2563EB",
            color: "#fff",
            border: "none",
            padding: "12px 28px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "18px",
  fontSize: "16px",
};