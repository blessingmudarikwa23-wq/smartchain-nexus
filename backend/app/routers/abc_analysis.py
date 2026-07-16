from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.abc_analysis import (
    ABCAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/abc-analysis",
    tags=["ABC Analysis"],
)


# ==========================================
# ABC Analysis
# ==========================================
@router.get("/", response_model=list[ABCAnalysisResponse])
def get_abc_analysis(
    db: Session = Depends(get_db),
):

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.sum(
                SalesOrder.quantity * SalesOrder.unit_price
            ).label("annual_consumption_value"),
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
            func.sum(
                SalesOrder.quantity * SalesOrder.unit_price
            ).desc()
        )
        .all()
    )

    response = []

    for row in results:

        value = float(row.annual_consumption_value)

        if value >= 10000:
            category = "A"
        elif value >= 5000:
            category = "B"
        else:
            category = "C"

        response.append(
            ABCAnalysisResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                annual_consumption_value=value,
                category=category,
            )
        )

    return response