from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# WAREHOUSE RECEIVING
# ==========================================================

class WarehouseReceiving(Base):
    __tablename__ = "warehouse_receiving"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    receiving_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    supplier_name = Column(
        String(255),
        nullable=False,
    )

    purchase_order = Column(
        String(100),
        nullable=False,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    received_by = Column(
        String(255),
        nullable=False,
    )

    received_date = Column(
        Date,
        nullable=False,
    )

    total_items = Column(
        Integer,
        default=0,
    )

    total_quantity = Column(
        Float,
        default=0.0,
    )

    status = Column(
        String(100),
        default="Received",
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
# ==========================================================
# WAREHOUSE PICKING
# ==========================================================

class WarehousePicking(Base):
    __tablename__ = "warehouse_picking"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    picking_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    order_number = Column(
        String(100),
        nullable=False,
    )

    picker = Column(
        String(255),
        nullable=False,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    total_items = Column(
        Integer,
        default=0,
    )

    picked_quantity = Column(
        Float,
        default=0.0,
    )

    status = Column(
        String(100),
        default="Pending",
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
# ==========================================================
# WAREHOUSE PACKING
# ==========================================================

class WarehousePacking(Base):
    __tablename__ = "warehouse_packing"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    packing_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    order_number = Column(
        String(100),
        nullable=False,
    )

    packer = Column(
        String(255),
        nullable=False,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    total_items = Column(
        Integer,
        default=0,
    )

    packed_quantity = Column(
        Float,
        default=0.0,
    )

    package_type = Column(
        String(100),
        nullable=False,
    )

    status = Column(
        String(100),
        default="Packed",
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
# ==========================================================
# WAREHOUSE DISPATCH
# ==========================================================

class WarehouseDispatch(Base):
    __tablename__ = "warehouse_dispatch"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    dispatch_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    order_number = Column(
        String(100),
        nullable=False,
    )

    customer_name = Column(
        String(255),
        nullable=False,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    dispatch_date = Column(
        DateTime,
        server_default=func.now(),
    )

    total_items = Column(
        Integer,
        default=0,
    )

    dispatched_quantity = Column(
        Float,
        default=0.0,
    )

    courier = Column(
        String(255),
        nullable=False,
    )

    tracking_number = Column(
        String(255),
        nullable=True,
    )

    status = Column(
        String(100),
        default="Dispatched",
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
# ==========================================================
# WAREHOUSE CYCLE COUNT
# ==========================================================

class WarehouseCycleCount(Base):
    __tablename__ = "warehouse_cycle_counts"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    count_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    sku = Column(
        String(100),
        nullable=False,
    )

    system_quantity = Column(
        Float,
        default=0.0,
    )

    counted_quantity = Column(
        Float,
        default=0.0,
    )

    variance = Column(
        Float,
        default=0.0,
    )

    counted_by = Column(
        String(255),
        nullable=False,
    )

    count_date = Column(
        DateTime,
        server_default=func.now(),
    )

    status = Column(
        String(100),
        default="Pending",
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
# ==========================================================
# WAREHOUSE PERFORMANCE
# ==========================================================

class WarehousePerformance(Base):
    __tablename__ = "warehouse_performance"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    reporting_date = Column(
        DateTime,
        server_default=func.now(),
    )

    receiving_orders = Column(
        Integer,
        default=0,
    )

    dispatched_orders = Column(
        Integer,
        default=0,
    )

    inventory_accuracy = Column(
        Float,
        default=100.0,
    )

    picking_accuracy = Column(
        Float,
        default=100.0,
    )

    packing_accuracy = Column(
        Float,
        default=100.0,
    )

    utilization = Column(
        Float,
        default=0.0,
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )