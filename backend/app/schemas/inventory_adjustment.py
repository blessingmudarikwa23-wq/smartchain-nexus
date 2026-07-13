from pydantic import BaseModel
from datetime import datetime


class InventoryAdjustmentCreate(BaseModel):
    product_id: int
    quantity: int
    adjustment_type: str
    reason: str


class InventoryAdjustmentResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    adjustment_type: str
    reason: str
    created_at: datetime

    class Config:
        from_attributes = True