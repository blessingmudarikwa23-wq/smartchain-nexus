from pydantic import BaseModel


class DeadStockResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_in_stock: int
    units_sold: int
    dead_stock: bool