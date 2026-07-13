from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate, ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# ===========================
# Create Product
# ===========================
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


# ===========================
# Get All Products
# ===========================
@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


# ===========================
# Get Product by ID
# ===========================
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    return product


# ===========================
# Update Product
# ===========================
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    db_product.product_name = product.product_name
    db_product.sku = product.sku
    db_product.category = product.category
    db_product.unit_price = product.unit_price
    db_product.quantity_in_stock = product.quantity_in_stock

    db.commit()
    db.refresh(db_product)

    return db_product


# ===========================
# Delete Product
# ===========================
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully."
    }