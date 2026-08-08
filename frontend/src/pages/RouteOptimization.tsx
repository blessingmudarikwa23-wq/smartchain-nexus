export default function RouteOptimization() {
  const routes = [
    {
      route: "Johannesburg → Pretoria",
      distance: "58 km",
      deliveries: 18,
      efficiency: "98%",
    },
    {
      route: "Cape Town CBD",
      distance: "42 km",
      deliveries: 22,
      efficiency: "96%",
    },
    {
      route: "Durban North",
      distance: "65 km",
      deliveries: 16,
      efficiency: "94%",
    },
    {
      route: "Bloemfontein East",
      distance: "71 km",
      deliveries: 19,
      efficiency: "97%",
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
        Route Optimization
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
          <h3>Optimized Routes</h3>
          <h1>48</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Fuel Saved</h3>
          <h1>18%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Average Efficiency</h3>
          <h1>96%</h1>
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
            <th style={{ padding: "15px" }}>Route</th>
            <th>Distance</th>
            <th>Deliveries</th>
            <th>Efficiency</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.route}</td>
              <td>{item.distance}</td>
              <td>{item.deliveries}</td>
              <td>{item.efficiency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}