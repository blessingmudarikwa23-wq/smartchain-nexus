from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.demand_forecasting import (
    DemandForecastResponse,
)

router = APIRouter(
    prefix="/analytics/demand-forecasting",
    tags=["Demand Forecasting Analytics"],
)


@router.get("/", response_model=list[DemandForecastResponse])
def get_demand_forecast(
    db: Session = Depends(get_db),
):

    GROWTH_FACTOR = 1.10

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.sum(SalesOrder.quantity).label("historical_demand"),
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

        forecasted_demand = row.historical_demand * GROWTH_FACTOR

        response.append(
            DemandForecastResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                historical_demand=row.historical_demand,
                forecasted_demand=round(
                    forecasted_demand,
                    2,
                ),
            )
        )

    return response