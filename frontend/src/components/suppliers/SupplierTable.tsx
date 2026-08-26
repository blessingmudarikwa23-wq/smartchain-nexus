import type { Supplier } from "../../services/supplierService";

type SupplierTableProps = {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
};

export default function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  return (
    <div style={tableWrapper}>
      <table style={table}>
        <thead>
          <tr style={headerRow}>
            <th style={header}>Supplier</th>
            <th style={header}>Contact Person</th>
            <th style={header}>Email</th>
            <th style={header}>Phone</th>
            <th style={header}>City</th>
            <th style={header}>Country</th>
            <th style={header}>Status</th>
            <th style={header}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={8} style={emptyCell}>
                No suppliers found.
              </td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                style={row}
              >
                <td style={strongCell}>
                  <div style={supplierName}>
                    <div style={supplierAvatar}>
                      {supplier.company_name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div style={companyName}>
                        {supplier.company_name}
                      </div>

                      <div style={supplierCode}>
                        {supplier.supplier_code}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={cell}>
                  {supplier.contact_person}
                </td>

                <td style={cell}>
                  {supplier.email}
                </td>

                <td style={cell}>
                  {supplier.phone}
                </td>

                <td style={cell}>
                  {supplier.city}
                </td>

                <td style={cell}>
                  {supplier.country}
                </td>

                <td style={cell}>
                  <span
                    style={
                      supplier.status
                        ? activeStatus
                        : inactiveStatus
                    }
                  >
                    {supplier.status
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td style={cell}>
                  <div style={actions}>
                    <button
                      type="button"
                      onClick={() => onEdit(supplier)}
                      style={editButton}
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(supplier)}
                      style={deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const tableWrapper: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1050px",
};

const headerRow: React.CSSProperties = {
  background: "#F8FAFC",
};

const header: React.CSSProperties = {
  padding: "13px 18px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 800,
  color: "#64748B",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  borderBottom: "1px solid #E8EDF4",
  whiteSpace: "nowrap",
};

const row: React.CSSProperties = {
  borderBottom: "1px solid #EEF1F5",
};

const cell: React.CSSProperties = {
  padding: "15px 18px",
  color: "#475569",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const strongCell: React.CSSProperties = {
  ...cell,
  color: "#0F172A",
  fontWeight: 700,
};

const supplierName: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const supplierAvatar: React.CSSProperties = {
  width: "38px",
  height: "38px",
  minWidth: "38px",
  borderRadius: "10px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
};

const companyName: React.CSSProperties = {
  fontWeight: 700,
  color: "#0F172A",
};

const supplierCode: React.CSSProperties = {
  marginTop: "3px",
  fontSize: "11px",
  color: "#94A3B8",
};

const activeStatus: React.CSSProperties = {
  display: "inline-flex",
  padding: "5px 10px",
  borderRadius: "999px",
  background: "#DCFCE7",
  color: "#166534",
  fontSize: "11px",
  fontWeight: 700,
};

const inactiveStatus: React.CSSProperties = {
  display: "inline-flex",
  padding: "5px 10px",
  borderRadius: "999px",
  background: "#F1F5F9",
  color: "#64748B",
  fontSize: "11px",
  fontWeight: 700,
};

const actions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const editButton: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #DBEAFE",
  borderRadius: "8px",
  background: "#EFF6FF",
  color: "#2563EB",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const deleteButton: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #FECACA",
  borderRadius: "8px",
  background: "#FEF2F2",
  color: "#DC2626",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyCell: React.CSSProperties = {
  padding: "45px",
  textAlign: "center",
  color: "#94A3B8",
  fontSize: "13px",
};