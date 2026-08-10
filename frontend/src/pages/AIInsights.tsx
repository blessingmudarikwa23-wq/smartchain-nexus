type AIInsight = {
  title: string;
  message: string;
};

type AIInsightsProps = {
  data: AIInsight[];
};

export default function AIInsights({
  data,
}: AIInsightsProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
        }}
      >
        🤖 AI Insights
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {data.map((insight) => (
          <div
            key={insight.title}
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              {insight.title}
            </h4>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: "1.5",
              }}
            >
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}