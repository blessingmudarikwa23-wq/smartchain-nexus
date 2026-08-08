export default function SupplierManagement() {
  const suppliers = [
    {
      id: 1,
      supplier: "ABC Manufacturing",
      category: "Raw Materials",
      performance: "96%",
      risk: "Low",
      status: "Active",
    },
    {
      id: 2,
      supplier: "Global Tech Ltd",
      category: "Electronics",
      performance: "91%",
      risk: "Medium",
      status: "Active",
    },
    {
      id: 3,
      supplier: "Prime Logistics",
      category: "Transport",
      performance: "98%",
      risk: "Low",
      status: "Active",
    },
    {
      id: 4,
      supplier: "Universal Packaging",
      category: "Packaging",
      performance: "78%",
      risk: "High",
      status: "Pending",
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
        Supplier Management
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
          placeholder="Search Supplier..."
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #CBD5E1",
          }}
        />

        <button
          style={{
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ➕ Add Supplier
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
            <th style={{ padding: "15px" }}>Supplier</th>
            <th>Category</th>
            <th>Performance</th>
            <th>Risk</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              style={{
                borderBottom: "1px solid #E2E8F0",
                textAlign: "center",
              }}
            >
              <td style={{ padding: "15px" }}>{supplier.supplier}</td>
              <td>{supplier.category}</td>
              <td>{supplier.performance}</td>
              <td>{supplier.risk}</td>
              <td>{supplier.status}</td>

              <td>
                <button
                  style={{
                    marginRight: "8px",
                    background: "#2563EB",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  style={{
                    background: "#DC2626",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}