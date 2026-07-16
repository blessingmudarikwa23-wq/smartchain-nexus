from pydantic import BaseModel


class AIInsightResponse(BaseModel):
    category: str
    insight: str
    recommendation: str