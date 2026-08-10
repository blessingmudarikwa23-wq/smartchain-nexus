type Alert = {
  product: string;
  quantity: number;
};

type InventoryAlertsProps = {
  data: Alert[];
};

export default function InventoryAlerts({
  data,
}: InventoryAlertsProps) {
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
              color: "#ef4444",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "5px",
            }}
          >
            Attention Required
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            🚨 Inventory Alerts
          </h3>
        </div>

        <div
          style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "7px 11px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "800",
          }}
        >
          {data.length} Alerts
        </div>
      </div>

      <div style={{ padding: "8px 24px 18px" }}>
        {data.map((item) => (
          <div
            key={item.product}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background:
                    item.quantity <= 3 ? "#ef4444" : "#f59e0b",
                  boxShadow:
                    item.quantity <= 3
                      ? "0 0 0 4px rgba(239,68,68,.10)"
                      : "0 0 0 4px rgba(245,158,11,.10)",
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#334155",
                  }}
                >
                  {item.product}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "3px",
                  }}
                >
                  Stock level requires attention
                </div>
              </div>
            </div>

            <div
              style={{
                minWidth: "46px",
                textAlign: "center",
                padding: "7px 9px",
                borderRadius: "10px",
                background:
                  item.quantity <= 3 ? "#fef2f2" : "#fffbeb",
                color:
                  item.quantity <= 3 ? "#dc2626" : "#d97706",
                fontWeight: "800",
                fontSize: "13px",
              }}
            >
              {item.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}