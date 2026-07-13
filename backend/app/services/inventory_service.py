from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.app.models.inventory import Inventory
from backend.app.models.inventory_transaction import InventoryTransaction


def reduce_inventory(
    db: Session,
    product_id: int,
    quantity: int,
    reason: str = "Sales Dispatch",
):
    inventory = (
        db.query(Inventory)
        .filter(Inventory.product_id == product_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found."
        )

    if inventory.quantity < quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock available."
        )

    inventory.quantity -= quantity

    transaction = InventoryTransaction(
        product_id=product_id,
        transaction_type="STOCK_OUT",
        quantity=quantity,
        reason=reason,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction