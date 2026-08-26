from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.executive_intelligence.models import (
    CEODashboard,
    BusinessKPI,
    FinancialOverview,
    OperationalPerformance,
    RiskMonitoring,
)

from app.executive_intelligence.schemas import (
    CEODashboardCreate,
    CEODashboardUpdate,
    BusinessKPICreate,
    BusinessKPIUpdate,
    FinancialOverviewCreate,
    FinancialOverviewUpdate,
    OperationalPerformanceCreate,
    OperationalPerformanceUpdate,
    RiskMonitoringCreate,
    RiskMonitoringUpdate,
)

from app.sales.models import SalesOrder
from app.procurement.models import PurchaseOrder


# ============================================================
# HELPER — QUARTER DATE RANGE
# ============================================================

def get_quarter_range(target_date: date):
    quarter = (target_date.month - 1) // 3

    start_month = quarter * 3 + 1

    current_start = date(
        target_date.year,
        start_month,
        1,
    )

    if start_month == 1:
        next_start = date(
            target_date.year + 1,
            1,
            1,
        )

        previous_start = date(
            target_date.year - 1,
            10,
            1,
        )
    else:
        next_start = date(
            target_date.year,
            start_month + 3,
            1,
        )

        previous_start = date(
            target_date.year,
            start_month - 3,
            1,
        )

    return (
        current_start,
        next_start,
        previous_start,
    )


# ============================================================
# CEO DASHBOARD
# ============================================================

def create_ceo_dashboard(
    db: Session,
    dashboard_data: CEODashboardCreate,
) -> CEODashboard:

    dashboard = CEODashboard(
        **dashboard_data.model_dump()
    )

    db.add(dashboard)
    db.commit()
    db.refresh(dashboard)

    return dashboard


def get_ceo_dashboard(
    db: Session,
    dashboard_id: int,
) -> CEODashboard | None:

    return (
        db.query(CEODashboard)
        .filter(
            CEODashboard.id == dashboard_id
        )
        .first()
    )


def get_all_ceo_dashboards(
    db: Session,
) -> list[CEODashboard]:

    return db.query(
        CEODashboard
    ).all()


def update_ceo_dashboard(
    db: Session,
    dashboard_id: int,
    dashboard_data: CEODashboardUpdate,
) -> CEODashboard | None:

    dashboard = get_ceo_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        return None

    update_data = dashboard_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            dashboard,
            field,
            value,
        )

    db.commit()
    db.refresh(dashboard)

    return dashboard


def delete_ceo_dashboard(
    db: Session,
    dashboard_id: int,
) -> bool:

    dashboard = get_ceo_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        return False

    db.delete(dashboard)
    db.commit()

    return True


# ============================================================
# BUSINESS KPIs
# ============================================================

def create_business_kpi(
    db: Session,
    kpi_data: BusinessKPICreate,
) -> BusinessKPI:

    kpi = BusinessKPI(
        **kpi_data.model_dump()
    )

    db.add(kpi)
    db.commit()
    db.refresh(kpi)

    return kpi


def get_business_kpi(
    db: Session,
    kpi_id: int,
) -> BusinessKPI | None:

    return (
        db.query(BusinessKPI)
        .filter(
            BusinessKPI.id == kpi_id
        )
        .first()
    )


def get_all_business_kpis(
    db: Session,
) -> list[BusinessKPI]:

    return db.query(
        BusinessKPI
    ).all()


def update_business_kpi(
    db: Session,
    kpi_id: int,
    kpi_data: BusinessKPIUpdate,
) -> BusinessKPI | None:

    kpi = get_business_kpi(
        db,
        kpi_id,
    )

    if kpi is None:
        return None

    update_data = kpi_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            kpi,
            field,
            value,
        )

    db.commit()
    db.refresh(kpi)

    return kpi


def delete_business_kpi(
    db: Session,
    kpi_id: int,
) -> bool:

    kpi = get_business_kpi(
        db,
        kpi_id,
    )

    if kpi is None:
        return False

    db.delete(kpi)
    db.commit()

    return True


# ============================================================
# FINANCIAL OVERVIEW
# ============================================================

def calculate_financial_period(
    db: Session,
    start_date: date,
    end_date: date,
):
    """
    Calculate real financial values from
    Sales Orders and Purchase Orders.
    """

    revenue = (
        db.query(
            func.coalesce(
                func.sum(
                    SalesOrder.total_amount
                ),
                0.0,
            )
        )
        .filter(
            SalesOrder.order_date >= start_date,
            SalesOrder.order_date < end_date,
        )
        .scalar()
    )

    expenses = (
        db.query(
            func.coalesce(
                func.sum(
                    PurchaseOrder.total_amount
                ),
                0.0,
            )
        )
        .filter(
            PurchaseOrder.order_date >= start_date,
            PurchaseOrder.order_date < end_date,
        )
        .scalar()
    )

    revenue = float(
        revenue or 0.0
    )

    expenses = float(
        expenses or 0.0
    )

    net_profit = (
        revenue - expenses
    )

    cash_flow = (
        revenue - expenses
    )

    return {
        "revenue": revenue,
        "expenses": expenses,
        "net_profit": net_profit,
        "cash_flow": cash_flow,
    }


