from pydantic import BaseModel


class SupplierDeliveryReliabilityResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    total_purchase_orders: int
    completed_purchase_orders: int
    reliability_percentage: float