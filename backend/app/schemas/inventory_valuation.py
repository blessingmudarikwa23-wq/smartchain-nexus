from pydantic import BaseModel


class InventoryValuationResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_in_stock: int
    unit_cost: float
    inventory_value: float