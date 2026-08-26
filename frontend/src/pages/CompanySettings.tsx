import { useEffect, useState } from "react";

export default function CompanySettings() {
  const [companyId, setCompanyId] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    registration_number: "",
    industry: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * ==========================================================
   * LOAD COMPANY SETTINGS
   * ==========================================================
   */

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "http://localhost:8000/settings/companies"
      );

      if (!response.ok) {
        throw new Error("Failed to load company settings.");
      }

      const data = await response.json();

      /*
       * The backend returns a list from:
       * GET /settings/companies
       *
       * We use the first company record.
       */

      if (data.length > 0) {
        const company = data[0];

        setCompanyId(company.id);

        setFormData({
          company_name: company.company_name || "",
          registration_number: company.registration_number || "",
          industry: company.industry || "",
          address: company.address || "",
          city: company.city || "",
          country: company.country || "",
          phone: company.phone || "",
          email: company.email || "",
          website: company.website || "",
          status: company.status || "Active",
        });
      } else {
        setError("No company settings have been created yet.");
      }
    } catch (err) {
      console.error("Error loading company settings:", err);
      setError(
        "Unable to load company settings. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * HANDLE INPUT CHANGES
   * ==========================================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  /*
   * ==========================================================
   * SAVE COMPANY SETTINGS
   * ==========================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!companyId) {
      setError("No company record was found to update.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:8000/settings/company/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to save company settings."
        );
      }

      const updatedCompany = await response.json();

      setFormData({
        company_name: updatedCompany.company_name || "",
        registration_number:
          updatedCompany.registration_number || "",
        industry: updatedCompany.industry || "",
        address: updatedCompany.address || "",
        city: updatedCompany.city || "",
        country: updatedCompany.country || "",
        phone: updatedCompany.phone || "",
        email: updatedCompany.email || "",
        website: updatedCompany.website || "",
        status: updatedCompany.status || "Active",
      });

      setMessage("Company settings saved successfully.");
    } catch (err) {
      console.error("Error saving company settings:", err);

      setError(
        err.message ||
          "Unable to save company settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==========================================================
   * LOADING STATE
   * ==========================================================
   */

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
          Company Settings
        </h1>

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            maxWidth: "900px",
          }}
        >
          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
            }}
          >
            Loading company settings...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

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
        Company Settings
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          maxWidth: "900px",
        }}
      >
        {message && (
          <div
            style={{
              background: "#DCFCE7",
              color: "#166534",
              padding: "12px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#FEE2E2",
              color: "#991B1B",
              padding: "12px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* COMPANY NAME */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Company Name</strong>
            </label>

            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              style={inputStyle}
              required
            />
          </div>

          {/* REGISTRATION NUMBER */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Business Registration</strong>
            </label>

            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="Enter registration number"
              style={inputStyle}
            />
          </div>

          {/* INDUSTRY */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Industry</strong>
            </label>

            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Enter industry"
              style={inputStyle}
            />
          </div>

          {/* COMPANY EMAIL */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Company Email</strong>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter company email"
              style={inputStyle}
            />
          </div>

          {/* PHONE */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Phone Number</strong>
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              style={inputStyle}
            />
          </div>

          {/* ADDRESS */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Address</strong>
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
              style={{
                ...inputStyle,
                height: "100px",
                resize: "vertical",
              }}
            />
          </div>

          {/* CITY */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>City</strong>
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              style={inputStyle}
            />
          </div>

          {/* COUNTRY */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Country</strong>
            </label>

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              style={inputStyle}
            />
          </div>

          {/* WEBSITE */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Website</strong>
            </label>

            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              style={inputStyle}
            />
          </div>

          {/* STATUS */}

          <div style={{ marginBottom: "25px" }}>
            <label>
              <strong>Status</strong>
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* SAVE BUTTON */}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...buttonStyle,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving
              ? "Saving..."
              : "Save Company Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}

/*
 * ==========================================================
 * INPUT STYLE
 * ==========================================================
 */

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

/*
 * ==========================================================
 * BUTTON STYLE
 * ==========================================================
 */

const buttonStyle = {
  background: "#2563EB",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};