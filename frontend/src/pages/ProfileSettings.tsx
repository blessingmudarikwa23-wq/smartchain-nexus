import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8000";

export default function ProfileSettings() {
  const profileId = 1;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    department: "",
    bio: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // GET PROFILE SETTINGS
  // ==========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/settings/profile/${profileId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load profile settings. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          job_title: data.job_title || "",
          department: data.department || "",
          bio: data.bio || "",
          status: data.status || "Active",
        });
      } catch (err) {
        console.error("Error loading profile:", err);

        setError(
          err.message ||
            "Unable to load profile settings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  // ==========================================================
  // HANDLE INPUT CHANGES
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ==========================================================
  // UPDATE PROFILE SETTINGS
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/settings/profile/${profileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || null,
            job_title: formData.job_title || null,
            department: formData.department || null,
            bio: formData.bio || null,
            status: formData.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update profile settings."
        );
      }

      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        job_title: data.job_title || "",
        department: data.department || "",
        bio: data.bio || "",
        status: data.status || "Active",
      });

      setSuccess("Profile settings updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);

      setError(
        err.message ||
          "Unable to update profile settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
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
          Profile Settings
        </h1>

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            maxWidth: "800px",
          }}
        >
          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
            }}
          >
            Loading profile settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: "10px",
        }}
      >
        Profile Settings
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "30px",
          fontSize: "16px",
        }}
      >
        Manage your personal information and professional profile.
      </p>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            maxWidth: "800px",
          }}
        >
          {/* ==================================================
              SUCCESS MESSAGE
          ================================================== */}

          {success && (
            <div
              style={{
                background: "#DCFCE7",
                color: "#166534",
                padding: "12px 15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #86EFAC",
              }}
            >
              {success}
            </div>
          )}

          {/* ==================================================
              ERROR MESSAGE
          ================================================== */}

          {error && (
            <div
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: "12px 15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #FCA5A5",
              }}
            >
              {error}
            </div>
          )}

          {/* ==================================================
              FIRST NAME
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="first_name"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>First Name</strong>
            </label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          {/* ==================================================
              LAST NAME
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="last_name"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Last Name</strong>
            </label>

            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          {/* ==================================================
              EMAIL
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Email Address</strong>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          {/* ==================================================
              PHONE
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Phone Number</strong>
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          {/* ==================================================
              JOB TITLE
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="job_title"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Job Title</strong>
            </label>

            <input
              id="job_title"
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              placeholder="Enter your job title"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          {/* ==================================================
              DEPARTMENT
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="department"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Department</strong>
            </label>

            <input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          {/* ==================================================
              BIO
          ================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="bio"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Bio</strong>
            </label>

            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              rows="5"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* ==================================================
              STATUS
          ================================================== */}

          <div style={{ marginBottom: "25px" }}>
            <label
              htmlFor="status"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0F172A",
              }}
            >
              <strong>Status</strong>
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                boxSizing: "border-box",
                fontSize: "15px",
                background: "#ffffff",
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* ==================================================
              SAVE BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={saving}
            style={{
              background: saving ? "#94A3B8" : "#2563EB",
              color: "#fff",
              padding: "12px 30px",
              border: "none",
              borderRadius: "8px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}