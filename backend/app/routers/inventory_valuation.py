from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.inventory import Inventory
from backend.app.schemas.inventory_valuation import (
    InventoryValuationResponse,
)

router = APIRouter(
    prefix="/analytics/inventory-valuation",
    tags=["Inventory Valuation Analytics"],
)


@router.get("/", response_model=list[InventoryValuationResponse])
def get_inventory_valuation(
    db: Session = Depends(get_db),
):

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            Inventory.quantity.label("quantity_in_stock"),
            Product.unit_price.label("unit_cost"),
        )
        .join(
            Inventory,
            Product.id == Inventory.product_id,
        )
        .all()
    )

    response = []

    for row in results:

        inventory_value = (
            row.quantity_in_stock * row.unit_cost
        )

        response.append(
            InventoryValuationResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                quantity_in_stock=row.quantity_in_stock,
                unit_cost=round(
                    row.unit_cost,
                    2,
                ),
                inventory_value=round(
                    inventory_value,
                    2,
                ),
            )
        )

    return response