from pydantic import BaseModel


class ProfitMarginAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    revenue: float
    estimated_cost: float
    profit: float
    profit_margin_percent: float