from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.reorder_point import (
    ReorderPointResponse,
)

router = APIRouter(
    prefix="/analytics/reorder-point",
    tags=["Reorder Point Analytics"],
)


@router.get("/", response_model=list[ReorderPointResponse])
def get_reorder_point(
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

        reorder_point = average_daily_demand * LEAD_TIME_DAYS

        response.append(
            ReorderPointResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                average_daily_demand=round(
                    average_daily_demand,
                    2,
                ),
                lead_time_days=LEAD_TIME_DAYS,
                reorder_point=round(
                    reorder_point,
                    2,
                ),
            )
        )

    return response