type Alert = {
  product: string;
  quantity: number;
};

const alerts: Alert[] = [
  { product: "Laptop Stand", quantity: 4 },
  { product: "Wireless Mouse", quantity: 7 },
  { product: "USB-C Cable", quantity: 2 },
  { product: "Keyboard", quantity: 8 },
];

export default function InventoryAlerts() {
  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ marginBottom: 20 }}>
        🚨 Inventory Alerts
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="right">Qty</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((item) => (
            <tr key={item.product}>
              <td
                style={{
                  padding: "12px 0",
                }}
              >
                {item.product}
              </td>

              <td
                align="right"
                style={{
                  color: "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}