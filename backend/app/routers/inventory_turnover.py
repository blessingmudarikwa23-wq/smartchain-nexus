from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.inventory_turnover import (
    InventoryTurnoverResponse,
)

router = APIRouter(
    prefix="/analytics/inventory-turnover",
    tags=["Inventory Turnover Analytics"],
)


# ==========================================
# Inventory Turnover Analytics
# ==========================================
@router.get("/", response_model=list[InventoryTurnoverResponse])
def get_inventory_turnover(
    db: Session = Depends(get_db),
):

    turnover = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.sum(SalesOrder.quantity).label(
                "quantity_sold"
            ),
        )
        .join(
            SalesOrder,
            Product.id == SalesOrder.product_id,
        )
        .group_by(
            Product.id,
            Product.product_name,
        )
        .order_by(
            func.sum(SalesOrder.quantity).desc()
        )
        .all()
    )

    return [
        InventoryTurnoverResponse(
            product_id=row.product_id,
            product_name=row.product_name,
            quantity_sold=row.quantity_sold,
        )
        for row in turnover
    ]