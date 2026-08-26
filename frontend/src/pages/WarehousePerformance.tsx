import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

interface PerformanceRecord {
  id: number;
  warehouse: string;
  reporting_date: string;
  receiving_orders: number;
  dispatched_orders: number;
  inventory_accuracy: number;
  picking_accuracy: number;
  packing_accuracy: number;
  utilization: number;
  remarks?: string | null;
}

interface PerformanceForm {
  warehouse: string;
  receiving_orders: number;
  dispatched_orders: number;
  inventory_accuracy: number;
  picking_accuracy: number;
  packing_accuracy: number;
  utilization: number;
  remarks: string;
}

const emptyForm: PerformanceForm = {
  warehouse: "",
  receiving_orders: 0,
  dispatched_orders: 0,
  inventory_accuracy: 100,
  picking_accuracy: 100,
  packing_accuracy: 100,
  utilization: 0,
  remarks: "",
};

export default function WarehousePerformance() {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const [formData, setFormData] =
    useState<PerformanceForm>(emptyForm);

  const fetchPerformance = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<PerformanceRecord[]>(
        "/warehouse/performance"
      );

      setRecords(response.data);
    } catch (err) {
      console.error(
        "Failed to load warehouse performance:",
        err
      );

      setError(
        "Unable to load warehouse performance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const resetForm = (): void => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  const closeForm = (): void => {
    setShowForm(false);
    resetForm();
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "receiving_orders" ||
        name === "dispatched_orders" ||
        name === "inventory_accuracy" ||
        name === "picking_accuracy" ||
        name === "packing_accuracy" ||
        name === "utilization"
          ? Number(value)
          : value,
    }));
  };

  const handleNewPerformance = (): void => {
    resetForm();
    setError("");
    setShowForm(true);
  };

  const handleEdit = (
    record: PerformanceRecord
  ): void => {
    setEditingId(record.id);

    setFormData({
      warehouse: record.warehouse || "",
      receiving_orders: Number(
        record.receiving_orders || 0
      ),
      dispatched_orders: Number(
        record.dispatched_orders || 0
      ),
      inventory_accuracy: Number(
        record.inventory_accuracy ?? 100
      ),
      picking_accuracy: Number(
        record.picking_accuracy ?? 100
      ),
      packing_accuracy: Number(
        record.packing_accuracy ?? 100
      ),
      utilization: Number(
        record.utilization ?? 0
      ),
      remarks: record.remarks || "",
    });

    setError("");
    setShowForm(true);
  };

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this warehouse performance record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/warehouse/performance/${id}`
      );

      await fetchPerformance();
    } catch (err) {
      console.error(
        "Failed to delete performance record:",
        err
      );

      setError(
        "Unable to delete the performance record."
      );
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        warehouse: formData.warehouse,
        receiving_orders: Number(
          formData.receiving_orders
        ),
        dispatched_orders: Number(
          formData.dispatched_orders
        ),
        inventory_accuracy: Number(
          formData.inventory_accuracy
        ),
        picking_accuracy: Number(
          formData.picking_accuracy
        ),
        packing_accuracy: Number(
          formData.packing_accuracy
        ),
        utilization: Number(
          formData.utilization
        ),
        remarks: formData.remarks || null,
      };

      if (editingId !== null) {
        await api.put(
          `/warehouse/performance/${editingId}`,
          payload
        );
      } else {
        await api.post(
          "/warehouse/performance",
          payload
        );
      }

      closeForm();
      await fetchPerformance();
    } catch (err: any) {
      console.error(
        "Failed to save performance record:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to save the warehouse performance record."
      );
    } finally {
      setSaving(false);
    }
  };

  const summary = useMemo(() => {
    if (records.length === 0) {
      return {
        totalRecords: 0,
        receivingOrders: 0,
        dispatchedOrders: 0,
        inventoryAccuracy: 0,
        pickingAccuracy: 0,
        packingAccuracy: 0,
        utilization: 0,
      };
    }

    const receivingOrders = records.reduce(
      (total, record) =>
        total +
        Number(record.receiving_orders || 0),
      0
    );

    const dispatchedOrders = records.reduce(
      (total, record) =>
        total +
        Number(record.dispatched_orders || 0),
      0
    );

    const inventoryAccuracy =
      records.reduce(
        (total, record) =>
          total +
          Number(
            record.inventory_accuracy ?? 0
          ),
        0
      ) / records.length;

    const pickingAccuracy =
      records.reduce(
        (total, record) =>
          total +
          Number(
            record.picking_accuracy ?? 0
          ),
        0
      ) / records.length;

    const packingAccuracy =
      records.reduce(
        (total, record) =>
          total +
          Number(
            record.packing_accuracy ?? 0
          ),
        0
      ) / records.length;

    const utilization =
      records.reduce(
        (total, record) =>
          total +
          Number(record.utilization ?? 0),
        0
      ) / records.length;

    return {
      totalRecords: records.length,
      receivingOrders,
      dispatchedOrders,
      inventoryAccuracy,
      pickingAccuracy,
      packingAccuracy,
      utilization,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      const search = searchTerm.toLowerCase().trim();

      if (!search) {
        return true;
      }

      return (
        record.warehouse
          ?.toLowerCase()
          .includes(search) ||
        record.reporting_date
          ?.toLowerCase()
          .includes(search)
      );
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(
        a.reporting_date
      ).getTime();

      const dateB = new Date(
        b.reporting_date
      ).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [records, searchTerm, sortOrder]);

  const formatPercentage = (
    value: number
  ): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (
    value: string
  ): string => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getAccuracyStyle = (
    value: number
  ): React.CSSProperties => {
    if (value >= 99) {
      return {
        background: "#ECFDF3",
        color: "#15803D",
      };
    }

    if (value >= 95) {
      return {
        background: "#FFF7E6",
        color: "#B45309",
      };
    }

    return {
      background: "#FEF2F2",
      color: "#DC2626",
    };
  };

  const getUtilizationStyle = (
    value: number
  ): React.CSSProperties => {
    if (value >= 85) {
      return {
        background: "#ECFDF3",
        color: "#15803D",
      };
    }

    if (value >= 70) {
      return {
        background: "#FFF7E6",
        color: "#B45309",
      };
    }

    return {
      background: "#FEF2F2",
      color: "#DC2626",
    };
  };

  return (
    <div className="performance-page">

      {/* HEADER */}

      <div className="performance-header">
        <div className="performance-title-wrap">

          <div className="performance-title-icon">
            <WarehouseIcon />
          </div>

          <div>
            <h1>
              Warehouse Performance
            </h1>

            <p>
              Monitor warehouse operational performance,
              accuracy and utilization
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleNewPerformance}
          className="add-performance-button"
        >
          <PlusIcon />
          Add Performance
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="performance-error">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      {/* KPI CARDS */}

      <div className="performance-kpis">

        <div className="performance-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon blue">
              <ClipboardIcon />
            </div>

            <span className="kpi-label blue-text">
              Performance Records
            </span>
          </div>

          <div className="kpi-bottom">
            <h2>
              {summary.totalRecords}
            </h2>

            <div className="kpi-mini-line blue-line" />
          </div>

          <p>
            Total warehouse records
          </p>
        </div>

        <div className="performance-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green">
              <ReceivingIcon />
            </div>

            <span className="kpi-label green-text">
              Receiving Orders
            </span>
          </div>

          <div className="kpi-bottom">
            <h2>
              {summary.receivingOrders}
            </h2>

            <div className="kpi-mini-line green-line" />
          </div>

          <p>
            Orders received
          </p>
        </div>

        <div className="performance-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon orange">
              <DispatchIcon />
            </div>

            <span className="kpi-label orange-text">
              Dispatched Orders
            </span>
          </div>

          <div className="kpi-bottom">
            <h2>
              {summary.dispatchedOrders}
            </h2>

            <div className="kpi-mini-line orange-line" />
          </div>

          <p>
            Orders dispatched
          </p>
        </div>

        <div className="performance-kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon purple">
              <AccuracyIcon />
            </div>

            <span className="kpi-label purple-text">
              Inventory Accuracy
            </span>
          </div>

          <div className="kpi-bottom">
            <h2>
              {formatPercentage(
                summary.inventoryAccuracy
              )}
            </h2>

            <div className="kpi-mini-line purple-line" />
          </div>

          <p>
            Average inventory accuracy
          </p>
        </div>

      </div>

      {/* SEARCH / FILTER BAR */}

      <div className="performance-toolbar">

        <div className="performance-search">
          <SearchIcon />

          <input
            type="text"
            placeholder="Search warehouse or reporting date..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="performance-select">
          <FilterIcon />

          <select
            value="all"
            onChange={() => undefined}
          >
            <option value="all">
              All Performance
            </option>
          </select>

          <ChevronDownIcon />
        </div>

        <div className="performance-select">
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
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

        <button
          type="button"
          onClick={fetchPerformance}
          className="refresh-button"
        >
          <RefreshIcon />
          Refresh
        </button>

      </div>

      {/* PERFORMANCE RECORDS */}

      <div className="performance-card">

        <div className="performance-card-header">

          <div className="records-heading">
            <div className="records-heading-icon">
              <ChartIcon />
            </div>

            <div>
              <h2>
                Performance Records
              </h2>

              <p>
                Live warehouse performance data from
                the backend
              </p>
            </div>
          </div>

          <span className="records-count">
            {filteredRecords.length} Records
          </span>

        </div>

        {loading ? (
          <div className="performance-message">
            <div className="loading-spinner" />
            <h3>
              Loading performance records...
            </h3>

            <p>
              Connecting to warehouse performance services.
            </p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="performance-message">

            <div className="empty-icon">
              <ChartIcon />
            </div>

            <h3>
              No performance records found
            </h3>

            <p>
              {searchTerm
                ? "Try adjusting your search."
                : "Create your first warehouse performance record."}
            </p>

            {!searchTerm && (
              <button
                type="button"
                onClick={handleNewPerformance}
                className="empty-create-button"
              >
                <PlusIcon />
                Create Performance Record
              </button>
            )}

          </div>
        ) : (
          <div className="performance-table-wrapper">

            <table className="performance-table">

              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Reporting Date</th>
                  <th>Receiving Orders</th>
                  <th>Dispatched Orders</th>
                  <th>Inventory Accuracy</th>
                  <th>Picking Accuracy</th>
                  <th>Packing Accuracy</th>
                  <th>Utilization</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredRecords.map(
                  (record) => (
                    <tr key={record.id}>

                      <td>
                        <div className="warehouse-cell">
                          <div className="warehouse-avatar">
                            <WarehouseIcon />
                          </div>

                          <div>
                            <strong>
                              {record.warehouse}
                            </strong>

                            <span>
                              WH-{String(record.id).padStart(4, "0")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="date-cell">
                        {formatDate(
                          record.reporting_date
                        )}
                      </td>

                      <td className="number-cell">
                        {record.receiving_orders}
                      </td>

                      <td className="number-cell">
                        {record.dispatched_orders}
                      </td>

                      <td>
                        <span
                          className="performance-badge"
                          style={getAccuracyStyle(
                            Number(
                              record.inventory_accuracy
                            )
                          )}
                        >
                          <span className="badge-dot" />
                          {formatPercentage(
                            Number(
                              record.inventory_accuracy
                            )
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className="performance-badge"
                          style={getAccuracyStyle(
                            Number(
                              record.picking_accuracy
                            )
                          )}
                        >
                          <span className="badge-dot" />
                          {formatPercentage(
                            Number(
                              record.picking_accuracy
                            )
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className="performance-badge"
                          style={getAccuracyStyle(
                            Number(
                              record.packing_accuracy
                            )
                          )}
                        >
                          <span className="badge-dot" />
                          {formatPercentage(
                            Number(
                              record.packing_accuracy
                            )
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className="performance-badge"
                          style={getUtilizationStyle(
                            Number(
                              record.utilization
                            )
                          )}
                        >
                          <span className="badge-dot" />
                          {formatPercentage(
                            Number(
                              record.utilization
                            )
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="record-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(record)
                            }
                            className="icon-action edit"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(record.id)
                            }
                            className="icon-action delete"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>

                          <button
                            type="button"
                            className="icon-action more"
                            title="More"
                          >
                            <MoreIcon />
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
          filteredRecords.length > 0 && (
            <div className="performance-card-footer">

              <span>
                Showing 1 to{" "}
                {filteredRecords.length} of{" "}
                {records.length} performance records
              </span>

              <div className="pagination">
                <button type="button">
                  <ChevronLeftIcon />
                </button>

                <button
                  type="button"
                  className="active-page"
                >
                  1
                </button>

                <button type="button">
                  <ChevronRightIcon />
                </button>
              </div>

            </div>
          )}

      </div>

      {/* MODAL */}

      {showForm && (
        <div className="performance-modal-overlay">

          <div className="performance-modal">

            <div className="modal-header">

              <div className="modal-title-wrap">

                <div className="modal-icon">
                  <ChartIcon />
                </div>

                <div>
                  <h2>
                    {editingId !== null
                      ? "Edit Performance Record"
                      : "Add Performance Record"}
                  </h2>

                  <p>
                    {editingId !== null
                      ? "Update warehouse performance information."
                      : "Record new warehouse performance information."}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="modal-close"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="performance-form"
            >

              <div className="performance-form-grid">

                <div className="form-field">
                  <label>
                    Warehouse
                  </label>

                  <input
                    type="text"
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleInputChange}
                    required
                    placeholder="Main Warehouse"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Receiving Orders
                  </label>

                  <input
                    type="number"
                    name="receiving_orders"
                    min="0"
                    value={
                      formData.receiving_orders
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Dispatched Orders
                  </label>

                  <input
                    type="number"
                    name="dispatched_orders"
                    min="0"
                    value={
                      formData.dispatched_orders
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Inventory Accuracy (%)
                  </label>

                  <input
                    type="number"
                    name="inventory_accuracy"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      formData.inventory_accuracy
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Picking Accuracy (%)
                  </label>

                  <input
                    type="number"
                    name="picking_accuracy"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      formData.picking_accuracy
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Packing Accuracy (%)
                  </label>

                  <input
                    type="number"
                    name="packing_accuracy"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      formData.packing_accuracy
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Warehouse Utilization (%)
                  </label>

                  <input
                    type="number"
                    name="utilization"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      formData.utilization
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

              </div>

              <div className="form-field full-width">
                <label>
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Additional performance notes..."
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  onClick={closeForm}
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
                    : editingId !== null
                    ? "Update Record"
                    : "Create Record"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* STYLES */}

      <style>
        {`
          .performance-page {
            min-height: 100vh;
            padding: 34px;
            background: #f8fafc;
            color: #0f172a;
            box-sizing: border-box;
          }

          .performance-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 28px;
            flex-wrap: wrap;
          }

          .performance-title-wrap {
            display: flex;
            align-items: center;
            gap: 17px;
          }

          .performance-title-icon {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #dbeafe;
            color: #2563eb;
          }

          .performance-title-icon svg {
            width: 31px;
            height: 31px;
          }

          .performance-header h1 {
            margin: 0;
            font-size: 34px;
            line-height: 1.1;
            font-weight: 750;
            letter-spacing: -0.8px;
            color: #0f172a;
          }

          .performance-header p {
            margin: 7px 0 0;
            color: #64748b;
            font-size: 14px;
          }

          .add-performance-button {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            padding: 13px 19px;
            border: none;
            border-radius: 10px;
            background: #2563eb;
            color: white;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 7px 18px rgba(37,99,235,0.22);
            transition: 0.2s ease;
          }

          .add-performance-button:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
          }

          .add-performance-button svg {
            width: 18px;
            height: 18px;
          }

          .performance-error {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 13px 16px;
            margin-bottom: 20px;
            border-radius: 10px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #b91c1c;
            font-size: 14px;
          }

          .performance-error svg {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }

          .performance-kpis {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 28px;
          }

          .performance-kpi-card {
            background: #ffffff;
            border: 1px solid #e5eaf1;
            border-radius: 14px;
            padding: 19px 20px;
            min-height: 132px;
            box-shadow: 0 5px 20px rgba(15,23,42,0.035);
          }

          .kpi-top {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .kpi-icon {
            width: 43px;
            height: 43px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .kpi-icon svg {
            width: 22px;
            height: 22px;
          }

          .kpi-icon.blue {
            background: #eff6ff;
            color: #2563eb;
          }

          .kpi-icon.green {
            background: #ecfdf5;
            color: #059669;
          }

          .kpi-icon.orange {
            background: #fff7ed;
            color: #f59e0b;
          }

          .kpi-icon.purple {
            background: #f5f3ff;
            color: #7c3aed;
          }

          .kpi-label {
            font-size: 13px;
            font-weight: 700;
          }

          .blue-text {
            color: #2563eb;
          }

          .green-text {
            color: #059669;
          }

          .orange-text {
            color: #d97706;
          }

          .purple-text {
            color: #7c3aed;
          }

          .kpi-bottom {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 10px;
            margin-top: 9px;
          }

          .kpi-bottom h2 {
            margin: 0;
            font-size: 29px;
            line-height: 1;
            color: #0f172a;
            font-weight: 750;
          }

          .kpi-mini-line {
            width: 64px;
            height: 25px;
            border-bottom: 3px solid;
            border-radius: 50%;
            transform: skewY(-12deg);
          }

          .blue-line {
            border-color: #3b82f6;
          }

          .green-line {
            border-color: #10b981;
          }

          .orange-line {
            border-color: #f59e0b;
          }

          .purple-line {
            border-color: #8b5cf6;
          }

          .performance-kpi-card > p {
            margin: 10px 0 0;
            color: #64748b;
            font-size: 12px;
          }

          .performance-toolbar {
            display: grid;
            grid-template-columns: minmax(300px, 1fr) 190px 190px auto;
            gap: 12px;
            padding: 13px;
            margin-bottom: 18px;
            background: #ffffff;
            border: 1px solid #e5eaf1;
            border-radius: 13px;
            box-shadow: 0 5px 18px rgba(15,23,42,0.025);
          }

          .performance-search,
          .performance-select {
            height: 46px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 9px;
            background: #ffffff;
            box-sizing: border-box;
          }

          .performance-search {
            padding: 0 14px;
          }

          .performance-search svg,
          .performance-select svg {
            width: 18px;
            height: 18px;
            color: #64748b;
            flex-shrink: 0;
          }

          .performance-search input {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            font-size: 14px;
            color: #0f172a;
          }

          .performance-search input::placeholder {
            color: #94a3b8;
          }

          .performance-select {
            position: relative;
            padding: 0 12px;
          }

          .performance-select select {
            width: 100%;
            border: none;
            outline: none;
            appearance: none;
            background: transparent;
            color: #334155;
            font-size: 14px;
            cursor: pointer;
          }

          .performance-select > svg:last-child {
            width: 15px;
            height: 15px;
          }

          .refresh-button {
            height: 46px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0 16px;
            border: 1px solid #dbe2ea;
            border-radius: 9px;
            background: #ffffff;
            color: #334155;
            font-size: 14px;
            font-weight: 650;
            cursor: pointer;
          }

          .refresh-button:hover {
            background: #f8fafc;
          }

          .refresh-button svg {
            width: 17px;
            height: 17px;
          }

          .performance-card {
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #e5eaf1;
            border-radius: 15px;
            box-shadow: 0 7px 25px rgba(15,23,42,0.045);
          }

          .performance-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 20px 22px;
            border-bottom: 1px solid #edf1f5;
          }

          .records-heading {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .records-heading-icon {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2563eb;
          }

          .records-heading-icon svg {
            width: 23px;
            height: 23px;
          }

          .records-heading h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 750;
            color: #0f172a;
          }

          .records-heading p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #64748b;
          }

          .records-count {
            padding: 7px 12px;
            border-radius: 999px;
            background: #eff6ff;
            color: #2563eb;
            font-size: 12px;
            font-weight: 700;
          }

          .performance-table-wrapper {
            width: 100%;
            overflow-x: auto;
          }

          .performance-table {
            width: 100%;
            min-width: 1180px;
            border-collapse: collapse;
          }

          .performance-table thead {
            background: #f7f9fc;
          }

          .performance-table th {
            padding: 15px 13px;
            text-align: left;
            color: #475569;
            font-size: 12px;
            font-weight: 750;
            white-space: nowrap;
            border-bottom: 1px solid #e9eef4;
          }

          .performance-table th:not(:first-child) {
            text-align: center;
          }

          .performance-table td {
            padding: 16px 13px;
            text-align: center;
            color: #334155;
            font-size: 13px;
            white-space: nowrap;
            border-bottom: 1px solid #edf1f5;
          }

          .performance-table tbody tr {
            transition: 0.15s ease;
          }

          .performance-table tbody tr:hover {
            background: #fafcff;
          }

          .warehouse-cell {
            display: flex;
            align-items: center;
            gap: 11px;
            text-align: left;
          }

          .warehouse-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #dbeafe;
            color: #2563eb;
            flex-shrink: 0;
          }

          .warehouse-avatar svg {
            width: 20px;
            height: 20px;
          }

          .warehouse-cell strong {
            display: block;
            color: #0f172a;
            font-size: 13px;
            font-weight: 750;
          }

          .warehouse-cell span {
            display: inline-block;
            margin-top: 4px;
            padding: 3px 7px;
            border-radius: 5px;
            background: #eff6ff;
            color: #2563eb;
            font-size: 10px;
            font-weight: 750;
          }

          .date-cell {
            color: #64748b !important;
          }

          .number-cell {
            font-weight: 700;
            color: #334155 !important;
          }

          .performance-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 750;
          }

          .badge-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
          }

          .record-actions {
            display: flex;
            align-items: center;
            justify-content: center;
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
            transition: 0.15s ease;
          }

          .icon-action svg {
            width: 17px;
            height: 17px;
          }

          .icon-action.edit {
            border: 1px solid #dbeafe;
            background: #eff6ff;
            color: #2563eb;
          }

          .icon-action.edit:hover {
            background: #dbeafe;
          }

          .icon-action.delete {
            border: 1px solid #fee2e2;
            background: #fef2f2;
            color: #dc2626;
          }

          .icon-action.delete:hover {
            background: #fee2e2;
          }

          .icon-action.more {
            border: none;
            background: transparent;
            color: #64748b;
          }

          .icon-action.more:hover {
            background: #f1f5f9;
          }

          .performance-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 16px 22px;
            color: #64748b;
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
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #ffffff;
            color: #64748b;
            cursor: pointer;
          }

          .pagination button svg {
            width: 16px;
            height: 16px;
          }

          .pagination .active-page {
            background: #2563eb;
            border-color: #2563eb;
            color: #ffffff;
            font-weight: 700;
          }

          .performance-message {
            padding: 70px 25px;
            text-align: center;
          }

          .loading-spinner {
            width: 32px;
            height: 32px;
            margin: 0 auto 15px;
            border: 3px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: performance-spin 0.8s linear infinite;
          }

          @keyframes performance-spin {
            to {
              transform: rotate(360deg);
            }
          }

          .empty-icon {
            width: 54px;
            height: 54px;
            margin: 0 auto 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #eff6ff;
            color: #2563eb;
          }

          .empty-icon svg {
            width: 26px;
            height: 26px;
          }

          .performance-message h3 {
            margin: 0;
            color: #334155;
            font-size: 17px;
          }

          .performance-message p {
            margin: 7px 0 20px;
            color: #94a3b8;
            font-size: 13px;
          }

          .empty-create-button {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            background: #2563eb;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }

          .empty-create-button svg {
            width: 16px;
            height: 16px;
          }

          .performance-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(15,23,42,0.58);
          }

          .performance-modal {
            width: 100%;
            max-width: 780px;
            max-height: 92vh;
            overflow-y: auto;
            background: #ffffff;
            border-radius: 17px;
            box-shadow: 0 25px 70px rgba(0,0,0,0.25);
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 21px 24px;
            border-bottom: 1px solid #edf1f5;
          }

          .modal-title-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .modal-icon {
            width: 43px;
            height: 43px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            background: #eff6ff;
            color: #2563eb;
          }

          .modal-icon svg {
            width: 21px;
            height: 21px;
          }

          .modal-header h2 {
            margin: 0;
            color: #0f172a;
            font-size: 20px;
          }

          .modal-header p {
            margin: 5px 0 0;
            color: #64748b;
            font-size: 12px;
          }

          .modal-close {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            background: #f1f5f9;
            color: #475569;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
          }

          .modal-close:hover {
            background: #e2e8f0;
          }

          .performance-form {
            padding: 24px;
          }

          .performance-form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
            font-weight: 700;
          }

          .form-field input,
          .form-field textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 11px 13px;
            border: 1px solid #d5dce5;
            border-radius: 9px;
            background: #ffffff;
            color: #0f172a;
            font-family: inherit;
            font-size: 13px;
            outline: none;
          }

          .form-field input:focus,
          .form-field textarea:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
          }

          .form-field textarea {
            resize: vertical;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #edf1f5;
          }

          .cancel-button,
          .save-button {
            padding: 11px 19px;
            border-radius: 9px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }

          .cancel-button {
            border: 1px solid #d5dce5;
            background: #ffffff;
            color: #334155;
          }

          .save-button {
            border: none;
            background: #2563eb;
            color: #ffffff;
            box-shadow: 0 5px 14px rgba(37,99,235,0.20);
          }

          .save-button:disabled {
            background: #93c5fd;
            cursor: not-allowed;
          }

          @media (max-width: 1100px) {
            .performance-kpis {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .performance-toolbar {
              grid-template-columns: 1fr 1fr;
            }

            .performance-search {
              grid-column: 1 / -1;
            }
          }

          @media (max-width: 700px) {
            .performance-page {
              padding: 20px;
            }

            .performance-header h1 {
              font-size: 27px;
            }

            .performance-kpis {
              grid-template-columns: 1fr;
            }

            .performance-toolbar {
              grid-template-columns: 1fr;
            }

            .performance-search {
              grid-column: auto;
            }

            .performance-form-grid {
              grid-template-columns: 1fr;
            }

            .performance-card-header,
            .performance-card-footer {
              align-items: flex-start;
              flex-direction: column;
            }

            .add-performance-button {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================
   ICONS
========================= */

function WarehouseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M8 20v-5h8v5" />
      <path d="M8 11h2" />
      <path d="M14 11h2" />
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
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function ReceivingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="1.7" />
      <circle cx="18" cy="19" r="1.7" />
      <path d="M8 4v6" />
      <path d="M5.5 7.5 8 10l2.5-2.5" />
    </svg>
  );
}

function DispatchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="1.7" />
      <circle cx="18" cy="19" r="1.7" />
      <path d="M8 10V4" />
      <path d="m5.5 6.5 2.5-2.5 2.5 2.5" />
    </svg>
  );
}

function AccuracyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8 12 2.5 2.5L16.5 9" />
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
    >
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4.2 4.2" />
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
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
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

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8 8 0 0 0-14.8-4" />
      <path d="M5 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.8 4" />
      <path d="M19 20v-4h-4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
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
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="m14.5 7.5 2 2" />
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
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 14h8l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
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
      <path d="M12 3 2.8 20h18.4L12 3z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}