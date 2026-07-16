from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.inventory import Inventory
from backend.app.models.inventory_transaction import InventoryTransaction
from backend.app.schemas.inventory_transaction import (
    InventoryTransactionCreate,
    InventoryTransactionResponse,
)

router = APIRouter(
    prefix="/inventory-transactions",
    tags=["Inventory Transactions"]
)


# ==================================
# Create Inventory Transaction
# ==================================
@router.post("/", response_model=InventoryTransactionResponse)
def create_inventory_transaction(
    transaction: InventoryTransactionCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == transaction.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    inventory = db.query(Inventory).filter(
        Inventory.product_id == transaction.product_id
    ).first()

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found."
        )

    if transaction.transaction_type.upper() == "STOCK_IN":
        inventory.quantity += transaction.quantity

    elif transaction.transaction_type.upper() == "STOCK_OUT":

        if inventory.quantity < transaction.quantity:
            raise HTTPException(
                status_code=400,
                detail="Insufficient stock."
            )

        inventory.quantity -= transaction.quantity

    else:
        raise HTTPException(
            status_code=400,
            detail="Transaction type must be STOCK_IN or STOCK_OUT."
        )

    new_transaction = InventoryTransaction(
        product_id=transaction.product_id,
        transaction_type=transaction.transaction_type.upper(),
        quantity=transaction.quantity,
        reason=transaction.reason
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


# ==================================
# Get All Transactions
# ==================================
@router.get("/", response_model=list[InventoryTransactionResponse])
def get_inventory_transactions(db: Session = Depends(get_db)):
    return db.query(InventoryTransaction).all()


# ==================================
# Get Transaction By ID
# ==================================
@router.get("/{transaction_id}", response_model=InventoryTransactionResponse)
def get_inventory_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = db.query(InventoryTransaction).filter(
        InventoryTransaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found."
        )

    return transaction