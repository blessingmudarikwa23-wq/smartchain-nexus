export default function PurchaseOrders() {
  const orders = [
    {
      id: "PO-1001",
      supplier: "ABC Manufacturing",
      amount: "$12,450",
      status: "Approved",
    },
    {
      id: "PO-1002",
      supplier: "Global Tech Ltd",
      amount: "$8,900",
      status: "Pending",
    },
    {
      id: "PO-1003",
      supplier: "Prime Logistics",
      amount: "$5,300",
      status: "Received",
    },
    {
      id: "PO-1004",
      supplier: "Universal Packaging",
      amount: "$15,800",
      status: "Cancelled",
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: "25px",
        }}
      >
        Purchase Orders
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search Purchase Order..."
          style={{
            width: "320px",
            padding: "12px",
            border: "1px solid #CBD5E1",
            borderRadius: "8px",
          }}
        />

        <button
          style={{
            background: "#2563EB",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ➕ Create Purchase Order
        </button>
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
            <th style={{ padding: "15px" }}>PO Number</th>
            <th>Supplier</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{order.id}</td>
              <td>{order.supplier}</td>
              <td>{order.amount}</td>
              <td>{order.status}</td>

              <td>
                <button
                  style={{
                    background: "#2563EB",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>

                <button
                  style={{
                    background: "#16A34A",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}