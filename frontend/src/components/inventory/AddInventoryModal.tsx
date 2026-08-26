import { useState } from "react";
import { inventoryService } from "../../services/inventoryService";

type InventoryData = {
  sku: string;
  item_name: string;
  category: string;
  warehouse: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  minimum_stock: number;
  maximum_stock: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

const initialForm: InventoryData = {
  sku: "",
  item_name: "",
  category: "",
  warehouse: "",
  quantity: 0,
  unit: "Units",
  unit_cost: 0,
  minimum_stock: 10,
  maximum_stock: 100,
};

export default function AddInventoryModal({
  open,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<InventoryData>(initialForm);
  const [saving, setSaving] = useState(false);

  if (!open) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "sku" ||
        name === "item_name" ||
        name === "category" ||
        name === "warehouse" ||
        name === "unit"
          ? value
          : Number(value),
    }));
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      console.log("Submitting inventory:", form);

      const response = await inventoryService.createInventory(form);

      console.log(
        "Inventory created successfully:",
        response.data
      );

      setForm(initialForm);

      onSaved?.();
      onClose();

      alert("Inventory added successfully!");
    } catch (error: any) {
      console.error("Failed to add inventory:", error);

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      console.error(
        "Request:",
        error?.config?.data
      );

      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Unable to add inventory.";

      alert(
        `Failed to add inventory: ${
          typeof detail === "string"
            ? detail
            : JSON.stringify(detail)
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2>📦 Add Inventory</h2>

        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          style={input}
        />

        <input
          name="item_name"
          placeholder="Item Name"
          value={form.item_name}
          onChange={handleChange}
          style={input}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          style={input}
        />

        <input
          name="warehouse"
          placeholder="Warehouse"
          value={form.warehouse}
          onChange={handleChange}
          style={input}
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          style={input}
        />

        <input
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
          style={input}
        />

        <input
          name="unit_cost"
          type="number"
          placeholder="Unit Cost (R)"
          value={form.unit_cost}
          onChange={handleChange}
          style={input}
        />

        <input
          name="minimum_stock"
          type="number"
          placeholder="Minimum Stock"
          value={form.minimum_stock}
          onChange={handleChange}
          style={input}
        />

        <input
          name="maximum_stock"
          type="number"
          placeholder="Maximum Stock"
          value={form.maximum_stock}
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
            type="button"
            onClick={onClose}
            disabled={saving}
            style={cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={saveButton}
          >
            {saving ? "Saving..." : "Save Inventory"}
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
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};