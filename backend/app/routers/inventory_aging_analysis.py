from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.schemas.inventory_aging_analysis import (
    InventoryAgingAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/inventory-aging-analysis",
    tags=["Inventory Aging Analysis"],
)


@router.get("/", response_model=list[InventoryAgingAnalysisResponse])
def get_inventory_aging_analysis(
    db: Session = Depends(get_db),
):
    products = db.query(Product).all()

    response = []

    for product in products:
        quantity = product.quantity_in_stock

        if quantity <= 10:
            aging = "Fast Moving"
        elif quantity <= 50:
            aging = "Normal Stock"
        elif quantity <= 100:
            aging = "Slow Moving"
        else:
            aging = "Overstock"

        response.append(
            InventoryAgingAnalysisResponse(
                product_id=product.id,
                product_name=product.product_name,
                quantity_in_stock=quantity,
                aging_category=aging,
            )
        )

    return response