from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory import Inventory
from backend.app.models.product import Product
from backend.app.schemas.overstock_analysis import (
    OverstockAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/overstock-analysis",
    tags=["Overstock Analysis Analytics"],
)


@router.get("/", response_model=list[OverstockAnalysisResponse])
def get_overstock_analysis(
    db: Session = Depends(get_db),
):

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            Inventory.quantity.label("quantity_in_stock"),
        )
        .join(
            Inventory,
            Product.id == Inventory.product_id,
        )
        .all()
    )

    response = []

    for row in results:

        # Temporary threshold
        reorder_level = 100

        overstock = row.quantity_in_stock > (reorder_level * 3)

        response.append(
            OverstockAnalysisResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                quantity_in_stock=row.quantity_in_stock,
                reorder_level=reorder_level,
                overstock=overstock,
            )
        )

    return response