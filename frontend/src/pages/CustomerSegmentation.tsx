import { useMemo, useState } from "react";

export default function CustomerSegmentation() {
  const customers = [
    {
      id: "SEG-004",
      segment: "Enterprise",
      customers: 48,
      revenue: 5200000,
      growth: 12,
      status: "Active",
    },
    {
      id: "SEG-003",
      segment: "SME",
      customers: 156,
      revenue: 2850000,
      growth: 9,
      status: "Active",
    },
    {
      id: "SEG-002",
      segment: "Retail",
      customers: 482,
      revenue: 1760000,
      growth: 6,
      status: "Active",
    },
    {
      id: "SEG-001",
      segment: "Wholesale",
      customers: 93,
      revenue: 3180000,
      growth: 10,
      status: "Active",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Highest Revenue");

  const formatCurrency = (value) => {
    return `R ${value.toLocaleString("en-ZA")}`;
  };

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((item) => {
      const matchesSearch =
        item.segment
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "Highest Revenue") {
      result.sort((a, b) => b.revenue - a.revenue);
    }

    if (sortOrder === "Lowest Revenue") {
      result.sort((a, b) => a.revenue - b.revenue);
    }

    if (sortOrder === "Most Customers") {
      result.sort((a, b) => b.customers - a.customers);
    }

    if (sortOrder === "Highest Growth") {
      result.sort((a, b) => b.growth - a.growth);
    }

    return result;
  }, [searchTerm, statusFilter, sortOrder]);

  const totalCustomers = customers.reduce(
    (total, item) => total + item.customers,
    0
  );

  const highestRevenueSegment = customers.reduce((highest, item) =>
    item.revenue > highest.revenue ? item : highest
  );

  const averageGrowth =
    customers.reduce((total, item) => total + item.growth, 0) /
    customers.length;

  const totalRevenue = customers.reduce(
    (total, item) => total + item.revenue,
    0
  );

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "30px",
        background: "#F8FAFC",
        color: "#0F172A",
        boxSizing: "border-box",
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
          gap: "20px",
          marginBottom: "30px",
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
          {/* Page Icon */}

          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "50%",
              background: "#E0E7FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <svg
              width="31"
              height="31"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="7" r="3" />
              <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              <circle cx="17" cy="8" r="2.5" />
              <path d="M16 14c2.8 0 5 2.2 5 5" />
            </svg>

            <span
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                background: "#22C55E",
                borderRadius: "50%",
                right: "3px",
                bottom: "3px",
                border: "2px solid #E0E7FF",
              }}
            />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: "700",
                letterSpacing: "-0.8px",
                color: "#0F172A",
              }}
            >
              Customer Segmentation
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              Analyze and manage customer segments
            </p>
          </div>
        </div>

        {/* Add Segment Button */}

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "14px 20px",
            borderRadius: "11px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 5px 12px rgba(37, 99, 235, 0.20)",
          }}
        >
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            +
          </span>

          Add Segment
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        {/* Total Customers */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8EDF5",
            borderRadius: "13px",
            padding: "19px",
            minHeight: "110px",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "#E8F0FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="7" r="3" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                <circle cx="17" cy="8" r="2.5" />
                <path d="M16 14c2.8 0 5 2.2 5 5" />
              </svg>
            </div>

            <span
              style={{
                fontSize: "24px",
                color: "#3B82F6",
                opacity: 0.75,
              }}
            >
              ↗
            </span>
          </div>

          <p
            style={{
              margin: "13px 0 5px",
              fontSize: "13px",
              color: "#2563EB",
              fontWeight: "500",
            }}
          >
            Total Customers
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            {totalCustomers.toLocaleString()}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            Across all segments
          </p>
        </div>

        {/* Highest Revenue */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8EDF5",
            borderRadius: "13px",
            padding: "19px",
            minHeight: "110px",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "#E7F8EF",
                color: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12l4-4 4 3 7-7" />
                <path d="M18 4h4v4" />
                <path d="M3 20h18" />
              </svg>
            </div>

            <span
              style={{
                fontSize: "24px",
                color: "#10B981",
                opacity: 0.75,
              }}
            >
              ↗
            </span>
          </div>

          <p
            style={{
              margin: "13px 0 5px",
              fontSize: "13px",
              color: "#059669",
              fontWeight: "500",
            }}
          >
            Highest Revenue Segment
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "25px",
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            {highestRevenueSegment.segment}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            {formatCurrency(highestRevenueSegment.revenue)} revenue
          </p>
        </div>

        {/* Average Growth */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8EDF5",
            borderRadius: "13px",
            padding: "19px",
            minHeight: "110px",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "#FFF4D9",
                color: "#F59E0B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M7 15l4-5 3 3 6-7" />
              </svg>
            </div>

            <span
              style={{
                fontSize: "24px",
                color: "#F59E0B",
                opacity: 0.75,
              }}
            >
              ↗
            </span>
          </div>

          <p
            style={{
              margin: "13px 0 5px",
              fontSize: "13px",
              color: "#D97706",
              fontWeight: "500",
            }}
          >
            Average Growth
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            {averageGrowth.toFixed(1)}%
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            Segment growth rate
          </p>
        </div>

        {/* Total Revenue */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8EDF5",
            borderRadius: "13px",
            padding: "19px",
            minHeight: "110px",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "#F0E7FF",
                color: "#7C3AED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v10" />
                <path d="M15 9.5c0-1.2-1.2-2-3-2s-3 .8-3 2 1.2 2 3 2 3 .8 3 2-1.2 2-3 2-3-.8-3-2" />
              </svg>
            </div>

            <span
              style={{
                fontSize: "24px",
                color: "#8B5CF6",
                opacity: 0.75,
              }}
            >
              ↗
            </span>
          </div>

          <p
            style={{
              margin: "13px 0 5px",
              fontSize: "13px",
              color: "#7C3AED",
              fontWeight: "500",
            }}
          >
            Total Segment Revenue
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "25px",
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            {formatCurrency(totalRevenue)}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            Combined revenue
          </p>
        </div>
      </div>

      {/* =====================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EDF5",
          borderRadius: "13px",
          padding: "10px",
          marginBottom: "16px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
          display: "grid",
          gridTemplateColumns: "1fr 180px 190px",
          gap: "10px",
        }}
      >
        {/* Search */}

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "15px",
              color: "#64748B",
              fontSize: "19px",
            }}
          >
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search segments by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              height: "46px",
              border: "1px solid #E2E8F0",
              borderRadius: "9px",
              padding: "0 15px 0 43px",
              outline: "none",
              fontSize: "13px",
              color: "#334155",
              boxSizing: "border-box",
              background: "#FFFFFF",
            }}
          />
        </div>

        {/* Status Filter */}

        <div style={{ position: "relative" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              height: "46px",
              border: "1px solid #E2E8F0",
              borderRadius: "9px",
              padding: "0 12px",
              outline: "none",
              fontSize: "13px",
              color: "#334155",
              background: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Sort */}

        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              width: "100%",
              height: "46px",
              border: "1px solid #E2E8F0",
              borderRadius: "9px",
              padding: "0 12px",
              outline: "none",
              fontSize: "13px",
              color: "#334155",
              background: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <option>Highest Revenue</option>
            <option>Lowest Revenue</option>
            <option>Most Customers</option>
            <option>Highest Growth</option>
          </select>
        </div>
      </div>

      {/* =====================================================
          CUSTOMER SEGMENT TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8EDF5",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 5px 16px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Table Header */}

        <div
          style={{
            padding: "20px 22px",
            display: "flex",
            alignItems: "center",
            gap: "11px",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#E8F0FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="7" r="3" />
              <circle cx="17" cy="8" r="2.5" />
              <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              <path d="M16 14c2.8 0 5 2.2 5 5" />
            </svg>
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "700",
              color: "#0F172A",
            }}
          >
            Customer Segments
          </h2>
        </div>

        {/* Table */}

        <div
          style={{
            width: "100%",
            overflowX: "auto",
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
                  background: "#F5F8FC",
                  color: "#475569",
                }}
              >
                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Segment
                </th>

                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Segment ID
                </th>

                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Customers
                </th>

                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Revenue
                </th>

                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Growth
                </th>

                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    padding: "17px 20px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #EEF2F7",
                    transition: "background 0.2s ease",
                  }}
                >
                  {/* Segment */}

                  <td
                    style={{
                      padding: "18px 20px",
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
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background:
                            item.segment === "Enterprise"
                              ? "#E8F0FF"
                              : item.segment === "SME"
                              ? "#E7F8EF"
                              : item.segment === "Retail"
                              ? "#FFF0E4"
                              : "#F0E7FF",
                          color:
                            item.segment === "Enterprise"
                              ? "#2563EB"
                              : item.segment === "SME"
                              ? "#10B981"
                              : item.segment === "Retail"
                              ? "#F97316"
                              : "#7C3AED",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        {item.segment.charAt(0)}
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#0F172A",
                            fontSize: "13px",
                          }}
                        >
                          {item.segment}
                        </div>

                        <div
                          style={{
                            marginTop: "3px",
                            fontSize: "11px",
                            color: "#64748B",
                          }}
                        >
                          Customer Segment
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Segment ID */}

                  <td
                    style={{
                      padding: "18px 20px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "6px",
                        background: "#EEF4FF",
                        color: "#2563EB",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {item.id}
                    </span>
                  </td>

                  {/* Customers */}

                  <td
                    style={{
                      padding: "18px 20px",
                      fontSize: "13px",
                      color: "#334155",
                      fontWeight: "600",
                    }}
                  >
                    {item.customers.toLocaleString()}
                  </td>

                  {/* Revenue */}

                  <td
                    style={{
                      padding: "18px 20px",
                      fontSize: "13px",
                      color: "#334155",
                      fontWeight: "600",
                    }}
                  >
                    {formatCurrency(item.revenue)}
                  </td>

                  {/* Growth */}

                  <td
                    style={{
                      padding: "18px 20px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 9px",
                        borderRadius: "7px",
                        background: "#EAF8F0",
                        color: "#059669",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      ↗ {item.growth}%
                    </span>
                  </td>

                  {/* Status */}

                  <td
                    style={{
                      padding: "18px 20px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        background: "#EAF8F0",
                        color: "#059669",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          background: "#10B981",
                          borderRadius: "50%",
                        }}
                      />

                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}

                  <td
                    style={{
                      padding: "18px 20px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {/* Edit */}

                      <button
                        title="Edit segment"
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #DCE7FF",
                          background: "#F1F5FF",
                          color: "#2563EB",
                          borderRadius: "9px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z" />
                        </svg>
                      </button>

                      {/* Delete */}

                      <button
                        title="Delete segment"
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #FDE0E0",
                          background: "#FFF0F0",
                          color: "#EF4444",
                          borderRadius: "9px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v5" />
                          <path d="M14 11v5" />
                        </svg>
                      </button>

                      {/* More */}

                      <button
                        title="More actions"
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#64748B",
                          fontSize: "20px",
                          cursor: "pointer",
                          padding: "5px",
                        }}
                      >
                        ⋮
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =================================================
            TABLE FOOTER
        ================================================== */}

        <div
          style={{
            minHeight: "62px",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #EEF2F7",
            color: "#64748B",
            fontSize: "12px",
          }}
        >
          <span>
            Showing {filteredCustomers.length} of {customers.length} segments
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <button
              style={{
                width: "34px",
                height: "34px",
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                borderRadius: "8px",
                color: "#94A3B8",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ‹
            </button>

            <button
              style={{
                width: "34px",
                height: "34px",
                border: "none",
                background: "#2563EB",
                borderRadius: "8px",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              1
            </button>

            <button
              style={{
                width: "34px",
                height: "34px",
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                borderRadius: "8px",
                color: "#64748B",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}