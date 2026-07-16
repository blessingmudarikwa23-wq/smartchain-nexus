from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory import Inventory
from backend.app.models.product import Product
from backend.app.schemas.low_stock import LowStockItem

router = APIRouter(
    prefix="/low-stock",
    tags=["Low Stock Alerts"]
)


@router.get("/", response_model=list[LowStockItem])
def get_low_stock_items(
    db: Session = Depends(get_db)
):

    inventory_items = (
        db.query(Inventory)
        .filter(Inventory.quantity <= 10)
        .all()
    )

    results = []

    for item in inventory_items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if product:
            results.append(
                LowStockItem(
                    product_id=product.id,
                    product_name=product.name,
                    current_quantity=item.quantity,
                )
            )

    return results