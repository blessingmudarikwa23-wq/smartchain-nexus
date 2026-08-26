import { FormEvent, useMemo, useState } from "react";

type ProcessStatus = "In Control" | "Monitor" | "Out of Control";

type ControlProcess = {
  id: number;
  process: string;
  average: number;
  upperLimit: number;
  lowerLimit: number;
  unit: string;
  status: ProcessStatus;
};

type ControlFormData = {
  process: string;
  average: string;
  upperLimit: string;
  lowerLimit: string;
  unit: string;
};

const initialProcesses: ControlProcess[] = [
  {
    id: 1,
    process: "Order Processing",
    average: 4.2,
    upperLimit: 5.0,
    lowerLimit: 3.5,
    unit: "hrs",
    status: "In Control",
  },
  {
    id: 2,
    process: "Warehouse Picking",
    average: 2.1,
    upperLimit: 2.8,
    lowerLimit: 1.6,
    unit: "hrs",
    status: "In Control",
  },
  {
    id: 3,
    process: "Supplier Delivery",
    average: 6.5,
    upperLimit: 7.5,
    lowerLimit: 5.5,
    unit: "days",
    status: "Monitor",
  },
  {
    id: 4,
    process: "Customer Delivery",
    average: 3.0,
    upperLimit: 4.0,
    lowerLimit: 2.5,
    unit: "days",
    status: "In Control",
  },
];

