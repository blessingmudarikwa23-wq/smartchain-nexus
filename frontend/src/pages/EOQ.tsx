export default function EOQ() {
  const products = [
    {
      product: "Laptop Dell XPS 15",
      annualDemand: 500,
      orderingCost: "$120",
      holdingCost: "$35",
      eoq: 59,
    },
    {
      product: "27-inch Monitor",
      annualDemand: 700,
      orderingCost: "$95",
      holdingCost: "$28",
      eoq: 69,
    },
    {
      product: "Mechanical Keyboard",
      annualDemand: 1200,
      orderingCost: "$70",
      holdingCost: "$12",
      eoq: 118,
    },
    {
      product: "Wireless Mouse",
      annualDemand: 2500,
      orderingCost: "$40",
      holdingCost: "$6",
      eoq: 183,
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
        Economic Order Quantity (EOQ)
      </h1>

      <div
        style={{
          background: "#DBEAFE",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h3>EOQ Formula</h3>

        <h2>EOQ = √((2 × Demand × Ordering Cost) ÷ Holding Cost)</h2>
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
            <th style={{ padding: "15px" }}>Product</th>
            <th>Annual Demand</th>
            <th>Ordering Cost</th>
            <th>Holding Cost</th>
            <th>EOQ</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.product}</td>
              <td>{item.annualDemand}</td>
              <td>{item.orderingCost}</td>
              <td>{item.holdingCost}</td>
              <td>{item.eoq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}