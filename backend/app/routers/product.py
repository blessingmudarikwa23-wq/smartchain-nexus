from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate, ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    existing_product = db.query(Product).filter(Product.sku == product.sku).first()

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists."
        )

    new_product = Product(
        product_name=product.product_name,
        sku=product.sku,
        category=product.category,
        unit_price=product.unit_price,
        quantity_in_stock=product.quantity_in_stock
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    return product