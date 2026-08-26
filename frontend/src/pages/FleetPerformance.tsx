import { useEffect, useMemo, useState } from "react";

type FleetPerformanceRecord = {
  id: number;
  vehicle_number: string;
  driver_name: string;
  vehicle_type: string;
  distance_travelled: number;
  fuel_used: number;
  trips_completed: number;
  maintenance_cost: number;
  fuel_efficiency: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type FleetPerformanceForm = {
  vehicle_number: string;
  driver_name: string;
  vehicle_type: string;
  distance_travelled: string;
  fuel_used: string;
  trips_completed: string;
  maintenance_cost: string;
  fuel_efficiency: string;
  status: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const emptyForm: FleetPerformanceForm = {
  vehicle_number: "",
  driver_name: "",
  vehicle_type: "",
  distance_travelled: "",
  fuel_used: "",
  trips_completed: "",
  maintenance_cost: "",
  fuel_efficiency: "",
  status: "Active",
};

export default function FleetPerformance() {
  const [records, setRecords] = useState<FleetPerformanceRecord[]>([]);
  const [form, setForm] =
    useState<FleetPerformanceForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] =
    useState<boolean>(false);

  const fetchFleetPerformance = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/logistics/fleet-performance`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load fleet performance records."
        );
      }

      const data =
        await response.json();

      setRecords(data);
    } catch (err) {
      console.error(
        "Failed to load fleet performance:",
        err
      );

      setError(
        "Unable to load fleet performance data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetPerformance();
  }, []);

  const statistics = useMemo(() => {
    const totalVehicles = records.length;

    const activeVehicles = records.filter(
      (item) =>
        item.status?.toLowerCase() === "active"
    ).length;

    const totalTrips = records.reduce(
      (total, item) =>
        total +
        Number(item.trips_completed || 0),
      0
    );

    const averageFuelEfficiency =
      totalVehicles > 0
        ? records.reduce(
            (total, item) =>
              total +
              Number(
                item.fuel_efficiency || 0
              ),
            0
          ) / totalVehicles
        : 0;

    const totalDistance = records.reduce(
      (total, item) =>
        total +
        Number(item.distance_travelled || 0),
      0
    );

    const totalFuelUsed = records.reduce(
      (total, item) =>
        total +
        Number(item.fuel_used || 0),
      0
    );

    const totalMaintenanceCost =
      records.reduce(
        (total, item) =>
          total +
          Number(
            item.maintenance_cost || 0
          ),
        0
      );

    return {
      totalVehicles,
      activeVehicles,
      totalTrips,
      averageFuelEfficiency,
      totalDistance,
      totalFuelUsed,
      totalMaintenanceCost,
    };
  }, [records]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = (): void => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleNewRecord = (): void => {
    resetForm();
    setShowForm(true);
    setError("");
  };

  const handleEdit = (
    record: FleetPerformanceRecord
  ): void => {
    setEditingId(record.id);

    setForm({
      vehicle_number:
        record.vehicle_number || "",
      driver_name:
        record.driver_name || "",
      vehicle_type:
        record.vehicle_type || "",
      distance_travelled:
        String(
          record.distance_travelled ?? ""
        ),
      fuel_used:
        String(
          record.fuel_used ?? ""
        ),
      trips_completed:
        String(
          record.trips_completed ?? ""
        ),
      maintenance_cost:
        String(
          record.maintenance_cost ?? ""
        ),
      fuel_efficiency:
        String(
          record.fuel_efficiency ?? ""
        ),
      status:
        record.status || "Active",
    });

    setShowForm(true);
    setError("");
  };

  const handleDelete = async (
    id: number
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this fleet performance record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/logistics/fleet-performance/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete fleet performance record."
        );
      }

      await fetchFleetPerformance();

      if (editingId === id) {
        setShowForm(false);
        resetForm();
      }
    } catch (err) {
      console.error(
        "Failed to delete fleet performance:",
        err
      );

      setError(
        "Unable to delete fleet performance record."
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
        vehicle_number:
          form.vehicle_number,
        driver_name:
          form.driver_name,
        vehicle_type:
          form.vehicle_type,
        distance_travelled:
          Number(form.distance_travelled),
        fuel_used:
          Number(form.fuel_used),
        trips_completed:
          Number(form.trips_completed),
        maintenance_cost:
          Number(form.maintenance_cost),
        fuel_efficiency:
          Number(form.fuel_efficiency),
        status:
          form.status,
      };

      const url =
        editingId === null
          ? `${API_BASE_URL}/logistics/fleet-performance`
          : `${API_BASE_URL}/logistics/fleet-performance/${editingId}`;

      const method =
        editingId === null
          ? "POST"
          : "PUT";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to save fleet performance."
        );
      }

      setShowForm(false);
      resetForm();

      await fetchFleetPerformance();
    } catch (err: any) {
      console.error(
        "Failed to save fleet performance:",
        err
      );

      setError(
        err?.message ||
          "Unable to save fleet performance record."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatNumber = (
    value: number,
    decimals = 2
  ): string => {
    return Number(
      value || 0
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits:
          decimals,
        maximumFractionDigits:
          decimals,
      }
    );
  };

  const formatCurrency = (
    value: number
  ): string => {
    return `R ${Number(
      value || 0
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDate = (
    value: string
  ): string => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString();
  };

  const getStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const normalized =
      status?.toLowerCase();

    if (normalized === "active") {
      return {
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (
      normalized === "maintenance"
    ) {
      return {
        background: "#FEF3C7",
        color: "#92400E",
      };
    }

    return {
      background: "#FEE2E2",
      color: "#991B1B",
    };
  };

  const getFuelEfficiencyStyle = (
    value: number
  ): React.CSSProperties => {
    if (value >= 12) {
      return {
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (value >= 8) {
      return {
        background: "#FEF3C7",
        color: "#92400E",
      };
    }

    return {
      background: "#FEE2E2",
      color: "#991B1B",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#F8FAFC",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Fleet Performance
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",
              color: "#64748B",
              fontSize: "15px",
            }}
          >
            Monitor vehicle performance,
            fleet utilization, fuel
            efficiency and operational
            activity.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={
              fetchFleetPerformance
            }
            style={{
              padding:
                "11px 18px",
              borderRadius: "8px",
              border:
                "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            onClick={
              handleNewRecord
            }
            style={{
              padding:
                "11px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 4px 12px rgba(37,99,235,0.25)",
            }}
          >
            + New Fleet Record
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding:
              "14px 18px",
            borderRadius: "10px",
            border:
              "1px solid #FECACA",
            background: "#FEE2E2",
            color: "#991B1B",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#DBEAFE",
            border:
              "1px solid #BFDBFE",
          }}
        >
          <p className="kpi-label blue">
            Total Vehicles
          </p>

          <h2 className="kpi-value">
            {statistics.totalVehicles}
          </h2>

          <span className="kpi-description">
            Fleet records
          </span>
        </div>

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#DCFCE7",
            border:
              "1px solid #BBF7D0",
          }}
        >
          <p className="kpi-label green">
            Active Vehicles
          </p>

          <h2 className="kpi-value">
            {statistics.activeVehicles}
          </h2>

          <span className="kpi-description">
            Currently operational
          </span>
        </div>

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#FEF3C7",
            border:
              "1px solid #FDE68A",
          }}
        >
          <p className="kpi-label amber">
            Total Trips
          </p>

          <h2 className="kpi-value">
            {statistics.totalTrips.toLocaleString()}
          </h2>

          <span className="kpi-description">
            Completed fleet trips
          </span>
        </div>

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#EDE9FE",
            border:
              "1px solid #DDD6FE",
          }}
        >
          <p className="kpi-label purple">
            Avg Fuel Efficiency
          </p>

          <h2 className="kpi-value">
            {statistics.averageFuelEfficiency.toFixed(
              2
            )}
          </h2>

          <span className="kpi-description">
            Fleet average
          </span>
        </div>

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#F0FDFA",
            border:
              "1px solid #99F6E4",
          }}
        >
          <p className="kpi-label teal">
            Distance Travelled
          </p>

          <h2 className="kpi-value">
            {formatNumber(
              statistics.totalDistance
            )}
          </h2>

          <span className="kpi-description">
            Total fleet distance
          </span>
        </div>

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#FCE7F3",
            border:
              "1px solid #FBCFE8",
          }}
        >
          <p className="kpi-label pink">
            Fuel Used
          </p>

          <h2 className="kpi-value">
            {formatNumber(
              statistics.totalFuelUsed
            )}
          </h2>

          <span className="kpi-description">
            Total fuel consumption
          </span>
        </div>
      </div>

      {/* FLEET RECORDS */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 8px 25px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom:
              "1px solid #E2E8F0",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#0F172A",
                fontSize: "20px",
              }}
            >
              Fleet Performance Records
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Live fleet performance data
              from the backend.
            </p>
          </div>

          <span
            style={{
              padding:
                "7px 12px",
              borderRadius:
                "999px",
              background: "#EFF6FF",
              color: "#1D4ED8",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {records.length} Records
          </span>
        </div>

        {loading ? (
          <div
            style={{
              padding: "60px",
              textAlign:
                "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom:
                  "8px",
              }}
            >
              Loading fleet performance...
            </div>

            <div
              style={{
                fontSize: "13px",
              }}
            >
              Connecting to fleet
              performance services.
            </div>
          </div>
        ) : records.length === 0 ? (
          <div
            style={{
              padding: "60px",
              textAlign:
                "center",
              color: "#64748B",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#334155",
                marginBottom:
                  "8px",
              }}
            >
              No fleet records found
            </div>

            <p
              style={{
                margin:
                  "0 0 20px",
              }}
            >
              Create your first fleet
              performance record.
            </p>

            <button
              type="button"
              onClick={
                handleNewRecord
              }
              style={{
                padding:
                  "10px 18px",
                border: "none",
                borderRadius:
                  "8px",
                background:
                  "#2563EB",
                color:
                  "#FFFFFF",
                fontWeight:
                  600,
                cursor:
                  "pointer",
              }}
            >
              + Create Fleet Record
            </button>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth:
                  "1250px",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead
                style={{
                  background:
                    "#1E293B",
                  color:
                    "#FFFFFF",
                }}
              >
                <tr>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Vehicle Type</th>
                  <th>Distance</th>
                  <th>Fuel Used</th>
                  <th>Trips</th>
                  <th>Maintenance</th>
                  <th>Fuel Efficiency</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map(
                  (
                    item
                  ) => (
                    <tr
                      key={
                        item.id
                      }
                      style={{
                        borderBottom:
                          "1px solid #E2E8F0",
                      }}
                    >
                      <td
                        style={{
                          fontWeight:
                            700,
                          color:
                            "#0F172A",
                        }}
                      >
                        {
                          item.vehicle_number
                        }
                      </td>

                      <td>
                        {
                          item.driver_name
                        }
                      </td>

                      <td>
                        {
                          item.vehicle_type
                        }
                      </td>

                      <td>
                        {formatNumber(
                          Number(
                            item.distance_travelled
                          )
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          Number(
                            item.fuel_used
                          )
                        )}
                      </td>

                      <td>
                        {
                          item.trips_completed
                        }
                      </td>

                      <td>
                        {formatCurrency(
                          Number(
                            item.maintenance_cost
                          )
                        )}
                      </td>

                      <td>
                        <span
                          style={{
                            ...getFuelEfficiencyStyle(
                              Number(
                                item.fuel_efficiency
                              )
                            ),
                            display:
                              "inline-block",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          {formatNumber(
                            Number(
                              item.fuel_efficiency
                            )
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            ...getStatusStyle(
                              item.status
                            ),
                            display:
                              "inline-block",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          {
                            item.status
                          }
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          item.created_at
                        )}
                      </td>

                      <td>
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "center",
                            gap:
                              "8px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                            style={{
                              padding:
                                "7px 12px",
                              borderRadius:
                                "7px",
                              border:
                                "1px solid #CBD5E1",
                              background:
                                "#FFFFFF",
                              color:
                                "#334155",
                              fontWeight:
                                600,
                              cursor:
                                "pointer",
                            }}
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
                              padding:
                                "7px 12px",
                              borderRadius:
                                "7px",
                              border:
                                "none",
                              background:
                                "#FEE2E2",
                              color:
                                "#B91C1C",
                              fontWeight:
                                600,
                              cursor:
                                "pointer",
                            }}
                          >
                            Delete
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
      </div>

      {/* CREATE / EDIT MODAL */}

      {showForm && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex: 1000,
            padding: "20px",
            background:
              "rgba(15,23,42,0.58)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth:
                "820px",
              maxHeight:
                "92vh",
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
                  "1px solid #E2E8F0",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color:
                      "#0F172A",
                    fontSize:
                      "22px",
                  }}
                >
                  {editingId !==
                  null
                    ? "Edit Fleet Performance Record"
                    : "New Fleet Performance Record"}
                </h2>

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
                  {editingId !==
                  null
                    ? "Update the vehicle performance information."
                    : "Create a new fleet performance record."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(
                    false
                  );
                  resetForm();
                }}
                style={{
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
                    "#334155",
                  fontSize:
                    "22px",
                  cursor:
                    "pointer",
                }}
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
                  "25px",
              }}
            >
              <div
                className="fleet-form-grid"
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap:
                    "18px",
                }}
              >
                <div>
                  <label>
                    Vehicle Number
                  </label>

                  <input
                    name="vehicle_number"
                    value={
                      form.vehicle_number
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. TRK-001"
                    required
                  />
                </div>

                <div>
                  <label>
                    Driver Name
                  </label>

                  <input
                    name="driver_name"
                    value={
                      form.driver_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Driver name"
                    required
                  />
                </div>

                <div>
                  <label>
                    Vehicle Type
                  </label>

                  <input
                    name="vehicle_type"
                    value={
                      form.vehicle_type
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Truck, Van, Trailer..."
                    required
                  />
                </div>

                <div>
                  <label>
                    Distance Travelled
                  </label>

                  <input
                    name="distance_travelled"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.distance_travelled
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label>
                    Fuel Used
                  </label>

                  <input
                    name="fuel_used"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.fuel_used
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label>
                    Trips Completed
                  </label>

                  <input
                    name="trips_completed"
                    type="number"
                    min="0"
                    value={
                      form.trips_completed
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label>
                    Maintenance Cost
                  </label>

                  <input
                    name="maintenance_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.maintenance_cost
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label>
                    Fuel Efficiency
                  </label>

                  <input
                    name="fuel_efficiency"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.fuel_efficiency
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              {/* FORM ACTIONS */}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap:
                    "12px",
                  marginTop:
                    "25px",
                  paddingTop:
                    "20px",
                  borderTop:
                    "1px solid #E2E8F0",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(
                      false
                    );
                    resetForm();
                  }}
                  style={{
                    padding:
                      "11px 20px",
                    borderRadius:
                      "8px",
                    border:
                      "1px solid #CBD5E1",
                    background:
                      "#FFFFFF",
                    color:
                      "#334155",
                    fontWeight:
                      600,
                    cursor:
                      "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  style={{
                    padding:
                      "11px 22px",
                    borderRadius:
                      "8px",
                    border:
                      "none",
                    background:
                      saving
                        ? "#93C5FD"
                        : "#2563EB",
                    color:
                      "#FFFFFF",
                    fontWeight:
                      600,
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
                    ? "Update Record"
                    : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAGE STYLES */}

      <style>
        {`
          label {
            display: block;
            margin-bottom: 7px;
            color: #334155;
            font-size: 14px;
            font-weight: 600;
          }

          input,
          select {
            width: 100%;
            box-sizing: border-box;
            padding: 11px 13px;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            background: #FFFFFF;
            color: #0F172A;
            font-size: 14px;
            outline: none;
            font-family: inherit;
          }

          input:focus,
          select:focus {
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
          }

          select {
            cursor: pointer;
          }

          th {
            padding: 15px 12px;
            text-align: center;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
          }

          td {
            padding: 15px 12px;
            text-align: center;
            font-size: 14px;
            color: #334155;
            white-space: nowrap;
          }

          tbody tr:hover {
            background: #F8FAFC;
          }

          button {
            transition: all 0.15s ease;
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .kpi-label {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
          }

          .kpi-label.blue {
            color: #1D4ED8;
          }

          .kpi-label.green {
            color: #166534;
          }

          .kpi-label.amber {
            color: #92400E;
          }

          .kpi-label.purple {
            color: #6D28D9;
          }

          .kpi-label.teal {
            color: #0F766E;
          }

          .kpi-label.pink {
            color: #BE185D;
          }

          .kpi-value {
            margin: 10px 0 0;
            color: #0F172A;
            font-size: 30px;
            font-weight: 700;
          }

          .kpi-description {
            display: block;
            margin-top: 5px;
            color: #64748B;
            font-size: 12px;
          }

          @media (max-width: 700px) {
            .fleet-form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}