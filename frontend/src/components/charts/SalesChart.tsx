import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type SalesChartData = {
  month: string;
  sales: number;
  purchase: number;
};

type SalesChartProps = {
  data: SalesChartData[];
};

export default function SalesChart({ data }: SalesChartProps) {
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
        Sales vs Purchase Orders
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="purchase"
            name="Purchase"
            fill="#10B981"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="sales"
            name="Sales"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}