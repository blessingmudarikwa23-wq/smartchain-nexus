import { useEffect, useMemo, useState } from "react";

import AddCustomerModal from "../components/customers/AddCustomerModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import DeleteCustomerDialog from "../components/customers/DeleteCustomerDialog";

import {
  customerService,
  type Customer,
  type CustomerCreate,
} from "../services/customerService";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 4;

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    }
  };

  const handleAddCustomer = async (data: CustomerCreate) => {
    try {
      await customerService.createCustomer(data);

      await loadCustomers();

      setOpenAdd(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to create customer:", error);
      alert("Failed to create customer.");
      throw error;
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenEdit(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDelete(true);
  };

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    const result = customers.filter((customer) => {
      const matchesSearch =
        !searchValue ||
        customer.customer_name
          .toLowerCase()
          .includes(searchValue) ||
        customer.customer_code
          .toLowerCase()
          .includes(searchValue) ||
        (customer.email ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        (customer.phone ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        customer.status.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "Newest First") {
        return b.id - a.id;
      }

      if (sortOrder === "Oldest First") {
        return a.id - b.id;
      }

      if (sortOrder === "Name A-Z") {
        return a.customer_name.localeCompare(
          b.customer_name
        );
      }

      if (sortOrder === "Name Z-A") {
        return b.customer_name.localeCompare(
          a.customer_name
        );
      }

      return 0;
    });
  }, [
    customers,
    search,
    statusFilter,
    sortOrder,
  ]);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) =>
      customer.status.toLowerCase() === "active"
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) =>
      total + Number(customer.total_orders || 0),
    0
  );

  const totalRevenue = customers.reduce(
    (total, customer) =>
      total + Number(customer.total_spend || 0),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCustomers.length / customersPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * customersPerPage;

  const endIndex =
    startIndex + customersPerPage;

  const paginatedCustomers =
    filteredCustomers.slice(
      startIndex,
      endIndex
    );

  const showingFrom =
    filteredCustomers.length === 0
      ? 0
      : startIndex + 1;

  const showingTo = Math.min(
    endIndex,
    filteredCustomers.length
  );

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortOrder]);

  return (
    <div style={page}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={header}>
        <div style={headerLeft}>
          <div style={headerIcon}>
            <span>👥</span>
            <div style={onlineDot} />
          </div>

          <div>
            <h1 style={title}>
              Customers
            </h1>

            <p style={subtitle}>
              Manage and maintain your customer
              relationships
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          style={addButton}
        >
          <span style={buttonIcon}>
            ⊕
          </span>

          Add Customer
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div style={statsGrid}>
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          description="All registered customers"
          icon="👥"
          iconBackground="#E8F0FF"
          iconColor="#2563EB"
          valueColor="#0F172A"
          lineColor="#2563EB"
        />

        <StatCard
          title="Active Customers"
          value={activeCustomers}
          description="Currently active"
          icon="🛒"
          iconBackground="#E8FBF0"
          iconColor="#16A34A"
          valueColor="#0F172A"
          lineColor="#16A34A"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          description="Across all customers"
          icon="◔"
          iconBackground="#FFF5D8"
          iconColor="#F59E0B"
          valueColor="#0F172A"
          lineColor="#F59E0B"
        />

        <StatCard
          title="Total Revenue"
          value={`R ${totalRevenue.toLocaleString(
            "en-ZA",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }
          )}`}
          description="Total spending"
          icon="◉"
          iconBackground="#F3E9FF"
          iconColor="#7C3AED"
          valueColor="#0F172A"
          lineColor="#7C3AED"
        />
      </div>

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div style={filterCard}>
        <div style={searchWrapper}>
          <span style={searchIcon}>
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customers by name, email or phone..."
            style={searchInput}
          />
        </div>

        <div style={selectWrapper}>
          <span style={filterIcon}>
            ▽
          </span>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={select}
          >
            <option>
              All Status
            </option>

            <option>
              Active
            </option>

            <option>
              Inactive
            </option>
          </select>
        </div>

        <div style={selectWrapper}>
          <span style={sortIcon}>
            ↕
          </span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
            style={select}
          >
            <option>
              Newest First
            </option>

            <option>
              Oldest First
            </option>

            <option>
              Name A-Z
            </option>

            <option>
              Name Z-A
            </option>
          </select>
        </div>
      </div>

      {/* =====================================================
          CUSTOMER LIST
      ===================================================== */}

      <div style={tableCard}>
        <div style={tableHeader}>
          <div style={tableTitleWrapper}>
            <div style={tableTitleIcon}>
              ♙
            </div>

            <h2 style={tableTitle}>
              Customer List
            </h2>
          </div>
        </div>

        {/* ===================================================
            TABLE HEADER
        =================================================== */}

        <div style={tableHeaderRow}>
          <div>
            Customer
          </div>

          <div>
            Email
          </div>

          <div>
            Phone
          </div>

          <div>
            Address
          </div>

          <div>
            Status
          </div>

          <div>
            Actions
          </div>
        </div>

        {/* ===================================================
            TABLE ROWS
        =================================================== */}

        {paginatedCustomers.length === 0 ? (
          <div style={emptyState}>
            <div style={emptyIcon}>
              👥
            </div>

            <h3 style={emptyTitle}>
              No customers found
            </h3>

            <p style={emptyText}>
              Try adjusting your search or
              filters.
            </p>
          </div>
        ) : (
          paginatedCustomers.map(
            (customer) => {
              const initials =
                customer.customer_name
                  .trim()
                  .charAt(0)
                  .toUpperCase() || "?";

              const isActive =
                customer.status.toLowerCase() ===
                "active";

              return (
                <div
                  key={customer.id}
                  style={customerRow}
                >
                  {/* CUSTOMER */}

                  <div style={customerCell}>
                    <div
                      style={{
                        ...avatar,
                        background:
                          getAvatarBackground(
                            customer.customer_name
                          ),
                      }}
                    >
                      {initials}

                      <span
                        style={avatarOnline}
                      />
                    </div>

                    <div
                      style={customerIdentity}
                    >
                      <div
                        style={customerName}
                      >
                        {customer.customer_name}
                      </div>

                      <div
                        style={customerCode}
                      >
                        {customer.customer_code}
                      </div>
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div style={emailCell}>
                    {customer.email || "—"}
                  </div>

                  {/* PHONE */}

                  <div style={phoneCell}>
                    <span
                      style={phoneIcon}
                    >
                      ♧
                    </span>

                    <span>
                      {customer.phone || "—"}
                    </span>
                  </div>

                  {/* ADDRESS */}

                  <div style={addressCell}>
                    <span
                      style={locationIcon}
                    >
                      ♧
                    </span>

                    <span>
                      {customer.address || "—"}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div>
                    <span
                      style={
                        isActive
                          ? activeBadge
                          : inactiveBadge
                      }
                    >
                      <span
                        style={
                          isActive
                            ? activeDot
                            : inactiveDot
                        }
                      />

                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div style={actionsCell}>
                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(customer)
                      }
                      style={editButton}
                      title="Edit customer"
                      aria-label={`Edit ${customer.customer_name}`}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(customer)
                      }
                      style={deleteButton}
                      title="Delete customer"
                      aria-label={`Delete ${customer.customer_name}`}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v5" />
                        <path d="M14 11v5" />
                      </svg>
                    </button>

                    {/* MORE */}

                    <button
                      type="button"
                      style={moreButton}
                      title="More actions"
                      aria-label="More customer actions"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              );
            }
          )
        )}

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div style={tableFooter}>
          <span style={footerText}>
            Showing {showingFrom} to{" "}
            {showingTo} of{" "}
            {filteredCustomers.length}{" "}
            customers
          </span>

          <div style={pagination}>
            <button
              type="button"
              onClick={() =>
                changePage(
                  safeCurrentPage - 1
                )
              }
              disabled={
                safeCurrentPage === 1
              }
              style={{
                ...paginationButton,
                ...(safeCurrentPage === 1
                  ? paginationDisabled
                  : {}),
              }}
            >
              ‹
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    changePage(
                      pageNumber
                    )
                  }
                  style={
                    pageNumber ===
                    safeCurrentPage
                      ? paginationActive
                      : paginationButton
                  }
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                changePage(
                  safeCurrentPage + 1
                )
              }
              disabled={
                safeCurrentPage ===
                totalPages
              }
              style={{
                ...paginationButton,
                ...(safeCurrentPage ===
                totalPages
                  ? paginationDisabled
                  : {}),
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}

      <AddCustomerModal
        open={openAdd}
        onClose={() =>
          setOpenAdd(false)
        }
        onSave={handleAddCustomer}
      />

      <EditCustomerModal
        open={openEdit}
        customer={selectedCustomer}
        onClose={() =>
          setOpenEdit(false)
        }
      />

      <DeleteCustomerDialog
        open={openDelete}
        customer={selectedCustomer}
        onClose={() =>
          setOpenDelete(false)
        }
      />
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
  valueColor: string;
  lineColor: string;
};

