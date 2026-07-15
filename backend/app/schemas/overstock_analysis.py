from pydantic import BaseModel


class OverstockAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_in_stock: int
    reorder_level: int
    overstock: bool