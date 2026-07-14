from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.supplier import Supplier
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.schemas.lead_time import LeadTimeResponse

router = APIRouter(
    prefix="/analytics/lead-time",
    tags=["Lead Time Analytics"],
)


@router.get("/", response_model=list[LeadTimeResponse])
def get_lead_time(db: Session = Depends(get_db)):

    results = (
        db.query(
            Supplier.id.label("supplier_id"),
            Supplier.company_name.label("supplier_name"),
            func.count(PurchaseOrder.id).label("total_purchase_orders"),
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
        LeadTimeResponse(
            supplier_id=row.supplier_id,
            supplier_name=row.supplier_name,
            total_purchase_orders=row.total_purchase_orders,
            average_lead_time_days=0.0,
        )
        for row in results
    ]