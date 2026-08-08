from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================================
# BUSINESS INTELLIGENCE
# ==========================================================


# ==========================================================
# POWER BI DASHBOARD BASE
# ==========================================================

class PowerBIDashboardBase(BaseModel):
    dashboard_name: str
    description: Optional[str] = None
    dashboard_type: str = "Operational"
    workspace: str = "SmartChain Nexus"
    report_url: Optional[str] = None
    refresh_frequency: str = "Daily"
    status: str = "Active"


# ==========================================================
# POWER BI DASHBOARD CREATE
# ==========================================================

class PowerBIDashboardCreate(
    PowerBIDashboardBase
):
    pass


# ==========================================================
# POWER BI DASHBOARD UPDATE
# ==========================================================

class PowerBIDashboardUpdate(BaseModel):
    dashboard_name: Optional[str] = None
    description: Optional[str] = None
    dashboard_type: Optional[str] = None
    workspace: Optional[str] = None
    report_url: Optional[str] = None
    refresh_frequency: Optional[str] = None
    status: Optional[str] = None


# ==========================================================
# POWER BI DASHBOARD RESPONSE
# ==========================================================

class PowerBIDashboardResponse(
    PowerBIDashboardBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# EXECUTIVE REPORTING BASE
# ==========================================================

class ExecutiveReportingBase(BaseModel):
    report_name: str
    reporting_period: str
    executive_summary: Optional[str] = None

    total_revenue: float = 0.0
    total_cost: float = 0.0
    total_profit: float = 0.0
    profit_margin: float = 0.0

    inventory_value: float = 0.0
    supplier_performance: float = 0.0
    delivery_performance: float = 0.0
    overall_performance: float = 0.0

    status: str = "Published"


# ==========================================================
# EXECUTIVE REPORTING CREATE
# ==========================================================

class ExecutiveReportingCreate(
    ExecutiveReportingBase
):
    pass


# ==========================================================
# EXECUTIVE REPORTING UPDATE
# ==========================================================

class ExecutiveReportingUpdate(BaseModel):
    report_name: Optional[str] = None
    reporting_period: Optional[str] = None
    executive_summary: Optional[str] = None

    total_revenue: Optional[float] = None
    total_cost: Optional[float] = None
    total_profit: Optional[float] = None
    profit_margin: Optional[float] = None

    inventory_value: Optional[float] = None
    supplier_performance: Optional[float] = None
    delivery_performance: Optional[float] = None
    overall_performance: Optional[float] = None

    status: Optional[str] = None


# ==========================================================
# EXECUTIVE REPORTING RESPONSE
# ==========================================================

class ExecutiveReportingResponse(
    ExecutiveReportingBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
# ==========================================================
# OPERATIONAL ANALYTICS
# ==========================================================

class OperationalAnalyticsBase(BaseModel):
    metric_name: str
    metric_category: str
    reporting_period: str

    metric_value: float = 0.0
    target_value: float = 0.0
    variance: float = 0.0
    performance_percentage: float = 0.0

    status: str = "On Target"


# ==========================================================
# OPERATIONAL ANALYTICS CREATE
# ==========================================================

class OperationalAnalyticsCreate(
    OperationalAnalyticsBase
):
    pass


# ==========================================================
# OPERATIONAL ANALYTICS UPDATE
# ==========================================================

class OperationalAnalyticsUpdate(BaseModel):
    metric_name: Optional[str] = None
    metric_category: Optional[str] = None
    reporting_period: Optional[str] = None

    metric_value: Optional[float] = None
    target_value: Optional[float] = None
    variance: Optional[float] = None
    performance_percentage: Optional[float] = None

    status: Optional[str] = None


# ==========================================================
# OPERATIONAL ANALYTICS RESPONSE
# ==========================================================

class OperationalAnalyticsResponse(
    OperationalAnalyticsBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
# ==========================================================
# INTERACTIVE KPI MONITORING
# ==========================================================

class InteractiveKPIMonitoringBase(BaseModel):
    metric_name: str
    metric_category: str
    reporting_period: str

    metric_value: float = 0.0
    target_value: float = 0.0
    variance: float = 0.0
    performance_percentage: float = 0.0

    status: str = "On Target"


# ==========================================================
# INTERACTIVE KPI MONITORING CREATE
# ==========================================================

class InteractiveKPIMonitoringCreate(
    InteractiveKPIMonitoringBase
):
    pass


# ==========================================================
# INTERACTIVE KPI MONITORING UPDATE
# ==========================================================

class InteractiveKPIMonitoringUpdate(BaseModel):
    metric_name: Optional[str] = None
    metric_category: Optional[str] = None
    reporting_period: Optional[str] = None

    metric_value: Optional[float] = None
    target_value: Optional[float] = None
    variance: Optional[float] = None
    performance_percentage: Optional[float] = None

    status: Optional[str] = None


# ==========================================================
# INTERACTIVE KPI MONITORING RESPONSE
# ==========================================================

class InteractiveKPIMonitoringResponse(
    InteractiveKPIMonitoringBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )