export default function Packing() {
  const packages = [
    {
      order: "SO-1001",
      packer: "John Dube",
      items: 18,
      status: "Packed",
    },
    {
      order: "SO-1002",
      packer: "Sarah Moyo",
      items: 25,
      status: "Packing",
    },
    {
      order: "SO-1003",
      packer: "David Smith",
      items: 14,
      status: "Pending",
    },
    {
      order: "SO-1004",
      packer: "Tendai Ncube",
      items: 32,
      status: "Packed",
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
        Warehouse Packing
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
          <h3>Packages Today</h3>
          <h1>52</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Packing Accuracy</h3>
          <h1>99.8%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Pending Packages</h3>
          <h1>8</h1>
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
            <th style={{ padding: "15px" }}>Sales Order</th>
            <th>Packer</th>
            <th>Items</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {packages.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.order}</td>
              <td>{item.packer}</td>
              <td>{item.items}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}