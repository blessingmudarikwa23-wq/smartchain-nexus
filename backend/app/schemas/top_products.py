from pydantic import BaseModel


class TopProductResponse(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float