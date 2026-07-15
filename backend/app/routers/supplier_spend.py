from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.supplier import Supplier
from backend.app.schemas.supplier_spend import SupplierSpendResponse

router = APIRouter(
    prefix="/analytics/supplier-spend",
    tags=["Supplier Spend Analytics"],
)


@router.get("/", response_model=list[SupplierSpendResponse])
def get_supplier_spend(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Supplier.id.label("supplier_id"),
            Supplier.company_name.label("supplier_name"),
            func.count(PurchaseOrder.id).label("total_purchase_orders"),
            func.coalesce(
                func.sum(
                    PurchaseOrder.quantity * PurchaseOrder.unit_price
                ),
                0,
            ).label("total_spend"),
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
        SupplierSpendResponse(
            supplier_id=row.supplier_id,
            supplier_name=row.supplier_name,
            total_purchase_orders=row.total_purchase_orders,
            total_spend=float(row.total_spend),
        )
        for row in results
    ]