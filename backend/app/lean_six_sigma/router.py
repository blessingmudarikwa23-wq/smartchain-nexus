from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.lean_six_sigma.schemas import (
    ControlChartCreate,
    ControlChartResponse,
    ControlChartUpdate,
    DMACCreate,
    DMACResponse,
    DMACUpdate,
    FMEACreate,
    FMEAResponse,
    FMEAUpdate,
    FishboneAnalysisCreate,
    FishboneAnalysisResponse,
    FishboneAnalysisUpdate,
    LeanSixSigmaDashboard,
    ParetoAnalysisCreate,
    ParetoAnalysisResponse,
    ParetoAnalysisUpdate,
    SIPOCCreate,
    SIPOCResponse,
    SIPOCUpdate,
)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.lean_six_sigma.schemas import (
    ControlChartCreate,
    ControlChartResponse,
    ControlChartUpdate,
    DMAICCreate,
    DMAICResponse,
    DMAICUpdate,
    FMEACreate,
    FMEAResponse,
    FMEAUpdate,
    FishboneAnalysisCreate,
    FishboneAnalysisResponse,
    FishboneAnalysisUpdate,
    ParetoAnalysisCreate,
    ParetoAnalysisResponse,
    ParetoAnalysisUpdate,
    SIPOCCreate,
    SIPOCResponse,
    SIPOCUpdate,
    RootCauseAnalysisCreate,
    RootCauseAnalysisResponse,
    RootCauseAnalysisUpdate,
)

from app.lean_six_sigma.service import (
    create_control_chart,
    create_dmaic,
    create_fmea,
    create_fishbone_analysis,
    create_pareto_analysis,
    create_sipoc,
    create_root_cause_analysis,

    delete_control_chart,
    delete_dmaic,
    delete_fmea,
    delete_fishbone_analysis,
    delete_pareto_analysis,
    delete_sipoc,
    delete_root_cause_analysis,

    get_control_chart,
    get_control_charts,
    get_dmaic,
    get_all_dmaic,
    get_fmea,
    get_fmeas,
    get_fishbone_analysis,
    get_fishbone_analyses,
    get_pareto_analysis,
    get_pareto_analyses,
    get_sipoc,
    get_all_sipoc,
    get_root_cause_analysis,
    get_root_cause_analyses,

    update_control_chart,
    update_dmaic,
    update_fmea,
    update_fishbone_analysis,
    update_pareto_analysis,
    update_sipoc,
    update_root_cause_analysis,
)

router = APIRouter(
    prefix="/lean-six-sigma",
    tags=["Lean Six Sigma"],
)


router = APIRouter(
    prefix="/lean-six-sigma",
    tags=["Lean Six Sigma"],
)


# ==========================================================
# DASHBOARD
# ==========================================================

@router.get(
    "/dashboard",
    response_model=LeanSixSigmaDashboard,
)
def lean_dashboard(
    db: Session = Depends(get_db),
):
    return get_lean_dashboard(db)


# ==========================================================
# DMAIC
# ==========================================================

@router.post(
    "/dmaic",
    response_model=DMACResponse,
    status_code=201,
)
def add_dmaic(
    payload: DMACCreate,
    db: Session = Depends(get_db),
):
    return create_dmaic(payload, db)


@router.get(
    "/dmaic",
    response_model=list[DMACResponse],
)
def list_dmaic(
    db: Session = Depends(get_db),
):
    return get_all_dmaic(db)


@router.get(
    "/dmaic/{dmaic_id}",
    response_model=DMACResponse,
)
def get_dmaic_by_id(
    dmaic_id: int,
    db: Session = Depends(get_db),
):
    dmaic = get_dmaic(dmaic_id, db)

    if not dmaic:
        raise HTTPException(
            status_code=404,
            detail="DMAIC project not found",
        )

    return dmaic


@router.put(
    "/dmaic/{dmaic_id}",
    response_model=DMACResponse,
)
def edit_dmaic(
    dmaic_id: int,
    payload: DMACUpdate,
    db: Session = Depends(get_db),
):
    dmaic = update_dmaic(
        dmaic_id,
        payload,
        db,
    )

    if not dmaic:
        raise HTTPException(
            status_code=404,
            detail="DMAIC project not found",
        )

    return dmaic


@router.delete(
    "/dmaic/{dmaic_id}",
)
def remove_dmaic(
    dmaic_id: int,
    db: Session = Depends(get_db),
):
    dmaic = delete_dmaic(
        dmaic_id,
        db,
    )

    if not dmaic:
        raise HTTPException(
            status_code=404,
            detail="DMAIC project not found",
        )

    return {
        "message": "DMAIC project deleted successfully",
        "id": dmaic_id,
    }


