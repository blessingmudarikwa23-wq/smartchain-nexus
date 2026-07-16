from pydantic import BaseModel


class EOQResponse(BaseModel):
    product_id: int
    product_name: str
    annual_demand: int
    economic_order_quantity: float