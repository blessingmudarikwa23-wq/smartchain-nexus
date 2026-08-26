import type { CSSProperties } from "react";
import type { Inventory } from "../../services/inventoryService";

type InventoryTableProps = {
  inventory: Inventory[];
  onEdit: (item: Inventory) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export default function InventoryTable({
  inventory,
  onEdit,
  onDelete,
  loading = false,
}: InventoryTableProps) {
  return (
    <div style={tableContainer}>
      <div style={tableHeader}>
        <div style={sectionTitle}>
          <div style={sectionIcon}>
            📦
          </div>

          <div>
            <h2 style={sectionHeading}>
              Inventory List
            </h2>

            <p style={sectionSubtitle}>
              Manage your stock records
            </p>
          </div>
        </div>

        <div style={recordCount}>
          {inventory.length}{" "}
          {inventory.length === 1
            ? "record"
            : "records"}
        </div>
      </div>

      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr style={headerRow}>
              <th style={header}>
                SKU
              </th>

              <th style={header}>
                Item
              </th>

              <th style={header}>
                Category
              </th>

              <th style={header}>
                Warehouse
              </th>

              <th style={header}>
                Quantity
              </th>

              <th style={header}>
                Unit
              </th>

              <th style={header}>
                Unit Cost
              </th>

              <th style={header}>
                Min Stock
              </th>

              <th style={header}>
                Max Stock
              </th>

              <th style={header}>
                Status
              </th>

              <th
                style={{
                  ...header,
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={11}
                  style={emptyCell}
                >
                  <div style={loadingText}>
                    Loading inventory...
                  </div>
                </td>
              </tr>
            ) : inventory.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={emptyCell}
                >
                  <div style={emptyIcon}>
                    📦
                  </div>

                  <strong>
                    No inventory records found
                  </strong>

                  <p style={emptyText}>
                    Try changing your search or
                    filters.
                  </p>
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr
                  key={item.id}
                  style={row}
                >
                  <td style={cell}>
                    <div style={skuWrapper}>
                      <strong style={sku}>
                        {item.sku}
                      </strong>

                      <span style={barcode}>
                        {item.barcode || "No barcode"}
                      </span>
                    </div>
                  </td>

                  <td style={cell}>
                    <div>
                      <strong style={itemName}>
                        {item.item_name}
                      </strong>
                    </div>
                  </td>

                  <td style={cell}>
                    <span style={categoryBadge}>
                      {item.category || "General"}
                    </span>
                  </td>

                  <td style={cell}>
                    <div style={warehouse}>
                      <span>
                        ◉
                      </span>

                      {item.warehouse || "—"}
                    </div>
                  </td>

                  <td style={cell}>
                    <strong style={quantity}>
                      {item.quantity}
                    </strong>
                  </td>

                  <td style={cell}>
                    {item.unit || "Units"}
                  </td>

                  <td style={cell}>
                    <strong>
                      R{" "}
                      {Number(
                        item.unit_cost || 0
                      ).toLocaleString(
                        "en-ZA",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </td>

                  <td style={cell}>
                    {item.minimum_stock}
                  </td>

                  <td style={cell}>
                    {item.maximum_stock}
                  </td>

                  <td style={cell}>
                    <StockBadge
                      item={item}
                    />
                  </td>

                  <td style={actionsCell}>
                    <div style={actions}>
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(item)
                        }
                        style={editButton}
                        title="Edit inventory"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(item.id)
                        }
                        style={deleteButton}
                        title="Delete inventory"
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading &&
        inventory.length > 0 && (
          <div style={footer}>
            <span style={footerText}>
              Showing{" "}
              <strong>
                {inventory.length}
              </strong>{" "}
              inventory{" "}
              {inventory.length === 1
                ? "record"
                : "records"}
            </span>

            <div style={pagination}>
              <button
                type="button"
                style={pageButton}
              >
                ‹
              </button>

              <button
                type="button"
                style={{
                  ...pageButton,
                  ...activePageButton,
                }}
              >
                1
              </button>

              <button
                type="button"
                style={pageButton}
              >
                2
              </button>

              <button
                type="button"
                style={pageButton}
              >
                3
              </button>

              <button
                type="button"
                style={pageButton}
              >
                ›
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

function StockBadge({
  item,
}: {
  item: Inventory;
}) {
  if (!item.status) {
    return (
      <span
        style={{
          ...statusBadge,
          background: "#f1f5f9",
          color: "#475569",
        }}
      >
        <span style={statusDot("#64748b")} />
        Inactive
      </span>
    );
  }

  if (item.quantity <= 0) {
    return (
      <span
        style={{
          ...statusBadge,
          background: "#fee2e2",
          color: "#b91c1c",
        }}
      >
        <span style={statusDot("#dc2626")} />
        Critical
      </span>
    );
  }

  if (
    item.quantity <= item.minimum_stock
  ) {
    return (
      <span
        style={{
          ...statusBadge,
          background: "#fef3c7",
          color: "#b45309",
        }}
      >
        <span style={statusDot("#f59e0b")} />
        Low Stock
      </span>
    );
  }

  return (
    <span
      style={{
        ...statusBadge,
        background: "#dcfce7",
        color: "#15803d",
      }}
    >
      <span style={statusDot("#16a34a")} />
      Healthy
    </span>
  );
}

function statusDot(
  color: string
): CSSProperties {
  return {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: color,
    display: "inline-block",
  };
}

/* ==========================================================
   TABLE CONTAINER
========================================================== */

const tableContainer: CSSProperties = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e5eaf2",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.07)",
  overflow: "hidden",
  minWidth: 0,
};

const tableHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 22px",
  borderBottom: "1px solid #eef2f7",
};

const sectionTitle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const sectionIcon: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2563eb",
};

const sectionHeading: CSSProperties = {
  margin: 0,
  fontSize: "17px",
  fontWeight: 800,
  color: "#0f172a",
};

const sectionSubtitle: CSSProperties = {
  margin: "3px 0 0",
  color: "#94a3b8",
  fontSize: "11px",
};

const recordCount: CSSProperties = {
  color: "#64748b",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: 600,
};

/* ==========================================================
   TABLE
========================================================== */

const tableWrapper: CSSProperties = {
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  minWidth: "1150px",
  borderCollapse: "collapse",
};

const headerRow: CSSProperties = {
  background:
    "linear-gradient(180deg, #f8faff, #f1f5fb)",
};

const header: CSSProperties = {
  padding: "15px 14px",
  textAlign: "left",
  fontWeight: 700,
  color: "#334155",
  fontSize: "12px",
  whiteSpace: "nowrap",
  borderBottom:
    "1px solid #e2e8f0",
};

const row: CSSProperties = {
  transition:
    "background-color 0.2s ease",
};

const cell: CSSProperties = {
  padding: "15px 14px",
  borderBottom:
    "1px solid #eef2f7",
  whiteSpace: "nowrap",
  color: "#475569",
  fontSize: "13px",
};

const skuWrapper: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const sku: CSSProperties = {
  color: "#0f172a",
  fontSize: "13px",
};

const barcode: CSSProperties = {
  color: "#94a3b8",
  fontSize: "10px",
};

const itemName: CSSProperties = {
  color: "#1e293b",
  fontSize: "13px",
};

const categoryBadge: CSSProperties = {
  display: "inline-block",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
  padding: "5px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: 600,
};

const warehouse: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#475569",
};

const quantity: CSSProperties = {
  color: "#0f172a",
  fontSize: "14px",
};

const statusBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
};

const actionsCell: CSSProperties = {
  padding: "12px 10px",
  borderBottom:
    "1px solid #eef2f7",
};

const actions: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

const editButton: CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  color: "#2563eb",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "17px",
};

const deleteButton: CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#dc2626",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};

const moreButton: CSSProperties = {
  width: "30px",
  height: "34px",
  border: "none",
  background: "transparent",
  color: "#475569",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "22px",
};

/* ==========================================================
   EMPTY / LOADING
========================================================== */

const emptyCell: CSSProperties = {
  padding: "60px 20px",
  textAlign: "center",
  color: "#64748b",
};

const emptyIcon: CSSProperties = {
  fontSize: "38px",
  marginBottom: "10px",
};

const emptyText: CSSProperties = {
  marginTop: "6px",
  color: "#94a3b8",
  fontSize: "12px",
};

const loadingText: CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
};

/* ==========================================================
   FOOTER / PAGINATION
========================================================== */

const footer: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  background: "#ffffff",
};

const footerText: CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
};

const pagination: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const pageButton: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
  fontWeight: 600,
};

const activePageButton: CSSProperties = {
  background: "#2563eb",
  color: "#ffffff",
  borderColor: "#2563eb",
};