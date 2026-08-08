from pydantic import BaseModel


class AISupplyChainAssistant(BaseModel):
    message: str


class PredictiveAnalytics(BaseModel):
    prediction: str
    confidence: float


class IntelligentRecommendation(BaseModel):
    title: str
    recommendation: str


class NaturalLanguageQuery(BaseModel):
    question: str
    answer: str


class ArtificialIntelligenceDashboard(BaseModel):
    assistant: AISupplyChainAssistant
    predictive_analytics: list[PredictiveAnalytics]
    recommendations: list[IntelligentRecommendation]
    natural_language_queries: list[NaturalLanguageQuery]
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================================
# ARTIFICIAL INTELLIGENCE
# ==========================================================

# ==========================================================
# AI SUPPLY CHAIN ASSISTANT
# ==========================================================

class AISupplyChainAssistant(BaseModel):
    message: str


# ==========================================================
# PREDICTIVE ANALYTICS
# ==========================================================

class PredictiveAnalytics(BaseModel):
    prediction: str
    confidence: float


# ==========================================================
# INTELLIGENT RECOMMENDATIONS
# ==========================================================

class IntelligentRecommendation(BaseModel):
    title: str
    recommendation: str


# ==========================================================
# NATURAL LANGUAGE QUERIES
# ==========================================================

class NaturalLanguageQuery(BaseModel):
    question: str
    answer: str


# ==========================================================
# ARTIFICIAL INTELLIGENCE DASHBOARD
# ==========================================================

class ArtificialIntelligenceDashboard(BaseModel):
    assistant: AISupplyChainAssistant
    predictive_analytics: list[PredictiveAnalytics]
    recommendations: list[IntelligentRecommendation]
    natural_language_queries: list[NaturalLanguageQuery]


# ==========================================================
# AI SUPPLY CHAIN ASSISTANT DATABASE SCHEMAS
# ==========================================================

class AISupplyChainAssistantBase(BaseModel):
    query: str
    response: str
    category: str

    confidence_score: float = 0.0

    status: str = "Active"


# ==========================================================
# AI SUPPLY CHAIN ASSISTANT CREATE
# ==========================================================

class AISupplyChainAssistantCreate(
    AISupplyChainAssistantBase
):
    pass


# ==========================================================
# AI SUPPLY CHAIN ASSISTANT UPDATE
# ==========================================================

class AISupplyChainAssistantUpdate(BaseModel):
    query: Optional[str] = None
    response: Optional[str] = None
    category: Optional[str] = None

    confidence_score: Optional[float] = None

    status: Optional[str] = None


# ==========================================================
# AI SUPPLY CHAIN ASSISTANT RESPONSE
# ==========================================================

class AISupplyChainAssistantResponse(
    AISupplyChainAssistantBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
# ==========================================================
# PREDICTIVE ANALYTICS
# ==========================================================

class PredictiveAnalyticsBase(BaseModel):
    prediction: str
    confidence: float = 0.0
    category: str
    status: str = "Active"


# ==========================================================
# PREDICTIVE ANALYTICS CREATE
# ==========================================================

class PredictiveAnalyticsCreate(
    PredictiveAnalyticsBase
):
    pass


# ==========================================================
# PREDICTIVE ANALYTICS UPDATE
# ==========================================================

class PredictiveAnalyticsUpdate(BaseModel):
    prediction: Optional[str] = None
    confidence: Optional[float] = None
    category: Optional[str] = None
    status: Optional[str] = None


# ==========================================================
# PREDICTIVE ANALYTICS RESPONSE
# ==========================================================

class PredictiveAnalyticsResponse(
    PredictiveAnalyticsBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )

# ==========================================================
# INTELLIGENT RECOMMENDATIONS
# ==========================================================

class IntelligentRecommendationBase(BaseModel):
    title: str
    recommendation: str
    category: str
    status: str = "Active"


# ==========================================================
# INTELLIGENT RECOMMENDATION CREATE
# ==========================================================

class IntelligentRecommendationCreate(
    IntelligentRecommendationBase
):
    pass


# ==========================================================
# INTELLIGENT RECOMMENDATION UPDATE
# ==========================================================

class IntelligentRecommendationUpdate(BaseModel):
    title: Optional[str] = None
    recommendation: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None


# ==========================================================
# INTELLIGENT RECOMMENDATION RESPONSE
# ==========================================================

class IntelligentRecommendationResponse(
    IntelligentRecommendationBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )

# ==========================================================
# NATURAL LANGUAGE QUERIES
# ==========================================================

class NaturalLanguageQueryBase(BaseModel):
    question: str
    answer: str
    category: str
    status: str = "Active"


# ==========================================================
# NATURAL LANGUAGE QUERY CREATE
# ==========================================================

class NaturalLanguageQueryCreate(
    NaturalLanguageQueryBase
):
    pass


# ==========================================================
# NATURAL LANGUAGE QUERY UPDATE
# ==========================================================

class NaturalLanguageQueryUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None


# ==========================================================
# NATURAL LANGUAGE QUERY RESPONSE
# ==========================================================

class NaturalLanguageQueryResponse(
    NaturalLanguageQueryBase
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
