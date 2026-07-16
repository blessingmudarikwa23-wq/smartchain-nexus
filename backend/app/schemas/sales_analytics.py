from pydantic import BaseModel


class SalesAnalyticsResponse(BaseModel):
    total_sales_orders: int
    total_revenue: float
    average_order_value: float
    highest_sale: float
    lowest_sale: float