function StatCard({
  title,
  value,
  description,
  icon,
  iconBackground,
  iconColor,
  valueColor,
  lineColor,
}: StatCardProps) {
  return (
    <div style={statCard}>
      <div
        style={{
          ...statIcon,
          background:
            iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div style={statContent}>
        <div
          style={{
            ...statTitle,
            color: iconColor,
          }}
        >
          {title}
        </div>

        <div
          style={{
            ...statValue,
            color: valueColor,
          }}
        >
          {value}
        </div>

        <div style={statBottom}>
          <span
            style={statDescription}
          >
            {description}
          </span>

          <div
            style={{
              ...miniChart,
              borderTopColor:
                lineColor,
            }}
          >
            <span
              style={{
                ...chartLine,
                borderColor:
                  lineColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AVATAR COLOR
========================================================= */

function getAvatarBackground(
  name: string
) {
  const colors = [
    "#E8F0FF",
    "#E5F8EE",
    "#FFF0DE",
    "#F1E9FF",
    "#E8F7FA",
  ];

  const index =
    name.charCodeAt(0) %
    colors.length;

  return colors[index];
}

/* =========================================================
   PAGE
========================================================= */

const page: React.CSSProperties = {
  width: "100%",
  minHeight: "100%",
  padding: "8px 4px 40px",
  boxSizing: "border-box",
};

/* =========================================================
   HEADER
========================================================= */

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "28px",
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const headerIcon: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #7EA2FF 0%, #4F73E8 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  position: "relative",
  boxShadow:
    "0 8px 20px rgba(37,99,235,.18)",
};

const onlineDot: React.CSSProperties = {
  position: "absolute",
  right: "4px",
  bottom: "4px",
  width: "11px",
  height: "11px",
  borderRadius: "50%",
  background: "#22C55E",
  border: "2px solid white",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#0F172A",
  letterSpacing: "-1.2px",
};

const subtitle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: "14px",
  color: "#64748B",
};

const addButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg, #2563EB 0%, #315FEA 100%)",
  color: "#FFFFFF",
  padding: "13px 20px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow:
    "0 7px 18px rgba(37,99,235,.22)",
};

const buttonIcon: React.CSSProperties = {
  fontSize: "19px",
  lineHeight: 1,
};

/* =========================================================
   KPI
========================================================= */

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "28px",
};

const statCard: React.CSSProperties = {
  minHeight: "145px",
  background: "#FFFFFF",
  border: "1px solid #E6EBF3",
  borderRadius: "14px",
  padding: "19px",
  display: "flex",
  gap: "14px",
  boxSizing: "border-box",
  boxShadow:
    "0 5px 18px rgba(15,23,42,.055)",
};

const statIcon: React.CSSProperties = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "23px",
};

const statContent: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const statTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
};

