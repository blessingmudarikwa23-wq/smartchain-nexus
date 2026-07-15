from pydantic import BaseModel


class CustomerPurchaseAnalysisResponse(BaseModel):
    customer_id: int
    customer_name: str
    total_orders: int
    total_quantity: int