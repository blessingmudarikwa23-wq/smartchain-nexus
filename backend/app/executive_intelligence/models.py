from sqlalchemy import Column, Float, Integer, String
from app.database.base import Base


class CEODashboard(Base):
    __tablename__ = "ceo_dashboard"

    id = Column(Integer, primary_key=True, index=True)

    total_revenue = Column(Float, nullable=False, default=0.0)
    total_cost = Column(Float, nullable=False, default=0.0)
    gross_profit = Column(Float, nullable=False, default=0.0)
    profit_margin = Column(Float, nullable=False, default=0.0)

    inventory_value = Column(Float, nullable=False, default=0.0)
    order_fulfillment_rate = Column(Float, nullable=False, default=0.0)
    supplier_performance = Column(Float, nullable=False, default=0.0)
    operational_efficiency = Column(Float, nullable=False, default=0.0)

    active_risks = Column(Integer, nullable=False, default=0)
    critical_risks = Column(Integer, nullable=False, default=0)

    overall_status = Column(String(50), nullable=False, default="Healthy")
from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class BusinessKPI(Base):
    __tablename__ = "business_kpis"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    category = Column(String, nullable=False)

    value = Column(Float, nullable=False)
    target = Column(Float, nullable=False)

    unit = Column(String, nullable=False)
    status = Column(String, nullable=False)
class FinancialOverview(Base):
    __tablename__ = "financial_overview"

    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    previous_value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    period = Column(String(50), nullable=False)
class OperationalPerformance(Base):
    __tablename__ = "operational_performance"

    id = Column(Integer, primary_key=True, index=True)

    metric_name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    target = Column(Float, nullable=False)

    unit = Column(String(20), nullable=False)
    period = Column(String(50), nullable=False)

    status = Column(String(50), nullable=False)
class RiskMonitoring(Base):
    __tablename__ = "risk_monitoring"

    id = Column(Integer, primary_key=True, index=True)

    risk_name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)

    score = Column(Float, nullable=False)

    severity = Column(String(50), nullable=False)

    description = Column(String(500), nullable=True)

    period = Column(String(50), nullable=False)