# ==========================================================
# SIPOC
# ==========================================================

@router.post(
    "/sipoc",
    response_model=SIPOCResponse,
    status_code=201,
)
def add_sipoc(
    payload: SIPOCCreate,
    db: Session = Depends(get_db),
):
    return create_sipoc(payload, db)


@router.get(
    "/sipoc",
    response_model=list[SIPOCResponse],
)
def list_sipoc(
    db: Session = Depends(get_db),
):
    return get_all_sipoc(db)


@router.get(
    "/sipoc/{sipoc_id}",
    response_model=SIPOCResponse,
)
def get_sipoc_by_id(
    sipoc_id: int,
    db: Session = Depends(get_db),
):
    sipoc = get_sipoc(sipoc_id, db)

    if not sipoc:
        raise HTTPException(
            status_code=404,
            detail="SIPOC record not found",
        )

    return sipoc


@router.put(
    "/sipoc/{sipoc_id}",
    response_model=SIPOCResponse,
)
def edit_sipoc(
    sipoc_id: int,
    payload: SIPOCUpdate,
    db: Session = Depends(get_db),
):
    sipoc = update_sipoc(
        sipoc_id,
        payload,
        db,
    )

    if not sipoc:
        raise HTTPException(
            status_code=404,
            detail="SIPOC record not found",
        )

    return sipoc


@router.delete(
    "/sipoc/{sipoc_id}",
)
def remove_sipoc(
    sipoc_id: int,
    db: Session = Depends(get_db),
):
    sipoc = delete_sipoc(
        sipoc_id,
        db,
    )

    if not sipoc:
        raise HTTPException(
            status_code=404,
            detail="SIPOC record not found",
        )

    return {
        "message": "SIPOC record deleted successfully",
        "id": sipoc_id,
    }


# ==========================================================
# FISHBONE ANALYSIS
# ==========================================================

@router.post(
    "/fishbone-analysis",
    response_model=FishboneAnalysisResponse,
    status_code=201,
)
def add_fishbone_analysis(
    payload: FishboneAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_fishbone_analysis(payload, db)


@router.get(
    "/fishbone-analysis",
    response_model=list[FishboneAnalysisResponse],
)
def list_fishbone_analyses(
    db: Session = Depends(get_db),
):
    return get_fishbone_analyses(db)


@router.get(
    "/fishbone-analysis/{analysis_id}",
    response_model=FishboneAnalysisResponse,
)
def get_fishbone_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_fishbone_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Fishbone analysis not found",
        )

    return analysis


@router.put(
    "/fishbone-analysis/{analysis_id}",
    response_model=FishboneAnalysisResponse,
)
def edit_fishbone_analysis(
    analysis_id: int,
    payload: FishboneAnalysisUpdate,
    db: Session = Depends(get_db),
):
    analysis = update_fishbone_analysis(
        analysis_id,
        payload,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Fishbone analysis not found",
        )

    return analysis


@router.delete(
    "/fishbone-analysis/{analysis_id}",
)
def remove_fishbone_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = delete_fishbone_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Fishbone analysis not found",
        )

    return {
        "message": "Fishbone analysis deleted successfully",
        "id": analysis_id,
    }


# ==========================================================
# PARETO ANALYSIS
# ==========================================================

@router.post(
    "/pareto-analysis",
    response_model=ParetoAnalysisResponse,
    status_code=201,
)
def add_pareto_analysis(
    payload: ParetoAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_pareto_analysis(payload, db)


@router.get(
    "/pareto-analysis",
    response_model=list[ParetoAnalysisResponse],
)
def list_pareto_analyses(
    db: Session = Depends(get_db),
):
    return get_pareto_analyses(db)


@router.get(
    "/pareto-analysis/{analysis_id}",
    response_model=ParetoAnalysisResponse,
)
def get_pareto_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_pareto_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Pareto analysis not found",
        )

    return analysis


@router.put(
    "/pareto-analysis/{analysis_id}",
    response_model=ParetoAnalysisResponse,
)
def edit_pareto_analysis(
    analysis_id: int,
    payload: ParetoAnalysisUpdate,
    db: Session = Depends(get_db),
):
    analysis = update_pareto_analysis(
        analysis_id,
        payload,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Pareto analysis not found",
        )

    return analysis


@router.delete(
    "/pareto-analysis/{analysis_id}",
)
def remove_pareto_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = delete_pareto_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Pareto analysis not found",
        )

    return {
        "message": "Pareto analysis deleted successfully",
        "id": analysis_id,
    }


# ==========================================================
# FMEA
# ==========================================================

@router.post(
    "/fmea",
    response_model=FMEAResponse,
    status_code=201,
)
def add_fmea(
    payload: FMEACreate,
    db: Session = Depends(get_db),
):
    return create_fmea(payload, db)


