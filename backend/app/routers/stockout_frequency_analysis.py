from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.schemas.stockout_frequency_analysis import (
    StockoutFrequencyAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/stockout-frequency-analysis",
    tags=["Stockout Frequency Analysis"],
)


@router.get("/", response_model=list[StockoutFrequencyAnalysisResponse])
def get_stockout_frequency_analysis(
    db: Session = Depends(get_db),
):
    products = (
        db.query(Product)
        .all()
    )

    response = []

    for product in products:
        stockout_count = 1 if product.quantity_in_stock == 0 else 0

        response.append(
            StockoutFrequencyAnalysisResponse(
                product_id=product.id,
                product_name=product.product_name,
                stockout_count=stockout_count,
            )
        )

    return response