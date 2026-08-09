from pydantic import BaseModel, ConfigDict


class CEODashboardBase(BaseModel):
    total_revenue: float = 0.0
    total_cost: float = 0.0
    gross_profit: float = 0.0
    profit_margin: float = 0.0

    inventory_value: float = 0.0
    order_fulfillment_rate: float = 0.0
    supplier_performance: float = 0.0
    operational_efficiency: float = 0.0

    active_risks: int = 0
    critical_risks: int = 0

    overall_status: str = "Healthy"


class CEODashboardCreate(CEODashboardBase):
    pass


class CEODashboardUpdate(BaseModel):
    total_revenue: float | None = None
    total_cost: float | None = None
    gross_profit: float | None = None
    profit_margin: float | None = None

    inventory_value: float | None = None
    order_fulfillment_rate: float | None = None
    supplier_performance: float | None = None
    operational_efficiency: float | None = None

    active_risks: int | None = None
    critical_risks: int | None = None

    overall_status: str | None = None


class CEODashboardResponse(CEODashboardBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
class BusinessKPIBase(BaseModel):
    name: str
    category: str
    value: float
    target: float
    unit: str
    status: str


class BusinessKPICreate(BusinessKPIBase):
    pass


class BusinessKPIUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    value: float | None = None
    target: float | None = None
    unit: str | None = None
    status: str | None = None


class BusinessKPIResponse(BusinessKPIBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
class FinancialOverviewBase(BaseModel):
    metric_name: str
    value: float
    previous_value: float
    unit: str
    period: str


class FinancialOverviewCreate(FinancialOverviewBase):
    pass


class FinancialOverviewUpdate(BaseModel):
    metric_name: str | None = None
    value: float | None = None
    previous_value: float | None = None
    unit: str | None = None
    period: str | None = None


class FinancialOverviewResponse(FinancialOverviewBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
class OperationalPerformanceBase(BaseModel):
    metric_name: str
    value: float
    target: float
    unit: str
    period: str
    status: str


class OperationalPerformanceCreate(OperationalPerformanceBase):
    pass


class OperationalPerformanceUpdate(BaseModel):
    metric_name: str | None = None
    value: float | None = None
    target: float | None = None
    unit: str | None = None
    period: str | None = None
    status: str | None = None


class OperationalPerformanceResponse(OperationalPerformanceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
class RiskMonitoringBase(BaseModel):
    risk_name: str
    category: str
    score: float
    severity: str
    description: str | None = None
    period: str


class RiskMonitoringCreate(RiskMonitoringBase):
    pass


class RiskMonitoringUpdate(BaseModel):
    risk_name: str | None = None
    category: str | None = None
    score: float | None = None
    severity: str | None = None
    description: str | None = None
    period: str | None = None


class RiskMonitoringResponse(RiskMonitoringBase):
    id: int

    model_config = ConfigDict(from_attributes=True)