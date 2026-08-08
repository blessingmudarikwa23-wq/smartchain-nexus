export default function VendorPerformance() {
  const vendors = [
    {
      supplier: "ABC Manufacturing",
      delivery: "98%",
      quality: "96%",
      leadTime: "5 Days",
      rating: "★★★★★",
    },
    {
      supplier: "Global Tech Ltd",
      delivery: "91%",
      quality: "93%",
      leadTime: "8 Days",
      rating: "★★★★☆",
    },
    {
      supplier: "Prime Logistics",
      delivery: "99%",
      quality: "98%",
      leadTime: "2 Days",
      rating: "★★★★★",
    },
    {
      supplier: "Universal Packaging",
      delivery: "82%",
      quality: "79%",
      leadTime: "11 Days",
      rating: "★★★☆☆",
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
        Vendor Performance
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
          <h3>Average Delivery</h3>
          <h1>93%</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Average Quality</h3>
          <h1>92%</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Average Lead Time</h3>
          <h1>6 Days</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h3>Preferred Vendors</h3>
          <h1>18</h1>
        </div>
      </div>

      {/* Vendor Table */}

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
            <th>On-Time Delivery</th>
            <th>Quality</th>
            <th>Lead Time</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>
                {vendor.supplier}
              </td>

              <td>{vendor.delivery}</td>

              <td>{vendor.quality}</td>

              <td>{vendor.leadTime}</td>

              <td>{vendor.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}