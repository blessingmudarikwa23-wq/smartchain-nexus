import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

interface PackingRecord {
  id: number;
  packing_number: string;
  order_number: string;
  packer: string;
  warehouse: string;
  total_items: number;
  packed_quantity: number;
  package_type: string;
  status: string;
  remarks?: string | null;
}

interface PackingFormData {
  packing_number: string;
  order_number: string;
  packer: string;
  warehouse: string;
  total_items: number;
  packed_quantity: number;
  package_type: string;
  status: string;
  remarks: string;
}

const emptyForm: PackingFormData = {
  packing_number: "",
  order_number: "",
  packer: "",
  warehouse: "",
  total_items: 0,
  packed_quantity: 0,
  package_type: "",
  status: "Packed",
  remarks: "",
};

/* -------------------------------------------------------------------------- */
/* ICONS */
/* -------------------------------------------------------------------------- */

const PackageIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const BoxIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m21 8-9-5-9 5 9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 6 9 17l-5-5" />
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
    <path d="m20 20-4-4" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />
  </svg>
);

const SortIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 6v12" />
    <path d="m5 9 3-3 3 3" />
    <path d="M16 18V6" />
    <path d="m13 15 3 3 3-3" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
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
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
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
);

const MoreIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 11a8.1 8.1 0 0 0-15.5-3" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 3" />
    <path d="M20 20v-4h-4" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* SPARKLINE */
/* -------------------------------------------------------------------------- */

