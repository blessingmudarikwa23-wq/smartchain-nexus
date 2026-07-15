from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.order_fulfillment_analysis import (
    OrderFulfillmentAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/order-fulfillment-analysis",
    tags=["Order Fulfillment Analysis"],
)


@router.get("/", response_model=OrderFulfillmentAnalysisResponse)
def get_order_fulfillment_analysis(
    db: Session = Depends(get_db),
):
    total_orders = (
        db.query(func.count(SalesOrder.id)).scalar()
        or 0
    )

    completed_orders = (
        db.query(func.count(SalesOrder.id))
        .filter(SalesOrder.status == "Completed")
        .scalar()
        or 0
    )

    pending_orders = total_orders - completed_orders

    fulfillment_rate = (
        (completed_orders / total_orders) * 100
        if total_orders > 0
        else 0
    )

    return OrderFulfillmentAnalysisResponse(
        total_orders=total_orders,
        completed_orders=completed_orders,
        pending_orders=pending_orders,
        fulfillment_rate=round(fulfillment_rate, 2),
    )
    