import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "User",
    department: "",
    is_active: true,
  });

  // ==========================================================
  // API CONFIGURATION
  // ==========================================================

  const API_URL = "http://localhost:8000/settings";

  // ==========================================================
  // FETCH USERS
  // ==========================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();

      setUsers(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the SmartChain Nexus backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // FORM HANDLING
  // ==========================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================================
  // CREATE USER
  // ==========================================================

  const handleAddUser = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail || "Failed to create user"
        );
      }

      const newUser = await response.json();

      setUsers((previousUsers) => [
        newUser,
        ...previousUsers,
      ]);

      setFormData({
        username: "",
        email: "",
        role: "User",
        department: "",
        is_active: true,
      });

      setShowForm(false);

      setSuccess("User added successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to create user."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE USER
  // ==========================================================

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail || "Failed to delete user"
        );
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );

      setSuccess("User deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete user."
      );
    }
  };

  // ==========================================================
  // UPDATE USER STATUS
  // ==========================================================

  const handleToggleStatus = async (user) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !user.is_active,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail ||
            "Failed to update user status"
        );
      }

      const updatedUser = await response.json();

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === updatedUser.id
            ? updatedUser
            : currentUser
        )
      );

      setSuccess("User status updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to update user status."
      );
    }
  };

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.is_active
  ).length;

  const roles = new Set(
    users.map((user) => user.role)
  ).size;

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
          User Management
        </h1>

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
            }}
          >
            Loading users from SmartChain Nexus...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      {/* =====================================================
          PAGE TITLE
      ====================================================== */}

      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#0F172A",
          marginBottom: "30px",
        }}
      >
        User Management
      </h1>

      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (
        <div
          style={{
            background: "#DCFCE7",
            color: "#166534",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div
          style={{
            background: "#FEE2E2",
            color: "#991B1B",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS CARDS
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 10px 0",
              color: "#334155",
            }}
          >
            Total Users
          </h3>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#0F172A",
            }}
          >
            {totalUsers}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 10px 0",
              color: "#334155",
            }}
          >
            Active Users
          </h3>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#16A34A",
            }}
          >
            {activeUsers}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 10px 0",
              color: "#334155",
            }}
          >
            Roles
          </h3>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#2563EB",
            }}
          >
            {roles}
          </h1>
        </div>
      </div>

      {/* =====================================================
          ADD USER FORM
      ====================================================== */}

      {showForm && (
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
            marginBottom: "30px",
            maxWidth: "800px",
          }}
        >
          <h2
            style={{
              color: "#0F172A",
              marginBottom: "25px",
            }}
          >
            Add New User
          </h2>

          <form onSubmit={handleAddUser}>
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Username</strong>
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Email Address</strong>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Role</strong>
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="User">
                  User
                </option>

                <option value="Administrator">
                  Administrator
                </option>

                <option value="Supply Chain Manager">
                  Supply Chain Manager
                </option>

                <option value="Warehouse Supervisor">
                  Warehouse Supervisor
                </option>

                <option value="Finance Officer">
                  Finance Officer
                </option>

                <option value="Procurement Officer">
                  Procurement Officer
                </option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Department</strong>
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />

              <label>
                <strong>Active User</strong>
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...buttonStyle,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? "Adding User..."
                  : "Add User"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={cancelButtonStyle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          USERS TABLE
      ====================================================== */}

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
            background: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <thead
            style={{
              background: "#1E293B",
              color: "#ffffff",
            }}
          >
            <tr>
              <th style={tableHeaderStyle}>
                Username
              </th>

              <th style={tableHeaderStyle}>
                Email
              </th>

              <th style={tableHeaderStyle}>
                Role
              </th>

              <th style={tableHeaderStyle}>
                Department
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
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#64748B",
                  }}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    textAlign: "center",
                    borderBottom:
                      "1px solid #E2E8F0",
                  }}
                >
                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      color: "#0F172A",
                    }}
                  >
                    {user.username}
                  </td>

                  <td style={{ padding: "15px" }}>
                    {user.email}
                  </td>

                  <td>
                    {user.role}
                  </td>

                  <td>
                    {user.department || "-"}
                  </td>

                  <td
                    style={{
                      fontWeight: "bold",
                      color: user.is_active
                        ? "#16A34A"
                        : "#DC2626",
                    }}
                  >
                    {user.is_active
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleToggleStatus(user)
                      }
                      style={{
                        ...smallButtonStyle,
                        background:
                          user.is_active
                            ? "#F59E0B"
                            : "#16A34A",
                      }}
                    >
                      {user.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteUser(user.id)
                      }
                      style={{
                        ...smallButtonStyle,
                        background: "#DC2626",
                        marginLeft: "8px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          ADD USER BUTTON
      ====================================================== */}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginTop: "25px",
            background: "#2563EB",
            color: "#fff",
            border: "none",
            padding: "12px 25px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add New User
        </button>
      )}

      {/* =====================================================
          REFRESH BUTTON
      ====================================================== */}

      <button
        onClick={fetchUsers}
        style={{
          marginTop: "25px",
          marginLeft: "10px",
          background: "#475569",
          color: "#fff",
          border: "none",
          padding: "12px 25px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Refresh Users
      </button>
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const cardStyle = {
  background: "#DBEAFE",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,.05)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "15px",
};

const buttonStyle = {
  background: "#2563EB",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cancelButtonStyle = {
  background: "#64748B",
  color: "#fff",
  padding: "12px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const smallButtonStyle = {
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const tableHeaderStyle = {
  padding: "15px",
  textAlign: "center",
};