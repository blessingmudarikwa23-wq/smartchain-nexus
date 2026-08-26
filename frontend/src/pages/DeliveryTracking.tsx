import { useEffect, useMemo, useState } from "react";

type Delivery = {
  id: number;
  order_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  driver_name: string;
  vehicle_number: string;
  delivery_status: string;
  expected_delivery: string;
  actual_delivery: string | null;
  created_at: string;
  updated_at: string;
};

type DeliveryForm = {
  order_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  driver_name: string;
  vehicle_number: string;
  delivery_status: string;
  expected_delivery: string;
  actual_delivery: string;
};

type SortOption = "newest" | "oldest";

const API_URL =
  "http://127.0.0.1:8000/logistics/delivery-tracking";

const emptyForm: DeliveryForm = {
  order_number: "",
  customer_name: "",
  origin: "",
  destination: "",
  driver_name: "",
  vehicle_number: "",
  delivery_status: "Pending",
  expected_delivery: "",
  actual_delivery: "",
};

const statusOptions = [
  "Pending",
  "Preparing",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function DeliveryTracking() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [form, setForm] = useState<DeliveryForm>({
    ...emptyForm,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] =
    useState<string>("All Status");

  const [sortOption, setSortOption] =
    useState<SortOption>("newest");

  // ==========================================================
  // FETCH DELIVERIES
  // ==========================================================

  const fetchDeliveries = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load delivery tracking records."
        );
      }

      const data: Delivery[] = await response.json();

      setDeliveries(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load delivery tracking records."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = (): void => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================================
  // OPEN CREATE FORM
  // ==========================================================

  const handleAddDelivery = (): void => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ==========================================================
  // OPEN EDIT FORM
  // ==========================================================

  const handleEdit = (delivery: Delivery): void => {
    setEditingId(delivery.id);

    setForm({
      order_number: delivery.order_number,
      customer_name: delivery.customer_name,
      origin: delivery.origin,
      destination: delivery.destination,
      driver_name: delivery.driver_name,
      vehicle_number: delivery.vehicle_number,
      delivery_status: delivery.delivery_status,
      expected_delivery: delivery.expected_delivery
        ? formatDateTimeForInput(
            delivery.expected_delivery
          )
        : "",
      actual_delivery: delivery.actual_delivery
        ? formatDateTimeForInput(
            delivery.actual_delivery
          )
        : "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ==========================================================
  // CREATE / UPDATE DELIVERY
  // ==========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.order_number.trim()) {
        throw new Error("Order number is required.");
      }

      if (!form.customer_name.trim()) {
        throw new Error("Customer name is required.");
      }

      if (!form.origin.trim()) {
        throw new Error("Origin is required.");
      }

      if (!form.destination.trim()) {
        throw new Error("Destination is required.");
      }

      if (!form.driver_name.trim()) {
        throw new Error("Driver name is required.");
      }

      if (!form.vehicle_number.trim()) {
        throw new Error("Vehicle number is required.");
      }

      if (!form.expected_delivery) {
        throw new Error(
          "Expected delivery date is required."
        );
      }

      const payload = {
        order_number: form.order_number.trim(),
        customer_name: form.customer_name.trim(),
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        driver_name: form.driver_name.trim(),
        vehicle_number: form.vehicle_number.trim(),
        delivery_status: form.delivery_status,
        expected_delivery: new Date(
          form.expected_delivery
        ).toISOString(),
        actual_delivery: form.actual_delivery
          ? new Date(
              form.actual_delivery
            ).toISOString()
          : null,
      };

      const url =
        editingId === null
          ? API_URL
          : `${API_URL}/${editingId}`;

      const method =
        editingId === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${
              editingId === null
                ? "create"
                : "update"
            } delivery record.`
        );
      }

      await response.json();

      setSuccess(
        editingId === null
          ? "Delivery created successfully."
          : "Delivery updated successfully."
      );

      resetForm();

      await fetchDeliveries();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the delivery."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE DELIVERY
  // ==========================================================

  const handleDelete = async (
    id: number,
    orderNumber: string
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete delivery ${orderNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete delivery record."
        );
      }

      setSuccess(
        "Delivery deleted successfully."
      );

      await fetchDeliveries();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete delivery."
      );
    }
  };

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredDeliveries = useMemo(() => {
    const filtered = deliveries.filter(
      (delivery) => {
        const search =
          searchTerm.trim().toLowerCase();

        const matchesSearch =
          search === "" ||
          delivery.order_number
            .toLowerCase()
            .includes(search) ||
          delivery.customer_name
            .toLowerCase()
            .includes(search) ||
          delivery.driver_name
            .toLowerCase()
            .includes(search) ||
          delivery.vehicle_number
            .toLowerCase()
            .includes(search) ||
          delivery.origin
            .toLowerCase()
            .includes(search) ||
          delivery.destination
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "All Status" ||
          delivery.delivery_status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

    return [...filtered].sort(
      (a, b) => {
        const dateA = new Date(
          a.created_at
        ).getTime();

        const dateB = new Date(
          b.created_at
        ).getTime();

        return sortOption === "newest"
          ? dateB - dateA
          : dateA - dateB;
      }
    );
  }, [
    deliveries,
    searchTerm,
    statusFilter,
    sortOption,
  ]);

  // ==========================================================
  // METRICS
  // ==========================================================

  const metrics = useMemo(() => {
    const total = deliveries.length;

    const delivered = deliveries.filter(
      (delivery) =>
        delivery.delivery_status.toLowerCase() ===
        "delivered"
    ).length;

    const inTransit = deliveries.filter(
      (delivery) =>
        delivery.delivery_status.toLowerCase() ===
        "in transit"
    ).length;

    const outForDelivery = deliveries.filter(
      (delivery) =>
        delivery.delivery_status.toLowerCase() ===
        "out for delivery"
    ).length;

    return {
      total,
      delivered,
      inTransit,
      outForDelivery,
    };
  }, [deliveries]);

  // ==========================================================
  // STATUS STYLES
  // ==========================================================

  const getStatusStyle = (
    status: string
  ): {
    background: string;
    color: string;
  } => {
    const normalized =
      status.toLowerCase();

    if (normalized === "delivered") {
      return {
        background: "#DCFCE7",
        color: "#15803D",
      };
    }

    if (normalized === "in transit") {
      return {
        background: "#DBEAFE",
        color: "#2563EB",
      };
    }

    if (
      normalized ===
      "out for delivery"
    ) {
      return {
        background: "#FEF3C7",
        color: "#D97706",
      };
    }

    if (normalized === "preparing") {
      return {
        background: "#F3E8FF",
        color: "#7E22CE",
      };
    }

    return {
      background: "#F1F5F9",
      color: "#64748B",
    };
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    date: string | null
  ): string => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="delivery-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="delivery-header">
        <div className="delivery-title-area">
          <div className="delivery-page-icon">
            <TruckIcon />
          </div>

          <div>
            <h1>Delivery Tracking</h1>

            <p>
              Monitor deliveries, drivers,
              vehicles and delivery status.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddDelivery}
          className="primary-button"
        >
          <PlusIcon />
          Add Delivery
        </button>
      </div>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {success && (
        <div className="success-message">
          <CheckCircleIcon />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="metrics-grid">
        <MetricCard
          title="Total Deliveries"
          value={metrics.total}
          subtitle="All delivery records"
          variant="blue"
          icon={<PackageIcon />}
        />

        <MetricCard
          title="Delivered"
          value={metrics.delivered}
          subtitle="Successfully completed"
          variant="green"
          icon={<CheckCircleIcon />}
        />

        <MetricCard
          title="In Transit"
          value={metrics.inTransit}
          subtitle="Currently on the road"
          variant="orange"
          icon={<TruckIcon />}
        />

        <MetricCard
          title="Out for Delivery"
          value={metrics.outForDelivery}
          subtitle="Final delivery stage"
          variant="purple"
          icon={<LocationIcon />}
        />
      </div>

      {/* ======================================================
          SEARCH / FILTER / SORT
      ====================================================== */}

      <div className="filter-bar">
        <div className="search-wrapper">
          <SearchIcon />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search deliveries by order, customer, driver or vehicle..."
          />
        </div>

        <div className="select-wrapper">
          <FilterIcon />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All Status">
              All Status
            </option>

            {statusOptions.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>

          <ChevronDownIcon />
        </div>

        <div className="select-wrapper sort-wrapper">
          <SortIcon />

          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target
                  .value as SortOption
              )
            }
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>

          <ChevronDownIcon />
        </div>
      </div>

      {/* ======================================================
          DELIVERY LIST
      ====================================================== */}

      <div className="delivery-card">
        <div className="delivery-card-header">
          <div className="list-title">
            <div className="list-title-icon">
              <TruckIcon />
            </div>

            <div>
              <h2>Delivery List</h2>

              <p>
                Track and manage your
                delivery operations.
              </p>
            </div>
          </div>

          <div className="record-count">
            {filteredDeliveries.length}{" "}
            {filteredDeliveries.length === 1
              ? "Delivery"
              : "Deliveries"}
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />

            <h3>
              Loading delivery records...
            </h3>

            <p>
              Connecting to delivery
              tracking services.
            </p>
          </div>
        ) : filteredDeliveries.length ===
          0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <TruckIcon />
            </div>

            <h3>
              No delivery records found
            </h3>

            <p>
              Try adjusting your search or
              create a new delivery record.
            </p>

            <button
              type="button"
              onClick={handleAddDelivery}
              className="empty-action"
            >
              <PlusIcon />
              Add Delivery
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="delivery-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Expected</th>
                  <th>Actual</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDeliveries.map(
                  (delivery) => {
                    const statusStyle =
                      getStatusStyle(
                        delivery.delivery_status
                      );

                    return (
                      <tr
                        key={delivery.id}
                      >
                        {/* ORDER */}

                        <td>
                          <div className="order-cell">
                            <div className="order-icon">
                              <PackageIcon />
                            </div>

                            <div>
                              <strong>
                                {
                                  delivery.order_number
                                }
                              </strong>

                              <span>
                                Delivery #
                                {
                                  delivery.id
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <div className="customer-cell">
                            <div className="avatar">
                              {getInitials(
                                delivery.customer_name
                              )}
                            </div>

                            <div>
                              <strong>
                                {
                                  delivery.customer_name
                                }
                              </strong>

                              <span>
                                Customer
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ROUTE */}

                        <td>
                          <div className="route-cell">
                            <div>
                              <span className="route-label">
                                From
                              </span>

                              <strong>
                                {
                                  delivery.origin
                                }
                              </strong>
                            </div>

                            <div className="route-arrow">
                              →
                            </div>

                            <div>
                              <span className="route-label">
                                To
                              </span>

                              <strong>
                                {
                                  delivery.destination
                                }
                              </strong>
                            </div>
                          </div>
                        </td>

                        {/* DRIVER */}

                        <td>
                          <div className="driver-cell">
                            <div className="driver-icon">
                              <UserIcon />
                            </div>

                            <div>
                              <strong>
                                {
                                  delivery.driver_name
                                }
                              </strong>

                              <span>
                                Driver
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* VEHICLE */}

                        <td>
                          <div className="vehicle-cell">
                            <TruckIcon />

                            <span>
                              {
                                delivery.vehicle_number
                              }
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background:
                                statusStyle.background,
                              color:
                                statusStyle.color,
                            }}
                          >
                            <span
                              className="status-dot"
                              style={{
                                background:
                                  statusStyle.color,
                              }}
                            />

                            {
                              delivery.delivery_status
                            }
                          </span>
                        </td>

                        {/* EXPECTED */}

                        <td>
                          <div className="date-cell">
                            <CalendarIcon />

                            <span>
                              {formatDate(
                                delivery.expected_delivery
                              )}
                            </span>
                          </div>
                        </td>

                        {/* ACTUAL */}

                        <td>
                          <div className="date-cell">
                            <CalendarIcon />

                            <span>
                              {formatDate(
                                delivery.actual_delivery
                              )}
                            </span>
                          </div>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="icon-button edit-button"
                              onClick={() =>
                                handleEdit(
                                  delivery
                                )
                              }
                              title="Edit delivery"
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              className="icon-button delete-button"
                              onClick={() =>
                                handleDelete(
                                  delivery.id,
                                  delivery.order_number
                                )
                              }
                              title="Delete delivery"
                            >
                              <TrashIcon />
                            </button>

                            <button
                              type="button"
                              className="icon-button more-button"
                              title="More options"
                            >
                              <MoreIcon />
                            </button>
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

        {/* ====================================================
            TABLE FOOTER
        ==================================================== */}

        {!loading &&
          filteredDeliveries.length >
            0 && (
            <div className="table-footer">
              <span>
                Showing 1 to{" "}
                {filteredDeliveries.length}{" "}
                of{" "}
                {filteredDeliveries.length}{" "}
                deliveries
              </span>

              <div className="pagination">
                <button
                  type="button"
                  disabled
                  className="pagination-button"
                >
                  <ChevronLeftIcon />
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
                  className="pagination-button"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showForm && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <div className="modal-header">
              <div>
                <div className="modal-title-row">
                  <div className="modal-icon">
                    <TruckIcon />
                  </div>

                  <div>
                    <h2>
                      {editingId === null
                        ? "Add Delivery"
                        : "Edit Delivery"}
                    </h2>

                    <p>
                      {editingId === null
                        ? "Create a new delivery tracking record."
                        : "Update delivery tracking information."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="delivery-form"
            >
              <div className="form-grid">
                <FormField
                  label="Order Number"
                  name="order_number"
                  value={
                    form.order_number
                  }
                  placeholder="SO-1001"
                  onChange={
                    handleChange
                  }
                />

                <FormField
                  label="Customer Name"
                  name="customer_name"
                  value={
                    form.customer_name
                  }
                  placeholder="ABC Retail"
                  onChange={
                    handleChange
                  }
                />

                <FormField
                  label="Origin"
                  name="origin"
                  value={form.origin}
                  placeholder="Johannesburg"
                  onChange={
                    handleChange
                  }
                />

                <FormField
                  label="Destination"
                  name="destination"
                  value={
                    form.destination
                  }
                  placeholder="Pretoria"
                  onChange={
                    handleChange
                  }
                />

                <FormField
                  label="Driver Name"
                  name="driver_name"
                  value={
                    form.driver_name
                  }
                  placeholder="John Dube"
                  onChange={
                    handleChange
                  }
                />

                <FormField
                  label="Vehicle Number"
                  name="vehicle_number"
                  value={
                    form.vehicle_number
                  }
                  placeholder="Truck 101"
                  onChange={
                    handleChange
                  }
                />

                <div className="form-field">
                  <label htmlFor="delivery_status">
                    Delivery Status
                  </label>

                  <select
                    id="delivery_status"
                    name="delivery_status"
                    value={
                      form.delivery_status
                    }
                    onChange={
                      handleChange
                    }
                  >
                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="expected_delivery">
                    Expected Delivery
                  </label>

                  <input
                    id="expected_delivery"
                    type="datetime-local"
                    name="expected_delivery"
                    value={
                      form.expected_delivery
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="actual_delivery">
                    Actual Delivery
                  </label>

                  <input
                    id="actual_delivery"
                    type="datetime-local"
                    name="actual_delivery"
                    value={
                      form.actual_delivery
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </div>

              <div className="form-info">
                <div className="info-icon">
                  <InfoIcon />
                </div>

                <div>
                  <strong>
                    Delivery tracking
                    information
                  </strong>

                  <p>
                    Update the delivery
                    status and actual
                    delivery time once the
                    shipment has been
                    completed.
                  </p>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="cancel-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="save-button"
                >
                  {saving
                    ? "Saving..."
                    : editingId === null
                    ? "Create Delivery"
                    : "Update Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          PAGE STYLES
      ====================================================== */}

      <style>{`
        .delivery-page {
          min-height: 100vh;
          padding: 30px;
          background: #f8fafc;
          box-sizing: border-box;
          color: #0f172a;
        }

        .delivery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .delivery-title-area {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .delivery-page-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #dbeafe;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .delivery-page-icon svg {
          width: 30px;
          height: 30px;
        }

        .delivery-header h1 {
          margin: 0;
          font-size: 36px;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.8px;
          color: #0f172a;
        }

        .delivery-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 15px;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: none;
          border-radius: 9px;
          padding: 13px 20px;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(37, 99, 235, 0.22);
          transition: all 0.15s ease;
        }

        .primary-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .primary-button svg {
          width: 17px;
          height: 17px;
        }

        .success-message,
        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .success-message {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .success-message svg,
        .error-message svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 26px;
        }

        .metric-card {
          position: relative;
          min-height: 142px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 5px 18px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .metric-card-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;
        }

        .metric-card-icon svg {
          width: 23px;
          height: 23px;
        }

        .metric-blue .metric-card-icon {
          background: #dbeafe;
          color: #2563eb;
        }

        .metric-green .metric-card-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .metric-orange .metric-card-icon {
          background: #fef3c7;
          color: #d97706;
        }

        .metric-purple .metric-card-icon {
          background: #f3e8ff;
          color: #9333ea;
        }

        .metric-label {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }

        .metric-blue .metric-label {
          color: #2563eb;
        }

        .metric-green .metric-label {
          color: #16a34a;
        }

        .metric-orange .metric-label {
          color: #d97706;
        }

        .metric-purple .metric-label {
          color: #9333ea;
        }

        .metric-value {
          margin: 5px 0 0;
          color: #0f172a;
          font-size: 30px;
          line-height: 1;
          font-weight: 700;
        }

        .metric-subtitle {
          display: block;
          margin-top: 8px;
          color: #64748b;
          font-size: 11px;
        }

        .filter-bar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 180px 180px;
          gap: 14px;
          padding: 14px;
          margin-bottom: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: #ffffff;
          box-shadow: 0 5px 18px rgba(15, 23, 42, 0.035);
        }

        .search-wrapper,
        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .search-wrapper > svg {
          position: absolute;
          left: 15px;
          width: 19px;
          height: 19px;
          color: #64748b;
          pointer-events: none;
        }

        .search-wrapper input,
        .select-wrapper select {
          width: 100%;
          height: 46px;
          box-sizing: border-box;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          outline: none;
          background: #ffffff;
          color: #334155;
          font-family: inherit;
          font-size: 13px;
        }

        .search-wrapper input {
          padding: 0 14px 0 43px;
        }

        .search-wrapper input:focus,
        .select-wrapper select:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .select-wrapper > svg:first-child {
          position: absolute;
          left: 13px;
          width: 17px;
          height: 17px;
          color: #64748b;
          pointer-events: none;
          z-index: 1;
        }

        .select-wrapper select {
          appearance: none;
          padding: 0 36px 0 38px;
          cursor: pointer;
        }

        .select-wrapper > svg:last-child {
          position: absolute;
          right: 12px;
          width: 16px;
          height: 16px;
          color: #64748b;
          pointer-events: none;
        }

        .delivery-card {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.055);
        }

        .delivery-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 20px 22px;
          border-bottom: 1px solid #e2e8f0;
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
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
        }

        .list-title-icon svg {
          width: 20px;
          height: 20px;
        }

        .list-title h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .list-title p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .record-count {
          padding: 7px 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .delivery-table {
          width: 100%;
          min-width: 1320px;
          border-collapse: collapse;
        }

        .delivery-table thead {
          background: #f8fafc;
        }

        .delivery-table th {
          padding: 14px 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #64748b;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.35px;
          white-space: nowrap;
        }

        .delivery-table td {
          padding: 17px 15px;
          border-bottom: 1px solid #eef2f7;
          color: #334155;
          font-size: 13px;
          vertical-align: middle;
        }

        .delivery-table tbody tr {
          transition: background 0.15s ease;
        }

        .delivery-table tbody tr:hover {
          background: #f8fbff;
        }

        .order-cell,
        .customer-cell,
        .driver-cell,
        .vehicle-cell,
        .date-cell {
          display: flex;
          align-items: center;
        }

        .order-cell {
          gap: 10px;
        }

        .order-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .order-icon svg {
          width: 18px;
          height: 18px;
        }

        .order-cell strong,
        .customer-cell strong,
        .driver-cell strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
        }

        .order-cell span,
        .customer-cell span,
        .driver-cell span {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 11px;
        }

        .customer-cell {
          gap: 9px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .route-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 230px;
        }

        .route-cell > div:not(.route-arrow) {
          min-width: 80px;
        }

        .route-label {
          display: block;
          margin-bottom: 3px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .route-cell strong {
          display: block;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }

        .route-arrow {
          color: #2563eb;
          font-size: 18px;
          font-weight: 700;
        }

        .driver-cell {
          gap: 9px;
        }

        .driver-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          color: #64748b;
          flex-shrink: 0;
        }

        .driver-icon svg {
          width: 17px;
          height: 17px;
        }

        .vehicle-cell {
          gap: 8px;
          color: #334155;
          font-weight: 600;
          white-space: nowrap;
        }

        .vehicle-cell svg {
          width: 18px;
          height: 18px;
          color: #2563eb;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .date-cell {
          gap: 7px;
          color: #475569;
          font-size: 12px;
          line-height: 1.4;
          white-space: nowrap;
        }

        .date-cell svg {
          width: 16px;
          height: 16px;
          color: #64748b;
          flex-shrink: 0;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .icon-button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .icon-button svg {
          width: 16px;
          height: 16px;
        }

        .edit-button {
          background: #eff6ff;
          color: #2563eb;
        }

        .edit-button:hover {
          background: #dbeafe;
        }

        .delete-button {
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-button:hover {
          background: #fee2e2;
        }

        .more-button {
          background: #f8fafc;
          color: #64748b;
        }

        .more-button:hover {
          background: #f1f5f9;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          color: #64748b;
          font-size: 12px;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pagination-button {
          width: 34px;
          height: 34px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .pagination-button svg {
          width: 15px;
          height: 15px;
        }

        .pagination-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .pagination-button.active {
          border-color: #2563eb;
          background: #2563eb;
          color: #ffffff;
          font-weight: 700;
        }

        .empty-state {
          padding: 65px 30px;
          text-align: center;
          color: #64748b;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          margin: 0 auto 15px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-icon svg {
          width: 26px;
          height: 26px;
        }

        .empty-state h3 {
          margin: 0 0 6px;
          color: #334155;
          font-size: 17px;
        }

        .empty-state p {
          margin: 0 0 18px;
          font-size: 13px;
        }

        .empty-action {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          background: #2563eb;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }

        .empty-action svg {
          width: 16px;
          height: 16px;
        }

        .loading-spinner {
          width: 34px;
          height: 34px;
          margin: 0 auto 15px;
          border: 3px solid #dbeafe;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: delivery-spin 0.8s linear infinite;
        }

        @keyframes delivery-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          padding: 20px;
          background: rgba(15, 23, 42, 0.58);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delivery-modal {
          width: 100%;
          max-width: 820px;
          max-height: 92vh;
          overflow-y: auto;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 21px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          background: #dbeafe;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-icon svg {
          width: 21px;
          height: 21px;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 21px;
          font-weight: 700;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .modal-close {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          font-size: 23px;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #e2e8f0;
        }

        .delivery-form {
          padding: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px;
        }

        .form-field label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
        }

        .form-field input,
        .form-field select {
          width: 100%;
          height: 44px;
          box-sizing: border-box;
          padding: 0 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          font-size: 13px;
        }

        .form-field input:focus,
        .form-field select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-info {
          display: flex;
          gap: 11px;
          margin-top: 20px;
          padding: 14px 15px;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          background: #eff6ff;
        }

        .info-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
          flex-shrink: 0;
        }

        .info-icon svg {
          width: 20px;
          height: 20px;
        }

        .form-info strong {
          display: block;
          color: #1e3a8a;
          font-size: 13px;
        }

        .form-info p {
          margin: 4px 0 0;
          color: #475569;
          font-size: 12px;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-button,
        .save-button {
          padding: 11px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
        }

        .cancel-button:hover {
          background: #f8fafc;
        }

        .save-button {
          border: none;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .save-button:hover {
          background: #1d4ed8;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 1100px) {
          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filter-bar {
            grid-template-columns: 1fr 1fr;
          }

          .search-wrapper {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 700px) {
          .delivery-page {
            padding: 20px 15px;
          }

          .delivery-header h1 {
            font-size: 29px;
          }

          .delivery-page-icon {
            width: 52px;
            height: 52px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .filter-bar {
            grid-template-columns: 1fr;
          }

          .search-wrapper {
            grid-column: auto;
          }

          .delivery-card-header,
          .table-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-overlay {
            padding: 10px;
          }

          .delivery-modal {
            max-height: 96vh;
          }
        }
      `}</style>
    </div>
  );
}

// ==========================================================
// FORM FIELD
// ==========================================================

type FormFieldProps = {
  label: string;
  name: keyof DeliveryForm;
  value: string;
  placeholder: string;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => void;
};

function FormField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

// ==========================================================
// METRIC CARD
// ==========================================================

type MetricCardProps = {
  title: string;
  value: number;
  subtitle: string;
  variant:
    | "blue"
    | "green"
    | "orange"
    | "purple";
  icon: React.ReactNode;
};

function MetricCard({
  title,
  value,
  subtitle,
  variant,
  icon,
}: MetricCardProps) {
  return (
    <div
      className={`metric-card metric-${variant}`}
    >
      <div className="metric-card-icon">
        {icon}
      </div>

      <p className="metric-label">
        {title}
      </p>

      <h2 className="metric-value">
        {value}
      </h2>

      <span className="metric-subtitle">
        {subtitle}
      </span>
    </div>
  );
}

// ==========================================================
// HELPERS
// ==========================================================

function getInitials(
  value: string
): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function formatDateTimeForInput(
  date: string
): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(
    parsed.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    parsed.getDate()
  ).padStart(2, "0");
  const hours = String(
    parsed.getHours()
  ).padStart(2, "0");
  const minutes = String(
    parsed.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// ==========================================================
// ICONS
// ==========================================================

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 9h4l3 3v5h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M14 13h7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 5v14" />
      <path d="m5 8 3-3 3 3" />
      <path d="M16 19V5" />
      <path d="m13 16 3 3 3-3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
      />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4 3 20h18Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}