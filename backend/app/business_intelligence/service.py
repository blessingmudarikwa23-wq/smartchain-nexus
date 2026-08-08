from sqlalchemy.orm import Session

from app.business_intelligence.models import (
    PowerBIDashboard,
)

from app.business_intelligence.schemas import (
    PowerBIDashboardCreate,
    PowerBIDashboardUpdate,
)


# ==========================================================
# BUSINESS INTELLIGENCE
# ==========================================================

# ==========================================================
# POWER BI DASHBOARDS SERVICE
# ==========================================================

def create_power_bi_dashboard(
    db: Session,
    payload: PowerBIDashboardCreate,
):
    dashboard = PowerBIDashboard(
        dashboard_name=payload.dashboard_name,
        description=payload.description,
        dashboard_type=payload.dashboard_type,
        workspace=payload.workspace,
        report_url=payload.report_url,
        refresh_frequency=payload.refresh_frequency,
        status=payload.status,
    )

    db.add(dashboard)
    db.commit()
    db.refresh(dashboard)

    return dashboard


def get_power_bi_dashboards(
    db: Session,
):
    return (
        db.query(PowerBIDashboard)
        .order_by(PowerBIDashboard.id.desc())
        .all()
    )


def get_power_bi_dashboard(
    db: Session,
    dashboard_id: int,
):
    return (
        db.query(PowerBIDashboard)
        .filter(
            PowerBIDashboard.id == dashboard_id
        )
        .first()
    )


def update_power_bi_dashboard(
    db: Session,
    dashboard_id: int,
    payload: PowerBIDashboardUpdate,
):
    dashboard = get_power_bi_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(dashboard, field, value)

    db.commit()
    db.refresh(dashboard)

    return dashboard


def delete_power_bi_dashboard(
    db: Session,
    dashboard_id: int,
):
    dashboard = get_power_bi_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        return None

    db.delete(dashboard)
    db.commit()

    return dashboard


# ==========================================================
# POWER BI DASHBOARD SUMMARY
# ==========================================================

def get_power_bi_dashboard_summary(
    db: Session,
):
    dashboards = get_power_bi_dashboards(db)

    return {
        "total_dashboards": len(dashboards),
        "active_dashboards": len(
            [
                dashboard
                for dashboard in dashboards
                if dashboard.status == "Active"
            ]
        ),
        "dashboards": dashboards,
    }
from sqlalchemy.orm import Session

from app.business_intelligence.models import (
    PowerBIDashboard,
    ExecutiveReporting,
)

from app.business_intelligence.schemas import (
    PowerBIDashboardCreate,
    PowerBIDashboardUpdate,
    ExecutiveReportingCreate,
    ExecutiveReportingUpdate,
)


# ==========================================================
# BUSINESS INTELLIGENCE
# ==========================================================

# ==========================================================
# POWER BI DASHBOARDS SERVICE
# ==========================================================

def create_power_bi_dashboard(
    db: Session,
    payload: PowerBIDashboardCreate,
):
    dashboard = PowerBIDashboard(
        dashboard_name=payload.dashboard_name,
        description=payload.description,
        dashboard_type=payload.dashboard_type,
        workspace=payload.workspace,
        report_url=payload.report_url,
        refresh_frequency=payload.refresh_frequency,
        status=payload.status,
    )

    db.add(dashboard)
    db.commit()
    db.refresh(dashboard)

    return dashboard


def get_power_bi_dashboards(
    db: Session,
):
    return (
        db.query(PowerBIDashboard)
        .order_by(PowerBIDashboard.id.desc())
        .all()
    )


def get_power_bi_dashboard(
    db: Session,
    dashboard_id: int,
):
    return (
        db.query(PowerBIDashboard)
        .filter(
            PowerBIDashboard.id == dashboard_id
        )
        .first()
    )


