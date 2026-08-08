from datetime import datetime
from pydantic import BaseModel, ConfigDict


# ==========================================================
# BASE
# ==========================================================

class FleetPerformanceBase(BaseModel):
    vehicle_number: str
    driver_name: str
    vehicle_type: str

    distance_travelled: float
    fuel_used: float
    trips_completed: int

    maintenance_cost: float

    fuel_efficiency: float

    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class FleetPerformanceCreate(FleetPerformanceBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class FleetPerformanceUpdate(BaseModel):
    vehicle_number: str | None = None
    driver_name: str | None = None
    vehicle_type: str | None = None

    distance_travelled: float | None = None
    fuel_used: float | None = None
    trips_completed: int | None = None

    maintenance_cost: float | None = None

    fuel_efficiency: float | None = None

    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class FleetPerformanceResponse(FleetPerformanceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
from datetime import datetime
from pydantic import BaseModel, ConfigDict


# ==========================================================
# ROUTE OPTIMIZATION BASE
# ==========================================================

class RouteOptimizationBase(BaseModel):
    route_name: str
    origin: str
    destination: str

    distance_km: float
    estimated_time_hours: float

    fuel_estimate: float

    optimized: bool = False


# ==========================================================
# CREATE
# ==========================================================

class RouteOptimizationCreate(RouteOptimizationBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class RouteOptimizationUpdate(BaseModel):
    route_name: str | None = None
    origin: str | None = None
    destination: str | None = None

    distance_km: float | None = None
    estimated_time_hours: float | None = None

    fuel_estimate: float | None = None

    optimized: bool | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class RouteOptimizationResponse(RouteOptimizationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
from datetime import datetime
from pydantic import BaseModel, ConfigDict


# ==========================================================
# DELIVERY TRACKING
# ==========================================================

class DeliveryTrackingBase(BaseModel):
    order_number: str
    customer_name: str

    origin: str
    destination: str

    driver_name: str
    vehicle_number: str

    delivery_status: str = "Pending"

    expected_delivery: datetime
    actual_delivery: datetime | None = None


# ==========================================================
# CREATE
# ==========================================================

class DeliveryTrackingCreate(DeliveryTrackingBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class DeliveryTrackingUpdate(BaseModel):
    order_number: str | None = None
    customer_name: str | None = None

    origin: str | None = None
    destination: str | None = None

    driver_name: str | None = None
    vehicle_number: str | None = None

    delivery_status: str | None = None

    expected_delivery: datetime | None = None
    actual_delivery: datetime | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class DeliveryTrackingResponse(DeliveryTrackingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
from datetime import datetime
from pydantic import BaseModel, ConfigDict


# ==========================================================
# FUEL ANALYSIS
# ==========================================================

class FuelAnalysisBase(BaseModel):
    vehicle_number: str
    driver_name: str

    fuel_type: str

    fuel_purchased: float
    fuel_cost: float

    distance_travelled: float

    fuel_efficiency: float


# ==========================================================
# CREATE
# ==========================================================

class FuelAnalysisCreate(FuelAnalysisBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class FuelAnalysisUpdate(BaseModel):
    vehicle_number: str | None = None
    driver_name: str | None = None

    fuel_type: str | None = None

    fuel_purchased: float | None = None
    fuel_cost: float | None = None

    distance_travelled: float | None = None

    fuel_efficiency: float | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class FuelAnalysisResponse(FuelAnalysisBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
from datetime import datetime
from pydantic import BaseModel, ConfigDict


# ==========================================================
# BASE
# ==========================================================

class DistributionAnalyticsBase(BaseModel):
    distribution_center: str

    deliveries_completed: int

    deliveries_failed: int

    on_time_delivery_rate: float

    average_delivery_time: float

    customer_satisfaction: float


# ==========================================================
# CREATE
# ==========================================================

class DistributionAnalyticsCreate(DistributionAnalyticsBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class DistributionAnalyticsUpdate(BaseModel):
    distribution_center: str | None = None

    deliveries_completed: int | None = None

    deliveries_failed: int | None = None

    on_time_delivery_rate: float | None = None

    average_delivery_time: float | None = None

    customer_satisfaction: float | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class DistributionAnalyticsResponse(DistributionAnalyticsBase):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)