from fastapi import APIRouter, Depends
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory_transaction import InventoryTransaction
from backend.app.models.product import Product
from backend.app.schemas.stock_movement_trend import (
    StockMovementTrendResponse,
)

router = APIRouter(
    prefix="/analytics/stock-movement-trend",
    tags=["Stock Movement Trend"],
)


@router.get("/", response_model=list[StockMovementTrendResponse])
def get_stock_movement_trend(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            InventoryTransaction.transaction_type == "IN",
                            InventoryTransaction.quantity,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("stock_in"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            InventoryTransaction.transaction_type == "OUT",
                            InventoryTransaction.quantity,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("stock_out"),
        )
        .join(
            InventoryTransaction,
            Product.id == InventoryTransaction.product_id,
        )
        .group_by(
            Product.id,
            Product.product_name,
        )
        .all()
    )

    response = []

    for row in results:
        response.append(
            StockMovementTrendResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                total_stock_in=row.stock_in,
                total_stock_out=row.stock_out,
                net_stock_movement=row.stock_in - row.stock_out,
            )
        )

    return response