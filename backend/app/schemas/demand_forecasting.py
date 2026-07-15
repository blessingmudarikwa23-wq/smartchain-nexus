from pydantic import BaseModel


class DemandForecastResponse(BaseModel):
    product_id: int
    product_name: str
    historical_demand: int
    forecasted_demand: float