export default function ProfileSettings() {
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
        Profile Settings
      </h1>

      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          maxWidth: "800px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label><strong>Full Name</strong></label>
          <input
            type="text"
            defaultValue="John Doe"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Email Address</strong></label>
          <input
            type="email"
            defaultValue="john@example.com"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Job Title</strong></label>
          <input
            type="text"
            defaultValue="Supply Chain Manager"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Company</strong></label>
          <input
            type="text"
            defaultValue="SmartChain Nexus"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
            }}
          />
        </div>

        <button
          style={{
            background: "#2563EB",
            color: "#fff",
            padding: "12px 30px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}