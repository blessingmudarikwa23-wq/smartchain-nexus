import { useEffect, useState } from "react";

import SalesOrderTable from "../components/salesOrders/SalesOrderTable";
import AddSalesOrderModal from "../components/salesOrders/AddSalesOrderModal";
import EditSalesOrderModal from "../components/salesOrders/EditSalesOrderModal";
import DeleteSalesOrderDialog from "../components/salesOrders/DeleteSalesOrderDialog";

import {
  salesOrderService,
  type SalesOrder,
} from "../services/salesOrderService";

export default function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<SalesOrder | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await salesOrderService.getSalesOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrder = async (
    data: Omit<SalesOrder, "id">
  ) => {
    try {
      await salesOrderService.createSalesOrder(data);
      await loadOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to create sales order.");
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: "25px" }}>
        🛒 Sales Orders
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        <input
          placeholder="Search sales orders..."
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
          + Add Sales Order
        </button>
      </div>

      <SalesOrderTable
        orders={orders}
        onEdit={(order) => {
          setSelectedOrder(order);
          setOpenEdit(true);
        }}
        onDelete={(order) => {
          setSelectedOrder(order);
          setOpenDelete(true);
        }}
      />

      <AddSalesOrderModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAddOrder}
      />

      <EditSalesOrderModal
        open={openEdit}
        order={selectedOrder}
        onClose={() => setOpenEdit(false)}
      />

      <DeleteSalesOrderDialog
        open={openDelete}
        order={selectedOrder}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}