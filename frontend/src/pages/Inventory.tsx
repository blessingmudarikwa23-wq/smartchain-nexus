import { useEffect, useState } from "react";

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

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const data = await inventoryService.getInventory();
      setInventory(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>📦 Inventory</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search inventory..."
          style={{
            width: "320px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          onClick={() => setOpenAdd(true)}
          style={{
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Inventory
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <InventoryTable
          inventory={inventory}
          onEdit={(item) => {
            setSelectedInventory(item);
            setOpenEdit(true);
          }}
          onDelete={(id) => {
            setSelectedId(id);
            setOpenDelete(true);
          }}
        />

        <StockStatusCard />
      </div>

      <AddInventoryModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSaved={loadInventory}
      />

      <EditInventoryModal
        open={openEdit}
        inventory={selectedInventory}
        onClose={() => {
          setOpenEdit(false);
          setSelectedInventory(null);
        }}
        onSaved={loadInventory}
      />

      <DeleteInventoryDialog
        open={openDelete}
        inventoryId={selectedId}
        onClose={() => {
          setOpenDelete(false);
          setSelectedId(null);
        }}
        onConfirm={loadInventory}
      />
    </>
  );
}