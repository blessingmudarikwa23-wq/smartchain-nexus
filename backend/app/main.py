import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.database.models

from app.artificial_intelligence.router import (
    router as artificial_intelligence_router,
)
from app.auth.router import router as auth_router
from app.business_intelligence.router import (
    router as business_intelligence_router,
)
from app.dashboard.router import router as dashboard_router
from app.data_science.router import router as data_science_router
from app.database.base import Base
from app.database.session import engine
from app.executive_intelligence.router import (
    router as executive_router,
)
from app.inventory.router import router as inventory_router
from app.lean_six_sigma.router import router as lean_router
from app.logistics.router import router as logistics_router
from app.procurement.router import router as procurement_router
from app.sales.router import router as sales_router
from app.settings.router import router as settings_router
from app.warehouse.router import router as warehouse_router


# ==========================================================
# ENVIRONMENT CONFIGURATION
# ==========================================================

# Local development origins
default_origins = (
    "http://localhost:5173,"
    "http://localhost:5174,"
    "http://localhost:5175,"
    "http://127.0.0.1:5173,"
    "http://127.0.0.1:5174,"
    "http://127.0.0.1:5175"
)

# Render production environment variable.
#
# Example:
# FRONTEND_URLS=https://smartchain-nexus-frontend.onrender.com
#
# Multiple frontend URLs can be separated by commas.
frontend_urls = os.getenv("FRONTEND_URLS", default_origins)

allow_origins = [
    origin.strip().rstrip("/")
    for origin in frontend_urls.split(",")
    if origin.strip()
]


# ==========================================================
# DATABASE INITIALIZATION
# ==========================================================

Base.metadata.create_all(bind=engine)


# ==========================================================
# FASTAPI APPLICATION
# ==========================================================

app = FastAPI(
    title="SmartChain Nexus API",
    description=(
        "SmartChain Nexus backend API for supply chain management, "
        "business intelligence, data science, artificial intelligence, "
        "and operational analytics."
    ),
    version="1.0.0",
)


# ==========================================================
# CORS CONFIGURATION
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,

    # Allows Render and Vercel deployments.
    #
    # Examples:
    # https://smartchain-nexus-frontend.onrender.com
    # https://smartchain-nexus-xyz.vercel.app
    #
    allow_origin_regex=r"^https://.*\.(vercel\.app|onrender\.com)$",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# ROUTERS
# ==========================================================

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


# ==========================================================
# ROOT ENDPOINT
# ==========================================================

@app.get("/")
def root():
    return {
        "message": "SmartChain Nexus Backend Running",
        "status": "online",
        "version": "1.0.0",
    }


# ==========================================================
# HEALTH CHECK ENDPOINT
# ==========================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SmartChain Nexus API",
    }


# ==========================================================
# API HEALTH CHECK ENDPOINT
# ==========================================================

@app.get("/api/health")
def api_health_check():
    return {
        "status": "healthy",
        "message": "SmartChain Nexus API is operational",
    }