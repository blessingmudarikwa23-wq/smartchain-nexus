export default function Receiving() {
  const deliveries = [
    {
      supplier: "Dell Technologies",
      po: "PO-1001",
      items: 120,
      status: "Received",
    },
    {
      supplier: "HP Enterprise",
      po: "PO-1002",
      items: 85,
      status: "Inspecting",
    },
    {
      supplier: "Logitech",
      po: "PO-1003",
      items: 250,
      status: "Pending",
    },
    {
      supplier: "Samsung",
      po: "PO-1004",
      items: 60,
      status: "Received",
    },
  ];

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
        Warehouse Receiving
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#DBEAFE",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Today's Deliveries</h3>
          <h1>12</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Items Received</h3>
          <h1>515</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Pending Inspection</h3>
          <h1>3</h1>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <thead
          style={{
            background: "#1E293B",
            color: "#ffffff",
          }}
        >
          <tr>
            <th style={{ padding: "15px" }}>Supplier</th>
            <th>Purchase Order</th>
            <th>Items</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{delivery.supplier}</td>
              <td>{delivery.po}</td>
              <td>{delivery.items}</td>
              <td>{delivery.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}