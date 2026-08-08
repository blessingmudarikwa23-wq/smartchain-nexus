from fastapi import FastAPI

from app.database.base import Base
from app.database.session import engine

from app.dashboard.router import router as dashboard_router
from app.auth.router import router as auth_router
from app.executive_intelligence.router import router as executive_router
from app.procurement.router import router as procurement_router
from app.inventory.router import router as inventory_router

from app.warehouse.router import router as warehouse_router
from app.logistics.router import router as logistics_router
from app.sales.router import router as sales_router
from app.data_science.router import router as data_science_router
from app.business_intelligence.router import (
    router as business_intelligence_router,
)
from app.artificial_intelligence.router import (
    router as artificial_intelligence_router,
)
from app.lean_six_sigma.router import router as lean_router
from app.settings.router import router as settings_router


import app.database.models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartChain Nexus API",
    version="1.0.0"
)

app.include_router(dashboard_router)
app.include_router(auth_router)
app.include_router(executive_router)
app.include_router(procurement_router)
app.include_router(inventory_router)
app.include_router(warehouse_router)
app.include_router(logistics_router)
app.include_router(sales_router)
app.include_router(data_science_router)
app.include_router(business_intelligence_router)
app.include_router(artificial_intelligence_router)
app.include_router(lean_router)
app.include_router(settings_router)

@app.get("/")
def root():
    return {
        "message": "SmartChain Nexus Backend Running"
    }