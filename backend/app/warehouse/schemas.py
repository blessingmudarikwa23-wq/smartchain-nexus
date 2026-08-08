from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


# ==========================================================
# WAREHOUSE RECEIVING
# ==========================================================

class WarehouseReceivingCreate(BaseModel):
    receiving_number: str
    supplier_name: str
    purchase_order: str
    warehouse: str
    received_by: str
    received_date: date
    total_items: int = 0
    total_quantity: float = 0.0
    remarks: Optional[str] = None


class WarehouseReceivingUpdate(BaseModel):
    supplier_name: Optional[str] = None
    purchase_order: Optional[str] = None
    warehouse: Optional[str] = None
    received_by: Optional[str] = None
    received_date: Optional[date] = None
    total_items: Optional[int] = None
    total_quantity: Optional[float] = None
    status: Optional[str] = None
    remarks: Optional[str] = None


class WarehouseReceivingResponse(BaseModel):
    id: int
    receiving_number: str
    supplier_name: str
    purchase_order: str
    warehouse: str
    received_by: str
    received_date: date
    total_items: int
    total_quantity: float
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True


# ==========================================================
# WAREHOUSE PICKING
# ==========================================================

class WarehousePickingCreate(BaseModel):
    picking_number: str
    order_number: str
    picker: str
    warehouse: str
    total_items: int = 0
    picked_quantity: float = 0.0
    remarks: Optional[str] = None


class WarehousePickingUpdate(BaseModel):
    order_number: Optional[str] = None
    picker: Optional[str] = None
    warehouse: Optional[str] = None
    total_items: Optional[int] = None
    picked_quantity: Optional[float] = None
    status: Optional[str] = None
    remarks: Optional[str] = None


class WarehousePickingResponse(BaseModel):
    id: int
    picking_number: str
    order_number: str
    picker: str
    warehouse: str
    total_items: int
    picked_quantity: float
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True


# ==========================================================
# WAREHOUSE PACKING
# ==========================================================

class WarehousePackingCreate(BaseModel):
    packing_number: str
    order_number: str
    packer: str
    warehouse: str
    total_items: int = 0
    packed_quantity: float = 0.0
    package_type: str
    remarks: Optional[str] = None


class WarehousePackingUpdate(BaseModel):
    order_number: Optional[str] = None
    packer: Optional[str] = None
    warehouse: Optional[str] = None
    total_items: Optional[int] = None
    packed_quantity: Optional[float] = None
    package_type: Optional[str] = None
    status: Optional[str] = None
    remarks: Optional[str] = None


class WarehousePackingResponse(BaseModel):
    id: int
    packing_number: str
    order_number: str
    packer: str
    warehouse: str
    total_items: int
    packed_quantity: float
    package_type: str
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True


# ==========================================================
# WAREHOUSE DISPATCH
# ==========================================================

class WarehouseDispatchCreate(BaseModel):
    dispatch_number: str
    order_number: str
    customer_name: str
    warehouse: str
    total_items: int = 0
    dispatched_quantity: float = 0.0
    courier: str
    tracking_number: Optional[str] = None
    remarks: Optional[str] = None


class WarehouseDispatchUpdate(BaseModel):
    order_number: Optional[str] = None
    customer_name: Optional[str] = None
    warehouse: Optional[str] = None
    total_items: Optional[int] = None
    dispatched_quantity: Optional[float] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None
    status: Optional[str] = None
    remarks: Optional[str] = None


class WarehouseDispatchResponse(BaseModel):
    id: int
    dispatch_number: str
    order_number: str
    customer_name: str
    warehouse: str
    dispatch_date: datetime
    total_items: int
    dispatched_quantity: float
    courier: str
    tracking_number: Optional[str]
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True
# ==========================================================
# WAREHOUSE CYCLE COUNT SCHEMAS
# ==========================================================

class WarehouseCycleCountCreate(BaseModel):
    count_number: str
    warehouse: str
    item_name: str
    sku: str
    system_quantity: float = 0.0
    counted_quantity: float = 0.0
    counted_by: str
    remarks: Optional[str] = None


class WarehouseCycleCountUpdate(BaseModel):
    warehouse: Optional[str] = None
    item_name: Optional[str] = None
    sku: Optional[str] = None
    system_quantity: Optional[float] = None
    counted_quantity: Optional[float] = None
    variance: Optional[float] = None
    counted_by: Optional[str] = None
    status: Optional[str] = None
    remarks: Optional[str] = None


class WarehouseCycleCountResponse(BaseModel):
    id: int
    count_number: str
    warehouse: str
    item_name: str
    sku: str
    system_quantity: float
    counted_quantity: float
    variance: float
    counted_by: str
    count_date: datetime
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True
# ==========================================================
# WAREHOUSE PERFORMANCE SCHEMAS
# ==========================================================

class WarehousePerformanceCreate(BaseModel):
    warehouse: str
    receiving_orders: int = 0
    dispatched_orders: int = 0
    inventory_accuracy: float = 100.0
    picking_accuracy: float = 100.0
    packing_accuracy: float = 100.0
    utilization: float = 0.0
    remarks: Optional[str] = None


class WarehousePerformanceUpdate(BaseModel):
    warehouse: Optional[str] = None
    receiving_orders: Optional[int] = None
    dispatched_orders: Optional[int] = None
    inventory_accuracy: Optional[float] = None
    picking_accuracy: Optional[float] = None
    packing_accuracy: Optional[float] = None
    utilization: Optional[float] = None
    remarks: Optional[str] = None


class WarehousePerformanceResponse(BaseModel):
    id: int
    warehouse: str
    reporting_date: datetime
    receiving_orders: int
    dispatched_orders: int
    inventory_accuracy: float
    picking_accuracy: float
    packing_accuracy: float
    utilization: float
    remarks: Optional[str]

    class Config:
        from_attributes = True