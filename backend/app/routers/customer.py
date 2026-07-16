from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.customer import Customer
from backend.app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# ==========================================
# Create Customer
# ==========================================
@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Customer email already exists."
        )

    new_customer = Customer(
        customer_name=customer.customer_name,
        email=customer.email,
        phone=customer.phone,
        address=customer.address
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


# ==========================================
# Get All Customers
# ==========================================
@router.get("/", response_model=list[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()


# ==========================================
# Get Customer By ID
# ==========================================
@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return customer


# ==========================================
# Update Customer
# ==========================================
@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    db_customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not db_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    db_customer.customer_name = customer.customer_name
    db_customer.email = customer.email
    db_customer.phone = customer.phone
    db_customer.address = customer.address

    db.commit()
    db.refresh(db_customer)

    return db_customer


# ==========================================
# Delete Customer
# ==========================================
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully."
    }