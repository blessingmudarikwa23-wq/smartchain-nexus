from pydantic import BaseModel


class SlowMovingInventoryResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_in_stock: int
    units_sold: int
    slow_moving: bool