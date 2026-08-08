import { useEffect, useState } from "react";

import CustomerTable from "../components/customers/CustomerTable";
import AddCustomerModal from "../components/customers/AddCustomerModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import DeleteCustomerDialog from "../components/customers/DeleteCustomerDialog";

import {
  customerService,
  type Customer,
} from "../services/customerService";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCustomer = async (
    data: Omit<Customer, "id">
  ) => {
    try {
      await customerService.createCustomer(data);
      await loadCustomers();
    } catch (error) {
      console.error(error);
      alert("Failed to create customer.");
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: "25px" }}>
        👥 Customers
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        <input
          placeholder="Search customers..."
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
          + Add Customer
        </button>
      </div>

      <CustomerTable
        customers={customers}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          setOpenEdit(true);
        }}
        onDelete={(customer) => {
          setSelectedCustomer(customer);
          setOpenDelete(true);
        }}
      />

      <AddCustomerModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAddCustomer}
      />

      <EditCustomerModal
        open={openEdit}
        customer={selectedCustomer}
        onClose={() => setOpenEdit(false)}
      />

      <DeleteCustomerDialog
        open={openDelete}
        customer={selectedCustomer}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}