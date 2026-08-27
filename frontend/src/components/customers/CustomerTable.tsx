import type { CSSProperties } from "react";

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
    <div style={container}>
      <h3 style={title}>
        Customer List
      </h3>

      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={header}>Customer</th>
              <th style={header}>Contact Person</th>
              <th style={header}>Email</th>
              <th style={header}>Phone</th>
              <th style={header}>Address</th>
              <th style={actionsHeader}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={emptyCell}
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
                    {customer.contact_person || "-"}
                  </td>

                  <td style={cell}>
                    {customer.email || "-"}
                  </td>

                  <td style={cell}>
                    {customer.phone || "-"}
                  </td>

                  <td style={cell}>
                    {customer.address || "-"}
                  </td>

                  <td style={actionsCell}>
                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      style={editButton}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
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
    </div>
  );
}

const container: CSSProperties = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  border: "1px solid #e5e7eb",
};

const title: CSSProperties = {
  margin: "0 0 20px",
  color: "#111827",
};

const tableWrapper: CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  minWidth: "900px",
  borderCollapse: "collapse",
};

const tableHeaderRow: CSSProperties = {
  background: "#f8fafc",
};

const header: CSSProperties = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#374151",
  whiteSpace: "nowrap",
};

const actionsHeader: CSSProperties = {
  ...header,
  minWidth: "150px",
};

const cell: CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
};

const actionsCell: CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const emptyCell: CSSProperties = {
  padding: "30px",
  textAlign: "center",
  color: "#6b7280",
};

const editButton: CSSProperties = {
  background: "#2563EB",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  marginRight: "10px",
  cursor: "pointer",
  fontWeight: 600,
};

const deleteButton: CSSProperties = {
  background: "#DC2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 600,
};