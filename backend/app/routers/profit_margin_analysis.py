from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.profit_margin_analysis import (
    ProfitMarginAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/profit-margin-analysis",
    tags=["Profit Margin Analysis"],
)


@router.get("/", response_model=list[ProfitMarginAnalysisResponse])
def get_profit_margin_analysis(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.coalesce(
                func.sum(
                    SalesOrder.quantity * SalesOrder.unit_price
                ),
                0,
            ).label("revenue"),
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
        revenue = float(row.revenue)

        # Estimated cost = 70% of revenue
        estimated_cost = revenue * 0.70

        profit = revenue - estimated_cost

        profit_margin = (
            (profit / revenue) * 100
            if revenue > 0
            else 0
        )

        response.append(
            ProfitMarginAnalysisResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                revenue=revenue,
                estimated_cost=estimated_cost,
                profit=profit,
                profit_margin_percent=profit_margin,
            )
        )

    return response