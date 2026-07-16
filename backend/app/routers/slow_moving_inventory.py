from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory import Inventory
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.slow_moving_inventory import (
    SlowMovingInventoryResponse,
)

router = APIRouter(
    prefix="/analytics/slow-moving-inventory",
    tags=["Slow Moving Inventory Analytics"],
)


@router.get("/", response_model=list[SlowMovingInventoryResponse])
def get_slow_moving_inventory(
    db: Session = Depends(get_db),
):

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            Inventory.quantity.label("quantity_in_stock"),
            func.coalesce(
                func.sum(SalesOrder.quantity),
                0,
            ).label("units_sold"),
        )
        .join(
            Inventory,
            Product.id == Inventory.product_id,
        )
        .outerjoin(
            SalesOrder,
            Product.id == SalesOrder.product_id,
        )
        .group_by(
            Product.id,
            Product.product_name,
            Inventory.quantity,
        )
        .all()
    )

    response = []

    for row in results:

        slow_moving = row.units_sold < 50

        response.append(
            SlowMovingInventoryResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                quantity_in_stock=row.quantity_in_stock,
                units_sold=row.units_sold,
                slow_moving=slow_moving,
            )
        )

    return response