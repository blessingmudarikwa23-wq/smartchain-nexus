from pydantic import BaseModel


class ProductCreate(BaseModel):
    product_name: str
    sku: str
    category: str
    unit_price: float
    quantity_in_stock: int = 0


class ProductResponse(BaseModel):
    id: int
    product_name: str
    sku: str
    category: str
    unit_price: float
    quantity_in_stock: int

    class Config:
        from_attributes = True