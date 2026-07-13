from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.supplier import Supplier
from backend.app.schemas.supplier import SupplierCreate, SupplierResponse

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)


# ===========================
# Create Supplier
# ===========================
@router.post("/", response_model=SupplierResponse)
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):

    existing_supplier = db.query(Supplier).filter(
        Supplier.email == supplier.email
    ).first()

    if existing_supplier:
        raise HTTPException(
            status_code=400,
            detail="Supplier email already exists."
        )

    new_supplier = Supplier(
        company_name=supplier.company_name,
        contact_person=supplier.contact_person,
        email=supplier.email,
        phone=supplier.phone,
        address=supplier.address
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return new_supplier


# ===========================
# Get All Suppliers
# ===========================
@router.get("/", response_model=list[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()


# ===========================
# Get Supplier By ID
# ===========================
@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found."
        )

    return supplier


# ===========================
# Update Supplier
# ===========================
@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(
    supplier_id: int,
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):

    db_supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()

    if not db_supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found."
        )

    db_supplier.company_name = supplier.company_name
    db_supplier.contact_person = supplier.contact_person
    db_supplier.email = supplier.email
    db_supplier.phone = supplier.phone
    db_supplier.address = supplier.address

    db.commit()
    db.refresh(db_supplier)

    return db_supplier


# ===========================
# Delete Supplier
# ===========================
@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found."
        )

    db.delete(supplier)
    db.commit()

    return {
        "message": "Supplier deleted successfully."
    }