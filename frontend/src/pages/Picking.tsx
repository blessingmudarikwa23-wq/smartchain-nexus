import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import api from "../services/api";

interface PickingRecord {
  id: number;
  picking_number: string;
  order_number: string;
  picker: string;
  warehouse: string;
  total_items: number;
  picked_quantity: number;
  status: string;
  remarks?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface PickingFormData {
  picking_number: string;
  order_number: string;
  picker: string;
  warehouse: string;
  total_items: number;
  picked_quantity: number;
  status: string;
  remarks: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

type SortOption = "newest" | "oldest";

const emptyForm: PickingFormData = {
  picking_number: "",
  order_number: "",
  picker: "",
  warehouse: "",
  total_items: 0,
  picked_quantity: 0,
  status: "Pending",
  remarks: "",
};

/* =========================================================
   ICONS
========================================================= */

function Icon({
  name,
  size = 20,
}: {
  name:
    | "box"
    | "search"
    | "filter"
    | "sort"
    | "plus"
    | "refresh"
    | "edit"
    | "delete"
    | "close"
    | "clipboard"
    | "clock"
    | "check"
    | "chart"
    | "package"
    | "chevron-left"
    | "chevron-right";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "box":
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      );

    case "package":
      return (
        <svg {...common}>
          <path d="m16.5 9.4-9-5.19" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
          <path d="M12 22.08V12" />
        </svg>
      );

    case "clipboard":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="18" rx="2" />
          <path d="M9 4V2h6v2" />
          <path d="M8 10h8" />
          <path d="M8 14h8" />
          <path d="M8 18h5" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-7" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );

    case "sort":
      return (
        <svg {...common}>
          <path d="M8 6v12" />
          <path d="m5 9 3-3 3 3" />
          <path d="M16 18V6" />
          <path d="m13 15 3 3 3-3" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
          <path d="M20 20v-5h-5" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "delete":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 15H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "chevron-left":
      return (
        <svg {...common}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Picking() {
  const [records, setRecords] = useState<PickingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] =
    useState<PickingFormData>(emptyForm);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] =
    useState<string>("All Status");
  const [sortOption, setSortOption] =
    useState<SortOption>("newest");

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const recordsPerPage = 8;

  /* =========================================================
     FETCH
  ========================================================= */

  const fetchPicking = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<PickingRecord[]>(
        "/warehouse/picking"
      );

      setRecords(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(
        "Error loading picking records:",
        err
      );

      setError(
        "Unable to load picking records. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPicking();
  }, []);

  /* =========================================================
     FORM
  ========================================================= */

  const resetForm = (): void => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  const closeForm = (): void => {
    setShowForm(false);
    resetForm();
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "total_items" ||
        name === "picked_quantity"
          ? Number(value)
          : value,
    }));
  };

