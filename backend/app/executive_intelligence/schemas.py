from pydantic import BaseModel


class BusinessKPIs(BaseModel):
    revenue: float
    profit: float
    procurement_spend: float
    inventory_value: float


class FinancialOverview(BaseModel):
    revenue: float
    expenses: float
    net_profit: float


class OperationalPerformance(BaseModel):
    warehouse_efficiency: float
    delivery_performance: float
    inventory_accuracy: float


class RiskMonitoring(BaseModel):
    supplier_risk: str
    inventory_risk: str
    logistics_risk: str


class ExecutiveDashboard(BaseModel):
    business_kpis: BusinessKPIs
    financial_overview: FinancialOverview
    operational_performance: OperationalPerformance
    risk_monitoring: RiskMonitoring