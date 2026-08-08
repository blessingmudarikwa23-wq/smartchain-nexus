from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# DEMAND FORECASTING
# ==========================================================

class DemandForecasting(Base):
    __tablename__ = "demand_forecasting"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    product = Column(
        String(255),
        nullable=False,
        index=True,
    )

    forecast_period = Column(
        String(100),
        nullable=False,
    )

    historical_demand = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    forecasted_demand = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    forecast_accuracy = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    model_used = Column(
        String(100),
        nullable=False,
        default="Baseline",
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
# SALES PREDICTION
# ==========================================================

class SalesPrediction(Base):
    __tablename__ = "sales_prediction"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    month = Column(
        String(100),
        nullable=False,
        index=True,
    )

    predicted_sales = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    model_used = Column(
        String(100),
        nullable=False,
        default="Baseline",
    )

    prediction_accuracy = Column(
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
# SUPPLIER RISK PREDICTION
# ==========================================================

class SupplierRiskPrediction(Base):
    __tablename__ = "supplier_risk_prediction"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    supplier = Column(
        String(255),
        nullable=False,
        index=True,
    )

    risk_score = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    risk_level = Column(
        String(50),
        nullable=False,
        default="Low",
    )

    delivery_performance = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    quality_score = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    financial_score = Column(
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
class CustomerSegmentation(Base):
    __tablename__ = "customer_segmentation"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer = Column(
        String(255),
        nullable=False,
        index=True,
    )

    segment = Column(
        String(100),
        nullable=False,
        default="Standard",
    )

    total_spend = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    purchase_frequency = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    customer_value = Column(
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
# ==========================================================
# INVENTORY OPTIMIZATION
# ==========================================================

class InventoryOptimization(Base):
    __tablename__ = "inventory_optimization"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    product = Column(
        String(255),
        nullable=False,
        index=True,
    )

    recommendation = Column(
        String(255),
        nullable=False,
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
{
    "product": "Product 001",
    "recommendation": "Increase stock level",
    "status": "Active"
}
# ==========================================================
# ANOMALY DETECTION
# ==========================================================

class AnomalyDetection(Base):
    __tablename__ = "anomaly_detection"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    module = Column(
        String(255),
        nullable=False,
        index=True,
    )

    anomaly = Column(
        String(255),
        nullable=False,
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