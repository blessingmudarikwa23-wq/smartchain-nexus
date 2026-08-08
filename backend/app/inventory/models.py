from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
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

    product = Column(
        String(255),
        nullable=False,
    )

    sku = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    quantity = Column(
        Integer,
        default=0,
    )

    reorder_point = Column(
        Integer,
        default=0,
    )

    safety_stock = Column(
        Integer,
        default=0,
    )

    warehouse = Column(
        String(255),
        nullable=False,
    )

    unit_cost = Column(
        Float,
        default=0.0,
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

    adjustments = relationship(
        "InventoryAdjustment",
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
        nullable=False,
        unique=True,
        index=True,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    annual_consumption = Column(
        Float,
        default=0.0,
    )

    annual_value = Column(
        Float,
        default=0.0,
    )

    percentage_of_total = Column(
        Float,
        default=0.0,
    )

    cumulative_percentage = Column(
        Float,
        default=0.0,
    )

    classification = Column(
        String(5),
        default="C",
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
        nullable=False,
        index=True,
    )

    item_name = Column(
        String(255),
        nullable=False,
    )

    average_demand = Column(
        Float,
        default=0.0,
    )

    demand_variability = Column(
        Float,
        default=0.0,
    )
    
    coefficient_of_variation = Column(
        Float,
        default=0.0,
    )

    classification = Column(
        String(5),
        default="Z",
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
class EOQAnalysis(Base):
    __tablename__ = "eoq_analysis"

    id = Column(Integer, primary_key=True, index=True)

    sku = Column(String(100), nullable=False)
    item_name = Column(String(255), nullable=False)

    annual_demand = Column(Float, default=0.0)
    ordering_cost = Column(Float, default=0.0)
    holding_cost = Column(Float, default=0.0)

    economic_order_quantity = Column(Float, default=0.0)

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
# SAFETY STOCK
# ==========================================================

class SafetyStockAnalysis(Base):
    __tablename__ = "safety_stock_analysis"

    id = Column(Integer, primary_key=True, index=True)

    sku = Column(String(100), nullable=False)
    item_name = Column(String(255), nullable=False)

    average_daily_demand = Column(Float, default=0.0)
    lead_time_days = Column(Float, default=0.0)
    demand_std_dev = Column(Float, default=0.0)
    service_level = Column(Float, default=95.0)

    safety_stock = Column(Float, default=0.0)

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
# REORDER POINT
# ==========================================================

class ReorderPoint(Base):
    __tablename__ = "reorder_points"

    id = Column(Integer, primary_key=True, index=True)

    sku = Column(String(100), nullable=False, unique=True, index=True)

    item_name = Column(String(255), nullable=False)

    average_daily_usage = Column(Float, default=0.0)

    lead_time_days = Column(Float, default=0.0)

    safety_stock = Column(Float, default=0.0)

    reorder_point = Column(Float, default=0.0)

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
# INVENTORY TURNOVER ANALYSIS
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
    )

    ending_inventory = Column(
        Float,
        default=0.0,
    )

    average_inventory = Column(
        Float,
        default=0.0,
    )

    cost_of_goods_sold = Column(
        Float,
        default=0.0,
    )

    inventory_turnover_ratio = Column(
        Float,
        default=0.0,
    )

    days_in_inventory = Column(
        Float,
        default=0.0,
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