import type { Inventory } from "../../services/inventoryService";

type Props = {
  inventory: Inventory[];
  totalUnits: number;
};

export default function StockStatusCard({
  inventory,
  totalUnits,
}: Props) {
  const healthy = inventory.filter(
    (item) =>
      item.quantity > item.minimum_stock
  ).length;

  const low = inventory.filter(
    (item) =>
      item.quantity > 0 &&
      item.quantity <= item.minimum_stock
  ).length;

  const critical = inventory.filter(
    (item) => item.quantity <= 0
  ).length;

  return (
    <div style={container}>
      <div style={headingRow}>
        <div>
          <h3 style={title}>
            Stock Status
          </h3>

          <p style={subtitle}>
            Current inventory health
          </p>
        </div>

        <div style={boxIcon}>
          📊
        </div>
      </div>

      <StatusRow
        label="Healthy Stock"
        value={healthy}
        color="#16a34a"
        background="#ecfdf5"
        icon="✓"
      />

      <StatusRow
        label="Low Stock"
        value={low}
        color="#f59e0b"
        background="#fff7ed"
        icon="!"
      />

      <StatusRow
        label="Critical"
        value={critical}
        color="#dc2626"
        background="#fef2f2"
        icon="!"
      />

      <div style={totalBox}>
        <div>
          <p style={totalLabel}>
            Total Units
          </p>

          <h2 style={totalValue}>
            {totalUnits.toLocaleString("en-ZA")}
          </h2>
        </div>

        <div style={packageIcon}>
          📦
        </div>
      </div>
    </div>
  );
}

type StatusRowProps = {
  label: string;
  value: number;
  color: string;
  background: string;
  icon: string;
};

function StatusRow({
  label,
  value,
  color,
  background,
  icon,
}: StatusRowProps) {
  return (
    <div style={statusRow}>
      <div style={leftSide}>
        <div
          style={{
            ...statusIcon,
            background,
            color,
          }}
        >
          {icon}
        </div>

        <div>
          <p style={statusLabel}>
            {label}
          </p>

          <p style={statusDescription}>
            Inventory records
          </p>
        </div>
      </div>

      <strong
        style={{
          ...statusValue,
          color,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const container: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "22px",
  border: "1px solid #e5eaf2",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.07)",
};

const headingRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "22px",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 800,
  color: "#0f172a",
};

const subtitle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: "12px",
  color: "#94a3b8",
};

const boxIcon: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
};

const statusRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 0",
  borderBottom: "1px solid #f1f5f9",
};

const leftSide: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const statusIcon: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
};

const statusLabel: React.CSSProperties = {
  margin: 0,
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
};

const statusDescription: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#94a3b8",
  fontSize: "11px",
};

const statusValue: React.CSSProperties = {
  fontSize: "22px",
};

const totalBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "18px",
  padding: "16px",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, #eff6ff, #f8fafc)",
  border: "1px solid #dbeafe",
};

const totalLabel: React.CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: "12px",
  fontWeight: 600,
};

const totalValue: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#2563eb",
  fontSize: "24px",
  fontWeight: 800,
};

const packageIcon: React.CSSProperties = {
  fontSize: "27px",
};