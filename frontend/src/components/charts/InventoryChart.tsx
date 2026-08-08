import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", inventory: 420 },
  { month: "Feb", inventory: 510 },
  { month: "Mar", inventory: 470 },
  { month: "Apr", inventory: 630 },
  { month: "May", inventory: 590 },
  { month: "Jun", inventory: 710 },
];

export default function InventoryChart() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
        height: "360px",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
        }}
      >
        Inventory Trend
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="inventory"
            stroke="#2563EB"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}