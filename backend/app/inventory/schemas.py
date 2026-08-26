from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================================
# INVENTORY ITEM CRUD
# ==========================================================

class InventoryItemCreate(BaseModel):
    sku: str
    barcode: Optional[str] = None
    item_name: str
    category: str
    warehouse: str
    quantity: float = 0.0
    unit: str = "Units"
    unit_cost: float = 0.0
    minimum_stock: float = 0.0
    maximum_stock: float = 0.0


class InventoryItemUpdate(BaseModel):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    item_name: Optional[str] = None
    category: Optional[str] = None
    warehouse: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    unit_cost: Optional[float] = None
    minimum_stock: Optional[float] = None
    maximum_stock: Optional[float] = None
    status: Optional[bool] = None


class InventoryItemResponse(BaseModel):
    id: int
    sku: str
    barcode: Optional[str] = None
    item_name: str
    category: str
    warehouse: str
    quantity: float
    unit: str
    unit_cost: float
    minimum_stock: float
    maximum_stock: float
    status: bool

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# INVENTORY DASHBOARD
# ==========================================================

class InventoryItem(BaseModel):
    id: int
    product: str
    sku: str
    quantity: int
    reorder_point: int
    safety_stock: int
    warehouse: str


class InventoryTransaction(BaseModel):
    reference: str
    product: str
    quantity: int
    transaction_type: str


class InventoryAnalytics(BaseModel):
    total_items: int
    inventory_value: float
    inventory_turnover: float
    abc_classification: str
    xyz_classification: str
    eoq: int


class InventoryDashboard(BaseModel):
    stock: list[InventoryItem]
    transactions: list[InventoryTransaction]
    analytics: InventoryAnalytics


# ==========================================================
# INVENTORY ADJUSTMENTS
# ==========================================================

class InventoryAdjustmentCreate(BaseModel):
    inventory_item_id: int
    adjustment_type: str
    quantity: float
    reason: Optional[str] = None
    adjusted_by: str


class InventoryAdjustmentUpdate(BaseModel):
    adjustment_type: Optional[str] = None
    quantity: Optional[float] = None
    reason: Optional[str] = None
    adjusted_by: Optional[str] = None


class InventoryAdjustmentResponse(BaseModel):
    id: int

    inventory_item_id: int

    # Product information
    item_name: str
    sku: str
    category: str
    warehouse: str

    # Adjustment information
    adjustment_type: str
    quantity: float

    # Stock movement
    previous_quantity: float
    new_quantity: float
    current_quantity: float

    # Adjustment details
    reason: Optional[str] = None
    adjusted_by: str

    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# ABC ANALYSIS
# ==========================================================

class ABCAnalysisCreate(BaseModel):
    sku: str
    item_name: str
    annual_consumption: float = 0.0
    annual_value: float = 0.0
    percentage_of_total: float = 0.0
    cumulative_percentage: float = 0.0
    classification: str = "C"


class ABCAnalysisUpdate(BaseModel):
    sku: Optional[str] = None
    item_name: Optional[str] = None
    annual_consumption: Optional[float] = None
    annual_value: Optional[float] = None
    percentage_of_total: Optional[float] = None
    cumulative_percentage: Optional[float] = None
    classification: Optional[str] = None


class ABCAnalysisResponse(BaseModel):
    id: int
    sku: str
    item_name: str
    annual_consumption: float
    annual_value: float
    percentage_of_total: float
    cumulative_percentage: float
    classification: str

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# XYZ ANALYSIS
# ==========================================================

class XYZAnalysisCreate(BaseModel):
    sku: str
    item_name: str
    average_demand: float = 0.0
    demand_variability: float = 0.0
    coefficient_of_variation: float = 0.0
    classification: str = "Z"


class XYZAnalysisUpdate(BaseModel):
    sku: Optional[str] = None
    item_name: Optional[str] = None
    average_demand: Optional[float] = None
    demand_variability: Optional[float] = None
    coefficient_of_variation: Optional[float] = None
    classification: Optional[str] = None


