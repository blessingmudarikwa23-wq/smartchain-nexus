from pydantic import BaseModel


class InventoryCreate(BaseModel):
    product_id: int
    quantity: int
    minimum_stock: int = 10


class InventoryResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    minimum_stock: int

    class Config:
        from_attributes = True