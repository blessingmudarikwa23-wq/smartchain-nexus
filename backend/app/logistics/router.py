from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.logistics.schemas import (
    FleetPerformanceCreate,
    FleetPerformanceUpdate,
    FleetPerformanceResponse,
)

from app.logistics.service import (
    create_fleet_performance,
    get_fleet_performance,
    get_single_fleet_performance,
    update_fleet_performance,
    delete_fleet_performance,
)

router = APIRouter(
    prefix="/logistics",
    tags=["Logistics"],
)


# ==========================================================
# FLEET PERFORMANCE
# ==========================================================

@router.post(
    "/fleet-performance",
    response_model=FleetPerformanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fleet_performance_route(
    payload: FleetPerformanceCreate,
    db: Session = Depends(get_db),
):
    return create_fleet_performance(db, payload)


@router.get(
    "/fleet-performance",
    response_model=list[FleetPerformanceResponse],
)
def get_fleet_performance_route(
    db: Session = Depends(get_db),
):
    return get_fleet_performance(db)


@router.get(
    "/fleet-performance/{record_id}",
    response_model=FleetPerformanceResponse,
)
def get_single_fleet_performance_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_single_fleet_performance(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fleet Performance record not found",
        )

    return record


@router.put(
    "/fleet-performance/{record_id}",
    response_model=FleetPerformanceResponse,
)
def update_fleet_performance_route(
    record_id: int,
    payload: FleetPerformanceUpdate,
    db: Session = Depends(get_db),
):
    record = update_fleet_performance(db, record_id, payload)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fleet Performance record not found",
        )

    return record


@router.delete(
    "/fleet-performance/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_fleet_performance_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_fleet_performance(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fleet Performance record not found",
        )

    return {
        "message": "Fleet Performance deleted successfully"
    }
# ==========================================================
# ROUTE OPTIMIZATION ROUTES
# ==========================================================

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.logistics.schemas import (
    RouteOptimizationCreate,
    RouteOptimizationUpdate,
    RouteOptimizationResponse,
)

from app.logistics.service import (
    create_route_optimization,
    get_route_optimizations,
    get_route_optimization,
    update_route_optimization,
    delete_route_optimization,
)


# ----------------------------------------------------------
# CREATE
# ----------------------------------------------------------

@router.post(
    "/route-optimization",
    response_model=RouteOptimizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_route_optimization_route(
    payload: RouteOptimizationCreate,
    db: Session = Depends(get_db),
):
    return create_route_optimization(db, payload)


# ----------------------------------------------------------
# GET ALL
# ----------------------------------------------------------

@router.get(
    "/route-optimization",
    response_model=list[RouteOptimizationResponse],
)
def get_route_optimizations_route(
    db: Session = Depends(get_db),
):
    return get_route_optimizations(db)


# ----------------------------------------------------------
# GET ONE
# ----------------------------------------------------------

@router.get(
    "/route-optimization/{record_id}",
    response_model=RouteOptimizationResponse,
)
def get_route_optimization_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_route_optimization(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route Optimization record not found",
        )

    return record


# ----------------------------------------------------------
# UPDATE
# ----------------------------------------------------------

@router.put(
    "/route-optimization/{record_id}",
    response_model=RouteOptimizationResponse,
)
def update_route_optimization_route(
    record_id: int,
    payload: RouteOptimizationUpdate,
    db: Session = Depends(get_db),
):
    record = update_route_optimization(db, record_id, payload)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route Optimization record not found",
        )

    return record


# ----------------------------------------------------------
# DELETE
# ----------------------------------------------------------

@router.delete(
    "/route-optimization/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_route_optimization_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_route_optimization(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route Optimization record not found",
        )

    return {
        "message": "Route Optimization deleted successfully"
    }
# ==========================================================
# DELIVERY TRACKING ROUTES
# ==========================================================

from app.logistics.schemas import (
    DeliveryTrackingCreate,
    DeliveryTrackingUpdate,
    DeliveryTrackingResponse,
)

from app.logistics.service import (
    create_delivery_tracking,
    get_delivery_tracking,
    get_single_delivery_tracking,
    update_delivery_tracking,
    delete_delivery_tracking,
)


# ----------------------------------------------------------
# CREATE
# ----------------------------------------------------------

