from pydantic import BaseModel


class OrderFulfillmentAnalysisResponse(BaseModel):
    total_orders: int
    completed_orders: int
    pending_orders: int
    fulfillment_rate: float