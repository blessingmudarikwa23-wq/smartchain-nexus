from fastapi import APIRouter

from app.dashboard.service import get_dashboard_summary

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def dashboard_summary():
    return get_dashboard_summary()