  const handleNewPicking = (): void => {
    setError("");
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (
    record: PickingRecord
  ): void => {
    setError("");
    setEditingId(record.id);

    setFormData({
      picking_number:
        record.picking_number || "",
      order_number:
        record.order_number || "",
      picker: record.picker || "",
      warehouse: record.warehouse || "",
      total_items: Number(
        record.total_items || 0
      ),
      picked_quantity: Number(
        record.picked_quantity || 0
      ),
      status: record.status || "Pending",
      remarks: record.remarks || "",
    });

    setShowForm(true);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this picking record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/warehouse/picking/${id}`
      );

      await fetchPicking();
    } catch (err) {
      console.error(
        "Error deleting picking record:",
        err
      );

      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.detail ||
          "Unable to delete the picking record."
      );
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload: PickingFormData = {
        ...formData,
        total_items: Number(
          formData.total_items
        ),
        picked_quantity: Number(
          formData.picked_quantity
        ),
      };

      if (editingId !== null) {
        await api.put(
          `/warehouse/picking/${editingId}`,
          payload
        );
      } else {
        await api.post(
          "/warehouse/picking",
          payload
        );
      }

      closeForm();

      await fetchPicking();
    } catch (err) {
      console.error(
        "Error saving picking record:",
        err
      );

      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.detail ||
          "Unable to save the picking record."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     KPI CALCULATIONS
  ========================================================= */

  const totalOrders: number =
    records.length;

  const totalItems: number =
    records.reduce(
      (total, record) =>
        total +
        Number(record.total_items || 0),
      0
    );

  const totalPicked: number =
    records.reduce(
      (total, record) =>
        total +
        Number(
          record.picked_quantity || 0
        ),
      0
    );

  const completedOrders: number =
    records.filter(
      (record) =>
        record.status?.toLowerCase() ===
        "completed"
    ).length;

  const inProgressOrders: number =
    records.filter(
      (record) =>
        record.status?.toLowerCase() ===
        "picking"
    ).length;

  const pendingOrders: number =
    records.filter(
      (record) =>
        record.status?.toLowerCase() ===
        "pending"
    ).length;

  const completionRate: number =
    totalOrders > 0
      ? Math.round(
          (completedOrders /
            totalOrders) *
            100
        )
      : 0;

  /* =========================================================
     FILTERING + SEARCH + SORTING
  ========================================================= */

  const filteredRecords =
    useMemo(() => {
      const filtered = records.filter(
        (record) => {
          const search =
            searchTerm
              .toLowerCase()
              .trim();

          const matchesSearch =
            search === "" ||
            record.picking_number
              ?.toLowerCase()
              .includes(search) ||
            record.order_number
              ?.toLowerCase()
              .includes(search) ||
            record.picker
              ?.toLowerCase()
              .includes(search) ||
            record.warehouse
              ?.toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter ===
              "All Status" ||
            record.status
              ?.toLowerCase() ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

      return [...filtered].sort(
        (a, b) => {
          if (
            sortOption === "newest"
          ) {
            return (
              Number(b.id) -
              Number(a.id)
            );
          }

          return (
            Number(a.id) -
            Number(b.id)
          );
        }
      );
    }, [
      records,
      searchTerm,
      statusFilter,
      sortOption,
    ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages: number =
    Math.max(
      1,
      Math.ceil(
        filteredRecords.length /
          recordsPerPage
      )
    );

  const safeCurrentPage: number =
    Math.min(
      currentPage,
      totalPages
    );

  const paginatedRecords =
    filteredRecords.slice(
      (safeCurrentPage - 1) *
        recordsPerPage,
      safeCurrentPage *
        recordsPerPage
    );

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusStyle = (
    status: string
  ): CSSProperties => {
    switch (
      status?.toLowerCase()
    ) {
      case "completed":
        return {
          background: "#DCFCE7",
          color: "#15803D",
        };

      case "picking":
        return {
          background: "#FEF3C7",
          color: "#B45309",
        };

      case "pending":
        return {
          background: "#DBEAFE",
          color: "#2563EB",
        };

      default:
        return {
          background: "#F1F5F9",
          color: "#475569",
        };
    }
  };

  /* =========================================================
     KPI CARD
  ========================================================= */

  const KpiCard = ({
    title,
    value,
    subtitle,
    icon,
    tone,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon:
      | "clipboard"
      | "package"
      | "clock"
      | "check";
    tone:
      | "blue"
      | "green"
      | "orange"
      | "purple";
  }) => {
    const tones = {
      blue: {
        background: "#EEF4FF",
        iconBackground: "#E3EDFF",
        iconColor: "#2563EB",
        titleColor: "#2563EB",
      },
      green: {
        background: "#EFFBF5",
        iconBackground: "#DDF8E9",
        iconColor: "#16A34A",
        titleColor: "#16A34A",
      },
      orange: {
        background: "#FFF9EA",
        iconBackground: "#FFF0C7",
        iconColor: "#F59E0B",
        titleColor: "#D97706",
      },
      purple: {
        background: "#F7F2FF",
        iconBackground: "#EEE4FF",
        iconColor: "#7C3AED",
        titleColor: "#7C3AED",
      },
    };

    const current =
      tones[tone];

    return (
      <div
        style={{
          background: "#FFFFFF",
          border:
            "1px solid #E8EDF5",
          borderRadius: "14px",
          padding: "20px",
          minHeight: "126px",
          boxShadow:
            "0 5px 18px rgba(15,23,42,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  background:
                    current.iconBackground,
                  color:
                    current.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                }}
              >
                <Icon
                  name={icon}
                  size={21}
                />
              </div>

              <span
                style={{
                  color:
                    current.titleColor,
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {title}
              </span>
            </div>

            <div
              style={{
                fontSize: "30px",
                lineHeight: 1,
                fontWeight: 750,
                color: "#0F172A",
              }}
            >
              {value}
            </div>

            <div
              style={{
                marginTop: "9px",
                color: "#94A3B8",
                fontSize: "12px",
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              width: "70px",
              height: "45px",
              borderRadius: "50%",
              background:
                current.background,
              position: "absolute",
              right: "-18px",
              bottom: "-18px",
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    );
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#F8FAFD",
        padding:
          "30px 32px 40px",
        color: "#0F172A",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "26px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background:
                "#E7EEFF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <Icon
              name="package"
              size={29}
            />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                lineHeight: 1.15,
                fontWeight: 750,
                letterSpacing:
                  "-0.6px",
              }}
            >
              Warehouse Picking
            </h1>

            <p
              style={{
                margin:
                  "7px 0 0",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Manage warehouse
              picking operations,
              assignments and
              order fulfilment.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            handleNewPicking
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            border: "none",
            borderRadius: "10px",
            padding:
              "12px 19px",
            background:
              "#2563EB",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 650,
            cursor: "pointer",
            boxShadow:
              "0 5px 15px rgba(37,99,235,0.24)",
          }}
        >
          <Icon
            name="plus"
            size={18}
          />
          Add Picking
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            background: "#FEF2F2",
            border:
              "1px solid #FECACA",
            color: "#B91C1C",
            borderRadius: "11px",
            padding:
              "12px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "15px",
            fontSize: "14px",
          }}
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            style={{
              border: "none",
              background:
                "transparent",
              color: "#B91C1C",
              cursor: "pointer",
            }}
          >
            <Icon
              name="close"
              size={17}
            />
          </button>
        </div>
      )}

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
        className="picking-kpi-grid"
      >
        <KpiCard
          title="Picking Orders"
          value={totalOrders}
          subtitle="All picking orders"
          icon="clipboard"
          tone="blue"
        />

        <KpiCard
          title="In Progress"
          value={inProgressOrders}
          subtitle="Currently being picked"
          icon="clock"
          tone="orange"
        />

        <KpiCard
          title="Total Items"
          value={totalItems.toLocaleString()}
          subtitle="Items across orders"
          icon="package"
          tone="green"
        />

        <KpiCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedOrders} orders completed`}
          icon="check"
          tone="purple"
        />
      </div>

      {/* =====================================================
          SEARCH / FILTER BAR
      ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border:
            "1px solid #E8EDF5",
          borderRadius: "13px",
          padding: "13px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns:
            "1fr 180px 180px",
          gap: "12px",
          boxShadow:
            "0 4px 16px rgba(15,23,42,0.03)",
        }}
        className="picking-filter-bar"
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform:
                "translateY(-50%)",
              color: "#94A3B8",
              pointerEvents:
                "none",
            }}
          >
            <Icon
              name="search"
              size={19}
            />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(
              event
            ) => {
              setSearchTerm(
                event.target.value
              );
              setCurrentPage(1);
            }}
            placeholder="Search picking orders by number, picker or warehouse..."
            style={{
              width: "100%",
              height: "46px",
              boxSizing:
                "border-box",
              border:
                "1px solid #E2E8F0",
              borderRadius: "9px",
              padding:
                "0 14px 0 43px",
              outline: "none",
              color: "#0F172A",
              fontSize: "14px",
              background:
                "#FFFFFF",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform:
                "translateY(-50%)",
              color: "#64748B",
              pointerEvents:
                "none",
            }}
          >
            <Icon
              name="filter"
              size={17}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(
              event
            ) => {
              setStatusFilter(
                event.target.value
              );
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              height: "46px",
              border:
                "1px solid #E2E8F0",
              borderRadius: "9px",
              padding:
                "0 30px 0 39px",
              outline: "none",
              color: "#334155",
              background:
                "#FFFFFF",
              fontSize: "14px",
              cursor: "pointer",
              appearance:
                "auto",
            }}
          >
            <option>
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Picking">
              Picking
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform:
                "translateY(-50%)",
              color: "#64748B",
              pointerEvents:
                "none",
            }}
          >
            <Icon
              name="sort"
              size={17}
            />
          </div>

          <select
            value={sortOption}
            onChange={(
              event
            ) =>
              setSortOption(
                event.target
                  .value as SortOption
              )
            }
            style={{
              width: "100%",
              height: "46px",
              border:
                "1px solid #E2E8F0",
              borderRadius: "9px",
              padding:
                "0 30px 0 39px",
              outline: "none",
              color: "#334155",
              background:
                "#FFFFFF",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>
        </div>
      </div>

      {/* =====================================================
          PICKING LIST
      ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border:
            "1px solid #E8EDF5",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 6px 22px rgba(15,23,42,0.04)",
        }}
      >
        {/* CARD HEADER */}

        <div
          style={{
            padding:
              "20px 22px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            borderBottom:
              "1px solid #EEF2F7",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius:
                  "10px",
                background:
                  "#EEF4FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <Icon
                name="clipboard"
                size={19}
              />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color:
                    "#0F172A",
                }}
              >
                Picking List
              </h2>

              <p
                style={{
                  margin:
                    "4px 0 0",
                  fontSize: "13px",
                  color:
                    "#94A3B8",
                }}
              >
                Warehouse picking
                assignments and
                fulfilment activity.
              </p>
            </div>
          </div>

          <span
            style={{
              background:
                "#F1F5F9",
              color: "#475569",
              padding:
                "7px 12px",
              borderRadius:
                "999px",
              fontSize: "12px",
              fontWeight: 650,
              whiteSpace:
                "nowrap",
            }}
          >
            {filteredRecords.length}{" "}
            {filteredRecords.length ===
            1
              ? "Record"
              : "Records"}
          </span>
        </div>

        {/* TABLE CONTENT */}

        {loading ? (
          <div
            style={{
              padding: "70px 20px",
              textAlign:
                "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                border:
                  "4px solid #E2E8F0",
                borderTop:
                  "4px solid #2563EB",
                borderRadius:
                  "50%",
                margin:
                  "0 auto 15px",
                animation:
                  "pickingSpin 0.8s linear infinite",
              }}
            />

            <div
              style={{
                fontSize: "14px",
              }}
            >
              Loading picking
              records...
            </div>
          </div>
        ) : filteredRecords.length ===
          0 ? (
          <div
            style={{
              padding:
                "70px 20px",
              textAlign:
                "center",
            }}
          >
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius:
                  "18px",
                background:
                  "#EEF4FF",
                color: "#2563EB",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                margin:
                  "0 auto 15px",
              }}
            >
              <Icon
                name="package"
                size={30}
              />
            </div>

            <h3
              style={{
                margin:
                  "0 0 7px",
                color:
                  "#334155",
                fontSize: "17px",
              }}
            >
              No picking records
              found
            </h3>

            <p
              style={{
                margin:
                  "0 0 18px",
                color:
                  "#94A3B8",
                fontSize: "14px",
              }}
            >
              Create a picking
              record or adjust
              your search filters.
            </p>

            <button
              type="button"
              onClick={
                handleNewPicking
              }
              style={{
                display: "inline-flex",
                alignItems:
                  "center",
                gap: "8px",
                border: "none",
                borderRadius: "9px",
                padding:
                  "10px 16px",
                background:
                  "#2563EB",
                color:
                  "#FFFFFF",
                fontWeight: 650,
                cursor:
                  "pointer",
              }}
            >
              <Icon
                name="plus"
                size={17}
              />
              Add Picking
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth:
                    "1050px",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#F7F9FC",
                      borderBottom:
                        "1px solid #E8EDF5",
                    }}
                  >
                    <th className="picking-th">
                      Picking
                    </th>

                    <th className="picking-th">
                      Sales Order
                    </th>

                    <th className="picking-th">
                      Picker
                    </th>

                    <th className="picking-th">
                      Warehouse
                    </th>

                    <th className="picking-th">
                      Items
                    </th>

                    <th className="picking-th">
                      Picked Qty
                    </th>

                    <th className="picking-th">
                      Status
                    </th>

                    <th className="picking-th action-header">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRecords.map(
                    (
                      record
                    ) => (
                      <tr
                        key={
                          record.id
                        }
                        className="picking-row"
                      >
                        <td className="picking-td">
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  "38px",
                                height:
                                  "38px",
                                borderRadius:
                                  "10px",
                                background:
                                  "#EEF4FF",
                                color:
                                  "#2563EB",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                flexShrink:
                                  0,
                              }}
                            >
                              <Icon
                                name="package"
                                size={18}
                              />
                            </div>

                            <div>
                              <div
                                style={{
                                  fontWeight:
                                    700,
                                  color:
                                    "#0F172A",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  record.picking_number
                                }
                              </div>

                              <span
                                style={{
                                  display:
                                    "inline-block",
                                  marginTop:
                                    "4px",
                                  padding:
                                    "3px 7px",
                                  borderRadius:
                                    "5px",
                                  background:
                                    "#EEF4FF",
                                  color:
                                    "#2563EB",
                                  fontSize:
                                    "10px",
                                  fontWeight:
                                    700,
                                }}
                              >
                                PICK
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="picking-td">
                          <span
                            style={{
                              fontWeight:
                                600,
                              color:
                                "#334155",
                            }}
                          >
                            {
                              record.order_number
                            }
                          </span>
                        </td>

                        <td className="picking-td">
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
                                  "34px",
                                height:
                                  "34px",
                                borderRadius:
                                  "50%",
                                background:
                                  "#E8F7EE",
                                color:
                                  "#15803D",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight:
                                  700,
                                fontSize:
                                  "13px",
                              }}
                            >
                              {record.picker
                                ?.charAt(
                                  0
                                )
                                .toUpperCase() ||
                                "P"}
                            </div>

                            <span>
                              {
                                record.picker
                              }
                            </span>
                          </div>
                        </td>

                        <td className="picking-td">
                          <span>
                            {
                              record.warehouse
                            }
                          </span>
                        </td>

                        <td className="picking-td number-cell">
                          {Number(
                            record.total_items ||
                              0
                          ).toLocaleString()}
                        </td>

                        <td className="picking-td number-cell">
                          {Number(
                            record.picked_quantity ||
                              0
                          ).toLocaleString()}
                        </td>

                        <td className="picking-td">
                          <span
                            style={{
                              ...getStatusStyle(
                                record.status
                              ),
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: "6px",
                              padding:
                                "6px 11px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "11px",
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
                                  "currentColor",
                              }}
                            />

                            {
                              record.status ||
                              "Unknown"
                            }
                          </span>
                        </td>

                        <td className="picking-td action-cell">
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              gap: "7px",
                            }}
                          >
                            <button
                              type="button"
                              title="Edit picking"
                              onClick={() =>
                                handleEdit(
                                  record
                                )
                              }
                              className="icon-action edit-action"
                            >
                              <Icon
                                name="edit"
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              title="Delete picking"
                              onClick={() =>
                                void handleDelete(
                                  record.id
                                )
                              }
                              className="icon-action delete-action"
                            >
                              <Icon
                                name="delete"
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}

            <div
              style={{
                padding:
                  "15px 20px",
                borderTop:
                  "1px solid #EEF2F7",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "15px",
                flexWrap:
                  "wrap",
              }}
            >
              <span
                style={{
                  color:
                    "#64748B",
                  fontSize:
                    "13px",
                }}
              >
                Showing{" "}
                {filteredRecords.length ===
                0
                  ? 0
                  : (safeCurrentPage -
                      1) *
                      recordsPerPage +
                    1}{" "}
                to{" "}
                {Math.min(
                  safeCurrentPage *
                    recordsPerPage,
                  filteredRecords.length
                )}{" "}
                of{" "}
                {filteredRecords.length}{" "}
                picking orders
              </span>

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "7px",
                }}
              >
                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="pagination-button"
                >
                  <Icon
                    name="chevron-left"
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  className="pagination-current"
                >
                  {safeCurrentPage}
                </button>

                <button
                  type="button"
                  disabled={
                    safeCurrentPage >=
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="pagination-button"
                >
                  <Icon
                    name="chevron-right"
                    size={17}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

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
            background:
              "rgba(15,23,42,0.58)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth:
                "760px",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              background:
                "#FFFFFF",
              borderRadius:
                "16px",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.25)",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                padding:
                  "22px 25px",
                borderBottom:
                  "1px solid #E8EDF5",
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
                  <div
                    style={{
                      width:
                        "38px",
                      height:
                        "38px",
                      borderRadius:
                        "10px",
                      background:
                        "#EEF4FF",
                      color:
                        "#2563EB",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Icon
                      name="clipboard"
                      size={19}
                    />
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color:
                        "#0F172A",
                      fontSize:
                        "20px",
                    }}
                  >
                    {editingId !==
                    null
                      ? "Edit Picking"
                      : "New Picking"}
                  </h2>
                </div>

                <p
                  style={{
                    margin:
                      "7px 0 0 48px",
                    color:
                      "#64748B",
                    fontSize:
                      "13px",
                  }}
                >
                  {editingId !==
                  null
                    ? "Update the picking order details."
                    : "Create a new warehouse picking order."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                style={{
                  width:
                    "36px",
                  height:
                    "36px",
                  border:
                    "none",
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
                  cursor:
                    "pointer",
                }}
              >
                <Icon
                  name="close"
                  size={18}
                />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              style={{
                padding:
                  "25px",
              }}
            >
              <div
                className="picking-form-grid"
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <label htmlFor="picking_number">
                    Picking Number
                  </label>

                  <input
                    id="picking_number"
                    name="picking_number"
                    value={
                      formData.picking_number
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="PICK-1001"
                  />
                </div>

                <div>
                  <label htmlFor="order_number">
                    Sales Order
                  </label>

                  <input
                    id="order_number"
                    name="order_number"
                    value={
                      formData.order_number
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="SO-1001"
                  />
                </div>

                <div>
                  <label htmlFor="picker">
                    Picker
                  </label>

                  <input
                    id="picker"
                    name="picker"
                    value={
                      formData.picker
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Picker name"
                  />
                </div>

                <div>
                  <label htmlFor="warehouse">
                    Warehouse
                  </label>

                  <input
                    id="warehouse"
                    name="warehouse"
                    value={
                      formData.warehouse
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Main Warehouse"
                  />
                </div>

                <div>
                  <label htmlFor="total_items">
                    Total Items
                  </label>

                  <input
                    id="total_items"
                    type="number"
                    min="0"
                    name="total_items"
                    value={
                      formData.total_items
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="picked_quantity">
                    Picked Quantity
                  </label>

                  <input
                    id="picked_quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    name="picked_quantity"
                    value={
                      formData.picked_quantity
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Picking">
                      Picking
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="remarks">
                    Remarks
                  </label>

                  <input
                    id="remarks"
                    name="remarks"
                    value={
                      formData.remarks
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Optional remarks"
                  />
                </div>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                  marginTop:
                    "25px",
                  paddingTop:
                    "20px",
                  borderTop:
                    "1px solid #EEF2F7",
                }}
              >
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                  className="modal-cancel-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="modal-save-button"
                >
                  {saving
                    ? "Saving..."
                    : editingId !==
                      null
                    ? "Update Picking"
                    : "Create Picking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .picking-th {
            padding: 14px 16px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.35px;
            white-space: nowrap;
          }

          .picking-th.action-header {
            text-align: center;
          }

          .picking-td {
            padding: 16px;
            text-align: left;
            font-size: 13px;
            color: #475569;
            border-bottom: 1px solid #EEF2F7;
            white-space: nowrap;
          }

          .picking-td.number-cell {
            color: #334155;
            font-weight: 650;
          }

          .picking-td.action-cell {
            text-align: center;
          }

          .picking-row {
            transition:
              background 0.15s ease;
          }

          .picking-row:hover {
            background: #FAFCFF;
          }

          .icon-action {
            width: 35px;
            height: 35px;
            border-radius: 9px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition:
              transform 0.15s ease,
              background 0.15s ease;
          }

          .icon-action:hover {
            transform: translateY(-1px);
          }

          .edit-action {
            border: 1px solid #D9E6FF;
            background: #F3F7FF;
            color: #2563EB;
          }

          .edit-action:hover {
            background: #E8F0FF;
          }

          .delete-action {
            border: 1px solid #FECACA;
            background: #FFF1F2;
            color: #DC2626;
          }

          .delete-action:hover {
            background: #FEE2E2;
          }

          .pagination-button,
          .pagination-current {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 650;
          }

          .pagination-button {
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
            color: #64748B;
            cursor: pointer;
          }

          .pagination-button:hover:not(:disabled) {
            background: #F8FAFC;
            color: #2563EB;
          }

          .pagination-button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
          }

          .pagination-current {
            border: 1px solid #2563EB;
            background: #2563EB;
            color: #FFFFFF;
          }

          .modal-cancel-button {
            padding: 11px 20px;
            border-radius: 9px;
            border: 1px solid #CBD5E1;
            background: #FFFFFF;
            color: #334155;
            cursor: pointer;
            font-weight: 650;
          }

          .modal-cancel-button:hover {
            background: #F8FAFC;
          }

          .modal-save-button {
            padding: 11px 20px;
            border-radius: 9px;
            border: none;
            background: #2563EB;
            color: #FFFFFF;
            cursor: pointer;
            font-weight: 650;
            box-shadow:
              0 4px 10px rgba(37,99,235,0.18);
          }

          .modal-save-button:hover:not(:disabled) {
            background: #1D4ED8;
          }

          .modal-save-button:disabled {
            background: #93C5FD;
            cursor: not-allowed;
          }

          label {
            display: block;
            margin-bottom: 7px;
            color: #334155;
            font-size: 13px;
            font-weight: 650;
          }

          input,
          select,
          textarea {
            font-family: inherit;
          }

          input:focus,
          select:focus,
          textarea:focus {
            border-color: #2563EB !important;
            box-shadow:
              0 0 0 3px rgba(37,99,235,0.10) !important;
          }

          button {
            font-family: inherit;
          }

          button:not(:disabled) {
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease;
          }

          button:not(:disabled):active {
            transform: scale(0.98);
          }

          @keyframes pickingSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 1100px) {
            .picking-kpi-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;
            }

            .picking-filter-bar {
              grid-template-columns:
                1fr 1fr !important;
            }

            .picking-filter-bar > div:first-child {
              grid-column: 1 / -1;
            }
          }

          @media (max-width: 700px) {
            .picking-kpi-grid {
              grid-template-columns:
                1fr !important;
            }

            .picking-filter-bar {
              grid-template-columns:
                1fr !important;
            }

            .picking-filter-bar > div:first-child {
              grid-column: auto;
            }

            .picking-form-grid {
              grid-template-columns:
                1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}