import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import api from "../services/api";

interface CycleCount {
  id: number;
  count_number: string;
  warehouse: string;
  item_name: string;
  sku: string;
  system_quantity: number;
  counted_quantity: number;
  variance: number;
  counted_by: string;
  count_date?: string;
  status: string;
  remarks?: string | null;
}

interface CycleCountForm {
  count_number: string;
  warehouse: string;
  item_name: string;
  sku: string;
  system_quantity: number;
  counted_quantity: number;
  counted_by: string;
  count_date: string;
  status: string;
  remarks: string;
}

const emptyForm: CycleCountForm = {
  count_number: "",
  warehouse: "",
  item_name: "",
  sku: "",
  system_quantity: 0,
  counted_quantity: 0,
  counted_by: "",
  count_date: "",
  status: "Pending",
  remarks: "",
};

export default function CycleCounts() {
  const [counts, setCounts] = useState<CycleCount[]>(
    []
  );

  const [loading, setLoading] =
    useState<boolean>(true);

  const [saving, setSaving] =
    useState<boolean>(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string>("");

  const [success, setSuccess] =
    useState<string>("");

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<CycleCountForm>(
      emptyForm
    );

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState<string>("All");

  const [sortOrder, setSortOrder] =
    useState<string>("Newest First");

  const [openMenuId, setOpenMenuId] =
    useState<number | null>(null);

  // ==========================================================
  // FETCH CYCLE COUNTS
  // ==========================================================

  const fetchCycleCounts =
    async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<CycleCount[]>(
            "/warehouse/cycle-counts"
          );

        setCounts(response.data);
      } catch (err) {
        console.error(
          "Cycle Counts Error:",
          err
        );

        setError(
          "Unable to load cycle count records. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCycleCounts();
  }, []);

  // ==========================================================
  // FORM
  // ==========================================================

  const resetForm = (): void => {
    setFormData({
      ...emptyForm,
    });

    setEditingId(null);
  };

  const closeForm = (): void => {
    setShowForm(false);
    resetForm();
  };

  const handleNewCount = (): void => {
    setError("");
    setSuccess("");
    resetForm();
    setShowForm(true);
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ): void => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          name ===
            "system_quantity" ||
          name ===
            "counted_quantity"
            ? Number(value)
            : value,
      })
    );
  };

  const handleEdit = (
    item: CycleCount
  ): void => {
    setError("");
    setSuccess("");
    setOpenMenuId(null);

    setEditingId(item.id);

    setFormData({
      count_number:
        item.count_number || "",

      warehouse:
        item.warehouse || "",

      item_name:
        item.item_name || "",

      sku:
        item.sku || "",

      system_quantity:
        Number(
          item.system_quantity || 0
        ),

      counted_quantity:
        Number(
          item.counted_quantity || 0
        ),

      counted_by:
        item.counted_by || "",

      count_date:
        item.count_date
          ? item.count_date.substring(
              0,
              10
            )
          : "",

      status:
        item.status ||
        "Pending",

      remarks:
        item.remarks || "",
    });

    setShowForm(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this cycle count?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");
      setOpenMenuId(null);

      await api.delete(
        `/warehouse/cycle-counts/${id}`
      );

      await fetchCycleCounts();

      setSuccess(
        "Cycle count deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete Cycle Count Error:",
        err
      );

      setError(
        "Unable to delete the cycle count."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        count_number:
          formData.count_number.trim(),

        warehouse:
          formData.warehouse.trim(),

        item_name:
          formData.item_name.trim(),

        sku:
          formData.sku.trim(),

        system_quantity:
          Number(
            formData.system_quantity
          ),

        counted_quantity:
          Number(
            formData.counted_quantity
          ),

        counted_by:
          formData.counted_by.trim(),

        count_date:
          formData.count_date
            ? `${formData.count_date}T00:00:00`
            : undefined,

        status:
          formData.status,

        remarks:
          formData.remarks.trim() ||
          null,
      };

      if (
        editingId !== null
      ) {
        await api.put(
          `/warehouse/cycle-counts/${editingId}`,
          payload
        );

        setSuccess(
          "Cycle count updated successfully."
        );
      } else {
        await api.post(
          "/warehouse/cycle-counts",
          payload
        );

        setSuccess(
          "Cycle count created successfully."
        );
      }

      closeForm();

      await fetchCycleCounts();
    } catch (err: any) {
      console.error(
        "Save Cycle Count Error:",
        err
      );

      const backendMessage =
        err?.response?.data
          ?.detail;

      setError(
        typeof backendMessage ===
          "string"
          ? backendMessage
          : "Unable to save the cycle count."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredCounts =
    useMemo(() => {
      let result =
        [...counts];

      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (search) {
        result =
          result.filter(
            (item) =>
              item.item_name
                ?.toLowerCase()
                .includes(search) ||
              item.sku
                ?.toLowerCase()
                .includes(search) ||
              item.count_number
                ?.toLowerCase()
                .includes(search) ||
              item.warehouse
                ?.toLowerCase()
                .includes(search) ||
              item.counted_by
                ?.toLowerCase()
                .includes(search)
          );
      }

      if (
        statusFilter !==
        "All"
      ) {
        result =
          result.filter(
            (item) =>
              item.status
                ?.toLowerCase() ===
              statusFilter.toLowerCase()
          );
      }

      result.sort(
        (a, b) => {
          const dateA =
            a.count_date
              ? new Date(
                  a.count_date
                ).getTime()
              : 0;

          const dateB =
            b.count_date
              ? new Date(
                  b.count_date
                ).getTime()
              : 0;

          if (
            sortOrder ===
            "Oldest First"
          ) {
            return (
              dateA - dateB
            );
          }

          if (
            sortOrder ===
            "Highest Variance"
          ) {
            return (
              Math.abs(
                Number(
                  b.variance ||
                    0
                )
              ) -
              Math.abs(
                Number(
                  a.variance ||
                    0
                )
              )
            );
          }

          return (
            dateB - dateA
          );
        }
      );

      return result;
    }, [
      counts,
      searchTerm,
      statusFilter,
      sortOrder,
    ]);

  // ==========================================================
  // KPIs
  // ==========================================================

  const totalLocations =
    useMemo(() => {
      return new Set(
        counts.map(
          (item) =>
            item.warehouse
        )
      ).size;
    }, [counts]);

  const totalVariances =
    useMemo(() => {
      return counts.reduce(
        (
          total,
          item
        ) =>
          total +
          Math.abs(
            Number(
              item.variance ||
                0
            )
          ),
        0
      );
    }, [counts]);

  const varianceRecords =
    useMemo(() => {
      return counts.filter(
        (item) =>
          Number(
            item.variance ||
              0
          ) !== 0
      ).length;
    }, [counts]);

  const accuracy =
    useMemo(() => {
      if (
        counts.length ===
        0
      ) {
        return 100;
      }

      const totalSystem =
        counts.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.system_quantity ||
                0
            ),
          0
        );

      const totalVariance =
        counts.reduce(
          (
            total,
            item
          ) =>
            total +
            Math.abs(
              Number(
                item.variance ||
                  0
              )
            ),
          0
        );

      if (
        totalSystem ===
        0
      ) {
        return 100;
      }

      return Math.max(
        0,
        Math.min(
          100,
          ((totalSystem -
            totalVariance) /
            totalSystem) *
            100
        )
      );
    }, [counts]);

  const completedCount =
    counts.filter(
      (item) =>
        item.status
          ?.toLowerCase() ===
        "completed"
    ).length;

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatDate = (
    dateValue?: string
  ): string => {
    if (!dateValue) {
      return "-";
    }

    const date =
      new Date(
        dateValue
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-ZA",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getInitial =
    (
      value: string
    ): string => {
      return (
        value
          ?.trim()
          .charAt(0)
          .toUpperCase() ||
        "C"
      );
    };

  const getStatusStyle = (
    status: string
  ): {
    background: string;
    color: string;
    dot: string;
  } => {
    switch (
      status?.toLowerCase()
    ) {
      case "completed":
        return {
          background:
            "#ECFDF5",
          color:
            "#047857",
          dot:
            "#10B981",
        };

      case "counting":
        return {
          background:
            "#EFF6FF",
          color:
            "#2563EB",
          dot:
            "#3B82F6",
        };

      case "pending":
        return {
          background:
            "#FFFBEB",
          color:
            "#B45309",
          dot:
            "#F59E0B",
        };

      case "review":
        return {
          background:
            "#F5F3FF",
          color:
            "#7C3AED",
          dot:
            "#8B5CF6",
        };

      default:
        return {
          background:
            "#F1F5F9",
          color:
            "#475569",
          dot:
            "#64748B",
        };
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#F8FAFC",
        padding:
          "30px",
        boxSizing:
          "border-box",
      }}
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: "20px",
          flexWrap:
            "wrap",
          marginBottom:
            "28px",
        }}
      >
        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius:
                "50%",
              background:
                "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              fontSize:
                "27px",
              boxShadow:
                "0 6px 15px rgba(37,99,235,0.12)",
            }}
          >
            📋
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize:
                  "34px",
                fontWeight:
                  800,
                color:
                  "#0F172A",
                letterSpacing:
                  "-0.8px",
              }}
            >
              Cycle Counts
            </h1>

            <p
              style={{
                margin:
                  "6px 0 0",
                color:
                  "#64748B",
                fontSize:
                  "14px",
              }}
            >
              Monitor inventory
              counts, variances
              and warehouse
              stock accuracy.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            handleNewCount
          }
          style={{
            ...primaryButton,
            padding:
              "13px 21px",
            boxShadow:
              "0 7px 18px rgba(37,99,235,0.22)",
          }}
        >
          <span
            style={{
              fontSize:
                "18px",
              marginRight:
                "7px",
            }}
          >
            ⊕
          </span>

          New Cycle Count
        </button>
      </div>

      {/* ================================================== */}
      {/* ALERTS */}
      {/* ================================================== */}

      {error && (
        <div
          style={{
            marginBottom:
              "18px",
            padding:
              "13px 17px",
            borderRadius:
              "10px",
            background:
              "#FEF2F2",
            border:
              "1px solid #FECACA",
            color:
              "#991B1B",
            fontSize:
              "14px",
            fontWeight:
              600,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom:
              "18px",
            padding:
              "13px 17px",
            borderRadius:
              "10px",
            background:
              "#ECFDF5",
            border:
              "1px solid #BBF7D0",
            color:
              "#047857",
            fontSize:
              "14px",
            fontWeight:
              600,
          }}
        >
          {success}
        </div>
      )}

      {/* ================================================== */}
      {/* KPI CARDS */}
      {/* ================================================== */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom:
            "24px",
        }}
      >
        <div
          style={{
            ...kpiCard,
            background:
              "#FFFFFF",
          }}
        >
          <div
            style={{
              ...kpiIcon,
              background:
                "#E8F0FF",
              color:
                "#2563EB",
            }}
          >
            👥
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <p
              style={
                kpiLabel
              }
            >
              Locations Counted
            </p>

            <h2
              style={
                kpiNumber
              }
            >
              {totalLocations}
            </h2>

            <p
              style={
                kpiDescription
              }
            >
              Active warehouse
              locations
            </p>
          </div>

          <div
            style={{
              color:
                "#2563EB",
              fontSize:
                "22px",
            }}
          >
            ↗
          </div>
        </div>

        <div
          style={{
            ...kpiCard,
            background:
              "#FFFFFF",
          }}
        >
          <div
            style={{
              ...kpiIcon,
              background:
                "#E8FBF2",
              color:
                "#10B981",
            }}
          >
            ✓
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <p
              style={
                kpiLabel
              }
            >
              Inventory Accuracy
            </p>

            <h2
              style={
                kpiNumber
              }
            >
              {accuracy.toFixed(
                1
              )}
              %
            </h2>

            <p
              style={
                kpiDescription
              }
            >
              {completedCount} completed
              counts
            </p>
          </div>

          <div
            style={{
              color:
                "#10B981",
              fontSize:
                "22px",
            }}
          >
            ↗
          </div>
        </div>

        <div
          style={{
            ...kpiCard,
            background:
              "#FFFFFF",
          }}
        >
          <div
            style={{
              ...kpiIcon,
              background:
                "#FFF5DB",
              color:
                "#F59E0B",
            }}
          >
            ⚠
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <p
              style={
                kpiLabel
              }
            >
              Total Variances
            </p>

            <h2
              style={
                kpiNumber
              }
            >
              {totalVariances.toLocaleString()}
            </h2>

            <p
              style={
                kpiDescription
              }
            >
              Units requiring
              attention
            </p>
          </div>

          <div
            style={{
              color:
                "#F59E0B",
              fontSize:
                "22px",
            }}
          >
            ↗
          </div>
        </div>

        <div
          style={{
            ...kpiCard,
            background:
              "#FFFFFF",
          }}
        >
          <div
            style={{
              ...kpiIcon,
              background:
                "#F3EAFE",
              color:
                "#7C3AED",
            }}
          >
            ◉
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <p
              style={
                kpiLabel
              }
            >
              Variance Records
            </p>

            <h2
              style={
                kpiNumber
              }
            >
              {varianceRecords}
            </h2>

            <p
              style={
                kpiDescription
              }
            >
              Records with
              differences
            </p>
          </div>

          <div
            style={{
              color:
                "#7C3AED",
              fontSize:
                "22px",
            }}
          >
            ↗
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SEARCH + FILTER */}
      {/* ================================================== */}

      <div
        style={{
          background:
            "#FFFFFF",
          border:
            "1px solid #E2E8F0",
          borderRadius:
            "14px",
          padding:
            "14px",
          marginBottom:
            "18px",
          display:
            "grid",
          gridTemplateColumns:
            "minmax(260px, 1fr) 190px 190px",
          gap: "12px",
          boxShadow:
            "0 5px 18px rgba(15,23,42,0.04)",
        }}
      >
        <div
          style={{
            position:
              "relative",
          }}
        >
          <span
            style={{
              position:
                "absolute",
              left: "15px",
              top: "50%",
              transform:
                "translateY(-50%)",
              color:
                "#64748B",
              fontSize:
                "17px",
            }}
          >
            ⌕
          </span>

          <input
            value={
              searchTerm
            }
            onChange={(event) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
            placeholder="Search cycle counts by item, SKU, warehouse..."
            style={{
              ...input,
              paddingLeft:
                "42px",
              height:
                "46px",
              border:
                "1px solid #E2E8F0",
              borderRadius:
                "10px",
            }}
          />
        </div>

        <select
          value={
            statusFilter
          }
          onChange={(event) =>
            setStatusFilter(
              event.target
                .value
            )
          }
          style={{
            ...input,
            height:
              "46px",
            border:
              "1px solid #E2E8F0",
            borderRadius:
              "10px",
          }}
        >
          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Counting">
            Counting
          </option>

          <option value="Review">
            Review
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          value={
            sortOrder
          }
          onChange={(event) =>
            setSortOrder(
              event.target
                .value
            )
          }
          style={{
            ...input,
            height:
              "46px",
            border:
              "1px solid #E2E8F0",
            borderRadius:
              "10px",
          }}
        >
          <option>
            Newest First
          </option>

          <option>
            Oldest First
          </option>

          <option>
            Highest Variance
          </option>
        </select>
      </div>

      {/* ================================================== */}
      {/* TABLE CARD */}
      {/* ================================================== */}

      <div
        style={{
          background:
            "#FFFFFF",
          border:
            "1px solid #E2E8F0",
          borderRadius:
            "16px",
          overflow:
            "hidden",
          boxShadow:
            "0 8px 25px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            padding:
              "20px 22px",
            borderBottom:
              "1px solid #E2E8F0",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <div>
            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  color:
                    "#2563EB",
                  fontSize:
                    "21px",
                }}
              >
                ♙
              </span>

              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "19px",
                  color:
                    "#0F172A",
                  fontWeight:
                    800,
                }}
              >
                Cycle Count Records
              </h2>
            </div>

            <p
              style={{
                margin:
                  "5px 0 0 31px",
                color:
                  "#64748B",
                fontSize:
                  "13px",
              }}
            >
              Live inventory
              counting records
              from the warehouse
              backend.
            </p>
          </div>

          <div
            style={{
              padding:
                "7px 12px",
              borderRadius:
                "999px",
              background:
                "#EFF6FF",
              color:
                "#2563EB",
              fontSize:
                "12px",
              fontWeight:
                700,
            }}
          >
            {
              filteredCounts.length
            }{" "}
            Records
          </div>
        </div>

        {loading ? (
          <div
            style={
              messageBox
            }
          >
            <div
              style={{
                fontSize:
                  "30px",
                marginBottom:
                  "10px",
              }}
            >
              ⏳
            </div>

            Loading cycle
            count records...
          </div>
        ) : filteredCounts.length ===
          0 ? (
          <div
            style={
              messageBox
            }
          >
            <div
              style={{
                fontSize:
                  "40px",
                marginBottom:
                  "10px",
              }}
            >
              📋
            </div>

            <h3
              style={{
                margin:
                  "0 0 7px",
                color:
                  "#334155",
              }}
            >
              No cycle count
              records found
            </h3>

            <p
              style={{
                margin:
                  "0 0 17px",
              }}
            >
              Create a new
              cycle count or
              adjust your
              search filters.
            </p>

            <button
              type="button"
              onClick={
                handleNewCount
              }
              style={
                primaryButton
              }
            >
              + New Cycle Count
            </button>
          </div>
        ) : (
          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width:
                  "100%",
                borderCollapse:
                  "collapse",
                minWidth:
                  "1250px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#F8FAFC",
                    borderBottom:
                      "1px solid #E2E8F0",
                  }}
                >
                  <th
                    style={
                      tableHeader
                    }
                  >
                    Cycle Count
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Warehouse
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Item
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    SKU
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    System Qty
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Counted Qty
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Variance
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Counted By
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Count Date
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Status
                  </th>

                  <th
                    style={
                      tableHeader
                    }
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCounts.map(
                  (item) => {
                    const variance =
                      Number(
                        item.variance ||
                          0
                      );

                    const statusStyle =
                      getStatusStyle(
                        item.status
                      );

                    return (
                      <tr
                        key={
                          item.id
                        }
                        style={{
                          borderBottom:
                            "1px solid #EEF2F7",
                        }}
                      >
                        {/* COUNT NUMBER */}

                        <td
                          style={{
                            ...tableCell,
                            textAlign:
                              "left",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "11px",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  "40px",
                                height:
                                  "40px",
                                borderRadius:
                                  "50%",
                                background:
                                  "#E8F0FF",
                                color:
                                  "#2563EB",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight:
                                  800,
                                fontSize:
                                  "14px",
                              }}
                            >
                              {getInitial(
                                item.count_number
                              )}
                            </div>

                            <div>
                              <div
                                style={{
                                  fontWeight:
                                    700,
                                  color:
                                    "#0F172A",
                                }}
                              >
                                {
                                  item.count_number
                                }
                              </div>

                              <div
                                style={{
                                  marginTop:
                                    "3px",
                                  display:
                                    "inline-block",
                                  padding:
                                    "3px 7px",
                                  borderRadius:
                                    "5px",
                                  background:
                                    "#EFF6FF",
                                  color:
                                    "#2563EB",
                                  fontSize:
                                    "10px",
                                  fontWeight:
                                    700,
                                }}
                              >
                                COUNT
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* WAREHOUSE */}

                        <td
                          style={
                            tableCell
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                600,
                              color:
                                "#334155",
                            }}
                          >
                            {
                              item.warehouse
                            }
                          </div>
                        </td>

                        {/* ITEM */}

                        <td
                          style={{
                            ...tableCell,
                            textAlign:
                              "left",
                          }}
                        >
                          <div
                            style={{
                              fontWeight:
                                700,
                              color:
                                "#0F172A",
                            }}
                          >
                            {
                              item.item_name
                            }
                          </div>

                          <div
                            style={{
                              marginTop:
                                "4px",
                              color:
                                "#94A3B8",
                              fontSize:
                                "12px",
                            }}
                          >
                            Inventory
                            item
                          </div>
                        </td>

                        {/* SKU */}

                        <td
                          style={
                            tableCell
                          }
                        >
                          <span
                            style={{
                              padding:
                                "5px 8px",
                              borderRadius:
                                "6px",
                              background:
                                "#F8FAFC",
                              border:
                                "1px solid #E2E8F0",
                              color:
                                "#475569",
                              fontSize:
                                "12px",
                              fontWeight:
                                600,
                            }}
                          >
                            {
                              item.sku
                            }
                          </span>
                        </td>

                        {/* SYSTEM */}

                        <td
                          style={{
                            ...tableCell,
                            fontWeight:
                              700,
                          }}
                        >
                          {Number(
                            item.system_quantity ||
                              0
                          ).toLocaleString()}
                        </td>

                        {/* COUNTED */}

                        <td
                          style={{
                            ...tableCell,
                            fontWeight:
                              700,
                            color:
                              "#2563EB",
                          }}
                        >
                          {Number(
                            item.counted_quantity ||
                              0
                          ).toLocaleString()}
                        </td>

                        {/* VARIANCE */}

                        <td
                          style={{
                            ...tableCell,
                            fontWeight:
                              800,
                          }}
                        >
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              padding:
                                "5px 9px",
                              borderRadius:
                                "7px",
                              background:
                                variance >
                                0
                                  ? "#ECFDF5"
                                  : variance <
                                    0
                                  ? "#FEF2F2"
                                  : "#F8FAFC",
                              color:
                                variance >
                                0
                                  ? "#047857"
                                  : variance <
                                    0
                                  ? "#B91C1C"
                                  : "#64748B",
                            }}
                          >
                            {variance >
                            0
                              ? `+${variance}`
                              : variance}
                          </span>
                        </td>

                        {/* COUNTED BY */}

                        <td
                          style={{
                            ...tableCell,
                            textAlign:
                              "left",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "9px",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  "32px",
                                height:
                                  "32px",
                                borderRadius:
                                  "50%",
                                background:
                                  "#F1F5F9",
                                color:
                                  "#475569",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight:
                                  700,
                                fontSize:
                                  "12px",
                              }}
                            >
                              {getInitial(
                                item.counted_by
                              )}
                            </div>

                            <span
                              style={{
                                fontWeight:
                                  600,
                              }}
                            >
                              {
                                item.counted_by
                              }
                            </span>
                          </div>
                        </td>

                        {/* DATE */}

                        <td
                          style={
                            tableCell
                          }
                        >
                          {formatDate(
                            item.count_date
                          )}
                        </td>

                        {/* STATUS */}

                        <td
                          style={
                            tableCell
                          }
                        >
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: "6px",
                              padding:
                                "6px 11px",
                              borderRadius:
                                "999px",
                              background:
                                statusStyle.background,
                              color:
                                statusStyle.color,
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                            }}
                          >
                            <span
                              style={{
                                width:
                                  "6px",
                                height:
                                  "6px",
                                borderRadius:
                                  "50%",
                                background:
                                  statusStyle.dot,
                              }}
                            />

                            {
                              item.status
                            }
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td
                          style={
                            tableCell
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              gap: "7px",
                              position:
                                "relative",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              style={
                                iconEditButton
                              }
                              title="Edit"
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              disabled={
                                deletingId ===
                                item.id
                              }
                              style={{
                                ...iconDeleteButton,
                                opacity:
                                  deletingId ===
                                  item.id
                                    ? 0.5
                                    : 1,
                              }}
                              title="Delete"
                            >
                              {deletingId ===
                              item.id
                                ? "..."
                                : "♜"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId ===
                                    item.id
                                    ? null
                                    : item.id
                                )
                              }
                              style={
                                menuButton
                              }
                              title="More"
                            >
                              ⋮
                            </button>

                            {openMenuId ===
                              item.id && (
                              <div
                                style={
                                  actionMenu
                                }
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
                                  style={
                                    menuItem
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      item.id
                                    )
                                  }
                                  style={{
                                    ...menuItem,
                                    color:
                                      "#DC2626",
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading &&
          filteredCounts.length >
            0 && (
            <div
              style={{
                padding:
                  "16px 22px",
                borderTop:
                  "1px solid #E2E8F0",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                color:
                  "#64748B",
                fontSize:
                  "13px",
              }}
            >
              <span>
                Showing{" "}
                <strong
                  style={{
                    color:
                      "#334155",
                  }}
                >
                  1
                </strong>{" "}
                to{" "}
                <strong
                  style={{
                    color:
                      "#334155",
                  }}
                >
                  {
                    filteredCounts.length
                  }
                </strong>{" "}
                of{" "}
                <strong
                  style={{
                    color:
                      "#334155",
                  }}
                >
                  {counts.length}
                </strong>{" "}
                cycle counts
              </span>

              <span
                style={{
                  padding:
                    "6px 10px",
                  borderRadius:
                    "7px",
                  background:
                    "#F8FAFC",
                  color:
                    "#64748B",
                }}
              >
                {filteredCounts.length}{" "}
                records
              </span>
            </div>
          )}
      </div>

      {/* ================================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ================================================== */}

      {showForm && (
        <div
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex: 1000,
            background:
              "rgba(15,23,42,0.62)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding:
              "20px",
          }}
        >
          <div
            style={{
              width:
                "100%",
              maxWidth:
                "820px",
              maxHeight:
                "92vh",
              overflowY:
                "auto",
              background:
                "#FFFFFF",
              borderRadius:
                "18px",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.25)",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                padding:
                  "22px 26px",
                borderBottom:
                  "1px solid #E2E8F0",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width:
                      "42px",
                    height:
                      "42px",
                    borderRadius:
                      "11px",
                    background:
                      "#E8F0FF",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize:
                      "20px",
                  }}
                >
                  📋
                </div>

                <div>
                  <h2
                    style={{
                      margin:
                        0,
                      color:
                        "#0F172A",
                      fontSize:
                        "21px",
                    }}
                  >
                    {editingId !==
                    null
                      ? "Edit Cycle Count"
                      : "New Cycle Count"}
                  </h2>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      color:
                        "#64748B",
                      fontSize:
                        "13px",
                    }}
                  >
                    {editingId !==
                    null
                      ? "Update the inventory count record."
                      : "Record a new warehouse cycle count."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                style={
                  closeButton
                }
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              style={{
                padding:
                  "26px",
              }}
            >
              <div
                style={
                  formGrid
                }
              >
                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Count Number
                  </label>

                  <input
                    name="count_number"
                    value={
                      formData.count_number
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="CC-1001"
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Warehouse
                  </label>

                  <input
                    name="warehouse"
                    value={
                      formData.warehouse
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Main Warehouse"
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Item Name
                  </label>

                  <input
                    name="item_name"
                    value={
                      formData.item_name
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Laptop Dell XPS 15"
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={
                      formData.sku
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="SKU-1001"
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    System Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="system_quantity"
                    value={
                      formData.system_quantity
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Counted Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="counted_quantity"
                    value={
                      formData.counted_quantity
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Counted By
                  </label>

                  <input
                    name="counted_by"
                    value={
                      formData.counted_by
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Staff member"
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Count Date
                  </label>

                  <input
                    type="date"
                    name="count_date"
                    value={
                      formData.count_date
                    }
                    onChange={
                      handleInputChange
                    }
                    style={
                      input
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      label
                    }
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleInputChange
                    }
                    style={
                      input
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Counting">
                      Counting
                    </option>

                    <option value="Review">
                      Review
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <label
                  style={
                    label
                  }
                >
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={
                    formData.remarks
                  }
                  onChange={
                    handleInputChange
                  }
                  rows={4}
                  placeholder="Additional cycle count notes..."
                  style={{
                    ...input,
                    resize:
                      "vertical",
                  }}
                />
              </div>

              <div
                style={
                  formActions
                }
              >
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                  style={
                    secondaryButton
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  style={{
                    ...primaryButton,
                    opacity:
                      saving
                        ? 0.65
                        : 1,
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingId !==
                      null
                    ? "Update Cycle Count"
                    : "Create Cycle Count"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* RESPONSIVE STYLES */}
      {/* ================================================== */}

      <style>
        {`
          @media (max-width: 900px) {
            .cycle-count-search-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 700px) {
            .cycle-count-form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const primaryButton: React.CSSProperties = {
  padding:
    "11px 18px",
  border:
    "none",
  borderRadius:
    "9px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color:
    "#FFFFFF",
  fontWeight:
    700,
  fontSize:
    "14px",
  cursor:
    "pointer",
};

const secondaryButton: React.CSSProperties = {
  padding:
    "11px 18px",
  border:
    "1px solid #CBD5E1",
  borderRadius:
    "9px",
  background:
    "#FFFFFF",
  color:
    "#334155",
  fontWeight:
    600,
  fontSize:
    "14px",
  cursor:
    "pointer",
};

const kpiCard: React.CSSProperties = {
  minHeight:
    "120px",
  padding:
    "20px",
  border:
    "1px solid #E2E8F0",
  borderRadius:
    "15px",
  boxShadow:
    "0 7px 22px rgba(15,23,42,0.05)",
  display:
    "flex",
  alignItems:
    "flex-start",
  gap:
    "14px",
};

const kpiIcon: React.CSSProperties = {
  width:
    "46px",
  height:
    "46px",
  borderRadius:
    "12px",
  display:
    "flex",
  alignItems:
    "center",
  justifyContent:
    "center",
  fontSize:
    "20px",
  flexShrink:
    0,
};

const kpiLabel: React.CSSProperties = {
  margin:
    0,
  color:
    "#334155",
  fontSize:
    "13px",
  fontWeight:
    700,
};

const kpiNumber: React.CSSProperties = {
  margin:
    "6px 0 0",
  fontSize:
    "29px",
  lineHeight:
    1,
  color:
    "#0F172A",
  fontWeight:
    800,
};

const kpiDescription: React.CSSProperties = {
  margin:
    "7px 0 0",
  color:
    "#94A3B8",
  fontSize:
    "11px",
};

const tableHeader: React.CSSProperties = {
  padding:
    "14px 13px",
  textAlign:
    "center",
  fontSize:
    "11px",
  fontWeight:
    800,
  color:
    "#475569",
  whiteSpace:
    "nowrap",
};

const tableCell: React.CSSProperties = {
  padding:
    "16px 13px",
  textAlign:
    "center",
  fontSize:
    "13px",
  color:
    "#475569",
  whiteSpace:
    "nowrap",
};

const messageBox: React.CSSProperties = {
  padding:
    "65px 20px",
  textAlign:
    "center",
  color:
    "#64748B",
  fontSize:
    "14px",
};

const label: React.CSSProperties = {
  display:
    "block",
  marginBottom:
    "7px",
  color:
    "#334155",
  fontSize:
    "13px",
  fontWeight:
    700,
};

const input: React.CSSProperties = {
  width:
    "100%",
  boxSizing:
    "border-box",
  padding:
    "11px 13px",
  border:
    "1px solid #CBD5E1",
  borderRadius:
    "9px",
  fontSize:
    "14px",
  color:
    "#0F172A",
  background:
    "#FFFFFF",
  outline:
    "none",
  fontFamily:
    "inherit",
};

const formGrid: React.CSSProperties = {
  display:
    "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap:
    "18px",
};

const formActions: React.CSSProperties = {
  display:
    "flex",
  justifyContent:
    "flex-end",
  gap:
    "12px",
  marginTop:
    "25px",
};

const iconEditButton: React.CSSProperties = {
  width:
    "36px",
  height:
    "36px",
  border:
    "1px solid #DBEAFE",
  borderRadius:
    "9px",
  background:
    "#EFF6FF",
  color:
    "#2563EB",
  fontSize:
    "16px",
  fontWeight:
    800,
  cursor:
    "pointer",
};

const iconDeleteButton: React.CSSProperties = {
  width:
    "36px",
  height:
    "36px",
  border:
    "none",
  borderRadius:
    "9px",
  background:
    "#FEF2F2",
  color:
    "#DC2626",
  fontSize:
    "15px",
  fontWeight:
    800,
  cursor:
    "pointer",
};

const menuButton: React.CSSProperties = {
  width:
    "36px",
  height:
    "36px",
  border:
    "1px solid #E2E8F0",
  borderRadius:
    "9px",
  background:
    "#FFFFFF",
  color:
    "#64748B",
  fontSize:
    "20px",
  cursor:
    "pointer",
};

const closeButton: React.CSSProperties = {
  width:
    "38px",
  height:
    "38px",
  border:
    "none",
  borderRadius:
    "50%",
  background:
    "#F1F5F9",
  color:
    "#475569",
  fontSize:
    "21px",
  cursor:
    "pointer",
};

const actionMenu: React.CSSProperties = {
  position:
    "absolute",
  right:
    0,
  top:
    "42px",
  width:
    "130px",
  background:
    "#FFFFFF",
  border:
    "1px solid #E2E8F0",
  borderRadius:
    "9px",
  boxShadow:
    "0 12px 30px rgba(15,23,42,0.12)",
  zIndex:
    50,
  overflow:
    "hidden",
};

const menuItem: React.CSSProperties = {
  display:
    "block",
  width:
    "100%",
  padding:
    "10px 13px",
  border:
    "none",
  background:
    "#FFFFFF",
  color:
    "#334155",
  textAlign:
    "left",
  fontSize:
    "13px",
  fontWeight:
    600,
  cursor:
    "pointer",
};