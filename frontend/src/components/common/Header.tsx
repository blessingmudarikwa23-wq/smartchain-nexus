import { useState } from "react";
import { theme } from "../../styles/theme";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch() {
    if (!searchTerm.trim()) {
      return;
    }

    console.log("Searching for:", searchTerm);
  }

  return (
    <header
      style={{
        background: theme.card,
        padding: "20px 35px",
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 12px rgba(0,0,0,.04)",
        position: "relative",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: theme.text,
            fontWeight: 700,
          }}
        >
          SmartChain Nexus
        </h2>

        <small
          style={{
            color: theme.subtext,
          }}
        >
          Enterprise Supply Chain Management Platform
        </small>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
        }}
      >
        {/* SEARCH */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {searchOpen && (
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search..."
              style={{
                width: "220px",
                padding: "10px 14px",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                outline: "none",
                fontSize: "14px",
                background: "#ffffff",
              }}
            />
          )}

          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              padding: "10px 16px",
              background: "#F1F5F9",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: "14px",
              color: theme.text,
            }}
          >
            🔍 Search
          </button>
        </div>

        {/* NOTIFICATIONS */}

        <div
          style={{
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          🔔
        </div>

        {/* USER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: theme.primary,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            BM
          </div>

          <div>
            <strong>Blessing Mudarikwa</strong>

            <br />

            <small style={{ color: theme.success }}>
              🟢 Online
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}