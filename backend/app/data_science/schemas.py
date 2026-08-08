from pydantic import BaseModel


class DemandForecast(BaseModel):
    product: str
    forecast: int


class SalesPrediction(BaseModel):
    month: str
    predicted_sales: float


class SupplierRisk(BaseModel):
    supplier: str
    risk_score: float
    level: str


class CustomerSegment(BaseModel):
    segment: str
    customers: int


class InventoryOptimization(BaseModel):
    product: str
    recommendation: str


class AnomalyDetection(BaseModel):
    module: str
    anomaly: str


class DataScienceDashboard(BaseModel):
    demand_forecasting: list[DemandForecast]
    sales_prediction: list[SalesPrediction]
    supplier_risk: list[SupplierRisk]
    customer_segmentation: list[CustomerSegment]
    inventory_optimization: list[InventoryOptimization]
    anomaly_detection: list[AnomalyDetection]
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# DEMAND FORECASTING
# ==========================================================


class DemandForecastingBase(BaseModel):
    product: str
    forecast_period: str

    historical_demand: float = 0.0
    forecasted_demand: float = 0.0

    forecast_accuracy: float = 0.0

    model_used: str = "Baseline"
    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class DemandForecastingCreate(DemandForecastingBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class DemandForecastingUpdate(BaseModel):
    product: str | None = None
    forecast_period: str | None = None

    historical_demand: float | None = None
    forecasted_demand: float | None = None

    forecast_accuracy: float | None = None

    model_used: str | None = None
    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class DemandForecastingResponse(DemandForecastingBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
# ==========================================================
# SALES PREDICTION
# ==========================================================

class SalesPredictionBase(BaseModel):
    month: str

    predicted_sales: float = 0.0

    model_used: str = "Baseline"

    prediction_accuracy: float = 0.0

    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class SalesPredictionCreate(SalesPredictionBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class SalesPredictionUpdate(BaseModel):
    month: str | None = None

    predicted_sales: float | None = None

    model_used: str | None = None

    prediction_accuracy: float | None = None

    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class SalesPredictionResponse(SalesPredictionBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# SUPPLIER RISK PREDICTION
# ==========================================================

class SupplierRiskPredictionBase(BaseModel):
    supplier: str

    risk_score: float = 0.0
    risk_level: str = "Low"

    delivery_performance: float = 0.0
    quality_score: float = 0.0
    financial_score: float = 0.0

    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class SupplierRiskPredictionCreate(
    SupplierRiskPredictionBase
):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class SupplierRiskPredictionUpdate(BaseModel):
    supplier: str | None = None

    risk_score: float | None = None
    risk_level: str | None = None

    delivery_performance: float | None = None
    quality_score: float | None = None
    financial_score: float | None = None

    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class SupplierRiskPredictionResponse(
    SupplierRiskPredictionBase
):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
# ==========================================================
# CUSTOMER SEGMENTATION
# ==========================================================

class CustomerSegmentationBase(BaseModel):
    customer: str

    segment: str = "Standard"

    total_spend: float = 0.0

    purchase_frequency: float = 0.0

    customer_value: float = 0.0

    status: str = "Active"


class CustomerSegmentationCreate(
    CustomerSegmentationBase
):
    pass


class CustomerSegmentationUpdate(BaseModel):
    customer: str | None = None

    segment: str | None = None

    total_spend: float | None = None

    purchase_frequency: float | None = None

    customer_value: float | None = None

    status: str | None = None


class CustomerSegmentationResponse(
    CustomerSegmentationBase
):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
# ==========================================================
# INVENTORY OPTIMIZATION
# ==========================================================

class InventoryOptimizationBase(BaseModel):
    product: str

    recommendation: str

    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class InventoryOptimizationCreate(
    InventoryOptimizationBase
):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class InventoryOptimizationUpdate(BaseModel):
    product: str | None = None

    recommendation: str | None = None

    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class InventoryOptimizationResponse(
    InventoryOptimizationBase
):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
# ==========================================================
# ANOMALY DETECTION
# ==========================================================

class AnomalyDetectionBase(BaseModel):
    module: str

    anomaly: str

    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class AnomalyDetectionCreate(
    AnomalyDetectionBase
):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class AnomalyDetectionUpdate(BaseModel):
    module: str | None = None

    anomaly: str | None = None

    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class AnomalyDetectionResponse(
    AnomalyDetectionBase
):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )