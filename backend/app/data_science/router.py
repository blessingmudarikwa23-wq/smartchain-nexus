from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.data_science.schemas import (
    DemandForecastingCreate,
    DemandForecastingUpdate,
    DemandForecastingResponse,
    SalesPredictionCreate,
    SalesPredictionUpdate,
    SalesPredictionResponse,
    SupplierRiskPredictionCreate,
    SupplierRiskPredictionUpdate,
    SupplierRiskPredictionResponse,
    CustomerSegmentationCreate,
    CustomerSegmentationUpdate,
    CustomerSegmentationResponse,
    InventoryOptimizationCreate,
    InventoryOptimizationUpdate,
    InventoryOptimizationResponse,
    AnomalyDetectionCreate,
    AnomalyDetectionUpdate,
    AnomalyDetectionResponse,
)

from app.data_science.service import (
    get_data_science_dashboard,
    create_demand_forecasting,
    get_demand_forecasts,
    get_demand_forecast,
    update_demand_forecasting,
    delete_demand_forecasting,
    create_sales_prediction,
    get_sales_predictions,
    get_sales_prediction,
    update_sales_prediction,
    delete_sales_prediction,
    create_supplier_risk_prediction,
    get_supplier_risk_predictions,
    get_supplier_risk_prediction,
    update_supplier_risk_prediction,
    delete_supplier_risk_prediction,
    create_customer_segmentation,
    get_customer_segmentations,
    get_customer_segmentation,
    update_customer_segmentation,
    delete_customer_segmentation,
    create_inventory_optimization,
    get_inventory_optimizations,
    get_inventory_optimization,
    update_inventory_optimization,
    delete_inventory_optimization,
    create_anomaly_detection,
    get_anomaly_detections,
    get_anomaly_detection,
    update_anomaly_detection,
    delete_anomaly_detection,
)


router = APIRouter(
    prefix="/data-science",
    tags=["Data Science"],
)


@router.get("/dashboard")
def data_science_dashboard():
    return get_data_science_dashboard()


@router.post(
    "/demand-forecasting",
    response_model=DemandForecastingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_demand_forecasting_route(
    payload: DemandForecastingCreate,
    db: Session = Depends(get_db),
):
    return create_demand_forecasting(db, payload)


@router.get(
    "/demand-forecasting",
    response_model=list[DemandForecastingResponse],
)
def get_demand_forecasts_route(
    db: Session = Depends(get_db),
):
    return get_demand_forecasts(db)


@router.get(
    "/demand-forecasting/{forecast_id}",
    response_model=DemandForecastingResponse,
)
def get_demand_forecast_route(
    forecast_id: int,
    db: Session = Depends(get_db),
):
    forecast = get_demand_forecast(db, forecast_id)

    if forecast is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demand Forecast not found",
        )

    return forecast


@router.put(
    "/demand-forecasting/{forecast_id}",
    response_model=DemandForecastingResponse,
)
def update_demand_forecasting_route(
    forecast_id: int,
    payload: DemandForecastingUpdate,
    db: Session = Depends(get_db),
):
    forecast = update_demand_forecasting(
        db,
        forecast_id,
        payload,
    )

    if forecast is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demand Forecast not found",
        )

    return forecast


@router.delete(
    "/demand-forecasting/{forecast_id}",
)
def delete_demand_forecasting_route(
    forecast_id: int,
    db: Session = Depends(get_db),
):
    forecast = delete_demand_forecasting(
        db,
        forecast_id,
    )

    if forecast is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demand Forecast not found",
        )

    return {
        "message": "Demand Forecast deleted successfully",
        "forecast_id": forecast_id,
    }


@router.post(
    "/sales-prediction",
    response_model=SalesPredictionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sales_prediction_route(
    payload: SalesPredictionCreate,
    db: Session = Depends(get_db),
):
    return create_sales_prediction(db, payload)


@router.get(
    "/sales-prediction",
    response_model=list[SalesPredictionResponse],
)
def get_sales_predictions_route(
    db: Session = Depends(get_db),
):
    return get_sales_predictions(db)


@router.get(
    "/sales-prediction/{prediction_id}",
    response_model=SalesPredictionResponse,
)
def get_sales_prediction_route(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    prediction = get_sales_prediction(
        db,
        prediction_id,
    )

    if prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales Prediction not found",
        )

    return prediction


@router.put(
    "/sales-prediction/{prediction_id}",
    response_model=SalesPredictionResponse,
)
def update_sales_prediction_route(
    prediction_id: int,
    payload: SalesPredictionUpdate,
    db: Session = Depends(get_db),
):
    prediction = update_sales_prediction(
        db,
        prediction_id,
        payload,
    )

    if prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales Prediction not found",
        )

    return prediction


@router.delete(
    "/sales-prediction/{prediction_id}",
)
def delete_sales_prediction_route(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    prediction = delete_sales_prediction(
        db,
        prediction_id,
    )

    if prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales Prediction not found",
        )

    return {
        "message": "Sales Prediction deleted successfully",
        "prediction_id": prediction_id,
    }


@router.post(
    "/supplier-risk-prediction",
    response_model=SupplierRiskPredictionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_supplier_risk_prediction_route(
    payload: SupplierRiskPredictionCreate,
    db: Session = Depends(get_db),
):
    return create_supplier_risk_prediction(
        db,
        payload,
    )


@router.get(
    "/supplier-risk-prediction",
    response_model=list[SupplierRiskPredictionResponse],
)
def get_supplier_risk_predictions_route(
    db: Session = Depends(get_db),
):
    return get_supplier_risk_predictions(db)


@router.get(
    "/supplier-risk-prediction/{supplier_risk_id}",
    response_model=SupplierRiskPredictionResponse,
)
def get_supplier_risk_prediction_route(
    supplier_risk_id: int,
    db: Session = Depends(get_db),
):
    supplier_risk = get_supplier_risk_prediction(
        db,
        supplier_risk_id,
    )

    if supplier_risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier Risk Prediction not found",
        )

    return supplier_risk


@router.put(
    "/supplier-risk-prediction/{supplier_risk_id}",
    response_model=SupplierRiskPredictionResponse,
)
def update_supplier_risk_prediction_route(
    supplier_risk_id: int,
    payload: SupplierRiskPredictionUpdate,
    db: Session = Depends(get_db),
):
    supplier_risk = update_supplier_risk_prediction(
        db,
        supplier_risk_id,
        payload,
    )

    if supplier_risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier Risk Prediction not found",
        )

    return supplier_risk


@router.delete(
    "/supplier-risk-prediction/{supplier_risk_id}",
)
def delete_supplier_risk_prediction_route(
    supplier_risk_id: int,
    db: Session = Depends(get_db),
):
    supplier_risk = delete_supplier_risk_prediction(
        db,
        supplier_risk_id,
    )

    if supplier_risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier Risk Prediction not found",
        )

    return {
        "message": "Supplier Risk Prediction deleted successfully",
        "supplier_risk_id": supplier_risk_id,
    }
