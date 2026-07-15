from math import sqrt

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.eoq import EOQResponse

router = APIRouter(
    prefix="/analytics/eoq",
    tags=["EOQ Analytics"],
)


# ==========================================
# Economic Order Quantity (EOQ)
# ==========================================
@router.get("/", response_model=list[EOQResponse])
def get_eoq(
    db: Session = Depends(get_db),
):

    ORDERING_COST = 100
    HOLDING_COST = 10

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

        demand = row.annual_demand

        eoq = sqrt(
            (2 * demand * ORDERING_COST)
            / HOLDING_COST
        )

        response.append(
            EOQResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                annual_demand=demand,
                economic_order_quantity=round(
                    eoq,
                    2,
                ),
            )
        )

    return response