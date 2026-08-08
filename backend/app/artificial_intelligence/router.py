from fastapi import APIRouter

from app.artificial_intelligence.service import get_ai_dashboard

router = APIRouter(
    prefix="/artificial-intelligence",
    tags=["Artificial Intelligence"],
)


@router.get("/dashboard")
def artificial_intelligence_dashboard():
    return get_ai_dashboard()
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.artificial_intelligence.service import (
    get_ai_dashboard,
    create_ai_supply_chain_assistant,
    get_ai_supply_chain_assistants,
    get_ai_supply_chain_assistant_by_id,
    update_ai_supply_chain_assistant,
    delete_ai_supply_chain_assistant,
)

from app.artificial_intelligence.schemas import (
    AISupplyChainAssistantCreate,
    AISupplyChainAssistantUpdate,
    AISupplyChainAssistantResponse,
)


# ==========================================================
# ARTIFICIAL INTELLIGENCE
# ==========================================================

router = APIRouter(
    prefix="/artificial-intelligence",
    tags=["Artificial Intelligence"],
)


# ==========================================================
# AI DASHBOARD
# ==========================================================

@router.get(
    "/dashboard",
)
def artificial_intelligence_dashboard():
    return get_ai_dashboard()


# ==========================================================
# AI SUPPLY CHAIN ASSISTANT
# ==========================================================

# ==========================================================
# CREATE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

@router.post(
    "/supply-chain-assistant",
    response_model=AISupplyChainAssistantResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_ai_supply_chain_assistant(
    payload: AISupplyChainAssistantCreate,
    db: Session = Depends(get_db),
):
    return create_ai_supply_chain_assistant(
        payload,
        db,
    )


# ==========================================================
# GET AI SUPPLY CHAIN ASSISTANTS
# ==========================================================

@router.get(
    "/supply-chain-assistant",
    response_model=list[AISupplyChainAssistantResponse],
)
def list_ai_supply_chain_assistants(
    db: Session = Depends(get_db),
):
    return get_ai_supply_chain_assistants(db)


# ==========================================================
# GET SINGLE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

@router.get(
    "/supply-chain-assistant/{assistant_id}",
    response_model=AISupplyChainAssistantResponse,
)
def retrieve_ai_supply_chain_assistant(
    assistant_id: int,
    db: Session = Depends(get_db),
):
    assistant = get_ai_supply_chain_assistant_by_id(
        assistant_id,
        db,
    )

    if assistant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Supply Chain Assistant not found.",
        )

    return assistant


# ==========================================================
# UPDATE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

@router.put(
    "/supply-chain-assistant/{assistant_id}",
    response_model=AISupplyChainAssistantResponse,
)
def edit_ai_supply_chain_assistant(
    assistant_id: int,
    payload: AISupplyChainAssistantUpdate,
    db: Session = Depends(get_db),
):
    assistant = update_ai_supply_chain_assistant(
        assistant_id,
        payload,
        db,
    )

    if assistant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Supply Chain Assistant not found.",
        )

    return assistant


# ==========================================================
# DELETE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

