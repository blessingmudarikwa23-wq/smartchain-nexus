import { useState } from "react";

export default function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(true);

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
        Security Settings
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
        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            Enable Two-Factor Authentication
          </span>

          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />
        </div>

        <button
          style={{
            background: "#2563EB",
            color: "#fff",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Update Security Settings
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
};