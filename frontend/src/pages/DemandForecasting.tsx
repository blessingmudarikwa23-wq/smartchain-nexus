import { useEffect, useMemo, useState } from "react";

type Forecast = {
  id?: number;
  product: string;
  forecast_period: string;
  historical_demand: number;
  forecasted_demand: number;
  forecast_accuracy: number;
  model_used: string;
  status: string;
};

type ForecastForm = {
  product: string;
  forecast_period: string;
  historical_demand: string;
  forecasted_demand: string;
  forecast_accuracy: string;
  model_used: string;
  status: string;
};

const API_URL =
  "http://localhost:8000/data-science/demand-forecasting";

const emptyForm: ForecastForm = {
  product: "",
  forecast_period: "",
  historical_demand: "",
  forecasted_demand: "",
  forecast_accuracy: "",
  model_used: "",
  status: "Active",
};

export default function DemandForecasting() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingForecast, setEditingForecast] =
    useState<Forecast | null>(null);

  const [form, setForm] = useState<ForecastForm>(emptyForm);

  // ==========================================================
  // SVG ICONS
  // ==========================================================

  const ChartIcon = ({
    size = 24,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 19V5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 19H20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 15L10.5 11.5L13 13.5L18.5 7.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 7.5H18.5V10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const AnalyticsIcon = ({
    size = 24,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 20V10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 20V4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 20V7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3.5 20H20.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  const CheckCircleIcon = ({
    size = 24,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M8.5 12L10.8 14.3L15.7 9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const TargetIcon = ({
    size = 24,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke={color}
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke={color}
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="1.8"
        fill={color}
      />
    </svg>
  );

  const GrowthIcon = ({
    size = 24,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 17L10 12L13.5 15.5L20 8.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5H20V13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  const SearchIcon = ({
    size = 19,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.5"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M16 16L20 20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  const PlusIcon = ({
    size = 18,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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

  const EditIcon = ({
    size = 17,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 20L8.5 19L19 8.5C20.1 7.4 20.1 5.6 19 4.5C17.9 3.4 16.1 3.4 15 4.5L4.5 15L4 20Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6L18 10.5"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );

  const TrashIcon = ({
    size = 17,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 7H19"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 7L7.8 19C7.87 20.13 8.81 21 9.94 21H14.06C15.19 21 16.13 20.13 16.2 19L17 7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11V17"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 11V17"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );

  const MoreIcon = ({
    size = 20,
    color = "currentColor",
  }: {
    size?: number;
    color?: string;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1.6" fill={color} />
      <circle cx="12" cy="12" r="1.6" fill={color} />
      <circle cx="19" cy="12" r="1.6" fill={color} />
    </svg>
  );

  // ==========================================================
  // FETCH FORECASTS
  // ==========================================================

  const fetchDemandForecasts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch forecasts. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      const forecastData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setForecasts(forecastData);
    } catch (err) {
      console.error("Demand Forecasting Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load demand forecasting data."
      );

      setForecasts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandForecasts();
  }, []);

  // ==========================================================
  // FORM HANDLERS
  // ==========================================================

  const handleFormChange = (
    field: keyof ForecastForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAddForecastForm = () => {
    setEditingForecast(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForecastForm = (forecast: Forecast) => {
    setEditingForecast(forecast);

    setForm({
      product: forecast.product ?? "",
      forecast_period: forecast.forecast_period ?? "",
      historical_demand: String(
        forecast.historical_demand ?? ""
      ),
      forecasted_demand: String(
        forecast.forecasted_demand ?? ""
      ),
      forecast_accuracy: String(
        forecast.forecast_accuracy ?? ""
      ),
      model_used: forecast.model_used ?? "",
      status: forecast.status ?? "Active",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForecastForm = () => {
    if (submitting) {
      return;
    }

    setShowForm(false);
    setEditingForecast(null);
    setForm(emptyForm);
  };

  // ==========================================================
  // CREATE / UPDATE FORECAST
  // ==========================================================

  const handleSubmitForecast = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.product.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!form.forecast_period.trim()) {
      setError("Please enter a forecast period.");
      return;
    }

    if (!form.historical_demand.trim()) {
      setError("Please enter historical demand.");
      return;
    }

    if (!form.forecasted_demand.trim()) {
      setError("Please enter forecasted demand.");
      return;
    }

    if (!form.forecast_accuracy.trim()) {
      setError("Please enter forecast accuracy.");
      return;
    }

    if (!form.model_used.trim()) {
      setError("Please enter the model used.");
      return;
    }

    const historicalDemand = Number(
      form.historical_demand
    );

    const forecastedDemand = Number(
      form.forecasted_demand
    );

    const forecastAccuracy = Number(
      form.forecast_accuracy
    );

    if (Number.isNaN(historicalDemand)) {
      setError("Historical demand must be a valid number.");
      return;
    }

    if (Number.isNaN(forecastedDemand)) {
      setError("Forecasted demand must be a valid number.");
      return;
    }

    if (Number.isNaN(forecastAccuracy)) {
      setError("Forecast accuracy must be a valid number.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        product: form.product.trim(),
        forecast_period: form.forecast_period.trim(),
        historical_demand: historicalDemand,
        forecasted_demand: forecastedDemand,
        forecast_accuracy: forecastAccuracy,
        model_used: form.model_used.trim(),
        status: form.status,
      };

      const url = editingForecast?.id
        ? `${API_URL}/${editingForecast.id}`
        : API_URL;

      const method = editingForecast?.id
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message =
          "Unable to save the demand forecast.";

        try {
          const errorData = await response.json();

          if (typeof errorData?.detail === "string") {
            message = errorData.detail;
          } else if (
            Array.isArray(errorData?.detail)
          ) {
            message = errorData.detail
              .map((item: any) =>
                typeof item === "string"
                  ? item
                  : item?.msg || "Validation error"
              )
              .join(", ");
          }
        } catch {
          // Keep default message.
        }

        throw new Error(
          `${message} Server returned ${response.status}.`
        );
      }

      if (editingForecast?.id) {
        setSuccess(
          "Demand forecast updated successfully."
        );
      } else {
        setSuccess(
          "Demand forecast created successfully."
        );
      }

      setShowForm(false);
      setEditingForecast(null);
      setForm(emptyForm);

      await fetchDemandForecasts();
    } catch (err) {
      console.error(
        "Save Demand Forecast Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the demand forecast."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // DELETE FORECAST
  // ==========================================================

  const handleDeleteForecast = async (
    forecast: Forecast
  ) => {
    if (!forecast.id) {
      setError(
        "This forecast does not have a valid ID."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the forecast for "${forecast.product}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${forecast.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message =
          "Unable to delete the forecast.";

        try {
          const errorData = await response.json();

          if (typeof errorData?.detail === "string") {
            message = errorData.detail;
          }
        } catch {
          // Keep default message.
        }

        throw new Error(
          `${message} Server returned ${response.status}.`
        );
      }

      setSuccess(
        "Demand forecast deleted successfully."
      );

      await fetchDemandForecasts();
    } catch (err) {
      console.error(
        "Delete Demand Forecast Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the demand forecast."
      );
    }
  };

  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const filteredForecasts = useMemo(() => {
    let result = [...forecasts];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((item) =>
        String(item.product ?? "")
          .toLowerCase()
          .includes(query)
      );
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (item) =>
          String(item.status ?? "").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    if (sortOrder === "Newest First") {
      result.sort(
        (a, b) =>
          Number(b.id ?? 0) -
          Number(a.id ?? 0)
      );
    }

    if (sortOrder === "Oldest First") {
      result.sort(
        (a, b) =>
          Number(a.id ?? 0) -
          Number(b.id ?? 0)
      );
    }

    if (sortOrder === "Highest Forecast") {
      result.sort(
        (a, b) =>
          Number(b.forecasted_demand ?? 0) -
          Number(a.forecasted_demand ?? 0)
      );
    }

    if (sortOrder === "Lowest Forecast") {
      result.sort(
        (a, b) =>
          Number(a.forecasted_demand ?? 0) -
          Number(b.forecasted_demand ?? 0)
      );
    }

    return result;
  }, [
    forecasts,
    search,
    statusFilter,
    sortOrder,
  ]);

  // ==========================================================
  // DASHBOARD STATISTICS
  // ==========================================================

  const totalForecasts = forecasts.length;

  const activeForecasts = forecasts.filter(
    (item) =>
      String(item.status ?? "").toLowerCase() ===
      "active"
  ).length;

  const averageAccuracy =
    forecasts.length > 0
      ? forecasts.reduce(
          (total, item) =>
            total +
            Number(
              item.forecast_accuracy ?? 0
            ),
          0
        ) / forecasts.length
      : 0;

  const totalForecastedDemand =
    forecasts.reduce(
      (total, item) =>
        total +
        Number(
          item.forecasted_demand ?? 0
        ),
      0
    );

  const totalHistoricalDemand =
    forecasts.reduce(
      (total, item) =>
        total +
        Number(
          item.historical_demand ?? 0
        ),
      0
    );

  const growthForecast =
    totalHistoricalDemand > 0
      ? ((totalForecastedDemand -
          totalHistoricalDemand) /
          totalHistoricalDemand) *
        100
      : 0;

  // ==========================================================
  // FORMAT NUMBERS
  // ==========================================================

  const formatNumber = (value: unknown) => {
    const number = Number(value ?? 0);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString();
  };

  const formatAccuracy = (value: unknown) => {
    const number = Number(value ?? 0);

    if (!Number.isFinite(number)) {
      return "0.0%";
    }

    return number <= 1
      ? `${(number * 100).toFixed(1)}%`
      : `${number.toFixed(1)}%`;
  };

  const getAccuracyPercentage = (
    value: unknown
  ) => {
    const number = Number(value ?? 0);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return Math.min(
      number <= 1 ? number * 100 : number,
      100
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100%",
          background: "#F8FAFC",
          padding: "30px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            color: "#64748B",
            boxShadow:
              "0 4px 16px rgba(15, 23, 42, 0.05)",
          }}
        >
          Loading demand forecasting data...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#F8FAFC",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
              boxShadow:
                "0 4px 12px rgba(37, 99, 235, 0.10)",
            }}
          >
            <ChartIcon
              size={30}
              color="#2563EB"
            />
          </div>

          <div>
            <h1
              style={{
                margin: "0 0 6px 0",
                fontSize: "36px",
                lineHeight: "1.1",
                fontWeight: "700",
                color: "#0F172A",
                letterSpacing: "-0.8px",
              }}
            >
              Demand Forecasting
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#64748B",
              }}
            >
              Predict future demand using historical
              data and machine learning
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddForecastForm}
          style={{
            border: "none",
            background: "#2563EB",
            color: "#FFFFFF",
            padding: "14px 22px",
            borderRadius: "11px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            boxShadow:
              "0 5px 12px rgba(37, 99, 235, 0.20)",
          }}
        >
          <PlusIcon
            size={18}
            color="#FFFFFF"
          />
          Add Forecast
        </button>
      </div>

      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#166534",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          STATISTICS CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={statCardStyle}>
          <div style={statTopStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#E0ECFF",
                color: "#2563EB",
              }}
            >
              <AnalyticsIcon
                size={22}
                color="#2563EB"
              />
            </div>

            <div>
              <div
                style={{
                  color: "#2563EB",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Total Forecasts
              </div>

              <div style={statNumberStyle}>
                {totalForecasts}
              </div>
            </div>
          </div>

          <div style={statDescriptionStyle}>
            Registered demand forecasts
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={statTopStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#DCFCE7",
                color: "#16A34A",
              }}
            >
              <CheckCircleIcon
                size={22}
                color="#16A34A"
              />
            </div>

            <div>
              <div
                style={{
                  color: "#16A34A",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Active Forecasts
              </div>

              <div style={statNumberStyle}>
                {activeForecasts}
              </div>
            </div>
          </div>

          <div style={statDescriptionStyle}>
            Currently active models
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={statTopStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#FEF3C7",
                color: "#D97706",
              }}
            >
              <TargetIcon
                size={22}
                color="#D97706"
              />
            </div>

            <div>
              <div
                style={{
                  color: "#D97706",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Average Accuracy
              </div>

              <div style={statNumberStyle}>
                {formatAccuracy(
                  averageAccuracy
                )}
              </div>
            </div>
          </div>

          <div style={statDescriptionStyle}>
            Average model accuracy
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={statTopStyle}>
            <div
              style={{
                ...statIconStyle,
                background: "#F3E8FF",
                color: "#9333EA",
              }}
            >
              <GrowthIcon
                size={22}
                color="#9333EA"
              />
            </div>

            <div>
              <div
                style={{
                  color: "#9333EA",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Growth Forecast
              </div>

              <div style={statNumberStyle}>
                {growthForecast >= 0
                  ? "+"
                  : ""}
                {growthForecast.toFixed(1)}%
              </div>
            </div>
          </div>

          <div style={statDescriptionStyle}>
            Historical vs forecasted demand
          </div>
        </div>
      </div>

      {/* ======================================================
          SEARCH + FILTER BAR
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          padding: "10px",
          marginBottom: "18px",
          display: "grid",
          gridTemplateColumns:
            "minmax(250px, 1fr) 180px 180px",
          gap: "12px",
          boxShadow:
            "0 3px 12px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            height: "44px",
            border: "1px solid #E2E8F0",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: "10px",
            background: "#FFFFFF",
          }}
        >
          <SearchIcon
            size={19}
            color="#64748B"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              color: "#0F172A",
              background: "transparent",
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          style={selectStyle}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
          style={selectStyle}
        >
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Highest Forecast</option>
          <option>Lowest Forecast</option>
        </select>
      </div>

      {/* ======================================================
          FORECAST TABLE
      ====================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 3px 12px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            padding: "22px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
            }}
          >
            <ChartIcon
              size={17}
              color="#2563EB"
            />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 650,
              color: "#0F172A",
            }}
          >
            Demand Forecast List
          </h2>
        </div>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#F8FAFC",
                }}
              >
                <th style={tableHeaderStyle}>
                  Product
                </th>

                <th style={tableHeaderStyle}>
                  Forecast Period
                </th>

                <th style={tableHeaderStyle}>
                  Historical Demand
                </th>

                <th style={tableHeaderStyle}>
                  Forecast
                </th>

                <th style={tableHeaderStyle}>
                  Accuracy
                </th>

                <th style={tableHeaderStyle}>
                  Model
                </th>

                <th style={tableHeaderStyle}>
                  Status
                </th>

                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "center",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredForecasts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "50px 20px",
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    No demand forecasts found.
                  </td>
                </tr>
              ) : (
                filteredForecasts.map((item) => {
                  const accuracy =
                    getAccuracyPercentage(
                      item.forecast_accuracy
                    );

                  const isActive =
                    String(
                      item.status ?? ""
                    ).toLowerCase() ===
                    "active";

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid #E2E8F0",
                      }}
                    >
                      <td style={tableCellStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "11px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background:
                                "#DBEAFE",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              color: "#2563EB",
                              fontWeight: "700",
                              fontSize: "15px",
                            }}
                          >
                            {item.product
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "P"}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight:
                                  "600",
                                fontSize:
                                  "14px",
                                color:
                                  "#0F172A",
                              }}
                            >
                              {item.product}
                            </div>

                            <div
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
                                  "600",
                              }}
                            >
                              DS-
                              {String(
                                item.id ??
                                  ""
                              ).padStart(
                                4,
                                "0"
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        {
                          item.forecast_period
                        }
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#334155",
                        }}
                      >
                        {formatNumber(
                          item.historical_demand
                        )}
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#2563EB",
                        }}
                      >
                        {formatNumber(
                          item.forecasted_demand
                        )}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "70px",
                              height: "6px",
                              background:
                                "#E2E8F0",
                              borderRadius:
                                "10px",
                              overflow:
                                "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${accuracy}%`,
                                height:
                                  "100%",
                                background:
                                  "#2563EB",
                                borderRadius:
                                  "10px",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                              color:
                                "#334155",
                            }}
                          >
                            {formatAccuracy(
                              item.forecast_accuracy
                            )}
                          </span>
                        </div>
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        {item.model_used}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <span
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "6px",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "20px",
                            background:
                              isActive
                                ? "#DCFCE7"
                                : "#F1F5F9",
                            color:
                              isActive
                                ? "#15803D"
                                : "#64748B",
                            fontSize:
                              "11px",
                            fontWeight:
                              "600",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height:
                                "6px",
                              borderRadius:
                                "50%",
                              background:
                                isActive
                                  ? "#16A34A"
                                  : "#94A3B8",
                            }}
                          />

                          {item.status}
                        </span>
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap: "8px",
                          }}
                        >
                          <button
                            title="Edit forecast"
                            type="button"
                            onClick={() =>
                              openEditForecastForm(
                                item
                              )
                            }
                            style={{
                              width: "38px",
                              height:
                                "38px",
                              border:
                                "1px solid #DBEAFE",
                              background:
                                "#EFF6FF",
                              color:
                                "#2563EB",
                              borderRadius:
                                "9px",
                              cursor:
                                "pointer",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                            }}
                          >
                            <EditIcon
                              size={17}
                              color="#2563EB"
                            />
                          </button>

                          <button
                            title="Delete forecast"
                            type="button"
                            onClick={() =>
                              handleDeleteForecast(
                                item
                              )
                            }
                            style={{
                              width: "38px",
                              height:
                                "38px",
                              border:
                                "1px solid #FECACA",
                              background:
                                "#FEF2F2",
                              color:
                                "#DC2626",
                              borderRadius:
                                "9px",
                              cursor:
                                "pointer",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                            }}
                          >
                            <TrashIcon
                              size={17}
                              color="#DC2626"
                            />
                          </button>

                          <button
                            title="More actions"
                            type="button"
                            onClick={() =>
                              openEditForecastForm(
                                item
                              )
                            }
                            style={{
                              width: "34px",
                              height:
                                "38px",
                              border: "none",
                              background:
                                "transparent",
                              color:
                                "#64748B",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                            }}
                          >
                            <MoreIcon
                              size={20}
                              color="#64748B"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ====================================================
            TABLE FOOTER
        ==================================================== */}

        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            borderTop:
              "1px solid #E2E8F0",
            color: "#64748B",
            fontSize: "13px",
          }}
        >
          <span>
            Showing{" "}
            {filteredForecasts.length} of{" "}
            {forecasts.length} forecasts
          </span>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "7px",
            }}
          >
            <button
              type="button"
              style={paginationButtonStyle}
            >
              ‹
            </button>

            <button
              type="button"
              style={{
                ...paginationButtonStyle,
                border: "none",
                background:
                  "#2563EB",
                color: "#FFFFFF",
                fontWeight:
                  "600",
              }}
            >
              1
            </button>

            <button
              type="button"
              style={paginationButtonStyle}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          ADD / EDIT FORECAST MODAL
      ====================================================== */}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            padding: "20px",
            zIndex: 9999,
          }}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForecastForm();
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "720px",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              background:
                "#FFFFFF",
              borderRadius:
                "18px",
              boxShadow:
                "0 25px 60px rgba(15, 23, 42, 0.25)",
            }}
          >
            <div
              style={{
                padding:
                  "22px 24px",
                borderBottom:
                  "1px solid #E2E8F0",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      "20px",
                    fontWeight:
                      "700",
                    color:
                      "#0F172A",
                  }}
                >
                  {editingForecast
                    ? "Edit Demand Forecast"
                    : "Add Demand Forecast"}
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    fontSize:
                      "13px",
                    color:
                      "#64748B",
                  }}
                >
                  Enter the forecast details below.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForecastForm
                }
                disabled={
                  submitting
                }
                style={{
                  width: "36px",
                  height:
                    "36px",
                  border:
                    "1px solid #E2E8F0",
                  background:
                    "#FFFFFF",
                  borderRadius:
                    "9px",
                  fontSize:
                    "22px",
                  color:
                    "#64748B",
                  cursor:
                    submitting
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmitForecast
              }
            >
              <div
                style={{
                  padding:
                    "24px",
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "18px",
                }}
              >
                <FormField
                  label="Product"
                  required
                  value={
                    form.product
                  }
                  onChange={(
                    value
                  ) =>
                    handleFormChange(
                      "product",
                      value
                    )
                  }
                  placeholder="e.g. Laptop Stand"
                />

                <FormField
                  label="Forecast Period"
                  required
                  value={
                    form.forecast_period
                  }
                  onChange={(
                    value
                  ) =>
                    handleFormChange(
                      "forecast_period",
                      value
                    )
                  }
                  placeholder="e.g. September 2026"
                />

                <FormField
                  label="Historical Demand"
                  required
                  type="number"
                  value={
                    form.historical_demand
                  }
                  onChange={(
                    value
                  ) =>
                    handleFormChange(
                      "historical_demand",
                      value
                    )
                  }
                  placeholder="e.g. 1200"
                />

                <FormField
                  label="Forecasted Demand"
                  required
                  type="number"
                  value={
                    form.forecasted_demand
                  }
                  onChange={(
                    value
                  ) =>
                    handleFormChange(
                      "forecasted_demand",
                      value
                    )
                  }
                  placeholder="e.g. 1450"
                />

                <FormField
                  label="Forecast Accuracy"
                  required
                  type="number"
                  step="0.01"
                  value={
                    form.forecast_accuracy
                  }
                  onChange={(
                    value
                  ) =>
                    handleFormChange(
                      "forecast_accuracy",
                      value
                    )
                  }
                  placeholder="e.g. 0.95 or 95"
                />

                <FormField
                  label="Model Used"
                  required
                  value={
                    form.model_used
                  }
                  onChange={(
                    value
                  ) =>
                    handleFormChange(
                      "model_used",
                      value
                    )
                  }
                  placeholder="e.g. Random Forest"
                />

                <div>
                  <label
                    style={
                      formLabelStyle
                    }
                  >
                    Status
                  </label>

                  <select
                    value={
                      form.status
                    }
                    onChange={(
                      event
                    ) =>
                      handleFormChange(
                        "status",
                        event
                          .target
                          .value
                      )
                    }
                    style={
                      formInputStyle
                    }
                  >
                    <option>
                      Active
                    </option>
                    <option>
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    margin:
                      "0 24px 18px",
                    background:
                      "#FEF2F2",
                    border:
                      "1px solid #FECACA",
                    color:
                      "#B91C1C",
                    padding:
                      "12px 14px",
                    borderRadius:
                      "9px",
                    fontSize:
                      "13px",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  padding:
                    "18px 24px",
                  borderTop:
                    "1px solid #E2E8F0",
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    closeForecastForm
                  }
                  disabled={
                    submitting
                  }
                  style={{
                    padding:
                      "11px 18px",
                    border:
                      "1px solid #E2E8F0",
                    background:
                      "#FFFFFF",
                    color:
                      "#475569",
                    borderRadius:
                      "9px",
                    fontSize:
                      "14px",
                    fontWeight:
                      "600",
                    cursor:
                      submitting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  style={{
                    padding:
                      "11px 20px",
                    border:
                      "none",
                    background:
                      submitting
                        ? "#93C5FD"
                        : "#2563EB",
                    color:
                      "#FFFFFF",
                    borderRadius:
                      "9px",
                    fontSize:
                      "14px",
                    fontWeight:
                      "600",
                    cursor:
                      submitting
                        ? "not-allowed"
                        : "pointer",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                  }}
                >
                  {submitting
                    ? "Saving..."
                    : editingForecast
                    ? "Update Forecast"
                    : "Save Forecast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================================
// FORM FIELD COMPONENT
// ==========================================================

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label style={formLabelStyle}>
        {label}

        {required && (
          <span
            style={{
              color: "#DC2626",
              marginLeft: "3px",
            }}
          >
            *
          </span>
        )}
      </label>

      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        style={formInputStyle}
      />
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const statCardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "14px",
  padding: "20px",
  minHeight: "108px",
  boxShadow:
    "0 3px 12px rgba(15, 23, 42, 0.04)",
};

const statTopStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const statIconStyle: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statNumberStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#0F172A",
};

const statDescriptionStyle: React.CSSProperties = {
  marginTop: "14px",
  fontSize: "12px",
  color: "#64748B",
};

const selectStyle: React.CSSProperties = {
  height: "44px",
  border: "1px solid #E2E8F0",
  borderRadius: "9px",
  padding: "0 12px",
  fontSize: "14px",
  color: "#334155",
  background: "#FFFFFF",
  outline: "none",
  cursor: "pointer",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "17px 20px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 650,
  color: "#475569",
};

const tableCellStyle: React.CSSProperties = {
  padding: "18px 20px",
};

const paginationButtonStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  borderRadius: "8px",
  color: "#64748B",
  cursor: "pointer",
};

const formLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#334155",
};

const formInputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  boxSizing: "border-box",
  border: "1px solid #CBD5E1",
  borderRadius: "9px",
  padding: "0 12px",
  fontSize: "14px",
  color: "#0F172A",
  background: "#FFFFFF",
  outline: "none",
};