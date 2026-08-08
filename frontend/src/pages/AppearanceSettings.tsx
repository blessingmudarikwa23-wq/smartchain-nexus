import { useState } from "react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("Light");
  const [language, setLanguage] = useState("English");

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
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          maxWidth: "900px",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <label style={labelStyle}>Theme</label>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={inputStyle}
          >
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={labelStyle}>Language</label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={inputStyle}
          >
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
            <option>Portuguese</option>
          </select>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={labelStyle}>Dashboard Density</label>

          <select style={inputStyle}>
            <option>Comfortable</option>
            <option>Compact</option>
            <option>Expanded</option>
          </select>
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
          Save Appearance
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