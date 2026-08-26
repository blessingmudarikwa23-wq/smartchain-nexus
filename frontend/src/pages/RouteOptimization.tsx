import { useEffect, useMemo, useState } from "react";

type RouteOptimizationRecord = {
  id: number;
  route_name: string;
  origin: string;
  destination: string;
  distance_km: number;
  estimated_time_hours: number;
  fuel_estimate: number;
  optimized: boolean;
  created_at: string;
  updated_at: string;
};

type RouteForm = {
  route_name: string;
  origin: string;
  destination: string;
  distance_km: string;
  estimated_time_hours: string;
  fuel_estimate: string;
  optimized: boolean;
};

const API_URL =
  "http://127.0.0.1:8000/logistics/route-optimization";

const emptyForm: RouteForm = {
  route_name: "",
  origin: "",
  destination: "",
  distance_km: "",
  estimated_time_hours: "",
  fuel_estimate: "",
  optimized: false,
};

export default function RouteOptimization() {
  const [routes, setRoutes] = useState<RouteOptimizationRecord[]>([]);
  const [form, setForm] = useState<RouteForm>({
    ...emptyForm,
  });

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"all" | "optimized" | "not_optimized">(
      "all"
    );

  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest"
  >("newest");

  const loadRoutes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load route optimization records"
        );
      }

      const data = await response.json();

      setRoutes(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load route optimization records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const statistics = useMemo(() => {
    const totalRoutes = routes.length;

    const optimizedRoutes = routes.filter(
      (route) => route.optimized
    ).length;

    const averageDistance =
      totalRoutes > 0
        ? routes.reduce(
            (total, route) =>
              total + Number(route.distance_km || 0),
            0
          ) / totalRoutes
        : 0;

    const averageFuel =
      totalRoutes > 0
        ? routes.reduce(
            (total, route) =>
              total + Number(route.fuel_estimate || 0),
            0
          ) / totalRoutes
        : 0;

    return {
      totalRoutes,
      optimizedRoutes,
      averageDistance,
      averageFuel,
    };
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    let result = [...routes];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (route) =>
          route.route_name
            .toLowerCase()
            .includes(search) ||
          route.origin
            .toLowerCase()
            .includes(search) ||
          route.destination
            .toLowerCase()
            .includes(search)
      );
    }

    if (statusFilter === "optimized") {
      result = result.filter(
        (route) => route.optimized
      );
    }

    if (statusFilter === "not_optimized") {
      result = result.filter(
        (route) => !route.optimized
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(
        a.created_at
      ).getTime();

      const dateB = new Date(
        b.created_at
      ).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [
    routes,
    searchTerm,
    statusFilter,
    sortOrder,
  ]);

  const handleChange = (
    field: keyof RouteForm,
    value: string | boolean
  ): void => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = (): void => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
  };

  const handleNewRoute = (): void => {
    resetForm();
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleEdit = (
    route: RouteOptimizationRecord
  ): void => {
    setEditingId(route.id);

    setForm({
      route_name: route.route_name,
      origin: route.origin,
      destination: route.destination,
      distance_km: String(
        route.distance_km
      ),
      estimated_time_hours: String(
        route.estimated_time_hours
      ),
      fuel_estimate: String(
        route.fuel_estimate
      ),
      optimized: route.optimized,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  const closeForm = (): void => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        route_name: form.route_name,
        origin: form.origin,
        destination: form.destination,
        distance_km: Number(
          form.distance_km
        ),
        estimated_time_hours: Number(
          form.estimated_time_hours
        ),
        fuel_estimate: Number(
          form.fuel_estimate
        ),
        optimized: form.optimized,
      };

      const url =
        editingId === null
          ? API_URL
          : `${API_URL}/${editingId}`;

      const method =
        editingId === null
          ? "POST"
          : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          responseData?.detail ||
            `Failed to ${
              editingId === null
                ? "create"
                : "update"
            } route`
        );
      }

      setMessage(
        editingId === null
          ? "Route created successfully."
          : "Route updated successfully."
      );

      setShowForm(false);
      resetForm();

      await loadRoutes();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the route"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this route?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const responseData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          responseData?.detail ||
            "Failed to delete route"
        );
      }

      setMessage(
        "Route deleted successfully."
      );

      if (editingId === id) {
        closeForm();
      }

      await loadRoutes();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete route"
      );
    }
  };

  const formatNumber = (
    value: number,
    decimals = 1
  ): string => {
    return Number(value || 0).toFixed(
      decimals
    );
  };

  return (
    <div className="route-page">
      <div className="route-header">
        <div className="route-title-section">
          <div className="route-icon">
            <span>↗</span>
          </div>

          <div>
            <h1>Route Optimization</h1>

            <p>
              Optimize delivery routes and monitor
              distance, fuel usage and efficiency.
            </p>
          </div>
        </div>

        <div className="route-header-actions">
          <button
            type="button"
            className="refresh-button"
            onClick={loadRoutes}
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            className="add-route-button"
            onClick={handleNewRoute}
          >
            <span>＋</span>
            Add Route
          </button>
        </div>
      </div>

      {message && (
        <div className="success-message">
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>!</span>
          {error}
        </div>
      )}

      <div className="route-kpi-grid">
        <div className="route-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon blue">
              ↗
            </div>

            <div>
              <p>Total Routes</p>

              <h2>
                {statistics.totalRoutes}
              </h2>
            </div>
          </div>

          <div className="kpi-footer">
            <span>
              All routes in system
            </span>

            <div className="mini-chart blue-chart">
              ╱╲╱
            </div>
          </div>
        </div>

        <div className="route-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green">
              ✓
            </div>

            <div>
              <p>Optimized Routes</p>

              <h2>
                {statistics.optimizedRoutes}
              </h2>
            </div>
          </div>

          <div className="kpi-footer">
            <span>
              Currently optimized
            </span>

            <div className="mini-chart green-chart">
              ╱╲╱
            </div>
          </div>
        </div>

        <div className="route-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon orange">
              ↔
            </div>

            <div>
              <p>Average Distance</p>

              <h2>
                {formatNumber(
                  statistics.averageDistance
                )}

                <small> km</small>
              </h2>
            </div>
          </div>

          <div className="kpi-footer">
            <span>
              Average route distance
            </span>

            <div className="mini-chart orange-chart">
              ╱╲╱
            </div>
          </div>
        </div>

        <div className="route-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon purple">
              ⛽
            </div>

            <div>
              <p>Average Fuel</p>

              <h2>
                {formatNumber(
                  statistics.averageFuel
                )}

                <small> L</small>
              </h2>
            </div>
          </div>

          <div className="kpi-footer">
            <span>
              Average estimated fuel
            </span>

            <div className="mini-chart purple-chart">
              ╱╲╱
            </div>
          </div>
        </div>
      </div>

      <div className="route-toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search routes by name, origin or destination..."
          />
        </div>

        <div className="filter-box">
          <span>⚑</span>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "all"
                  | "optimized"
                  | "not_optimized"
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="optimized">
              Optimized
            </option>

            <option value="not_optimized">
              Not Optimized
            </option>
          </select>
        </div>

        <div className="filter-box">
          <span>⇅</span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value as
                  | "newest"
                  | "oldest"
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
        </div>
      </div>

      <div className="route-table-card">
        <div className="route-table-header">
          <div className="table-title">
            <div className="table-title-icon">
              ↗
            </div>

            <div>
              <h2>
                Route Optimization Records
              </h2>

              <p>
                Manage and monitor logistics
                route performance.
              </p>
            </div>
          </div>

          <span className="route-count">
            {filteredRoutes.length} Routes
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner">
              ⟳
            </div>

            <h3>
              Loading route records...
            </h3>

            <p>
              Connecting to route optimization
              services.
            </p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              ↗
            </div>

            <h3>
              No route records found
            </h3>

            <p>
              Try adjusting your search or
              create a new route.
            </p>

            <button
              type="button"
              onClick={handleNewRoute}
              className="empty-add-button"
            >
              ＋ Create Route
            </button>
          </div>
        ) : (
          <div className="route-table-wrapper">
            <table className="route-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Distance</th>
                  <th>Time</th>
                  <th>Fuel</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRoutes.map(
                  (
                    route
                  ) => (
                    <tr
                      key={route.id}
                    >
                      <td>
                        <div className="route-name-cell">
                          <div className="route-avatar">
                            {route.route_name
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {
                                route.route_name
                              }
                            </strong>

                            <span>
                              ROUTE-
                              {String(
                                route.id
                              ).padStart(
                                4,
                                "0"
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="location-text">
                          {route.origin}
                        </span>
                      </td>

                      <td>
                        <span className="location-text">
                          {route.destination}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatNumber(
                            route.distance_km
                          )}
                        </strong>{" "}
                        <span className="unit">
                          km
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatNumber(
                            route.estimated_time_hours
                          )}
                        </strong>{" "}
                        <span className="unit">
                          hrs
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatNumber(
                            route.fuel_estimate
                          )}
                        </strong>{" "}
                        <span className="unit">
                          L
                        </span>
                      </td>

                      <td>
                        {route.optimized ? (
                          <span className="status-pill optimized">
                            <span>
                              ●
                            </span>
                            Optimized
                          </span>
                        ) : (
                          <span className="status-pill pending">
                            <span>
                              ●
                            </span>
                            Not Optimized
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="icon-button edit"
                            onClick={() =>
                              handleEdit(
                                route
                              )
                            }
                            title="Edit route"
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="icon-button delete"
                            onClick={() =>
                              handleDelete(
                                route.id
                              )
                            }
                            title="Delete route"
                          >
                            🗑
                          </button>

                          <button
                            type="button"
                            className="icon-button more"
                            title="More options"
                          >
                            ⋮
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

        {!loading &&
          filteredRoutes.length > 0 && (
            <div className="table-footer">
              <span>
                Showing{" "}
                <strong>
                  1
                </strong>{" "}
                to{" "}
                <strong>
                  {filteredRoutes.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {filteredRoutes.length}
                </strong>{" "}
                routes
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
          )}
      </div>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <div className="route-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Route"
                    : "Add Route"}
                </h2>

                <p>
                  {editingId !== null
                    ? "Update route optimization information."
                    : "Create a new route optimization record."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="route-form"
            >
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Route Name
                  </label>

                  <input
                    type="text"
                    value={
                      form.route_name
                    }
                    onChange={(event) =>
                      handleChange(
                        "route_name",
                        event.target.value
                      )
                    }
                    placeholder="Johannesburg to Pretoria"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Origin
                  </label>

                  <input
                    type="text"
                    value={
                      form.origin
                    }
                    onChange={(event) =>
                      handleChange(
                        "origin",
                        event.target.value
                      )
                    }
                    placeholder="Johannesburg"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Destination
                  </label>

                  <input
                    type="text"
                    value={
                      form.destination
                    }
                    onChange={(event) =>
                      handleChange(
                        "destination",
                        event.target.value
                      )
                    }
                    placeholder="Pretoria"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Distance (km)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      form.distance_km
                    }
                    onChange={(event) =>
                      handleChange(
                        "distance_km",
                        event.target.value
                      )
                    }
                    placeholder="58.50"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Estimated Time (hours)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      form.estimated_time_hours
                    }
                    onChange={(event) =>
                      handleChange(
                        "estimated_time_hours",
                        event.target.value
                      )
                    }
                    placeholder="1.50"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Fuel Estimate (L)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      form.fuel_estimate
                    }
                    onChange={(event) =>
                      handleChange(
                        "fuel_estimate",
                        event.target.value
                      )
                    }
                    placeholder="8.50"
                    required
                  />
                </div>
              </div>

              <div
                className={`optimization-option ${
                  form.optimized
                    ? "selected"
                    : ""
                }`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={
                      form.optimized
                    }
                    onChange={(event) =>
                      handleChange(
                        "optimized",
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    <strong>
                      Mark route as optimized
                    </strong>

                    <small>
                      Indicates that this route
                      has been optimized for
                      logistics efficiency.
                    </small>
                  </span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
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
                    ? "Update Route"
                    : "Create Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .route-page {
          min-height: 100vh;
          padding: 30px;
          background: #f8fafc;
          color: #0f172a;
        }

        .route-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }

        .route-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .route-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dbeafe;
          color: #2563eb;
          font-size: 30px;
          font-weight: 700;
        }

        .route-title-section h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 750;
          letter-spacing: -0.7px;
          color: #0f172a;
        }

        .route-title-section p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .route-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .refresh-button,
        .add-route-button {
          border-radius: 9px;
          padding: 11px 18px;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.15s ease;
        }

        .refresh-button {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
        }

        .add-route-button {
          border: none;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 5px 15px rgba(37, 99, 235, 0.22);
        }

        .add-route-button span {
          margin-right: 5px;
          font-size: 17px;
        }

        .refresh-button:hover,
        .add-route-button:hover {
          transform: translateY(-1px);
        }

        .success-message,
        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 550;
        }

        .success-message {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .error-message {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .route-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }

        .route-kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.045);
        }

        .kpi-top {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .kpi-icon {
          width: 47px;
          height: 47px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
        }

        .kpi-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .kpi-icon.green {
          background: #ecfdf5;
          color: #16a34a;
        }

        .kpi-icon.orange {
          background: #fff7ed;
          color: #f59e0b;
        }

        .kpi-icon.purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .kpi-top p {
          margin: 0 0 4px;
          color: #64748b;
          font-size: 13px;
          font-weight: 550;
        }

        .kpi-top h2 {
          margin: 0;
          color: #0f172a;
          font-size: 29px;
          line-height: 1;
          font-weight: 750;
        }

        .kpi-top h2 small {
          color: #64748b;
          font-size: 13px;
          font-weight: 550;
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 17px;
          color: #64748b;
          font-size: 11px;
        }

        .mini-chart {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -4px;
        }

        .blue-chart {
          color: #2563eb;
        }

        .green-chart {
          color: #16a34a;
        }

        .orange-chart {
          color: #f59e0b;
        }

        .purple-chart {
          color: #7c3aed;
        }

        .route-toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 190px 190px;
          gap: 12px;
          padding: 13px;
          margin-bottom: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 5px 18px rgba(15, 23, 42, 0.035);
        }

        .search-box,
        .filter-box {
          height: 45px;
          display: flex;
          align-items: center;
          border: 1px solid #dbe3ed;
          border-radius: 9px;
          background: #ffffff;
        }

        .search-box {
          padding: 0 14px;
          gap: 10px;
        }

        .search-box > span,
        .filter-box > span {
          color: #64748b;
          font-size: 19px;
        }

        .search-box input,
        .filter-box select {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #334155;
          font-family: inherit;
          font-size: 13px;
        }

        .filter-box {
          padding: 0 12px;
          gap: 8px;
        }

        .filter-box select {
          cursor: pointer;
        }

        .route-table-card {
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.055);
        }

        .route-table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 19px 22px;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-title-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 20px;
          font-weight: 700;
        }

        .table-title h2 {
          margin: 0;
          font-size: 18px;
          color: #0f172a;
          font-weight: 700;
        }

        .table-title p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .route-count {
          padding: 7px 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 650;
        }

        .route-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .route-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
        }

        .route-table thead {
          background: #f8fafc;
        }

        .route-table th {
          padding: 14px 15px;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
          border-bottom: 1px solid #e2e8f0;
        }

        .route-table td {
          padding: 15px;
          color: #334155;
          font-size: 13px;
          border-bottom: 1px solid #eef2f7;
          white-space: nowrap;
        }

        .route-table tbody tr:hover {
          background: #f8fbff;
        }

        .route-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .route-avatar {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #dbeafe;
          color: #2563eb;
          font-weight: 750;
          font-size: 15px;
        }

        .route-name-cell strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
        }

        .route-name-cell span {
          display: inline-block;
          margin-top: 4px;
          padding: 3px 6px;
          border-radius: 5px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 9px;
          font-weight: 700;
        }

        .location-text {
          color: #475569;
        }

        .unit {
          color: #94a3b8;
          font-size: 11px;
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

        .status-pill.optimized {
          background: #ecfdf5;
          color: #15803d;
        }

        .status-pill.pending {
          background: #f1f5f9;
          color: #64748b;
        }

        .status-pill.optimized span {
          color: #16a34a;
        }

        .status-pill.pending span {
          color: #94a3b8;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .icon-button {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          transition: 0.15s ease;
        }

        .icon-button:hover {
          transform: translateY(-1px);
        }

        .icon-button.edit {
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-button.delete {
          border: 1px solid #fee2e2;
          background: #fef2f2;
          color: #dc2626;
        }

        .icon-button.more {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
        }

        .table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 20px;
          color: #64748b;
          font-size: 12px;
        }

        .pagination {
          display: flex;
          gap: 6px;
        }

        .pagination button {
          width: 34px;
          height: 34px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .pagination .active-page {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          font-weight: 700;
        }

        .empty-state {
          padding: 70px 30px;
          text-align: center;
          color: #64748b;
        }

        .empty-icon,
        .loading-spinner {
          width: 55px;
          height: 55px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          font-size: 24px;
        }

        .empty-state h3 {
          margin: 0 0 7px;
          color: #334155;
          font-size: 17px;
        }

        .empty-state p {
          margin: 0 0 20px;
          font-size: 13px;
        }

        .empty-add-button {
          border: none;
          border-radius: 8px;
          padding: 10px 17px;
          background: #2563eb;
          color: #ffffff;
          font-weight: 650;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(3px);
        }

        .route-modal {
          width: 100%;
          max-width: 760px;
          max-height: 92vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 25px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 21px;
          font-weight: 750;
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

        .route-form {
          padding: 25px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .form-field label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 13px;
          font-weight: 650;
        }

        .form-field input {
          width: 100%;
          height: 44px;
          padding: 0 13px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          font-size: 13px;
        }

        .form-field input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .optimization-option {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
        }

        .optimization-option.selected {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .optimization-option label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 0;
          cursor: pointer;
        }

        .optimization-option input {
          width: 17px;
          height: 17px;
          margin-top: 2px;
          accent-color: #2563eb;
        }

        .optimization-option strong {
          display: block;
          color: #334155;
          font-size: 13px;
        }

        .optimization-option small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-button,
        .save-button {
          padding: 11px 20px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
        }

        .save-button {
          border: none;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .save-button:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        @media (max-width: 1100px) {
          .route-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .route-toolbar {
            grid-template-columns: 1fr 1fr;
          }

          .search-box {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 700px) {
          .route-page {
            padding: 18px;
          }

          .route-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .route-header-actions {
            width: 100%;
          }

          .refresh-button,
          .add-route-button {
            flex: 1;
          }

          .route-kpi-grid {
            grid-template-columns: 1fr;
          }

          .route-toolbar {
            grid-template-columns: 1fr;
          }

          .search-box {
            grid-column: auto;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .route-title-section h1 {
            font-size: 27px;
          }

          .route-table-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .table-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}