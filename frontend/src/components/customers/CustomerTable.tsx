import type { Customer } from "../../services/customerService";

type CustomerTableProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
};

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
        overflowX: "auto",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>
        Customer List
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={header}>Customer</th>
            <th style={header}>Contact Person</th>
            <th style={header}>Email</th>
            <th style={header}>Phone</th>
            <th style={header}>Address</th>
            <th style={header}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No customers found.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td style={cell}>
                  {customer.customer_name}
                </td>

                <td style={cell}>
                  {customer.contact_person}
                </td>

                <td style={cell}>
                  {customer.email}
                </td>

                <td style={cell}>
                  {customer.phone}
                </td>

                <td style={cell}>
                  {customer.address}
                </td>

                <td style={cell}>
                  <button
                    onClick={() => onEdit(customer)}
                    style={editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(customer)}
                    style={deleteButton}
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
  );
}

const header: React.CSSProperties = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#374151",
};

const cell: React.CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #e5e7eb",
};

const editButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  marginRight: "10px",
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  background: "#DC2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
};