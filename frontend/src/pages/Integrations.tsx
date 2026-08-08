export default function Integrations() {
  const integrations = [
    {
      name: "Power BI",
      description: "Business Intelligence Integration",
      status: "Connected",
    },
    {
      name: "Microsoft Excel",
      description: "Import & Export Data",
      status: "Connected",
    },
    {
      name: "SAP ERP",
      description: "Enterprise Resource Planning",
      status: "Disconnected",
    },
    {
      name: "Oracle ERP",
      description: "Supply Chain Integration",
      status: "Disconnected",
    },
    {
      name: "OpenAI",
      description: "AI Supply Chain Assistant",
      status: "Connected",
    },
    {
      name: "SMTP Email",
      description: "Email Notifications",
      status: "Connected",
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
        Integrations
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px",
        }}
      >
        {integrations.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            }}
          >
            <h2>{item.name}</h2>

            <p>{item.description}</p>

            <p
              style={{
                fontWeight: "bold",
                color:
                  item.status === "Connected"
                    ? "#16A34A"
                    : "#DC2626",
              }}
            >
              {item.status}
            </p>

            <button
              style={{
                marginTop: "15px",
                background:
                  item.status === "Connected"
                    ? "#DC2626"
                    : "#2563EB",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {item.status === "Connected"
                ? "Disconnect"
                : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}