export default function SIPOC() {
  const sipoc = [
    {
      supplier: "Supplier Alpha",
      input: "Raw Materials",
      process: "Manufacturing",
      output: "Finished Goods",
      customer: "Retail Stores",
    },
    {
      supplier: "Vendor Beta",
      input: "Packaging",
      process: "Packaging",
      output: "Packaged Products",
      customer: "Distribution Center",
    },
    {
      supplier: "Transport Co.",
      input: "Delivery Vehicles",
      process: "Logistics",
      output: "Delivered Orders",
      customer: "Customers",
    },
    {
      supplier: "IT Department",
      input: "System Data",
      process: "Reporting",
      output: "Management Reports",
      customer: "Executives",
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
        SIPOC Analysis
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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
          <h3>Suppliers</h3>
          <h1>14</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Processes</h3>
          <h1>22</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Customers</h3>
          <h1>58</h1>
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
            <th>Input</th>
            <th>Process</th>
            <th>Output</th>
            <th>Customer</th>
          </tr>
        </thead>

        <tbody>
          {sipoc.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.supplier}</td>
              <td>{item.input}</td>
              <td>{item.process}</td>
              <td>{item.output}</td>
              <td>{item.customer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}