class XYZAnalysisResponse(BaseModel):
    id: int
    sku: str
    item_name: str
    average_demand: float
    demand_variability: float
    coefficient_of_variation: float
    classification: str

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# EOQ ANALYSIS
# ==========================================================

class EOQAnalysisCreate(BaseModel):
    sku: str
    item_name: str
    annual_demand: float = 0.0
    ordering_cost: float = 0.0
    holding_cost: float = 0.0


class EOQAnalysisUpdate(BaseModel):
    sku: Optional[str] = None
    item_name: Optional[str] = None
    annual_demand: Optional[float] = None
    ordering_cost: Optional[float] = None
    holding_cost: Optional[float] = None


class EOQAnalysisResponse(BaseModel):
    id: int
    sku: str
    item_name: str
    annual_demand: float
    ordering_cost: float
    holding_cost: float
    economic_order_quantity: float

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# SAFETY STOCK
# ==========================================================

class SafetyStockCreate(BaseModel):
    sku: str
    item_name: str
    average_daily_demand: float
    lead_time_days: float
    demand_std_dev: float
    service_level: float = 95.0


class SafetyStockUpdate(BaseModel):
    sku: Optional[str] = None
    item_name: Optional[str] = None
    average_daily_demand: Optional[float] = None
    lead_time_days: Optional[float] = None
    demand_std_dev: Optional[float] = None
    service_level: Optional[float] = None


class SafetyStockResponse(BaseModel):
    id: int
    sku: str
    item_name: str
    average_daily_demand: float
    lead_time_days: float
    demand_std_dev: float
    service_level: float
    safety_stock: float

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# REORDER POINT
# ==========================================================

class ReorderPointCreate(BaseModel):
    sku: str
    item_name: str
    average_daily_usage: float
    lead_time_days: float
    safety_stock: float


class ReorderPointUpdate(BaseModel):
    sku: Optional[str] = None
    item_name: Optional[str] = None
    average_daily_usage: Optional[float] = None
    lead_time_days: Optional[float] = None
    safety_stock: Optional[float] = None


class ReorderPointResponse(BaseModel):
    id: int
    sku: str
    item_name: str
    average_daily_usage: float
    lead_time_days: float
    safety_stock: float
    reorder_point: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# INVENTORY TURNOVER
# ==========================================================

class InventoryTurnoverCreate(BaseModel):
    sku: str
    item_name: str
    beginning_inventory: float
    ending_inventory: float
    cost_of_goods_sold: float


class InventoryTurnoverUpdate(BaseModel):
    sku: Optional[str] = None
    item_name: Optional[str] = None
    beginning_inventory: Optional[float] = None
    ending_inventory: Optional[float] = None
    cost_of_goods_sold: Optional[float] = None


class InventoryTurnoverResponse(BaseModel):
    id: int
    sku: str
    item_name: str
    beginning_inventory: float
    ending_inventory: float
    average_inventory: float
    cost_of_goods_sold: float
    inventory_turnover_ratio: float
    days_in_inventory: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# INVENTORY TRANSACTION
# ==========================================================

class InventoryTransactionCreate(BaseModel):
    transaction_id: str
    inventory_item_id: int
    transaction_type: str
    quantity: float
    reference: Optional[str] = None
    notes: Optional[str] = None
    transaction_date: Optional[datetime] = None


class InventoryTransactionUpdate(BaseModel):
    transaction_type: Optional[str] = None
    quantity: Optional[float] = None
    reference: Optional[str] = None
    notes: Optional[str] = None
    transaction_date: Optional[datetime] = None


class InventoryTransactionResponse(BaseModel):
    id: int
    transaction_id: str
    inventory_item_id: int
    transaction_type: str
    quantity: float
    reference: Optional[str] = None
    notes: Optional[str] = None
    transaction_date: datetime
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)