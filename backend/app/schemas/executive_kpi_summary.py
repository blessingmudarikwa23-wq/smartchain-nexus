from pydantic import BaseModel


class ExecutiveKPISummaryResponse(BaseModel):
    total_products: int
    total_customers: int
    total_suppliers: int
    total_purchase_orders: int
    total_sales_orders: int
    total_inventory_items: int