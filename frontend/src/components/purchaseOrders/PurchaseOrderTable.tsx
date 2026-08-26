import type { PurchaseOrder } from "../../services/purchaseOrderService";

type PurchaseOrderTableProps = {
  orders: PurchaseOrder[];
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (order: PurchaseOrder) => void;
};

export default function PurchaseOrderTable({
  orders,
  onEdit,
  onDelete,
}: PurchaseOrderTableProps) {
  const formatCurrency = (
    amount: number,
    currency: string
  ) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency || "ZAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          background: "#DCFCE7",
          color: "#15803D",
          dot: "#16A34A",
        };

      case "received":
        return {
          background: "#DBEAFE",
          color: "#1D4ED8",
          dot: "#2563EB",
        };

      case "cancelled":
        return {
          background: "#FEE2E2",
          color: "#B91C1C",
          dot: "#DC2626",
        };

      default:
        return {
          background: "#FEF3C7",
          color: "#B45309",
          dot: "#F59E0B",
        };
    }
  };

  return (
    <div style={tableCard}>
      {/* TABLE HEADER */}
      <div style={tableHeader}>
        <div style={tableHeaderLeft}>
          <div style={tableIcon}>
            📦
          </div>

          <div>
            <h2 style={tableTitle}>
              Purchase Order List
            </h2>

            <p style={tableSubtitle}>
              Manage and maintain your purchase orders
            </p>
          </div>
        </div>

        <div style={orderCount}>
          {orders.length}{" "}
          {orders.length === 1
            ? "Purchase Order"
            : "Purchase Orders"}
        </div>
      </div>

      {/* TABLE */}
      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr>
              <th style={header}>PO Number</th>
              <th style={header}>Supplier</th>
              <th style={header}>Order Date</th>
              <th style={header}>Expected Delivery</th>
              <th style={header}>Amount</th>
              <th style={header}>Status</th>
              <th style={actionHeader}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={emptyCell}
                >
                  <div style={emptyState}>
                    <div style={emptyIcon}>
                      📦
                    </div>

                    <h3 style={emptyTitle}>
                      No purchase orders found
                    </h3>

                    <p style={emptyText}>
                      Purchase orders will appear here
                      once they have been created.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusStyle =
                  getStatusStyle(order.status);

                return (
                  <tr
                    key={order.id}
                    style={tableRow}
                  >
                    {/* PO NUMBER */}
                    <td style={cell}>
                      <div style={poContainer}>
                        <div style={poIcon}>
                          📄
                        </div>

                        <div>
                          <div style={poNumber}>
                            {order.po_number}
                          </div>

                          <div style={poId}>
                            PO ID: {order.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SUPPLIER */}
                    <td style={cell}>
                      <div style={supplierContainer}>
                        <div style={supplierAvatar}>
                          S
                        </div>

                        <div>
                          <div style={supplierName}>
                            Supplier #{order.supplier_id}
                          </div>

                          <div style={supplierLabel}>
                            Supplier ID
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ORDER DATE */}
                    <td style={cell}>
                      <div style={dateValue}>
                        {order.order_date}
                      </div>
                    </td>

                    {/* EXPECTED DELIVERY */}
                    <td style={cell}>
                      <div style={dateContainer}>
                        <span style={calendarIcon}>
                          📅
                        </span>

                        <span style={dateValue}>
                          {order.expected_delivery}
                        </span>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td style={cell}>
                      <div style={amount}>
                        {formatCurrency(
                          order.total_amount,
                          order.currency
                        )}
                      </div>

                      <div style={currencyLabel}>
                        {order.currency || "ZAR"}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td style={cell}>
                      <span
                        style={{
                          ...statusBadge,
                          background:
                            statusStyle.background,
                          color:
                            statusStyle.color,
                        }}
                      >
                        <span
                          style={{
                            ...statusDot,
                            background:
                              statusStyle.dot,
                          }}
                        />

                        {order.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td style={actionCell}>
                      <button
                        type="button"
                        onClick={() => onEdit(order)}
                        style={editButton}
                        title="Edit purchase order"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(order)}
                        style={deleteButton}
                        title="Delete purchase order"
                      >
                        🗑
                      </button>

                      <button
                        type="button"
                        style={moreButton}
                        title="More options"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      {orders.length > 0 && (
        <div style={tableFooter}>
          <div style={showingText}>
            Showing{" "}
            <strong>{orders.length}</strong>{" "}
            of{" "}
            <strong>{orders.length}</strong>{" "}
            purchase orders
          </div>

          <div style={pagination}>
            <button
              type="button"
              style={paginationButton}
              disabled
            >
              ‹
            </button>

            <button
              type="button"
              style={paginationActive}
            >
              1
            </button>

            <button
              type="button"
              style={paginationButton}
            >
              2
            </button>

            <button
              type="button"
              style={paginationButton}
            >
              3
            </button>

            <button
              type="button"
              style={paginationButton}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   TABLE CARD
========================================================== */

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E5EAF1",
  boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

/* ==========================================================
   HEADER
========================================================== */

const tableHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 24px",
  borderBottom: "1px solid #EEF2F7",
};

const tableHeaderLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const tableIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "11px",
  background: "#EEF4FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

const tableTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "16px",
  fontWeight: 800,
};

const tableSubtitle: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#64748B",
  fontSize: "12px",
};

