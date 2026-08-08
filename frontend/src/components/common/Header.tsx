import { theme } from "../../styles/theme";

export default function Header() {
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
        <div
          style={{
            padding: "10px 16px",
            background: "#F1F5F9",
            borderRadius: 12,
          }}
        >
          🔍 Search
        </div>

        <div
          style={{
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          🔔
        </div>

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