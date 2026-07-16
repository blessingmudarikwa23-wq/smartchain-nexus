from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.sales_revenue_analysis import (
    SalesRevenueAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/sales-revenue-analysis",
    tags=["Sales Revenue Analysis"],
)


@router.get("/", response_model=list[SalesRevenueAnalysisResponse])
def get_sales_revenue_analysis(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.coalesce(
                func.sum(SalesOrder.quantity),
                0,
            ).label("total_quantity_sold"),
            func.coalesce(
                func.sum(
                    SalesOrder.quantity * SalesOrder.unit_price
                ),
                0,
            ).label("total_revenue"),
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

    return [
        SalesRevenueAnalysisResponse(
            product_id=row.product_id,
            product_name=row.product_name,
            total_quantity_sold=row.total_quantity_sold,
            total_revenue=float(row.total_revenue),
        )
        for row in results
    ]