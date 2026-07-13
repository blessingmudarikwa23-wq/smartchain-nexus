from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.sales_order import SalesOrder
from backend.app.models.customer import Customer
from backend.app.models.product import Product
from backend.app.schemas.sales_order import (
    SalesOrderCreate,
    SalesOrderResponse,
)
from backend.app.services.inventory_service import reduce_inventory

router = APIRouter(
    prefix="/sales-orders",
    tags=["Sales Orders"]
)


# ==========================================
# Create Sales Order
# ==========================================
@router.post("/", response_model=SalesOrderResponse)
def create_sales_order(
    sales_order: SalesOrderCreate,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == sales_order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    product = db.query(Product).filter(
        Product.id == sales_order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    new_order = SalesOrder(
        customer_id=sales_order.customer_id,
        product_id=sales_order.product_id,
        quantity=sales_order.quantity,
        unit_price=sales_order.unit_price,
        status="Pending"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


# ==========================================
# Get All Sales Orders
# ==========================================
@router.get("/", response_model=list[SalesOrderResponse])
def get_sales_orders(db: Session = Depends(get_db)):
    return db.query(SalesOrder).all()


# ==========================================
# Get Sales Order By ID
# ==========================================
@router.get("/{sales_order_id}", response_model=SalesOrderResponse)
def get_sales_order(
    sales_order_id: int,
    db: Session = Depends(get_db)
):

    sales_order = db.query(SalesOrder).filter(
        SalesOrder.id == sales_order_id
    ).first()

    if not sales_order:
        raise HTTPException(
            status_code=404,
            detail="Sales Order not found."
        )

    return sales_order


# ==========================================
# Update Sales Order
# ==========================================
@router.put("/{sales_order_id}", response_model=SalesOrderResponse)
def update_sales_order(
    sales_order_id: int,
    sales_order: SalesOrderCreate,
    db: Session = Depends(get_db)
):

    db_sales_order = db.query(SalesOrder).filter(
        SalesOrder.id == sales_order_id
    ).first()

    if not db_sales_order:
        raise HTTPException(
            status_code=404,
            detail="Sales Order not found."
        )

    db_sales_order.customer_id = sales_order.customer_id
    db_sales_order.product_id = sales_order.product_id
    db_sales_order.quantity = sales_order.quantity
    db_sales_order.unit_price = sales_order.unit_price

    db.commit()
    db.refresh(db_sales_order)

    return db_sales_order


# ==========================================
# Delete Sales Order
# ==========================================
@router.delete("/{sales_order_id}")
def delete_sales_order(
    sales_order_id: int,
    db: Session = Depends(get_db)
):

    sales_order = db.query(SalesOrder).filter(
        SalesOrder.id == sales_order_id
    ).first()

    if not sales_order:
        raise HTTPException(
            status_code=404,
            detail="Sales Order not found."
        )

    db.delete(sales_order)
    db.commit()

    return {
        "message": "Sales Order deleted successfully."
    }


# ==========================================
# Dispatch Sales Order
# ==========================================
@router.post("/{sales_order_id}/dispatch")
def dispatch_sales_order(
    sales_order_id: int,
    db: Session = Depends(get_db)
):

    sales_order = db.query(SalesOrder).filter(
        SalesOrder.id == sales_order_id
    ).first()

    if not sales_order:
        raise HTTPException(
            status_code=404,
            detail="Sales Order not found."
        )

    if sales_order.status == "Dispatched":
        raise HTTPException(
            status_code=400,
            detail="Sales Order already dispatched."
        )

    product = db.query(Product).filter(
        Product.id == sales_order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    reduce_inventory(
        db=db,
        product_id=sales_order.product_id,
        quantity=sales_order.quantity,
        reason=f"Sales Order #{sales_order.id}"
    )

    sales_order.status = "Dispatched"

    db.commit()
    db.refresh(sales_order)

    return {
        "message": "Sales Order dispatched successfully.",
        "sales_order": sales_order
    }