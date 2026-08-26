import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type CSSProperties,
} from "react";
import api from "../services/api";

interface ReceivingRecord {
  id: number;
  receiving_number: string;
  supplier_name: string;
  purchase_order: string;
  warehouse: string;
  received_by: string;
  received_date: string;
  total_items: number;
  total_quantity: number;
  remarks: string;
  status: string;
}

interface ReceivingFormData {
  receiving_number: string;
  supplier_name: string;
  purchase_order: string;
  warehouse: string;
  received_by: string;
  received_date: string;
  total_items: number;
  total_quantity: number;
  remarks: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

const emptyForm: ReceivingFormData = {
  receiving_number: "",
  supplier_name: "",
  purchase_order: "",
  warehouse: "",
  received_by: "",
  received_date: "",
  total_items: 0,
  total_quantity: 0,
  remarks: "",
};

/* =========================================================
   ICONS
========================================================= */

function PackageIcon({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 16V8C21 7.45 20.7 6.94 20.22 6.68L12.72 2.48C12.27 2.23 11.73 2.23 11.28 2.48L3.78 6.68C3.3 6.94 3 7.45 3 8V16C3 16.55 3.3 17.06 3.78 17.32L11.28 21.52C11.73 21.77 12.27 21.77 12.72 21.52L20.22 17.32C20.7 17.06 21 16.55 21 16Z"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M3.5 7L12 11.75L20.5 7"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M12 12V21"
        stroke={color}
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ClipboardIcon({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="4"
        width="14"
        height="17"
        rx="2"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M9 4.5V3.5C9 2.67 9.67 2 10.5 2H13.5C14.33 2 15 2.67 15 3.5V4.5"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M8.5 9H15.5"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 13H15.5"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 17H13"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12.5L9.5 17L19 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.8"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M16 16L21 21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 12H17"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10 18H14"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon({
  size = 17,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 20H8L19 9C20.1 7.9 20.1 6.1 19 5C17.9 3.9 16.1 3.9 15 5L4 16V20Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5L17.5 10.5"
        stroke={color}
        strokeWidth="1.7"
      />
    </svg>
  );
}

function TrashIcon({
  size = 17,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7H19"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10 11V17"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14 11V17"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 7L8 20H16L17 7"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V4H15V7"
        stroke={color}
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MoreIcon({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="19" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({
  size = 17,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 11A8.1 8.1 0 0 0 5.4 6.4L3 9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 5V9H7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 13A8.1 8.1 0 0 0 18.6 17.6L21 15"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 19V15H17"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Receiving() {
  const [deliveries, setDeliveries] = useState<ReceivingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] =
    useState<string>("All Status");
  const [sortOrder, setSortOrder] =
    useState<string>("Newest First");

  const [formData, setFormData] =
    useState<ReceivingFormData>(emptyForm);

  /* =========================================================
     FETCH
  ========================================================= */

  const fetchReceiving = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<ReceivingRecord[]>(
        "/warehouse/receiving"
      );

      setDeliveries(response.data);
    } catch (err) {
      console.error(
        "Error loading receiving records:",
        err
      );

      setError(
        "Unable to load receiving records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReceiving();
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
      HTMLInputElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "total_items" ||
        name === "total_quantity"
          ? Number(value)
          : value,
    }));
  };

  const handleNewReceiving = (): void => {
    setError("");
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (
    delivery: ReceivingRecord
  ): void => {
    setError("");
    setEditingId(delivery.id);

    setFormData({
      receiving_number:
        delivery.receiving_number ?? "",
      supplier_name:
        delivery.supplier_name ?? "",
      purchase_order:
        delivery.purchase_order ?? "",
      warehouse:
        delivery.warehouse ?? "",
      received_by:
        delivery.received_by ?? "",
      received_date:
        delivery.received_date ?? "",
      total_items:
        Number(delivery.total_items ?? 0),
      total_quantity:
        Number(delivery.total_quantity ?? 0),
      remarks:
        delivery.remarks ?? "",
    });

    setShowForm(true);
  };

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this receiving record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/warehouse/receiving/${id}`
      );

      await fetchReceiving();
    } catch (err) {
      console.error(
        "Error deleting receiving record:",
        err
      );

      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.detail ||
          "Unable to delete the receiving record."
      );
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload: ReceivingFormData = {
        ...formData,
        total_items:
          Number(formData.total_items),
        total_quantity:
          Number(formData.total_quantity),
      };

      if (editingId !== null) {
        await api.put(
          `/warehouse/receiving/${editingId}`,
          payload
        );
      } else {
        await api.post(
          "/warehouse/receiving",
          payload
        );
      }

      closeForm();

      await fetchReceiving();
    } catch (err) {
      console.error(
        "Error saving receiving record:",
        err
      );

      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.detail ||
          "Unable to save the receiving record."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     KPI CALCULATIONS
  ========================================================= */

  const totalDeliveries =
    deliveries.length;

  const totalItems = deliveries.reduce(
    (total, delivery) =>
      total +
      Number(delivery.total_items || 0),
    0
  );

  const totalQuantity = deliveries.reduce(
    (total, delivery) =>
      total +
      Number(delivery.total_quantity || 0),
    0
  );

  const pendingInspection =
    deliveries.filter(
      (delivery) =>
        delivery.status?.toLowerCase() ===
        "inspecting"
    ).length;

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredDeliveries =
    useMemo(() => {
      const search =
        searchTerm.trim().toLowerCase();

      let result = deliveries.filter(
        (delivery) => {
          const matchesSearch =
            !search ||
            delivery.receiving_number
              ?.toLowerCase()
              .includes(search) ||
            delivery.supplier_name
              ?.toLowerCase()
              .includes(search) ||
            delivery.purchase_order
              ?.toLowerCase()
              .includes(search) ||
            delivery.warehouse
              ?.toLowerCase()
              .includes(search) ||
            delivery.received_by
              ?.toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter ===
              "All Status" ||
            delivery.status?.toLowerCase() ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

      result = [...result].sort(
        (a, b) => {
          if (
            sortOrder === "Newest First"
          ) {
            return (
              new Date(
                b.received_date
              ).getTime() -
              new Date(
                a.received_date
              ).getTime()
            );
          }

          if (
            sortOrder === "Oldest First"
          ) {
            return (
              new Date(
                a.received_date
              ).getTime() -
              new Date(
                b.received_date
              ).getTime()
            );
          }

          if (
            sortOrder === "Supplier A-Z"
          ) {
            return a.supplier_name.localeCompare(
              b.supplier_name
            );
          }

          return 0;
        }
      );

      return result;
    }, [
      deliveries,
      searchTerm,
      statusFilter,
      sortOrder,
    ]);

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusStyle = (
    status: string
  ): CSSProperties => {
    switch (
      status?.toLowerCase()
    ) {
      case "received":
        return {
          background: "#DCFCE7",
          color: "#15803D",
        };

      case "inspecting":
        return {
          background: "#FEF3C7",
          color: "#B45309",
        };

      case "pending":
        return {
          background: "#DBEAFE",
          color: "#2563EB",
        };

      case "rejected":
        return {
          background: "#FEE2E2",
          color: "#DC2626",
        };

      default:
        return {
          background: "#F1F5F9",
          color: "#475569",
        };
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="receiving-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="receiving-header">
        <div className="receiving-title-area">
          <div className="receiving-title-icon">
            <PackageIcon
              size={31}
              color="#2563EB"
            />

            <span className="title-online-dot" />
          </div>

          <div>
            <h1>
              Warehouse Receiving
            </h1>

            <p>
              Manage incoming deliveries and
              warehouse receiving operations
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="refresh-button"
            onClick={() =>
              void fetchReceiving()
            }
            disabled={loading}
          >
            <RefreshIcon
              size={18}
              color="#475569"
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            type="button"
            className="add-button"
            onClick={
              handleNewReceiving
            }
          >
            <PlusIcon
              size={18}
              color="#FFFFFF"
            />

            Add Receiving
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-banner">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon blue">
              <PackageIcon
                size={22}
                color="#2563EB"
              />
            </div>
          </div>

          <div className="kpi-label blue-text">
            Total Deliveries
          </div>

          <div className="kpi-value">
            {totalDeliveries}
          </div>

          <div className="kpi-description">
            All receiving records
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green">
              <ClipboardIcon
                size={22}
                color="#16A34A"
              />
            </div>
          </div>

          <div className="kpi-label green-text">
            Items Received
          </div>

          <div className="kpi-value">
            {totalItems.toLocaleString()}
          </div>

          <div className="kpi-description">
            Total item lines processed
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon orange">
              <ClockIcon
                size={22}
                color="#EA580C"
              />
            </div>
          </div>

          <div className="kpi-label orange-text">
            Pending Inspection
          </div>

          <div className="kpi-value">
            {pendingInspection}
          </div>

          <div className="kpi-description">
            Awaiting warehouse inspection
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon purple">
              <CheckIcon
                size={22}
                color="#7C3AED"
              />
            </div>
          </div>

          <div className="kpi-label purple-text">
            Total Quantity
          </div>

          <div className="kpi-value">
            {totalQuantity.toLocaleString()}
          </div>

          <div className="kpi-description">
            Units received across deliveries
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="filter-bar">
        <div className="search-container">
          <SearchIcon
            size={20}
            color="#64748B"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search receiving number, supplier or warehouse..."
          />
        </div>

        <div className="select-container">
          <FilterIcon
            size={18}
            color="#64748B"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option>
              All Status
            </option>
            <option>
              Received
            </option>
            <option>
              Inspecting
            </option>
            <option>
              Pending
            </option>
            <option>
              Rejected
            </option>
          </select>

          <ChevronDownIcon
            size={16}
            color="#64748B"
          />
        </div>

        <div className="select-container sort-select">
          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
          >
            <option>
              Newest First
            </option>

            <option>
              Oldest First
            </option>

            <option>
              Supplier A-Z
            </option>
          </select>

          <ChevronDownIcon
            size={16}
            color="#64748B"
          />
        </div>
      </div>

      {/* =====================================================
          RECEIVING LIST
      ===================================================== */}

      <div className="receiving-card">
        <div className="receiving-card-header">
          <div className="list-title">
            <div className="list-title-icon">
              <ClipboardIcon
                size={21}
                color="#2563EB"
              />
            </div>

            <div>
              <h2>
                Receiving List
              </h2>

              <p>
                Incoming warehouse deliveries
                and receiving records
              </p>
            </div>
          </div>

          <span className="record-badge">
            {filteredDeliveries.length}{" "}
            Record
            {filteredDeliveries.length !==
            1
              ? "s"
              : ""}
          </span>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <div className="state-container">
            <div className="loading-spinner">
              <RefreshIcon
                size={28}
                color="#2563EB"
              />
            </div>

            <h3>
              Loading receiving records...
            </h3>

            <p>
              Please wait while warehouse
              data is retrieved.
            </p>
          </div>
        ) : filteredDeliveries.length ===
          0 ? (
          <div className="state-container">
            <div className="empty-icon">
              <PackageIcon
                size={38}
                color="#94A3B8"
              />
            </div>

            <h3>
              No receiving records found
            </h3>

            <p>
              No records match your current
              search or filter.
            </p>

            <button
              type="button"
              className="empty-add-button"
              onClick={
                handleNewReceiving
              }
            >
              <PlusIcon
                size={17}
                color="#FFFFFF"
              />

              Add Receiving
            </button>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>
                      Receiving #
                    </th>

                    <th>
                      Supplier
                    </th>

                    <th>
                      Purchase Order
                    </th>

                    <th>
                      Warehouse
                    </th>

                    <th>
                      Items
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Received By
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDeliveries.map(
                    (
                      delivery
                    ) => (
                      <tr
                        key={
                          delivery.id
                        }
                      >
                        <td>
                          <div className="receiving-number">
                            {
                              delivery.receiving_number
                            }
                          </div>

                          <div className="record-subtitle">
                            Warehouse Receipt
                          </div>
                        </td>

                        <td>
                          <div className="supplier-cell">
                            <div className="supplier-avatar">
                              {delivery.supplier_name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "S"}
                            </div>

                            <div>
                              <div className="supplier-name">
                                {
                                  delivery.supplier_name
                                }
                              </div>

                              <div className="record-subtitle">
                                Supplier
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="po-badge">
                            {
                              delivery.purchase_order
                            }
                          </span>
                        </td>

                        <td>
                          <div className="warehouse-name">
                            {
                              delivery.warehouse
                            }
                          </div>
                        </td>

                        <td>
                          <strong>
                            {
                              delivery.total_items
                            }
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {Number(
                              delivery.total_quantity ||
                                0
                            ).toLocaleString()}
                          </strong>
                        </td>

                        <td>
                          {
                            delivery.received_by
                          }
                        </td>

                        <td>
                          {delivery.received_date}
                        </td>

                        <td>
                          <span
                            className="status-pill"
                            style={{
                              ...getStatusStyle(
                                delivery.status
                              ),
                            }}
                          >
                            <span className="status-dot" />

                            {delivery.status ||
                              "Unknown"}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-action"
                              onClick={() =>
                                handleEdit(
                                  delivery
                                )
                              }
                              title="Edit"
                            >
                              <EditIcon
                                size={16}
                                color="#2563EB"
                              />
                            </button>

                            <button
                              type="button"
                              className="delete-action"
                              onClick={() =>
                                void handleDelete(
                                  delivery.id
                                )
                              }
                              title="Delete"
                            >
                              <TrashIcon
                                size={16}
                                color="#DC2626"
                              />
                            </button>

                            <button
                              type="button"
                              className="more-action"
                              title="More"
                            >
                              <MoreIcon
                                size={18}
                                color="#64748B"
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

            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="pagination-bar">
              <div>
                Showing{" "}
                <strong>
                  {filteredDeliveries.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {deliveries.length}
                </strong>{" "}
                receiving records
              </div>

              <div className="pagination-controls">
                <button
                  type="button"
                  disabled
                  className="pagination-button disabled"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="pagination-button active"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="pagination-button disabled"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-heading">
                <div className="modal-icon">
                  <PackageIcon
                    size={23}
                    color="#2563EB"
                  />
                </div>

                <div>
                  <h2>
                    {editingId !== null
                      ? "Edit Receiving"
                      : "Add Receiving"}
                  </h2>

                  <p>
                    {editingId !== null
                      ? "Update the warehouse receiving record."
                      : "Record a new incoming warehouse delivery."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeForm
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="receiving-form"
            >
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="receiving_number">
                    Receiving Number
                  </label>

                  <input
                    id="receiving_number"
                    name="receiving_number"
                    value={
                      formData.receiving_number
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="GRN-1005"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="supplier_name">
                    Supplier Name
                  </label>

                  <input
                    id="supplier_name"
                    name="supplier_name"
                    value={
                      formData.supplier_name
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Supplier name"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="purchase_order">
                    Purchase Order
                  </label>

                  <input
                    id="purchase_order"
                    name="purchase_order"
                    value={
                      formData.purchase_order
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="PO-1005"
                  />
                </div>

                <div className="form-field">
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

                <div className="form-field">
                  <label htmlFor="received_by">
                    Received By
                  </label>

                  <input
                    id="received_by"
                    name="received_by"
                    value={
                      formData.received_by
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Staff member"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="received_date">
                    Received Date
                  </label>

                  <input
                    id="received_date"
                    type="date"
                    name="received_date"
                    value={
                      formData.received_date
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="form-field">
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

                <div className="form-field">
                  <label htmlFor="total_quantity">
                    Total Quantity
                  </label>

                  <input
                    id="total_quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    name="total_quantity"
                    value={
                      formData.total_quantity
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-field full-width">
                <label htmlFor="remarks">
                  Remarks
                </label>

                <textarea
                  id="remarks"
                  name="remarks"
                  value={
                    formData.remarks
                  }
                  onChange={
                    handleInputChange
                  }
                  rows={4}
                  placeholder="Additional receiving notes..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    closeForm
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Receiving"
                    : "Add Receiving"}
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

          .receiving-page {
            min-height: 100vh;
            padding: 32px;
            background: #F8FAFC;
            color: #0F172A;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          /* =========================
             HEADER
          ========================= */

          .receiving-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 30px;
          }

          .receiving-title-area {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .receiving-title-icon {
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #E8F0FF;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .title-online-dot {
            position: absolute;
            right: 2px;
            bottom: 4px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: #22C55E;
            border: 3px solid #FFFFFF;
          }

          .receiving-title-area h1 {
            margin: 0;
            font-size: 34px;
            line-height: 1.15;
            font-weight: 750;
            letter-spacing: -0.8px;
            color: #0F172A;
          }

          .receiving-title-area p {
            margin: 8px 0 0;
            color: #64748B;
            font-size: 14px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .refresh-button,
          .add-button {
            height: 46px;
            border-radius: 10px;
            padding: 0 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            font-size: 14px;
            font-weight: 650;
            cursor: pointer;
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease,
              background 0.15s ease;
          }

          .refresh-button {
            background: #FFFFFF;
            color: #475569;
            border: 1px solid #D8E0EA;
          }

          .refresh-button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 5px 14px rgba(15,23,42,0.07);
          }

          .refresh-button:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          .add-button {
            background: #2563EB;
            color: #FFFFFF;
            border: 1px solid #2563EB;
            box-shadow: 0 7px 18px rgba(37,99,235,0.22);
          }

          .add-button:hover {
            background: #1D4ED8;
            transform: translateY(-1px);
            box-shadow: 0 9px 22px rgba(37,99,235,0.28);
          }

          /* =========================
             ERROR
          ========================= */

          .error-banner {
            margin-bottom: 22px;
            padding: 13px 16px;
            background: #FEF2F2;
            border: 1px solid #FECACA;
            border-radius: 10px;
            color: #991B1B;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            font-size: 14px;
          }

          .error-banner button {
            border: none;
            background: transparent;
            color: #991B1B;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
          }

          /* =========================
             KPI CARDS
          ========================= */

          .kpi-grid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 25px;
          }

          .kpi-card {
            position: relative;
            min-height: 155px;
            background: #FFFFFF;
            border: 1px solid #E5EAF1;
            border-radius: 14px;
            padding: 20px 20px 18px;
            box-shadow:
              0 5px 18px rgba(15,23,42,0.045);
            overflow: hidden;
          }

          .kpi-top {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
          }

          .kpi-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .kpi-icon.blue {
            background: #EAF2FF;
          }

          .kpi-icon.green {
            background: #E8F8EF;
          }

          .kpi-icon.orange {
            background: #FFF4DF;
          }

          .kpi-icon.purple {
            background: #F2EAFF;
          }

          .kpi-label {
            font-size: 14px;
            font-weight: 600;
            margin-top: -3px;
          }

          .blue-text {
            color: #2563EB;
          }

          .green-text {
            color: #16A34A;
          }

          .orange-text {
            color: #EA580C;
          }

          .purple-text {
            color: #7C3AED;
          }

          .kpi-value {
            margin-top: 6px;
            font-size: 31px;
            line-height: 1.1;
            font-weight: 750;
            color: #0F172A;
            letter-spacing: -0.5px;
          }

          .kpi-description {
            margin-top: 8px;
            color: #94A3B8;
            font-size: 12px;
          }

          /* =========================
             FILTER BAR
          ========================= */

          .filter-bar {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 190px 190px;
            gap: 14px;
            padding: 14px;
            background: #FFFFFF;
            border: 1px solid #E5EAF1;
            border-radius: 13px;
            margin-bottom: 18px;
            box-shadow:
              0 4px 16px rgba(15,23,42,0.035);
          }

          .search-container,
          .select-container {
            min-height: 46px;
            border: 1px solid #DCE3EC;
            background: #FFFFFF;
            border-radius: 9px;
            display: flex;
            align-items: center;
          }

          .search-container {
            padding: 0 14px;
            gap: 10px;
          }

          .search-container input {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            font-size: 14px;
            color: #0F172A;
          }

          .search-container input::placeholder {
            color: #94A3B8;
          }

          .select-container {
            position: relative;
            padding: 0 11px;
            gap: 8px;
          }

          .select-container select {
            appearance: none;
            width: 100%;
            height: 44px;
            border: none;
            outline: none;
            background: transparent;
            color: #334155;
            font-size: 14px;
            cursor: pointer;
          }

          .select-container svg:last-child {
            pointer-events: none;
            position: absolute;
            right: 10px;
          }

          /* =========================
             MAIN LIST CARD
          ========================= */

          .receiving-card {
            background: #FFFFFF;
            border: 1px solid #E5EAF1;
            border-radius: 14px;
            box-shadow:
              0 7px 22px rgba(15,23,42,0.045);
            overflow: hidden;
          }

          .receiving-card-header {
            min-height: 82px;
            padding: 18px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            border-bottom: 1px solid #E8EDF3;
          }

          .list-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .list-title-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: #EEF5FF;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .list-title h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #0F172A;
          }

          .list-title p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #94A3B8;
          }

          .record-badge {
            background: #F1F5F9;
            color: #475569;
            border-radius: 999px;
            padding: 8px 13px;
            font-size: 12px;
            font-weight: 650;
            white-space: nowrap;
          }

          /* =========================
             TABLE
          ========================= */

          .table-wrapper {
            width: 100%;
            overflow-x: auto;
          }

          .table-wrapper table {
            width: 100%;
            min-width: 1180px;
            border-collapse: collapse;
          }

          .table-wrapper thead {
            background: #F7F9FC;
          }

          .table-wrapper th {
            padding: 15px 17px;
            color: #64748B;
            font-size: 12px;
            font-weight: 700;
            text-align: left;
            white-space: nowrap;
            border-bottom: 1px solid #E7ECF2;
          }

          .table-wrapper td {
            padding: 17px;
            color: #334155;
            font-size: 13px;
            vertical-align: middle;
            border-bottom: 1px solid #EDF1F5;
            white-space: nowrap;
          }

          .table-wrapper tbody tr {
            transition: background 0.15s ease;
          }

          .table-wrapper tbody tr:hover {
            background: #FAFCFF;
          }

          .receiving-number {
            color: #2563EB;
            font-weight: 700;
          }

          .record-subtitle {
            margin-top: 4px;
            color: #94A3B8;
            font-size: 11px;
          }

          .supplier-cell {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .supplier-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #EAF2FF;
            color: #2563EB;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
          }

          .supplier-name {
            color: #0F172A;
            font-weight: 650;
          }

          .po-badge {
            display: inline-flex;
            padding: 5px 9px;
            border-radius: 7px;
            background: #EFF6FF;
            color: #2563EB;
            font-size: 11px;
            font-weight: 650;
          }

          .warehouse-name {
            color: #334155;
            font-weight: 550;
          }

          .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
          }

          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
          }

          .action-buttons {
            display: flex;
            align-items: center;
            gap: 7px;
          }

          .edit-action,
          .delete-action,
          .more-action {
            width: 36px;
            height: 36px;
            border-radius: 9px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease;
          }

          .edit-action {
            border: 1px solid #D8E6FF;
            background: #EFF6FF;
          }

          .delete-action {
            border: 1px solid #FECACA;
            background: #FEF2F2;
          }

          .more-action {
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
          }

          .edit-action:hover,
          .delete-action:hover,
          .more-action:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(15,23,42,0.08);
          }

          /* =========================
             PAGINATION
          ========================= */

          .pagination-bar {
            min-height: 65px;
            padding: 14px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            color: #64748B;
            font-size: 12px;
          }

          .pagination-bar strong {
            color: #334155;
          }

          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 7px;
          }

          .pagination-button {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            border: 1px solid #DCE3EC;
            background: #FFFFFF;
            color: #475569;
            font-weight: 650;
            cursor: pointer;
          }

          .pagination-button.active {
            background: #2563EB;
            color: #FFFFFF;
            border-color: #2563EB;
          }

          .pagination-button.disabled {
            color: #CBD5E1;
            cursor: not-allowed;
            background: #F8FAFC;
          }

          /* =========================
             EMPTY / LOADING
          ========================= */

          .state-container {
            min-height: 330px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 50px 20px;
          }

          .loading-spinner,
          .empty-icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 14px;
          }

          .loading-spinner {
            background: #EEF5FF;
            animation: receiving-spin 1.1s linear infinite;
          }

          .empty-icon {
            background: #F1F5F9;
          }

          @keyframes receiving-spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .state-container h3 {
            margin: 0;
            color: #334155;
            font-size: 16px;
          }

          .state-container p {
            margin: 7px 0 18px;
            color: #94A3B8;
            font-size: 13px;
          }

          .empty-add-button {
            height: 40px;
            padding: 0 16px;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            border: none;
            border-radius: 8px;
            background: #2563EB;
            color: #FFFFFF;
            font-weight: 650;
            cursor: pointer;
          }

          /* =========================
             MODAL
          ========================= */

          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15,23,42,0.58);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 2000;
            backdrop-filter: blur(3px);
          }

          .modal-card {
            width: 100%;
            max-width: 780px;
            max-height: 90vh;
            overflow-y: auto;
            background: #FFFFFF;
            border-radius: 16px;
            box-shadow:
              0 30px 70px rgba(15,23,42,0.25);
          }

          .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #E8EDF3;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
          }

          .modal-heading {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .modal-icon {
            width: 44px;
            height: 44px;
            border-radius: 11px;
            background: #EEF5FF;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-heading h2 {
            margin: 0;
            font-size: 19px;
            color: #0F172A;
          }

          .modal-heading p {
            margin: 4px 0 0;
            color: #94A3B8;
            font-size: 12px;
          }

          .modal-close {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 9px;
            background: #F1F5F9;
            color: #475569;
            font-size: 22px;
            cursor: pointer;
          }

          .receiving-form {
            padding: 24px;
          }

          .form-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 17px;
          }

          .form-field {
            min-width: 0;
          }

          .form-field.full-width {
            margin-top: 17px;
          }

          .form-field label {
            display: block;
            margin-bottom: 7px;
            color: #334155;
            font-size: 13px;
            font-weight: 650;
          }

          .form-field input,
          .form-field textarea {
            width: 100%;
            border: 1px solid #D5DDE7;
            border-radius: 9px;
            background: #FFFFFF;
            padding: 11px 12px;
            outline: none;
            color: #0F172A;
            font-size: 13px;
            font-family: inherit;
            transition:
              border 0.15s ease,
              box-shadow 0.15s ease;
          }

          .form-field input {
            height: 44px;
          }

          .form-field textarea {
            resize: vertical;
            min-height: 95px;
          }

          .form-field input:focus,
          .form-field textarea:focus {
            border-color: #2563EB;
            box-shadow:
              0 0 0 3px rgba(37,99,235,0.10);
          }

          .form-field input::placeholder,
          .form-field textarea::placeholder {
            color: #A0AEC0;
          }

          .form-actions {
            margin-top: 25px;
            padding-top: 19px;
            border-top: 1px solid #E8EDF3;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }

          .cancel-button,
          .save-button {
            height: 43px;
            padding: 0 18px;
            border-radius: 9px;
            font-size: 13px;
            font-weight: 650;
            cursor: pointer;
          }

          .cancel-button {
            border: 1px solid #D5DDE7;
            background: #FFFFFF;
            color: #475569;
          }

          .save-button {
            border: 1px solid #2563EB;
            background: #2563EB;
            color: #FFFFFF;
            box-shadow:
              0 5px 13px rgba(37,99,235,0.20);
          }

          .save-button:disabled,
          .cancel-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* =========================
             RESPONSIVE
          ========================= */

          @media (max-width: 1150px) {
            .kpi-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

            .filter-bar {
              grid-template-columns:
                minmax(0, 1fr) 180px;
            }

            .sort-select {
              grid-column: 2;
            }
          }

          @media (max-width: 850px) {
            .receiving-page {
              padding: 22px;
            }

            .receiving-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .header-actions {
              width: 100%;
            }

            .refresh-button,
            .add-button {
              flex: 1;
            }

            .filter-bar {
              grid-template-columns: 1fr;
            }

            .sort-select {
              grid-column: auto;
            }
          }

          @media (max-width: 650px) {
            .receiving-page {
              padding: 16px;
            }

            .receiving-title-area {
              align-items: flex-start;
            }

            .receiving-title-icon {
              width: 54px;
              height: 54px;
            }

            .receiving-title-area h1 {
              font-size: 27px;
            }

            .kpi-grid {
              grid-template-columns: 1fr;
            }

            .header-actions {
              flex-direction: column;
            }

            .refresh-button,
            .add-button {
              width: 100%;
              flex: none;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .receiving-card-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .pagination-bar {
              align-items: flex-start;
              flex-direction: column;
            }

            .pagination-controls {
              align-self: flex-end;
            }
          }
        `}
      </style>
    </div>
  );
}