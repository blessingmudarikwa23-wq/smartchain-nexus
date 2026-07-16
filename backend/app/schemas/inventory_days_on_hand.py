from pydantic import BaseModel


class InventoryDaysOnHandResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_in_stock: int
    average_daily_sales: float
    days_on_hand: float