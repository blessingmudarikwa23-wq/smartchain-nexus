from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.supplier import Supplier
from backend.app.schemas.procurement_cost_analysis import (
    ProcurementCostAnalysisResponse,
)

router = APIRouter(
    prefix="/analytics/procurement-cost-analysis",
    tags=["Procurement Cost Analysis"],
)


@router.get("/", response_model=list[ProcurementCostAnalysisResponse])
def get_procurement_cost_analysis(
    db: Session = Depends(get_db),
):
    results = (
        db.query(
            Supplier.id.label("supplier_id"),
            Supplier.company_name.label("supplier_name"),
            func.count(PurchaseOrder.id).label("purchase_orders"),
            func.coalesce(
                func.sum(
                    PurchaseOrder.quantity * PurchaseOrder.unit_price
                ),
                0,
            ).label("total_cost"),
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
        response.append(
            ProcurementCostAnalysisResponse(
                supplier_id=row.supplier_id,
                supplier_name=row.supplier_name,
                total_purchase_orders=row.purchase_orders,
                total_procurement_cost=float(row.total_cost),
            )
        )

    return response