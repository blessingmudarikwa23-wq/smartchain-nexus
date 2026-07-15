from pydantic import BaseModel


class SalesRevenueAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    total_quantity_sold: int
    total_revenue: float