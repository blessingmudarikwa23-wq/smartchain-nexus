from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# CUSTOMER MANAGEMENT
# ==========================================================

class Customer(Base):
    __tablename__ = "customers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer_code = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    customer_name = Column(
        String(255),
        nullable=False,
    )

    email = Column(
        String(255),
        nullable=True,
    )

    phone = Column(
        String(50),
        nullable=True,
    )

    address = Column(
        String(500),
        nullable=True,
    )

    customer_type = Column(
        String(100),
        nullable=False,
        default="Retail",
    )

    total_orders = Column(
        Integer,
        nullable=False,
        default=0,
    )

    total_spend = Column(
        Float,
        nullable=False,
        default=0.0,
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
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# SALES ORDER
# ==========================================================

class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    order_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    customer_code = Column(
        String(100),
        nullable=False,
        index=True,
    )

    product = Column(
        String(255),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=1,
    )

    unit_price = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    total_amount = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    order_status = Column(
        String(50),
        nullable=False,
        default="Pending",
    )

    payment_status = Column(
        String(50),
        nullable=False,
        default="Pending",
    )

    order_date = Column(
        DateTime,
        server_default=func.now(),
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
# REVENUE ANALYSIS
# ==========================================================

class RevenueAnalysis(Base):
    __tablename__ = "revenue_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    analysis_period = Column(
        String(100),
        nullable=False,
    )

    total_orders = Column(
        Integer,
        nullable=False,
        default=0,
    )

    total_units_sold = Column(
        Integer,
        nullable=False,
        default=0,
    )

    total_revenue = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    average_order_value = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    revenue_growth_rate = Column(
        Float,
        nullable=False,
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
# ==========================================================
# PROFIT MARGIN
# ==========================================================

class ProfitMargin(Base):
    __tablename__ = "profit_margin"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    analysis_period = Column(
        String(100),
        nullable=False,
    )

    total_revenue = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    total_cost = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    gross_profit = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    profit_margin_percentage = Column(
        Float,
        nullable=False,
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