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
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "22px 24px",
          borderBottom: "1px solid #eef2f7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#7c3aed",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "5px",
            }}
          >
            Intelligent Analysis
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            🤖 AI Insights
          </h3>
        </div>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "#f5f3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          ✨
        </div>
      </div>

      <div style={{ padding: "8px 24px 18px" }}>
        {data.map((insight, index) => (
          <div
            key={`${insight.title}-${index}`}
            style={{
              display: "flex",
              gap: "14px",
              padding: "16px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                flexShrink: 0,
                borderRadius: "10px",
                background:
                  index === 0
                    ? "#eff6ff"
                    : index === 1
                    ? "#fff7ed"
                    : "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
              }}
            >
              {index === 0 ? "📦" : index === 1 ? "⚠️" : "📈"}
            </div>

            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#334155",
                  marginBottom: "5px",
                }}
              >
                {insight.title}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "#64748b",
                }}
              >
                {insight.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}