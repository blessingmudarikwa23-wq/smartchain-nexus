from pydantic import BaseModel


class KPIResponse(BaseModel):
    products: int
    inventory: int
    suppliers: int
    customers: int


class InventoryAlert(BaseModel):
    product: str
    quantity: int


class AIInsight(BaseModel):
    title: str
    message: str


class PurchaseOrder(BaseModel):
    supplier: str
    reference: str
    status: str


class SalesOrder(BaseModel):
    customer: str
    reference: str
    amount: float


class DashboardSummary(BaseModel):
    kpis: KPIResponse
    inventory_alerts: list[InventoryAlert]
    ai_insights: list[AIInsight]
    purchase_orders: list[PurchaseOrder]
    sales_orders: list[SalesOrder]