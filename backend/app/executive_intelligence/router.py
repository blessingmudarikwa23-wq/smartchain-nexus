from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.executive_intelligence.schemas import (
    CEODashboardCreate,
    CEODashboardResponse,
    CEODashboardUpdate,
    BusinessKPICreate,
    BusinessKPIResponse,
    BusinessKPIUpdate,
    FinancialOverviewCreate,
    FinancialOverviewResponse,
    FinancialOverviewUpdate,
    OperationalPerformanceCreate,
    OperationalPerformanceResponse,
    OperationalPerformanceUpdate,
    RiskMonitoringCreate,
    RiskMonitoringResponse,
    RiskMonitoringUpdate,
)

from app.executive_intelligence.service import (
    create_ceo_dashboard,
    get_all_ceo_dashboards,
    get_ceo_dashboard,
    update_ceo_dashboard,
    delete_ceo_dashboard,
    create_business_kpi,
    get_all_business_kpis,
    get_business_kpi,
    update_business_kpi,
    delete_business_kpi,
    create_financial_overview,
    get_all_financial_overviews,
    get_financial_overview,
    update_financial_overview,
    delete_financial_overview,
    create_operational_performance,
    get_all_operational_performances,
    get_operational_performance,
    update_operational_performance,
    delete_operational_performance,
    create_risk_monitoring,
    get_all_risk_monitoring,
    get_risk_monitoring,
    update_risk_monitoring,
    delete_risk_monitoring,
)


router = APIRouter(
    prefix="/executive-intelligence",
    tags=["Executive Intelligence"],
)


# ============================================================
# CEO DASHBOARD
# ============================================================

@router.post(
    "/ceo-dashboard/",
    response_model=CEODashboardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_dashboard(
    dashboard_data: CEODashboardCreate,
    db: Session = Depends(get_db),
):
    return create_ceo_dashboard(
        db,
        dashboard_data,
    )


@router.get(
    "/ceo-dashboard/",
    response_model=list[CEODashboardResponse],
)
def get_dashboards(
    db: Session = Depends(get_db),
):
    return get_all_ceo_dashboards(db)


@router.get(
    "/ceo-dashboard/{dashboard_id}",
    response_model=CEODashboardResponse,
)
def get_dashboard(
    dashboard_id: int,
    db: Session = Depends(get_db),
):
    dashboard = get_ceo_dashboard(
        db,
        dashboard_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CEO dashboard not found",
        )

    return dashboard


@router.put(
    "/ceo-dashboard/{dashboard_id}",
    response_model=CEODashboardResponse,
)
def update_dashboard(
    dashboard_id: int,
    dashboard_data: CEODashboardUpdate,
    db: Session = Depends(get_db),
):
    dashboard = update_ceo_dashboard(
        db,
        dashboard_id,
        dashboard_data,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CEO dashboard not found",
        )

    return dashboard


@router.delete(
    "/ceo-dashboard/{dashboard_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_dashboard(
    dashboard_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_ceo_dashboard(
        db,
        dashboard_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CEO dashboard not found",
        )

    return None


# ============================================================
# BUSINESS KPIs
# ============================================================

@router.post(
    "/business-kpis/",
    response_model=BusinessKPIResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_kpi(
    kpi_data: BusinessKPICreate,
    db: Session = Depends(get_db),
):
    return create_business_kpi(
        db,
        kpi_data,
    )


@router.get(
    "/business-kpis/",
    response_model=list[BusinessKPIResponse],
)
def get_kpis(
    db: Session = Depends(get_db),
):
    return get_all_business_kpis(db)


@router.get(
    "/business-kpis/{kpi_id}",
    response_model=BusinessKPIResponse,
)
def get_kpi(
    kpi_id: int,
    db: Session = Depends(get_db),
):
    kpi = get_business_kpi(
        db,
        kpi_id,
    )

    if kpi is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business KPI not found",
        )

    return kpi


@router.put(
    "/business-kpis/{kpi_id}",
    response_model=BusinessKPIResponse,
)
def update_kpi(
    kpi_id: int,
    kpi_data: BusinessKPIUpdate,
    db: Session = Depends(get_db),
):
    kpi = update_business_kpi(
        db,
        kpi_id,
        kpi_data,
    )

    if kpi is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business KPI not found",
        )

    return kpi


@router.delete(
    "/business-kpis/{kpi_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_kpi(
    kpi_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_business_kpi(
        db,
        kpi_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business KPI not found",
        )

    return None


# ============================================================
# FINANCIAL OVERVIEW
# ============================================================

@router.post(
    "/financial-overview/",
    response_model=FinancialOverviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_financial(
    financial_data: FinancialOverviewCreate,
    db: Session = Depends(get_db),
):
    return create_financial_overview(
        db,
        financial_data,
    )


@router.get(
    "/financial-overview/",
    response_model=list[FinancialOverviewResponse],
)
def get_financials(
    db: Session = Depends(get_db),
):
    return get_all_financial_overviews(db)


@router.get(
    "/financial-overview/{financial_id}",
    response_model=FinancialOverviewResponse,
)
def get_financial(
    financial_id: int,
    db: Session = Depends(get_db),
):
    financial = get_financial_overview(
        db,
        financial_id,
    )

    if financial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial overview not found",
        )

    return financial


@router.put(
    "/financial-overview/{financial_id}",
    response_model=FinancialOverviewResponse,
)
def update_financial(
    financial_id: int,
    financial_data: FinancialOverviewUpdate,
    db: Session = Depends(get_db),
):
    financial = update_financial_overview(
        db,
        financial_id,
        financial_data,
    )

    if financial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial overview not found",
        )

    return financial


@router.delete(
    "/financial-overview/{financial_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_financial(
    financial_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_financial_overview(
        db,
        financial_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial overview not found",
        )

    return None
# ============================================================
# OPERATIONAL PERFORMANCE
# ============================================================

@router.post(
    "/operational-performance/",
    response_model=OperationalPerformanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_operational(
    operational_data: OperationalPerformanceCreate,
    db: Session = Depends(get_db),
):
    return create_operational_performance(
        db,
        operational_data,
    )


@router.get(
    "/operational-performance/",
    response_model=list[OperationalPerformanceResponse],
)
def get_operational(
    db: Session = Depends(get_db),
):
    return get_all_operational_performances(db)


@router.get(
    "/operational-performance/{operational_id}",
    response_model=OperationalPerformanceResponse,
)
def get_operational_by_id(
    operational_id: int,
    db: Session = Depends(get_db),
):
    operational = get_operational_performance(
        db,
        operational_id,
    )

    if operational is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operational performance not found",
        )

    return operational


@router.put(
    "/operational-performance/{operational_id}",
    response_model=OperationalPerformanceResponse,
)
def update_operational(
    operational_id: int,
    operational_data: OperationalPerformanceUpdate,
    db: Session = Depends(get_db),
):
    operational = update_operational_performance(
        db,
        operational_id,
        operational_data,
    )

    if operational is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operational performance not found",
        )

    return operational


@router.delete(
    "/operational-performance/{operational_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_operational(
    operational_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_operational_performance(
        db,
        operational_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operational performance not found",
        )

    return None
# ============================================================
# RISK MONITORING
# ============================================================

@router.post(
    "/risk-monitoring/",
    response_model=RiskMonitoringResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_risk(
    risk_data: RiskMonitoringCreate,
    db: Session = Depends(get_db),
):
    return create_risk_monitoring(
        db,
        risk_data,
    )


@router.get(
    "/risk-monitoring/",
    response_model=list[RiskMonitoringResponse],
)
def get_risks(
    db: Session = Depends(get_db),
):
    return get_all_risk_monitoring(db)


@router.get(
    "/risk-monitoring/{risk_id}",
    response_model=RiskMonitoringResponse,
)
def get_risk(
    risk_id: int,
    db: Session = Depends(get_db),
):
    risk = get_risk_monitoring(
        db,
        risk_id,
    )

    if risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk monitoring record not found",
        )

    return risk


@router.put(
    "/risk-monitoring/{risk_id}",
    response_model=RiskMonitoringResponse,
)
def update_risk(
    risk_id: int,
    risk_data: RiskMonitoringUpdate,
    db: Session = Depends(get_db),
):
    risk = update_risk_monitoring(
        db,
        risk_id,
        risk_data,
    )

    if risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk monitoring record not found",
        )

    return risk


@router.delete(
    "/risk-monitoring/{risk_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_risk(
    risk_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_risk_monitoring(
        db,
        risk_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk monitoring record not found",
        )

    return None