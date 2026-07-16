from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.top_products import TopProductResponse

router = APIRouter(
    prefix="/analytics/top-products",
    tags=["Top Products Analytics"],
)


# ==========================================
# Top Products Analytics
# ==========================================
@router.get("/", response_model=list[TopProductResponse])
def get_top_products(
    db: Session = Depends(get_db)
):

    top_products = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.sum(SalesOrder.quantity).label("units_sold"),
            func.sum(
                SalesOrder.quantity * SalesOrder.unit_price
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
        .order_by(
            func.sum(SalesOrder.quantity).desc()
        )
        .all()
    )

    return [
        TopProductResponse(
            product_id=row.product_id,
            product_name=row.product_name,
            units_sold=row.units_sold,
            revenue=float(row.revenue),
        )
        for row in top_products
    ]