from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# INVENTORY ITEM
# ==========================================================

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    barcode = Column(
        String(100),
        unique=True,
        index=True,
        nullable=True,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    category = Column(
        String(255),
        nullable=False,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    quantity = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    unit = Column(
        String(100),
        default="Units",
        nullable=False,
    )

    unit_cost = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    minimum_stock = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    maximum_stock = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    status = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    adjustments = relationship(
        "InventoryAdjustment",
        back_populates="inventory_item",
        cascade="all, delete-orphan",
    )

    transactions = relationship(
        "InventoryTransaction",
        back_populates="inventory_item",
        cascade="all, delete-orphan",
    )


# ==========================================================
# INVENTORY ADJUSTMENT
# ==========================================================

class InventoryAdjustment(Base):
    __tablename__ = "inventory_adjustments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    inventory_item_id = Column(
        Integer,
        ForeignKey("inventory_items.id"),
        nullable=False,
        index=True,
    )

    adjustment_type = Column(
        String(100),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    reason = Column(
        String(255),
        nullable=True,
    )

    adjusted_by = Column(
        String(255),
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    inventory_item = relationship(
        "InventoryItem",
        back_populates="adjustments",
    )


# ==========================================================
# ABC ANALYSIS
# ==========================================================

class ABCAnalysis(Base):
    __tablename__ = "abc_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    annual_consumption = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    annual_value = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    percentage_of_total = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    cumulative_percentage = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    classification = Column(
        String(5),
        default="C",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ==========================================================
# XYZ ANALYSIS
# ==========================================================

class XYZAnalysis(Base):
    __tablename__ = "xyz_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    average_demand = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    demand_variability = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    coefficient_of_variation = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    classification = Column(
        String(5),
        default="Z",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ==========================================================
# EOQ ANALYSIS
# ==========================================================

class EOQAnalysis(Base):
    __tablename__ = "eoq_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        nullable=False,
        index=True,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    annual_demand = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    ordering_cost = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    holding_cost = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    economic_order_quantity = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ==========================================================
# SAFETY STOCK
# ==========================================================

class SafetyStockAnalysis(Base):
    __tablename__ = "safety_stock_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        nullable=False,
        index=True,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    average_daily_demand = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    lead_time_days = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    demand_std_dev = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    service_level = Column(
        Float,
        default=95.0,
        nullable=False,
    )

    safety_stock = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ==========================================================
# REORDER POINT
# ==========================================================

class ReorderPoint(Base):
    __tablename__ = "reorder_points"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    average_daily_usage = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    lead_time_days = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    safety_stock = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    reorder_point = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ==========================================================
# INVENTORY TURNOVER
# ==========================================================

class InventoryTurnover(Base):
    __tablename__ = "inventory_turnover"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sku = Column(
        String(100),
        nullable=False,
        index=True,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    beginning_inventory = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    ending_inventory = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    average_inventory = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    cost_of_goods_sold = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    inventory_turnover_ratio = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    days_in_inventory = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ==========================================================
# INVENTORY TRANSACTION
# ==========================================================

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    transaction_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    inventory_item_id = Column(
        Integer,
        ForeignKey("inventory_items.id"),
        nullable=False,
        index=True,
    )

    transaction_type = Column(
        String(100),
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    reference = Column(
        String(255),
        nullable=True,
    )

    notes = Column(
        String(500),
        nullable=True,
    )

    transaction_date = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    inventory_item = relationship(
        "InventoryItem",
        back_populates="transactions",
    )