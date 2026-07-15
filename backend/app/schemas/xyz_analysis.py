from pydantic import BaseModel


class XYZAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_sold: int
    category: str