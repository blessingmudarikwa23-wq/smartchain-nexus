from pydantic import BaseModel


class ABCAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    annual_consumption_value: float
    category: str