import { useEffect, useState } from "react";

import { executiveIntelligenceService } from "../services/executiveIntelligenceService";

type BusinessKPI = {
  id: number;
  name: string;
  category: string;
  value: number;
  target: number;
  unit: string;
  status: string;
};

type KPIFormData = {
  name: string;
  category: string;
  value: number;
  target: number;
  unit: string;
  status: string;
};

const emptyForm: KPIFormData = {
  name: "",
  category: "",
  value: 0,
  target: 0,
  unit: "%",
  status: "On Target",
};

export default function BusinessKPIs() {
  const [kpis, setKpis] = useState<BusinessKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingKPI, setEditingKPI] =
    useState<BusinessKPI | null>(null);

  const [formData, setFormData] =
    useState<KPIFormData>(emptyForm);

  useEffect(() => {
    loadBusinessKPIs();
  }, []);

  async function loadBusinessKPIs() {
    try {
      setLoading(true);

      const data =
        await executiveIntelligenceService.getBusinessKPIs();

      setKpis(data);
    } catch (error) {
      console.error(
        "Failed to load Business KPIs:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    field: keyof KPIFormData,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]:
        field === "value" || field === "target"
          ? Number(value)
          : value,
    }));
  }

  function openCreateForm() {
    setEditingKPI(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  }

  function openEditForm(kpi: BusinessKPI) {
    setEditingKPI(kpi);

    setFormData({
      name: kpi.name,
      category: kpi.category,
      value: kpi.value,
      target: kpi.target,
      unit: kpi.unit,
      status: kpi.status,
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingKPI(null);
    setFormData({ ...emptyForm });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      if (editingKPI) {
        await executiveIntelligenceService.updateBusinessKPI(
          editingKPI.id,
          formData
        );
      } else {
        await executiveIntelligenceService.createBusinessKPI(
          formData
        );
      }

      await loadBusinessKPIs();

      closeForm();
    } catch (error) {
      console.error(
        "Failed to save Business KPI:",
        error
      );

      alert("Failed to save Business KPI.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(kpiId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Business KPI?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await executiveIntelligenceService.deleteBusinessKPI(
        kpiId
      );

      await loadBusinessKPIs();
    } catch (error) {
      console.error(
        "Failed to delete Business KPI:",
        error
      );

      alert("Failed to delete Business KPI.");
    }
  }

  function getStatusColor(status: string) {
    const normalized = status.toLowerCase();

    if (
      normalized === "healthy" ||
      normalized === "good" ||
      normalized === "on target"
    ) {
      return "#16A34A";
    }

    if (
      normalized === "warning" ||
      normalized === "attention"
    ) {
      return "#F59E0B";
    }

    if (
      normalized === "critical" ||
      normalized === "poor"
    ) {
      return "#DC2626";
    }

    return "#2563EB";
  }

  function getStatusBackground(status: string) {
    const normalized = status.toLowerCase();

    if (
      normalized === "healthy" ||
      normalized === "good" ||
      normalized === "on target"
    ) {
      return "#E8FBF0";
    }

    if (
      normalized === "warning" ||
      normalized === "attention"
    ) {
      return "#FFF7E6";
    }

    if (
      normalized === "critical" ||
      normalized === "poor"
    ) {
      return "#FEF2F2";
    }

    return "#EEF4FF";
  }

  function getIcon(category: string) {
    const normalized = category.toLowerCase();

    if (normalized.includes("supplier")) {
      return "🚚";
    }

    if (normalized.includes("inventory")) {
      return "🏬";
    }

    if (normalized.includes("sales")) {
      return "💰";
    }

    if (normalized.includes("financial")) {
      return "📊";
    }

    if (normalized.includes("customer")) {
      return "👥";
    }

    if (normalized.includes("operational")) {
      return "⚙️";
    }

    return "📈";
  }

  const totalKPIs = kpis.length;

  const healthyKPIs = kpis.filter((kpi) => {
    const status = kpi.status.toLowerCase();

    return (
      status === "healthy" ||
      status === "good" ||
      status === "on target"
    );
  }).length;

  const attentionKPIs = kpis.filter((kpi) => {
    const status = kpi.status.toLowerCase();

    return (
      status === "warning" ||
      status === "attention"
    );
  }).length;

  const criticalKPIs = kpis.filter((kpi) => {
    const status = kpi.status.toLowerCase();

    return (
      status === "critical" ||
      status === "poor"
    );
  }).length;

  if (loading) {
    return (
      <div style={page}>
        <div style={loadingCard}>
          <div style={loadingIcon}>📊</div>

          <h2 style={loadingTitle}>
            Loading Business KPIs
          </h2>

          <p style={loadingText}>
            Loading strategic business performance indicators...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      {/* HEADER */}

      <div style={header}>
        <div style={headerLeft}>
          <div style={headerIcon}>
            📊
            <div style={onlineDot} />
          </div>

          <div>
            <h1 style={title}>
              Business KPIs
            </h1>

            <p style={subtitle}>
              Monitor strategic business performance indicators
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          style={addButton}
        >
          <span style={addIcon}>⊕</span>
          Add KPI
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div style={summaryGrid}>
        <SummaryCard
          title="Total KPIs"
          value={totalKPIs}
          description="Registered indicators"
          icon="📊"
          color="#2563EB"
          background="#EEF4FF"
        />

        <SummaryCard
          title="On Target"
          value={healthyKPIs}
          description="Healthy performance"
          icon="✓"
          color="#16A34A"
          background="#E8FBF0"
        />

        <SummaryCard
          title="Attention"
          value={attentionKPIs}
          description="Needs monitoring"
          icon="◌"
          color="#F59E0B"
          background="#FFF7E6"
        />

        <SummaryCard
          title="Critical"
          value={criticalKPIs}
          description="Requires action"
          icon="⚠"
          color="#DC2626"
          background="#FEF2F2"
        />
      </div>

      {/* KPI SECTION */}

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <div style={sectionTitleWrapper}>
            <div style={sectionIcon}>
              📈
            </div>

            <div>
              <h2 style={sectionTitle}>
                Performance Indicators
              </h2>

              <p style={sectionSubtitle}>
                Real-time strategic business performance
              </p>
            </div>
          </div>
        </div>

        {kpis.length === 0 ? (
          <div style={emptyState}>
            <div style={emptyIcon}>
              📊
            </div>

            <h3 style={emptyTitle}>
              No Business KPIs Available
            </h3>

            <p style={emptyText}>
              Create your first Business KPI to begin
              monitoring business performance.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              style={emptyButton}
            >
              + Create First KPI
            </button>
          </div>
        ) : (
          <div style={kpiGrid}>
            {kpis.map((item) => {
              const color =
                getStatusColor(item.status);

              const statusBackground =
                getStatusBackground(item.status);

              return (
                <div
                  key={item.id}
                  style={{
                    ...kpiCard,
                    borderTop:
                      `4px solid ${color}`,
                  }}
                >
                  <div style={kpiTop}>
                    <div
                      style={{
                        ...kpiIcon,
                        background:
                          statusBackground,
                        color,
                      }}
                    >
                      {getIcon(item.category)}
                    </div>

                    <div style={actions}>
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(item)
                        }
                        style={editButton}
                        title="Edit KPI"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        style={deleteButton}
                        title="Delete KPI"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div style={kpiName}>
                    {item.name}
                  </div>

                  <div style={kpiCategory}>
                    {item.category}
                  </div>

                  <div
                    style={{
                      ...kpiValue,
                      color,
                    }}
                  >
                    {item.value}
                    {item.unit}
                  </div>

                  <div style={targetRow}>
                    <span>
                      Target
                    </span>

                    <strong>
                      {item.target}
                      {item.unit}
                    </strong>
                  </div>

                  <div style={statusRow}>
                    <span
                      style={{
                        ...statusBadge,
                        background:
                          statusBackground,
                        color,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <div style={modalHeader}>
              <div style={modalHeaderLeft}>
                <div style={modalIcon}>
                  {editingKPI ? "✎" : "📊"}
                </div>

                <div>
                  <h2 style={modalTitle}>
                    {editingKPI
                      ? "Edit Business KPI"
                      : "Add Business KPI"}
                  </h2>

                  <p style={modalSubtitle}>
                    {editingKPI
                      ? "Update the selected performance indicator"
                      : "Create a new strategic performance indicator"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                style={closeButton}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
            >
              <div style={formGrid}>
                <div style={field}>
                  <label style={label}>
                    KPI Name *
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      handleInputChange(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Revenue Growth"
                    required
                    disabled={saving}
                    style={input}
                  />
                </div>

                <div style={field}>
                  <label style={label}>
                    Category *
                  </label>

                  <input
                    type="text"
                    value={formData.category}
                    onChange={(event) =>
                      handleInputChange(
                        "category",
                        event.target.value
                      )
                    }
                    placeholder="Financial"
                    required
                    disabled={saving}
                    style={input}
                  />
                </div>

                <div style={field}>
                  <label style={label}>
                    Current Value *
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(event) =>
                      handleInputChange(
                        "value",
                        event.target.value
                      )
                    }
                    required
                    disabled={saving}
                    style={input}
                  />
                </div>

                <div style={field}>
                  <label style={label}>
                    Target *
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={formData.target}
                    onChange={(event) =>
                      handleInputChange(
                        "target",
                        event.target.value
                      )
                    }
                    required
                    disabled={saving}
                    style={input}
                  />
                </div>

                <div style={field}>
                  <label style={label}>
                    Unit *
                  </label>

                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(event) =>
                      handleInputChange(
                        "unit",
                        event.target.value
                      )
                    }
                    placeholder="%"
                    required
                    disabled={saving}
                    style={input}
                  />
                </div>

                <div style={field}>
                  <label style={label}>
                    Status *
                  </label>

                  <select
                    value={formData.status}
                    onChange={(event) =>
                      handleInputChange(
                        "status",
                        event.target.value
                      )
                    }
                    required
                    disabled={saving}
                    style={input}
                  >
                    <option value="Healthy">
                      Healthy
                    </option>

                    <option value="Good">
                      Good
                    </option>

                    <option value="On Target">
                      On Target
                    </option>

                    <option value="Warning">
                      Warning
                    </option>

                    <option value="Attention">
                      Attention
                    </option>

                    <option value="Critical">
                      Critical
                    </option>

                    <option value="Poor">
                      Poor
                    </option>
                  </select>
                </div>
              </div>

              <div style={modalFooter}>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  style={cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...saveButton,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingKPI
                    ? "Save Changes"
                    : "Create KPI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
  icon: string;
  color: string;
  background: string;
};

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
  background,
}: SummaryCardProps) {
  return (
    <div style={summaryCard}>
      <div
        style={{
          ...summaryIcon,
          background,
          color,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            ...summaryTitle,
            color,
          }}
        >
          {title}
        </div>

        <div style={summaryValue}>
          {value}
        </div>

        <div style={summaryDescription}>
          {description}
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  width: "100%",
  minHeight: "100%",
  padding: "8px 4px 40px",
  boxSizing: "border-box",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "28px",
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const headerIcon: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #7EA2FF 0%, #4F73E8 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "29px",
  position: "relative",
  boxShadow:
    "0 8px 20px rgba(37,99,235,.18)",
};

const onlineDot: React.CSSProperties = {
  position: "absolute",
  right: "4px",
  bottom: "4px",
  width: "11px",
  height: "11px",
  borderRadius: "50%",
  background: "#22C55E",
  border: "2px solid white",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#0F172A",
  letterSpacing: "-1.2px",
};

const subtitle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: "14px",
  color: "#64748B",
};

const addButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg, #2563EB 0%, #315FEA 100%)",
  color: "#FFFFFF",
  padding: "13px 20px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow:
    "0 7px 18px rgba(37,99,235,.22)",
};

const addIcon: React.CSSProperties = {
  fontSize: "19px",
  lineHeight: 1,
};

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "28px",
};

const summaryCard: React.CSSProperties = {
  minHeight: "125px",
  background: "#FFFFFF",
  border: "1px solid #E6EBF3",
  borderRadius: "14px",
  padding: "19px",
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  boxSizing: "border-box",
  boxShadow:
    "0 5px 18px rgba(15,23,42,.055)",
};

const summaryIcon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
};

const summaryTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "5px",
};

const summaryValue: React.CSSProperties = {
  fontSize: "27px",
  fontWeight: 800,
  color: "#0F172A",
};

const summaryDescription: React.CSSProperties = {
  marginTop: "8px",
  color: "#64748B",
  fontSize: "11px",
};

const sectionCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
};

const sectionHeader: React.CSSProperties = {
  padding: "22px 24px 20px",
  borderBottom: "1px solid #EEF1F5",
};

const sectionTitleWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const sectionIcon: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17px",
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "18px",
  fontWeight: 750,
};

const sectionSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const kpiGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  padding: "22px",
};

const kpiCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E6EBF3",
  borderRadius: "14px",
  padding: "19px",
  boxShadow:
    "0 4px 15px rgba(15,23,42,.045)",
};

const kpiTop: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const kpiIcon: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: "6px",
};

const editButton: React.CSSProperties = {
  width: "31px",
  height: "31px",
  border: "none",
  borderRadius: "8px",
  background: "#EEF4FF",
  color: "#2563EB",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 700,
};

const deleteButton: React.CSSProperties = {
  width: "31px",
  height: "31px",
  border: "none",
  borderRadius: "8px",
  background: "#FEF2F2",
  color: "#DC2626",
  cursor: "pointer",
  fontSize: "19px",
  fontWeight: 700,
};

const kpiName: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "16px",
  fontWeight: 750,
  marginBottom: "5px",
};

const kpiCategory: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "12px",
  marginBottom: "13px",
};

const kpiValue: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 800,
};

const targetRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  paddingTop: "13px",
  borderTop: "1px solid #EEF1F5",
  color: "#64748B",
  fontSize: "12px",
};

const statusRow: React.CSSProperties = {
  marginTop: "12px",
};

const statusBadge: React.CSSProperties = {
  display: "inline-flex",
  padding: "5px 9px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 700,
};

const emptyState: React.CSSProperties = {
  padding: "55px 25px",
  textAlign: "center",
};

const emptyIcon: React.CSSProperties = {
  width: "60px",
  height: "60px",
  margin: "0 auto 15px",
  borderRadius: "16px",
  background: "#EEF4FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};

const emptyTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "18px",
};

const emptyText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  margin: "8px 0 20px",
};

const emptyButton: React.CSSProperties = {
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  padding: "11px 18px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: 700,
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.55)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  width: "100%",
  maxWidth: "680px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "20px",
  boxShadow:
    "0 25px 70px rgba(15,23,42,.25)",
  border: "1px solid #E5EAF1",
};

const modalHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "15px",
  padding: "24px 26px",
  borderBottom: "1px solid #EEF2F7",
};

const modalHeaderLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const modalIcon: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "13px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
};

const modalTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: 800,
};

const modalSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const closeButton: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: "none",
  background: "#F1F5F9",
  color: "#64748B",
  fontSize: "23px",
  cursor: "pointer",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
  padding: "24px 26px",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

const label: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#334155",
};

const input: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 13px",
  borderRadius: "10px",
  border: "1px solid #D8E0EA",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const modalFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  padding: "18px 26px",
  borderTop: "1px solid #EEF2F7",
  background: "#FAFBFD",
  borderRadius: "0 0 20px 20px",
};

const cancelButton: React.CSSProperties = {
  border: "1px solid #D8E0EA",
  background: "#FFFFFF",
  color: "#334155",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "13px",
};

const saveButton: React.CSSProperties = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563EB 0%, #315FEA 100%)",
  color: "#FFFFFF",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "13px",
};

const loadingCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E6EBF3",
  borderRadius: "16px",
  padding: "55px 25px",
  textAlign: "center",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
};

const loadingIcon: React.CSSProperties = {
  fontSize: "38px",
  marginBottom: "12px",
};

const loadingTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "20px",
};

const loadingText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  marginTop: "8px",
};