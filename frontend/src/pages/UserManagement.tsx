export default function UserManagement() {
  const users = [
    {
      name: "John Doe",
      role: "Administrator",
      department: "IT",
      status: "Active",
    },
    {
      name: "Sarah Smith",
      role: "Supply Chain Manager",
      department: "Operations",
      status: "Active",
    },
    {
      name: "Michael Brown",
      role: "Warehouse Supervisor",
      department: "Warehouse",
      status: "Active",
    },
    {
      name: "Linda Johnson",
      role: "Finance Officer",
      department: "Finance",
      status: "Inactive",
    },
  ];

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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <h1>42</h1>
        </div>

        <div style={cardStyle}>
          <h3>Active Users</h3>
          <h1>38</h1>
        </div>

        <div style={cardStyle}>
          <h3>Roles</h3>
          <h1>8</h1>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <thead
          style={{
            background: "#1E293B",
            color: "#ffffff",
          }}
        >
          <tr>
            <th style={{ padding: "15px" }}>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <td style={{ padding: "15px" }}>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color:
                    user.status === "Active"
                      ? "#16A34A"
                      : "#DC2626",
                }}
              >
                {user.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
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
    </div>
  );
}

const cardStyle = {
  background: "#DBEAFE",
  padding: "20px",
  borderRadius: "12px",
};