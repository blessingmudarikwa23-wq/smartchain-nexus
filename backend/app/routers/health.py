from datetime import datetime

from fastapi import APIRouter
from sqlalchemy import text

from backend.app.db.database import SessionLocal

router = APIRouter(
    prefix="/health",
    tags=["Health Checks"],
)


@router.get("/")
def health_check():
    """
    Basic health check.
    """
    return {
        "status": "healthy",
        "service": "SmartChain Nexus API",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/live")
def liveness_check():
    """
    Confirms the API process is alive.
    """
    return {
        "status": "alive",
    }


@router.get("/ready")
def readiness_check():
    """
    Confirms the API is ready and database is reachable.
    """
    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "ready",
            "database": "connected",
        }

    except Exception:
        return {
            "status": "not_ready",
            "database": "disconnected",
        }

    finally:
        db.close()