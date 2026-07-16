from pydantic import BaseModel


class SupplierPurchaseTrendResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    total_purchase_orders: int
    total_quantity_ordered: int