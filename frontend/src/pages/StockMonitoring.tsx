export default function StockMonitoring() {
  const inventory = [
    {
      sku: "SKU-001",
      product: "Laptop Dell XPS 15",
      quantity: 125,
      reorderLevel: 40,
      warehouse: "Warehouse A",
      status: "In Stock",
    },
    {
      sku: "SKU-002",
      product: "Wireless Mouse",
      quantity: 28,
      reorderLevel: 30,
      warehouse: "Warehouse B",
      status: "Low Stock",
    },
    {
      sku: "SKU-003",
      product: "Mechanical Keyboard",
      quantity: 0,
      reorderLevel: 20,
      warehouse: "Warehouse A",
      status: "Out of Stock",
    },
    {
      sku: "SKU-004",
      product: "27-inch Monitor",
      quantity: 65,
      reorderLevel: 25,
      warehouse: "Warehouse C",
      status: "In Stock",
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
        Stock Monitoring
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
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Total Products</h3>
          <h1>4</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>In Stock</h3>
          <h1>2</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Low Stock</h3>
          <h1>1</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Out of Stock</h3>
          <h1>1</h1>
        </div>
      </div>

      {/* Search */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search Product..."
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
          ➕ Add Product
        </button>
      </div>

      {/* Inventory Table */}

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
            <th style={{ padding: "15px" }}>SKU</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            <th>Warehouse</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.sku}</td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.reorderLevel}</td>
              <td>{item.warehouse}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}