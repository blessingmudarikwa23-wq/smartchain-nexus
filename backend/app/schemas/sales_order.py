from pydantic import BaseModel


class SalesOrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int
    unit_price: float


class SalesOrderResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    unit_price: float
    status: str

    class Config:
        from_attributes = True