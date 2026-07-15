from pydantic import BaseModel


class WarehouseUtilizationResponse(BaseModel):
    total_capacity: int
    used_capacity: int
    available_capacity: int
    utilization_percent: float