def update_power_bi_dashboard(
    db: Session,
    dashboard_id: int,
    payload: PowerBIDashboardUpdate,
):
    dashboard = get_power_bi_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(dashboard, field, value)

    db.commit()
    db.refresh(dashboard)

    return dashboard


def delete_power_bi_dashboard(
    db: Session,
    dashboard_id: int,
):
    dashboard = get_power_bi_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        return None

    db.delete(dashboard)
    db.commit()

    return dashboard


def get_power_bi_dashboard_summary(
    db: Session,
):
    dashboards = get_power_bi_dashboards(db)

    return {
        "total_dashboards": len(dashboards),
        "active_dashboards": len(
            [
                dashboard
                for dashboard in dashboards
                if dashboard.status == "Active"
            ]
        ),
        "dashboards": dashboards,
    }


# ==========================================================
# EXECUTIVE REPORTING SERVICE
# ==========================================================

def create_executive_report(
    db: Session,
    payload: ExecutiveReportingCreate,
):
    report = ExecutiveReporting(
        report_name=payload.report_name,
        reporting_period=payload.reporting_period,
        executive_summary=payload.executive_summary,
        total_revenue=payload.total_revenue,
        total_cost=payload.total_cost,
        total_profit=payload.total_profit,
        profit_margin=payload.profit_margin,
        inventory_value=payload.inventory_value,
        supplier_performance=payload.supplier_performance,
        delivery_performance=payload.delivery_performance,
        overall_performance=payload.overall_performance,
        status=payload.status,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


def get_executive_reports(
    db: Session,
):
    return (
        db.query(ExecutiveReporting)
        .order_by(
            ExecutiveReporting.id.desc()
        )
        .all()
    )


def get_executive_report(
    db: Session,
    report_id: int,
):
    return (
        db.query(ExecutiveReporting)
        .filter(
            ExecutiveReporting.id == report_id
        )
        .first()
    )


def update_executive_report(
    db: Session,
    report_id: int,
    payload: ExecutiveReportingUpdate,
):
    report = get_executive_report(
        db,
        report_id,
    )

    if report is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(report, field, value)

    db.commit()
    db.refresh(report)

    return report


def delete_executive_report(
    db: Session,
    report_id: int,
):
    report = get_executive_report(
        db,
        report_id,
    )

    if report is None:
        return None

    db.delete(report)
    db.commit()

    return report


def get_executive_reporting_summary(
    db: Session,
):
    reports = get_executive_reports(db)

    total_revenue = sum(
        report.total_revenue
        for report in reports
    )

    total_cost = sum(
        report.total_cost
        for report in reports
    )

    total_profit = sum(
        report.total_profit
        for report in reports
    )

    average_profit_margin = (
        sum(
            report.profit_margin
            for report in reports
        ) / len(reports)
        if reports
        else 0.0
    )

    return {
        "total_reports": len(reports),
        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "total_profit": total_profit,
        "average_profit_margin": average_profit_margin,
        "reports": reports,
    }
# ==========================================================
# OPERATIONAL ANALYTICS
# ==========================================================

from app.business_intelligence.models import (
    OperationalAnalytics,
)

from app.business_intelligence.schemas import (
    OperationalAnalyticsCreate,
    OperationalAnalyticsUpdate,
)


# ==========================================================
# CREATE OPERATIONAL ANALYTICS
# ==========================================================

def create_operational_analytics(
    payload: OperationalAnalyticsCreate,
    db: Session,
):
    analytics = OperationalAnalytics(
        metric_name=payload.metric_name,
        metric_category=payload.metric_category,
        reporting_period=payload.reporting_period,
        metric_value=payload.metric_value,
        target_value=payload.target_value,
        variance=payload.variance,
        performance_percentage=payload.performance_percentage,
        status=payload.status,
    )

    db.add(analytics)
    db.commit()
    db.refresh(analytics)

    return analytics


# ==========================================================
# GET OPERATIONAL ANALYTICS
# ==========================================================

def get_operational_analytics(
    db: Session,
):
    return (
        db.query(OperationalAnalytics)
        .order_by(
            OperationalAnalytics.id.desc()
        )
        .all()
    )


# ==========================================================
# GET SINGLE OPERATIONAL ANALYTICS
# ==========================================================

def get_operational_analytics_by_id(
    analytics_id: int,
    db: Session,
):
    return (
        db.query(OperationalAnalytics)
        .filter(
            OperationalAnalytics.id == analytics_id
        )
        .first()
    )


# ==========================================================
# UPDATE OPERATIONAL ANALYTICS
# ==========================================================

def update_operational_analytics(
    analytics_id: int,
    payload: OperationalAnalyticsUpdate,
    db: Session,
):
    analytics = (
        db.query(OperationalAnalytics)
        .filter(
            OperationalAnalytics.id == analytics_id
        )
        .first()
    )

    if analytics is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            analytics,
            field,
            value,
        )

    db.commit()
    db.refresh(analytics)

    return analytics


