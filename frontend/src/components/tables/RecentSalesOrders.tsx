type SalesOrder = {
  customer: string;
  reference: string;
  amount: number | string;
};

type RecentSalesOrdersProps = {
  data: SalesOrder[];
};

export default function RecentSalesOrders({
  data,
}: RecentSalesOrdersProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "22px 24px",
          borderBottom: "1px solid #eef2f7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "5px",
            }}
          >
            Revenue
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            💰 Sales Orders
          </h3>
        </div>

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "#ecfdf5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          💵
        </div>
      </div>

      <div style={{ padding: "8px 24px 18px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr auto",
            gap: "16px",
            padding: "12px 0",
            borderBottom: "1px solid #e2e8f0",
            color: "#94a3b8",
            fontSize: "11px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <span>Customer</span>
          <span>Reference</span>
          <span style={{ textAlign: "right" }}>Amount</span>
        </div>

        {data.map((order) => {
          const formattedAmount =
            typeof order.amount === "number"
              ? `$${order.amount.toLocaleString()}`
              : order.amount;

          return (
            <div
              key={order.reference}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr auto",
                gap: "16px",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#334155",
                }}
              >
                {order.customer}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: "600",
                }}
              >
                {order.reference}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#2563eb",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {formattedAmount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}