from fastapi import APIRouter, Depends
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.supplier import Supplier
from backend.app.schemas.supplier_delivery_reliability import (
    SupplierDeliveryReliabilityResponse,
)

router = APIRouter(
    prefix="/analytics/supplier-delivery-reliability",
    tags=["Supplier Delivery Reliability"],
)


@router.get("/", response_model=list[SupplierDeliveryReliabilityResponse])
def get_supplier_delivery_reliability(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Supplier.id.label("supplier_id"),
            Supplier.company_name.label("supplier_name"),
            func.count(PurchaseOrder.id).label("total_orders"),
            func.sum(
                case(
                    (PurchaseOrder.status == "Completed", 1),
                    else_=0,
                )
            ).label("completed_orders"),
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

    response = []

    for row in results:
        completed = row.completed_orders or 0
        total = row.total_orders or 0

        reliability = (
            (completed / total) * 100
            if total > 0
            else 0
        )

        response.append(
            SupplierDeliveryReliabilityResponse(
                supplier_id=row.supplier_id,
                supplier_name=row.supplier_name,
                total_purchase_orders=total,
                completed_purchase_orders=completed,
                reliability_percentage=round(reliability, 2),
            )
        )

    return response