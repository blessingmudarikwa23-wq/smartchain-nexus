from pydantic import BaseModel
from datetime import datetime


class InventoryTransactionCreate(BaseModel):
    product_id: int
    transaction_type: str
    quantity: int
    reason: str


class InventoryTransactionResponse(BaseModel):
    id: int
    product_id: int
    transaction_type: str
    quantity: int
    reason: str
    created_at: datetime

    class Config:
        from_attributes = True