export default function StockStatusCard() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          fontSize: "20px",
        }}
      >
        📊 Stock Status
      </h3>

      <div style={card}>
        <div>
          <p style={label}>Healthy Stock</p>
          <h2 style={{ color: "#10b981" }}>
            218
          </h2>
        </div>

        <span style={greenIcon}>
          🟢
        </span>
      </div>


      <div style={card}>
        <div>
          <p style={label}>Low Stock</p>
          <h2 style={{ color: "#f59e0b" }}>
            24
          </h2>
        </div>

        <span style={yellowIcon}>
          🟡
        </span>
      </div>


      <div style={card}>
        <div>
          <p style={label}>Critical</p>
          <h2 style={{ color: "#dc2626" }}>
            8
          </h2>
        </div>

        <span style={redIcon}>
          🔴
        </span>
      </div>


      <div style={card}>
        <div>
          <p style={label}>Total Units</p>
          <h2 style={{ color: "#2563eb" }}>
            1250
          </h2>
        </div>

        <span style={blueIcon}>
          📦
        </span>
      </div>

    </div>
  );
}


const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "12px",
  background: "#f8fafc",
};


const label: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
};


const greenIcon: React.CSSProperties = {
  fontSize: "28px",
};


const yellowIcon: React.CSSProperties = {
  fontSize: "28px",
};


const redIcon: React.CSSProperties = {
  fontSize: "28px",
};


const blueIcon: React.CSSProperties = {
  fontSize: "28px",
};