export default function ControlCharts(): JSX.Element {
  const [processes, setProcesses] =
    useState<ControlProcess[]>(initialProcesses);

  const [showForm, setShowForm] = useState<boolean>(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<ControlFormData>({
      process: "",
      average: "",
      upperLimit: "",
      lowerLimit: "",
      unit: "hrs",
    });

  const [error, setError] =
    useState<string>("");

  const [selectedProcessId, setSelectedProcessId] =
    useState<number | null>(null);

  /*
  ==========================================================
  STATUS CALCULATION
  ==========================================================
  */

  function calculateStatus(
    average: number,
    upperLimit: number,
    lowerLimit: number
  ): ProcessStatus {
    if (
      average > upperLimit ||
      average < lowerLimit
    ) {
      return "Out of Control";
    }

    const range = upperLimit - lowerLimit;

    if (range <= 0) {
      return "Out of Control";
    }

    const distanceFromCenter =
      Math.abs(
        average -
          (upperLimit + lowerLimit) / 2
      );

    if (
      distanceFromCenter >
      range * 0.3
    ) {
      return "Monitor";
    }

    return "In Control";
  }

  /*
  ==========================================================
  KPI VALUES
  ==========================================================
  */

  const totalProcesses = processes.length;

  const stableProcesses = useMemo(() => {
    return processes.filter(
      (item) =>
        item.status === "In Control"
    ).length;
  }, [processes]);

  const attentionProcesses = useMemo(() => {
    return processes.filter(
      (item) =>
        item.status !== "In Control"
    ).length;
  }, [processes]);

  const outOfControlProcesses =
    useMemo(() => {
      return processes.filter(
        (item) =>
          item.status === "Out of Control"
      ).length;
    }, [processes]);

  /*
  ==========================================================
  FORM
  ==========================================================
  */

  function resetForm(): void {
    setFormData({
      process: "",
      average: "",
      upperLimit: "",
      lowerLimit: "",
      unit: "hrs",
    });

    setEditingId(null);
    setError("");
  }

  function openCreateForm(): void {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(
    item: ControlProcess
  ): void {
    setEditingId(item.id);

    setFormData({
      process: item.process,
      average: String(item.average),
      upperLimit: String(item.upperLimit),
      lowerLimit: String(item.lowerLimit),
      unit: item.unit,
    });

    setShowForm(true);
    setError("");
  }

  function closeForm(): void {
    setShowForm(false);
    resetForm();
  }

  /*
  ==========================================================
  CREATE / UPDATE
  ==========================================================
  */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): void {
    event.preventDefault();

    const process =
      formData.process.trim();

    const average =
      Number(formData.average);

    const upperLimit =
      Number(formData.upperLimit);

    const lowerLimit =
      Number(formData.lowerLimit);

    if (!process) {
      setError(
        "Please enter the process name."
      );
      return;
    }

    if (
      !Number.isFinite(average) ||
      !Number.isFinite(upperLimit) ||
      !Number.isFinite(lowerLimit)
    ) {
      setError(
        "Please enter valid numeric values."
      );
      return;
    }

    if (upperLimit <= lowerLimit) {
      setError(
        "Upper Control Limit must be greater than Lower Control Limit."
      );
      return;
    }

    if (average < 0) {
      setError(
        "Average cannot be negative."
      );
      return;
    }

    const status =
      calculateStatus(
        average,
        upperLimit,
        lowerLimit
      );

    const newProcess: ControlProcess = {
      id:
        editingId === null
          ? Date.now()
          : editingId,
      process,
      average,
      upperLimit,
      lowerLimit,
      unit: formData.unit,
      status,
    };

    if (editingId === null) {
      setProcesses((current) => [
        ...current,
        newProcess,
      ]);
    } else {
      setProcesses((current) =>
        current.map((item) =>
          item.id === editingId
            ? newProcess
            : item
        )
      );
    }

    closeForm();
  }

  /*
  ==========================================================
  DELETE
  ==========================================================
  */

  function deleteProcess(
    id: number
  ): void {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this control chart process?"
      );

    if (!confirmed) {
      return;
    }

    setProcesses((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (selectedProcessId === id) {
      setSelectedProcessId(null);
    }
  }

  /*
  ==========================================================
  RESET ALL
  ==========================================================
  */

  function resetAll(): void {
    const confirmed =
      window.confirm(
        "Reset all control chart processes to the default data?"
      );

    if (!confirmed) {
      return;
    }

    setProcesses(initialProcesses);
    setSelectedProcessId(null);
    setShowForm(false);
    resetForm();
  }

  /*
  ==========================================================
  FORMATTERS
  ==========================================================
  */

  function formatValue(
    value: number,
    unit: string
  ): string {
    return `${value.toFixed(1)} ${unit}`;
  }

  function getStatusColor(
    status: ProcessStatus
  ): string {
    if (status === "In Control") {
      return "#16A34A";
    }

    if (status === "Monitor") {
      return "#D97706";
    }

    return "#DC2626";
  }

  function getStatusBackground(
    status: ProcessStatus
  ): string {
    if (status === "In Control") {
      return "#DCFCE7";
    }

    if (status === "Monitor") {
      return "#FEF3C7";
    }

    return "#FEE2E2";
  }

  /*
  ==========================================================
  CHART POSITION
  ==========================================================
  */

  function getChartPosition(
    value: number,
    minimum: number,
    maximum: number
  ): number {
    if (maximum === minimum) {
      return 50;
    }

    const percentage =
      ((value - minimum) /
        (maximum - minimum)) *
      100;

    return Math.min(
      100,
      Math.max(0, percentage)
    );
  }

  /*
  ==========================================================
  LOADING EMPTY STATE
  ==========================================================
  */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "30px",
        boxSizing: "border-box",
        color: "#0F172A",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Control Charts
          </h1>

          <p
            style={{
              margin:
                "8px 0 0 0",
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Monitor process stability and
            identify variation outside
            established control limits.
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
            onClick={resetAll}
            style={{
              border:
                "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#475569",
              padding:
                "11px 17px",
              borderRadius: "9px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            style={{
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              padding:
                "11px 18px",
              borderRadius: "9px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow:
                "0 6px 16px rgba(37,99,235,.20)",
            }}
          >
            + Create Process
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border:
              "1px solid #FECACA",
            color: "#B91C1C",
            padding:
              "13px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: 600,
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
            "repeat(auto-fit,minmax(210px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#DBEAFE",
            border:
              "1px solid #BFDBFE",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              color: "#1D4ED8",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Processes Monitored
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#1E3A8A",
            }}
          >
            {totalProcesses}
          </div>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            border:
              "1px solid #BBF7D0",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              color: "#15803D",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Stable Processes
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#166534",
            }}
          >
            {stableProcesses}
          </div>
        </div>

        <div
          style={{
            background: "#FEF3C7",
            border:
              "1px solid #FDE68A",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              color: "#B45309",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Need Attention
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#92400E",
            }}
          >
            {attentionProcesses}
          </div>
        </div>

        <div
          style={{
            background: "#FEE2E2",
            border:
              "1px solid #FECACA",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              color: "#B91C1C",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Out of Control
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#991B1B",
            }}
          >
            {outOfControlProcesses}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT FORM */}

      {showForm && (
        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "30px",
            boxShadow:
              "0 8px 24px rgba(15,23,42,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                {editingId === null
                  ? "Create Control Chart"
                  : "Edit Control Chart"}
              </h2>

              <p
                style={{
                  margin:
                    "5px 0 0 0",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Enter process performance
                and control limits.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              style={{
                border: "none",
                background: "#F1F5F9",
                color: "#475569",
                width: "35px",
                height: "35px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "19px",
              }}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Process
                </label>

                <input
                  type="text"
                  value={
                    formData.process
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      process:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Order Processing"
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Average
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={
                    formData.average
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      average:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. 4.2"
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Upper Control Limit
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={
                    formData.upperLimit
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      upperLimit:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. 5.0"
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Lower Control Limit
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={
                    formData.lowerLimit
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      lowerLimit:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. 3.5"
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "7px",
                  }}
                >
                  Unit
                </label>

                <select
                  value={formData.unit}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      unit:
                        event.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: "8px",
                    boxSizing:
                      "border-box",
                    fontSize: "14px",
                    background:
                      "#FFFFFF",
                  }}
                >
                  <option value="hrs">
                    Hours
                  </option>
                  <option value="days">
                    Days
                  </option>
                  <option value="units">
                    Units
                  </option>
                  <option value="%">
                    Percentage
                  </option>
                  <option value="R">
                    Rand
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={closeForm}
                style={{
                  padding:
                    "11px 18px",
                  border:
                    "1px solid #CBD5E1",
                  background:
                    "#FFFFFF",
                  color: "#475569",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  padding:
                    "11px 20px",
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {editingId === null
                  ? "Create Process"
                  : "Update Process"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONTROL CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(330px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {processes.map((item) => {
          const selected =
            selectedProcessId === item.id;

          const chartMin =
            Math.max(
              0,
              item.lowerLimit -
                (item.upperLimit -
                  item.lowerLimit) *
                  0.25
            );

          const chartMax =
            item.upperLimit +
            (item.upperLimit -
              item.lowerLimit) *
              0.25;

          const averagePosition =
            getChartPosition(
              item.average,
              chartMin,
              chartMax
            );

          const upperPosition =
            getChartPosition(
              item.upperLimit,
              chartMin,
              chartMax
            );

          const lowerPosition =
            getChartPosition(
              item.lowerLimit,
              chartMin,
              chartMax
            );

          return (
            <div
              key={item.id}
              onClick={() =>
                setSelectedProcessId(
                  selected
                    ? null
                    : item.id
                )
              }
              style={{
                background: "#FFFFFF",
                border: selected
                  ? "2px solid #2563EB"
                  : "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "20px",
                boxShadow:
                  "0 8px 24px rgba(15,23,42,.06)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "#0F172A",
                    }}
                  >
                    {item.process}
                  </h3>

                  <p
                    style={{
                      margin:
                        "5px 0 0 0",
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    Process stability
                  </p>
                </div>

                <span
                  style={{
                    padding:
                      "6px 10px",
                    borderRadius: "999px",
                    background:
                      getStatusBackground(
                        item.status
                      ),
                    color:
                      getStatusColor(
                        item.status
                      ),
                    fontSize: "11px",
                    fontWeight: 800,
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {item.status}
                </span>
              </div>

              {/* MINI CONTROL CHART */}

              <div
                style={{
                  position: "relative",
                  height: "150px",
                  background:
                    "#F8FAFC",
                  borderRadius: "10px",
                  border:
                    "1px solid #E2E8F0",
                  overflow: "hidden",
                  marginBottom: "15px",
                }}
              >
                {/* Grid */}

                <div
                  style={{
                    position:
                      "absolute",
                    left: "20px",
                    right: "20px",
                    top: "20px",
                    bottom: "25px",
                    background:
                      "repeating-linear-gradient(to bottom,#E2E8F0 0px,#E2E8F0 1px,transparent 1px,transparent 25px)",
                  }}
                />

                {/* Upper Control Limit */}

                <div
                  style={{
                    position:
                      "absolute",
                    left: "20px",
                    right: "20px",
                    top: `${100 - upperPosition}%`,
                    borderTop:
                      "2px dashed #DC2626",
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      position:
                        "absolute",
                      right: 0,
                      top: "-17px",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#DC2626",
                    }}
                  >
                    UCL
                  </span>
                </div>

                {/* Lower Control Limit */}

                <div
                  style={{
                    position:
                      "absolute",
                    left: "20px",
                    right: "20px",
                    top: `${100 - lowerPosition}%`,
                    borderTop:
                      "2px dashed #D97706",
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      position:
                        "absolute",
                      right: 0,
                      top: "-17px",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#D97706",
                    }}
                  >
                    LCL
                  </span>
                </div>

                {/* Average Line */}

                <div
                  style={{
                    position:
                      "absolute",
                    left: "20px",
                    right: "20px",
                    top: `${100 - averagePosition}%`,
                    borderTop:
                      "3px solid #2563EB",
                    zIndex: 3,
                  }}
                >
                  <span
                    style={{
                      position:
                        "absolute",
                      left: 0,
                      top: "-18px",
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "#2563EB",
                    }}
                  >
                    Average
                  </span>
                </div>

                {/* Sample Points */}

                {[18, 30, 43, 55, 67, 78].map(
                  (point, index) => {
                    const variation =
                      Math.sin(
                        (item.id +
                          index) *
                          1.7
                      ) * 7;

                    const pointPosition =
                      Math.min(
                        88,
                        Math.max(
                          12,
                          averagePosition +
                            variation
                        )
                      );

                    return (
                      <div
                        key={index}
                        style={{
                          position:
                            "absolute",
                          left: `${point}%`,
                          top: `${
                            100 -
                            pointPosition
                          }%`,
                          width: "9px",
                          height: "9px",
                          borderRadius:
                            "50%",
                          background:
                            getStatusColor(
                              item.status
                            ),
                          border:
                            "2px solid #FFFFFF",
                          boxShadow:
                            "0 2px 5px rgba(0,0,0,.15)",
                          zIndex: 5,
                          transform:
                            "translate(-50%,-50%)",
                        }}
                      />
                    );
                  }
                )}

                {/* Axis Labels */}

                <span
                  style={{
                    position:
                      "absolute",
                    left: "20px",
                    bottom: "6px",
                    fontSize: "9px",
                    color: "#64748B",
                  }}
                >
                  {chartMin.toFixed(1)}
                </span>

                <span
                  style={{
                    position:
                      "absolute",
                    right: "20px",
                    bottom: "6px",
                    fontSize: "9px",
                    color: "#64748B",
                  }}
                >
                  {chartMax.toFixed(1)}
                </span>
              </div>

              {/* CHART SUMMARY */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3,1fr)",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    background:
                      "#EFF6FF",
                    padding: "9px",
                    borderRadius: "8px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#64748B",
                      fontWeight: 700,
                    }}
                  >
                    AVG
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#2563EB",
                    }}
                  >
                    {formatValue(
                      item.average,
                      item.unit
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "#FEF2F2",
                    padding: "9px",
                    borderRadius: "8px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#64748B",
                      fontWeight: 700,
                    }}
                  >
                    UCL
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#DC2626",
                    }}
                  >
                    {formatValue(
                      item.upperLimit,
                      item.unit
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "#FFF7ED",
                    padding: "9px",
                    borderRadius: "8px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#64748B",
                      fontWeight: 700,
                    }}
                  >
                    LCL
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#D97706",
                    }}
                  >
                    {formatValue(
                      item.lowerLimit,
                      item.unit
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PROCESS TABLE */}

      <div
        style={{
          background: "#FFFFFF",
          border:
            "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "24px",
          boxShadow:
            "0 8px 24px rgba(15,23,42,.06)",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Process Control Summary
          </h2>

          <p
            style={{
              margin:
                "5px 0 0 0",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Detailed control limits and
            current process status.
          </p>
        </div>

        {processes.length === 0 ? (
          <div
            style={{
              padding: "45px",
              textAlign: "center",
              color: "#64748B",
              background: "#F8FAFC",
              borderRadius: "10px",
            }}
          >
            No processes available.
            Click "Create Process" to add
            your first control chart.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: "900px",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#1E293B",
                  color: "#FFFFFF",
                }}
              >
                <th
                  style={{
                    padding: "14px",
                    textAlign:
                      "left",
                    fontSize: "12px",
                  }}
                >
                  Process
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign:
                      "center",
                    fontSize: "12px",
                  }}
                >
                  Average
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign:
                      "center",
                    fontSize: "12px",
                  }}
                >
                  Upper Control Limit
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign:
                      "center",
                    fontSize: "12px",
                  }}
                >
                  Lower Control Limit
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign:
                      "center",
                    fontSize: "12px",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign:
                      "center",
                    fontSize: "12px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {processes.map(
                (item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      background:
                        index % 2 === 0
                          ? "#FFFFFF"
                          : "#F8FAFC",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    <td
                      style={{
                        padding:
                          "14px",
                        fontWeight: 700,
                        color:
                          "#0F172A",
                        fontSize:
                          "13px",
                      }}
                    >
                      {item.process}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                        textAlign:
                          "center",
                        fontWeight: 700,
                        color:
                          "#2563EB",
                        fontSize:
                          "13px",
                      }}
                    >
                      {formatValue(
                        item.average,
                        item.unit
                      )}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                        textAlign:
                          "center",
                        fontWeight: 700,
                        color:
                          "#DC2626",
                        fontSize:
                          "13px",
                      }}
                    >
                      {formatValue(
                        item.upperLimit,
                        item.unit
                      )}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                        textAlign:
                          "center",
                        fontWeight: 700,
                        color:
                          "#D97706",
                        fontSize:
                          "13px",
                      }}
                    >
                      {formatValue(
                        item.lowerLimit,
                        item.unit
                      )}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                        textAlign:
                          "center",
                      }}
                    >
                      <span
                        style={{
                          display:
                            "inline-block",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "999px",
                          background:
                            getStatusBackground(
                              item.status
                            ),
                          color:
                            getStatusColor(
                              item.status
                            ),
                          fontSize:
                            "11px",
                          fontWeight:
                            800,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
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
                          gap: "7px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              item
                            )
                          }
                          style={{
                            border:
                              "1px solid #BFDBFE",
                            background:
                              "#EFF6FF",
                            color:
                              "#2563EB",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "7px",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProcess(
                              item.id
                            )
                          }
                          style={{
                            border:
                              "1px solid #FECACA",
                            background:
                              "#FEF2F2",
                            color:
                              "#DC2626",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "7px",
                            cursor:
                              "pointer",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
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
        )}
      </div>
    </div>
  );
}