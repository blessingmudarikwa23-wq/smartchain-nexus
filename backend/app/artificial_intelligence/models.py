from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)

from sqlalchemy.sql import func

from app.database.base import Base


# ==========================================================
# ARTIFICIAL INTELLIGENCE
# ==========================================================

# ==========================================================
# AI SUPPLY CHAIN ASSISTANT
# ==========================================================

class AISupplyChainAssistant(Base):
    __tablename__ = "ai_supply_chain_assistant"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    query = Column(
        String(1000),
        nullable=False,
    )

    response = Column(
        String(2000),
        nullable=False,
    )

    category = Column(
        String(100),
        nullable=False,
        index=True,
    )

    confidence_score = Column(
        Float,
        default=0.0,
    )

    status = Column(
        String(50),
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
# ==========================================================
# PREDICTIVE ANALYTICS
# ==========================================================

class PredictiveAnalytics(Base):
    __tablename__ = "predictive_analytics"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    prediction = Column(
        String(1000),
        nullable=False,
    )

    confidence = Column(
        Float,
        default=0.0,
    )

    category = Column(
        String(100),
        nullable=False,
        index=True,
    )

    status = Column(
        String(50),
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

# ==========================================================
# INTELLIGENT RECOMMENDATIONS
# ==========================================================

class IntelligentRecommendation(Base):
    __tablename__ = "intelligent_recommendations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String,
        nullable=False,
    )

    recommendation = Column(
        String,
        nullable=False,
    )

    category = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

# ==========================================================
# NATURAL LANGUAGE QUERIES
# ==========================================================

class NaturalLanguageQuery(Base):
    __tablename__ = "natural_language_queries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    question = Column(
        String,
        nullable=False,
    )

    answer = Column(
        String,
        nullable=False,
    )

    category = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
