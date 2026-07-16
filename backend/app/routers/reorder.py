from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory import Inventory
from backend.app.models.product import Product
from backend.app.schemas.reorder import ReorderRecommendation

router = APIRouter(
    prefix="/reorder",
    tags=["Reorder Recommendations"]
)

# Business Rules
REORDER_LEVEL = 10
TARGET_STOCK = 50


@router.get("/", response_model=list[ReorderRecommendation])
def get_reorder_recommendations(
    db: Session = Depends(get_db)
):

    inventory_items = db.query(Inventory).all()

    recommendations = []

    for item in inventory_items:

        if item.quantity <= REORDER_LEVEL:

            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if product:

                recommendations.append(
                    ReorderRecommendation(
                        product_id=product.id,
                        product_name=product.name,
                        current_stock=item.quantity,
                        recommended_order=TARGET_STOCK - item.quantity,
                        reorder_level=REORDER_LEVEL,
                    )
                )

    return recommendations