def get_all_financial_overviews(
    db: Session,
) -> list[FinancialOverview]:

    today = date.today()

    (
        current_start,
        current_end,
        previous_start,
    ) = get_quarter_range(
        today
    )

    current = calculate_financial_period(
        db,
        current_start,
        current_end,
    )

    previous = calculate_financial_period(
        db,
        previous_start,
        current_start,
    )

    current_period = (
        f"{current_start.year}-Q"
        f"{((current_start.month - 1) // 3) + 1}"
    )

    metrics = [
        {
            "metric_name": "Revenue",
            "value": current["revenue"],
            "previous_value": previous["revenue"],
            "unit": "ZAR",
            "period": current_period,
        },
        {
            "metric_name": "Expenses",
            "value": current["expenses"],
            "previous_value": previous["expenses"],
            "unit": "ZAR",
            "period": current_period,
        },
        {
            "metric_name": "Net Profit",
            "value": current["net_profit"],
            "previous_value": previous["net_profit"],
            "unit": "ZAR",
            "period": current_period,
        },
        {
            "metric_name": "Cash Flow",
            "value": current["cash_flow"],
            "previous_value": previous["cash_flow"],
            "unit": "ZAR",
            "period": current_period,
        },
    ]

    results = []

    for metric in metrics:

        existing = (
            db.query(FinancialOverview)
            .filter(
                FinancialOverview.metric_name
                == metric["metric_name"]
            )
            .first()
        )

        if existing is None:

            existing = FinancialOverview(
                metric_name=metric["metric_name"],
                value=metric["value"],
                previous_value=metric["previous_value"],
                unit=metric["unit"],
                period=metric["period"],
            )

            db.add(existing)

        else:

            existing.value = metric["value"]

            existing.previous_value = (
                metric["previous_value"]
            )

            existing.unit = metric["unit"]

            existing.period = metric["period"]

        results.append(existing)

    db.commit()

    for item in results:
        db.refresh(item)

    return results


def get_financial_overview(
    db: Session,
    financial_id: int,
) -> FinancialOverview | None:

    return (
        db.query(FinancialOverview)
        .filter(
            FinancialOverview.id
            == financial_id
        )
        .first()
    )


def create_financial_overview(
    db: Session,
    financial_data: FinancialOverviewCreate,
) -> FinancialOverview:

    financial = FinancialOverview(
        **financial_data.model_dump()
    )

    db.add(financial)
    db.commit()
    db.refresh(financial)

    return financial


def update_financial_overview(
    db: Session,
    financial_id: int,
    financial_data: FinancialOverviewUpdate,
) -> FinancialOverview | None:

    financial = get_financial_overview(
        db,
        financial_id,
    )

    if financial is None:
        return None

    update_data = financial_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            financial,
            field,
            value,
        )

    db.commit()
    db.refresh(financial)

    return financial


def delete_financial_overview(
    db: Session,
    financial_id: int,
) -> bool:

    financial = get_financial_overview(
        db,
        financial_id,
    )

    if financial is None:
        return False

    db.delete(financial)
    db.commit()

    return True


# ============================================================
# OPERATIONAL PERFORMANCE
# ============================================================

def create_operational_performance(
    db: Session,
    operational_data: OperationalPerformanceCreate,
) -> OperationalPerformance:

    operational = OperationalPerformance(
        **operational_data.model_dump()
    )

    db.add(operational)
    db.commit()
    db.refresh(operational)

    return operational


def get_all_operational_performances(
    db: Session,
) -> list[OperationalPerformance]:

    return (
        db.query(
            OperationalPerformance
        )
        .order_by(
            OperationalPerformance.id.desc()
        )
        .all()
    )


def get_operational_performance(
    db: Session,
    operational_id: int,
) -> OperationalPerformance | None:

    return (
        db.query(
            OperationalPerformance
        )
        .filter(
            OperationalPerformance.id
            == operational_id
        )
        .first()
    )


def update_operational_performance(
    db: Session,
    operational_id: int,
    operational_data: OperationalPerformanceUpdate,
) -> OperationalPerformance | None:

    operational = get_operational_performance(
        db,
        operational_id,
    )

    if operational is None:
        return None

    update_data = operational_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            operational,
            field,
            value,
        )

    db.commit()
    db.refresh(operational)

    return operational


def delete_operational_performance(
    db: Session,
    operational_id: int,
) -> bool:

    operational = get_operational_performance(
        db,
        operational_id,
    )

    if operational is None:
        return False

    db.delete(operational)
    db.commit()

    return True


# ============================================================
# RISK MONITORING
# ============================================================

def create_risk_monitoring(
    db: Session,
    risk_data: RiskMonitoringCreate,
) -> RiskMonitoring:

    risk = RiskMonitoring(
        **risk_data.model_dump()
    )

    db.add(risk)
    db.commit()
    db.refresh(risk)

    return risk


def get_all_risk_monitoring(
    db: Session,
) -> list[RiskMonitoring]:

    return (
        db.query(
            RiskMonitoring
        )
        .order_by(
            RiskMonitoring.id.desc()
        )
        .all()
    )


def get_risk_monitoring(
    db: Session,
    risk_id: int,
) -> RiskMonitoring | None:

    return (
        db.query(
            RiskMonitoring
        )
        .filter(
            RiskMonitoring.id
            == risk_id
        )
        .first()
    )


def update_risk_monitoring(
    db: Session,
    risk_id: int,
    risk_data: RiskMonitoringUpdate,
) -> RiskMonitoring | None:

    risk = get_risk_monitoring(
        db,
        risk_id,
    )

    if risk is None:
        return None

    update_data = risk_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            risk,
            field,
            value,
        )

    db.commit()
    db.refresh(risk)

    return risk


def delete_risk_monitoring(
    db: Session,
    risk_id: int,
) -> bool:

    risk = get_risk_monitoring(
        db,
        risk_id,
    )

    if risk is None:
        return False

    db.delete(risk)
    db.commit()

    return True