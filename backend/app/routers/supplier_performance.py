from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.supplier import Supplier
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.schemas.supplier_performance import (
    SupplierPerformanceResponse,
)

router = APIRouter(
    prefix="/analytics/supplier-performance",
    tags=["Supplier Performance Analytics"],
)


# ==========================================
# Supplier Performance Analytics
# ==========================================
@router.get("/", response_model=list[SupplierPerformanceResponse])
def get_supplier_performance(
    db: Session = Depends(get_db),
):

    supplier_performance = (
        db.query(
            Supplier.id.label("supplier_id"),
            Supplier.company_name.label("supplier_name"),
            func.count(PurchaseOrder.id).label(
                "total_purchase_orders"
            ),
        )
        .join(
            PurchaseOrder,
            Supplier.id == PurchaseOrder.supplier_id,
        )
        .group_by(
            Supplier.id,
            Supplier.company_name,
        )
        .order_by(
            func.count(PurchaseOrder.id).desc()
        )
        .all()
    )

    return [
        SupplierPerformanceResponse(
            supplier_id=row.supplier_id,
            supplier_name=row.supplier_name,
            total_purchase_orders=row.total_purchase_orders,
        )
        for row in supplier_performance
    ]