# ==========================================================
# DELETE OPERATIONAL ANALYTICS
# ==========================================================

def delete_operational_analytics(
    analytics_id: int,
    db: Session,
):
    analytics = (
        db.query(OperationalAnalytics)
        .filter(
            OperationalAnalytics.id == analytics_id
        )
        .first()
    )

    if analytics is None:
        return False

    db.delete(analytics)
    db.commit()

    return True
# ==========================================================
# INTERACTIVE KPI MONITORING
# ==========================================================

from app.business_intelligence.models import (
    InteractiveKPIMonitoring,
)

from app.business_intelligence.schemas import (
    InteractiveKPIMonitoringCreate,
    InteractiveKPIMonitoringUpdate,
)


# ==========================================================
# CREATE INTERACTIVE KPI MONITORING
# ==========================================================

def create_interactive_kpi_monitoring(
    payload: InteractiveKPIMonitoringCreate,
    db: Session,
):
    kpi = InteractiveKPIMonitoring(
        metric_name=payload.metric_name,
        metric_category=payload.metric_category,
        reporting_period=payload.reporting_period,
        metric_value=payload.metric_value,
        target_value=payload.target_value,
        variance=payload.variance,
        performance_percentage=payload.performance_percentage,
        status=payload.status,
    )

    db.add(kpi)
    db.commit()
    db.refresh(kpi)

    return kpi


# ==========================================================
# GET INTERACTIVE KPI MONITORING
# ==========================================================

def get_interactive_kpi_monitoring(
    db: Session,
):
    return (
        db.query(InteractiveKPIMonitoring)
        .order_by(
            InteractiveKPIMonitoring.id.desc()
        )
        .all()
    )


# ==========================================================
# GET SINGLE INTERACTIVE KPI MONITORING
# ==========================================================

def get_interactive_kpi_monitoring_by_id(
    kpi_id: int,
    db: Session,
):
    return (
        db.query(InteractiveKPIMonitoring)
        .filter(
            InteractiveKPIMonitoring.id == kpi_id
        )
        .first()
    )


# ==========================================================
# UPDATE INTERACTIVE KPI MONITORING
# ==========================================================

def update_interactive_kpi_monitoring(
    kpi_id: int,
    payload: InteractiveKPIMonitoringUpdate,
    db: Session,
):
    kpi = (
        db.query(InteractiveKPIMonitoring)
        .filter(
            InteractiveKPIMonitoring.id == kpi_id
        )
        .first()
    )

    if kpi is None:
        return None

    update_data = payload.model_dump(
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


# ==========================================================
# DELETE INTERACTIVE KPI MONITORING
# ==========================================================

def delete_interactive_kpi_monitoring(
    kpi_id: int,
    db: Session,
):
    kpi = (
        db.query(InteractiveKPIMonitoring)
        .filter(
            InteractiveKPIMonitoring.id == kpi_id
        )
        .first()
    )

    if kpi is None:
        return False

    db.delete(kpi)
    db.commit()

    return True