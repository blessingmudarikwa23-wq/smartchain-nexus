from pydantic import BaseModel


class SupplierPerformanceResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    total_purchase_orders: int