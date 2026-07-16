from pydantic import BaseModel


class ReorderPointResponse(BaseModel):
    product_id: int
    product_name: str
    average_daily_demand: float
    lead_time_days: int
    reorder_point: float