from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.business_intelligence.schemas import (
    PowerBIDashboardCreate,
    PowerBIDashboardUpdate,
    PowerBIDashboardResponse,
)

from app.business_intelligence.service import (
    create_power_bi_dashboard,
    get_power_bi_dashboards,
    get_power_bi_dashboard,
    update_power_bi_dashboard,
    delete_power_bi_dashboard,
    get_power_bi_dashboard_summary,
)


# ==========================================================
# BUSINESS INTELLIGENCE
# ==========================================================

router = APIRouter(
    prefix="/business-intelligence",
    tags=["Business Intelligence"],
)


# ==========================================================
# POWER BI DASHBOARDS
# ==========================================================

@router.post(
    "/power-bi-dashboards",
    response_model=PowerBIDashboardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_power_bi_dashboard_route(
    payload: PowerBIDashboardCreate,
    db: Session = Depends(get_db),
):
    return create_power_bi_dashboard(
        db,
        payload,
    )


@router.get(
    "/power-bi-dashboards",
    response_model=list[PowerBIDashboardResponse],
)
def get_power_bi_dashboards_route(
    db: Session = Depends(get_db),
):
    return get_power_bi_dashboards(db)


@router.get(
    "/power-bi-dashboards/{dashboard_id}",
    response_model=PowerBIDashboardResponse,
)
def get_power_bi_dashboard_route(
    dashboard_id: int,
    db: Session = Depends(get_db),
):
    dashboard = get_power_bi_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Power BI Dashboard not found",
        )

    return dashboard


@router.put(
    "/power-bi-dashboards/{dashboard_id}",
    response_model=PowerBIDashboardResponse,
)
def update_power_bi_dashboard_route(
    dashboard_id: int,
    payload: PowerBIDashboardUpdate,
    db: Session = Depends(get_db),
):
    dashboard = update_power_bi_dashboard(
        db,
        dashboard_id,
        payload,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Power BI Dashboard not found",
        )

    return dashboard


@router.delete(
    "/power-bi-dashboards/{dashboard_id}",
)
def delete_power_bi_dashboard_route(
    dashboard_id: int,
    db: Session = Depends(get_db),
):
    dashboard = delete_power_bi_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Power BI Dashboard not found",
        )

    return {
        "message": "Power BI Dashboard deleted successfully",
        "dashboard_id": dashboard_id,
    }


# ==========================================================
# POWER BI DASHBOARD SUMMARY
# ==========================================================

@router.get(
    "/power-bi-dashboards/summary",
)
def get_power_bi_dashboard_summary_route(
    db: Session = Depends(get_db),
):
    return get_power_bi_dashboard_summary(db)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.business_intelligence.schemas import (
    PowerBIDashboardCreate,
    PowerBIDashboardUpdate,
    PowerBIDashboardResponse,
    ExecutiveReportingCreate,
    ExecutiveReportingUpdate,
    ExecutiveReportingResponse,
)

from app.business_intelligence.service import (
    create_power_bi_dashboard,
    get_power_bi_dashboards,
    get_power_bi_dashboard,
    update_power_bi_dashboard,
    delete_power_bi_dashboard,
    get_power_bi_dashboard_summary,
    create_executive_report,
    get_executive_reports,
    get_executive_report,
    update_executive_report,
    delete_executive_report,
    get_executive_reporting_summary,
)


router = APIRouter(
    prefix="/business-intelligence",
    tags=["Business Intelligence"],
)


# ==========================================================
# POWER BI DASHBOARDS
# ==========================================================

@router.post(
    "/power-bi-dashboards",
    response_model=PowerBIDashboardResponse,
    status_code=201,
)
def add_power_bi_dashboard(
    dashboard: PowerBIDashboardCreate,
    db: Session = Depends(get_db),
):
    return create_power_bi_dashboard(
        db=db,
        payload=dashboard,
    )


@router.get(
    "/power-bi-dashboards",
    response_model=list[PowerBIDashboardResponse],
)
def list_power_bi_dashboards(
    db: Session = Depends(get_db),
):
    return get_power_bi_dashboards(db)


@router.get(
    "/power-bi-dashboards/{dashboard_id}",
    response_model=PowerBIDashboardResponse,
)
def retrieve_power_bi_dashboard(
    dashboard_id: int,
    db: Session = Depends(get_db),
):
    dashboard = get_power_bi_dashboard(
        db=db,
        dashboard_id=dashboard_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Power BI dashboard not found.",
        )

    return dashboard


@router.put(
    "/power-bi-dashboards/{dashboard_id}",
    response_model=PowerBIDashboardResponse,
)
def edit_power_bi_dashboard(
    dashboard_id: int,
    dashboard: PowerBIDashboardUpdate,
    db: Session = Depends(get_db),
):
    updated_dashboard = update_power_bi_dashboard(
        db=db,
        dashboard_id=dashboard_id,
        payload=dashboard,
    )

    if updated_dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Power BI dashboard not found.",
        )

    return updated_dashboard


@router.delete(
    "/power-bi-dashboards/{dashboard_id}",
)
def remove_power_bi_dashboard(
    dashboard_id: int,
    db: Session = Depends(get_db),
):
    deleted_dashboard = delete_power_bi_dashboard(
        db=db,
        dashboard_id=dashboard_id,
    )

    if deleted_dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Power BI dashboard not found.",
        )

    return {
        "message": "Power BI dashboard deleted successfully.",
    }


@router.get(
    "/power-bi-dashboards/summary",
)
def power_bi_dashboard_summary(
    db: Session = Depends(get_db),
):
    return get_power_bi_dashboard_summary(db)


# ==========================================================
# EXECUTIVE REPORTING
# ==========================================================

@router.post(
    "/executive-reporting",
    response_model=ExecutiveReportingResponse,
    status_code=201,
)
def add_executive_report(
    report: ExecutiveReportingCreate,
    db: Session = Depends(get_db),
):
    return create_executive_report(
        db=db,
        payload=report,
    )


# ==========================================================
# EXECUTIVE REPORTING SUMMARY
# ==========================================================

@router.get(
    "/executive-reporting/summary",
)
def executive_reporting_summary(
    db: Session = Depends(get_db),
):
    return get_executive_reporting_summary(db)


# ==========================================================
# GET EXECUTIVE REPORTS
# ==========================================================

@router.get(
    "/executive-reporting",
    response_model=list[ExecutiveReportingResponse],
)
def list_executive_reports(
    db: Session = Depends(get_db),
):
    return get_executive_reports(db)


# ==========================================================
# GET SINGLE EXECUTIVE REPORT
# ==========================================================

@router.get(
    "/executive-reporting/{report_id}",
    response_model=ExecutiveReportingResponse,
)
def retrieve_executive_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    report = get_executive_report(
        db=db,
        report_id=report_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Executive report not found.",
        )

    return report


# ==========================================================
# UPDATE EXECUTIVE REPORT
# ==========================================================

@router.put(
    "/executive-reporting/{report_id}",
    response_model=ExecutiveReportingResponse,
)
def edit_executive_report(
    report_id: int,
    report: ExecutiveReportingUpdate,
    db: Session = Depends(get_db),
):
    updated_report = update_executive_report(
        db=db,
        report_id=report_id,
        payload=report,
    )

    if updated_report is None:
        raise HTTPException(
            status_code=404,
            detail="Executive report not found.",
        )

    return updated_report


# ==========================================================
# DELETE EXECUTIVE REPORT
# ==========================================================

@router.delete(
    "/executive-reporting/{report_id}",
)
def remove_executive_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    deleted_report = delete_executive_report(
        db=db,
        report_id=report_id,
    )

    if deleted_report is None:
        raise HTTPException(
            status_code=404,
            detail="Executive report not found.",
        )

    return {
        "message": "Executive report deleted successfully.",
        "report_id": report_id,
    }
# ==========================================================
# OPERATIONAL ANALYTICS
# ==========================================================

from app.business_intelligence.schemas import (
    OperationalAnalyticsCreate,
    OperationalAnalyticsUpdate,
    OperationalAnalyticsResponse,
)

from app.business_intelligence.service import (
    create_operational_analytics,
    get_operational_analytics,
    get_operational_analytics_by_id,
    update_operational_analytics,
    delete_operational_analytics,
)


# ==========================================================
# CREATE OPERATIONAL ANALYTICS
# ==========================================================

@router.post(
    "/operational-analytics",
    response_model=OperationalAnalyticsResponse,
    status_code=201,
)
def add_operational_analytics(
    payload: OperationalAnalyticsCreate,
    db: Session = Depends(get_db),
):
    return create_operational_analytics(
        payload,
        db,
    )


# ==========================================================
# GET OPERATIONAL ANALYTICS
# ==========================================================

@router.get(
    "/operational-analytics",
    response_model=list[OperationalAnalyticsResponse],
)
def list_operational_analytics(
    db: Session = Depends(get_db),
):
    return get_operational_analytics(db)