@router.get(
    "/fmea",
    response_model=list[FMEAResponse],
)
def list_fmeas(
    db: Session = Depends(get_db),
):
    return get_fmeas(db)


@router.get(
    "/fmea/{fmea_id}",
    response_model=FMEAResponse,
)
def get_fmea_by_id(
    fmea_id: int,
    db: Session = Depends(get_db),
):
    fmea = get_fmea(
        fmea_id,
        db,
    )

    if not fmea:
        raise HTTPException(
            status_code=404,
            detail="FMEA record not found",
        )

    return fmea


@router.put(
    "/fmea/{fmea_id}",
    response_model=FMEAResponse,
)
def edit_fmea(
    fmea_id: int,
    payload: FMEAUpdate,
    db: Session = Depends(get_db),
):
    fmea = update_fmea(
        fmea_id,
        payload,
        db,
    )

    if not fmea:
        raise HTTPException(
            status_code=404,
            detail="FMEA record not found",
        )

    return fmea


@router.delete(
    "/fmea/{fmea_id}",
)
def remove_fmea(
    fmea_id: int,
    db: Session = Depends(get_db),
):
    fmea = delete_fmea(
        fmea_id,
        db,
    )

    if not fmea:
        raise HTTPException(
            status_code=404,
            detail="FMEA record not found",
        )

    return {
        "message": "FMEA record deleted successfully",
        "id": fmea_id,
    }


# ==========================================================
# CONTROL CHARTS
# ==========================================================

@router.post(
    "/control-charts",
    response_model=ControlChartResponse,
    status_code=201,
)
def add_control_chart(
    payload: ControlChartCreate,
    db: Session = Depends(get_db),
):
    return create_control_chart(
        payload,
        db,
    )


@router.get(
    "/control-charts",
    response_model=list[ControlChartResponse],
)
def list_control_charts(
    db: Session = Depends(get_db),
):
    return get_control_charts(db)


@router.get(
    "/control-charts/{control_chart_id}",
    response_model=ControlChartResponse,
)
def get_control_chart_by_id(
    control_chart_id: int,
    db: Session = Depends(get_db),
):
    control_chart = get_control_chart(
        control_chart_id,
        db,
    )

    if not control_chart:
        raise HTTPException(
            status_code=404,
            detail="Control chart not found",
        )

    return control_chart


@router.put(
    "/control-charts/{control_chart_id}",
    response_model=ControlChartResponse,
)
def edit_control_chart(
    control_chart_id: int,
    payload: ControlChartUpdate,
    db: Session = Depends(get_db),
):
    control_chart = update_control_chart(
        control_chart_id,
        payload,
        db,
    )

    if not control_chart:
        raise HTTPException(
            status_code=404,
            detail="Control chart not found",
        )

    return control_chart


@router.delete(
    "/control-charts/{control_chart_id}",
)
def remove_control_chart(
    control_chart_id: int,
    db: Session = Depends(get_db),
):
    control_chart = delete_control_chart(
        control_chart_id,
        db,
    )

    if not control_chart:
        raise HTTPException(
            status_code=404,
            detail="Control chart not found",
        )

    return {
        "message": "Control chart deleted successfully",
        "id": control_chart_id,
    }
# ==========================================================
# ROOT CAUSE ANALYSIS
# ==========================================================

@router.post(
    "/root-cause-analyses",
    response_model=RootCauseAnalysisResponse,
)
def create_root_cause_analysis_route(
    payload: RootCauseAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_root_cause_analysis(
        payload,
        db,
    )


@router.get(
    "/root-cause-analyses",
    response_model=list[RootCauseAnalysisResponse],
)
def get_root_cause_analyses_route(
    db: Session = Depends(get_db),
):
    return get_root_cause_analyses(db)


@router.get(
    "/root-cause-analyses/{analysis_id}",
    response_model=RootCauseAnalysisResponse,
)
def get_root_cause_analysis_route(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_root_cause_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Root cause analysis not found",
        )

    return analysis


@router.put(
    "/root-cause-analyses/{analysis_id}",
    response_model=RootCauseAnalysisResponse,
)
def update_root_cause_analysis_route(
    analysis_id: int,
    payload: RootCauseAnalysisUpdate,
    db: Session = Depends(get_db),
):
    analysis = update_root_cause_analysis(
        analysis_id,
        payload,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Root cause analysis not found",
        )

    return analysis


@router.delete(
    "/root-cause-analyses/{analysis_id}",
)
def delete_root_cause_analysis_route(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = delete_root_cause_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Root cause analysis not found",
        )

    return {
        "message": "Root cause analysis deleted successfully",
        "id": analysis.id,
    }