import { theme } from "../../styles/theme";

type KPICardProps = {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
};

export default function KPICard({
  title,
  value,
  icon = "📊",
  color = theme.primary,
}: KPICardProps) {
  return (
    <div
      style={{
        background: theme.card,
        borderRadius: theme.radius,
        padding: "24px",
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`,
        transition: "0.3s",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: theme.subtext,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {title}
          </p>

          <h1
            style={{
              margin: "12px 0 6px",
              color: theme.text,
              fontSize: 34,
            }}
          >
            {value}
          </h1>

          <small
            style={{
              color: theme.success,
              fontWeight: 600,
            }}
          >
            ▲ 12% this month
          </small>
        </div>

        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 18,
            background: color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 34,
            color: "#fff",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}