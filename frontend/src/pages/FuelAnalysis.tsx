export default function FuelAnalysis() {
  const fuelData = [
    {
      vehicle: "Truck 101",
      driver: "John Dube",
      fuelUsed: "92 L",
      distance: "580 km",
      efficiency: "6.30 km/L",
    },
    {
      vehicle: "Truck 102",
      driver: "Sarah Moyo",
      fuelUsed: "105 L",
      distance: "640 km",
      efficiency: "6.10 km/L",
    },
    {
      vehicle: "Truck 103",
      driver: "David Smith",
      fuelUsed: "88 L",
      distance: "520 km",
      efficiency: "5.91 km/L",
    },
    {
      vehicle: "Truck 104",
      driver: "Tendai Ncube",
      fuelUsed: "96 L",
      distance: "610 km",
      efficiency: "6.35 km/L",
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
        Fuel Analysis
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
          <h3>Total Fuel Used</h3>
          <h1>381 L</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Average Efficiency</h3>
          <h1>6.17 km/L</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Fuel Cost Today</h3>
          <h1>R11,820</h1>
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
            <th style={{ padding: "15px" }}>Vehicle</th>
            <th>Driver</th>
            <th>Fuel Used</th>
            <th>Distance</th>
            <th>Efficiency</th>
          </tr>
        </thead>

        <tbody>
          {fuelData.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.vehicle}</td>
              <td>{item.driver}</td>
              <td>{item.fuelUsed}</td>
              <td>{item.distance}</td>
              <td>{item.efficiency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}