export default function SpendAnalytics() {
  const spendData = [
    {
      supplier: "ABC Manufacturing",
      spend: "$245,000",
      percentage: "35%",
    },
    {
      supplier: "Global Tech Ltd",
      spend: "$180,000",
      percentage: "26%",
    },
    {
      supplier: "Prime Logistics",
      spend: "$145,000",
      percentage: "21%",
    },
    {
      supplier: "Universal Packaging",
      spend: "$130,000",
      percentage: "18%",
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
        Spend Analytics
      </h1>

      {/* KPI Cards */}

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
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Total Procurement Spend</h3>
          <h1>$700,000</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Monthly Spend</h3>
          <h1>$58,333</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Active Suppliers</h3>
          <h1>24</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Cost Savings</h3>
          <h1>$48,000</h1>
        </div>
      </div>

      {/* Spend Table */}

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
            <th>Total Spend</th>
            <th>Contribution</th>
          </tr>
        </thead>

        <tbody>
          {spendData.map((supplier, index) => (
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

              <td>{supplier.spend}</td>

              <td>{supplier.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}