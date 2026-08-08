from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    func,
)

from app.database.base import Base


# ==========================================================
# FLEET PERFORMANCE
# ==========================================================

class FleetPerformance(Base):
    __tablename__ = "fleet_performance"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_number = Column(String(100), nullable=False, unique=True)
    driver_name = Column(String(255), nullable=False)
    vehicle_type = Column(String(100), nullable=False)

    distance_travelled = Column(Float, default=0.0)
    fuel_used = Column(Float, default=0.0)
    trips_completed = Column(Integer, default=0)

    maintenance_cost = Column(Float, default=0.0)

    fuel_efficiency = Column(Float, default=0.0)

    status = Column(
        String(50),
        default="Active",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
# ==========================================================
# ROUTE OPTIMIZATION
# ==========================================================

class RouteOptimization(Base):
    __tablename__ = "route_optimization"

    id = Column(Integer, primary_key=True, index=True)

    route_name = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)

    distance_km = Column(Float, nullable=False)
    estimated_time_hours = Column(Float, nullable=False)

    fuel_estimate = Column(Float, nullable=False)

    optimized = Column(Boolean, default=False)

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
# DELIVERY TRACKING
# ==========================================================

class DeliveryTracking(Base):
    __tablename__ = "delivery_tracking"

    id = Column(Integer, primary_key=True, index=True)

    order_number = Column(String, nullable=False, unique=True)
    customer_name = Column(String, nullable=False)

    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)

    driver_name = Column(String, nullable=False)
    vehicle_number = Column(String, nullable=False)

    delivery_status = Column(String, default="Pending")

    expected_delivery = Column(DateTime, nullable=False)
    actual_delivery = Column(DateTime, nullable=True)

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
# FUEL ANALYSIS
# ==========================================================

class FuelAnalysis(Base):
    __tablename__ = "fuel_analysis"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_number = Column(String, nullable=False)
    driver_name = Column(String, nullable=False)

    fuel_type = Column(String, nullable=False)

    fuel_purchased = Column(Float, default=0.0)
    fuel_cost = Column(Float, default=0.0)

    distance_travelled = Column(Float, default=0.0)

    fuel_efficiency = Column(Float, default=0.0)

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
# DISTRIBUTION ANALYTICS
# ==========================================================

class DistributionAnalytics(Base):
    __tablename__ = "distribution_analytics"

    id = Column(Integer, primary_key=True, index=True)

    distribution_center = Column(String(255), nullable=False)

    deliveries_completed = Column(Integer, default=0)

    deliveries_failed = Column(Integer, default=0)

    on_time_delivery_rate = Column(Float, default=0.0)

    average_delivery_time = Column(Float, default=0.0)

    customer_satisfaction = Column(Float, default=0.0)

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )