import { useEffect, useState } from "react";

import SupplierTable from "../components/suppliers/SupplierTable";
import AddSupplierModal from "../components/suppliers/AddSupplierModal";
import EditSupplierModal from "../components/suppliers/EditSupplierModal";
import DeleteSupplierDialog from "../components/suppliers/DeleteSupplierDialog";

import {
  supplierService,
  type Supplier,
} from "../services/supplierService";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSupplier = async (data: any) => {
    try {
      await supplierService.createSupplier(data);
      await loadSuppliers();
    } catch (error) {
      console.error(error);
      alert("Failed to create supplier.");
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: "25px" }}>
        🏢 Suppliers
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        <input
          placeholder="Search suppliers..."
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
            padding: "12px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Supplier
        </button>
      </div>

      <SupplierTable
        suppliers={suppliers}
        onEdit={(supplier) => {
          setSelectedSupplier(supplier);
          setOpenEdit(true);
        }}
        onDelete={(supplier) => {
          setSelectedSupplier(supplier);
          setOpenDelete(true);
        }}
      />

      <AddSupplierModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAddSupplier}
      />

      <EditSupplierModal
        open={openEdit}
        supplier={selectedSupplier}
        onClose={() => setOpenEdit(false)}
      />

      <DeleteSupplierDialog
        open={openDelete}
        supplier={selectedSupplier}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}