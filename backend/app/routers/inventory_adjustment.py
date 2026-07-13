from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory_adjustment import InventoryAdjustment
from backend.app.models.inventory import Inventory
from backend.app.models.inventory_transaction import InventoryTransaction
from backend.app.schemas.inventory_adjustment import (
    InventoryAdjustmentCreate,
    InventoryAdjustmentResponse,
)

router = APIRouter(
    prefix="/inventory-adjustments",
    tags=["Inventory Adjustments"]
)


# ==========================================
# Create Inventory Adjustment
# ==========================================
@router.post("/", response_model=InventoryAdjustmentResponse)
def create_inventory_adjustment(
    adjustment: InventoryAdjustmentCreate,
    db: Session = Depends(get_db)
):

    inventory = db.query(Inventory).filter(
        Inventory.product_id == adjustment.product_id
    ).first()

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found."
        )

    if adjustment.adjustment_type == "INCREASE":
        inventory.quantity += adjustment.quantity

    elif adjustment.adjustment_type == "DECREASE":

        if inventory.quantity < adjustment.quantity:
            raise HTTPException(
                status_code=400,
                detail="Insufficient inventory."
            )

        inventory.quantity -= adjustment.quantity

    else:
        raise HTTPException(
            status_code=400,
            detail="Adjustment type must be INCREASE or DECREASE."
        )

    new_adjustment = InventoryAdjustment(
        product_id=adjustment.product_id,
        quantity=adjustment.quantity,
        adjustment_type=adjustment.adjustment_type,
        reason=adjustment.reason,
    )

    transaction = InventoryTransaction(
        product_id=adjustment.product_id,
        quantity=adjustment.quantity,
        transaction_type=adjustment.adjustment_type,
        reason=adjustment.reason,
    )

    db.add(new_adjustment)
    db.add(transaction)

    db.commit()

    db.refresh(new_adjustment)

    return new_adjustment


# ==========================================
# Get All Inventory Adjustments
# ==========================================
@router.get("/", response_model=list[InventoryAdjustmentResponse])
def get_inventory_adjustments(
    db: Session = Depends(get_db)
):
    return db.query(InventoryAdjustment).all()


# ==========================================
# Get Inventory Adjustment By ID
# ==========================================
@router.get("/{adjustment_id}", response_model=InventoryAdjustmentResponse)
def get_inventory_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db)
):

    adjustment = db.query(InventoryAdjustment).filter(
        InventoryAdjustment.id == adjustment_id
    ).first()

    if not adjustment:
        raise HTTPException(
            status_code=404,
            detail="Inventory adjustment not found."
        )

    return adjustment