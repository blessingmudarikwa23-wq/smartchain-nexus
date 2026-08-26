import { useEffect, useMemo, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import api from "../services/api";

interface DispatchRecord {
  id: number;
  dispatch_number: string;
  order_number: string;
  customer_name: string;
  warehouse: string;
  dispatch_date: string;
  total_items: number;
  dispatched_quantity: number;
  courier: string;
  tracking_number?: string | null;
  status: string;
  remarks?: string | null;
}

interface DispatchFormData {
  dispatch_number: string;
  order_number: string;
  customer_name: string;
  warehouse: string;
  total_items: number;
  dispatched_quantity: number;
  courier: string;
  tracking_number: string;
  status: string;
  remarks: string;
}

const emptyForm: DispatchFormData = {
  dispatch_number: "",
  order_number: "",
  customer_name: "",
  warehouse: "",
  total_items: 0,
  dispatched_quantity: 0,
  courier: "",
  tracking_number: "",
  status: "Dispatched",
  remarks: "",
};

export default function Dispatch() {
  const [dispatches, setDispatches] = useState<
    DispatchRecord[]
  >([]);

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
    useState<DispatchFormData>(emptyForm);

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState<string>("All Status");

  const [sortOrder, setSortOrder] =
    useState<string>("Newest First");

  const fetchDispatches = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<DispatchRecord[]>(
          "/warehouse/dispatch"
        );

      setDispatches(response.data);
    } catch (err) {
      console.error(
        "Failed to load dispatch records:",
        err
      );

      setError(
        "Unable to load dispatch records. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

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

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "total_items" ||
        name === "dispatched_quantity"
          ? Number(value)
          : value,
    }));
  };

  const handleNewDispatch = (): void => {
    setSuccess("");
    setError("");
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (
    dispatch: DispatchRecord
  ): void => {
    setSuccess("");
    setError("");

    setEditingId(dispatch.id);

    setFormData({
      dispatch_number:
        dispatch.dispatch_number || "",

      order_number:
        dispatch.order_number || "",

      customer_name:
        dispatch.customer_name || "",

      warehouse:
        dispatch.warehouse || "",

      total_items:
        Number(dispatch.total_items || 0),

      dispatched_quantity:
        Number(
          dispatch.dispatched_quantity || 0
        ),

      courier:
        dispatch.courier || "",

      tracking_number:
        dispatch.tracking_number || "",

      status:
        dispatch.status || "Dispatched",

      remarks:
        dispatch.remarks || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this dispatch record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(
        `/warehouse/dispatch/${id}`
      );

      await fetchDispatches();

      setSuccess(
        "Dispatch record deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete dispatch:",
        err
      );

      setError(
        "Unable to delete the dispatch record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        dispatch_number:
          formData.dispatch_number.trim(),

        order_number:
          formData.order_number.trim(),

        customer_name:
          formData.customer_name.trim(),

        warehouse:
          formData.warehouse.trim(),

        total_items:
          Number(formData.total_items),

        dispatched_quantity:
          Number(
            formData.dispatched_quantity
          ),

        courier:
          formData.courier.trim(),

        tracking_number:
          formData.tracking_number.trim() ||
          null,

        remarks:
          formData.remarks.trim() ||
          null,

        ...(editingId
          ? {
              status:
                formData.status,
            }
          : {}),
      };

      if (editingId !== null) {
        await api.put(
          `/warehouse/dispatch/${editingId}`,
          payload
        );

        setSuccess(
          "Dispatch record updated successfully."
        );
      } else {
        await api.post(
          "/warehouse/dispatch",
          payload
        );

        setSuccess(
          "Dispatch record created successfully."
        );
      }

      closeForm();

      await fetchDispatches();
    } catch (err: any) {
      console.error(
        "Failed to save dispatch:",
        err
      );

      const backendMessage =
        err?.response?.data?.detail;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to save the dispatch record."
      );
    } finally {
      setSaving(false);
    }
  };

  const totalDispatches =
    dispatches.length;

  const totalItems =
    dispatches.reduce(
      (total, item) =>
        total +
        Number(item.total_items || 0),
      0
    );

  const totalQuantity =
    dispatches.reduce(
      (total, item) =>
        total +
        Number(
          item.dispatched_quantity || 0
        ),
      0
    );

  const dispatchedCount =
    dispatches.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "dispatched"
    ).length;

  const loadingCount =
    dispatches.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "loading"
    ).length;

  const pendingCount =
    dispatches.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "pending"
    ).length;

  const dispatchRate = useMemo(() => {
    if (totalDispatches === 0) {
      return 0;
    }

    return Math.round(
      (dispatchedCount /
        totalDispatches) *
        100
    );
  }, [
    dispatchedCount,
    totalDispatches,
  ]);

  const filteredDispatches =
    useMemo(() => {
      const filtered =
        dispatches.filter((item) => {
          const search =
            searchTerm
              .trim()
              .toLowerCase();

          const matchesSearch =
            !search ||
            item.dispatch_number
              ?.toLowerCase()
              .includes(search) ||
            item.order_number
              ?.toLowerCase()
              .includes(search) ||
            item.customer_name
              ?.toLowerCase()
              .includes(search) ||
            item.courier
              ?.toLowerCase()
              .includes(search) ||
            item.tracking_number
              ?.toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter ===
              "All Status" ||
            item.status?.toLowerCase() ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        });

      return [...filtered].sort(
        (a, b) => {
          if (
            sortOrder ===
            "Oldest First"
          ) {
            return (
              new Date(
                a.dispatch_date
              ).getTime() -
              new Date(
                b.dispatch_date
              ).getTime()
            );
          }

          if (
            sortOrder ===
            "A-Z"
          ) {
            return a.customer_name.localeCompare(
              b.customer_name
            );
          }

          if (
            sortOrder ===
            "Z-A"
          ) {
            return b.customer_name.localeCompare(
              a.customer_name
            );
          }

          return (
            new Date(
              b.dispatch_date
            ).getTime() -
            new Date(
              a.dispatch_date
            ).getTime()
          );
        }
      );
    }, [
      dispatches,
      searchTerm,
      statusFilter,
      sortOrder,
    ]);

  const getStatusStyle = (
    status: string
  ): {
    background: string;
    color: string;
  } => {
    switch (
      status?.toLowerCase()
    ) {
      case "dispatched":
        return {
          background: "#DCFCE7",
          color: "#166534",
        };

      case "loading":
        return {
          background: "#FEF3C7",
          color: "#92400E",
        };

      case "pending":
        return {
          background: "#DBEAFE",
          color: "#1D4ED8",
        };

      case "delayed":
        return {
          background: "#FEE2E2",
          color: "#B91C1C",
        };

      case "cancelled":
        return {
          background: "#F1F5F9",
          color: "#475569",
        };

      default:
        return {
          background: "#F1F5F9",
          color: "#475569",
        };
    }
  };

  const formatDate = (
    dateValue: string
  ): string => {
    if (!dateValue) {
      return "-";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
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

  return (
    <div className="dispatch-page">
      {/* HEADER */}

      <div className="dispatch-header">
        <div className="dispatch-title-area">
          <div className="dispatch-title-row">
            <div className="dispatch-page-icon">
              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 7h11v10H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle
                  cx="7"
                  cy="19"
                  r="1.7"
                />
                <circle
                  cx="18"
                  cy="19"
                  r="1.7"
                />
              </svg>
            </div>

            <div>
              <h1>
                Warehouse Dispatch
              </h1>

              <p>
                Manage outgoing orders,
                couriers and warehouse
                dispatch operations
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={
            handleNewDispatch
          }
          className="primary-button"
        >
          <span className="button-plus">
            +
          </span>

          Add Dispatch
        </button>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success-alert">
          {success}
        </div>
      )}

      {/* KPI CARDS */}

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-content">
            <div>
              <div className="kpi-heading blue-text">
                Total Dispatches
              </div>

              <div className="kpi-number">
                {totalDispatches}
              </div>

              <div className="kpi-description">
                Active dispatch records
              </div>
            </div>

            <div className="kpi-icon blue-icon">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 7h11v10H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle
                  cx="7"
                  cy="19"
                  r="1.5"
                />
                <circle
                  cx="18"
                  cy="19"
                  r="1.5"
                />
              </svg>
            </div>
          </div>

          <div className="mini-chart blue-chart">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-content">
            <div>
              <div className="kpi-heading green-text">
                Items Dispatched
              </div>

              <div className="kpi-number">
                {totalItems}
              </div>

              <div className="kpi-description">
                Total line items
              </div>
            </div>

            <div className="kpi-icon green-icon">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 5h14l-1 9H6L5 5z" />
                <path d="M8 5V3h8v2" />
                <circle
                  cx="9"
                  cy="18"
                  r="1.5"
                />
                <circle
                  cx="16"
                  cy="18"
                  r="1.5"
                />
              </svg>
            </div>
          </div>

          <div className="mini-chart green-chart">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-content">
            <div>
              <div className="kpi-heading orange-text">
                Dispatched Quantity
              </div>

              <div className="kpi-number">
                {totalQuantity.toLocaleString()}
              </div>

              <div className="kpi-description">
                Units dispatched
              </div>
            </div>

            <div className="kpi-icon orange-icon">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8.5"
                />
                <path d="M12 7v10" />
                <path d="M8.5 9.5c0-1 1.2-1.8 3.2-1.8 1.8 0 3 .7 3 1.8s-1.1 1.7-3 2.2c-1.9.5-3 1.1-3 2.2s1.2 1.8 3.1 1.8c1.9 0 3.2-.8 3.2-1.9" />
              </svg>
            </div>
          </div>

          <div className="mini-chart orange-chart">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-content">
            <div>
              <div className="kpi-heading purple-text">
                Dispatch Rate
              </div>

              <div className="kpi-number">
                {dispatchRate}%
              </div>

              <div className="kpi-description">
                {pendingCount} pending ·{" "}
                {loadingCount} loading
              </div>
            </div>

            <div className="kpi-icon purple-icon">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 18V9" />
                <path d="M9 18V5" />
                <path d="M14 18v-7" />
                <path d="M19 18V3" />
              </svg>
            </div>
          </div>

          <div className="mini-chart purple-chart">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      {/* SEARCH / FILTER BAR */}

      <div className="filter-bar">
        <div className="search-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search dispatches by number, customer, order or tracking..."
          />
        </div>

        <div className="filter-select">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 5h16l-6 7v5l-4 2v-7L4 5z" />
          </svg>

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
              Dispatched
            </option>

            <option>
              Loading
            </option>

            <option>
              Pending
            </option>

            <option>
              Delayed
            </option>

            <option>
              Cancelled
            </option>
          </select>
        </div>

        <div className="filter-select sort-select">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M8 5v14" />
            <path d="m5 8 3-3 3 3" />
            <path d="M16 19V5" />
            <path d="m13 16 3 3 3-3" />
          </svg>

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
              A-Z
            </option>

            <option>
              Z-A
            </option>
          </select>
        </div>
      </div>

      {/* DISPATCH LIST */}

      <div className="records-card">
        <div className="records-header">
          <div className="records-title">
            <div className="records-icon">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 5h16v14H4z" />
                <path d="M4 9h16" />
                <path d="M9 5v14" />
              </svg>
            </div>

            <div>
              <h2>
                Dispatch Records
              </h2>

              <p>
                Live warehouse dispatch
                records
              </p>
            </div>
          </div>

          <div className="records-count">
            {filteredDispatches.length} Records
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />

            <p>
              Loading dispatch records...
            </p>
          </div>
        ) : filteredDispatches.length ===
          0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              🚚
            </div>

            <h3>
              No dispatch records found
            </h3>

            <p>
              Try changing your search
              or create a new dispatch.
            </p>

            <button
              type="button"
              onClick={
                handleNewDispatch
              }
              className="primary-button"
            >
              + Add Dispatch
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    Dispatch
                  </th>

                  <th>
                    Sales Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Warehouse
                  </th>

                  <th>
                    Courier
                  </th>

                  <th>
                    Tracking
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Dispatch Date
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
                {filteredDispatches.map(
                  (item) => (
                    <tr
                      key={
                        item.id
                      }
                    >
                      <td>
                        <div className="dispatch-number">
                          <div className="dispatch-avatar">
                            {item.dispatch_number
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ||
                              "D"}
                          </div>

                          <div>
                            <strong>
                              {
                                item.dispatch_number
                              }
                            </strong>

                            <span>
                              {
                                item.total_items
                              } items
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="order-badge">
                          {
                            item.order_number
                          }
                        </span>
                      </td>

                      <td>
                        <div className="customer-cell">
                          <strong>
                            {
                              item.customer_name
                            }
                          </strong>

                          <span>
                            Customer
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="warehouse-cell">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M3 21V8l9-5 9 5v13" />
                            <path d="M7 21v-8h10v8" />
                            <path d="M9 13h6" />
                          </svg>

                          {
                            item.warehouse
                          }
                        </div>
                      </td>

                      <td>
                        {
                          item.courier ||
                          "-"
                        }
                      </td>

                      <td>
                        <span className="tracking-text">
                          {
                            item.tracking_number ||
                            "-"
                          }
                        </span>
                      </td>

                      <td>
                        <strong className="quantity-value">
                          {Number(
                            item.dispatched_quantity ||
                              0
                          ).toLocaleString()}
                        </strong>
                      </td>

                      <td>
                        <span className="date-text">
                          {formatDate(
                            item.dispatch_date
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className="status-pill"
                          style={{
                            ...getStatusStyle(
                              item.status
                            ),
                          }}
                        >
                          <span className="status-dot" />

                          {
                            item.status
                          }
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                            className="icon-action edit-action"
                            title="Edit dispatch"
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
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                            </svg>
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
                            className="icon-action delete-action"
                            title="Delete dispatch"
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
                              <path d="M19 6l-1 15H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            className="icon-action more-action"
                            title="More actions"
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <circle
                                cx="5"
                                cy="12"
                                r="1.5"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="1.5"
                              />
                              <circle
                                cx="19"
                                cy="12"
                                r="1.5"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="records-footer">
          <span>
            Showing{" "}
            {filteredDispatches.length > 0
              ? 1
              : 0}{" "}
            to{" "}
            {
              filteredDispatches.length
            }{" "}
            of{" "}
            {filteredDispatches.length}{" "}
            dispatches
          </span>

          <div className="pagination">
            <button
              type="button"
              disabled
            >
              ‹
            </button>

            <button
              type="button"
              className="active-page"
            >
              1
            </button>

            <button
              type="button"
              disabled
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}

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
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Dispatch"
                    : "Add Dispatch"}
                </h2>

                <p>
                  {editingId !== null
                    ? "Update the dispatch and delivery information."
                    : "Create a new warehouse dispatch record."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="dispatch-form"
            >
              <div className="form-grid">
                <div>
                  <label>
                    Dispatch Number
                  </label>

                  <input
                    name="dispatch_number"
                    value={
                      formData.dispatch_number
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="DSP-1001"
                    required
                  />
                </div>

                <div>
                  <label>
                    Sales Order
                  </label>

                  <input
                    name="order_number"
                    value={
                      formData.order_number
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="SO-1001"
                    required
                  />
                </div>

                <div>
                  <label>
                    Customer Name
                  </label>

                  <input
                    name="customer_name"
                    value={
                      formData.customer_name
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div>
                  <label>
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
                    placeholder="Main Warehouse"
                    required
                  />
                </div>

                <div>
                  <label>
                    Total Items
                  </label>

                  <input
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
                  <label>
                    Dispatched Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="dispatched_quantity"
                    value={
                      formData.dispatched_quantity
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div>
                  <label>
                    Courier
                  </label>

                  <input
                    name="courier"
                    value={
                      formData.courier
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="DHL"
                    required
                  />
                </div>

                <div>
                  <label>
                    Tracking Number
                  </label>

                  <input
                    name="tracking_number"
                    value={
                      formData.tracking_number
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Tracking number"
                  />
                </div>

                <div>
                  <label>
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
                  >
                    <option value="Dispatched">
                      Dispatched
                    </option>

                    <option value="Loading">
                      Loading
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Delayed">
                      Delayed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              <div className="remarks-field">
                <label>
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
                  placeholder="Additional dispatch notes..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                  className="cancel-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="save-button"
                >
                  {saving
                    ? "Saving..."
                    : editingId !==
                      null
                    ? "Update Dispatch"
                    : "Create Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAGE STYLES */}

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .dispatch-page {
            min-height: 100vh;
            padding: 28px 30px 35px;
            background:
              linear-gradient(
                180deg,
                #F8FAFC 0%,
                #FFFFFF 52%,
                #F8FAFC 100%
              );
            color: #0F172A;
          }

          .dispatch-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            margin-bottom: 28px;
          }

          .dispatch-title-row {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .dispatch-page-icon {
            width: 58px;
            height: 58px;
            flex-shrink: 0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            background:
              linear-gradient(
                145deg,
                #7EA0FF,
                #4F73E8
              );
            box-shadow:
              0 8px 20px
              rgba(79,115,232,0.20);
          }

          .dispatch-title-area h1 {
            margin: 0;
            font-size: 36px;
            line-height: 1.1;
            font-weight: 800;
            letter-spacing: -1px;
            color: #0F172A;
          }

          .dispatch-title-area p {
            margin: 7px 0 0;
            font-size: 14px;
            color: #64748B;
          }

          .primary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            border: none;
            border-radius: 10px;
            padding: 13px 20px;
            background:
              linear-gradient(
                135deg,
                #2563EB,
                #1D4ED8
              );
            color: #FFFFFF;
            font-family: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            box-shadow:
              0 7px 17px
              rgba(37,99,235,0.22);
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease;
          }

          .primary-button:hover {
            transform: translateY(-1px);
            box-shadow:
              0 10px 22px
              rgba(37,99,235,0.27);
          }

          .button-plus {
            font-size: 20px;
            line-height: 12px;
          }

          .alert {
            padding: 13px 17px;
            margin-bottom: 18px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
          }

          .error-alert {
            background: #FEF2F2;
            border: 1px solid #FECACA;
            color: #991B1B;
          }

          .success-alert {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            color: #166534;
          }

          .kpi-grid {
            display: grid;
            grid-template-columns:
              repeat(
                4,
                minmax(0, 1fr)
              );
            gap: 18px;
            margin-bottom: 30px;
          }

          .kpi-card {
            position: relative;
            min-height: 148px;
            overflow: hidden;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 13px;
            padding: 19px 20px 17px;
            box-shadow:
              0 7px 20px
              rgba(15,23,42,0.055);
          }

          .kpi-card-content {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 15px;
          }

          .kpi-heading {
            font-size: 14px;
            font-weight: 600;
          }

          .blue-text {
            color: #2563EB;
          }

          .green-text {
            color: #16A34A;
          }

          .orange-text {
            color: #F59E0B;
          }

          .purple-text {
            color: #7C3AED;
          }

          .kpi-number {
            margin-top: 8px;
            font-size: 31px;
            line-height: 1;
            font-weight: 800;
            color: #0F172A;
          }

          .kpi-description {
            margin-top: 9px;
            font-size: 12px;
            color: #64748B;
          }

          .kpi-icon {
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .blue-icon {
            background: #EFF6FF;
            color: #2563EB;
          }

          .green-icon {
            background: #ECFDF5;
            color: #16A34A;
          }

          .orange-icon {
            background: #FFFBEB;
            color: #F59E0B;
          }

          .purple-icon {
            background: #F5F3FF;
            color: #7C3AED;
          }

          .mini-chart {
            position: absolute;
            right: 20px;
            bottom: 17px;
            width: 64px;
            height: 25px;
            display: flex;
            align-items: flex-end;
            gap: 4px;
            opacity: 0.9;
          }

          .mini-chart span {
            display: block;
            width: 7px;
            border-radius: 5px 5px 0 0;
          }

          .blue-chart span {
            background: #4F7FF7;
          }

          .green-chart span {
            background: #35B779;
          }

          .orange-chart span {
            background: #F5A623;
          }

          .purple-chart span {
            background: #8B5CF6;
          }

          .mini-chart span:nth-child(1) {
            height: 7px;
          }

          .mini-chart span:nth-child(2) {
            height: 11px;
          }

          .mini-chart span:nth-child(3) {
            height: 9px;
          }

          .mini-chart span:nth-child(4) {
            height: 17px;
          }

          .mini-chart span:nth-child(5) {
            height: 23px;
          }

          .filter-bar {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              185px
              185px;
            gap: 16px;
            align-items: center;
            padding: 11px 13px;
            margin-bottom: 16px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            box-shadow:
              0 5px 18px
              rgba(15,23,42,0.045);
          }

          .search-box {
            min-width: 0;
            height: 46px;
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 0 14px;
            border: 1px solid #E2E8F0;
            border-radius: 9px;
            color: #64748B;
            background: #FFFFFF;
          }

          .search-box:focus-within {
            border-color: #93C5FD;
            box-shadow:
              0 0 0 3px
              rgba(37,99,235,0.08);
          }

          .search-box input {
            width: 100%;
            min-width: 0;
            border: none;
            outline: none;
            background: transparent;
            color: #0F172A;
            font-size: 14px;
            font-family: inherit;
          }

          .search-box input::placeholder {
            color: #94A3B8;
          }

          .filter-select {
            height: 46px;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 0 13px;
            border: 1px solid #E2E8F0;
            border-radius: 9px;
            color: #64748B;
            background: #FFFFFF;
          }

          .filter-select select {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: #334155;
            font-family: inherit;
            font-size: 14px;
            cursor: pointer;
          }

          .records-card {
            overflow: hidden;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            box-shadow:
              0 8px 25px
              rgba(15,23,42,0.055);
          }

          .records-header {
            min-height: 74px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 15px 20px;
            border-bottom: 1px solid #E2E8F0;
          }

          .records-title {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .records-icon {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            color: #2563EB;
            background: #EFF6FF;
          }

          .records-title h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 750;
            color: #0F172A;
          }

          .records-title p {
            margin: 3px 0 0;
            font-size: 12px;
            color: #64748B;
          }

          .records-count {
            padding: 7px 12px;
            border-radius: 999px;
            background: #EFF6FF;
            color: #2563EB;
            font-size: 12px;
            font-weight: 700;
          }

          .table-wrapper {
            width: 100%;
            overflow-x: auto;
          }

          table {
            width: 100%;
            min-width: 1250px;
            border-collapse: collapse;
          }

          thead {
            background:
              linear-gradient(
                180deg,
                #F8FAFF,
                #F1F5FB
              );
          }

          th {
            height: 54px;
            padding: 0 13px;
            text-align: left;
            color: #334155;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            border-bottom: 1px solid #E2E8F0;
          }

          td {
            height: 76px;
            padding: 10px 13px;
            text-align: left;
            color: #334155;
            font-size: 13px;
            white-space: nowrap;
            border-bottom: 1px solid #EEF2F7;
          }

          tbody tr {
            transition:
              background 0.15s ease;
          }

          tbody tr:hover {
            background: #F8FAFC;
          }

          .dispatch-number {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .dispatch-avatar {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #DBEAFE;
            color: #2563EB;
            font-size: 15px;
            font-weight: 800;
          }

          .dispatch-number strong {
            display: block;
            color: #0F172A;
            font-size: 13px;
            font-weight: 750;
          }

          .dispatch-number span {
            display: block;
            margin-top: 3px;
            color: #94A3B8;
            font-size: 11px;
          }

          .order-badge {
            display: inline-block;
            padding: 5px 8px;
            border-radius: 6px;
            background: #EFF6FF;
            color: #2563EB;
            font-size: 11px;
            font-weight: 700;
          }

          .customer-cell strong {
            display: block;
            color: #0F172A;
            font-size: 13px;
            font-weight: 700;
          }

          .customer-cell span {
            display: block;
            margin-top: 3px;
            color: #94A3B8;
            font-size: 11px;
          }

          .warehouse-cell {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #475569;
          }

          .tracking-text {
            color: #475569;
            font-size: 12px;
          }

          .quantity-value {
            color: #0F172A;
            font-weight: 700;
          }

          .date-text {
            color: #475569;
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
            justify-content: flex-start;
            gap: 7px;
          }

          .icon-action {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            cursor: pointer;
            transition:
              transform 0.15s ease,
              background 0.15s ease;
          }

          .icon-action:hover {
            transform: translateY(-1px);
          }

          .edit-action {
            border: 1px solid #D7E4FF;
            background: #F1F6FF;
            color: #2563EB;
          }

          .edit-action:hover {
            background: #E6EEFF;
          }

          .delete-action {
            border: 1px solid #FECACA;
            background: #FEF2F2;
            color: #DC2626;
          }

          .delete-action:hover {
            background: #FEE2E2;
          }

          .delete-action:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }

          .more-action {
            border: none;
            background: transparent;
            color: #64748B;
          }

          .more-action:hover {
            background: #F1F5F9;
          }

          .records-footer {
            min-height: 61px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            color: #64748B;
            font-size: 12px;
          }

          .pagination {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .pagination button {
            width: 34px;
            height: 34px;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            background: #FFFFFF;
            color: #64748B;
            font-size: 17px;
            cursor: pointer;
          }

          .pagination button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
          }

          .pagination .active-page {
            border-color: #2563EB;
            background: #2563EB;
            color: #FFFFFF;
            font-size: 13px;
            font-weight: 700;
          }

          .empty-state {
            padding: 65px 20px;
            text-align: center;
            color: #64748B;
          }

          .empty-state p {
            margin: 7px 0 20px;
            font-size: 14px;
          }

          .empty-state h3 {
            margin: 0;
            color: #334155;
            font-size: 17px;
          }

          .empty-icon {
            margin-bottom: 12px;
            font-size: 42px;
          }

          .loading-spinner {
            width: 34px;
            height: 34px;
            margin: 0 auto 14px;
            border: 3px solid #DBEAFE;
            border-top-color: #2563EB;
            border-radius: 50%;
            animation:
              dispatch-spin 0.8s linear infinite;
          }

          @keyframes dispatch-spin {
            to {
              transform: rotate(360deg);
            }
          }

          .modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background:
              rgba(15,23,42,0.58);
          }

          .modal {
            width: 100%;
            max-width: 820px;
            max-height: 92vh;
            overflow-y: auto;
            border-radius: 17px;
            background: #FFFFFF;
            box-shadow:
              0 30px 80px
              rgba(0,0,0,0.25);
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 21px 25px;
            border-bottom: 1px solid #E2E8F0;
          }

          .modal-header h2 {
            margin: 0;
            color: #0F172A;
            font-size: 21px;
            font-weight: 750;
          }

          .modal-header p {
            margin: 5px 0 0;
            color: #64748B;
            font-size: 13px;
          }

          .modal-close {
            width: 37px;
            height: 37px;
            border: none;
            border-radius: 50%;
            background: #F1F5F9;
            color: #334155;
            font-size: 21px;
            cursor: pointer;
          }

          .dispatch-form {
            padding: 25px;
          }

          .form-grid {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 17px;
          }

          .dispatch-form label {
            display: block;
            margin-bottom: 7px;
            color: #334155;
            font-size: 13px;
            font-weight: 700;
          }

          .dispatch-form input,
          .dispatch-form select,
          .dispatch-form textarea {
            width: 100%;
            padding: 11px 13px;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            outline: none;
            background: #FFFFFF;
            color: #0F172A;
            font-family: inherit;
            font-size: 14px;
          }

          .dispatch-form input:focus,
          .dispatch-form select:focus,
          .dispatch-form textarea:focus {
            border-color: #2563EB;
            box-shadow:
              0 0 0 3px
              rgba(37,99,235,0.10);
          }

          .remarks-field {
            margin-top: 18px;
          }

          .dispatch-form textarea {
            resize: vertical;
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 11px;
            margin-top: 24px;
          }

          .cancel-button,
          .save-button {
            padding: 11px 20px;
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }

          .cancel-button {
            border: 1px solid #CBD5E1;
            background: #FFFFFF;
            color: #334155;
          }

          .save-button {
            border: none;
            background: #2563EB;
            color: #FFFFFF;
            box-shadow:
              0 6px 14px
              rgba(37,99,235,0.18);
          }

          .save-button:disabled,
          .cancel-button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          @media (max-width: 1100px) {
            .kpi-grid {
              grid-template-columns:
                repeat(
                  2,
                  minmax(0, 1fr)
                );
            }

            .filter-bar {
              grid-template-columns:
                minmax(0, 1fr)
                170px
                170px;
            }
          }

          @media (max-width: 760px) {
            .dispatch-page {
              padding: 20px 15px;
            }

            .dispatch-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .dispatch-title-area h1 {
              font-size: 29px;
            }

            .dispatch-title-row {
              align-items: flex-start;
            }

            .kpi-grid {
              grid-template-columns: 1fr;
            }

            .filter-bar {
              grid-template-columns: 1fr;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .records-footer {
              gap: 12px;
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
}