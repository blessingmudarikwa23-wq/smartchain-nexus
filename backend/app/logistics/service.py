from sqlalchemy.orm import Session

from app.logistics.models import FleetPerformance
from app.logistics.schemas import (
    FleetPerformanceCreate,
    FleetPerformanceUpdate,
)


# ==========================================================
# CREATE
# ==========================================================

def create_fleet_performance(
    db: Session,
    payload: FleetPerformanceCreate,
):
    record = FleetPerformance(**payload.model_dump())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# GET ALL
# ==========================================================

def get_fleet_performance(
    db: Session,
):
    return db.query(FleetPerformance).all()


# ==========================================================
# GET ONE
# ==========================================================

def get_single_fleet_performance(
    db: Session,
    record_id: int,
):
    return (
        db.query(FleetPerformance)
        .filter(FleetPerformance.id == record_id)
        .first()
    )


# ==========================================================
# UPDATE
# ==========================================================

def update_fleet_performance(
    db: Session,
    record_id: int,
    payload: FleetPerformanceUpdate,
):
    record = get_single_fleet_performance(db, record_id)

    if not record:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# DELETE
# ==========================================================

def delete_fleet_performance(
    db: Session,
    record_id: int,
):
    record = get_single_fleet_performance(db, record_id)

    if not record:
        return None

    db.delete(record)
    db.commit()

    return record
from sqlalchemy.orm import Session

from app.logistics.models import RouteOptimization

from app.logistics.schemas import (
    RouteOptimizationCreate,
    RouteOptimizationUpdate,
)


# ==========================================================
# CREATE
# ==========================================================

def create_route_optimization(
    db: Session,
    payload: RouteOptimizationCreate,
):
    record = RouteOptimization(**payload.model_dump())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# GET ALL
# ==========================================================

def get_route_optimizations(
    db: Session,
):
    return db.query(RouteOptimization).all()


# ==========================================================
# GET ONE
# ==========================================================

def get_route_optimization(
    db: Session,
    record_id: int,
):
    return (
        db.query(RouteOptimization)
        .filter(RouteOptimization.id == record_id)
        .first()
    )


# ==========================================================
# UPDATE
# ==========================================================

def update_route_optimization(
    db: Session,
    record_id: int,
    payload: RouteOptimizationUpdate,
):
    record = (
        db.query(RouteOptimization)
        .filter(RouteOptimization.id == record_id)
        .first()
    )

    if record is None:
        return None

    updates = payload.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# DELETE
# ==========================================================

def delete_route_optimization(
    db: Session,
    record_id: int,
):
    record = (
        db.query(RouteOptimization)
        .filter(RouteOptimization.id == record_id)
        .first()
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record
from app.logistics.models import DeliveryTracking

from app.logistics.schemas import (
    DeliveryTrackingCreate,
    DeliveryTrackingUpdate,
)


# ==========================================================
# CREATE
# ==========================================================

def create_delivery_tracking(
    db: Session,
    payload: DeliveryTrackingCreate,
):
    record = DeliveryTracking(**payload.model_dump())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# GET ALL
# ==========================================================

def get_delivery_tracking(
    db: Session,
):
    return db.query(DeliveryTracking).all()


# ==========================================================
# GET ONE
# ==========================================================

def get_single_delivery_tracking(
    db: Session,
    record_id: int,
):
    return (
        db.query(DeliveryTracking)
        .filter(DeliveryTracking.id == record_id)
        .first()
    )


# ==========================================================
# UPDATE
# ==========================================================

def update_delivery_tracking(
    db: Session,
    record_id: int,
    payload: DeliveryTrackingUpdate,
):
    record = (
        db.query(DeliveryTracking)
        .filter(DeliveryTracking.id == record_id)
        .first()
    )

    if record is None:
        return None

    updates = payload.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# DELETE
# ==========================================================

def delete_delivery_tracking(
    db: Session,
    record_id: int,
):
    record = (
        db.query(DeliveryTracking)
        .filter(DeliveryTracking.id == record_id)
        .first()
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record
from app.logistics.models import FuelAnalysis

from app.logistics.schemas import (
    FuelAnalysisCreate,
    FuelAnalysisUpdate,
)


# ==========================================================
# CREATE
# ==========================================================

def create_fuel_analysis(
    db: Session,
    payload: FuelAnalysisCreate,
):
    record = FuelAnalysis(**payload.model_dump())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# GET ALL
# ==========================================================

def get_fuel_analysis(
    db: Session,
):
    return db.query(FuelAnalysis).all()


# ==========================================================
# GET ONE
# ==========================================================

def get_single_fuel_analysis(
    db: Session,
    record_id: int,
):
    return (
        db.query(FuelAnalysis)
        .filter(FuelAnalysis.id == record_id)
        .first()
    )


# ==========================================================
# UPDATE
# ==========================================================

def update_fuel_analysis(
    db: Session,
    record_id: int,
    payload: FuelAnalysisUpdate,
):
    record = (
        db.query(FuelAnalysis)
        .filter(FuelAnalysis.id == record_id)
        .first()
    )

    if record is None:
        return None

    updates = payload.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


# ==========================================================
# DELETE
# ==========================================================

def delete_fuel_analysis(
    db: Session,
    record_id: int,
):
    record = (
        db.query(FuelAnalysis)
        .filter(FuelAnalysis.id == record_id)
        .first()
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record
# ==========================================================
# DISTRIBUTION ANALYTICS CRUD
# ==========================================================

from app.logistics.models import DistributionAnalytics


def create_distribution_analytics(
    db: Session,
    payload: DistributionAnalyticsCreate,
):
    record = DistributionAnalytics(**payload.model_dump())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_distribution_analytics(
    db: Session,
):
    return db.query(
        DistributionAnalytics
    ).all()


def get_single_distribution_analytics(
    db: Session,
    record_id: int,
):
    return (
        db.query(DistributionAnalytics)
        .filter(
            DistributionAnalytics.id == record_id
        )
        .first()
    )


def update_distribution_analytics(
    db: Session,
    record_id: int,
    payload: DistributionAnalyticsUpdate,
):
    record = (
        db.query(DistributionAnalytics)
        .filter(
            DistributionAnalytics.id == record_id
        )
        .first()
    )

    if not record:
        return None

    updates = payload.model_dump(
        exclude_unset=True
    )

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


def delete_distribution_analytics(
    db: Session,
    record_id: int,
):
    record = (
        db.query(DistributionAnalytics)
        .filter(
            DistributionAnalytics.id == record_id
        )
        .first()
    )

    if not record:
        return None

    db.delete(record)
    db.commit()

    return record