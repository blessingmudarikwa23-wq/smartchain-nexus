from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from backend.app.core.exceptions import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler,
)

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
from backend.app.routers.inventory_transaction import router as inventory_transaction_router
from backend.app.routers.supplier import router as supplier_router
from backend.app.routers.purchase_order import router as purchase_order_router
from backend.app.routers.customer import router as customer_router
from backend.app.routers.sales_order import router as sales_order_router
from backend.app.routers.inventory_adjustment import router as inventory_adjustment_router

from backend.app.routers.dashboard import router as dashboard_router
from backend.app.routers.low_stock import router as low_stock_router
from backend.app.routers.reorder import router as reorder_router
from backend.app.routers.sales_analytics import router as sales_analytics_router
from backend.app.routers.top_products import router as top_products_router
from backend.app.routers.supplier_performance import router as supplier_performance_router
from backend.app.routers.lead_time import router as lead_time_router
from backend.app.routers.inventory_turnover import router as inventory_turnover_router
from backend.app.routers.abc_analysis import router as abc_analysis_router
from backend.app.routers.xyz_analysis import router as xyz_analysis_router
from backend.app.routers.eoq import router as eoq_router
from backend.app.routers.safety_stock import router as safety_stock_router
from backend.app.routers.reorder_point import router as reorder_point_router
from backend.app.routers.demand_forecasting import router as demand_forecasting_router
from backend.app.routers.inventory_valuation import router as inventory_valuation_router
from backend.app.routers.slow_moving_inventory import router as slow_moving_inventory_router
from backend.app.routers.dead_stock import router as dead_stock_router
from backend.app.routers.overstock_analysis import router as overstock_analysis_router
from backend.app.routers.supplier_spend import router as supplier_spend_router
from backend.app.routers.customer_purchase_analysis import router as customer_purchase_analysis_router
from backend.app.routers.sales_revenue_analysis import router as sales_revenue_analysis_router
from backend.app.routers.profit_margin_analysis import router as profit_margin_analysis_router
from backend.app.routers.supplier_purchase_trend import router as supplier_purchase_trend_router
from backend.app.routers.inventory_aging_analysis import router as inventory_aging_analysis_router
from backend.app.routers.warehouse_utilization import router as warehouse_utilization_router
from backend.app.routers.stock_movement_trend import router as stock_movement_trend_router
from backend.app.routers.procurement_cost_analysis import router as procurement_cost_analysis_router
from backend.app.routers.order_fulfillment_analysis import router as order_fulfillment_analysis_router
from backend.app.routers.inventory_days_on_hand import router as inventory_days_on_hand_router
from backend.app.routers.supplier_delivery_reliability import (
    router as supplier_delivery_reliability_router,
)
from backend.app.routers.stockout_frequency_analysis import (
    router as stockout_frequency_analysis_router,
)
from backend.app.routers.executive_kpi_summary import (
    router as executive_kpi_summary_router,
)
from backend.app.routers.ai_insights import (
    router as ai_insights_router,
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
# Global Exception Handlers
# ===========================
app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    SQLAlchemyError,
    sqlalchemy_exception_handler,
)

app.add_exception_handler(
    Exception,
    generic_exception_handler,
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
app.include_router(eoq_router)
app.include_router(safety_stock_router)
app.include_router(reorder_point_router)
app.include_router(demand_forecasting_router)
app.include_router(inventory_valuation_router)
app.include_router(slow_moving_inventory_router)
app.include_router(dead_stock_router)
app.include_router(overstock_analysis_router)
app.include_router(supplier_spend_router)
app.include_router(customer_purchase_analysis_router)
app.include_router(sales_revenue_analysis_router)
app.include_router(profit_margin_analysis_router)
app.include_router(supplier_purchase_trend_router)
app.include_router(inventory_aging_analysis_router)
app.include_router(warehouse_utilization_router)
app.include_router(stock_movement_trend_router)
app.include_router(procurement_cost_analysis_router)
app.include_router(order_fulfillment_analysis_router)
app.include_router(inventory_days_on_hand_router)
app.include_router(supplier_delivery_reliability_router)
app.include_router(stockout_frequency_analysis_router)
app.include_router(executive_kpi_summary_router)
app.include_router(ai_insights_router)

# ===========================
# Home Endpoint
# ===========================
@app.get("/")
def home():
    return {
        "message": "Welcome to SmartChain Nexus API!"
    }