from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory import Inventory
from backend.app.models.product import Product
from backend.app.schemas.ai_insights import AIInsightResponse

router = APIRouter(
    prefix="/analytics/ai-insights",
    tags=["AI Insights & Recommendation Engine"],
)


@router.get("/", response_model=list[AIInsightResponse])
def get_ai_insights(
    db: Session = Depends(get_db),
):
    insights = []

    low_stock_items = (
        db.query(Inventory)
        .filter(Inventory.quantity <= Inventory.minimum_stock)
        .count()
    )

    if low_stock_items > 0:
        insights.append(
            AIInsightResponse(
                category="Inventory",
                insight=f"{low_stock_items} product(s) are below the minimum stock level.",
                recommendation="Replenish inventory to avoid stock shortages.",
            )
        )

    total_products = db.query(Product).count()

    if total_products == 0:
        insights.append(
            AIInsightResponse(
                category="Products",
                insight="No products have been registered in the system.",
                recommendation="Add products before processing inventory or sales.",
            )
        )

    if not insights:
        insights.append(
            AIInsightResponse(
                category="System",
                insight="No critical issues detected.",
                recommendation="Operations are running normally. Continue monitoring KPIs.",
            )
        )

    return insights