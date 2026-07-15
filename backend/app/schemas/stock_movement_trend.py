from pydantic import BaseModel


class StockMovementTrendResponse(BaseModel):
    product_id: int
    product_name: str
    total_stock_in: int
    total_stock_out: int
    net_stock_movement: int