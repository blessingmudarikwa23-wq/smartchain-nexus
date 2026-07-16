from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.supplier import Supplier
from backend.app.schemas.supplier_purchase_trend import (
    SupplierPurchaseTrendResponse,
)

router = APIRouter(
    prefix="/analytics/supplier-purchase-trend",
    tags=["Supplier Purchase Trend"],
)


@router.get("/", response_model=list[SupplierPurchaseTrendResponse])
def get_supplier_purchase_trend(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Supplier.id.label("supplier_id"),
            Supplier.company_name.label("supplier_name"),
            func.count(PurchaseOrder.id).label("total_purchase_orders"),
            func.coalesce(
                func.sum(PurchaseOrder.quantity),
                0,
            ).label("total_quantity_ordered"),
        )
        .join(
            PurchaseOrder,
            Supplier.id == PurchaseOrder.supplier_id,
        )
        .group_by(
            Supplier.id,
            Supplier.company_name,
        )
        .all()
    )

    return [
        SupplierPurchaseTrendResponse(
            supplier_id=row.supplier_id,
            supplier_name=row.supplier_name,
            total_purchase_orders=row.total_purchase_orders,
            total_quantity_ordered=row.total_quantity_ordered,
        )
        for row in results
    ]