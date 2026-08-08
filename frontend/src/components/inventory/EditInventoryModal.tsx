import { useEffect, useState } from "react";
import { inventoryService } from "../../services/inventoryService";

type InventoryData = {
  id: number;
  product_id: number;
  warehouse: string;
  quantity_in_stock: number;
  minimum_stock: number;
  reorder_level: number;
};

type Props = {
  open: boolean;
  inventory?: InventoryData | null;
  onClose: () => void;
  onSaved?: () => void;
};

export default function EditInventoryModal({
  open,
  inventory,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<InventoryData>({
    id: 0,
    product_id: 0,
    warehouse: "",
    quantity_in_stock: 0,
    minimum_stock: 10,
    reorder_level: 20,
  });

  useEffect(() => {
    if (inventory) {
      setForm(inventory);
    }
  }, [inventory]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "warehouse"
          ? value
          : Number(value),
    }));
  };

  async function handleUpdate() {
    try {
      await inventoryService.updateInventory(form.id, {
        product_id: form.product_id,
        warehouse: form.warehouse,
        quantity_in_stock: form.quantity_in_stock,
        minimum_stock: form.minimum_stock,
        reorder_level: form.reorder_level,
      });

      onSaved?.();
      onClose();

      alert("Inventory updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update inventory.");
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "520px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h2>✏ Edit Inventory</h2>

        <input
          name="product_id"
          type="number"
          value={form.product_id}
          onChange={handleChange}
          style={input}
        />

        <input
          name="warehouse"
          value={form.warehouse}
          onChange={handleChange}
          style={input}
        />

        <input
          name="quantity_in_stock"
          type="number"
          value={form.quantity_in_stock}
          onChange={handleChange}
          style={input}
        />

        <input
          name="minimum_stock"
          type="number"
          value={form.minimum_stock}
          onChange={handleChange}
          style={input}
        />

        <input
          name="reorder_level"
          type="number"
          value={form.reorder_level}
          onChange={handleChange}
          style={input}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onClose}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            style={saveButton}
          >
            Update Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
};

const cancelButton: React.CSSProperties = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const saveButton: React.CSSProperties = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};