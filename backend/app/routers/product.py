from fastapi import APIRouter

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get("/")
def get_products():
    return {
        "message": "Products endpoint is working!",
        "data": []
    }