const statValue: React.CSSProperties = {
  fontSize: "27px",
  fontWeight: 800,
  letterSpacing: "-0.5px",
};

const statBottom: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  marginTop: "16px",
};

const statDescription: React.CSSProperties = {
  color: "#64748B",
  fontSize: "11px",
  whiteSpace: "nowrap",
};

const miniChart: React.CSSProperties = {
  width: "52px",
  height: "24px",
  position: "relative",
  overflow: "hidden",
};

const chartLine: React.CSSProperties = {
  position: "absolute",
  width: "42px",
  height: "17px",
  right: "0",
  bottom: "0",
  borderWidth: "0 0 2px 0",
  borderStyle: "solid",
  transform:
    "skewY(-22deg) rotate(-8deg)",
};

/* =========================================================
   FILTERS
========================================================= */

const filterCard: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) 180px 180px",
  gap: "14px",
  alignItems: "center",
  background: "#FFFFFF",
  border: "1px solid #E8EDF4",
  borderRadius: "14px",
  padding: "12px",
  marginBottom: "18px",
  boxShadow:
    "0 4px 14px rgba(15,23,42,.035)",
};

const searchWrapper: React.CSSProperties = {
  position: "relative",
  width: "100%",
};

const searchIcon: React.CSSProperties = {
  position: "absolute",
  left: "15px",
  top: "50%",
  transform:
    "translateY(-50%)",
  color: "#64748B",
  fontSize: "22px",
};

const searchInput: React.CSSProperties = {
  width: "100%",
  height: "45px",
  border: "1px solid #DCE3ED",
  borderRadius: "10px",
  padding: "0 14px 0 42px",
  boxSizing: "border-box",
  outline: "none",
  color: "#0F172A",
  fontSize: "13px",
  background: "#FFFFFF",
};

const selectWrapper: React.CSSProperties = {
  position: "relative",
};

const filterIcon: React.CSSProperties = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform:
    "translateY(-50%)",
  color: "#64748B",
  zIndex: 1,
};

const sortIcon: React.CSSProperties = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform:
    "translateY(-50%)",
  color: "#64748B",
  zIndex: 1,
};

const select: React.CSSProperties = {
  width: "100%",
  height: "45px",
  border: "1px solid #DCE3ED",
  borderRadius: "10px",
  padding: "0 30px 0 36px",
  boxSizing: "border-box",
  outline: "none",
  color: "#1E293B",
  background: "#FFFFFF",
  fontSize: "13px",
  cursor: "pointer",
};

/* =========================================================
   CUSTOMER TABLE
========================================================= */

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 10px 30px rgba(15,23,42,.065)",
};

const tableHeader: React.CSSProperties = {
  padding: "22px 24px 17px",
};

const tableTitleWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const tableTitleIcon: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "9px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

const tableTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 750,
};

/*
 * Contact Person has been removed.
 *
 * New columns:
 * Customer | Email | Phone | Address | Status | Actions
 */

const tableHeaderRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "1.35fr 1.35fr 1fr 1.25fr .8fr 1fr",
  alignItems: "center",
  background:
    "linear-gradient(180deg, #F8FAFD 0%, #F4F7FB 100%)",
  borderTop: "1px solid #F0F3F7",
  borderBottom: "1px solid #E8EDF4",
  margin: "0 18px",
  padding: "17px 14px",
  color: "#334155",
  fontSize: "12px",
  fontWeight: 700,
};

const customerRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "1.35fr 1.35fr 1fr 1.25fr .8fr 1fr",
  alignItems: "center",
  minHeight: "100px",
  margin: "0 18px",
  padding: "13px 14px",
  borderBottom:
    "1px solid #EEF1F5",
  color: "#334155",
  fontSize: "13px",
};

const customerCell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
};

const avatar: React.CSSProperties = {
  width: "46px",
  height: "46px",
  minWidth: "46px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2563EB",
  fontSize: "16px",
  fontWeight: 700,
  position: "relative",
};

const avatarOnline: React.CSSProperties = {
  position: "absolute",
  width: "9px",
  height: "9px",
  right: "0",
  bottom: "2px",
  background: "#16A34A",
  border: "2px solid #FFFFFF",
  borderRadius: "50%",
};

const customerIdentity: React.CSSProperties = {
  minWidth: 0,
};

const customerName: React.CSSProperties = {
  color: "#0F172A",
  fontWeight: 700,
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const customerCode: React.CSSProperties = {
  display: "inline-block",
  marginTop: "5px",
  padding: "3px 8px",
  borderRadius: "6px",
  background: "#EEF4FF",
  color: "#2563EB",
  fontSize: "10px",
  fontWeight: 700,
};

const emailCell: React.CSSProperties = {
  color: "#334155",
  paddingRight: "10px",
  wordBreak: "break-word",
  lineHeight: 1.5,
};

const phoneCell: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "7px",
  color: "#334155",
  lineHeight: 1.5,
};

const phoneIcon: React.CSSProperties = {
  color: "#2563EB",
  fontSize: "17px",
};

const addressCell: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "7px",
  color: "#334155",
  lineHeight: 1.55,
  paddingRight: "10px",
};

const locationIcon: React.CSSProperties = {
  color: "#64748B",
  fontSize: "17px",
};

const activeBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#E9F8EF",
  color: "#15803D",
  fontSize: "11px",
  fontWeight: 700,
};

const inactiveBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#EEF2F7",
  color: "#475569",
  fontSize: "11px",
  fontWeight: 700,
};

const activeDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#16A34A",
};

const inactiveDot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#64748B",
};

/* =========================================================
   ACTION BUTTONS
========================================================= */

const actionsCell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const editButton: React.CSSProperties = {
  width: "39px",
  height: "39px",
  borderRadius: "10px",
  border: "1px solid #DCE8FF",
  background: "#F0F5FF",
  color: "#2563EB",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition:
    "all .2s ease",
};

/*
 * Professional delete button
 */

const deleteButton: React.CSSProperties = {
  width: "39px",
  height: "39px",
  borderRadius: "10px",
  border: "1px solid #FECACA",
  background: "#FEF2F2",
  color: "#DC2626",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition:
    "all .2s ease",
};

const moreButton: React.CSSProperties = {
  width: "30px",
  height: "39px",
  border: "none",
  background: "transparent",
  color: "#475569",
  fontSize: "22px",
  cursor: "pointer",
};

/* =========================================================
   EMPTY STATE
========================================================= */

const emptyState: React.CSSProperties = {
  padding: "60px 20px",
  textAlign: "center",
};

const emptyIcon: React.CSSProperties = {
  fontSize: "38px",
  marginBottom: "10px",
};

const emptyTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
};

const emptyText: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

/* =========================================================
   FOOTER
========================================================= */

const tableFooter: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "17px 22px",
  borderTop:
    "1px solid #EEF1F5",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#64748B",
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
  fontSize: "18px",
  cursor: "pointer",
};

const paginationDisabled: React.CSSProperties = {
  color: "#CBD5E1",
  background: "#F8FAFC",
  cursor: "not-allowed",
};

const paginationActive: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "9px",
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  fontWeight: 700,
  cursor: "pointer",
};