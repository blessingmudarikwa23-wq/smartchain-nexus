from app.artificial_intelligence.schemas import (
    ArtificialIntelligenceDashboard,
    AISupplyChainAssistant,
    PredictiveAnalytics,
    IntelligentRecommendation,
    NaturalLanguageQuery,
)


def get_ai_dashboard():

    return ArtificialIntelligenceDashboard(

        assistant=AISupplyChainAssistant(
            message="Hello Blessing. SmartChain AI is ready to assist."
        ),

        predictive_analytics=[
            PredictiveAnalytics(
                prediction="Demand expected to increase by 22% next month.",
                confidence=96,
            ),
            PredictiveAnalytics(
                prediction="Supplier delays likely to decrease by 8%.",
                confidence=91,
            ),
        ],

        recommendations=[
            IntelligentRecommendation(
                title="Inventory",
                recommendation="Increase Laptop Stand stock by 15%.",
            ),
            IntelligentRecommendation(
                title="Procurement",
                recommendation="Negotiate bulk pricing with Dell Technologies.",
            ),
        ],

        natural_language_queries=[
            NaturalLanguageQuery(
                question="Which supplier has the highest risk?",
                answer="Lenovo currently has the highest supplier risk.",
            ),
            NaturalLanguageQuery(
                question="What products should be reordered?",
                answer="USB-C Cable and Laptop Stand.",
            ),
        ],
    )
# ==========================================================
# AI SUPPLY CHAIN ASSISTANT DATABASE SERVICE
# ==========================================================

from sqlalchemy.orm import Session

from app.artificial_intelligence.models import (
    AISupplyChainAssistant as AISupplyChainAssistantModel,
)

from app.artificial_intelligence.schemas import (
    AISupplyChainAssistantCreate,
    AISupplyChainAssistantUpdate,
)


# ==========================================================
# CREATE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

def create_ai_supply_chain_assistant(
    payload: AISupplyChainAssistantCreate,
    db: Session,
):
    assistant = AISupplyChainAssistantModel(
        query=payload.query,
        response=payload.response,
        category=payload.category,
        confidence_score=payload.confidence_score,
        status=payload.status,
    )

    db.add(assistant)
    db.commit()
    db.refresh(assistant)

    return assistant


# ==========================================================
# GET AI SUPPLY CHAIN ASSISTANTS
# ==========================================================

def get_ai_supply_chain_assistants(
    db: Session,
):
    return (
        db.query(AISupplyChainAssistantModel)
        .order_by(
            AISupplyChainAssistantModel.id.desc()
        )
        .all()
    )


# ==========================================================
# GET SINGLE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

def get_ai_supply_chain_assistant_by_id(
    assistant_id: int,
    db: Session,
):
    return (
        db.query(AISupplyChainAssistantModel)
        .filter(
            AISupplyChainAssistantModel.id == assistant_id
        )
        .first()
    )


# ==========================================================
# UPDATE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

def update_ai_supply_chain_assistant(
    assistant_id: int,
    payload: AISupplyChainAssistantUpdate,
    db: Session,
):
    assistant = (
        db.query(AISupplyChainAssistantModel)
        .filter(
            AISupplyChainAssistantModel.id == assistant_id
        )
        .first()
    )

    if assistant is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            assistant,
            field,
            value,
        )

    db.commit()
    db.refresh(assistant)

    return assistant


# ==========================================================
# DELETE AI SUPPLY CHAIN ASSISTANT
# ==========================================================

def delete_ai_supply_chain_assistant(
    assistant_id: int,
    db: Session,
):
    assistant = (
        db.query(AISupplyChainAssistantModel)
        .filter(
            AISupplyChainAssistantModel.id == assistant_id
        )
        .first()
    )

    if assistant is None:
        return False

    db.delete(assistant)
    db.commit()

    return True

from app.artificial_intelligence.models import (
    PredictiveAnalytics,
)


# ==========================================================
# PREDICTIVE ANALYTICS
# ==========================================================

def create_predictive_analytics(
    payload,
    db,
):
    analytics = PredictiveAnalytics(
        prediction=payload.prediction,
        confidence=payload.confidence,
        category=payload.category,
        status=payload.status,
    )

    db.add(analytics)
    db.commit()
    db.refresh(analytics)

    return analytics


def get_predictive_analytics(
    db,
):
    return (
        db.query(PredictiveAnalytics)
        .all()
    )


def get_predictive_analytics_by_id(
    analytics_id,
    db,
):
    return (
        db.query(PredictiveAnalytics)
        .filter(
            PredictiveAnalytics.id == analytics_id
        )
        .first()
    )