const Sparkline = ({ type }: { type: "blue" | "green" | "orange" | "purple" }) => {
  const stroke =
    type === "blue"
      ? "#2563EB"
      : type === "green"
      ? "#16A34A"
      : type === "orange"
      ? "#F59E0B"
      : "#7C3AED";

  return (
    <svg
      width="70"
      height="35"
      viewBox="0 0 70 35"
      fill="none"
      className="sparkline"
    >
      <path
        d="M2 29C10 28 10 22 17 23C23 24 25 16 32 18C39 20 42 14 47 13C54 12 54 19 60 10C63 6 66 8 68 3"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default function Packing() {
  const [packages, setPackages] = useState<PackingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [formData, setFormData] =
    useState<PackingFormData>(emptyForm);

  const fetchPacking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/warehouse/packing");

      setPackages(response.data);
    } catch (err) {
      console.error("Error loading packing records:", err);
      setError("Unable to load packing records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacking();
  }, []);

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "total_items" ||
        name === "packed_quantity"
          ? Number(value)
          : value,
    }));
  };

  const handleNewPacking = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (record: PackingRecord) => {
    setEditingId(record.id);

    setFormData({
      packing_number: record.packing_number || "",
      order_number: record.order_number || "",
      packer: record.packer || "",
      warehouse: record.warehouse || "",
      total_items: record.total_items || 0,
      packed_quantity: record.packed_quantity || 0,
      package_type: record.package_type || "",
      status: record.status || "Packed",
      remarks: record.remarks || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this packing record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/warehouse/packing/${id}`);

      await fetchPacking();
    } catch (err) {
      console.error("Error deleting packing record:", err);
      setError("Unable to delete the packing record.");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        total_items: Number(formData.total_items),
        packed_quantity: Number(formData.packed_quantity),
      };

      if (editingId !== null) {
        await api.put(
          `/warehouse/packing/${editingId}`,
          payload
        );
      } else {
        await api.post("/warehouse/packing", payload);
      }

      setShowForm(false);
      resetForm();

      await fetchPacking();
    } catch (err: any) {
      console.error("Error saving packing record:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to save the packing record."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* KPI CALCULATIONS */
  /* ------------------------------------------------------------------------ */

  const totalPackages = packages.length;

  const totalItems = packages.reduce(
    (total, record) =>
      total + Number(record.total_items || 0),
    0
  );

  const packedQuantity = packages.reduce(
    (total, record) =>
      total + Number(record.packed_quantity || 0),
    0
  );

  const packedOrders = packages.filter(
    (record) =>
      record.status?.toLowerCase() === "packed"
  ).length;

  const packingOrders = packages.filter(
    (record) =>
      record.status?.toLowerCase() === "packing"
  ).length;

  const pendingPackages = packages.filter(
    (record) =>
      record.status?.toLowerCase() === "pending"
  ).length;

  const completionRate =
    totalPackages > 0
      ? Math.round(
          (packedOrders / totalPackages) * 100
        )
      : 0;

  /* ------------------------------------------------------------------------ */
  /* FILTERING + SORTING */
  /* ------------------------------------------------------------------------ */

  const filteredPackages = useMemo(() => {
    const filtered = packages.filter((record) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        record.packing_number
          ?.toLowerCase()
          .includes(search) ||
        record.order_number
          ?.toLowerCase()
          .includes(search) ||
        record.packer
          ?.toLowerCase()
          .includes(search) ||
        record.warehouse
          ?.toLowerCase()
          .includes(search) ||
        record.package_type
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All Status" ||
        record.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "Packing Number") {
        return a.packing_number.localeCompare(
          b.packing_number
        );
      }

      if (sortOrder === "Oldest First") {
        return a.id - b.id;
      }

      return b.id - a.id;
    });
  }, [
    packages,
    searchTerm,
    statusFilter,
    sortOrder,
  ]);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "packed":
        return {
          background: "#E9F9F0",
          color: "#129447",
          dot: "#16A34A",
        };

      case "packing":
        return {
          background: "#FFF5DD",
          color: "#B77900",
          dot: "#F59E0B",
        };

      case "pending":
        return {
          background: "#EAF2FF",
          color: "#2563EB",
          dot: "#2563EB",
        };

      default:
        return {
          background: "#F1F5F9",
          color: "#475569",
          dot: "#64748B",
        };
    }
  };

  return (
    <>
      <div className="packing-page">

        {/* ------------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------------ */}

        <div className="packing-header">
          <div className="page-title-section">

            <div className="page-title-icon">
              <PackageIcon />
            </div>

            <div>
              <h1>Warehouse Packing</h1>

              <p>
                Manage and monitor warehouse packing
                operations and fulfilment.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleNewPacking}
            className="primary-button"
          >
            <PlusIcon />
            New Packing
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ERROR */}
        {/* ------------------------------------------------------------------ */}

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* KPI CARDS */}
        {/* ------------------------------------------------------------------ */}

        <div className="kpi-grid">

          <div className="dashboard-kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon blue">
                <PackageIcon />
              </div>

              <Sparkline type="blue" />
            </div>

            <p>Packages Today</p>

            <h2>{totalPackages}</h2>

            <span>
              All packing records
            </span>
          </div>

          <div className="dashboard-kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon green">
                <BoxIcon />
              </div>

              <Sparkline type="green" />
            </div>

            <p>Active Packing</p>

            <h2>{packingOrders}</h2>

            <span>
              Currently being packed
            </span>
          </div>

          <div className="dashboard-kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon orange">
                <ClockIcon />
              </div>

              <Sparkline type="orange" />
            </div>

            <p>Total Items</p>

            <h2>{totalItems}</h2>

            <span>
              Items across all packages
            </span>
          </div>

          <div className="dashboard-kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon purple">
                <CheckIcon />
              </div>

              <Sparkline type="purple" />
            </div>

            <p>Completion Rate</p>

            <h2>{completionRate}%</h2>

            <span>
              Successfully packed
            </span>
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECONDARY SUMMARY */}
        {/* ------------------------------------------------------------------ */}

        <div className="secondary-summary">

          <div className="summary-item">
            <span>Pending Packages</span>
            <strong>{pendingPackages}</strong>
          </div>

          <div className="summary-item">
            <span>Packed Quantity</span>
            <strong>{packedQuantity}</strong>
          </div>

          <div className="summary-item">
            <span>Completed Packages</span>
            <strong>{packedOrders}</strong>
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SEARCH / FILTER */}
        {/* ------------------------------------------------------------------ */}

        <div className="filter-bar">

          <div className="search-box">
            <SearchIcon />

            <input
              type="text"
              placeholder="Search packing records by number, order, packer or warehouse..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="filter-select">
            <FilterIcon />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option>All Status</option>
              <option>Packed</option>
              <option>Packing</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="filter-select">
            <SortIcon />

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Packing Number</option>
            </select>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={fetchPacking}
            title="Refresh"
          >
            <RefreshIcon />
          </button>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PACKING LIST */}
        {/* ------------------------------------------------------------------ */}

        <div className="packing-card">

          <div className="packing-card-header">

            <div className="section-title">

              <div className="section-title-icon">
                <PackageIcon />
              </div>

              <div>
                <h2>Packing List</h2>

                <p>
                  Live warehouse packing records
                </p>
              </div>

            </div>

            <div className="record-count">
              {filteredPackages.length} records
            </div>

          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p>
                Loading packing records...
              </p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <PackageIcon />
              </div>

              <h3>
                No packing records found
              </h3>

              <p>
                Try adjusting your search or filters,
                or create a new packing record.
              </p>

              <button
                type="button"
                onClick={handleNewPacking}
                className="primary-button small"
              >
                <PlusIcon />
                New Packing
              </button>
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="packing-table">

                <thead>
                  <tr>
                    <th>Packing</th>
                    <th>Sales Order</th>
                    <th>Packer</th>
                    <th>Warehouse</th>
                    <th>Items</th>
                    <th>Packed Qty</th>
                    <th>Package Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredPackages.map((record) => {
                    const statusStyle =
                      getStatusStyle(record.status);

                    return (
                      <tr key={record.id}>

                        <td>
                          <div className="record-identity">

                            <div className="record-avatar">
                              {record.packing_number
                                ?.charAt(0)
                                .toUpperCase() || "P"}
                            </div>

                            <div>
                              <strong>
                                {record.packing_number}
                              </strong>

                              <span>
                                PKG-{String(record.id).padStart(4, "0")}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="order-number">
                            {record.order_number}
                          </span>
                        </td>

                        <td>
                          <div className="person-cell">
                            <div className="person-avatar">
                              {record.packer
                                ?.charAt(0)
                                .toUpperCase() || "P"}
                            </div>

                            <span>
                              {record.packer}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="warehouse-cell">
                            <span className="location-dot">
                              ●
                            </span>

                            {record.warehouse}
                          </div>
                        </td>

                        <td>
                          <strong className="quantity">
                            {record.total_items}
                          </strong>
                        </td>

                        <td>
                          <strong className="quantity">
                            {record.packed_quantity}
                          </strong>
                        </td>

                        <td>
                          <span className="package-badge">
                            {record.package_type ||
                              "—"}
                          </span>
                        </td>

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
                                  statusStyle.dot,
                              }}
                            />

                            {record.status}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">

                            <button
                              type="button"
                              className="icon-action edit"
                              onClick={() =>
                                handleEdit(record)
                              }
                              title="Edit packing"
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              className="icon-action delete"
                              onClick={() =>
                                handleDelete(record.id)
                              }
                              title="Delete packing"
                            >
                              <TrashIcon />
                            </button>

                            <button
                              type="button"
                              className="icon-action more"
                              title="More actions"
                            >
                              <MoreIcon />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PAGINATION */}
          {/* ---------------------------------------------------------------- */}

          {!loading &&
            filteredPackages.length > 0 && (
              <div className="pagination-footer">

                <span>
                  Showing 1 to{" "}
                  {filteredPackages.length} of{" "}
                  {filteredPackages.length} packing
                  records
                </span>

                <div className="pagination-buttons">

                  <button
                    type="button"
                    disabled
                    className="pagination-button"
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
                    className="pagination-button"
                  >
                    ›
                  </button>

                </div>

              </div>
            )}

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CREATE / EDIT MODAL */}
        {/* ------------------------------------------------------------------ */}

        {showForm && (
          <div className="modal-overlay">

            <div className="packing-modal">

              <div className="modal-header">

                <div className="modal-title">

                  <div className="modal-icon">
                    <PackageIcon />
                  </div>

                  <div>
                    <h2>
                      {editingId !== null
                        ? "Edit Packing"
                        : "Add Packing"}
                    </h2>

                    <p>
                      {editingId !== null
                        ? "Update the packing record details."
                        : "Create a new warehouse packing record."}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="packing-form"
              >

                <div className="form-grid">

                  <div className="form-field">
                    <label>Packing Number</label>

                    <input
                      name="packing_number"
                      value={
                        formData.packing_number
                      }
                      onChange={handleInputChange}
                      required
                      placeholder="PACK-1001"
                    />
                  </div>

                  <div className="form-field">
                    <label>Order Number</label>

                    <input
                      name="order_number"
                      value={
                        formData.order_number
                      }
                      onChange={handleInputChange}
                      required
                      placeholder="SO-1001"
                    />
                  </div>

                  <div className="form-field">
                    <label>Packer</label>

                    <input
                      name="packer"
                      value={formData.packer}
                      onChange={handleInputChange}
                      required
                      placeholder="Packer name"
                    />
                  </div>

                  <div className="form-field">
                    <label>Warehouse</label>

                    <input
                      name="warehouse"
                      value={
                        formData.warehouse
                      }
                      onChange={handleInputChange}
                      required
                      placeholder="Main Warehouse"
                    />
                  </div>

                  <div className="form-field">
                    <label>Total Items</label>

                    <input
                      type="number"
                      min="0"
                      name="total_items"
                      value={
                        formData.total_items
                      }
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Packed Quantity</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="packed_quantity"
                      value={
                        formData.packed_quantity
                      }
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Package Type</label>

                    <select
                      name="package_type"
                      value={
                        formData.package_type
                      }
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        Select package type
                      </option>

                      <option value="Box">
                        Box
                      </option>

                      <option value="Carton">
                        Carton
                      </option>

                      <option value="Pallet">
                        Pallet
                      </option>

                      <option value="Crate">
                        Crate
                      </option>

                      <option value="Envelope">
                        Envelope
                      </option>

                      <option value="Bag">
                        Bag
                      </option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Status</label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Packed">
                        Packed
                      </option>

                      <option value="Packing">
                        Packing
                      </option>

                      <option value="Pending">
                        Pending
                      </option>
                    </select>
                  </div>

                </div>

                <div className="form-field remarks-field">
                  <label>Remarks</label>

                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Additional packing notes..."
                  />
                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="primary-button"
                  >
                    {saving
                      ? "Saving..."
                      : editingId !== null
                      ? "Update Packing"
                      : "Create Packing"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>

      {/* -------------------------------------------------------------------- */}
      {/* PAGE STYLES */}
      {/* -------------------------------------------------------------------- */}

      <style>
        {`

          * {
            box-sizing: border-box;
          }

          .packing-page {
            min-height: 100vh;
            background: #F8FAFC;
            padding: 34px 38px;
            color: #0F172A;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          /* HEADER */

          .packing-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 25px;
            margin-bottom: 30px;
          }

          .page-title-section {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .page-title-icon {
            width: 62px;
            height: 62px;
            border-radius: 50%;
            background: #E9F0FF;
            color: #2563EB;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .page-title-icon svg {
            width: 31px;
            height: 31px;
          }

          .page-title-section h1 {
            margin: 0;
            font-size: 35px;
            line-height: 1.1;
            font-weight: 750;
            letter-spacing: -0.8px;
            color: #10203B;
          }

          .page-title-section p {
            margin: 8px 0 0;
            font-size: 14px;
            color: #64748B;
          }

          .primary-button {
            min-height: 46px;
            padding: 0 20px;
            border: none;
            border-radius: 10px;
            background: #2563EB;
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            box-shadow:
              0 5px 14px rgba(37, 99, 235, 0.22);
            transition:
              transform 0.15s ease,
              background 0.15s ease;
          }

          .primary-button:hover {
            background: #1D4ED8;
            transform: translateY(-1px);
          }

          .primary-button.small {
            min-height: 42px;
            margin-top: 12px;
          }

          /* ERROR */

          .error-alert {
            background: #FFF1F2;
            border: 1px solid #FECDD3;
            color: #BE123C;
            border-radius: 10px;
            padding: 13px 16px;
            margin-bottom: 22px;
            font-size: 14px;
            font-weight: 600;
          }

          /* KPI */

          .kpi-grid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 20px;
          }

          .dashboard-kpi-card {
            background: #FFFFFF;
            border: 1px solid #E7EDF5;
            border-radius: 15px;
            padding: 20px 20px 19px;
            min-height: 150px;
            box-shadow:
              0 5px 18px rgba(15, 23, 42, 0.035);
          }

          .kpi-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 11px;
          }

          .kpi-icon {
            width: 45px;
            height: 45px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .kpi-icon.blue {
            background: #EAF2FF;
            color: #2563EB;
          }

          .kpi-icon.green {
            background: #E8F9F0;
            color: #16A34A;
          }

          .kpi-icon.orange {
            background: #FFF4DF;
            color: #F59E0B;
          }

          .kpi-icon.purple {
            background: #F1EAFE;
            color: #7C3AED;
          }

          .dashboard-kpi-card p {
            margin: 0 0 4px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }

          .dashboard-kpi-card h2 {
            margin: 0;
            font-size: 29px;
            line-height: 1.1;
            color: #0F172A;
            font-weight: 750;
          }

          .dashboard-kpi-card > span {
            display: block;
            margin-top: 8px;
            font-size: 12px;
            color: #94A3B8;
          }

          .sparkline {
            margin-top: 5px;
          }

          /* SECONDARY SUMMARY */

          .secondary-summary {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 20px;
          }

          .summary-item {
            background: #FFFFFF;
            border: 1px solid #E7EDF5;
            border-radius: 12px;
            padding: 15px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .summary-item span {
            font-size: 13px;
            color: #64748B;
            font-weight: 600;
          }

          .summary-item strong {
            font-size: 20px;
            color: #0F172A;
          }

          /* FILTER BAR */

          .filter-bar {
            background: #FFFFFF;
            border: 1px solid #E7EDF5;
            border-radius: 13px;
            padding: 12px;
            display: grid;
            grid-template-columns: 1fr 185px 185px 48px;
            gap: 10px;
            margin-bottom: 20px;
            box-shadow:
              0 5px 18px rgba(15, 23, 42, 0.025);
          }

          .search-box,
          .filter-select {
            height: 46px;
            border: 1px solid #E2E8F0;
            border-radius: 9px;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 13px;
          }

          .search-box {
            color: #94A3B8;
          }

          .search-box input {
            border: none;
            outline: none;
            width: 100%;
            background: transparent;
            font-size: 13px;
            color: #334155;
          }

          .search-box input::placeholder {
            color: #94A3B8;
          }

          .filter-select {
            color: #64748B;
          }

          .filter-select select {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            font-size: 13px;
            color: #334155;
            cursor: pointer;
          }

          .refresh-button {
            height: 46px;
            width: 46px;
            border: 1px solid #E2E8F0;
            border-radius: 9px;
            background: white;
            color: #64748B;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .refresh-button:hover {
            color: #2563EB;
            background: #F8FAFF;
          }

          /* TABLE CARD */

          .packing-card {
            background: #FFFFFF;
            border: 1px solid #E7EDF5;
            border-radius: 15px;
            overflow: hidden;
            box-shadow:
              0 7px 25px rgba(15, 23, 42, 0.04);
          }

          .packing-card-header {
            min-height: 78px;
            padding: 18px 21px;
            border-bottom: 1px solid #EDF1F6;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .section-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .section-title-icon {
            color: #2563EB;
            display: flex;
            align-items: center;
          }

          .section-title h2 {
            margin: 0;
            font-size: 17px;
            color: #17233B;
            font-weight: 750;
          }

          .section-title p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #94A3B8;
          }

          .record-count {
            padding: 6px 10px;
            border-radius: 7px;
            background: #F1F5F9;
            color: #64748B;
            font-size: 12px;
            font-weight: 600;
          }

          /* TABLE */

          .table-wrapper {
            overflow-x: auto;
          }

          .packing-table {
            width: 100%;
            min-width: 1050px;
            border-collapse: collapse;
          }

          .packing-table thead {
            background: #F7F9FC;
          }

          .packing-table th {
            padding: 14px 16px;
            text-align: left;
            color: #64748B;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            white-space: nowrap;
            border-bottom: 1px solid #E8EDF4;
          }

          .packing-table td {
            padding: 17px 16px;
            color: #334155;
            font-size: 13px;
            border-bottom: 1px solid #EEF2F6;
            vertical-align: middle;
            white-space: nowrap;
          }

          .packing-table tbody tr:hover {
            background: #FBFDFF;
          }

          .packing-table tbody tr:last-child td {
            border-bottom: none;
          }

          /* RECORD IDENTITY */

          .record-identity {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .record-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #EAF2FF;
            color: #2563EB;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 750;
            font-size: 14px;
          }

          .record-identity strong {
            display: block;
            color: #17233B;
            font-size: 13px;
            font-weight: 750;
          }

          .record-identity span {
            display: inline-block;
            margin-top: 4px;
            padding: 3px 7px;
            border-radius: 5px;
            background: #EDF3FF;
            color: #2563EB;
            font-size: 10px;
            font-weight: 700;
          }

          .order-number {
            color: #334155;
            font-weight: 600;
          }

          /* PERSON */

          .person-cell {
            display: flex;
            align-items: center;
            gap: 9px;
          }

          .person-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #F1EAFE;
            color: #7C3AED;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
          }

          /* WAREHOUSE */

          .warehouse-cell {
            display: flex;
            align-items: center;
            gap: 7px;
            color: #475569;
          }

          .location-dot {
            color: #64748B;
            font-size: 10px;
          }

          .quantity {
            color: #17233B;
            font-weight: 700;
          }

          .package-badge {
            display: inline-flex;
            padding: 5px 9px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            color: #475569;
            font-size: 11px;
            font-weight: 600;
          }

          /* STATUS */

          .status-badge {
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
          }

          /* ACTIONS */

          .action-buttons {
            display: flex;
            align-items: center;
            gap: 7px;
          }

          .icon-action {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            display: flex;
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

          .icon-action.edit {
            background: #EEF4FF;
            color: #2563EB;
            border: 1px solid #DCE8FF;
          }

          .icon-action.delete {
            background: #FFF0F1;
            color: #DC2626;
            border: 1px solid #FFE0E3;
          }

          .icon-action.more {
            background: transparent;
            color: #64748B;
            border: 1px solid transparent;
          }

          .icon-action.more:hover {
            background: #F8FAFC;
          }

          /* PAGINATION */

          .pagination-footer {
            min-height: 67px;
            padding: 13px 21px;
            border-top: 1px solid #EEF2F6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
          }

          .pagination-footer > span {
            color: #64748B;
            font-size: 12px;
          }

          .pagination-buttons {
            display: flex;
            gap: 7px;
          }

          .pagination-button {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
            color: #64748B;
            font-weight: 600;
            cursor: pointer;
          }

          .pagination-button.active {
            background: #2563EB;
            color: #FFFFFF;
            border-color: #2563EB;
          }

          .pagination-button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
          }

          /* EMPTY */

          .empty-state {
            min-height: 330px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px;
          }

          .empty-icon {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: #EEF4FF;
            color: #2563EB;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-state h3 {
            margin: 15px 0 5px;
            font-size: 16px;
            color: #17233B;
          }

          .empty-state p {
            margin: 0;
            color: #94A3B8;
            font-size: 13px;
          }

          .loading-spinner {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 3px solid #E2E8F0;
            border-top-color: #2563EB;
            animation: packingSpin 0.8s linear infinite;
          }

          @keyframes packingSpin {
            to {
              transform: rotate(360deg);
            }
          }

          /* MODAL */

          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.48);
            backdrop-filter: blur(3px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 1000;
          }

          .packing-modal {
            width: 100%;
            max-width: 760px;
            max-height: 90vh;
            overflow-y: auto;
            background: #FFFFFF;
            border-radius: 17px;
            box-shadow:
              0 25px 70px rgba(15, 23, 42, 0.22);
          }

          .modal-header {
            padding: 21px 24px;
            border-bottom: 1px solid #E8EDF4;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .modal-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background: #EEF4FF;
            color: #2563EB;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-title h2 {
            margin: 0;
            color: #17233B;
            font-size: 19px;
          }

          .modal-title p {
            margin: 4px 0 0;
            color: #94A3B8;
            font-size: 12px;
          }

          .modal-close {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 50%;
            background: #F1F5F9;
            color: #64748B;
            font-size: 21px;
            cursor: pointer;
          }

          .modal-close:hover {
            background: #E2E8F0;
          }

          .packing-form {
            padding: 24px;
          }

          .form-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .form-field label {
            display: block;
            margin-bottom: 7px;
            color: #334155;
            font-size: 12px;
            font-weight: 700;
          }

          .form-field input,
          .form-field select,
          .form-field textarea {
            width: 100%;
            padding: 11px 12px;
            border-radius: 8px;
            border: 1px solid #D9E1EB;
            background: #FFFFFF;
            color: #17233B;
            outline: none;
            font-size: 13px;
            font-family: inherit;
          }

          .form-field textarea {
            resize: vertical;
          }

          .form-field input:focus,
          .form-field select:focus,
          .form-field textarea:focus {
            border-color: #2563EB;
            box-shadow:
              0 0 0 3px rgba(37, 99, 235, 0.10);
          }

          .remarks-field {
            margin-top: 18px;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #EEF2F6;
          }

          .cancel-button {
            min-height: 44px;
            padding: 0 19px;
            border-radius: 9px;
            border: 1px solid #D9E1EB;
            background: #FFFFFF;
            color: #475569;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }

          .cancel-button:hover {
            background: #F8FAFC;
          }

          .primary-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          /* RESPONSIVE */

          @media (max-width: 1150px) {
            .kpi-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

            .filter-bar {
              grid-template-columns:
                1fr 180px 180px;
            }

            .refresh-button {
              display: none;
            }
          }

          @media (max-width: 800px) {
            .packing-page {
              padding: 24px 18px;
            }

            .packing-header {
              align-items: flex-start;
            }

            .page-title-section h1 {
              font-size: 29px;
            }

            .secondary-summary {
              grid-template-columns: 1fr;
            }

            .filter-bar {
              grid-template-columns: 1fr;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .packing-header {
              flex-direction: column;
            }

            .packing-header .primary-button {
              width: 100%;
            }

            .kpi-grid {
              grid-template-columns: 1fr;
            }

            .page-title-icon {
              width: 52px;
              height: 52px;
            }

            .page-title-section {
              align-items: flex-start;
            }

            .pagination-footer {
              align-items: flex-start;
              flex-direction: column;
            }

            .modal-overlay {
              padding: 10px;
            }

            .packing-form {
              padding: 18px;
            }
          }

        `}
      </style>
    </>
  );
}