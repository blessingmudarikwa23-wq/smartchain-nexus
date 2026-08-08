export default function LeadTimeAnalysis() {
  const suppliers = [
    {
      supplier: "ABC Manufacturing",
      leadTime: "5 Days",
      target: "6 Days",
      status: "Excellent",
    },
    {
      supplier: "Global Tech Ltd",
      leadTime: "8 Days",
      target: "7 Days",
      status: "Average",
    },
    {
      supplier: "Prime Logistics",
      leadTime: "2 Days",
      target: "3 Days",
      status: "Excellent",
    },
    {
      supplier: "Universal Packaging",
      leadTime: "11 Days",
      target: "7 Days",
      status: "Delayed",
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
        Lead Time Analysis
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
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Average Lead Time</h3>
          <h1>6.5 Days</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Fastest Supplier</h3>
          <h1>2 Days</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Slowest Supplier</h3>
          <h1>11 Days</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Suppliers Meeting Target</h3>
          <h1>75%</h1>
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
            <th style={{ padding: "15px" }}>Supplier</th>
            <th>Current Lead Time</th>
            <th>Target</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>
                {supplier.supplier}
              </td>

              <td>{supplier.leadTime}</td>

              <td>{supplier.target}</td>

              <td>{supplier.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}