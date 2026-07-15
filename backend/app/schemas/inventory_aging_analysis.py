from pydantic import BaseModel


class InventoryAgingAnalysisResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_in_stock: int
    aging_category: str