from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.db.database import get_db
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.sales_analytics import (
    SalesAnalyticsResponse,
)

router = APIRouter(
    prefix="/analytics/sales",
    tags=["Sales Analytics"]
)


@router.get("/", response_model=SalesAnalyticsResponse)
def get_sales_analytics(
    db: Session = Depends(get_db)
):

    total_sales_orders = db.query(SalesOrder).count()

    total_revenue = (
        db.query(
            func.sum(
                SalesOrder.quantity * SalesOrder.unit_price
            )
        ).scalar()
        or 0
    )

    average_order_value = (
        total_revenue / total_sales_orders
        if total_sales_orders > 0
        else 0
    )

    highest_sale = (
        db.query(
            func.max(
                SalesOrder.quantity * SalesOrder.unit_price
            )
        ).scalar()
        or 0
    )

    lowest_sale = (
        db.query(
            func.min(
                SalesOrder.quantity * SalesOrder.unit_price
            )
        ).scalar()
        or 0
    )

    return SalesAnalyticsResponse(
        total_sales_orders=total_sales_orders,
        total_revenue=total_revenue,
        average_order_value=average_order_value,
        highest_sale=highest_sale,
        lowest_sale=lowest_sale,
    )