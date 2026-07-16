from pydantic import BaseModel


class SafetyStockResponse(BaseModel):
    product_id: int
    product_name: str
    average_daily_demand: float
    safety_stock: float