const orderCount: React.CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  fontWeight: 600,
};

/* ==========================================================
   TABLE
========================================================== */

const tableWrapper: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  minWidth: "1050px",
  borderCollapse: "collapse",
};

const header: React.CSSProperties = {
  padding: "16px 18px",
  textAlign: "left",
  background: "#F7F9FC",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
  borderBottom: "1px solid #E8EDF4",
};

const actionHeader: React.CSSProperties = {
  ...header,
  textAlign: "center",
};

const cell: React.CSSProperties = {
  padding: "17px 18px",
  borderBottom: "1px solid #EEF2F7",
  color: "#334155",
  fontSize: "13px",
  verticalAlign: "middle",
};

const tableRow: React.CSSProperties = {
  transition: "background 0.2s ease",
};

/* ==========================================================
   PO NUMBER
========================================================== */

const poContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const poIcon: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#EAF2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
};

const poNumber: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: 800,
  fontSize: "13px",
};

const poId: React.CSSProperties = {
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
};

/* ==========================================================
   SUPPLIER
========================================================== */

const supplierContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const supplierAvatar: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#E0F2FE",
  color: "#0369A1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "13px",
};

const supplierName: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: 700,
  fontSize: "13px",
};

const supplierLabel: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "3px",
};

/* ==========================================================
   DATES
========================================================== */

const dateContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const calendarIcon: React.CSSProperties = {
  fontSize: "13px",
};

const dateValue: React.CSSProperties = {
  color: "#334155",
  fontWeight: 600,
  fontSize: "13px",
};

/* ==========================================================
   AMOUNT
========================================================== */

const amount: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: 800,
  fontSize: "13px",
};

const currencyLabel: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "3px",
};

/* ==========================================================
   STATUS
========================================================== */

const statusBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  padding: "7px 11px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const statusDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
};

/* ==========================================================
   ACTIONS
========================================================== */

const actionCell: React.CSSProperties = {
  padding: "17px 18px",
  borderBottom: "1px solid #EEF2F7",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const editButton: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #DCE8FF",
  background: "#F1F6FF",
  color: "#2563EB",
  cursor: "pointer",
  marginRight: "7px",
  fontSize: "14px",
};

const deleteButton: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #FECACA",
  background: "#FFF1F2",
  color: "#DC2626",
  cursor: "pointer",
  marginRight: "7px",
  fontSize: "14px",
};

const moreButton: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#475569",
  cursor: "pointer",
  fontSize: "20px",
  lineHeight: 1,
};

/* ==========================================================
   EMPTY STATE
========================================================== */

const emptyCell: React.CSSProperties = {
  padding: "55px 20px",
  textAlign: "center",
};

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const emptyIcon: React.CSSProperties = {
  width: "58px",
  height: "58px",
  borderRadius: "16px",
  background: "#EEF4FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
  marginBottom: "12px",
};

const emptyTitle: React.CSSProperties = {
  margin: 0,
  color: "#334155",
  fontSize: "15px",
  fontWeight: 800,
};

const emptyText: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#94A3B8",
  fontSize: "12px",
};

/* ==========================================================
   FOOTER
========================================================== */

const tableFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  background: "#FFFFFF",
};

const showingText: React.CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
};

const pagination: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const paginationButton: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "9px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#475569",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};

const paginationActive: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "9px",
  border: "1px solid #2563EB",
  background: "#2563EB",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 700,
};