from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.sales_order import SalesOrder
from backend.app.schemas.xyz_analysis import (
    XYZAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/xyz-analysis",
    tags=["XYZ Analysis"],
)


# ==========================================
# XYZ Analysis
# ==========================================
@router.get("/", response_model=list[XYZAnalysisResponse])
def get_xyz_analysis(
    db: Session = Depends(get_db),
):

    results = (
        db.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.sum(SalesOrder.quantity).label("quantity_sold"),
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

    response = []

    for row in results:

        quantity = row.quantity_sold

        if quantity >= 100:
            category = "X"
        elif quantity >= 50:
            category = "Y"
        else:
            category = "Z"

        response.append(
            XYZAnalysisResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                quantity_sold=quantity,
                category=category,
            )
        )

    return response