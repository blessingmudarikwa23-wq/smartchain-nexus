export default function DeliveryTracking() {
  const deliveries = [
    {
      order: "SO-1001",
      customer: "ABC Retail",
      destination: "Johannesburg",
      status: "Delivered",
    },
    {
      order: "SO-1002",
      customer: "XYZ Wholesalers",
      destination: "Pretoria",
      status: "In Transit",
    },
    {
      order: "SO-1003",
      customer: "Mega Stores",
      destination: "Cape Town",
      status: "Out for Delivery",
    },
    {
      order: "SO-1004",
      customer: "Smart Electronics",
      destination: "Durban",
      status: "Preparing",
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
        Delivery Tracking
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
          <h3>Total Deliveries</h3>
          <h1>124</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Delivered Today</h3>
          <h1>92</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>In Transit</h3>
          <h1>18</h1>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <thead
          style={{
            background: "#1E293B",
            color: "#fff",
          }}
        >
          <tr>
            <th style={{ padding: "15px" }}>Order</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.order}</td>
              <td>{item.customer}</td>
              <td>{item.destination}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}