from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.customer import Customer
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.customer_purchase_analysis import (
    CustomerPurchaseAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/customer-purchase-analysis",
    tags=["Customer Purchase Analysis"],
)


@router.get("/", response_model=list[CustomerPurchaseAnalysisResponse])
def get_customer_purchase_analysis(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Customer.id.label("customer_id"),
            Customer.customer_name.label("customer_name"),
            func.count(SalesOrder.id).label("total_orders"),
            func.coalesce(
                func.sum(SalesOrder.quantity),
                0,
            ).label("total_quantity"),
        )
        .join(
            SalesOrder,
            Customer.id == SalesOrder.customer_id,
        )
        .group_by(
            Customer.id,
            Customer.customer_name,
        )
        .all()
    )

    return [
        CustomerPurchaseAnalysisResponse(
            customer_id=row.customer_id,
            customer_name=row.customer_name,
            total_orders=row.total_orders,
            total_quantity=row.total_quantity,
        )
        for row in results
    ]