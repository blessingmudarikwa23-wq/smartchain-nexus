from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.customer import Customer
from backend.app.models.supplier import Supplier
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.sales_order import SalesOrder
from backend.app.models.inventory import Inventory
from backend.app.schemas.executive_kpi_summary import (
    ExecutiveKPISummaryResponse,
)

router = APIRouter(
    prefix="/analytics/executive-kpi-summary",
    tags=["Executive KPI Summary"],
)


@router.get("/", response_model=ExecutiveKPISummaryResponse)
def get_executive_kpi_summary(
    db: Session = Depends(get_db),
):
    return ExecutiveKPISummaryResponse(
        total_products=db.query(func.count(Product.id)).scalar() or 0,
        total_customers=db.query(func.count(Customer.id)).scalar() or 0,
        total_suppliers=db.query(func.count(Supplier.id)).scalar() or 0,
        total_purchase_orders=db.query(func.count(PurchaseOrder.id)).scalar() or 0,
        total_sales_orders=db.query(func.count(SalesOrder.id)).scalar() or 0,
        total_inventory_items=db.query(func.count(Inventory.id)).scalar() or 0,
    )