@router.delete(
    "/supply-chain-assistant/{assistant_id}",
)
def remove_ai_supply_chain_assistant(
    assistant_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_ai_supply_chain_assistant(
        assistant_id,
        db,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Supply Chain Assistant not found.",
        )

    return {
        "message": "AI Supply Chain Assistant deleted successfully.",
        "assistant_id": assistant_id,
    }

# ==========================================================
# PREDICTIVE ANALYTICS
# ==========================================================

from app.artificial_intelligence.schemas import (
    PredictiveAnalyticsCreate,
    PredictiveAnalyticsUpdate,
    PredictiveAnalyticsResponse,
)

from app.artificial_intelligence.service import (
    create_predictive_analytics,
    get_predictive_analytics,
    get_predictive_analytics_by_id,
    update_predictive_analytics,
    delete_predictive_analytics,
)


# ==========================================================
# CREATE PREDICTIVE ANALYTICS
# ==========================================================

@router.post(
    "/predictive-analytics",
    response_model=PredictiveAnalyticsResponse,
    status_code=201,
)
def add_predictive_analytics(
    payload: PredictiveAnalyticsCreate,
    db: Session = Depends(get_db),
):
    return create_predictive_analytics(
        payload,
        db,
    )


# ==========================================================
# GET PREDICTIVE ANALYTICS
# ==========================================================

@router.get(
    "/predictive-analytics",
    response_model=list[PredictiveAnalyticsResponse],
)
def list_predictive_analytics(
    db: Session = Depends(get_db),
):
    return get_predictive_analytics(db)


# ==========================================================
# GET SINGLE PREDICTIVE ANALYTICS
# ==========================================================

@router.get(
    "/predictive-analytics/{prediction_id}",
    response_model=PredictiveAnalyticsResponse,
)
def retrieve_predictive_analytics(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    prediction = get_predictive_analytics_by_id(
        prediction_id,
        db,
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Predictive Analytics not found.",
        )

    return prediction


# ==========================================================
# UPDATE PREDICTIVE ANALYTICS
# ==========================================================

@router.put(
    "/predictive-analytics/{prediction_id}",
    response_model=PredictiveAnalyticsResponse,
)
def edit_predictive_analytics(
    prediction_id: int,
    payload: PredictiveAnalyticsUpdate,
    db: Session = Depends(get_db),
):
    prediction = update_predictive_analytics(
        prediction_id,
        payload,
        db,
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Predictive Analytics not found.",
        )

    return prediction


# ==========================================================
# DELETE PREDICTIVE ANALYTICS
# ==========================================================

@router.delete(
    "/predictive-analytics/{prediction_id}",
)
def remove_predictive_analytics(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_predictive_analytics(
        prediction_id,
        db,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Predictive Analytics not found.",
        )

    return {
        "message": "Predictive Analytics deleted successfully."
    }

# ==========================================================
# INTELLIGENT RECOMMENDATIONS
# ==========================================================

from app.artificial_intelligence.schemas import (
    IntelligentRecommendationCreate,
    IntelligentRecommendationUpdate,
    IntelligentRecommendationResponse,
)

from app.artificial_intelligence.service import (
    create_intelligent_recommendation,
    get_intelligent_recommendations,
    get_intelligent_recommendation_by_id,
    update_intelligent_recommendation,
    delete_intelligent_recommendation,
)


# ==========================================================
# CREATE INTELLIGENT RECOMMENDATION
# ==========================================================

@router.post(
    "/intelligent-recommendations",
    response_model=IntelligentRecommendationResponse,
    status_code=201,
)
def add_intelligent_recommendation(
    payload: IntelligentRecommendationCreate,
    db: Session = Depends(get_db),
):
    return create_intelligent_recommendation(
        payload,
        db,
    )


# ==========================================================
# GET INTELLIGENT RECOMMENDATIONS
# ==========================================================

@router.get(
    "/intelligent-recommendations",
    response_model=list[IntelligentRecommendationResponse],
)
def list_intelligent_recommendations(
    db: Session = Depends(get_db),
):
    return get_intelligent_recommendations(db)


# ==========================================================
# GET INTELLIGENT RECOMMENDATION BY ID
# ==========================================================

@router.get(
    "/intelligent-recommendations/{recommendation_id}",
    response_model=IntelligentRecommendationResponse,
)
def retrieve_intelligent_recommendation(
    recommendation_id: int,
    db: Session = Depends(get_db),
):
    recommendation = get_intelligent_recommendation_by_id(
        recommendation_id,
        db,
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Intelligent recommendation not found.",
        )

    return recommendation


# ==========================================================
# UPDATE INTELLIGENT RECOMMENDATION
# ==========================================================

@router.put(
    "/intelligent-recommendations/{recommendation_id}",
    response_model=IntelligentRecommendationResponse,
)
def edit_intelligent_recommendation(
    recommendation_id: int,
    payload: IntelligentRecommendationUpdate,
    db: Session = Depends(get_db),
):
    recommendation = update_intelligent_recommendation(
        recommendation_id,
        payload,
        db,
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Intelligent recommendation not found.",
        )

    return recommendation


# ==========================================================
# DELETE INTELLIGENT RECOMMENDATION
# ==========================================================

@router.delete(
    "/intelligent-recommendations/{recommendation_id}",
)
def remove_intelligent_recommendation(
    recommendation_id: int,
    db: Session = Depends(get_db),
):
    recommendation = delete_intelligent_recommendation(
        recommendation_id,
        db,
    )

    if recommendation is None:
        raise HTTPException(
            status_code=404,
            detail="Intelligent recommendation not found.",
        )

    return {
        "message": "Intelligent recommendation deleted successfully.",
        "recommendation_id": recommendation_id,
    }

# ==========================================================
# NATURAL LANGUAGE QUERIES
# ==========================================================

from app.artificial_intelligence.schemas import (
    NaturalLanguageQueryCreate,
    NaturalLanguageQueryUpdate,
    NaturalLanguageQueryResponse,
)

from app.artificial_intelligence.service import (
    create_natural_language_query,
    get_natural_language_queries,
    get_natural_language_query_by_id,
    update_natural_language_query,
    delete_natural_language_query,
)


# ==========================================================
# CREATE NATURAL LANGUAGE QUERY
# ==========================================================

@router.post(
    "/natural-language-queries",
    response_model=NaturalLanguageQueryResponse,
    status_code=201,
)
def add_natural_language_query(
    payload: NaturalLanguageQueryCreate,
    db: Session = Depends(get_db),
):
    return create_natural_language_query(
        payload,
        db,
    )


# ==========================================================
# GET NATURAL LANGUAGE QUERIES
# ==========================================================

@router.get(
    "/natural-language-queries",
    response_model=list[NaturalLanguageQueryResponse],
)
def list_natural_language_queries(
    db: Session = Depends(get_db),
):
    return get_natural_language_queries(db)


# ==========================================================
# GET NATURAL LANGUAGE QUERY BY ID
# ==========================================================

@router.get(
    "/natural-language-queries/{query_id}",
    response_model=NaturalLanguageQueryResponse,
)
def retrieve_natural_language_query(
    query_id: int,
    db: Session = Depends(get_db),
):
    query = get_natural_language_query_by_id(
        query_id,
        db,
    )

    if query is None:
        raise HTTPException(
            status_code=404,
            detail="Natural language query not found.",
        )

    return query


# ==========================================================
# UPDATE NATURAL LANGUAGE QUERY
# ==========================================================

@router.put(
    "/natural-language-queries/{query_id}",
    response_model=NaturalLanguageQueryResponse,
)
def edit_natural_language_query(
    query_id: int,
    payload: NaturalLanguageQueryUpdate,
    db: Session = Depends(get_db),
):
    query = update_natural_language_query(
        query_id,
        payload,
        db,
    )

    if query is None:
        raise HTTPException(
            status_code=404,
            detail="Natural language query not found.",
        )

    return query


# ==========================================================
# DELETE NATURAL LANGUAGE QUERY
# ==========================================================

@router.delete(
    "/natural-language-queries/{query_id}",
)
def remove_natural_language_query(
    query_id: int,
    db: Session = Depends(get_db),
):
    query = delete_natural_language_query(
        query_id,
        db,
    )

    if query is None:
        raise HTTPException(
            status_code=404,
            detail="Natural language query not found.",
        )

    return {
        "message": "Natural language query deleted successfully.",
        "query_id": query_id,
    }
