import { useEffect, useMemo, useState } from "react";

export default function SalesPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH SALES PREDICTIONS FROM BACKEND
  // ==========================================================

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8000/data-science/sales-prediction"
        );

        if (!response.ok) {
          throw new Error("Failed to load sales predictions");
        }

        const data = await response.json();

        setPredictions(data);
      } catch (err) {
        console.error("Sales prediction error:", err);
        setError("Unable to load sales prediction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // ==========================================================
  // CALCULATE DASHBOARD STATISTICS
  // ==========================================================

  const totalRevenue = predictions.reduce(
    (total, item) => total + Number(item.predicted_sales || 0),
    0
  );

  const averageAccuracy =
    predictions.length > 0
      ? predictions.reduce(
          (total, item) =>
            total + Number(item.prediction_accuracy || 0),
          0
        ) / predictions.length
      : 0;

  const activePredictions = predictions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "active"
  ).length;

  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const filteredPredictions = useMemo(() => {
    let result = [...predictions];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((item) =>
        String(item.month || "")
          .toLowerCase()
          .includes(search)
      );
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (item) =>
          String(item.status || "").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    if (sortOrder === "Newest First") {
      result.reverse();
    } else {
      result.reverse();
    }

    return result;
  }, [predictions, searchTerm, statusFilter, sortOrder]);

  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  // ==========================================================
  // FORMAT ACCURACY
  // ==========================================================

  const formatAccuracy = (value) => {
    const number = Number(value || 0);

    return `${number % 1 === 0 ? number : number.toFixed(1)}%`;
  };

  // ==========================================================
  // ICONS
  // ==========================================================

  const SalesIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l4-5 3 3 5-7" />
      <path d="M16 7h3v3" />
    </svg>
  );

  const RevenueIcon = () => (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
    </svg>
  );

  const AccuracyIcon = () => (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z" />
    </svg>
  );

  const PredictionIcon = () => (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15l4-4 3 2 5-6" />
      <path d="M16 7h3v3" />
    </svg>
  );

  const SearchIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );

  const FilterIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );

  const SortIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M8 6v12" />
      <path d="M5 9l3-3 3 3" />
      <path d="M16 18V6" />
      <path d="M13 15l3 3 3-3" />
    </svg>
  );

  const EditIcon = () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4L16.5 3.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "30px 28px 40px",
        boxSizing: "border-box",
        color: "#0F172A",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #8AA9FF 0%, #4F7DF3 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.18)",
            }}
          >
            <SalesIcon />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: "1.1",
                fontWeight: "750",
                letterSpacing: "-1px",
                color: "#0F172A",
              }}
            >
              Sales Prediction
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              Predict and analyze future sales performance
            </p>
          </div>
        </div>

        {/* Add Prediction Button */}

        <button
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "14px 22px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "650",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(37, 99, 235, 0.22)",
          }}
        >
          <span style={{ fontSize: "20px", lineHeight: 1 }}>+</span>
          Add Prediction
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "36px",
        }}
      >
        {/* Forecast Revenue */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E7EDF5",
            borderRadius: "14px",
            padding: "20px",
            minHeight: "105px",
            boxShadow: "0 5px 18px rgba(15, 23, 42, 0.045)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#EAF2FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RevenueIcon />
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    color: "#2563EB",
                    fontWeight: "600",
                  }}
                >
                  Forecast Revenue
                </span>
              </div>

              <div
                style={{
                  fontSize: "27px",
                  fontWeight: "750",
                  color: "#172033",
                  marginLeft: "56px",
                }}
              >
                {formatCurrency(totalRevenue)}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  marginLeft: "56px",
                  marginTop: "4px",
                }}
              >
                Total predicted sales
              </div>
            </div>

            <div
              style={{
                color: "#4F7DF3",
                fontSize: "28px",
                transform: "translateY(28px)",
              }}
            >
              ╱╲╱╲
            </div>
          </div>
        </div>

        {/* Prediction Accuracy */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E7EDF5",
            borderRadius: "14px",
            padding: "20px",
            minHeight: "105px",
            boxShadow: "0 5px 18px rgba(15, 23, 42, 0.045)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#E8F9EF",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccuracyIcon />
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    color: "#16A34A",
                    fontWeight: "600",
                  }}
                >
                  Prediction Accuracy
                </span>
              </div>

              <div
                style={{
                  fontSize: "27px",
                  fontWeight: "750",
                  color: "#172033",
                  marginLeft: "56px",
                }}
              >
                {formatAccuracy(averageAccuracy)}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  marginLeft: "56px",
                  marginTop: "4px",
                }}
              >
                Average model accuracy
              </div>
            </div>

            <div
              style={{
                color: "#16A34A",
                fontSize: "28px",
                transform: "translateY(28px)",
              }}
            >
              ╱╲╱╲
            </div>
          </div>
        </div>

        {/* Active Predictions */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E7EDF5",
            borderRadius: "14px",
            padding: "20px",
            minHeight: "105px",
            boxShadow: "0 5px 18px rgba(15, 23, 42, 0.045)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#FFF6DE",
                    color: "#F59E0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PredictionIcon />
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    color: "#D97706",
                    fontWeight: "600",
                  }}
                >
                  Active Predictions
                </span>
              </div>

              <div
                style={{
                  fontSize: "27px",
                  fontWeight: "750",
                  color: "#172033",
                  marginLeft: "56px",
                }}
              >
                {activePredictions}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  marginLeft: "56px",
                  marginTop: "4px",
                }}
              >
                Currently active models
              </div>
            </div>

            <div
              style={{
                color: "#F59E0B",
                fontSize: "28px",
                transform: "translateY(28px)",
              }}
            >
              ╱╲╱╲
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EDF4",
          borderRadius: "14px",
          padding: "9px",
          display: "grid",
          gridTemplateColumns: "1fr 180px 190px",
          gap: "9px",
          marginBottom: "18px",
          boxShadow: "0 4px 15px rgba(15, 23, 42, 0.035)",
        }}
      >
        {/* Search */}

        <div
          style={{
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: "10px",
            color: "#64748B",
          }}
        >
          <SearchIcon />

          <input
            type="text"
            placeholder="Search predictions by month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              color: "#0F172A",
              background: "transparent",
            }}
          />
        </div>

        {/* Status */}

        <div
          style={{
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 13px",
            gap: "9px",
          }}
        >
          <FilterIcon />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "14px",
              color: "#172033",
              cursor: "pointer",
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Sort */}

        <div
          style={{
            height: "46px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 13px",
            gap: "9px",
          }}
        >
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "14px",
              color: "#172033",
              cursor: "pointer",
            }}
          >
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* =====================================================
          SALES PREDICTION TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E7EDF5",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 5px 18px rgba(15, 23, 42, 0.045)",
        }}
      >
        {/* Table Header */}

        <div
          style={{
            padding: "22px 22px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PredictionIcon />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "700",
              color: "#172033",
            }}
          >
            Sales Predictions
          </h2>
        </div>

        {/* Loading */}

        {loading && (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Loading sales predictions...
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div
            style={{
              margin: "0 20px 20px",
              padding: "16px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "10px",
              color: "#DC2626",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}

        {!loading && !error && (
          <div
            style={{
              overflowX: "auto",
              padding: "0 20px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F4F7FB",
                  }}
                >
                  <th
                    style={{
                      padding: "17px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#334155",
                    }}
                  >
                    Month
                  </th>

                  <th
                    style={{
                      padding: "17px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#334155",
                    }}
                  >
                    Predicted Sales
                  </th>

                  <th
                    style={{
                      padding: "17px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#334155",
                    }}
                  >
                    Model
                  </th>

                  <th
                    style={{
                      padding: "17px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#334155",
                    }}
                  >
                    Accuracy
                  </th>

                  <th
                    style={{
                      padding: "17px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#334155",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      padding: "17px 16px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#334155",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPredictions.map((item, index) => {
                  const status =
                    String(item.status || "Active");

                  return (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom:
                          index ===
                          filteredPredictions.length - 1
                            ? "none"
                            : "1px solid #E8EDF3",
                      }}
                    >
                      {/* Month */}

                      <td
                        style={{
                          padding: "19px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "50%",
                              background: "#E8F1FF",
                              color: "#2563EB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "15px",
                              fontWeight: "700",
                            }}
                          >
                            {String(item.month || "M")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#172033",
                              }}
                            >
                              {item.month}
                            </div>

                            <div
                              style={{
                                display: "inline-block",
                                marginTop: "5px",
                                padding: "3px 8px",
                                borderRadius: "5px",
                                background: "#EAF2FF",
                                color: "#2563EB",
                                fontSize: "10px",
                                fontWeight: "700",
                              }}
                            >
                              PRED-{String(
                                item.id || index + 1
                              ).padStart(3, "0")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Predicted Sales */}

                      <td
                        style={{
                          padding: "19px 16px",
                          fontSize: "14px",
                          fontWeight: "650",
                          color: "#172033",
                        }}
                      >
                        {formatCurrency(
                          item.predicted_sales
                        )}
                      </td>

                      {/* Model */}

                      <td
                        style={{
                          padding: "19px 16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#334155",
                            fontWeight: "600",
                          }}
                        >
                          {item.model_used || "Baseline"}
                        </div>

                        <div
                          style={{
                            fontSize: "11px",
                            color: "#64748B",
                            marginTop: "4px",
                          }}
                        >
                          Prediction Model
                        </div>
                      </td>

                      {/* Accuracy */}

                      <td
                        style={{
                          padding: "19px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "80px",
                              height: "6px",
                              background: "#E8EEF5",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(
                                  Number(
                                    item.prediction_accuracy ||
                                      0
                                  ),
                                  100
                                )}%`,
                                height: "100%",
                                background: "#2563EB",
                                borderRadius: "10px",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "650",
                              color: "#172033",
                            }}
                          >
                            {formatAccuracy(
                              item.prediction_accuracy
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Status */}

                      <td
                        style={{
                          padding: "19px 16px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            padding: "7px 12px",
                            borderRadius: "20px",
                            background:
                              status.toLowerCase() ===
                              "active"
                                ? "#E9F8F0"
                                : "#F1F5F9",
                            color:
                              status.toLowerCase() ===
                              "active"
                                ? "#15803D"
                                : "#64748B",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background:
                                status.toLowerCase() ===
                                "active"
                                  ? "#16A34A"
                                  : "#94A3B8",
                            }}
                          />

                          {status}
                        </span>
                      </td>

                      {/* Actions */}

                      <td
                        style={{
                          padding: "19px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <button
                            title="Edit prediction"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              border:
                                "1px solid #DCE8FF",
                              background: "#EFF5FF",
                              color: "#2563EB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <EditIcon />
                          </button>

                          <button
                            title="Delete prediction"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              border:
                                "1px solid #FDE0E0",
                              background: "#FFF0F0",
                              color: "#DC2626",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <DeleteIcon />
                          </button>

                          <button
                            title="More actions"
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#64748B",
                              fontSize: "22px",
                              cursor: "pointer",
                              padding: "5px",
                            }}
                          >
                            ⋮
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}

            {filteredPredictions.length === 0 && (
              <div
                style={{
                  padding: "55px 20px",
                  textAlign: "center",
                  color: "#64748B",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                  }}
                >
                  📊
                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "650",
                    color: "#334155",
                  }}
                >
                  No sales predictions found
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Try changing your search or filter.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            TABLE FOOTER
        ==================================================== */}

        {!loading && !error && (
          <div
            style={{
              borderTop: "1px solid #E8EDF3",
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            <span>
              Showing{" "}
              {filteredPredictions.length > 0
                ? `1 to ${filteredPredictions.length}`
                : "0"}{" "}
              of {filteredPredictions.length} predictions
            </span>

            <div
              style={{
                display: "flex",
                gap: "7px",
              }}
            >
              <button
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  color: "#94A3B8",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ‹
              </button>

              <button
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                1
              </button>

              <button
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  color: "#64748B",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}