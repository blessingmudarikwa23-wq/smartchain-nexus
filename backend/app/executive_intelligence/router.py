from fastapi import APIRouter

from app.executive_intelligence.service import get_executive_dashboard

router = APIRouter(
    prefix="/executive-intelligence",
    tags=["Executive Intelligence"],
)


@router.get("/dashboard")
def executive_dashboard():
    return get_executive_dashboard()