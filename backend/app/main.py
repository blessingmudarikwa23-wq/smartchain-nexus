from fastapi import FastAPI

from backend.app.db.database import Base, engine

# ===========================
# Models
# ===========================
from backend.app.models.user import User
from backend.app.models.product import Product
from backend.app.models.inventory import Inventory
from backend.app.models.inventory_transaction import InventoryTransaction
from backend.app.models.supplier import Supplier
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.customer import Customer
from backend.app.models.sales_order import SalesOrder
from backend.app.models.inventory_adjustment import InventoryAdjustment

# ===========================
# Routers
# ===========================
from backend.app.routers.user import router as user_router
from backend.app.routers.auth import router as auth_router
from backend.app.routers.product import router as product_router
from backend.app.routers.inventory import router as inventory_router
from backend.app.routers.inventory_transaction import (
    router as inventory_transaction_router,
)
from backend.app.routers.supplier import router as supplier_router
from backend.app.routers.purchase_order import (
    router as purchase_order_router,
)
from backend.app.routers.customer import router as customer_router
from backend.app.routers.sales_order import (
    router as sales_order_router,
)
from backend.app.routers.inventory_adjustment import (
    router as inventory_adjustment_router,
)
from backend.app.routers.dashboard import (
    router as dashboard_router,
)
from backend.app.routers.low_stock import (
    router as low_stock_router,
)
from backend.app.routers.reorder import (
    router as reorder_router,
)
from backend.app.routers.sales_analytics import (
    router as sales_analytics_router,
)
from backend.app.routers.top_products import (
    router as top_products_router,
)
from backend.app.routers.supplier_performance import (
    router as supplier_performance_router,
)
from backend.app.routers.lead_time import (
    router as lead_time_router,
)
from backend.app.routers.inventory_turnover import (
    router as inventory_turnover_router,
)
from backend.app.routers.abc_analysis import (
    router as abc_analysis_router,
)
from backend.app.routers.xyz_analysis import (
    router as xyz_analysis_router,
)

# ===========================
# Create Database Tables
# ===========================
Base.metadata.create_all(bind=engine)

# ===========================
# FastAPI Application
# ===========================
app = FastAPI(
    title="SmartChain Nexus API",
    description="AI-Powered Enterprise Supply Chain Management Platform",
    version="1.0.0",
)

# ===========================
# Register Routers
# ===========================
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(product_router)
app.include_router(inventory_router)
app.include_router(inventory_transaction_router)
app.include_router(supplier_router)
app.include_router(purchase_order_router)
app.include_router(customer_router)
app.include_router(sales_order_router)
app.include_router(inventory_adjustment_router)
app.include_router(dashboard_router)
app.include_router(low_stock_router)
app.include_router(reorder_router)
app.include_router(sales_analytics_router)
app.include_router(top_products_router)
app.include_router(supplier_performance_router)
app.include_router(lead_time_router)
app.include_router(inventory_turnover_router)
app.include_router(abc_analysis_router)
app.include_router(xyz_analysis_router)

# ===========================
# Home Endpoint
# ===========================
@app.get("/")
def home():
    return {
        "message": "Welcome to SmartChain Nexus API!"
    }