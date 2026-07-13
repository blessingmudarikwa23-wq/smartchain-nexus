from pydantic import BaseModel


class ReorderRecommendation(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    recommended_order: int
    reorder_level: int