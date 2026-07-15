from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.schemas.warehouse_utilization import (
    WarehouseUtilizationResponse,
)

router = APIRouter(
    prefix="/analytics/warehouse-utilization",
    tags=["Warehouse Utilization"],
)


@router.get("/", response_model=WarehouseUtilizationResponse)
def get_warehouse_utilization(
    db: Session = Depends(get_db),
):
    TOTAL_CAPACITY = 10000

    used_capacity = (
        db.query(
            func.coalesce(
                func.sum(Product.quantity_in_stock),
                0,
            )
        ).scalar()
        or 0
    )

    available_capacity = TOTAL_CAPACITY - used_capacity

    utilization_percent = (
        (used_capacity / TOTAL_CAPACITY) * 100
        if TOTAL_CAPACITY > 0
        else 0
    )

    return WarehouseUtilizationResponse(
        total_capacity=TOTAL_CAPACITY,
        used_capacity=used_capacity,
        available_capacity=available_capacity,
        utilization_percent=round(utilization_percent, 2),
    )