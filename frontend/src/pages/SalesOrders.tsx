import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import SalesOrderTable from "../components/salesOrders/SalesOrderTable";
import AddSalesOrderModal from "../components/salesOrders/AddSalesOrderModal";
import EditSalesOrderModal from "../components/salesOrders/EditSalesOrderModal";
import DeleteSalesOrderDialog from "../components/salesOrders/DeleteSalesOrderDialog";

import {
  salesOrderService,
  type SalesOrder,
  type SalesOrderCreate,
  type SalesOrderUpdate,
} from "../services/salesOrderService";

export default function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<SalesOrder | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await salesOrderService.getSalesOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load sales orders. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) =>
      order.order_status.toLowerCase() === "completed"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      order.order_status.toLowerCase() === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.order_status.toLowerCase() === "processing"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total_amount || 0),
    0
  );

  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    let result = [...orders];

    if (searchValue) {
      result = result.filter((order) =>
        [
          order.order_number,
          order.customer_code,
          order.product,
          order.order_status,
          order.payment_status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue)
      );
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (order) =>
          order.order_status.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.order_date).getTime();
      const dateB = new Date(b.order_date).getTime();

      if (sortOrder === "Oldest First") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

    return result;
  }, [
    orders,
    search,
    statusFilter,
    sortOrder,
  ]);

  const handleAddOrder = async (
    data: SalesOrderCreate
  ) => {
    await salesOrderService.createSalesOrder(data);

    await loadOrders();
  };

  const handleUpdateOrder = async (
    id: number,
    data: SalesOrderUpdate
  ) => {
    await salesOrderService.updateSalesOrder(
      id,
      data
    );

    await loadOrders();

    setOpenEdit(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await salesOrderService.deleteSalesOrder(id);

      await loadOrders();

      setOpenDelete(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);

      alert("Failed to delete sales order.");
    }
  };

  return (
    <div style={page}>
      {/* PAGE HEADER */}
      <div style={pageHeader}>
        <div style={titleSection}>
          <div style={titleIcon}>
            <CartIcon />
          </div>

          <div>
            <h1 style={pageTitle}>
              Sales Orders
            </h1>

            <p style={pageSubtitle}>
              Manage customer sales orders and payment status
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          style={addButton}
        >
          <PlusCircleIcon />
          <span>Add Sales Order</span>
        </button>
      </div>

      {/* KPI CARDS */}
      <div style={statsGrid}>
        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          subtitle="All sales orders"
          icon={<OrdersIcon />}
          iconBackground="#E8F0FF"
          iconColor="#2563EB"
          lineColor="#2563EB"
        />

        <StatCard
          title="Completed Orders"
          value={completedOrders.toString()}
          subtitle="Successfully completed"
          icon={<CheckIcon />}
          iconBackground="#E7F8EF"
          iconColor="#16A34A"
          lineColor="#16A34A"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          subtitle={`${processingOrders} currently processing`}
          icon={<ClockIcon />}
          iconBackground="#FFF4DB"
          iconColor="#F59E0B"
          lineColor="#F59E0B"
        />

        <StatCard
          title="Total Revenue"
          value={`R ${totalRevenue.toLocaleString(
            "en-ZA",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          subtitle="Total order value"
          icon={<RevenueIcon />}
          iconBackground="#F2E9FF"
          iconColor="#7C3AED"
          lineColor="#7C3AED"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div style={errorBox}>
          <strong>Unable to load sales orders</strong>
          <div style={{ marginTop: "4px" }}>
            {error}
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div style={filterCard}>
        <div style={searchWrapper}>
          <SearchIcon />

          <input
            type="text"
            placeholder="Search orders by number, customer or product..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={searchInput}
          />
        </div>

        <div style={filterControl}>
          <FilterIcon />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={selectInput}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <ChevronDownIcon />
        </div>

        <div style={filterControl}>
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
            style={selectInput}
          >
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>

          <ChevronDownIcon />
        </div>
      </div>

      {/* SALES ORDER LIST */}
      <div style={tableCard}>
        <div style={tableHeader}>
          <div style={tableTitleWrapper}>
            <div style={tableTitleIcon}>
              <OrdersIcon />
            </div>

            <div>
              <h2 style={tableTitle}>
                Sales Order List
              </h2>

              <p style={tableSubtitle}>
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1
                  ? "sales order"
                  : "sales orders"}{" "}
                displayed
              </p>
            </div>
          </div>

          <div style={orderCount}>
            {filteredOrders.length} Orders
          </div>
        </div>

        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr style={tableHeadRow}>
                <th style={tableHeadCell}>
                  Order Number
                </th>

                <th style={tableHeadCell}>
                  Customer
                </th>

                <th style={tableHeadCell}>
                  Product
                </th>

                <th style={tableHeadCell}>
                  Quantity
                </th>

                <th style={tableHeadCell}>
                  Unit Price
                </th>

                <th style={tableHeadCell}>
                  Total
                </th>

                <th style={tableHeadCell}>
                  Status
                </th>

                <th style={tableHeadCell}>
                  Payment
                </th>

                <th style={tableHeadCell}>
                  Order Date
                </th>

                <th style={tableHeadCell}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    style={emptyCell}
                  >
                    <div style={loadingContent}>
                      <div style={spinner} />
                      Loading sales orders...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    style={emptyCell}
                  >
                    <div style={emptyContent}>
                      <div style={emptyIcon}>
                        <OrdersIcon />
                      </div>

                      <strong>
                        No sales orders found
                      </strong>

                      <span>
                        Try changing your search or
                        filters.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <SalesOrderRow
                    key={order.id}
                    order={order}
                    onEdit={() => {
                      setSelectedOrder(order);
                      setOpenEdit(true);
                    }}
                    onDelete={() => {
                      setSelectedOrder(order);
                      setOpenDelete(true);
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div style={tableFooter}>
          <span style={footerText}>
            Showing 1 to {filteredOrders.length} of{" "}
            {filteredOrders.length} sales orders
          </span>

          <div style={pagination}>
            <button
              type="button"
              style={paginationButton}
              disabled
            >
              <ChevronLeftIcon />
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
              disabled
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddSalesOrderModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAddOrder}
      />

      <EditSalesOrderModal
        open={openEdit}
        order={selectedOrder}
        onClose={() => {
          setOpenEdit(false);
          setSelectedOrder(null);
        }}
        onSave={handleUpdateOrder}
      />

      <DeleteSalesOrderDialog
        open={openDelete}
        order={selectedOrder}
        onClose={() => {
          setOpenDelete(false);
          setSelectedOrder(null);
        }}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
}

/* =========================================================
   SALES ORDER ROW
========================================================= */

type SalesOrderRowProps = {
  order: SalesOrder;
  onEdit: () => void;
  onDelete: () => void;
};

function SalesOrderRow({
  order,
  onEdit,
  onDelete,
}: SalesOrderRowProps) {
  const orderStatus =
    order.order_status.toLowerCase();

  const paymentStatus =
    order.payment_status.toLowerCase();

  return (
    <tr style={tableRow}>
      <td style={tableCell}>
        <div style={orderNumberWrapper}>
          <div style={orderAvatar}>
            <OrdersIcon />
          </div>

          <div>
            <strong style={orderNumber}>
              {order.order_number}
            </strong>

            <span style={orderId}>
              SO-{String(order.id).padStart(4, "0")}
            </span>
          </div>
        </div>
      </td>

      <td style={tableCell}>
        <div style={customerWrapper}>
          <strong style={customerName}>
            {order.customer_code}
          </strong>

          <span style={customerSecondary}>
            Customer
          </span>
        </div>
      </td>

      <td style={tableCell}>
        <div style={productWrapper}>
          <strong style={productName}>
            {order.product}
          </strong>

          <span style={productSecondary}>
            Sales item
          </span>
        </div>
      </td>

      <td style={tableCell}>
        <span style={quantityValue}>
          {order.quantity}
        </span>
      </td>

      <td style={tableCell}>
        <span style={moneyText}>
          R{" "}
          {Number(order.unit_price).toLocaleString(
            "en-ZA",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </span>
      </td>

      <td style={tableCell}>
        <span style={totalMoneyText}>
          R{" "}
          {Number(order.total_amount).toLocaleString(
            "en-ZA",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </span>
      </td>

      <td style={tableCell}>
        <StatusBadge
          status={order.order_status}
          type="order"
          value={orderStatus}
        />
      </td>

      <td style={tableCell}>
        <StatusBadge
          status={order.payment_status}
          type="payment"
          value={paymentStatus}
        />
      </td>

      <td style={tableCell}>
        <span style={dateText}>
          {new Date(
            order.order_date
          ).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </td>

      <td style={tableCell}>
        <div style={actionButtons}>
          <button
            type="button"
            onClick={onEdit}
            title="Edit sales order"
            style={editAction}
          >
            <EditIcon />
          </button>

          <button
            type="button"
            onClick={onDelete}
            title="Delete sales order"
            style={deleteAction}
          >
            <DeleteIcon />
          </button>

          <button
            type="button"
            title="More actions"
            style={moreAction}
          >
            <MoreIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

type StatusBadgeProps = {
  status: string;
  type: "order" | "payment";
  value: string;
};

function StatusBadge({
  status,
  type,
  value,
}: StatusBadgeProps) {
  let background = "#FEF3C7";
  let color = "#92400E";
  let dot = "#F59E0B";

  if (type === "order") {
    if (value === "completed") {
      background = "#E7F8EF";
      color = "#15803D";
      dot = "#16A34A";
    } else if (value === "processing") {
      background = "#E8F0FF";
      color = "#1D4ED8";
      dot = "#2563EB";
    } else if (value === "cancelled") {
      background = "#FEECEC";
      color = "#B91C1C";
      dot = "#DC2626";
    }
  }

  if (type === "payment") {
    if (value === "paid") {
      background = "#E7F8EF";
      color = "#15803D";
      dot = "#16A34A";
    } else if (value === "failed") {
      background = "#FEECEC";
      color = "#B91C1C";
      dot = "#DC2626";
    } else if (value === "refunded") {
      background = "#F2E9FF";
      color = "#7C3AED";
      dot = "#7C3AED";
    }
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "7px 11px",
        borderRadius: "999px",
        background,
        color,
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: dot,
          display: "inline-block",
        }}
      />

      {status}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBackground: string;
  iconColor: string;
  lineColor: string;
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBackground,
  iconColor,
  lineColor,
}: StatCardProps) {
  return (
    <div style={statCard}>
      <div
        style={{
          ...statIcon,
          background: iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div style={statContent}>
        <span
          style={{
            ...statTitle,
            color: iconColor,
          }}
        >
          {title}
        </span>

        <strong style={statValue}>
          {value}
        </strong>

        <span style={statSubtitle}>
          {subtitle}
        </span>
      </div>

      <div style={miniChart}>
        <svg
          width="70"
          height="35"
          viewBox="0 0 70 35"
          fill="none"
        >
          <path
            d="M2 28C9 26 10 25 16 25C23 25 25 18 31 20C37 22 39 15 44 14C50 12 53 18 57 12C61 7 64 8 68 2"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE STYLES
========================================================= */

const page: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #F8FAFF 0%, #FFFFFF 55%, #F8FAFF 100%)",
  padding: "38px 40px 50px",
  boxSizing: "border-box",
};

const pageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "25px",
  marginBottom: "28px",
  flexWrap: "wrap",
};

const titleSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const titleIcon: CSSProperties = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #8DA8FF 0%, #5B7FF0 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFFFFF",
  boxShadow:
    "0 8px 20px rgba(37, 99, 235, 0.20)",
  flexShrink: 0,
};

const pageTitle: CSSProperties = {
  margin: 0,
  fontSize: "36px",
  lineHeight: 1.1,
  fontWeight: "800",
  color: "#0F1E3A",
  letterSpacing: "-1px",
};

const pageSubtitle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "14px",
  color: "#64748B",
};

const addButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  border: "none",
  background:
    "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
  color: "#FFFFFF",
  padding: "15px 22px",
  borderRadius: "11px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 8px 18px rgba(37, 99, 235, 0.22)",
  transition: "all .2s ease",
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const statCard: CSSProperties = {
  position: "relative",
  minHeight: "145px",
  background: "#FFFFFF",
  border: "1px solid #E8EDF5",
  borderRadius: "15px",
  padding: "20px",
  boxSizing: "border-box",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.06)",
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  overflow: "hidden",
};

const statIcon: CSSProperties = {
  width: "47px",
  height: "47px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const statContent: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  minWidth: 0,
};

const statTitle: CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
};

const statValue: CSSProperties = {
  fontSize: "28px",
  lineHeight: 1.1,
  color: "#17233C",
  letterSpacing: "-0.5px",
};

const statSubtitle: CSSProperties = {
  fontSize: "12px",
  color: "#64748B",
  marginTop: "17px",
};

const miniChart: CSSProperties = {
  position: "absolute",
  right: "12px",
  bottom: "26px",
  opacity: 0.95,
};

const errorBox: CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#991B1B",
  padding: "14px 17px",
  borderRadius: "11px",
  marginBottom: "20px",
  fontSize: "13px",
};

const filterCard: CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8EDF5",
  borderRadius: "15px",
  padding: "12px",
  marginBottom: "20px",
  boxShadow:
    "0 7px 22px rgba(15, 23, 42, 0.05)",
  display: "grid",
  gridTemplateColumns:
    "minmax(300px, 1fr) 190px 190px",
  gap: "12px",
  alignItems: "center",
};

const searchWrapper: CSSProperties = {
  height: "46px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 15px",
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  background: "#FFFFFF",
  boxSizing: "border-box",
};

const searchInput: CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "13px",
  color: "#334155",
  background: "transparent",
  minWidth: 0,
};

const filterControl: CSSProperties = {
  position: "relative",
  height: "46px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "0 12px",
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  background: "#FFFFFF",
  boxSizing: "border-box",
};

const selectInput: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "13px",
  color: "#334155",
  cursor: "pointer",
  minWidth: 0,
};

const tableCard: CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8EDF5",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow:
    "0 10px 28px rgba(15, 23, 42, 0.06)",
};

const tableHeader: CSSProperties = {
  minHeight: "70px",
  padding: "18px 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  borderBottom: "1px solid #EDF1F7",
  boxSizing: "border-box",
};

const tableTitleWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const tableTitleIcon: CSSProperties = {
  width: "35px",
  height: "35px",
  borderRadius: "9px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const tableTitle: CSSProperties = {
  margin: 0,
  color: "#17233C",
  fontSize: "17px",
  fontWeight: "750",
};

const tableSubtitle: CSSProperties = {
  margin: "3px 0 0",
  color: "#94A3B8",
  fontSize: "11px",
};

const orderCount: CSSProperties = {
  background: "#EEF4FF",
  color: "#2563EB",
  padding: "7px 11px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "700",
};

const tableWrapper: CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  minWidth: "1250px",
  borderCollapse: "collapse",
};

const tableHeadRow: CSSProperties = {
  background:
    "linear-gradient(180deg, #F7F9FD 0%, #F2F5FA 100%)",
};

const tableHeadCell: CSSProperties = {
  padding: "15px 14px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: "700",
  color: "#475569",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #E7ECF3",
};

const tableRow: CSSProperties = {
  borderBottom: "1px solid #EDF1F5",
  transition: "background .15s ease",
};

const tableCell: CSSProperties = {
  padding: "15px 14px",
  color: "#334155",
  fontSize: "12px",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const orderNumberWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const orderAvatar: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#E8F0FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const orderNumber: CSSProperties = {
  display: "block",
  color: "#17233C",
  fontSize: "12px",
  fontWeight: "750",
};

const orderId: CSSProperties = {
  display: "inline-block",
  marginTop: "4px",
  color: "#2563EB",
  background: "#EEF4FF",
  padding: "3px 7px",
  borderRadius: "5px",
  fontSize: "9px",
  fontWeight: "700",
};

const customerWrapper: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const customerName: CSSProperties = {
  color: "#17233C",
  fontSize: "12px",
};

const customerSecondary: CSSProperties = {
  color: "#94A3B8",
  fontSize: "10px",
};

const productWrapper: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const productName: CSSProperties = {
  color: "#334155",
  fontSize: "12px",
};

const productSecondary: CSSProperties = {
  color: "#94A3B8",
  fontSize: "10px",
};

const quantityValue: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "32px",
  padding: "5px 8px",
  borderRadius: "6px",
  background: "#F1F5F9",
  color: "#334155",
  fontWeight: "700",
};

const moneyText: CSSProperties = {
  color: "#475569",
  fontWeight: "600",
};

const totalMoneyText: CSSProperties = {
  color: "#17233C",
  fontWeight: "750",
};

const dateText: CSSProperties = {
  color: "#64748B",
  fontSize: "11px",
};

const actionButtons: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const editAction: CSSProperties = {
  width: "35px",
  height: "35px",
  border: "none",
  borderRadius: "9px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const deleteAction: CSSProperties = {
  width: "35px",
  height: "35px",
  border: "none",
  borderRadius: "9px",
  background: "#FEECEC",
  color: "#DC2626",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const moreAction: CSSProperties = {
  width: "30px",
  height: "35px",
  border: "none",
  background: "transparent",
  color: "#64748B",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const emptyCell: CSSProperties = {
  padding: "60px 20px",
  textAlign: "center",
};

const emptyContent: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  color: "#64748B",
};

const emptyIcon: CSSProperties = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "5px",
};

const loadingContent: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  color: "#64748B",
};

const spinner: CSSProperties = {
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  border: "3px solid #DBEAFE",
  borderTopColor: "#2563EB",
};

const tableFooter: CSSProperties = {
  minHeight: "64px",
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  borderTop: "1px solid #EDF1F5",
  boxSizing: "border-box",
};

const footerText: CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
};

const pagination: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const paginationButton: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#94A3B8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "not-allowed",
};

const paginationActive: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/* =========================================================
   ICONS
========================================================= */

function CartIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="19" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v18H6z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16l-6 7v5l-4 2v-7z" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6v12M5 9l3-3 3 3" />
      <path d="M16 18V6M13 15l3 3 3-3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}