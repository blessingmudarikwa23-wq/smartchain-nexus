export default function CycleCounts() {
  const counts = [
    {
      location: "Aisle A1",
      product: "Laptop Dell XPS 15",
      systemQty: 120,
      countedQty: 119,
      variance: "-1",
    },
    {
      location: "Aisle B2",
      product: "27-inch Monitor",
      systemQty: 85,
      countedQty: 85,
      variance: "0",
    },
    {
      location: "Aisle C4",
      product: "Mechanical Keyboard",
      systemQty: 210,
      countedQty: 208,
      variance: "-2",
    },
    {
      location: "Aisle D5",
      product: "Wireless Mouse",
      systemQty: 350,
      countedQty: 352,
      variance: "+2",
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
        Warehouse Cycle Counts
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
          <h3>Locations Counted</h3>
          <h1>18</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Inventory Accuracy</h3>
          <h1>99.3%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Total Variances</h3>
          <h1>5</h1>
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
            <th style={{ padding: "15px" }}>Location</th>
            <th>Product</th>
            <th>System Qty</th>
            <th>Counted Qty</th>
            <th>Variance</th>
          </tr>
        </thead>

        <tbody>
          {counts.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.location}</td>
              <td>{item.product}</td>
              <td>{item.systemQty}</td>
              <td>{item.countedQty}</td>
              <td>{item.variance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}