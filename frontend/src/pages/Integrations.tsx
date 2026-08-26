import { useEffect, useState } from "react";

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/settings";

  // ==========================================================
  // DEFAULT INTEGRATIONS
  // ==========================================================

  const defaultIntegrations = [
    {
      name: "Power BI",
      description: "Business Intelligence Integration",
      integration_type: "power_bi",
      status: "Disconnected",
      enabled: false,
    },
    {
      name: "Microsoft Excel",
      description: "Import & Export Data",
      integration_type: "microsoft_excel",
      status: "Disconnected",
      enabled: false,
    },
    {
      name: "SAP ERP",
      description: "Enterprise Resource Planning",
      integration_type: "sap_erp",
      status: "Disconnected",
      enabled: false,
    },
    {
      name: "Oracle ERP",
      description: "Supply Chain Integration",
      integration_type: "oracle_erp",
      status: "Disconnected",
      enabled: false,
    },
    {
      name: "OpenAI",
      description: "AI Supply Chain Assistant",
      integration_type: "openai",
      status: "Disconnected",
      enabled: false,
    },
    {
      name: "SMTP Email",
      description: "Email Notifications",
      integration_type: "smtp",
      status: "Disconnected",
      enabled: false,
    },
  ];

  // ==========================================================
  // LOAD INTEGRATIONS
  // ==========================================================

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/integrations`);

      if (!response.ok) {
        throw new Error(
          "Failed to load integration settings."
        );
      }

      const data = await response.json();

      // ------------------------------------------------------
      // If backend already has integrations
      // ------------------------------------------------------

      if (Array.isArray(data) && data.length > 0) {
        const backendIntegrations = data.map((item) => ({
          ...item,

          name:
            item.name ||
            getIntegrationName(item.integration_type),

          description:
            item.description ||
            getIntegrationDescription(
              item.integration_type
            ),

          status:
            item.status ||
            (item.enabled
              ? "Connected"
              : "Disconnected"),

          enabled:
            item.enabled || false,
        }));

        setIntegrations(backendIntegrations);
      } else {
        // ----------------------------------------------------
        // No integrations returned by backend
        // ----------------------------------------------------

        setIntegrations(defaultIntegrations);
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to load integration settings."
      );

      // ------------------------------------------------------
      // Keep the interface usable if backend is unavailable
      // ------------------------------------------------------

      setIntegrations(defaultIntegrations);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // GET INTEGRATION NAME
  // ==========================================================

  const getIntegrationName = (type) => {
    switch (type) {
      case "power_bi":
        return "Power BI";

      case "microsoft_excel":
        return "Microsoft Excel";

      case "sap_erp":
        return "SAP ERP";

      case "oracle_erp":
        return "Oracle ERP";

      case "openai":
        return "OpenAI";

      case "smtp":
        return "SMTP Email";

      default:
        return "Integration";
    }
  };

  // ==========================================================
  // GET INTEGRATION DESCRIPTION
  // ==========================================================

  const getIntegrationDescription = (type) => {
    switch (type) {
      case "power_bi":
        return "Business Intelligence Integration";

      case "microsoft_excel":
        return "Import & Export Data";

      case "sap_erp":
        return "Enterprise Resource Planning";

      case "oracle_erp":
        return "Supply Chain Integration";

      case "openai":
        return "AI Supply Chain Assistant";

      case "smtp":
        return "Email Notifications";

      default:
        return "SmartChain Nexus Integration";
    }
  };

  // ==========================================================
  // CONNECT / DISCONNECT INTEGRATION
  // ==========================================================

  const handleToggleIntegration = async (integration) => {
    try {
      setSavingId(
        integration.id ||
          integration.integration_type
      );

      setMessage("");
      setError("");

      const newEnabled = !integration.enabled;

      const payload = {
        name: integration.name,

        description:
          integration.description,

        integration_type:
          integration.integration_type,

        enabled: newEnabled,

        status: newEnabled
          ? "Connected"
          : "Disconnected",
      };

      let response;

      // ======================================================
      // UPDATE EXISTING INTEGRATION
      // ======================================================

      if (integration.id) {
        response = await fetch(
          `${API_URL}/integration/${integration.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(payload),
          }
        );
      }

      // ======================================================
      // CREATE NEW INTEGRATION
      // ======================================================

      else {
        response = await fetch(
          `${API_URL}/integration`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              user_id: 1,
              ...payload,
            }),
          }
        );
      }

      if (!response.ok) {
        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        throw new Error(
          errorData.detail ||
            "Failed to update integration."
        );
      }

      const savedIntegration =
        await response.json();

      // ======================================================
      // UPDATE LOCAL STATE
      // ======================================================

      setIntegrations((currentIntegrations) =>
        currentIntegrations.map((item) => {
          const matches =
            integration.id &&
            item.id === integration.id;

          const matchesByType =
            item.integration_type ===
            integration.integration_type;

          if (matches || matchesByType) {
            return {
              ...item,

              ...savedIntegration,

              id:
                savedIntegration.id ||
                item.id,

              name:
                savedIntegration.name ||
                item.name,

              description:
                savedIntegration.description ||
                item.description,

              integration_type:
                savedIntegration.integration_type ||
                item.integration_type,

              enabled:
                savedIntegration.enabled ??
                newEnabled,

              status:
                savedIntegration.status ||
                (newEnabled
                  ? "Connected"
                  : "Disconnected"),
            };
          }

          return item;
        })
      );

      setMessage(
        `${integration.name} ${
          newEnabled
            ? "connected"
            : "disconnected"
        } successfully.`
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to update integration."
      );
    } finally {
      setSavingId(null);
    }
  };

  // ==========================================================
  // REFRESH INTEGRATIONS
  // ==========================================================

  const handleRefresh = async () => {
    await fetchIntegrations();
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: "30px",
          }}
        >
          Integrations
        </h1>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
            maxWidth: "900px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#475569",
            }}
          >
            Loading integration settings...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div style={{ padding: "30px" }}>
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#0F172A",
            margin: 0,
          }}
        >
          Integrations
        </h1>

        <button
          onClick={handleRefresh}
          style={{
            background: "#E2E8F0",
            color: "#0F172A",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Refresh
        </button>
      </div>

      {/* ====================================================
          SUCCESS MESSAGE
      ==================================================== */}

      {message && (
        <div
          style={{
            background: "#DCFCE7",
            color: "#166534",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {message}
        </div>
      )}

      {/* ====================================================
          ERROR MESSAGE
      ==================================================== */}

      {error && (
        <div
          style={{
            background: "#FEE2E2",
            color: "#991B1B",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {error}
        </div>
      )}

      {/* ====================================================
          INTEGRATION CARDS
      ==================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px",
        }}
      >
        {integrations.map(
          (integration, index) => {
            const isConnected =
              integration.enabled === true ||
              integration.status ===
                "Connected";

            const integrationKey =
              integration.id ||
              integration.integration_type ||
              index;

            const isSaving =
              savingId === integrationKey;

            return (
              <div
                key={integrationKey}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "25px",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,.08)",
                  border: isConnected
                    ? "1px solid #BBF7D0"
                    : "1px solid #E2E8F0",
                  transition:
                    "all 0.2s ease",
                }}
              >
                {/* ========================================
                    INTEGRATION HEADER
                ======================================== */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        marginTop: 0,
                        marginBottom: "8px",
                        color: "#0F172A",
                      }}
                    >
                      {integration.name}
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        color: "#64748B",
                        lineHeight: "1.5",
                      }}
                    >
                      {
                        integration.description
                      }
                    </p>
                  </div>

                  {/* ======================================
                      STATUS INDICATOR
                  ====================================== */}

                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
                        isConnected
                          ? "#16A34A"
                          : "#DC2626",
                      flexShrink: 0,
                      marginTop: "7px",
                    }}
                  />
                </div>

                {/* ========================================
                    STATUS
                ======================================== */}

                <div
                  style={{
                    marginTop: "20px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background:
                      isConnected
                        ? "#F0FDF4"
                        : "#FEF2F2",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        isConnected
                          ? "#16A34A"
                          : "#DC2626",
                    }}
                  >
                    {isConnected
                      ? "Connected"
                      : "Disconnected"}
                  </span>
                </div>

                {/* ========================================
                    INTEGRATION TYPE
                ======================================== */}

                <p
                  style={{
                    marginTop: "15px",
                    marginBottom: "15px",
                    fontSize: "13px",
                    color: "#64748B",
                  }}
                >
                  Integration Type:{" "}
                  <strong>
                    {
                      integration.integration_type
                    }
                  </strong>
                </p>

                {/* ========================================
                    CONNECT / DISCONNECT BUTTON
                ======================================== */}

                <button
                  onClick={() =>
                    handleToggleIntegration(
                      integration
                    )
                  }
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    background: isSaving
                      ? "#94A3B8"
                      : isConnected
                      ? "#DC2626"
                      : "#2563EB",
                    color: "#ffffff",
                    border: "none",
                    padding: "11px 20px",
                    borderRadius: "8px",
                    cursor: isSaving
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {isSaving
                    ? "Updating..."
                    : isConnected
                    ? "Disconnect"
                    : "Connect"}
                </button>
              </div>
            );
          }
        )}
      </div>

      {/* ====================================================
          INFORMATION PANEL
      ==================================================== */}

      <div
        style={{
          marginTop: "30px",
          background: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "900px",
          border:
            "1px solid #BFDBFE",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#1E3A8A",
          }}
        >
          SmartChain Nexus Integrations
        </h3>

        <p
          style={{
            marginBottom: 0,
            color: "#1E40AF",
            lineHeight: "1.6",
          }}
        >
          Integrations allow SmartChain Nexus to
          connect with business intelligence,
          enterprise resource planning, AI,
          spreadsheet, and communication systems.
          Connection status is managed through the
          backend settings service.
        </p>
      </div>
    </div>
  );
}