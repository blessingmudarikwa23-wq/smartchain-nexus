import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import AddPurchaseOrderModal from "../components/purchaseOrders/AddPurchaseOrderModal";
import EditPurchaseOrderModal from "../components/purchaseOrders/EditPurchaseOrderModal";
import DeletePurchaseOrderDialog from "../components/purchaseOrders/DeletePurchaseOrderDialog";

import {
  purchaseOrderService,
  type PurchaseOrder,
  type PurchaseOrderCreate,
  type PurchaseOrderUpdate,
} from "../services/purchaseOrderService";

/* ========================================================
   ICONS
======================================================== */

function IconBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </span>
  );
}

function ClipboardIcon() {
  return (
    <IconBox>
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="5" width="12" height="16" rx="2" />
        <path d="M9 5V3h6v2" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
        <path d="M9 18h4" />
      </svg>
    </IconBox>
  );
}

function ClockIcon() {
  return (
    <IconBox>
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3.2 2" />
      </svg>
    </IconBox>
  );
}

function CheckIcon() {
  return (
    <IconBox>
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
        <path d="m5 12 4 4L19 6" />
      </svg>
    </IconBox>
  );
}

function MoneyIcon() {
  return (
    <IconBox>
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M7 10h.01" />
        <path d="M17 14h.01" />
      </svg>
    </IconBox>
  );
}

function SearchIcon() {
  return (
    <IconBox>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 5 5" />
      </svg>
    </IconBox>
  );
}

function PlusIcon() {
  return (
    <IconBox>
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </IconBox>
  );
}

function EditIcon() {
  return (
    <IconBox>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    </IconBox>
  );
}

function TrashIcon() {
  return (
    <IconBox>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M7 7l1 13h8l1-13" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </svg>
    </IconBox>
  );
}

function ChevronDownIcon() {
  return (
    <IconBox>
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
        <path d="m6 9 6 6 6-6" />
      </svg>
    </IconBox>
  );
}

function RefreshIcon() {
  return (
    <IconBox>
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 11a8 8 0 0 0-14.8-4L4 9" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.8 4L20 15" />
        <path d="M20 20v-5h-5" />
      </svg>
    </IconBox>
  );
}

/* ========================================================
   MAIN PAGE
======================================================== */

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");
  const [sortOrder, setSortOrder] =
    useState("Newest First");

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrder | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);

      const data =
        await purchaseOrderService.getPurchaseOrders();

      setOrders(data);
    } catch (error) {
      console.error(
        "Failed to load purchase orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchaseOrder = async (
    data: PurchaseOrderCreate
  ) => {
    try {
      await purchaseOrderService.createPurchaseOrder(
        data
      );

      await loadPurchaseOrders();

      setOpenAdd(false);
    } catch (error) {
      console.error(
        "Failed to create purchase order:",
        error
      );

      alert("Failed to create purchase order.");
      throw error;
    }
  };

  const handleEditPurchaseOrder = (
    order: PurchaseOrder
  ) => {
    setSelectedOrder(order);
    setOpenEdit(true);
  };

  const handleUpdatePurchaseOrder = async (
    id: number,
    data: PurchaseOrderUpdate
  ) => {
    try {
      await purchaseOrderService.updatePurchaseOrder(
        id,
        data
      );

      await loadPurchaseOrders();

      setOpenEdit(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error(
        "Failed to update purchase order:",
        error
      );

      alert("Failed to update purchase order.");
      throw error;
    }
  };

  const handleDeletePurchaseOrder = (
    order: PurchaseOrder
  ) => {
    setSelectedOrder(order);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) {
      return;
    }

    try {
      await purchaseOrderService.deletePurchaseOrder(
        selectedOrder.id
      );

      await loadPurchaseOrders();

      setOpenDelete(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error(
        "Failed to delete purchase order:",
        error
      );

      alert("Failed to delete purchase order.");
      throw error;
    }
  };

  /* ======================================================
     KPI DATA
  ====================================================== */

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status.toLowerCase() === "pending"
  ).length;

  const approvedOrders = orders.filter(
    (order) =>
      order.status.toLowerCase() === "approved"
  ).length;

  const totalProcurementValue = orders.reduce(
    (total, order) =>
      total + Number(order.total_amount || 0),
    0
  );

  /* ======================================================
     FILTER + SEARCH + SORT
  ====================================================== */

  const filteredOrders = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    const filtered = orders.filter(
      (order: PurchaseOrder) => {
        const matchesSearch =
          !search ||
          order.po_number
            .toLowerCase()
            .includes(search) ||
          order.status
            .toLowerCase()
            .includes(search) ||
          order.currency
            .toLowerCase()
            .includes(search) ||
          String(order.supplier_id)
            .toLowerCase()
            .includes(search) ||
          (order.notes || "")
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "All Status" ||
          order.status === statusFilter;

        return matchesSearch && matchesStatus;
      }
    );

    return [...filtered].sort((a, b) => {
      const dateA = new Date(
        a.order_date
      ).getTime();

      const dateB = new Date(
        b.order_date
      ).getTime();

      if (sortOrder === "Newest First") {
        return dateB - dateA;
      }

      if (sortOrder === "Oldest First") {
        return dateA - dateB;
      }

      if (sortOrder === "Highest Amount") {
        return (
          Number(b.total_amount) -
          Number(a.total_amount)
        );
      }

      if (sortOrder === "Lowest Amount") {
        return (
          Number(a.total_amount) -
          Number(b.total_amount)
        );
      }

      return 0;
    });
  }, [
    orders,
    searchTerm,
    statusFilter,
    sortOrder,
  ]);

  /* ======================================================
     FORMATTERS
  ====================================================== */

  const formatCurrency = (
    amount: number,
    currency: string
  ) => {
    try {
      return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: currency || "ZAR",
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency || "ZAR"} ${amount.toLocaleString(
        "en-ZA",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  const getStatusStyle = (status: string) => {
    const value = status.toLowerCase();

    if (value === "approved") {
      return {
        background: "#ECFDF3",
        color: "#15803D",
        dot: "#16A34A",
      };
    }

    if (value === "pending") {
      return {
        background: "#FFF7E8",
        color: "#B45309",
        dot: "#F59E0B",
      };
    }

    if (value === "received") {
      return {
        background: "#EEF4FF",
        color: "#1D4ED8",
        dot: "#2563EB",
      };
    }

    if (value === "cancelled") {
      return {
        background: "#FEF2F2",
        color: "#B91C1C",
        dot: "#DC2626",
      };
    }

    return {
      background: "#F1F5F9",
      color: "#475569",
      dot: "#64748B",
    };
  };

  return (
    <div className="purchase-page">
      <style>
        {`
          .purchase-page {
            min-height: 100%;
            padding: 4px 2px 40px;
            color: #0F172A;
            background: #F8FAFC;
          }

          .purchase-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 30px;
          }

          .purchase-title-area {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .purchase-title-icon {
            width: 58px;
            height: 58px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2563EB;
            background: linear-gradient(
              135deg,
              #DBEAFE 0%,
              #EFF6FF 100%
            );
            box-shadow:
              0 8px 22px rgba(37, 99, 235, 0.10);
          }

          .purchase-title {
            margin: 0;
            font-size: 30px;
            line-height: 1.1;
            font-weight: 800;
            letter-spacing: -0.7px;
            color: #0F172A;
          }

          .purchase-subtitle {
            margin: 7px 0 0;
            color: #64748B;
            font-size: 14px;
          }

          .create-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            height: 48px;
            padding: 0 20px;
            border: none;
            border-radius: 11px;
            background: linear-gradient(
              135deg,
              #2563EB 0%,
              #1D4ED8 100%
            );
            color: #FFFFFF;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            box-shadow:
              0 8px 20px rgba(37, 99, 235, 0.22);
            transition:
              transform 0.18s ease,
              box-shadow 0.18s ease;
          }

          .create-button:hover {
            transform: translateY(-1px);
            box-shadow:
              0 11px 24px rgba(37, 99, 235, 0.28);
          }

          .kpi-grid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 28px;
          }

          .kpi-card {
            position: relative;
            overflow: hidden;
            min-height: 144px;
            padding: 20px;
            border: 1px solid #E5EAF1;
            border-radius: 16px;
            background: #FFFFFF;
            box-shadow:
              0 7px 22px rgba(15, 23, 42, 0.05);
          }

          .kpi-card::after {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            right: -45px;
            bottom: -55px;
            border-radius: 50%;
            background: rgba(37, 99, 235, 0.035);
          }

          .kpi-top {
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .kpi-icon {
            width: 46px;
            height: 46px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 13px;
          }

          .kpi-label {
            margin-bottom: 5px;
            font-size: 12px;
            font-weight: 700;
            color: #64748B;
          }

          .kpi-value {
            font-size: 25px;
            line-height: 1;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #0F172A;
          }

          .kpi-footer {
            margin-top: 18px;
            font-size: 11px;
            font-weight: 500;
            color: #94A3B8;
          }

          .filters-card {
            display: grid;
            grid-template-columns:
              minmax(300px, 1fr) 190px 190px;
            gap: 12px;
            margin-bottom: 22px;
          }

          .search-wrapper {
            position: relative;
          }

          .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748B;
            pointer-events: none;
          }

          .search-input {
            width: 100%;
            height: 50px;
            padding: 0 16px 0 45px;
            border: 1px solid #E2E8F0;
            border-radius: 11px;
            outline: none;
            background: #FFFFFF;
            color: #0F172A;
            font-size: 13px;
            box-sizing: border-box;
            box-shadow:
              0 3px 10px rgba(15, 23, 42, 0.025);
            transition:
              border-color 0.18s ease,
              box-shadow 0.18s ease;
          }

          .search-input:focus {
            border-color: #93C5FD;
            box-shadow:
              0 0 0 3px rgba(37, 99, 235, 0.08);
          }

          .filter-select {
            width: 100%;
            height: 50px;
            padding: 0 13px;
            border: 1px solid #E2E8F0;
            border-radius: 11px;
            outline: none;
            background: #FFFFFF;
            color: #334155;
            font-size: 13px;
            cursor: pointer;
            box-sizing: border-box;
          }

          .filter-select:focus {
            border-color: #93C5FD;
            box-shadow:
              0 0 0 3px rgba(37, 99, 235, 0.08);
          }

          .orders-card {
            overflow: hidden;
            border: 1px solid #E4EAF2;
            border-radius: 17px;
            background: #FFFFFF;
            box-shadow:
              0 10px 28px rgba(15, 23, 42, 0.055);
          }

          .orders-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 20px 24px;
            border-bottom: 1px solid #EEF2F7;
          }

          .orders-heading {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .orders-heading-icon {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background: #EEF4FF;
            color: #2563EB;
          }

          .orders-title {
            margin: 0;
            color: #0F172A;
            font-size: 17px;
            font-weight: 800;
          }

          .orders-description {
            margin: 4px 0 0;
            color: #64748B;
            font-size: 12px;
          }

          .refresh-button {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #E2E8F0;
            border-radius: 9px;
            background: #FFFFFF;
            color: #64748B;
            cursor: pointer;
          }

          .refresh-button:hover {
            background: #F8FAFC;
            color: #2563EB;
          }

          .result-strip {
            padding: 11px 24px;
            border-bottom: 1px solid #EEF2F7;
            background: #F8FAFC;
            color: #64748B;
            font-size: 12px;
          }

          .table-scroll {
            width: 100%;
            overflow-x: auto;
          }

          .orders-table {
            width: 100%;
            min-width: 900px;
            border-collapse: separate;
            border-spacing: 0;
          }

          .orders-table thead th {
            padding: 13px 20px;
            border-bottom: 1px solid #E9EEF5;
            background: #F8FAFC;
            color: #64748B;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.8px;
            text-align: left;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .orders-table tbody td {
            padding: 16px 20px;
            border-bottom: 1px solid #F0F3F7;
            color: #334155;
            font-size: 13px;
            vertical-align: middle;
          }

          .orders-table tbody tr {
            transition: background 0.15s ease;
          }

          .orders-table tbody tr:hover {
            background: #FAFCFF;
          }

          .orders-table tbody tr:last-child td {
            border-bottom: none;
          }

          .po-number {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            color: #1D4ED8;
            font-size: 13px;
            font-weight: 800;
          }

          .po-mini-icon {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #EEF4FF;
            color: #2563EB;
          }

          .supplier-reference {
            display: inline-flex;
            align-items: center;
            padding: 5px 9px;
            border-radius: 7px;
            background: #F1F5F9;
            color: #475569;
            font-size: 11px;
            font-weight: 700;
          }

          .date-primary {
            color: #334155;
            font-weight: 600;
          }

          .amount-cell {
            color: #0F172A;
            font-size: 13px;
            font-weight: 800;
            white-space: nowrap;
          }

          .currency-label {
            margin-left: 5px;
            color: #94A3B8;
            font-size: 10px;
            font-weight: 700;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.35px;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }

          .notes-cell {
            max-width: 190px;
            overflow: hidden;
            color: #64748B;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .actions-cell {
            width: 92px;
            text-align: right;
            white-space: nowrap;
          }

          .action-buttons {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .action-button {
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            background: #FFFFFF;
            cursor: pointer;
            transition:
              background 0.15s ease,
              border-color 0.15s ease,
              color 0.15s ease;
          }

          .edit-button {
            color: #475569;
          }

          .edit-button:hover {
            border-color: #BFDBFE;
            background: #EFF6FF;
            color: #2563EB;
          }

          .delete-button {
            color: #94A3B8;
          }

          .delete-button:hover {
            border-color: #FECACA;
            background: #FEF2F2;
            color: #DC2626;
          }

          .empty-state {
            padding: 65px 30px;
            text-align: center;
          }

          .empty-icon {
            width: 52px;
            height: 52px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            background: #F1F5F9;
            color: #64748B;
          }

          .empty-title {
            margin: 0 0 6px;
            color: #334155;
            font-size: 15px;
            font-weight: 800;
          }

          .empty-description {
            margin: 0;
            color: #94A3B8;
            font-size: 12px;
          }

          .loading-state {
            padding: 65px 30px;
            text-align: center;
          }

          .loading-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 13px;
            background: #EEF4FF;
            color: #2563EB;
          }

          .loading-text {
            color: #64748B;
            font-size: 13px;
            font-weight: 600;
          }

          @media (max-width: 1100px) {
            .kpi-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

            .filters-card {
              grid-template-columns:
                1fr 1fr;
            }

            .search-wrapper {
              grid-column: 1 / -1;
            }
          }

          @media (max-width: 700px) {
            .purchase-page {
              padding: 0 0 30px;
            }

            .purchase-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .create-button {
              width: 100%;
            }

            .kpi-grid {
              grid-template-columns: 1fr;
            }

            .filters-card {
              grid-template-columns: 1fr;
            }

            .search-wrapper {
              grid-column: auto;
            }
          }
        `}
      </style>

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="purchase-header">
        <div className="purchase-title-area">
          <div className="purchase-title-icon">
            <ClipboardIcon />
          </div>

          <div>
            <h1 className="purchase-title">
              Purchase Orders
            </h1>

            <p className="purchase-subtitle">
              Create, manage and track your procurement orders
            </p>
          </div>
        </div>

        <button
          type="button"
          className="create-button"
          onClick={() => setOpenAdd(true)}
        >
          <PlusIcon />
          Create Purchase Order
        </button>
      </div>

      {/* ==================================================
          KPI CARDS
      ================================================== */}

      <div className="kpi-grid">
        {/* TOTAL */}

        <div className="kpi-card">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{
                background: "#EEF4FF",
                color: "#2563EB",
              }}
            >
              <ClipboardIcon />
            </div>

            <div>
              <div className="kpi-label">
                Total Purchase Orders
              </div>

              <div className="kpi-value">
                {totalOrders}
              </div>
            </div>
          </div>

          <div className="kpi-footer">
            All procurement orders
          </div>
        </div>

        {/* PENDING */}

        <div className="kpi-card">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{
                background: "#FFF7E8",
                color: "#D97706",
              }}
            >
              <ClockIcon />
            </div>

            <div>
              <div
                className="kpi-label"
                style={{
                  color: "#D97706",
                }}
              >
                Pending Orders
              </div>

              <div className="kpi-value">
                {pendingOrders}
              </div>
            </div>
          </div>

          <div className="kpi-footer">
            Awaiting approval
          </div>
        </div>

        {/* APPROVED */}

        <div className="kpi-card">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{
                background: "#ECFDF3",
                color: "#16A34A",
              }}
            >
              <CheckIcon />
            </div>

            <div>
              <div
                className="kpi-label"
                style={{
                  color: "#16A34A",
                }}
              >
                Approved Orders
              </div>

              <div className="kpi-value">
                {approvedOrders}
              </div>
            </div>
          </div>

          <div className="kpi-footer">
            Approved for procurement
          </div>
        </div>

        {/* VALUE */}

        <div className="kpi-card">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{
                background: "#F4EDFF",
                color: "#7C3AED",
              }}
            >
              <MoneyIcon />
            </div>

            <div>
              <div
                className="kpi-label"
                style={{
                  color: "#7C3AED",
                }}
              >
                Procurement Value
              </div>

              <div
                className="kpi-value"
                style={{
                  fontSize: "21px",
                }}
              >
                {new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                  maximumFractionDigits: 0,
                }).format(totalProcurementValue)}
              </div>
            </div>
          </div>

          <div className="kpi-footer">
            Total purchase order value
          </div>
        </div>
      </div>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}

      <div className="filters-card">
        <div className="search-wrapper">
          <div className="search-icon">
            <SearchIcon />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by PO number, supplier, status or currency..."
            className="search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="filter-select"
        >
          <option value="All Status">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Received">
            Received
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
          className="filter-select"
        >
          <option value="Newest First">
            Newest First
          </option>

          <option value="Oldest First">
            Oldest First
          </option>

          <option value="Highest Amount">
            Highest Amount
          </option>

          <option value="Lowest Amount">
            Lowest Amount
          </option>
        </select>
      </div>

      {/* ==================================================
          PROCUREMENT TABLE
      ================================================== */}

      <div className="orders-card">
        <div className="orders-card-header">
          <div className="orders-heading">
            <div className="orders-heading-icon">
              <ClipboardIcon />
            </div>

            <div>
              <h2 className="orders-title">
                Procurement Orders
              </h2>

              <p className="orders-description">
                Review and manage all purchase orders
              </p>
            </div>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={loadPurchaseOrders}
            title="Refresh purchase orders"
          >
            <RefreshIcon />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-icon">
              <RefreshIcon />
            </div>

            <div className="loading-text">
              Loading purchase orders...
            </div>
          </div>
        ) : (
          <>
            {(searchTerm.trim() ||
              statusFilter !== "All Status") && (
              <div className="result-strip">
                Showing{" "}
                <strong
                  style={{
                    color: "#0F172A",
                  }}
                >
                  {filteredOrders.length}
                </strong>{" "}
                of{" "}
                <strong
                  style={{
                    color: "#0F172A",
                  }}
                >
                  {orders.length}
                </strong>{" "}
                purchase orders
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ClipboardIcon />
                </div>

                <h3 className="empty-title">
                  No Purchase Orders Found
                </h3>

                <p className="empty-description">
                  Try changing your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Purchase Order</th>
                      <th>Supplier</th>
                      <th>Order Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th
                        style={{
                          textAlign: "right",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => {
                      const statusStyle =
                        getStatusStyle(
                          order.status
                        );

                      return (
                        <tr key={order.id}>
                          {/* PO NUMBER */}

                          <td>
                            <div className="po-number">
                              <span className="po-mini-icon">
                                <ClipboardIcon />
                              </span>

                              {order.po_number}
                            </div>
                          </td>

                          {/* SUPPLIER */}

                          <td>
                            <span className="supplier-reference">
                              SUP-
                              {String(
                                order.supplier_id
                              ).padStart(4, "0")}
                            </span>
                          </td>

                          {/* DATE */}

                          <td>
                            <span className="date-primary">
                              {formatDate(
                                order.order_date
                              )}
                            </span>
                          </td>

                          {/* AMOUNT */}

                          <td>
                            <span className="amount-cell">
                              {formatCurrency(
                                Number(
                                  order.total_amount ||
                                    0
                                ),
                                order.currency
                              )}
                            </span>

                            <span className="currency-label">
                              {order.currency}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background:
                                  statusStyle.background,
                                color:
                                  statusStyle.color,
                              }}
                            >
                              <span
                                className="status-dot"
                                style={{
                                  background:
                                    statusStyle.dot,
                                }}
                              />

                              {order.status}
                            </span>
                          </td>

                          {/* NOTES */}

                          <td>
                            <div
                              className="notes-cell"
                              title={
                                order.notes ||
                                "No notes"
                              }
                            >
                              {order.notes ||
                                "No notes"}
                            </div>
                          </td>

                          {/* ACTIONS */}

                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button
                                type="button"
                                className="action-button edit-button"
                                title="Edit purchase order"
                                aria-label={`Edit ${order.po_number}`}
                                onClick={() =>
                                  handleEditPurchaseOrder(
                                    order
                                  )
                                }
                              >
                                <EditIcon />
                              </button>

                              <button
                                type="button"
                                className="action-button delete-button"
                                title="Delete purchase order"
                                aria-label={`Delete ${order.po_number}`}
                                onClick={() =>
                                  handleDeletePurchaseOrder(
                                    order
                                  )
                                }
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ==================================================
          MODALS
      ================================================== */}

      <AddPurchaseOrderModal
        open={openAdd}
        onClose={() =>
          setOpenAdd(false)
        }
        onSave={
          handleAddPurchaseOrder
        }
      />

      <EditPurchaseOrderModal
        open={openEdit}
        order={selectedOrder}
        onClose={() => {
          setOpenEdit(false);
          setSelectedOrder(null);
        }}
        onUpdate={
          handleUpdatePurchaseOrder
        }
      />

      <DeletePurchaseOrderDialog
        open={openDelete}
        order={selectedOrder}
        onClose={() => {
          setOpenDelete(false);
          setSelectedOrder(null);
        }}
        onDelete={
          handleConfirmDelete
        }
      />
    </div>
  );
}