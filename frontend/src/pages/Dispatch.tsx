export default function Dispatch() {
  const dispatches = [
    {
      order: "SO-1001",
      destination: "Johannesburg",
      courier: "DHL",
      status: "Dispatched",
    },
    {
      order: "SO-1002",
      destination: "Cape Town",
      courier: "FedEx",
      status: "Loading",
    },
    {
      order: "SO-1003",
      destination: "Durban",
      courier: "Courier Guy",
      status: "Pending",
    },
    {
      order: "SO-1004",
      destination: "Pretoria",
      courier: "Aramex",
      status: "Dispatched",
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
        Warehouse Dispatch
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
          <h3>Orders Dispatched Today</h3>
          <h1>46</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>On-Time Dispatch</h3>
          <h1>98.9%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Pending Dispatch</h3>
          <h1>9</h1>
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
            <th>Destination</th>
            <th>Courier</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {dispatches.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.order}</td>
              <td>{item.destination}</td>
              <td>{item.courier}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}