# ==========================================================
# GET SINGLE OPERATIONAL ANALYTICS
# ==========================================================

@router.get(
    "/operational-analytics/{analytics_id}",
    response_model=OperationalAnalyticsResponse,
)
def retrieve_operational_analytics(
    analytics_id: int,
    db: Session = Depends(get_db),
):
    analytics = get_operational_analytics_by_id(
        analytics_id,
        db,
    )

    if analytics is None:
        raise HTTPException(
            status_code=404,
            detail="Operational Analytics not found.",
        )

    return analytics


# ==========================================================
# UPDATE OPERATIONAL ANALYTICS
# ==========================================================

@router.put(
    "/operational-analytics/{analytics_id}",
    response_model=OperationalAnalyticsResponse,
)
def edit_operational_analytics(
    analytics_id: int,
    payload: OperationalAnalyticsUpdate,
    db: Session = Depends(get_db),
):
    analytics = update_operational_analytics(
        analytics_id,
        payload,
        db,
    )

    if analytics is None:
        raise HTTPException(
            status_code=404,
            detail="Operational Analytics not found.",
        )

    return analytics


# ==========================================================
# DELETE OPERATIONAL ANALYTICS
# ==========================================================

@router.delete(
    "/operational-analytics/{analytics_id}",
)
def remove_operational_analytics(
    analytics_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_operational_analytics(
        analytics_id,
        db,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Operational Analytics not found.",
        )

    return {
        "message": "Operational Analytics deleted successfully."
    }
# ==========================================================
# INTERACTIVE KPI MONITORING
# ==========================================================

from app.business_intelligence.schemas import (
    InteractiveKPIMonitoringCreate,
    InteractiveKPIMonitoringUpdate,
    InteractiveKPIMonitoringResponse,
)

from app.business_intelligence.service import (
    create_interactive_kpi_monitoring,
    get_interactive_kpi_monitoring,
    get_interactive_kpi_monitoring_by_id,
    update_interactive_kpi_monitoring,
    delete_interactive_kpi_monitoring,
)


# ==========================================================
# CREATE INTERACTIVE KPI MONITORING
# ==========================================================

@router.post(
    "/interactive-kpi-monitoring",
    response_model=InteractiveKPIMonitoringResponse,
    status_code=201,
)
def add_interactive_kpi_monitoring(
    payload: InteractiveKPIMonitoringCreate,
    db: Session = Depends(get_db),
):
    return create_interactive_kpi_monitoring(
        payload,
        db,
    )


# ==========================================================
# GET INTERACTIVE KPI MONITORING
# ==========================================================

@router.get(
    "/interactive-kpi-monitoring",
    response_model=list[InteractiveKPIMonitoringResponse],
)
def list_interactive_kpi_monitoring(
    db: Session = Depends(get_db),
):
    return get_interactive_kpi_monitoring(db)


# ==========================================================
# GET SINGLE INTERACTIVE KPI MONITORING
# ==========================================================

@router.get(
    "/interactive-kpi-monitoring/{kpi_id}",
    response_model=InteractiveKPIMonitoringResponse,
)
def retrieve_interactive_kpi_monitoring(
    kpi_id: int,
    db: Session = Depends(get_db),
):
    kpi = get_interactive_kpi_monitoring_by_id(
        kpi_id,
        db,
    )

    if kpi is None:
        raise HTTPException(
            status_code=404,
            detail="Interactive KPI Monitoring not found.",
        )

    return kpi


# ==========================================================
# UPDATE INTERACTIVE KPI MONITORING
# ==========================================================

@router.put(
    "/interactive-kpi-monitoring/{kpi_id}",
    response_model=InteractiveKPIMonitoringResponse,
)
def edit_interactive_kpi_monitoring(
    kpi_id: int,
    payload: InteractiveKPIMonitoringUpdate,
    db: Session = Depends(get_db),
):
    kpi = update_interactive_kpi_monitoring(
        kpi_id,
        payload,
        db,
    )

    if kpi is None:
        raise HTTPException(
            status_code=404,
            detail="Interactive KPI Monitoring not found.",
        )

    return kpi


# ==========================================================
# DELETE INTERACTIVE KPI MONITORING
# ==========================================================

@router.delete(
    "/interactive-kpi-monitoring/{kpi_id}",
)
def remove_interactive_kpi_monitoring(
    kpi_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_interactive_kpi_monitoring(
        kpi_id,
        db,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Interactive KPI Monitoring not found.",
        )

    return {
        "message": "Interactive KPI Monitoring deleted successfully."
    }