from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.inventory_days_on_hand import (
    InventoryDaysOnHandResponse,
)

router = APIRouter(
    prefix="/analytics/inventory-days-on-hand",
    tags=["Inventory Days on Hand"],
)


@router.get("/", response_model=list[InventoryDaysOnHandResponse])
def get_inventory_days_on_hand(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            Product.quantity_in_stock.label("quantity"),
            func.coalesce(
                func.avg(SalesOrder.quantity),
                0,
            ).label("avg_daily_sales"),
        )
        .outerjoin(
            SalesOrder,
            Product.id == SalesOrder.product_id,
        )
        .group_by(
            Product.id,
            Product.product_name,
            Product.quantity_in_stock,
        )
        .all()
    )

    response = []

    for row in results:
        avg_sales = float(row.avg_daily_sales)

        days_on_hand = (
            row.quantity / avg_sales
            if avg_sales > 0
            else 0
        )

        response.append(
            InventoryDaysOnHandResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                quantity_in_stock=row.quantity,
                average_daily_sales=round(avg_sales, 2),
                days_on_hand=round(days_on_hand, 2),
            )
        )

    return response