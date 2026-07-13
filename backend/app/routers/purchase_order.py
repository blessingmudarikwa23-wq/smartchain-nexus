from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.product import Product
from backend.app.models.supplier import Supplier
from backend.app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderResponse,
)

router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"]
)


# ==========================================
# Create Purchase Order
# ==========================================
@router.post("/", response_model=PurchaseOrderResponse)
def create_purchase_order(
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):

    supplier = db.query(Supplier).filter(
        Supplier.id == purchase_order.supplier_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found."
        )

    product = db.query(Product).filter(
        Product.id == purchase_order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    new_order = PurchaseOrder(
        supplier_id=purchase_order.supplier_id,
        product_id=purchase_order.product_id,
        quantity=purchase_order.quantity,
        unit_price=purchase_order.unit_price,
        status="Pending"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


# ==========================================
# Get All Purchase Orders
# ==========================================
@router.get("/", response_model=list[PurchaseOrderResponse])
def get_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).all()


# ==========================================
# Get Purchase Order By ID
# ==========================================
@router.get("/{purchase_order_id}", response_model=PurchaseOrderResponse)
def get_purchase_order(
    purchase_order_id: int,
    db: Session = Depends(get_db)
):

    purchase_order = db.query(PurchaseOrder).filter(
        PurchaseOrder.id == purchase_order_id
    ).first()

    if not purchase_order:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found."
        )

    return purchase_order