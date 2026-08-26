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


class InventoryChartData(BaseModel):
    month: str
    inventory: int


class SalesChartData(BaseModel):
    month: str
    sales: int
    purchase: int


class DashboardSummary(BaseModel):
    kpis: KPIResponse
    inventory_alerts: list[InventoryAlert]
    ai_insights: list[AIInsight]
    purchase_orders: list[PurchaseOrder]
    sales_orders: list[SalesOrder]
    inventory_chart: list[InventoryChartData]
    sales_chart: list[SalesChartData]