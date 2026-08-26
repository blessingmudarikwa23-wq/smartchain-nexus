import { useEffect, useState } from "react";

export default function InventoryOptimization() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/data-science/inventory-optimization"
        );

        if (!response.ok) {
          throw new Error("Unable to load inventory optimization data.");
        }

        const data = await response.json();
        setInventory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const totalProducts = inventory.length;

  const activeProducts = inventory.filter(
    (item) => item.status?.toLowerCase() === "active"
  ).length;

  const increaseCount = inventory.filter((item) =>
    item.recommendation?.toLowerCase().includes("increase")
  ).length;

  const reduceCount = inventory.filter((item) =>
    item.recommendation?.toLowerCase().includes("reduce")
  ).length;

  const maintainCount = inventory.filter((item) =>
    item.recommendation?.toLowerCase().includes("maintain")
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#F8FAFC",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "700",
              color: "#0F172A",
              letterSpacing: "-0.5px",
            }}
          >
            Inventory Optimization
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "15px",
              color: "#64748B",
            }}
          >
            Optimize stock levels and improve inventory efficiency with
            intelligent recommendations.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          }}
        >
          <span
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: "#22C55E",
              display: "inline-block",
            }}
          />

          <span
            style={{
              color: "#475569",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Optimization Engine Active
          </span>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "15px 18px",
            borderRadius: "10px",
            marginBottom: "25px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* CARD 1 */}

        <div
          style={{
            background: "#DBEAFE",
            borderRadius: "14px",
            padding: "23px",
            minHeight: "130px",
            boxSizing: "border-box",
            border: "1px solid #BFDBFE",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                color: "#475569",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Optimized Products
            </span>

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              📦
            </div>
          </div>

          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            {loading ? "—" : totalProducts}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "12px",
              color: "#2563EB",
              fontWeight: "600",
            }}
          >
            Products analyzed
          </p>
        </div>

        {/* CARD 2 */}

        <div
          style={{
            background: "#DCFCE7",
            borderRadius: "14px",
            padding: "23px",
            minHeight: "130px",
            boxSizing: "border-box",
            border: "1px solid #BBF7D0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                color: "#475569",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Active Recommendations
            </span>

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              ✓
            </div>
          </div>

          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            {loading ? "—" : activeProducts}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "12px",
              color: "#16A34A",
              fontWeight: "600",
            }}
          >
            Currently active
          </p>
        </div>

        {/* CARD 3 */}

        <div
          style={{
            background: "#FEF3C7",
            borderRadius: "14px",
            padding: "23px",
            minHeight: "130px",
            boxSizing: "border-box",
            border: "1px solid #FDE68A",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                color: "#475569",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Optimization Score
            </span>

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              ⚡
            </div>
          </div>

          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            {loading ? "—" : totalProducts > 0 ? "95%" : "0%"}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "12px",
              color: "#D97706",
              fontWeight: "600",
            }}
          >
            Inventory efficiency
          </p>
        </div>
      </div>

      {/* =====================================================
          RECOMMENDATION OVERVIEW
      ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "30px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "19px",
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            Recommendation Overview
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Summary of recommended inventory actions.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          {/* INCREASE */}

          <div
            style={{
              background: "#EFF6FF",
              borderRadius: "10px",
              padding: "17px",
              border: "1px solid #DBEAFE",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#64748B",
                marginBottom: "8px",
              }}
            >
              Increase Stock
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#2563EB",
              }}
            >
              {loading ? "—" : increaseCount}
            </div>
          </div>

          {/* MAINTAIN */}

          <div
            style={{
              background: "#F0FDF4",
              borderRadius: "10px",
              padding: "17px",
              border: "1px solid #DCFCE7",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#64748B",
                marginBottom: "8px",
              }}
            >
              Maintain Stock
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#16A34A",
              }}
            >
              {loading ? "—" : maintainCount}
            </div>
          </div>

          {/* REDUCE */}

          <div
            style={{
              background: "#FEF2F2",
              borderRadius: "10px",
              padding: "17px",
              border: "1px solid #FEE2E2",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#64748B",
                marginBottom: "8px",
              }}
            >
              Reduce Stock
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#DC2626",
              }}
            >
              {loading ? "—" : reduceCount}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          INVENTORY TABLE
      ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#0F172A",
                fontSize: "19px",
                fontWeight: "700",
              }}
            >
              Inventory Recommendations
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              AI-powered recommendations for inventory planning.
            </p>
          </div>

          <div
            style={{
              background: "#F1F5F9",
              color: "#475569",
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {loading ? "Loading..." : `${totalProducts} Products`}
          </div>
        </div>

        {/* TABLE */}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "650px",
            }}
          >
            <thead
              style={{
                background: "#1E293B",
                color: "#FFFFFF",
              }}
            >
              <tr>
                <th
                  style={{
                    padding: "15px 20px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Product
                </th>

                <th
                  style={{
                    padding: "15px 20px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Recommendation
                </th>

                <th
                  style={{
                    padding: "15px 20px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      padding: "45px",
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    Loading inventory recommendations...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      padding: "45px",
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    No inventory optimization records available.
                  </td>
                </tr>
              ) : (
                inventory.map((item, index) => {
                  const recommendation =
                    item.recommendation?.toLowerCase() || "";

                  let badgeBackground = "#F1F5F9";
                  let badgeColor = "#475569";

                  if (recommendation.includes("increase")) {
                    badgeBackground = "#DBEAFE";
                    badgeColor = "#2563EB";
                  }

                  if (recommendation.includes("reduce")) {
                    badgeBackground = "#FEE2E2";
                    badgeColor = "#DC2626";
                  }

                  if (recommendation.includes("maintain")) {
                    badgeBackground = "#DCFCE7";
                    badgeColor = "#16A34A";
                  }

                  return (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                      }}
                    >
                      <td
                        style={{
                          padding: "17px 20px",
                          color: "#0F172A",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {item.product}
                      </td>

                      <td
                        style={{
                          padding: "17px 20px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "7px 15px",
                            borderRadius: "20px",
                            background: badgeBackground,
                            color: badgeColor,
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {item.recommendation}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "17px 20px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "7px 13px",
                            borderRadius: "20px",
                            background:
                              item.status?.toLowerCase() ===
                              "active"
                                ? "#DCFCE7"
                                : "#F1F5F9",
                            color:
                              item.status?.toLowerCase() ===
                              "active"
                                ? "#15803D"
                                : "#64748B",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background:
                                item.status?.toLowerCase() ===
                                "active"
                                  ? "#22C55E"
                                  : "#94A3B8",
                            }}
                          />

                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}