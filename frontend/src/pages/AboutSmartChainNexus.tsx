import { useEffect, useState, type ReactNode } from "react";

type AboutRecord = {
  id: number;
  application_name: string;
  version: string;
  description: string | null;
  website: string | null;
  support_email: string | null;
  created_at: string;
  updated_at: string;
};

/* ==========================================================
   PROFESSIONAL SVG ICON SYSTEM
   No emoji dependencies.
========================================================== */

type IconName =
  | "building"
  | "rocket"
  | "globe"
  | "mail"
  | "package"
  | "chart"
  | "warehouse"
  | "truck"
  | "revenue"
  | "analytics"
  | "ai"
  | "forecast"
  | "users"
  | "shield"
  | "settings"
  | "check"
  | "alert"
  | "database"
  | "server"
  | "activity"
  | "layers"
  | "spark"
  | "trash"
  | "save"
  | "refresh";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

function Icon({
  name,
  size = 22,
  strokeWidth = 1.8,
  color = "currentColor",
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const icons: Record<IconName, ReactNode> = {
    building: (
      <>
        <path d="M4 21V5.5L12 3l8 2.5V21" />
        <path d="M8 21v-5h8v5" />
        <path d="M8 8h.01M12 8h.01M16 8h.01" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),

    rocket: (
      <>
        <path d="M14 4c2.5-2.5 6-2.5 6-2.5s0 3.5-2.5 6L13 12l-4-4 5-4Z" />
        <path d="M13 12 8 17l-4 1 1-4 5-5" />
        <path d="M8 17 5 20" />
        <path d="M15.5 5.5h.01" />
        <path d="M4 10l-2 2 3 1" />
        <path d="M14 20l2-2-1-3" />
      </>
    ),

    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9" />
        <path d="M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    package: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 4.5 8-4.5" />
        <path d="M12 12v9" />
        <path d="m8 5 8 4.5" />
      </>
    ),

    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
        <path d="M18 6h-3" />
        <path d="M18 6v3" />
      </>
    ),

    warehouse: (
      <>
        <path d="m3 10 9-6 9 6" />
        <path d="M5 9v10h14V9" />
        <path d="M8 19v-6h8v6" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </>
    ),

    truck: (
      <>
        <path d="M3 6h11v10H3z" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),

    revenue: (
      <>
        <path d="M12 3v18" />
        <path d="M17 7c-.7-1.2-2.1-2-4.3-2C10.2 5 8 6.3 8 8.2c0 2.2 2.2 3 4.3 3.5 2.5.6 4.7 1.3 4.7 3.6 0 2-2 3.7-4.9 3.7-2.4 0-4.2-.8-5.2-2.3" />
      </>
    ),

    analytics: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <rect x="7" y="13" width="2.5" height="4" rx=".5" />
        <rect x="11" y="10" width="2.5" height="7" rx=".5" />
        <rect x="15" y="7" width="2.5" height="10" rx=".5" />
      </>
    ),

    ai: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="3" />
        <path d="M9 10h6M9 14h4" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2" />
        <path d="M2 9h2M2 15h2M20 9h2M20 15h2" />
      </>
    ),

    forecast: (
      <>
        <path d="M4 17c3-6 5-8 8-5s5 2 8-4" />
        <path d="M17 8h3v3" />
        <path d="M4 20h16" />
      </>
    ),

    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8" />
        <path d="M18 14c1.8.8 3 2.5 3 4.5" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v2.6h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),

    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),

    alert: (
      <>
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),

    database: (
      <>
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
        <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
      </>
    ),

    server: (
      <>
        <rect x="4" y="3" width="16" height="7" rx="2" />
        <rect x="4" y="14" width="16" height="7" rx="2" />
        <path d="M8 6h.01M8 17h.01" />
        <path d="M12 6h5M12 17h5" />
      </>
    ),

    activity: (
      <>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </>
    ),

    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),

    spark: (
      <>
        <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
        <path d="m19 17 .7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z" />
      </>
    ),

    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h11l3 3v15H5z" />
        <path d="M8 3v6h7V3" />
        <path d="M8 21v-7h8v7" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14-5L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14 5l2-2" />
        <path d="M20 20v-4h-4" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function AboutSmartChainNexus() {
  const API_URL = "http://127.0.0.1:8000/settings/about";

  const [aboutId, setAboutId] = useState<number | null>(null);

  const [applicationName, setApplicationName] =
    useState("SmartChain Nexus");

  const [version, setVersion] =
    useState("1.0.0");

  const [description, setDescription] = useState(
    "SmartChain Nexus is an enterprise Supply Chain Intelligence Platform that combines Supply Chain Management, Artificial Intelligence, Business Intelligence, Data Science, Procurement, Inventory, Distribution, Fleet Management and Lean Six Sigma into one unified ecosystem."
  );

  const [website, setWebsite] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================================
     PLATFORM FEATURES
  ========================================================== */

  const features = [
    {
      title: "Procurement Management",
      description:
        "Manage procurement activities, purchasing workflows and supplier relationships.",
      icon: "package" as IconName,
      accent: "#2563EB",
      background: "#EFF6FF",
    },
    {
      title: "Inventory Management",
      description:
        "Monitor stock levels, inventory performance and replenishment requirements.",
      icon: "chart" as IconName,
      accent: "#10B981",
      background: "#ECFDF5",
    },
    {
      title: "Warehouse Operations",
      description:
        "Support warehouse visibility, operational efficiency and stock movement.",
      icon: "warehouse" as IconName,
      accent: "#F59E0B",
      background: "#FFFBEB",
    },
    {
      title: "Fleet & Distribution",
      description:
        "Improve distribution planning, fleet visibility and delivery performance.",
      icon: "truck" as IconName,
      accent: "#8B5CF6",
      background: "#F5F3FF",
    },
    {
      title: "Revenue Analytics",
      description:
        "Transform operational data into meaningful financial and commercial insights.",
      icon: "revenue" as IconName,
      accent: "#059669",
      background: "#ECFDF5",
    },
    {
      title: "Business Intelligence",
      description:
        "Deliver centralized dashboards and decision-support analytics.",
      icon: "analytics" as IconName,
      accent: "#2563EB",
      background: "#EFF6FF",
    },
    {
      title: "AI Assistant",
      description:
        "Use artificial intelligence to support supply chain analysis and recommendations.",
      icon: "ai" as IconName,
      accent: "#7C3AED",
      background: "#F5F3FF",
    },
    {
      title: "Demand Forecasting",
      description:
        "Support demand planning using analytical and predictive capabilities.",
      icon: "forecast" as IconName,
      accent: "#0891B2",
      background: "#ECFEFF",
    },
    {
      title: "Customer Segmentation",
      description:
        "Analyse customer behaviour and identify meaningful customer segments.",
      icon: "users" as IconName,
      accent: "#DB2777",
      background: "#FDF2F8",
    },
    {
      title: "Supplier Risk Prediction",
      description:
        "Identify potential supplier risks and support proactive decision-making.",
      icon: "shield" as IconName,
      accent: "#EA580C",
      background: "#FFF7ED",
    },
    {
      title: "Lean Six Sigma",
      description:
        "Apply process improvement methodologies to improve quality and efficiency.",
      icon: "settings" as IconName,
      accent: "#475569",
      background: "#F1F5F9",
    },
  ];

  /* ==========================================================
     LOAD ABOUT INFORMATION
  ========================================================== */

  const loadAbout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load About SmartChain Nexus settings. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const about: AboutRecord = data[0];

        setAboutId(about.id);
        setApplicationName(
          about.application_name || "SmartChain Nexus"
        );
        setVersion(about.version || "1.0.0");

        setDescription(
          about.description ||
            "SmartChain Nexus is an enterprise Supply Chain Intelligence Platform."
        );

        setWebsite(about.website || "");
        setSupportEmail(about.support_email || "");
        setCreatedAt(about.created_at || "");
        setUpdatedAt(about.updated_at || "");
      }
    } catch (err) {
      console.error(
        "About SmartChain Nexus loading error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load About SmartChain Nexus settings."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadAbout();
  }, []);

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        application_name: applicationName.trim(),
        version: version.trim(),
        description: description.trim(),
        website: website.trim() || null,
        support_email: supportEmail.trim() || null,
      };

      let response: Response;

      if (aboutId) {
        response = await fetch(
          `${API_URL}/${aboutId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        let errorMessage =
          "Failed to save About SmartChain Nexus settings.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          // Keep default message.
        }

        throw new Error(errorMessage);
      }

      const savedData: AboutRecord =
        await response.json();

      setAboutId(savedData.id);
      setApplicationName(savedData.application_name);
      setVersion(savedData.version);
      setDescription(savedData.description || "");
      setWebsite(savedData.website || "");
      setSupportEmail(savedData.support_email || "");
      setCreatedAt(savedData.created_at || "");
      setUpdatedAt(savedData.updated_at || "");

      setMessage(
        "About SmartChain Nexus information saved successfully."
      );
    } catch (err) {
      console.error(
        "About SmartChain Nexus save error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to save About SmartChain Nexus settings."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = async () => {
    if (!aboutId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the About SmartChain Nexus record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/${aboutId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to delete About SmartChain Nexus record.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          // Keep default message.
        }

        throw new Error(errorMessage);
      }

      setAboutId(null);
      setApplicationName("SmartChain Nexus");
      setVersion("1.0.0");

      setDescription(
        "SmartChain Nexus is an enterprise Supply Chain Intelligence Platform."
      );

      setWebsite("");
      setSupportEmail("");
      setCreatedAt("");
      setUpdatedAt("");

      setMessage(
        "About SmartChain Nexus record deleted successfully."
      );
    } catch (err) {
      console.error(
        "About SmartChain Nexus delete error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to delete About SmartChain Nexus record."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  /* ==========================================================
     DATE FORMAT
  ========================================================== */

  const formatDate = (date: string) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingWrapperStyle}>
          <div style={loadingCardStyle}>
            <div style={loadingIconStyle}>
              <Icon
                name="refresh"
                size={30}
                color="#2563EB"
              />
            </div>

            <h2 style={loadingTitleStyle}>
              Loading Platform Information
            </h2>

            <p style={loadingTextStyle}>
              Connecting to SmartChain Nexus backend...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <div style={pageStyle}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={headerStyle}>
        <div>
          <div style={eyebrowStyle}>
            <span style={eyebrowDotStyle} />
            PLATFORM INFORMATION
          </div>

          <h1 style={pageTitleStyle}>
            About SmartChain Nexus
          </h1>

          <p style={pageSubtitleStyle}>
            Enterprise Supply Chain Intelligence Platform
          </p>
        </div>

        <div style={versionBadgeStyle}>
          <span style={statusDotStyle} />
          <span>Version {version}</span>
        </div>
      </div>

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      {message && (
        <div style={successStyle}>
          <span style={successIconStyle}>
            <Icon
              name="check"
              size={16}
              color="#15803D"
              strokeWidth={2.4}
            />
          </span>

          <span>{message}</span>
        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div style={errorStyle}>
          <span style={errorIconStyle}>
            <Icon
              name="alert"
              size={16}
              color="#B91C1C"
              strokeWidth={2.2}
            />
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* ======================================================
          HERO
      ====================================================== */}

      <div style={heroCardStyle}>
        <div style={heroGlowOneStyle} />
        <div style={heroGlowTwoStyle} />

        <div style={heroContentStyle}>
          <div style={heroIconStyle}>
            <Icon
              name="layers"
              size={34}
              color="#FFFFFF"
              strokeWidth={1.7}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={heroLabelStyle}>
              ENTERPRISE PLATFORM
            </div>

            <h2 style={heroTitleStyle}>
              {applicationName}
            </h2>

            <p style={heroDescriptionStyle}>
              {description}
            </p>

            <div style={heroMetaStyle}>
              <div style={heroMetaItemStyle}>
                <span style={heroMetaLabelStyle}>
                  VERSION
                </span>

                <strong style={heroMetaValueStyle}>
                  {version}
                </strong>
              </div>

              <div style={heroDividerStyle} />

              <div style={heroMetaItemStyle}>
                <span style={heroMetaLabelStyle}>
                  STATUS
                </span>

                <strong
                  style={{
                    ...heroMetaValueStyle,
                    color: "#6EE7B7",
                  }}
                >
                  Operational
                </strong>
              </div>

              <div style={heroDividerStyle} />

              <div style={heroMetaItemStyle}>
                <span style={heroMetaLabelStyle}>
                  PLATFORM
                </span>

                <strong style={heroMetaValueStyle}>
                  Enterprise
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          PLATFORM OVERVIEW
      ====================================================== */}

      <div style={sectionHeaderStyle}>
        <div>
          <div style={sectionEyebrowStyle}>
            CORE PLATFORM
          </div>

          <h2 style={sectionTitleStyle}>
            Platform Overview
          </h2>

          <p style={sectionSubtitleStyle}>
            Core information and configuration for your
            SmartChain Nexus platform.
          </p>
        </div>
      </div>

      <div style={overviewGridStyle}>
        <InfoCard
          icon="building"
          iconColor="#2563EB"
          iconBackground="#EFF6FF"
          label="Application Name"
          value={applicationName}
        />

        <InfoCard
          icon="rocket"
          iconColor="#7C3AED"
          iconBackground="#F5F3FF"
          label="Current Version"
          value={version}
        />

        <InfoCard
          icon="globe"
          iconColor="#0891B2"
          iconBackground="#ECFEFF"
          label="Website"
          value={website || "Not configured"}
        />

        <InfoCard
          icon="mail"
          iconColor="#059669"
          iconBackground="#ECFDF5"
          label="Support Email"
          value={supportEmail || "Not configured"}
        />
      </div>

      {/* ======================================================
          PLATFORM CAPABILITIES
      ====================================================== */}

      <div style={sectionHeaderStyle}>
        <div>
          <div style={sectionEyebrowStyle}>
            SMARTCHAIN ECOSYSTEM
          </div>

          <h2 style={sectionTitleStyle}>
            Platform Capabilities
          </h2>

          <p style={sectionSubtitleStyle}>
            Integrated capabilities across the SmartChain
            Nexus ecosystem.
          </p>
        </div>

        <div style={featureCountStyle}>
          <Icon
            name="layers"
            size={15}
            color="#1D4ED8"
          />

          <span>{features.length} Capabilities</span>
        </div>
      </div>

      <div style={featuresGridStyle}>
        {features.map((feature, index) => (
          <div
            key={`${feature.title}-${index}`}
            style={featureCardStyle}
          >
            <div
              style={{
                ...featureIconStyle,
                background: feature.background,
                color: feature.accent,
              }}
            >
              <Icon
                name={feature.icon}
                size={22}
                color={feature.accent}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <h3 style={featureTitleStyle}>
                {feature.title}
              </h3>

              <p style={featureDescriptionStyle}>
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          PLATFORM CONFIGURATION
      ====================================================== */}

      <div style={sectionHeaderStyle}>
        <div>
          <div style={sectionEyebrowStyle}>
            ADMINISTRATION
          </div>

          <h2 style={sectionTitleStyle}>
            Platform Configuration
          </h2>

          <p style={sectionSubtitleStyle}>
            Manage the information displayed throughout
            SmartChain Nexus.
          </p>
        </div>
      </div>

      <div style={configurationCardStyle}>
        <div style={configurationHeaderStyle}>
          <div style={configurationIconStyle}>
            <Icon
              name="settings"
              size={21}
              color="#2563EB"
            />
          </div>

          <div>
            <h3 style={configurationTitleStyle}>
              Application Settings
            </h3>

            <p style={configurationSubtitleStyle}>
              Update the platform information stored in
              your backend.
            </p>
          </div>
        </div>

        <div style={configurationFieldsStyle}>
          {/* APPLICATION NAME */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Application Name
            </label>

            <div style={inputWrapperStyle}>
              <Icon
                name="building"
                size={18}
                color="#94A3B8"
              />

              <input
                type="text"
                value={applicationName}
                onChange={(e) =>
                  setApplicationName(e.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          {/* VERSION */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Version
            </label>

            <div style={inputWrapperStyle}>
              <Icon
                name="rocket"
                size={18}
                color="#94A3B8"
              />

              <input
                type="text"
                value={version}
                onChange={(e) =>
                  setVersion(e.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          {/* WEBSITE */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Website
            </label>

            <div style={inputWrapperStyle}>
              <Icon
                name="globe"
                size={18}
                color="#94A3B8"
              />

              <input
                type="url"
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value)
                }
                placeholder="https://example.com"
                style={inputStyle}
              />
            </div>
          </div>

          {/* SUPPORT EMAIL */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Support Email
            </label>

            <div style={inputWrapperStyle}>
              <Icon
                name="mail"
                size={18}
                color="#94A3B8"
              />

              <input
                type="email"
                value={supportEmail}
                onChange={(e) =>
                  setSupportEmail(e.target.value)
                }
                placeholder="support@example.com"
                style={inputStyle}
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div
            style={{
              ...fieldStyle,
              gridColumn: "1 / -1",
            }}
          >
            <label style={labelStyle}>
              Platform Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={6}
              style={textareaStyle}
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div style={actionsStyle}>
          <button
            onClick={handleSave}
            disabled={saving || deleting}
            style={{
              ...saveButtonStyle,
              opacity:
                saving || deleting ? 0.65 : 1,
              cursor:
                saving || deleting
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <Icon
              name="save"
              size={17}
              color="#FFFFFF"
            />

            <span>
              {saving
                ? "Saving..."
                : aboutId
                ? "Save Changes"
                : "Create Platform Record"}
            </span>
          </button>

          {aboutId && (
            <button
              onClick={handleDelete}
              disabled={saving || deleting}
              style={{
                ...deleteButtonStyle,
                opacity:
                  saving || deleting ? 0.65 : 1,
                cursor:
                  saving || deleting
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <Icon
                name="trash"
                size={17}
                color="#DC2626"
              />

              <span>
                {deleting
                  ? "Deleting..."
                  : "Delete Record"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          SYSTEM INFORMATION
      ====================================================== */}

      <div style={sectionHeaderStyle}>
        <div>
          <div style={sectionEyebrowStyle}>
            SYSTEM METADATA
          </div>

          <h2 style={sectionTitleStyle}>
            System Information
          </h2>

          <p style={sectionSubtitleStyle}>
            Backend record and platform metadata.
          </p>
        </div>
      </div>

      <div style={systemInfoCardStyle}>
        <div style={systemInfoHeaderStyle}>
          <div style={systemInfoHeaderIconStyle}>
            <Icon
              name="server"
              size={22}
              color="#93C5FD"
            />
          </div>

          <div>
            <div style={systemInfoHeaderTitleStyle}>
              SmartChain Nexus Infrastructure
            </div>

            <div style={systemInfoHeaderSubtitleStyle}>
              Backend connection and record metadata
            </div>
          </div>

          <div style={connectedBadgeStyle}>
            <span style={connectedDotStyle} />
            Connected
          </div>
        </div>

        <div style={systemInfoGridStyle}>
          <SystemInfoItem
            icon="database"
            label="Record ID"
            value={aboutId || "Not created"}
          />

          <SystemInfoItem
            icon="activity"
            label="Created"
            value={formatDate(createdAt)}
          />

          <SystemInfoItem
            icon="refresh"
            label="Last Updated"
            value={formatDate(updatedAt)}
          />

          <SystemInfoItem
            icon="server"
            label="Backend Status"
            value="Connected"
            valueColor="#6EE7B7"
          />
        </div>
      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div style={footerStyle}>
        <div style={footerBrandStyle}>
          <div style={footerBrandIconStyle}>
            <Icon
              name="layers"
              size={17}
              color="#2563EB"
            />
          </div>

          <div>
            <strong style={footerBrandTitleStyle}>
              {applicationName}
            </strong>

            <span style={footerBrandTextStyle}>
              Enterprise Supply Chain Intelligence Platform
            </span>
          </div>
        </div>

        <div style={footerCopyrightStyle}>
          © 2026 SmartChain Nexus
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   SMALL REUSABLE COMPONENTS
========================================================== */

function InfoCard({
  icon,
  iconColor,
  iconBackground,
  label,
  value,
}: {
  icon: IconName;
  iconColor: string;
  iconBackground: string;
  label: string;
  value: string;
}) {
  return (
    <div style={infoCardStyle}>
      <div
        style={{
          ...infoIconStyle,
          background: iconBackground,
          color: iconColor,
        }}
      >
        <Icon
          name={icon}
          size={22}
          color={iconColor}
        />
      </div>

      <div style={{ minWidth: 0 }}>
        <p style={infoLabelStyle}>{label}</p>

        <p style={infoValueStyle}>{value}</p>
      </div>
    </div>
  );
}

function SystemInfoItem({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: IconName;
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div style={systemInfoItemStyle}>
      <div style={systemInfoIconStyle}>
        <Icon
          name={icon}
          size={17}
          color="#93C5FD"
        />
      </div>

      <span style={systemInfoLabelStyle}>
        {label}
      </span>

      <strong
        style={{
          ...systemInfoValueStyle,
          color: valueColor || "#FFFFFF",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* ==========================================================
   PAGE
========================================================== */

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "36px 45px 60px 45px",
  background: "#F8FAFC",
  boxSizing: "border-box" as const,
};

/* ==========================================================
   HEADER
========================================================== */

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "25px",
  marginBottom: "30px",
  flexWrap: "wrap" as const,
};

const eyebrowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1.7px",
  color: "#2563EB",
  marginBottom: "9px",
};

const eyebrowDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#10B981",
  boxShadow: "0 0 0 4px rgba(16,185,129,.10)",
};

const pageTitleStyle = {
  fontSize: "38px",
  lineHeight: 1.15,
  fontWeight: 800,
  color: "#0F172A",
  margin: "0",
  letterSpacing: "-0.8px",
};

const pageSubtitleStyle = {
  color: "#64748B",
  marginTop: "9px",
  marginBottom: 0,
  fontSize: "15px",
};

const versionBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  color: "#334155",
  padding: "11px 16px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: 700,
  boxShadow: "0 5px 16px rgba(15,23,42,.05)",
};

const statusDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#10B981",
  boxShadow: "0 0 0 4px rgba(16,185,129,.10)",
};

/* ==========================================================
   MESSAGES
========================================================== */

const successStyle = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  background: "#F0FDF4",
  color: "#166534",
  border: "1px solid #BBF7D0",
  padding: "13px 16px",
  borderRadius: "11px",
  marginBottom: "22px",
  fontSize: "14px",
  fontWeight: 600,
};

const errorStyle = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  background: "#FEF2F2",
  color: "#991B1B",
  border: "1px solid #FECACA",
  padding: "13px 16px",
  borderRadius: "11px",
  marginBottom: "22px",
  fontSize: "14px",
  fontWeight: 600,
};

const successIconStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  background: "#DCFCE7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const errorIconStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  background: "#FEE2E2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

/* ==========================================================
   HERO
========================================================== */

const heroCardStyle = {
  position: "relative" as const,
  overflow: "hidden",
  background:
    "linear-gradient(135deg, #0F172A 0%, #172554 52%, #1D4ED8 100%)",
  borderRadius: "18px",
  padding: "34px",
  marginBottom: "38px",
  boxShadow:
    "0 16px 35px rgba(15,23,42,.16)",
  color: "#FFFFFF",
};

const heroGlowOneStyle = {
  position: "absolute" as const,
  width: "250px",
  height: "250px",
  borderRadius: "50%",
  background:
    "rgba(37,99,235,.18)",
  filter: "blur(5px)",
  right: "-90px",
  top: "-110px",
};

const heroGlowTwoStyle = {
  position: "absolute" as const,
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background:
    "rgba(16,185,129,.10)",
  filter: "blur(5px)",
  left: "40%",
  bottom: "-130px",
};

const heroContentStyle = {
  position: "relative" as const,
  zIndex: 2,
  display: "flex",
  alignItems: "flex-start",
  gap: "24px",
};

const heroIconStyle = {
  width: "68px",
  height: "68px",
  borderRadius: "17px",
  background:
    "linear-gradient(145deg, rgba(59,130,246,.35), rgba(37,99,235,.12))",
  border:
    "1px solid rgba(255,255,255,.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow:
    "0 10px 25px rgba(0,0,0,.15)",
};

const heroLabelStyle = {
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1.7px",
  color: "#93C5FD",
  marginBottom: "8px",
};

const heroTitleStyle = {
  fontSize: "30px",
  lineHeight: 1.2,
  fontWeight: 800,
  margin: "0 0 11px 0",
  letterSpacing: "-0.4px",
};

const heroDescriptionStyle = {
  color: "#CBD5E1",
  lineHeight: "1.7",
  maxWidth: "900px",
  margin: "0",
  fontSize: "14px",
};

const heroMetaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  marginTop: "24px",
  flexWrap: "wrap" as const,
};

const heroMetaItemStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
};

const heroMetaLabelStyle = {
  color: "#94A3B8",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "1px",
};

const heroMetaValueStyle = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,
};

const heroDividerStyle = {
  width: "1px",
  height: "32px",
  background: "rgba(255,255,255,.13)",
};

/* ==========================================================
   SECTION HEADERS
========================================================== */

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "18px",
  marginTop: "38px",
  flexWrap: "wrap" as const,
};

const sectionEyebrowStyle = {
  fontSize: "10px",
  fontWeight: 800,
  color: "#94A3B8",
  letterSpacing: "1.6px",
  marginBottom: "5px",
};

const sectionTitleStyle = {
  margin: "0",
  fontSize: "23px",
  lineHeight: 1.25,
  fontWeight: 800,
  color: "#0F172A",
  letterSpacing: "-0.3px",
};

const sectionSubtitleStyle = {
  margin: "6px 0 0 0",
  color: "#64748B",
  fontSize: "14px",
};

const featureCountStyle = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  background: "#EFF6FF",
  border: "1px solid #DBEAFE",
  color: "#1D4ED8",
  padding: "9px 13px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
};

/* ==========================================================
   OVERVIEW
========================================================== */

const overviewGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
};

const infoCardStyle = {
  background: "#FFFFFF",
  borderRadius: "14px",
  padding: "20px",
  minHeight: "104px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 6px 18px rgba(15,23,42,.045)",
  boxSizing: "border-box" as const,
};

const infoIconStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const infoLabelStyle = {
  margin: "0 0 5px 0",
  color: "#64748B",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: ".5px",
};

const infoValueStyle = {
  margin: "0",
  color: "#0F172A",
  fontSize: "15px",
  fontWeight: 800,
  wordBreak: "break-word" as const,
};

/* ==========================================================
   FEATURES
========================================================== */

const featuresGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "18px",
};

const featureCardStyle = {
  background: "#FFFFFF",
  borderRadius: "14px",
  padding: "20px",
  minHeight: "126px",
  border: "1px solid #E2E8F0",
  display: "flex",
  gap: "15px",
  boxShadow:
    "0 5px 16px rgba(15,23,42,.035)",
  boxSizing: "border-box" as const,
};

const featureIconStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const featureTitleStyle = {
  margin: "1px 0 7px 0",
  color: "#0F172A",
  fontSize: "14px",
  lineHeight: 1.35,
  fontWeight: 800,
};

const featureDescriptionStyle = {
  margin: "0",
  color: "#64748B",
  fontSize: "12.5px",
  lineHeight: "1.6",
};

/* ==========================================================
   CONFIGURATION
========================================================== */

const configurationCardStyle = {
  background: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 8px 22px rgba(15,23,42,.05)",
  overflow: "hidden",
};

const configurationHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  padding: "22px 25px",
  borderBottom: "1px solid #E2E8F0",
  background: "#FBFDFF",
};

const configurationIconStyle = {
  width: "43px",
  height: "43px",
  borderRadius: "11px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const configurationTitleStyle = {
  margin: 0,
  color: "#0F172A",
  fontSize: "15px",
  fontWeight: 800,
};

const configurationSubtitleStyle = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const configurationFieldsStyle = {
  padding: "26px",
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "22px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column" as const,
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 800,
  color: "#334155",
  marginBottom: "8px",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  minHeight: "44px",
  padding: "0 13px",
  border: "1px solid #CBD5E1",
  borderRadius: "10px",
  background: "#FFFFFF",
  boxSizing: "border-box" as const,
};

const inputStyle = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#0F172A",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const textareaStyle = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #CBD5E1",
  borderRadius: "10px",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "14px",
  boxSizing: "border-box" as const,
  outline: "none",
  resize: "vertical" as const,
  lineHeight: "1.6",
  fontFamily: "inherit",
};

const actionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  padding: "20px 26px",
  borderTop: "1px solid #E2E8F0",
  background: "#FBFDFF",
  flexWrap: "wrap" as const,
};

const saveButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  border: "none",
  padding: "12px 20px",
  borderRadius: "9px",
  fontWeight: 800,
  fontSize: "13px",
  boxShadow:
    "0 7px 16px rgba(37,99,235,.18)",
};

const deleteButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  background: "#FFFFFF",
  color: "#DC2626",
  border: "1px solid #FECACA",
  padding: "11px 19px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "13px",
};

/* ==========================================================
   SYSTEM INFORMATION
========================================================== */

const systemInfoCardStyle = {
  background:
    "linear-gradient(135deg, #0F172A 0%, #172554 100%)",
  borderRadius: "16px",
  padding: "25px",
  color: "#FFFFFF",
  boxShadow:
    "0 12px 28px rgba(15,23,42,.13)",
};

const systemInfoHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  paddingBottom: "21px",
  marginBottom: "20px",
  borderBottom:
    "1px solid rgba(255,255,255,.10)",
};

const systemInfoHeaderIconStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "11px",
  background:
    "rgba(59,130,246,.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const systemInfoHeaderTitleStyle = {
  fontSize: "14px",
  fontWeight: 800,
  color: "#FFFFFF",
};

const systemInfoHeaderSubtitleStyle = {
  fontSize: "12px",
  color: "#94A3B8",
  marginTop: "3px",
};

const connectedBadgeStyle = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  padding: "7px 10px",
  borderRadius: "999px",
  background:
    "rgba(16,185,129,.10)",
  color: "#6EE7B7",
  border:
    "1px solid rgba(16,185,129,.18)",
  fontSize: "11px",
  fontWeight: 800,
};

const connectedDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#10B981",
};

const systemInfoGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "20px",
};

const systemInfoItemStyle = {
  position: "relative" as const,
  display: "flex",
  flexDirection: "column" as const,
  gap: "7px",
  padding: "16px",
  borderRadius: "11px",
  background:
    "rgba(255,255,255,.035)",
  border:
    "1px solid rgba(255,255,255,.06)",
};

const systemInfoIconStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "8px",
  background:
    "rgba(59,130,246,.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "3px",
};

const systemInfoLabelStyle = {
  color: "#94A3B8",
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const systemInfoValueStyle = {
  color: "#FFFFFF",
  fontSize: "13px",
  lineHeight: 1.4,
  wordBreak: "break-word" as const,
};

/* ==========================================================
   FOOTER
========================================================== */

const footerStyle = {
  marginTop: "38px",
  paddingTop: "22px",
  borderTop: "1px solid #E2E8F0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  color: "#64748B",
  fontSize: "12px",
  flexWrap: "wrap" as const,
};

const footerBrandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const footerBrandIconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "9px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const footerBrandTitleStyle = {
  display: "block",
  color: "#0F172A",
  fontSize: "12px",
  fontWeight: 800,
};

const footerBrandTextStyle = {
  display: "block",
  color: "#64748B",
  marginTop: "2px",
};

const footerCopyrightStyle = {
  color: "#94A3B8",
};

/* ==========================================================
   LOADING
========================================================== */

const loadingWrapperStyle = {
  minHeight: "70vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const loadingCardStyle = {
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "55px 40px",
  textAlign: "center" as const,
  boxShadow:
    "0 12px 30px rgba(15,23,42,.07)",
  border: "1px solid #E2E8F0",
  width: "100%",
  maxWidth: "600px",
};

const loadingIconStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "16px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 18px",
};

const loadingTitleStyle = {
  margin: "0",
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: 800,
};

const loadingTextStyle = {
  color: "#64748B",
  fontSize: "14px",
  marginTop: "8px",
};