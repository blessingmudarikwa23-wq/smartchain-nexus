from pydantic import BaseModel
from datetime import datetime


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    product_id: int
    quantity: int
    unit_price: int


class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_id: int
    product_id: int
    quantity: int
    unit_price: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True