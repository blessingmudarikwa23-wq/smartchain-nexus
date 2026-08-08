from app.executive_intelligence.schemas import (
    ExecutiveDashboard,
    BusinessKPIs,
    FinancialOverview,
    OperationalPerformance,
    RiskMonitoring,
)


def get_executive_dashboard():

    return ExecutiveDashboard(

        business_kpis=BusinessKPIs(
            revenue=2450000,
            profit=812000,
            procurement_spend=975000,
            inventory_value=1580000,
        ),

        financial_overview=FinancialOverview(
            revenue=2450000,
            expenses=1638000,
            net_profit=812000,
        ),

        operational_performance=OperationalPerformance(
            warehouse_efficiency=94.8,
            delivery_performance=96.2,
            inventory_accuracy=99.1,
        ),

        risk_monitoring=RiskMonitoring(
            supplier_risk="Low",
            inventory_risk="Medium",
            logistics_risk="Low",
        ),
    )