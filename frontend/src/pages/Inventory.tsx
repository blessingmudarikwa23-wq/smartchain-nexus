import { useEffect, useMemo, useState } from "react";

import InventoryTable from "../components/inventory/InventoryTable";
import StockStatusCard from "../components/inventory/StockStatusCard";
import AddInventoryModal from "../components/inventory/AddInventoryModal";
import EditInventoryModal from "../components/inventory/EditInventoryModal";
import DeleteInventoryDialog from "../components/inventory/DeleteInventoryDialog";

import {
  inventoryService,
  type Inventory,
} from "../services/inventoryService";

export default function Inventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [selectedInventory, setSelectedInventory] =
    useState<Inventory | null>(null);

  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);

      const data = await inventoryService.getInventory();

      setInventory(data);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let results = inventory.filter((item) => {
      const matchesSearch =
        !term ||
        [
          item.sku,
          item.barcode,
          item.item_name,
          item.category,
          item.warehouse,
          item.unit,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(term)
        );

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && item.status) ||
        (statusFilter === "Inactive" && !item.status);

      return matchesSearch && matchesStatus;
    });

    results = [...results].sort((a, b) => {
      if (sortOrder === "Newest First") {
        return b.id - a.id;
      }

      if (sortOrder === "Oldest First") {
        return a.id - b.id;
      }

      if (sortOrder === "Name A-Z") {
        return a.item_name.localeCompare(b.item_name);
      }

      if (sortOrder === "Name Z-A") {
        return b.item_name.localeCompare(a.item_name);
      }

      if (sortOrder === "Quantity High-Low") {
        return b.quantity - a.quantity;
      }

      if (sortOrder === "Quantity Low-High") {
        return a.quantity - b.quantity;
      }

      return 0;
    });

    return results;
  }, [
    inventory,
    searchTerm,
    statusFilter,
    sortOrder,
  ]);

  const totalItems = inventory.length;

  const healthyStock = inventory.filter(
    (item) =>
      item.quantity > item.minimum_stock
  ).length;

  const lowStock = inventory.filter(
    (item) =>
      item.quantity > 0 &&
      item.quantity <= item.minimum_stock
  ).length;

  const criticalStock = inventory.filter(
    (item) =>
      item.quantity <= 0
  ).length;

  const totalUnits = inventory.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const totalInventoryValue = inventory.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0) *
        Number(item.unit_cost || 0),
    0
  );

  function handleEdit(item: Inventory) {
    setSelectedInventory(item);
    setOpenEdit(true);
  }

  function handleDelete(id: number) {
    setSelectedId(id);
    setOpenDelete(true);
  }

  function handleCloseEdit() {
    setOpenEdit(false);
    setSelectedInventory(null);
  }

  function handleCloseDelete() {
    setOpenDelete(false);
    setSelectedId(null);
  }

  async function handleConfirmDelete() {
    if (selectedId === null) {
      return;
    }

    try {
      await inventoryService.deleteInventory(
        selectedId
      );

      handleCloseDelete();
      await loadInventory();

      alert("Inventory deleted successfully!");
    } catch (error) {
      console.error(
        "Failed to delete inventory:",
        error
      );

      alert("Failed to delete inventory.");
    }
  }

  return (
    <div style={page}>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div style={pageHeader}>
        <div style={titleSection}>
          <div style={pageIcon}>
            📦
          </div>

          <div>
            <h1 style={pageTitle}>
              Inventory
            </h1>

            <p style={pageSubtitle}>
              Manage and maintain your inventory
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          style={addButton}
        >
          <span style={plusCircle}>
            +
          </span>

          Add Inventory
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div style={statsGrid}>
        <div style={statCard}>
          <div>
            <p
              style={{
                ...statLabel,
                color: "#2563eb",
              }}
            >
              Total Items
            </p>

            <h2 style={statValue}>
              {totalItems}
            </h2>

            <p style={statDescription}>
              All inventory records
            </p>
          </div>

          <div style={blueStatIcon}>
            📦
          </div>

          <div style={blueMiniChart}>
            ╱╲╱
          </div>
        </div>

        <div style={statCard}>
          <div>
            <p
              style={{
                ...statLabel,
                color: "#16a34a",
              }}
            >
              Healthy Stock
            </p>

            <h2 style={statValue}>
              {healthyStock}
            </h2>

            <p style={statDescription}>
              Currently healthy
            </p>
          </div>

          <div style={greenStatIcon}>
            ✓
          </div>

          <div style={greenMiniChart}>
            ╱╲╱
          </div>
        </div>

        <div style={statCard}>
          <div>
            <p
              style={{
                ...statLabel,
                color: "#f59e0b",
              }}
            >
              Low Stock
            </p>

            <h2 style={statValue}>
              {lowStock}
            </h2>

            <p style={statDescription}>
              Needs attention
            </p>
          </div>

          <div style={orangeStatIcon}>
            !
          </div>

          <div style={orangeMiniChart}>
            ╱╲╱
          </div>
        </div>

        <div style={statCard}>
          <div>
            <p
              style={{
                ...statLabel,
                color: "#7c3aed",
              }}
            >
              Total Inventory Value
            </p>

            <h2 style={moneyValue}>
              R{" "}
              {totalInventoryValue.toLocaleString(
                "en-ZA",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </h2>

            <p style={statDescription}>
              Current stock value
            </p>
          </div>

          <div style={purpleStatIcon}>
            R
          </div>

          <div style={purpleMiniChart}>
            ╱╲╱
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH / FILTERS
      ====================================================== */}

      <div style={toolbar}>
        <div style={searchBox}>
          <span style={searchIcon}>
            ⌕
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search inventory by SKU, item name, barcode or warehouse..."
            style={searchInput}
          />
        </div>

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
          <option>Quantity High-Low</option>
          <option>Quantity Low-High</option>
        </select>
      </div>

      {/* =====================================================
          INVENTORY CONTENT
      ====================================================== */}

      <div style={contentGrid}>
        <InventoryTable
          inventory={filteredInventory}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <StockStatusCard
          inventory={inventory}
          totalUnits={totalUnits}
        />
      </div>

      {/* =====================================================
          MODALS
      ====================================================== */}

      <AddInventoryModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSaved={loadInventory}
      />

      <EditInventoryModal
        open={openEdit}
        inventory={selectedInventory}
        onClose={handleCloseEdit}
        onSaved={loadInventory}
      />

      <DeleteInventoryDialog
        open={openDelete}
        inventoryId={selectedId}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

/* ==========================================================
   PAGE
========================================================== */

const page: React.CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "4px 0 30px",
  color: "#0f172a",
};

/* ==========================================================
   HEADER
========================================================== */

const pageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
};

const titleSection: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const pageIcon: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #dbeafe, #2563eb)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  boxShadow:
    "0 8px 20px rgba(37, 99, 235, 0.18)",
};

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#0f172a",
};

const pageSubtitle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "15px",
};

const addButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  padding: "14px 22px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "14px",
  boxShadow:
    "0 8px 18px rgba(37, 99, 235, 0.25)",
};

const plusCircle: React.CSSProperties = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,.2)",
  fontSize: "18px",
};

/* ==========================================================
   STATS
========================================================== */

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "28px",
};

const statCard: React.CSSProperties = {
  position: "relative",
  minHeight: "142px",
  background: "#ffffff",
  borderRadius: "14px",
  padding: "20px",
  border: "1px solid #e5eaf2",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.07)",
  overflow: "hidden",
  boxSizing: "border-box",
};

const statLabel: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  fontWeight: 700,
};

const statValue: React.CSSProperties = {
  margin: "8px 0 4px",
  fontSize: "28px",
  fontWeight: 800,
  color: "#0f172a",
};

const moneyValue: React.CSSProperties = {
  margin: "8px 0 4px",
  fontSize: "22px",
  fontWeight: 800,
  color: "#0f172a",
};

const statDescription: React.CSSProperties = {
  margin: 0,
  color: "#94a3b8",
  fontSize: "12px",
};

const blueStatIcon: React.CSSProperties = {
  position: "absolute",
  right: "18px",
  top: "18px",
  width: "48px",
  height: "48px",
  borderRadius: "13px",
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2563eb",
  fontSize: "23px",
};

const greenStatIcon: React.CSSProperties = {
  ...blueStatIcon,
  background: "#ecfdf5",
  color: "#16a34a",
  fontSize: "24px",
};

const orangeStatIcon: React.CSSProperties = {
  ...blueStatIcon,
  background: "#fff7ed",
  color: "#f59e0b",
  fontSize: "26px",
};

const purpleStatIcon: React.CSSProperties = {
  ...blueStatIcon,
  background: "#f5f3ff",
  color: "#7c3aed",
  fontSize: "20px",
  fontWeight: 800,
};

const blueMiniChart: React.CSSProperties = {
  position: "absolute",
  right: "17px",
  bottom: "14px",
  color: "#2563eb",
  fontSize: "22px",
  letterSpacing: "-5px",
  opacity: 0.8,
};

const greenMiniChart: React.CSSProperties = {
  ...blueMiniChart,
  color: "#16a34a",
};

const orangeMiniChart: React.CSSProperties = {
  ...blueMiniChart,
  color: "#f59e0b",
};

const purpleMiniChart: React.CSSProperties = {
  ...blueMiniChart,
  color: "#7c3aed",
};

/* ==========================================================
   TOOLBAR
========================================================== */

const toolbar: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(300px, 1fr) 190px 190px",
  gap: "14px",
  marginBottom: "20px",
};

const searchBox: React.CSSProperties = {
  height: "52px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  boxSizing: "border-box",
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.04)",
};

const searchIcon: React.CSSProperties = {
  color: "#475569",
  fontSize: "27px",
  marginRight: "9px",
  lineHeight: 1,
};

const searchInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#334155",
  fontSize: "14px",
};

const select: React.CSSProperties = {
  height: "52px",
  border: "1px solid #e2e8f0",
  borderRadius: "11px",
  background: "#ffffff",
  padding: "0 14px",
  color: "#334155",
  fontSize: "14px",
  fontWeight: 600,
  outline: "none",
  cursor: "pointer",
  boxShadow:
    "0 4px 12px rgba(15, 23, 42, 0.04)",
};

/* ==========================================================
   CONTENT
========================================================== */

const contentGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) 290px",
  gap: "20px",
  alignItems: "start",
};