def update_predictive_analytics(
    analytics_id,
    payload,
    db,
):
    analytics = get_predictive_analytics_by_id(
        analytics_id,
        db,
    )

    if analytics is None:
        return None

    if payload.prediction is not None:
        analytics.prediction = payload.prediction

    if payload.confidence is not None:
        analytics.confidence = payload.confidence

    if payload.category is not None:
        analytics.category = payload.category

    if payload.status is not None:
        analytics.status = payload.status

    db.commit()
    db.refresh(analytics)

    return analytics


def delete_predictive_analytics(
    analytics_id,
    db,
):
    analytics = get_predictive_analytics_by_id(
        analytics_id,
        db,
    )

    if analytics is None:
        return None

    db.delete(analytics)
    db.commit()

    return analytics

# ==========================================================
# INTELLIGENT RECOMMENDATIONS
# ==========================================================

from app.artificial_intelligence.models import (
    IntelligentRecommendation,
)

# ==========================================================
# CREATE INTELLIGENT RECOMMENDATION
# ==========================================================

def create_intelligent_recommendation(
    payload,
    db,
):
    recommendation = IntelligentRecommendation(
        title=payload.title,
        recommendation=payload.recommendation,
        category=payload.category,
        status=payload.status,
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return recommendation


# ==========================================================
# GET INTELLIGENT RECOMMENDATIONS
# ==========================================================

def get_intelligent_recommendations(
    db,
):
    return (
        db.query(IntelligentRecommendation)
        .all()
    )


# ==========================================================
# GET INTELLIGENT RECOMMENDATION BY ID
# ==========================================================

def get_intelligent_recommendation_by_id(
    recommendation_id,
    db,
):
    return (
        db.query(IntelligentRecommendation)
        .filter(
            IntelligentRecommendation.id == recommendation_id
        )
        .first()
    )


# ==========================================================
# UPDATE INTELLIGENT RECOMMENDATION
# ==========================================================

def update_intelligent_recommendation(
    recommendation_id,
    payload,
    db,
):
    recommendation = get_intelligent_recommendation_by_id(
        recommendation_id,
        db,
    )

    if recommendation is None:
        return None

    if payload.title is not None:
        recommendation.title = payload.title

    if payload.recommendation is not None:
        recommendation.recommendation = payload.recommendation

    if payload.category is not None:
        recommendation.category = payload.category

    if payload.status is not None:
        recommendation.status = payload.status

    db.commit()
    db.refresh(recommendation)

    return recommendation


# ==========================================================
# DELETE INTELLIGENT RECOMMENDATION
# ==========================================================

def delete_intelligent_recommendation(
    recommendation_id,
    db,
):
    recommendation = get_intelligent_recommendation_by_id(
        recommendation_id,
        db,
    )

    if recommendation is None:
        return None

    db.delete(recommendation)
    db.commit()

    return recommendation

# ==========================================================
# NATURAL LANGUAGE QUERIES
# ==========================================================

from app.artificial_intelligence.models import (
    NaturalLanguageQuery,
)


# ==========================================================
# CREATE NATURAL LANGUAGE QUERY
# ==========================================================

def create_natural_language_query(
    payload,
    db,
):
    query = NaturalLanguageQuery(
        question=payload.question,
        answer=payload.answer,
        category=payload.category,
        status=payload.status,
    )

    db.add(query)
    db.commit()
    db.refresh(query)

    return query


# ==========================================================
# GET NATURAL LANGUAGE QUERIES
# ==========================================================

def get_natural_language_queries(
    db,
):
    return (
        db.query(NaturalLanguageQuery)
        .all()
    )


# ==========================================================
# GET NATURAL LANGUAGE QUERY BY ID
# ==========================================================

def get_natural_language_query_by_id(
    query_id,
    db,
):
    return (
        db.query(NaturalLanguageQuery)
        .filter(
            NaturalLanguageQuery.id == query_id
        )
        .first()
    )


# ==========================================================
# UPDATE NATURAL LANGUAGE QUERY
# ==========================================================

def update_natural_language_query(
    query_id,
    payload,
    db,
):
    query = get_natural_language_query_by_id(
        query_id,
        db,
    )

    if query is None:
        return None

    if payload.question is not None:
        query.question = payload.question

    if payload.answer is not None:
        query.answer = payload.answer

    if payload.category is not None:
        query.category = payload.category

    if payload.status is not None:
        query.status = payload.status

    db.commit()
    db.refresh(query)

    return query


# ==========================================================
# DELETE NATURAL LANGUAGE QUERY
# ==========================================================

def delete_natural_language_query(
    query_id,
    db,
):
    query = get_natural_language_query_by_id(
        query_id,
        db,
    )

    if query is None:
        return None

    db.delete(query)
    db.commit()

    return query



