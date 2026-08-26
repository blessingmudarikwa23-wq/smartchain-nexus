import { useEffect, useMemo, useState } from "react";

interface FuelAnalysis {
  id: number;
  vehicle_number: string;
  driver_name: string;
  fuel_type: string;
  fuel_purchased: number;
  fuel_cost: number;
  distance_travelled: number;
  fuel_efficiency: number;
  created_at: string;
  updated_at: string;
}

interface FuelAnalysisForm {
  vehicle_number: string;
  driver_name: string;
  fuel_type: string;
  fuel_purchased: string;
  fuel_cost: string;
  distance_travelled: string;
  fuel_efficiency: string;
}

type SortOption =
  | "newest"
  | "oldest"
  | "vehicle"
  | "fuel_cost"
  | "efficiency";

const API_URL =
  "http://127.0.0.1:8000/logistics/fuel-analysis";

const emptyForm: FuelAnalysisForm = {
  vehicle_number: "",
  driver_name: "",
  fuel_type: "Diesel",
  fuel_purchased: "",
  fuel_cost: "",
  distance_travelled: "",
  fuel_efficiency: "",
};

export default function FuelAnalysis() {
  const [records, setRecords] = useState<FuelAnalysis[]>([]);
  const [form, setForm] =
    useState<FuelAnalysisForm>({ ...emptyForm });

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [saving, setSaving] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [success, setSuccess] =
    useState<string>("");

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [fuelTypeFilter, setFuelTypeFilter] =
    useState<string>("All Fuel Types");

  const [sortOption, setSortOption] =
    useState<SortOption>("newest");

  // ==========================================================
  // FETCH RECORDS
  // ==========================================================

  const fetchFuelAnalysis = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to load fuel analysis records."
        );
      }

      const data: FuelAnalysis[] =
        await response.json();

      setRecords(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load fuel analysis records. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelAnalysis();
  }, []);

  // ==========================================================
  // FORM HELPERS
  // ==========================================================

  const handleInputChange = (
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

  const calculateEfficiency = (): void => {
    const fuelPurchased = Number(
      form.fuel_purchased
    );

    const distanceTravelled = Number(
      form.distance_travelled
    );

    if (
      fuelPurchased <= 0 ||
      distanceTravelled <= 0
    ) {
      setForm((previous) => ({
        ...previous,
        fuel_efficiency: "",
      }));

      return;
    }

    const efficiency =
      distanceTravelled / fuelPurchased;

    setForm((previous) => ({
      ...previous,
      fuel_efficiency:
        efficiency.toFixed(2),
    }));
  };

  const resetForm = (): void => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = (): void => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (
    record: FuelAnalysis
  ): void => {
    setEditingId(record.id);

    setForm({
      vehicle_number:
        record.vehicle_number,
      driver_name:
        record.driver_name,
      fuel_type:
        record.fuel_type,
      fuel_purchased:
        String(record.fuel_purchased),
      fuel_cost:
        String(record.fuel_cost),
      distance_travelled:
        String(record.distance_travelled),
      fuel_efficiency:
        String(record.fuel_efficiency),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.vehicle_number.trim()) {
        throw new Error(
          "Vehicle number is required."
        );
      }

      if (!form.driver_name.trim()) {
        throw new Error(
          "Driver name is required."
        );
      }

      const fuelPurchased = Number(
        form.fuel_purchased
      );

      const fuelCost = Number(
        form.fuel_cost
      );

      const distanceTravelled = Number(
        form.distance_travelled
      );

      let fuelEfficiency = Number(
        form.fuel_efficiency
      );

      if (fuelPurchased < 0) {
        throw new Error(
          "Fuel purchased cannot be negative."
        );
      }

      if (fuelCost < 0) {
        throw new Error(
          "Fuel cost cannot be negative."
        );
      }

      if (distanceTravelled < 0) {
        throw new Error(
          "Distance travelled cannot be negative."
        );
      }

      if (
        fuelPurchased > 0 &&
        distanceTravelled > 0
      ) {
        fuelEfficiency =
          distanceTravelled /
          fuelPurchased;
      }

      const payload = {
        vehicle_number:
          form.vehicle_number.trim(),

        driver_name:
          form.driver_name.trim(),

        fuel_type:
          form.fuel_type,

        fuel_purchased:
          fuelPurchased,

        fuel_cost:
          fuelCost,

        distance_travelled:
          distanceTravelled,

        fuel_efficiency:
          Number(
            fuelEfficiency.toFixed(2)
          ),
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
        body: JSON.stringify(
          payload
        ),
      });

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${
              editingId === null
                ? "create"
                : "update"
            } fuel analysis record.`
        );
      }

      setSuccess(
        editingId === null
          ? "Fuel analysis record created successfully."
          : "Fuel analysis record updated successfully."
      );

      resetForm();

      await fetchFuelAnalysis();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the fuel analysis record."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    id: number,
    vehicleNumber: string
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete the fuel analysis record for ${vehicleNumber}?`
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
        const errorData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete fuel analysis record."
        );
      }

      setSuccess(
        "Fuel analysis record deleted successfully."
      );

      await fetchFuelAnalysis();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete fuel analysis record."
      );
    }
  };

  // ==========================================================
  // FILTERED / SORTED RECORDS
  // ==========================================================

  const filteredRecords = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    const filtered =
      records.filter((record) => {
        const matchesSearch =
          !search ||
          record.vehicle_number
            .toLowerCase()
            .includes(search) ||
          record.driver_name
            .toLowerCase()
            .includes(search) ||
          record.fuel_type
            .toLowerCase()
            .includes(search);

        const matchesFuelType =
          fuelTypeFilter ===
            "All Fuel Types" ||
          record.fuel_type ===
            fuelTypeFilter;

        return (
          matchesSearch &&
          matchesFuelType
        );
      });

    return [...filtered].sort(
      (a, b) => {
        switch (sortOption) {
          case "oldest":
            return (
              new Date(
                a.created_at
              ).getTime() -
              new Date(
                b.created_at
              ).getTime()
            );

          case "vehicle":
            return a.vehicle_number.localeCompare(
              b.vehicle_number
            );

          case "fuel_cost":
            return (
              b.fuel_cost -
              a.fuel_cost
            );

          case "efficiency":
            return (
              b.fuel_efficiency -
              a.fuel_efficiency
            );

          case "newest":
          default:
            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );
        }
      }
    );
  }, [
    records,
    searchTerm,
    fuelTypeFilter,
    sortOption,
  ]);

  // ==========================================================
  // METRICS
  // ==========================================================

  const metrics = useMemo(() => {
    const totalFuel = records.reduce(
      (total, record) =>
        total +
        Number(
          record.fuel_purchased || 0
        ),
      0
    );

    const totalCost = records.reduce(
      (total, record) =>
        total +
        Number(
          record.fuel_cost || 0
        ),
      0
    );

    const averageEfficiency =
      records.length > 0
        ? records.reduce(
            (total, record) =>
              total +
              Number(
                record.fuel_efficiency ||
                  0
              ),
            0
          ) / records.length
        : 0;

    const totalDistance =
      records.reduce(
        (total, record) =>
          total +
          Number(
            record.distance_travelled ||
              0
          ),
        0
      );

    return {
      totalRecords:
        records.length,

      totalFuel,

      totalCost,

      averageEfficiency,

      totalDistance,
    };
  }, [records]);

  // ==========================================================
  // FORMATTERS
  // ==========================================================

  const formatNumber = (
    value: number,
    decimals = 2
  ): string => {
    return Number(
      value || 0
    ).toLocaleString(
      "en-ZA",
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
    return `R ${formatNumber(
      value,
      2
    )}`;
  };

  const getFuelTypeStyle = (
    fuelType: string
  ): React.CSSProperties => {
    const normalized =
      fuelType.toLowerCase();

    if (normalized === "diesel") {
      return {
        background:
          "#DBEAFE",
        color:
          "#1D4ED8",
      };
    }

    if (normalized === "petrol") {
      return {
        background:
          "#FEF3C7",
        color:
          "#92400E",
      };
    }

    if (normalized === "electric") {
      return {
        background:
          "#DCFCE7",
        color:
          "#166534",
      };
    }

    if (normalized === "hybrid") {
      return {
        background:
          "#EDE9FE",
        color:
          "#6D28D9",
      };
    }

    return {
      background:
        "#F1F5F9",
      color:
        "#475569",
    };
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",

        padding:
          "30px",

        background:
          "#F8FAFC",

        boxSizing:
          "border-box",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap:
            "20px",

          marginBottom:
            "30px",

          flexWrap:
            "wrap",
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "18px",
          }}
        >
          <div
            style={{
              width:
                "62px",

              height:
                "62px",

              borderRadius:
                "50%",

              background:
                "#FEF3C7",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "28px",

              boxShadow:
                "0 6px 18px rgba(245,158,11,0.15)",
            }}
          >
            ⛽
          </div>

          <div>
            <h1
              style={{
                margin:
                  0,

                fontSize:
                  "36px",

                fontWeight:
                  700,

                color:
                  "#0F172A",

                letterSpacing:
                  "-0.6px",
              }}
            >
              Fuel Analysis
            </h1>

            <p
              style={{
                margin:
                  "8px 0 0",

                color:
                  "#64748B",

                fontSize:
                  "15px",
              }}
            >
              Monitor fuel consumption,
              costs and vehicle efficiency
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            openCreateForm
          }
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "9px",

            padding:
              "13px 20px",

            border:
              "none",

            borderRadius:
              "9px",

            background:
              "#2563EB",

            color:
              "#FFFFFF",

            fontWeight:
              600,

            fontSize:
              "14px",

            cursor:
              "pointer",

            boxShadow:
              "0 5px 14px rgba(37,99,235,0.25)",
          }}
        >
          <span
            style={{
              fontSize:
                "18px",
            }}
          >
            ⊕
          </span>

          Add Fuel Record
        </button>
      </div>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {success && (
        <div
          style={{
            marginBottom:
              "20px",

            padding:
              "14px 18px",

            borderRadius:
              "10px",

            border:
              "1px solid #BBF7D0",

            background:
              "#F0FDF4",

            color:
              "#166534",

            fontSize:
              "14px",

            fontWeight:
              500,
          }}
        >
          ✓ {success}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom:
              "20px",

            padding:
              "14px 18px",

            borderRadius:
              "10px",

            border:
              "1px solid #FECACA",

            background:
              "#FEF2F2",

            color:
              "#991B1B",

            fontSize:
              "14px",

            fontWeight:
              500,
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap:
            "18px",

          marginBottom:
            "28px",
        }}
      >
        <MetricCard
          icon="⛽"
          title="Total Fuel Used"
          value={`${formatNumber(
            metrics.totalFuel
          )} L`}
          subtitle="Fuel purchased across vehicles"
          background="#DBEAFE"
          iconBackground="#EFF6FF"
          color="#2563EB"
        />

        <MetricCard
          icon="R"
          title="Total Fuel Cost"
          value={formatCurrency(
            metrics.totalCost
          )}
          subtitle="Total recorded fuel spending"
          background="#DCFCE7"
          iconBackground="#F0FDF4"
          color="#16A34A"
        />

        <MetricCard
          icon="↗"
          title="Average Efficiency"
          value={`${formatNumber(
            metrics.averageEfficiency
          )} km/L`}
          subtitle="Average vehicle efficiency"
          background="#FEF3C7"
          iconBackground="#FFFBEB"
          color="#D97706"
        />

        <MetricCard
          icon="◉"
          title="Total Distance"
          value={`${formatNumber(
            metrics.totalDistance
          )} km`}
          subtitle={`${metrics.totalRecords} fuel records`}
          background="#EDE9FE"
          iconBackground="#F5F3FF"
          color="#7C3AED"
        />
      </div>

      {/* ======================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div
        style={{
          background:
            "#FFFFFF",

          borderRadius:
            "14px",

          padding:
            "14px",

          marginBottom:
            "18px",

          boxShadow:
            "0 5px 18px rgba(15,23,42,0.05)",

          display:
            "grid",

          gridTemplateColumns:
            "minmax(260px, 1fr) 190px 190px",

          gap:
            "12px",
        }}
        className="fuel-filter-bar"
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

              left:
                "14px",

              top:
                "50%",

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
            type="text"
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search vehicle, driver or fuel type..."
            style={{
              width:
                "100%",

              boxSizing:
                "border-box",

              height:
                "46px",

              padding:
                "0 14px 0 42px",

              border:
                "1px solid #E2E8F0",

              borderRadius:
                "9px",

              outline:
                "none",

              fontSize:
                "14px",

              color:
                "#0F172A",

              background:
                "#FFFFFF",
            }}
          />
        </div>

        <select
          value={
            fuelTypeFilter
          }
          onChange={(
            event
          ) =>
            setFuelTypeFilter(
              event.target.value
            )
          }
          style={{
            height:
              "46px",

            padding:
              "0 12px",

            border:
              "1px solid #E2E8F0",

            borderRadius:
              "9px",

            background:
              "#FFFFFF",

            color:
              "#334155",

            fontSize:
              "14px",

            outline:
              "none",

            cursor:
              "pointer",
          }}
        >
          <option>
            All Fuel Types
          </option>

          <option value="Diesel">
            Diesel
          </option>

          <option value="Petrol">
            Petrol
          </option>

          <option value="Electric">
            Electric
          </option>

          <option value="Hybrid">
            Hybrid
          </option>
        </select>

        <select
          value={
            sortOption
          }
          onChange={(
            event
          ) =>
            setSortOption(
              event.target.value as SortOption
            )
          }
          style={{
            height:
              "46px",

            padding:
              "0 12px",

            border:
              "1px solid #E2E8F0",

            borderRadius:
              "9px",

            background:
              "#FFFFFF",

            color:
              "#334155",

            fontSize:
              "14px",

            outline:
              "none",

            cursor:
              "pointer",
          }}
        >
          <option value="newest">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>

          <option value="vehicle">
            Vehicle A-Z
          </option>

          <option value="fuel_cost">
            Highest Fuel Cost
          </option>

          <option value="efficiency">
            Highest Efficiency
          </option>
        </select>
      </div>

      {/* ======================================================
          RECORD TABLE
      ====================================================== */}

      <div
        style={{
          background:
            "#FFFFFF",

          borderRadius:
            "14px",

          overflow:
            "hidden",

          boxShadow:
            "0 8px 25px rgba(15,23,42,0.06)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding:
              "20px",

            borderBottom:
              "1px solid #E2E8F0",

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "15px",

            flexWrap:
              "wrap",
          }}
        >
          <div>
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "10px",
              }}
            >
              <span
                style={{
                  width:
                    "32px",

                  height:
                    "32px",

                  borderRadius:
                    "8px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "#EFF6FF",

                  color:
                    "#2563EB",

                  fontSize:
                    "17px",
                }}
              >
                ⛽
              </span>

              <h2
                style={{
                  margin:
                    0,

                  color:
                    "#0F172A",

                  fontSize:
                    "20px",

                  fontWeight:
                    700,
                }}
              >
                Fuel Analysis Records
              </h2>
            </div>

            <p
              style={{
                margin:
                  "6px 0 0 42px",

                color:
                  "#64748B",

                fontSize:
                  "13px",
              }}
            >
              Vehicle fuel consumption,
              cost and efficiency records.
            </p>
          </div>

          <span
            style={{
              padding:
                "7px 12px",

              borderRadius:
                "999px",

              background:
                "#EFF6FF",

              color:
                "#1D4ED8",

              fontSize:
                "12px",

              fontWeight:
                600,
            }}
          >
            {filteredRecords.length}{" "}
            Records
          </span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              padding:
                "65px 30px",

              textAlign:
                "center",

              color:
                "#64748B",
            }}
          >
            <div
              style={{
                fontSize:
                  "17px",

                fontWeight:
                  600,

                marginBottom:
                  "7px",

                color:
                  "#334155",
              }}
            >
              Loading fuel analysis...
            </div>

            <div
              style={{
                fontSize:
                  "13px",
              }}
            >
              Connecting to logistics
              fuel services.
            </div>
          </div>
        ) : filteredRecords.length ===
          0 ? (
          <div
            style={{
              padding:
                "65px 30px",

              textAlign:
                "center",

              color:
                "#64748B",
            }}
          >
            <div
              style={{
                width:
                  "58px",

                height:
                  "58px",

                margin:
                  "0 auto 15px",

                borderRadius:
                  "50%",

                background:
                  "#EFF6FF",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontSize:
                  "26px",
              }}
            >
              ⛽
            </div>

            <div
              style={{
                fontSize:
                  "18px",

                fontWeight:
                  600,

                color:
                  "#334155",

                marginBottom:
                  "7px",
              }}
            >
              No fuel records found
            </div>

            <p
              style={{
                margin:
                  "0 0 20px",

                fontSize:
                  "14px",
              }}
            >
              Add your first fuel
              analysis record to begin
              monitoring vehicle
              performance.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              style={{
                padding:
                  "10px 18px",

                border:
                  "none",

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
              + Add Fuel Record
            </button>
          </div>
        ) : (
          <div
            style={{
              width:
                "100%",

              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width:
                  "100%",

                minWidth:
                  "1050px",

                borderCollapse:
                  "collapse",
              }}
            >
              <thead
                style={{
                  background:
                    "#F8FAFC",
                }}
              >
                <tr>
                  <th
                    style={
                      headerStyle
                    }
                  >
                    Vehicle
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Driver
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Fuel Type
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Fuel Used
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Fuel Cost
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Distance
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Efficiency
                  </th>

                  <th
                    style={{
                      ...headerStyle,
                      textAlign:
                        "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map(
                  (record) => (
                    <tr
                      key={
                        record.id
                      }
                      style={{
                        borderBottom:
                          "1px solid #E2E8F0",
                      }}
                      className="fuel-table-row"
                    >
                      {/* VEHICLE */}

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap:
                              "11px",
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
                                "#EFF6FF",

                              color:
                                "#2563EB",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              fontWeight:
                                700,

                              fontSize:
                                "15px",
                            }}
                          >
                            {record.vehicle_number
                              .charAt(
                                0
                              )
                              .toUpperCase()}
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
                                record.vehicle_number
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
                                  "#EFF6FF",

                                color:
                                  "#2563EB",

                                fontSize:
                                  "10px",

                                fontWeight:
                                  700,
                              }}
                            >
                              FUEL
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* DRIVER */}

                      <td
                        style={
                          cellStyle
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
                            record.driver_name
                          }
                        </div>
                      </td>

                      {/* FUEL TYPE */}

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <span
                          style={{
                            ...getFuelTypeStyle(
                              record.fuel_type
                            ),

                            display:
                              "inline-block",

                            padding:
                              "6px 11px",

                            borderRadius:
                              "999px",

                            fontSize:
                              "12px",

                            fontWeight:
                              700,
                          }}
                        >
                          {
                            record.fuel_type
                          }
                        </span>
                      </td>

                      {/* FUEL USED */}

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <strong
                          style={{
                            color:
                              "#0F172A",
                          }}
                        >
                          {formatNumber(
                            record.fuel_purchased
                          )}
                        </strong>{" "}
                        <span
                          style={{
                            color:
                              "#64748B",
                          }}
                        >
                          L
                        </span>
                      </td>

                      {/* FUEL COST */}

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <strong
                          style={{
                            color:
                              "#0F172A",
                          }}
                        >
                          {formatCurrency(
                            record.fuel_cost
                          )}
                        </strong>
                      </td>

                      {/* DISTANCE */}

                      <td
                        style={
                          cellStyle
                        }
                      >
                        {formatNumber(
                          record.distance_travelled
                        )}{" "}
                        <span
                          style={{
                            color:
                              "#64748B",
                          }}
                        >
                          km
                        </span>
                      </td>

                      {/* EFFICIENCY */}

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap:
                              "8px",
                          }}
                        >
                          <div
                            style={{
                              width:
                                "70px",

                              height:
                                "6px",

                              background:
                                "#E2E8F0",

                              borderRadius:
                                "999px",

                              overflow:
                                "hidden",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  `${Math.min(
                                    Math.max(
                                      record.fuel_efficiency *
                                        5,
                                      0
                                    ),
                                    100
                                  )}%`,

                                height:
                                  "100%",

                                background:
                                  record.fuel_efficiency >=
                                  8
                                    ? "#22C55E"
                                    : record.fuel_efficiency >=
                                      5
                                    ? "#F59E0B"
                                    : "#EF4444",

                                borderRadius:
                                  "999px",
                              }}
                            />
                          </div>

                          <strong
                            style={{
                              color:
                                "#0F172A",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatNumber(
                              record.fuel_efficiency
                            )}{" "}
                            km/L
                          </strong>
                        </div>
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          ...cellStyle,

                          textAlign:
                            "center",
                        }}
                      >
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
                            title="Edit record"
                            onClick={() =>
                              openEditForm(
                                record
                              )
                            }
                            style={
                              editButtonStyle
                            }
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            title="Delete record"
                            onClick={() =>
                              handleDelete(
                                record.id,
                                record.vehicle_number
                              )
                            }
                            style={
                              deleteButtonStyle
                            }
                          >
                            🗑
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

        {/* TABLE FOOTER */}

        {!loading &&
          filteredRecords.length >
            0 && (
            <div
              style={{
                padding:
                  "15px 20px",

                borderTop:
                  "1px solid #E2E8F0",

                color:
                  "#64748B",

                fontSize:
                  "13px",
              }}
            >
              Showing{" "}
              <strong
                style={{
                  color:
                    "#334155",
                }}
              >
                {filteredRecords.length}
              </strong>{" "}
              of{" "}
              <strong
                style={{
                  color:
                    "#334155",
                }}
              >
                {records.length}
              </strong>{" "}
              fuel analysis records
            </div>
          )}
      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showForm && (
        <div
          style={{
            position:
              "fixed",

            inset:
              0,

            zIndex:
              1000,

            padding:
              "20px",

            background:
              "rgba(15,23,42,0.58)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",
          }}
        >
          <div
            style={{
              width:
                "100%",

              maxWidth:
                "760px",

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

                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  "15px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "13px",
                }}
              >
                <div
                  style={{
                    width:
                      "44px",

                    height:
                      "44px",

                    borderRadius:
                      "10px",

                    background:
                      "#EFF6FF",

                    color:
                      "#2563EB",

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
                  ⛽
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

                      fontWeight:
                        700,
                    }}
                  >
                    {editingId !==
                    null
                      ? "Edit Fuel Record"
                      : "Add Fuel Record"}
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
                      ? "Update fuel consumption and vehicle efficiency details."
                      : "Capture fuel consumption and vehicle efficiency information."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  resetForm
                }
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
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap:
                    "18px",
                }}
                className="fuel-form-grid"
              >
                <FormField
                  label="Vehicle Number"
                  required
                >
                  <input
                    name="vehicle_number"
                    value={
                      form.vehicle_number
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Truck 101"
                    required
                    style={
                      inputStyle
                    }
                  />
                </FormField>

                <FormField
                  label="Driver Name"
                  required
                >
                  <input
                    name="driver_name"
                    value={
                      form.driver_name
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="John Dube"
                    required
                    style={
                      inputStyle
                    }
                  />
                </FormField>

                <FormField
                  label="Fuel Type"
                  required
                >
                  <select
                    name="fuel_type"
                    value={
                      form.fuel_type
                    }
                    onChange={
                      handleInputChange
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="Diesel">
                      Diesel
                    </option>

                    <option value="Petrol">
                      Petrol
                    </option>

                    <option value="Electric">
                      Electric
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Fuel Purchased (L)"
                  required
                >
                  <input
                    type="number"
                    name="fuel_purchased"
                    value={
                      form.fuel_purchased
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="120.00"
                    required
                    style={
                      inputStyle
                    }
                  />
                </FormField>

                <FormField
                  label="Fuel Cost (R)"
                  required
                >
                  <input
                    type="number"
                    name="fuel_cost"
                    value={
                      form.fuel_cost
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="2850.00"
                    required
                    style={
                      inputStyle
                    }
                  />
                </FormField>

                <FormField
                  label="Distance Travelled (km)"
                  required
                >
                  <input
                    type="number"
                    name="distance_travelled"
                    value={
                      form.distance_travelled
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="850.00"
                    required
                    style={
                      inputStyle
                    }
                  />
                </FormField>

                <FormField
                  label="Fuel Efficiency (km/L)"
                  required
                >
                  <input
                    type="number"
                    name="fuel_efficiency"
                    value={
                      form.fuel_efficiency
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="Calculated automatically"
                    required
                    style={
                      inputStyle
                    }
                  />
                </FormField>
              </div>

              {/* EFFICIENCY INFO */}

              <div
                style={{
                  marginTop:
                    "20px",

                  padding:
                    "15px 16px",

                  borderRadius:
                    "10px",

                  background:
                    "#F8FAFC",

                  border:
                    "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    gap:
                      "15px",

                    flexWrap:
                      "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight:
                          700,

                        color:
                          "#334155",

                        fontSize:
                          "14px",
                      }}
                    >
                      Fuel Efficiency
                    </div>

                    <p
                      style={{
                        margin:
                          "5px 0 0",

                        color:
                          "#64748B",

                        fontSize:
                          "12px",
                      }}
                    >
                      Calculated using
                      distance travelled
                      ÷ fuel purchased.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      calculateEfficiency
                    }
                    style={{
                      padding:
                        "9px 15px",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      background:
                        "#0F766E",

                      color:
                        "#FFFFFF",

                      fontWeight:
                        600,

                      fontSize:
                        "13px",

                      cursor:
                        "pointer",
                    }}
                  >
                    Calculate Efficiency
                  </button>
                </div>

                {form.fuel_efficiency && (
                  <div
                    style={{
                      marginTop:
                        "12px",

                      padding:
                        "10px 12px",

                      borderRadius:
                        "8px",

                      background:
                        "#ECFDF5",

                      color:
                        "#047857",

                      fontWeight:
                        700,

                      fontSize:
                        "14px",
                    }}
                  >
                    Current efficiency:{" "}
                    {
                      form.fuel_efficiency
                    }{" "}
                    km/L
                  </div>
                )}
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

                  flexWrap:
                    "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  style={
                    cancelButtonStyle
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
                    ...saveButtonStyle,

                    background:
                      saving
                        ? "#93C5FD"
                        : "#2563EB",

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

      {/* ======================================================
          RESPONSIVE STYLES
      ====================================================== */}

      <style>
        {`
          .fuel-table-row {
            transition: background 0.15s ease;
          }

          .fuel-table-row:hover {
            background: #F8FAFC;
          }

          .fuel-filter-bar input:focus,
          .fuel-filter-bar select:focus {
            border-color: #2563EB !important;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
          }

          button {
            transition: all 0.15s ease;
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          @media (max-width: 850px) {
            .fuel-filter-bar {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 700px) {
            .fuel-form-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 600px) {
            .fuel-filter-bar {
              padding: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// ==========================================================
// FORM FIELD
// ==========================================================

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        style={{
          display:
            "block",

          marginBottom:
            "7px",

          color:
            "#334155",

          fontSize:
            "13px",

          fontWeight:
            600,
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color:
                "#DC2626",

              marginLeft:
                "3px",
            }}
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ==========================================================
// METRIC CARD
// ==========================================================

interface MetricCardProps {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  background: string;
  iconBackground: string;
  color: string;
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  background,
  iconBackground,
  color,
}: MetricCardProps) {
  return (
    <div
      style={{
        position:
          "relative",

        padding:
          "20px",

        borderRadius:
          "14px",

        background:
          "#FFFFFF",

        border:
          "1px solid #E2E8F0",

        boxShadow:
          "0 5px 18px rgba(15,23,42,0.05)",

        overflow:
          "hidden",
      }}
    >
      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            "11px",
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
              iconBackground,

            color,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            fontSize:
              "20px",

            fontWeight:
              700,
          }}
        >
          {icon}
        </div>

        <div>
          <div
            style={{
              color,

              fontSize:
                "13px",

              fontWeight:
                600,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop:
            "15px",

          fontSize:
            "28px",

          fontWeight:
            700,

          color:
            "#0F172A",

          letterSpacing:
            "-0.4px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop:
            "5px",

          color:
            "#64748B",

          fontSize:
            "12px",
        }}
      >
        {subtitle}
      </div>

      <div
        style={{
          position:
            "absolute",

          right:
            "18px",

          bottom:
            "23px",

          width:
            "54px",

          height:
            "25px",

          opacity:
            0.9,
        }}
      >
        <svg
          width="54"
          height="25"
          viewBox="0 0 54 25"
          fill="none"
        >
          <path
            d="M2 21C8 19 10 15 16 16C22 17 25 9 31 11C37 13 40 4 45 7C49 9 51 3 53 2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const inputStyle: React.CSSProperties = {
  width:
    "100%",

  boxSizing:
    "border-box",

  height:
    "44px",

  padding:
    "0 12px",

  border:
    "1px solid #CBD5E1",

  borderRadius:
    "8px",

  background:
    "#FFFFFF",

  color:
    "#0F172A",

  fontSize:
    "14px",

  outline:
    "none",

  fontFamily:
    "inherit",
};

const headerStyle: React.CSSProperties = {
  padding:
    "15px 14px",

  textAlign:
    "left",

  color:
    "#475569",

  fontSize:
    "12px",

  fontWeight:
    700,

  whiteSpace:
    "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding:
    "17px 14px",

  color:
    "#334155",

  fontSize:
    "13px",

  verticalAlign:
    "middle",

  whiteSpace:
    "nowrap",
};

const editButtonStyle: React.CSSProperties = {
  width:
    "38px",

  height:
    "38px",

  border:
    "1px solid #DBEAFE",

  borderRadius:
    "9px",

  background:
    "#EFF6FF",

  color:
    "#2563EB",

  fontSize:
    "17px",

  fontWeight:
    700,

  cursor:
    "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  width:
    "38px",

  height:
    "38px",

  border:
    "1px solid #FECACA",

  borderRadius:
    "9px",

  background:
    "#FEF2F2",

  color:
    "#DC2626",

  fontSize:
    "15px",

  cursor:
    "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
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
};

const saveButtonStyle: React.CSSProperties = {
  padding:
    "11px 22px",

  borderRadius:
    "8px",

  border:
    "none",

  color:
    "#FFFFFF",

  fontWeight:
    600,

  boxShadow:
    "0 4px 12px rgba(37,99,235,0.20)",
};