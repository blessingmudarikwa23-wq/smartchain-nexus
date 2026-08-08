from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)

from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# BUSINESS INTELLIGENCE
# ==========================================================


# ==========================================================
# POWER BI DASHBOARDS
# ==========================================================

class PowerBIDashboard(Base):
    __tablename__ = "power_bi_dashboards"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    dashboard_name = Column(
        String(255),
        nullable=False,
        index=True,
    )

    description = Column(
        String(500),
        nullable=True,
    )

    dashboard_type = Column(
        String(100),
        nullable=False,
        default="Operational",
    )

    workspace = Column(
        String(255),
        nullable=False,
        default="SmartChain Nexus",
    )

    report_url = Column(
        String(500),
        nullable=True,
    )

    refresh_frequency = Column(
        String(100),
        nullable=False,
        default="Daily",
    )

    status = Column(
        String(50),
        nullable=False,
        default="Active",
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
# EXECUTIVE REPORTING
# ==========================================================

class ExecutiveReporting(Base):
    __tablename__ = "executive_reporting"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    report_name = Column(
        String(255),
        nullable=False,
        index=True,
    )

    reporting_period = Column(
        String(100),
        nullable=False,
        index=True,
    )

    executive_summary = Column(
        String(1000),
        nullable=True,
    )

    total_revenue = Column(
        Float,
        default=0.0,
    )

    total_cost = Column(
        Float,
        default=0.0,
    )

    total_profit = Column(
        Float,
        default=0.0,
    )

    profit_margin = Column(
        Float,
        default=0.0,
    )

    inventory_value = Column(
        Float,
        default=0.0,
    )

    supplier_performance = Column(
        Float,
        default=0.0,
    )

    delivery_performance = Column(
        Float,
        default=0.0,
    )

    overall_performance = Column(
        Float,
        default=0.0,
    )

    status = Column(
        String(50),
        nullable=False,
        default="Published",
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
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)

from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# BUSINESS INTELLIGENCE
# ==========================================================


# ==========================================================
# OPERATIONAL ANALYTICS
# ==========================================================

class OperationalAnalytics(Base):
    __tablename__ = "operational_analytics"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    metric_name = Column(
        String(255),
        nullable=False,
        index=True,
    )

    metric_category = Column(
        String(100),
        nullable=False,
        index=True,
    )

    reporting_period = Column(
        String(100),
        nullable=False,
        index=True,
    )

    metric_value = Column(
        Float,
        default=0.0,
    )

    target_value = Column(
        Float,
        default=0.0,
    )

    variance = Column(
        Float,
        default=0.0,
    )

    performance_percentage = Column(
        Float,
        default=0.0,
    )

    status = Column(
        String(50),
        nullable=False,
        default="On Target",
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
# INTERACTIVE KPI MONITORING
# ==========================================================

class InteractiveKPIMonitoring(Base):
    __tablename__ = "interactive_kpi_monitoring"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    metric_name = Column(
        String(255),
        nullable=False,
        index=True,
    )

    metric_category = Column(
        String(100),
        nullable=False,
        index=True,
    )

    reporting_period = Column(
        String(100),
        nullable=False,
        index=True,
    )

    metric_value = Column(
        Float,
        default=0.0,
    )

    target_value = Column(
        Float,
        default=0.0,
    )

    variance = Column(
        Float,
        default=0.0,
    )

    performance_percentage = Column(
        Float,
        default=0.0,
    )

    status = Column(
        String(50),
        nullable=False,
        default="On Target",
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