@router.post(
    "/delivery-tracking",
    response_model=DeliveryTrackingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_delivery_tracking_route(
    payload: DeliveryTrackingCreate,
    db: Session = Depends(get_db),
):
    return create_delivery_tracking(db, payload)


# ----------------------------------------------------------
# GET ALL
# ----------------------------------------------------------

@router.get(
    "/delivery-tracking",
    response_model=list[DeliveryTrackingResponse],
)
def get_delivery_tracking_route(
    db: Session = Depends(get_db),
):
    return get_delivery_tracking(db)


# ----------------------------------------------------------
# GET ONE
# ----------------------------------------------------------

@router.get(
    "/delivery-tracking/{record_id}",
    response_model=DeliveryTrackingResponse,
)
def get_single_delivery_tracking_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_single_delivery_tracking(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery Tracking record not found",
        )

    return record


# ----------------------------------------------------------
# UPDATE
# ----------------------------------------------------------

@router.put(
    "/delivery-tracking/{record_id}",
    response_model=DeliveryTrackingResponse,
)
def update_delivery_tracking_route(
    record_id: int,
    payload: DeliveryTrackingUpdate,
    db: Session = Depends(get_db),
):
    record = update_delivery_tracking(
        db,
        record_id,
        payload,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery Tracking record not found",
        )

    return record


# ----------------------------------------------------------
# DELETE
# ----------------------------------------------------------

@router.delete(
    "/delivery-tracking/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_delivery_tracking_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_delivery_tracking(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery Tracking record not found",
        )

    return {
        "message": "Delivery Tracking deleted successfully"
    }
# ==========================================================
# FUEL ANALYSIS IMPORTS
# ==========================================================

from app.logistics.schemas import (
    FuelAnalysisCreate,
    FuelAnalysisUpdate,
    FuelAnalysisResponse,
)

from app.logistics.service import (
    create_fuel_analysis,
    get_fuel_analysis,
    get_single_fuel_analysis,
    update_fuel_analysis,
    delete_fuel_analysis,
)


# ==========================================================
# FUEL ANALYSIS ROUTES
# ==========================================================

@router.post(
    "/fuel-analysis",
    response_model=FuelAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_fuel_analysis_route(
    payload: FuelAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_fuel_analysis(db, payload)


@router.get(
    "/fuel-analysis",
    response_model=list[FuelAnalysisResponse],
)
def get_fuel_analysis_route(
    db: Session = Depends(get_db),
):
    return get_fuel_analysis(db)


@router.get(
    "/fuel-analysis/{record_id}",
    response_model=FuelAnalysisResponse,
)
def get_single_fuel_analysis_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_single_fuel_analysis(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fuel Analysis record not found",
        )

    return record


@router.put(
    "/fuel-analysis/{record_id}",
    response_model=FuelAnalysisResponse,
)
def update_fuel_analysis_route(
    record_id: int,
    payload: FuelAnalysisUpdate,
    db: Session = Depends(get_db),
):
    record = update_fuel_analysis(db, record_id, payload)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fuel Analysis record not found",
        )

    return record


@router.delete(
    "/fuel-analysis/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_fuel_analysis_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_fuel_analysis(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fuel Analysis record not found",
        )

    return {
        "message": "Fuel Analysis deleted successfully"
    }
# ==========================================================
# DISTRIBUTION ANALYTICS ROUTES
# ==========================================================

from app.logistics.schemas import (
    DistributionAnalyticsCreate,
    DistributionAnalyticsUpdate,
    DistributionAnalyticsResponse,
)

from app.logistics.service import (
    create_distribution_analytics,
    get_distribution_analytics,
    get_single_distribution_analytics,
    update_distribution_analytics,
    delete_distribution_analytics,
)


@router.post(
    "/distribution-analytics",
    response_model=DistributionAnalyticsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_distribution_analytics_route(
    payload: DistributionAnalyticsCreate,
    db: Session = Depends(get_db),
):
    return create_distribution_analytics(
        db,
        payload,
    )


@router.get(
    "/distribution-analytics",
    response_model=list[DistributionAnalyticsResponse],
)
def get_distribution_analytics_route(
    db: Session = Depends(get_db),
):
    return get_distribution_analytics(db)


@router.get(
    "/distribution-analytics/{record_id}",
    response_model=DistributionAnalyticsResponse,
)
def get_single_distribution_analytics_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_single_distribution_analytics(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Distribution Analytics record not found",
        )

    return record


@router.put(
    "/distribution-analytics/{record_id}",
    response_model=DistributionAnalyticsResponse,
)
def update_distribution_analytics_route(
    record_id: int,
    payload: DistributionAnalyticsUpdate,
    db: Session = Depends(get_db),
):
    record = update_distribution_analytics(
        db,
        record_id,
        payload,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Distribution Analytics record not found",
        )

    return record


@router.delete(
    "/distribution-analytics/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_distribution_analytics_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_distribution_analytics(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Distribution Analytics record not found",
        )

    return {
        "message": "Distribution Analytics deleted successfully"
    }