export default function NaturalLanguageQueries() {
  const queries = [
    {
      question: "Which products are below reorder level?",
      response: "12 products require immediate replenishment.",
      status: "Completed",
    },
    {
      question: "Show this month's sales performance.",
      response: "Sales increased by 14% compared to last month.",
      status: "Completed",
    },
    {
      question: "Which supplier has the highest risk?",
      response: "Prime Logistics has the highest current risk score.",
      status: "Completed",
    },
    {
      question: "What is the current inventory value?",
      response: "Current inventory value is R18.4 million.",
      status: "Completed",
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
        Natural Language Queries
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
          <h3>Total Queries</h3>
          <h1>152</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>AI Accuracy</h3>
          <h1>97%</h1>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Average Response</h3>
          <h1>1.3 sec</h1>
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
            <th style={{ padding: "15px" }}>Question</th>
            <th>AI Response</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {queries.map((item, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{item.question}</td>
              <td>{item.response}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}