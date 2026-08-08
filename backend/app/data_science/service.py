from sqlalchemy.orm import Session

from app.data_science.models import (
    DemandForecasting,
    SalesPrediction,
    SupplierRiskPrediction,
    InventoryOptimization,
    AnomalyDetection,
)

from app.data_science.schemas import (
    DemandForecastingCreate,
    DemandForecastingUpdate,
    SalesPredictionCreate,
    SalesPredictionUpdate,
    SupplierRiskPredictionCreate,
    SupplierRiskPredictionUpdate,
    InventoryOptimizationCreate,
    InventoryOptimizationUpdate,
    AnomalyDetectionCreate,
    AnomalyDetectionUpdate,
)

# ==========================================================
# DEMAND FORECASTING SERVICE
# ==========================================================

def create_demand_forecasting(
    db: Session,
    payload: DemandForecastingCreate,
):
    forecast = DemandForecasting(
        product=payload.product,
        forecast_period=payload.forecast_period,
        historical_demand=payload.historical_demand,
        forecasted_demand=payload.forecasted_demand,
        forecast_accuracy=payload.forecast_accuracy,
        model_used=payload.model_used,
        status=payload.status,
    )

    db.add(forecast)
    db.commit()
    db.refresh(forecast)

    return forecast


def get_demand_forecasts(
    db: Session,
):
    return (
        db.query(DemandForecasting)
        .order_by(DemandForecasting.id.desc())
        .all()
    )


def get_demand_forecast(
    db: Session,
    forecast_id: int,
):
    return (
        db.query(DemandForecasting)
        .filter(DemandForecasting.id == forecast_id)
        .first()
    )


def update_demand_forecasting(
    db: Session,
    forecast_id: int,
    payload: DemandForecastingUpdate,
):
    forecast = get_demand_forecast(db, forecast_id)

    if forecast is None:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(forecast, field, value)

    db.commit()
    db.refresh(forecast)

    return forecast


def delete_demand_forecasting(
    db: Session,
    forecast_id: int,
):
    forecast = get_demand_forecast(db, forecast_id)

    if forecast is None:
        return None

    db.delete(forecast)
    db.commit()

    return forecast


# ==========================================================
# SALES PREDICTION SERVICE
# ==========================================================

def create_sales_prediction(
    db: Session,
    payload: SalesPredictionCreate,
):
    prediction = SalesPrediction(
        month=payload.month,
        predicted_sales=payload.predicted_sales,
        model_used=payload.model_used,
        prediction_accuracy=payload.prediction_accuracy,
        status=payload.status,
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction


def get_sales_predictions(
    db: Session,
):
    return (
        db.query(SalesPrediction)
        .order_by(SalesPrediction.id.desc())
        .all()
    )


def get_sales_prediction(
    db: Session,
    prediction_id: int,
):
    return (
        db.query(SalesPrediction)
        .filter(SalesPrediction.id == prediction_id)
        .first()
    )


def update_sales_prediction(
    db: Session,
    prediction_id: int,
    payload: SalesPredictionUpdate,
):
    prediction = get_sales_prediction(db, prediction_id)

    if prediction is None:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(prediction, field, value)

    db.commit()
    db.refresh(prediction)

    return prediction


def delete_sales_prediction(
    db: Session,
    prediction_id: int,
):
    prediction = get_sales_prediction(db, prediction_id)

    if prediction is None:
        return None

    db.delete(prediction)
    db.commit()

    return prediction


# ==========================================================
# SUPPLIER RISK PREDICTION SERVICE
# ==========================================================

def create_supplier_risk_prediction(
    db: Session,
    payload: SupplierRiskPredictionCreate,
):
    supplier_risk = SupplierRiskPrediction(
        supplier=payload.supplier,
        risk_score=payload.risk_score,
        risk_level=payload.risk_level,
        delivery_performance=payload.delivery_performance,
        quality_score=payload.quality_score,
        financial_score=payload.financial_score,
        status=payload.status,
    )

    db.add(supplier_risk)
    db.commit()
    db.refresh(supplier_risk)

    return supplier_risk


def get_supplier_risk_predictions(
    db: Session,
):
    return (
        db.query(SupplierRiskPrediction)
        .order_by(SupplierRiskPrediction.id.desc())
        .all()
    )


def get_supplier_risk_prediction(
    db: Session,
    supplier_risk_id: int,
):
    return (
        db.query(SupplierRiskPrediction)
        .filter(
            SupplierRiskPrediction.id == supplier_risk_id
        )
        .first()
    )


def update_supplier_risk_prediction(
    db: Session,
    supplier_risk_id: int,
    payload: SupplierRiskPredictionUpdate,
):
    supplier_risk = get_supplier_risk_prediction(
        db,
        supplier_risk_id,
    )

    if supplier_risk is None:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(supplier_risk, field, value)

    db.commit()
    db.refresh(supplier_risk)

    return supplier_risk


def delete_supplier_risk_prediction(
    db: Session,
    supplier_risk_id: int,
):
    supplier_risk = get_supplier_risk_prediction(
        db,
        supplier_risk_id,
    )

    if supplier_risk is None:
        return None

    db.delete(supplier_risk)
    db.commit()

    return supplier_risk


# ==========================================================
# DATA SCIENCE DASHBOARD
# ==========================================================

def get_data_science_dashboard():
    return {
        "demand_forecasting": [],
        "sales_prediction": [],
        "supplier_risk": [],
        "customer_segmentation": [],
        "inventory_optimization": [],
        "anomaly_detection": [],
    }
# ==========================================================
# CUSTOMER SEGMENTATION SERVICE
# ==========================================================

from sqlalchemy.orm import Session

from app.data_science.models import CustomerSegmentation

from app.data_science.schemas import (
    CustomerSegmentationCreate,
    CustomerSegmentationUpdate,
)


def create_customer_segmentation(
    db: Session,
    payload: CustomerSegmentationCreate,
):
    customer = CustomerSegmentation(
        customer=payload.customer,
        segment=payload.segment,
        total_spend=payload.total_spend,
        purchase_frequency=payload.purchase_frequency,
        customer_value=payload.customer_value,
        status=payload.status,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def get_customer_segmentations(
    db: Session,
):
    return (
        db.query(CustomerSegmentation)
        .order_by(CustomerSegmentation.id.desc())
        .all()
    )


def get_customer_segmentation(
    db: Session,
    segmentation_id: int,
):
    return (
        db.query(CustomerSegmentation)
        .filter(
            CustomerSegmentation.id == segmentation_id
        )
        .first()
    )


def update_customer_segmentation(
    db: Session,
    segmentation_id: int,
    payload: CustomerSegmentationUpdate,
):
    customer = get_customer_segmentation(
        db,
        segmentation_id,
    )

    if customer is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer_segmentation(
    db: Session,
    segmentation_id: int,
):
    customer = get_customer_segmentation(
        db,
        segmentation_id,
    )

    if customer is None:
        return None

    db.delete(customer)
    db.commit()

    return customer
# ==========================================================
# INVENTORY OPTIMIZATION SERVICE
# ==========================================================

def create_inventory_optimization(
    db: Session,
    payload: InventoryOptimizationCreate,
):
    inventory = InventoryOptimization(
        product=payload.product,
        recommendation=payload.recommendation,
        status=payload.status,
    )

    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return inventory


def get_inventory_optimizations(
    db: Session,
):
    return (
        db.query(InventoryOptimization)
        .order_by(InventoryOptimization.id.desc())
        .all()
    )


def get_inventory_optimization(
    db: Session,
    optimization_id: int,
):
    return (
        db.query(InventoryOptimization)
        .filter(
            InventoryOptimization.id == optimization_id
        )
        .first()
    )


def update_inventory_optimization(
    db: Session,
    optimization_id: int,
    payload: InventoryOptimizationUpdate,
):
    inventory = get_inventory_optimization(
        db,
        optimization_id,
    )

    if inventory is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(inventory, field, value)

    db.commit()
    db.refresh(inventory)

    return inventory


def delete_inventory_optimization(
    db: Session,
    optimization_id: int,
):
    inventory = get_inventory_optimization(
        db,
        optimization_id,
    )

    if inventory is None:
        return None

    db.delete(inventory)
    db.commit()

    return inventory
# ==========================================================
# ANOMALY DETECTION SERVICE
# ==========================================================

def create_anomaly_detection(
    db: Session,
    payload: AnomalyDetectionCreate,
):
    anomaly = AnomalyDetection(
        module=payload.module,
        anomaly=payload.anomaly,
        status=payload.status,
    )

    db.add(anomaly)
    db.commit()
    db.refresh(anomaly)

    return anomaly


def get_anomaly_detections(
    db: Session,
):
    return (
        db.query(AnomalyDetection)
        .order_by(AnomalyDetection.id.desc())
        .all()
    )


def get_anomaly_detection(
    db: Session,
    anomaly_id: int,
):
    return (
        db.query(AnomalyDetection)
        .filter(
            AnomalyDetection.id == anomaly_id
        )
        .first()
    )


def update_anomaly_detection(
    db: Session,
    anomaly_id: int,
    payload: AnomalyDetectionUpdate,
):
    anomaly = get_anomaly_detection(
        db,
        anomaly_id,
    )

    if anomaly is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            anomaly,
            field,
            value,
        )

    db.commit()
    db.refresh(anomaly)

    return anomaly


def delete_anomaly_detection(
    db: Session,
    anomaly_id: int,
):
    anomaly = get_anomaly_detection(
        db,
        anomaly_id,
    )

    if anomaly is None:
        return None

    db.delete(anomaly)
    db.commit()

    return anomaly