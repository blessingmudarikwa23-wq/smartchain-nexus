import { useEffect, useMemo, useState } from "react";

import SupplierTable from "../components/suppliers/SupplierTable";
import AddSupplierModal from "../components/suppliers/AddSupplierModal";
import EditSupplierModal from "../components/suppliers/EditSupplierModal";
import DeleteSupplierDialog from "../components/suppliers/DeleteSupplierDialog";

import {
  supplierService,
  type Supplier,
  type SupplierCreate,
  type SupplierUpdate,
} from "../services/supplierService";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
    }
  };

  const handleAddSupplier = async (data: SupplierCreate) => {
    try {
      await supplierService.createSupplier(data);

      await loadSuppliers();

      setOpenAdd(false);
    } catch (error) {
      console.error("Failed to create supplier:", error);
      alert("Failed to create supplier.");
      throw error;
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenEdit(true);
  };

  const handleUpdateSupplier = async (
    id: number,
    data: SupplierUpdate
  ) => {
    try {
      await supplierService.updateSupplier(id, data);

      await loadSuppliers();

      setOpenEdit(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error("Failed to update supplier:", error);
      alert("Failed to update supplier.");
      throw error;
    }
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupplier) {
      return;
    }

    try {
      await supplierService.deleteSupplier(selectedSupplier.id);

      await loadSuppliers();

      setOpenDelete(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      alert("Failed to delete supplier.");
      throw error;
    }
  };

  const filteredSuppliers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const filtered = suppliers.filter((supplier) => {
      const matchesSearch =
        !searchValue ||
        supplier.company_name.toLowerCase().includes(searchValue) ||
        supplier.supplier_code.toLowerCase().includes(searchValue) ||
        supplier.contact_person.toLowerCase().includes(searchValue) ||
        supplier.email.toLowerCase().includes(searchValue) ||
        supplier.phone.toLowerCase().includes(searchValue) ||
        supplier.city.toLowerCase().includes(searchValue) ||
        supplier.country.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        (supplier.status
          ? "active"
          : "inactive") === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "Newest First") {
        return b.id - a.id;
      }

      if (sortOrder === "Oldest First") {
        return a.id - b.id;
      }

      if (sortOrder === "Name A-Z") {
        return a.company_name.localeCompare(b.company_name);
      }

      if (sortOrder === "Name Z-A") {
        return b.company_name.localeCompare(a.company_name);
      }

      return 0;
    });
  }, [suppliers, search, statusFilter, sortOrder]);

  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status
  ).length;

  const inactiveSuppliers =
    totalSuppliers - activeSuppliers;

  return (
    <div style={page}>
      <div style={header}>
        <div style={headerLeft}>
          <div style={headerIcon}>
            <span>🏢</span>
            <div style={onlineDot} />
          </div>

          <div>
            <h1 style={title}>Suppliers</h1>

            <p style={subtitle}>
              Manage and maintain your supplier relationships
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          style={addButton}
        >
          <span style={buttonIcon}>⊕</span>
          Add Supplier
        </button>
      </div>

      <div style={statsGrid}>
        <StatCard
          title="Total Suppliers"
          value={totalSuppliers}
          description="All registered suppliers"
          icon="🏢"
          iconBackground="#E8F0FF"
          iconColor="#2563EB"
        />

        <StatCard
          title="Active Suppliers"
          value={activeSuppliers}
          description="Currently active"
          icon="✓"
          iconBackground="#E8FBF0"
          iconColor="#16A34A"
        />

        <StatCard
          title="Inactive Suppliers"
          value={inactiveSuppliers}
          description="Currently inactive"
          icon="◌"
          iconBackground="#FFF5D8"
          iconColor="#F59E0B"
        />

        <StatCard
          title="Displayed"
          value={filteredSuppliers.length}
          description="Matching current filters"
          icon="⌕"
          iconBackground="#F3E9FF"
          iconColor="#7C3AED"
        />
      </div>

      <div style={filterCard}>
        <div style={searchWrapper}>
          <span style={searchIcon}>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search suppliers by name, code, email or phone..."
            style={searchInput}
          />
        </div>

        <div style={selectWrapper}>
          <span style={filterIcon}>▽</span>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={select}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div style={selectWrapper}>
          <span style={sortIcon}>↕</span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
            style={select}
          >
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Name A-Z</option>
            <option>Name Z-A</option>
          </select>
        </div>
      </div>

      <div style={tableCard}>
        <div style={tableHeader}>
          <div style={tableTitleWrapper}>
            <div style={tableTitleIcon}>🏢</div>

            <h2 style={tableTitle}>
              Supplier List
            </h2>
          </div>
        </div>

        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />

        <div style={tableFooter}>
          <span style={footerText}>
            Showing {filteredSuppliers.length} of{" "}
            {suppliers.length} suppliers
          </span>

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
              disabled
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <AddSupplierModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAddSupplier}
      />

      <EditSupplierModal
        open={openEdit}
        supplier={selectedSupplier}
        onClose={() => {
          setOpenEdit(false);
          setSelectedSupplier(null);
        }}
        onUpdate={handleUpdateSupplier}
      />

      <DeleteSupplierDialog
        open={openDelete}
        supplier={selectedSupplier}
        onClose={() => {
          setOpenDelete(false);
          setSelectedSupplier(null);
        }}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
};

function StatCard({
  title,
  value,
  description,
  icon,
  iconBackground,
  iconColor,
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
        <div
          style={{
            ...statTitle,
            color: iconColor,
          }}
        >
          {title}
        </div>

        <div style={statValue}>{value}</div>

        <div style={statDescription}>
          {description}
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  width: "100%",
  minHeight: "100%",
  padding: "8px 4px 40px",
  boxSizing: "border-box",
};

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
  boxShadow: "0 8px 20px rgba(37,99,235,.18)",
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
  boxShadow: "0 7px 18px rgba(37,99,235,.22)",
};

const buttonIcon: React.CSSProperties = {
  fontSize: "19px",
  lineHeight: 1,
};

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
  fontSize: "22px",
};

const statContent: React.CSSProperties = {
  flex: 1,
};

const statTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
};

const statValue: React.CSSProperties = {
  fontSize: "27px",
  fontWeight: 800,
  color: "#0F172A",
};

const statDescription: React.CSSProperties = {
  marginTop: "14px",
  color: "#64748B",
  fontSize: "11px",
};

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
};

const searchIcon: React.CSSProperties = {
  position: "absolute",
  left: "15px",
  top: "50%",
  transform: "translateY(-50%)",
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
};

const selectWrapper: React.CSSProperties = {
  position: "relative",
};

const filterIcon: React.CSSProperties = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748B",
  zIndex: 1,
};

const sortIcon: React.CSSProperties = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
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

const tableCard: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E7ECF3",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 7px 22px rgba(15,23,42,.055)",
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
  width: "30px",
  height: "30px",
  borderRadius: "9px",
  background: "#EEF4FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
};

const tableTitle: React.CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 750,
};

const tableFooter: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 22px",
  borderTop: "1px solid #EEF1F5",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#64748B",
};

const pagination: React.CSSProperties = {
  display: "flex",
  gap: "7px",
};

const paginationButton: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#94A3B8",
  fontSize: "18px",
};

const paginationActive: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  fontWeight: 700,
};