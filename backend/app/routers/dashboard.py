from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db

from backend.app.models.product import Product
from backend.app.models.customer import Customer
from backend.app.models.supplier import Supplier
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.sales_order import SalesOrder
from backend.app.models.inventory import Inventory
from backend.app.models.inventory_adjustment import InventoryAdjustment
from backend.app.models.inventory_transaction import InventoryTransaction

from backend.app.schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):

    total_products = db.query(Product).count()

    total_customers = db.query(Customer).count()

    total_suppliers = db.query(Supplier).count()

    total_purchase_orders = db.query(PurchaseOrder).count()

    total_sales_orders = db.query(SalesOrder).count()

    total_inventory_items = db.query(Inventory).count()

    low_stock_items = (
        db.query(Inventory)
        .filter(Inventory.quantity <= 10)
        .count()
    )

    total_inventory_adjustments = (
        db.query(InventoryAdjustment).count()
    )

    total_inventory_transactions = (
        db.query(InventoryTransaction).count()
    )

    return DashboardResponse(
        total_products=total_products,
        total_customers=total_customers,
        total_suppliers=total_suppliers,
        total_purchase_orders=total_purchase_orders,
        total_sales_orders=total_sales_orders,
        total_inventory_items=total_inventory_items,
        low_stock_items=low_stock_items,
        total_inventory_adjustments=total_inventory_adjustments,
        total_inventory_transactions=total_inventory_transactions,
    )