from pydantic import BaseModel


class LeadTimeResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    total_purchase_orders: int
    average_lead_time_days: float