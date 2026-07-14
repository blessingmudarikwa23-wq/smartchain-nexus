from pydantic import BaseModel


class InventoryTurnoverResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_sold: int