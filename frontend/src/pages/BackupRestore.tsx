export default function BackupRestore() {
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
        Backup & Restore
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
        <h2>Database Backup</h2>

        <p>
          Create a full backup of your SmartChain Nexus database,
          dashboards, reports, AI models, and configuration.
        </p>

        <button
          style={buttonStyle}
        >
          Create Backup
        </button>

        <hr style={{ margin: "30px 0" }} />

        <h2>Restore Backup</h2>

        <p>
          Restore the application using a previously generated backup.
        </p>

        <input
          type="file"
          style={{
            marginBottom: "20px",
          }}
        />

        <br />

        <button
          style={{
            ...buttonStyle,
            background: "#DC2626",
          }}
        >
          Restore System
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  marginTop: "20px",
  background: "#2563EB",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};