from pydantic import BaseModel


class StockoutFrequencyAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    stockout_count: int