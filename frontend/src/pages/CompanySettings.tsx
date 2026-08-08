export default function CompanySettings() {
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
        Company Settings
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          maxWidth: "900px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label><strong>Company Name</strong></label>
          <input
            defaultValue="SmartChain Nexus"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Business Registration</strong></label>
          <input
            defaultValue="SCN-2026"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Company Email</strong></label>
          <input
            defaultValue="info@smartchainnexus.com"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Phone Number</strong></label>
          <input
            defaultValue="+27 11 123 4567"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Address</strong></label>
          <textarea
            defaultValue="Johannesburg, South Africa"
            style={{
              ...inputStyle,
              height: "120px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Currency</strong></label>

          <select style={inputStyle}>
            <option>South African Rand (ZAR)</option>
            <option>US Dollar (USD)</option>
            <option>Euro (EUR)</option>
            <option>Pound Sterling (GBP)</option>
          </select>
        </div>

        <button style={buttonStyle}>
          Save Company Settings
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
};

const buttonStyle = {
  background: "#2563EB",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};