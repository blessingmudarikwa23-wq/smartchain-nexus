from pydantic import BaseModel


class LowStockItem(BaseModel):
    product_id: int
    product_name: str
    current_quantity: int

    class Config:
        from_attributes = True