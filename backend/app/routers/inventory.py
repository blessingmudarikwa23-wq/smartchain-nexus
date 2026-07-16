from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inventory import Inventory
from backend.app.models.product import Product
from backend.app.schemas.inventory import InventoryCreate, InventoryResponse

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# ===========================
# Create Inventory
# ===========================
@router.post("/", response_model=InventoryResponse)
def create_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == inventory.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    existing_inventory = db.query(Inventory).filter(
        Inventory.product_id == inventory.product_id
    ).first()

    if existing_inventory:
        raise HTTPException(
            status_code=400,
            detail="Inventory already exists for this product."
        )

    new_inventory = Inventory(
        product_id=inventory.product_id,
        quantity=inventory.quantity,
        minimum_stock=inventory.minimum_stock
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)

    return new_inventory


# ===========================
# Get All Inventory
# ===========================
@router.get("/", response_model=list[InventoryResponse])
def get_inventory(db: Session = Depends(get_db)):
    return db.query(Inventory).all()


# ===========================
# Get Inventory by Product ID
# ===========================
@router.get("/{product_id}", response_model=InventoryResponse)
def get_inventory_by_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    inventory = db.query(Inventory).filter(
        Inventory.product_id == product_id
    ).first()

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found."
        )

    return inventory