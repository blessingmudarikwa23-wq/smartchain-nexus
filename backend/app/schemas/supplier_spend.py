from pydantic import BaseModel


class SupplierSpendResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    total_purchase_orders: int
    total_spend: float