from pydantic import BaseModel


class ProcurementCostAnalysisResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    total_purchase_orders: int
    total_procurement_cost: float