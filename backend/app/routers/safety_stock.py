from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.safety_stock import (
    SafetyStockResponse,
)

router = APIRouter(
    prefix="/analytics/safety-stock",
    tags=["Safety Stock Analytics"],
)


# ==========================================
# Safety Stock Analytics
# ==========================================
@router.get("/", response_model=list[SafetyStockResponse])
def get_safety_stock(
    db: Session = Depends(get_db),
):

    LEAD_TIME_DAYS = 7

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.sum(SalesOrder.quantity).label("annual_demand"),
        )
        .join(
            SalesOrder,
            Product.id == SalesOrder.product_id,
        )
        .group_by(
            Product.id,
            Product.product_name,
        )
        .all()
    )

    response = []

    for row in results:

        average_daily_demand = row.annual_demand / 365

        safety_stock = average_daily_demand * LEAD_TIME_DAYS

        response.append(
            SafetyStockResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                average_daily_demand=round(
                    average_daily_demand,
                    2,
                ),
                safety_stock=round(
                    safety_stock,
                    2,
                ),
            )
        )

    return response