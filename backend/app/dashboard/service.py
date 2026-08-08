from app.dashboard.schemas import (
    DashboardSummary,
    KPIResponse,
    InventoryAlert,
    AIInsight,
    PurchaseOrder,
    SalesOrder,
)


def get_dashboard_summary():

    return DashboardSummary(

        kpis=KPIResponse(
            products=0,
            inventory=0,
            suppliers=0,
            customers=0,
        ),

        inventory_alerts=[
            InventoryAlert(product="Laptop Stand", quantity=4),
            InventoryAlert(product="Wireless Mouse", quantity=7),
            InventoryAlert(product="USB-C Cable", quantity=2),
            InventoryAlert(product="Keyboard", quantity=8),
        ],

        ai_insights=[
            AIInsight(
                title="Inventory Optimization",
                message="Reduce Warehouse A stock by 18% to minimize holding costs."
            ),
            AIInsight(
                title="Supplier Risk",
                message="Dell Technologies delivery performance has dropped by 12% this month."
            ),
            AIInsight(
                title="Demand Forecast",
                message="Laptop demand is predicted to increase by 22% next month."
            ),
        ],

        purchase_orders=[
            PurchaseOrder(
                supplier="Dell Technologies",
                reference="PO-1001",
                status="Pending",
            ),
            PurchaseOrder(
                supplier="HP South Africa",
                reference="PO-1002",
                status="Approved",
            ),
            PurchaseOrder(
                supplier="Lenovo",
                reference="PO-1003",
                status="Delivered",
            ),
        ],

        sales_orders=[
            SalesOrder(
                customer="ABC Retail",
                reference="SO-2001",
                amount=12450,
            ),
            SalesOrder(
                customer="Tech Solutions",
                reference="SO-2002",
                amount=8920,
            ),
            SalesOrder(
                customer="Global Traders",
                reference="SO-2003",
                amount=15730,
            ),
        ],
    )