@router.post(
    "/customer-segmentation",
    response_model=CustomerSegmentationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer_segmentation_route(
    payload: CustomerSegmentationCreate,
    db: Session = Depends(get_db),
):
    return create_customer_segmentation(db, payload)


@router.get(
    "/customer-segmentation",
    response_model=list[CustomerSegmentationResponse],
)
def get_customer_segmentations_route(
    db: Session = Depends(get_db),
):
    return get_customer_segmentations(db)


@router.get(
    "/customer-segmentation/{segmentation_id}",
    response_model=CustomerSegmentationResponse,
)
def get_customer_segmentation_route(
    segmentation_id: int,
    db: Session = Depends(get_db),
):
    customer = get_customer_segmentation(
        db,
        segmentation_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer Segmentation not found",
        )

    return customer


@router.put(
    "/customer-segmentation/{segmentation_id}",
    response_model=CustomerSegmentationResponse,
)
def update_customer_segmentation_route(
    segmentation_id: int,
    payload: CustomerSegmentationUpdate,
    db: Session = Depends(get_db),
):
    customer = update_customer_segmentation(
        db,
        segmentation_id,
        payload,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer Segmentation not found",
        )

    return customer


@router.delete(
    "/customer-segmentation/{segmentation_id}",
)
def delete_customer_segmentation_route(
    segmentation_id: int,
    db: Session = Depends(get_db),
):
    customer = delete_customer_segmentation(
        db,
        segmentation_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer Segmentation not found",
        )

    return {
        "message": "Customer Segmentation deleted successfully",
        "segmentation_id": segmentation_id,
    }
# ==========================================================
# INVENTORY OPTIMIZATION
# ==========================================================

@router.post(
    "/inventory-optimization",
    response_model=InventoryOptimizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_optimization_route(
    payload: InventoryOptimizationCreate,
    db: Session = Depends(get_db),
):
    return create_inventory_optimization(
        db,
        payload,
    )


@router.get(
    "/inventory-optimization",
    response_model=list[InventoryOptimizationResponse],
)
def get_inventory_optimizations_route(
    db: Session = Depends(get_db),
):
    return get_inventory_optimizations(db)


@router.get(
    "/inventory-optimization/{optimization_id}",
    response_model=InventoryOptimizationResponse,
)
def get_inventory_optimization_route(
    optimization_id: int,
    db: Session = Depends(get_db),
):
    inventory = get_inventory_optimization(
        db,
        optimization_id,
    )

    if inventory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory Optimization not found",
        )

    return inventory


@router.put(
    "/inventory-optimization/{optimization_id}",
    response_model=InventoryOptimizationResponse,
)
def update_inventory_optimization_route(
    optimization_id: int,
    payload: InventoryOptimizationUpdate,
    db: Session = Depends(get_db),
):
    inventory = update_inventory_optimization(
        db,
        optimization_id,
        payload,
    )

    if inventory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory Optimization not found",
        )

    return inventory


@router.delete(
    "/inventory-optimization/{optimization_id}",
)
def delete_inventory_optimization_route(
    optimization_id: int,
    db: Session = Depends(get_db),
):
    inventory = delete_inventory_optimization(
        db,
        optimization_id,
    )

    if inventory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory Optimization not found",
        )

    return {
        "message": "Inventory Optimization deleted successfully",
        "optimization_id": optimization_id,
    }
# ==========================================================
# ANOMALY DETECTION
# ==========================================================

@router.post(
    "/anomaly-detection",
    response_model=AnomalyDetectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_anomaly_detection_route(
    payload: AnomalyDetectionCreate,
    db: Session = Depends(get_db),
):
    return create_anomaly_detection(
        db,
        payload,
    )


@router.get(
    "/anomaly-detection",
    response_model=list[AnomalyDetectionResponse],
)
def get_anomaly_detections_route(
    db: Session = Depends(get_db),
):
    return get_anomaly_detections(db)


@router.get(
    "/anomaly-detection/{anomaly_id}",
    response_model=AnomalyDetectionResponse,
)
def get_anomaly_detection_route(
    anomaly_id: int,
    db: Session = Depends(get_db),
):
    anomaly = get_anomaly_detection(
        db,
        anomaly_id,
    )

    if anomaly is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anomaly Detection not found",
        )

    return anomaly


@router.put(
    "/anomaly-detection/{anomaly_id}",
    response_model=AnomalyDetectionResponse,
)
def update_anomaly_detection_route(
    anomaly_id: int,
    payload: AnomalyDetectionUpdate,
    db: Session = Depends(get_db),
):
    anomaly = update_anomaly_detection(
        db,
        anomaly_id,
        payload,
    )

    if anomaly is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anomaly Detection not found",
        )

    return anomaly


@router.delete(
    "/anomaly-detection/{anomaly_id}",
)
def delete_anomaly_detection_route(
    anomaly_id: int,
    db: Session = Depends(get_db),
):
    anomaly = delete_anomaly_detection(
        db,
        anomaly_id,
    )

    if anomaly is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anomaly Detection not found",
        )

    return {
        "message": "Anomaly Detection deleted successfully",
        "anomaly_id": anomaly_id,
    }

