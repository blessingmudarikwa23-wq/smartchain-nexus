import { useEffect, useState } from "react";

interface SIPOCRecord {
  id: number;
  process_name: string;
  suppliers: string;
  inputs: string;
  process: string;
  outputs: string;
  customers: string;
  status: string;
}

interface SIPOCFormData {
  process_name: string;
  suppliers: string;
  inputs: string;
  process: string;
  outputs: string;
  customers: string;
  status: string;
}

const API_URL = "http://127.0.0.1:8000/lean-six-sigma/sipoc";

const emptyForm: SIPOCFormData = {
  process_name: "",
  suppliers: "",
  inputs: "",
  process: "",
  outputs: "",
  customers: "",
  status: "Active",
};

export default function SIPOC() {
  const [sipocRecords, setSipocRecords] = useState<SIPOCRecord[]>([]);

  const [formData, setFormData] =
    useState<SIPOCFormData>(emptyForm);

  const [loading, setLoading] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  useEffect(() => {
    loadSIPOC();
  }, []);

  async function loadSIPOC(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load SIPOC records.");
      }

      const data: SIPOCRecord[] = await response.json();

      setSipocRecords(data);
    } catch (error) {
      console.error("SIPOC loading error:", error);

      setError(
        "Unable to load SIPOC data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openCreateForm(): void {
    setEditingId(null);
    setFormData(emptyForm);
    setSuccessMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(record: SIPOCRecord): void {
    setEditingId(record.id);

    setFormData({
      process_name: record.process_name,
      suppliers: record.suppliers,
      inputs: record.inputs,
      process: record.process,
      outputs: record.outputs,
      customers: record.customers,
      status: record.status,
    });

    setSuccessMessage("");
    setError("");
    setShowForm(true);
  }

  function closeForm(): void {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${
              editingId === null ? "create" : "update"
            } SIPOC process.`
        );
      }

      if (editingId === null) {
        setSuccessMessage(
          "SIPOC process created successfully."
        );
      } else {
        setSuccessMessage(
          "SIPOC process updated successfully."
        );
      }

      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadSIPOC();
    } catch (error) {
      console.error("SIPOC save error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the SIPOC process."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: number,
    processName: string
  ): Promise<void> {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${processName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete SIPOC process."
        );
      }

      setSuccessMessage(
        "SIPOC process deleted successfully."
      );

      await loadSIPOC();
    } catch (error) {
      console.error("SIPOC delete error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete SIPOC process."
      );
    }
  }

  const supplierCount = new Set(
    sipocRecords
      .map((item) => item.suppliers.trim())
      .filter(Boolean)
  ).size;

  const processCount = new Set(
    sipocRecords
      .map((item) => item.process.trim())
      .filter(Boolean)
  ).size;

  const customerCount = new Set(
    sipocRecords
      .map((item) => item.customers.trim())
      .filter(Boolean)
  ).size;

  const activeCount = sipocRecords.filter(
    (item) => item.status.toLowerCase() === "active"
  ).length;

  return (
    <div
      style={{
        padding: "30px",
        background: "#F8FAFC",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            SIPOC Analysis
          </h1>

          <p
            style={{
              color: "#64748B",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Suppliers, Inputs, Process, Outputs and Customers.
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
            onClick={loadSIPOC}
            style={{
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              padding: "11px 18px",
              borderRadius: "9px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            style={{
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              padding: "11px 20px",
              borderRadius: "9px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow:
                "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            + Create Process
          </button>
        </div>
      </div>

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
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#15803D",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {successMessage}
        </div>
      )}

      {showForm && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "30px",
            boxShadow:
              "0 8px 24px rgba(15, 23, 42, 0.08)",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                {editingId === null
                  ? "Create SIPOC Process"
                  : "Edit SIPOC Process"}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Define the complete SIPOC process structure.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              style={{
                border: "none",
                background: "#F1F5F9",
                color: "#475569",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    color: "#334155",
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "7px",
                  }}
                >
                  Process Name
                </label>

                <input
                  type="text"
                  name="process_name"
                  value={formData.process_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Order Fulfilment"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={labelStyle}
                >
                  Supplier
                </label>

                <input
                  type="text"
                  name="suppliers"
                  value={formData.suppliers}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Raw Material Supplier"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={labelStyle}
                >
                  Input
                </label>

                <input
                  type="text"
                  name="inputs"
                  value={formData.inputs}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Customer Order"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={labelStyle}
                >
                  Process
                </label>

                <input
                  type="text"
                  name="process"
                  value={formData.process}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Pick, Pack & Dispatch"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={labelStyle}
                >
                  Output
                </label>

                <input
                  type="text"
                  name="outputs"
                  value={formData.outputs}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Completed Order"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={labelStyle}
                >
                  Customer
                </label>

                <input
                  type="text"
                  name="customers"
                  value={formData.customers}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. End Customer"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={labelStyle}
                >
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={inputStyle}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={closeForm}
                style={{
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#475569",
                  padding: "11px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  border: "none",
                  background: saving
                    ? "#93C5FD"
                    : "#2563EB",
                  color: "#FFFFFF",
                  padding: "11px 22px",
                  borderRadius: "8px",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: 700,
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId === null
                  ? "Create Process"
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle("#DBEAFE")}>
          <h3 style={cardTitleStyle}>
            Suppliers
          </h3>

          <div style={cardNumberStyle}>
            {supplierCount}
          </div>

          <p style={cardDescriptionStyle}>
            Unique suppliers
          </p>
        </div>

        <div style={cardStyle("#DCFCE7")}>
          <h3 style={cardTitleStyle}>
            Processes
          </h3>

          <div style={cardNumberStyle}>
            {processCount}
          </div>

          <p style={cardDescriptionStyle}>
            Defined processes
          </p>
        </div>

        <div style={cardStyle("#FEF3C7")}>
          <h3 style={cardTitleStyle}>
            Customers
          </h3>

          <div style={cardNumberStyle}>
            {customerCount}
          </div>

          <p style={cardDescriptionStyle}>
            Unique customers
          </p>
        </div>

        <div style={cardStyle("#F3E8FF")}>
          <h3 style={cardTitleStyle}>
            Active
          </h3>

          <div style={cardNumberStyle}>
            {activeCount}
          </div>

          <p style={cardDescriptionStyle}>
            Active SIPOC records
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "28px",
          boxShadow:
            "0 8px 24px rgba(15, 23, 42, 0.06)",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              color: "#0F172A",
              fontSize: "22px",
              fontWeight: 800,
              margin: 0,
              marginBottom: "6px",
            }}
          >
            SIPOC Processes
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: "13px",
              margin: 0,
            }}
          >
            Manage suppliers, inputs, processes, outputs
            and customers.
          </p>
        </div>

        {loading ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            Loading SIPOC records...
          </div>
        ) : sipocRecords.length === 0 ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: "12px",
              color: "#64748B",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "10px",
              }}
            >
              📋
            </div>

            <strong
              style={{
                display: "block",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              No SIPOC processes found
            </strong>

            <span style={{ fontSize: "13px" }}>
              Create your first SIPOC process to get
              started.
            </span>
          </div>
        ) : (
          <div
            style={{
              minWidth: "1050px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#1E293B",
                    color: "#FFFFFF",
                  }}
                >
                  <th style={tableHeaderStyle}>
                    Process
                  </th>

                  <th style={tableHeaderStyle}>
                    Supplier
                  </th>

                  <th style={tableHeaderStyle}>
                    Input
                  </th>

                  <th style={tableHeaderStyle}>
                    Process Flow
                  </th>

                  <th style={tableHeaderStyle}>
                    Output
                  </th>

                  <th style={tableHeaderStyle}>
                    Customer
                  </th>

                  <th style={tableHeaderStyle}>
                    Status
                  </th>

                  <th style={tableHeaderStyle}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {sipocRecords.map(
                  (item: SIPOCRecord) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid #E2E8F0",
                      }}
                    >
                      <td style={tableCellStyle}>
                        <strong
                          style={{
                            color: "#0F172A",
                            fontSize: "13px",
                          }}
                        >
                          {item.process_name}
                        </strong>
                      </td>

                      <td style={tableCellStyle}>
                        {item.suppliers}
                      </td>

                      <td style={tableCellStyle}>
                        {item.inputs}
                      </td>

                      <td style={tableCellStyle}>
                        {item.process}
                      </td>

                      <td style={tableCellStyle}>
                        {item.outputs}
                      </td>

                      <td style={tableCellStyle}>
                        {item.customers}
                      </td>

                      <td style={tableCellStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding:
                              "5px 9px",
                            borderRadius:
                              "999px",
                            background:
                              item.status.toLowerCase() ===
                              "active"
                                ? "#DCFCE7"
                                : item.status.toLowerCase() ===
                                  "completed"
                                ? "#DBEAFE"
                                : "#FEF3C7",
                            color:
                              item.status.toLowerCase() ===
                              "active"
                                ? "#15803D"
                                : item.status.toLowerCase() ===
                                  "completed"
                                ? "#1D4ED8"
                                : "#A16207",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td style={tableCellStyle}>
                        <div
                          style={{
                            display: "flex",
                            gap: "7px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(item)
                            }
                            style={{
                              border:
                                "1px solid #BFDBFE",
                              background:
                                "#EFF6FF",
                              color:
                                "#2563EB",
                              padding:
                                "7px 10px",
                              borderRadius:
                                "7px",
                              cursor:
                                "pointer",
                              fontWeight:
                                700,
                              fontSize:
                                "11px",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item.id,
                                item.process_name
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
                                "7px 10px",
                              borderRadius:
                                "7px",
                              cursor:
                                "pointer",
                              fontWeight:
                                700,
                              fontSize:
                                "11px",
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
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#0F172A",
  background: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
};

const cardStyle = (
  background: string
): React.CSSProperties => ({
  background,
  padding: "20px",
  borderRadius: "12px",
  boxSizing: "border-box",
});

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#334155",
  fontSize: "14px",
  fontWeight: 700,
};

const cardNumberStyle: React.CSSProperties = {
  marginTop: "8px",
  color: "#0F172A",
  fontSize: "28px",
  fontWeight: 800,
  lineHeight: 1.1,
};

const cardDescriptionStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "13px 12px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const tableCellStyle: React.CSSProperties = {
  padding: "14px 12px",
  color: "#475569",
  fontSize: "12px",
  verticalAlign: "middle",
};