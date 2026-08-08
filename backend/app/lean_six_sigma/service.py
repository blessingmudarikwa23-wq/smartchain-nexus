from sqlalchemy.orm import Session

from app.lean_six_sigma.models import (
    ControlChart,
    DMAIC,
    FMEA,
    FishboneAnalysis,
    ParetoAnalysis,
    SIPOC,
    RootCauseAnalysis,
)

from app.lean_six_sigma.schemas import (
    ControlChartCreate,
    ControlChartUpdate,
    DMACCreate,
    DMACUpdate,
    FMEACreate,
    FMEAUpdate,
    FishboneAnalysisCreate,
    FishboneAnalysisUpdate,
    ParetoAnalysisCreate,
    ParetoAnalysisUpdate,
    SIPOCCreate,
    SIPOCUpdate,
    RootCauseAnalysisCreate,
    RootCauseAnalysisUpdate,
    LeanSixSigmaDashboard,
)

# ==========================================================
# LEAN SIX SIGMA DASHBOARD
# ==========================================================

def get_lean_dashboard(db: Session):
    return LeanSixSigmaDashboard(
        dmaic=get_all_dmaic(db),
        sipoc=get_all_sipoc(db),
        fishbone=get_fishbone_analyses(db),
        pareto=get_pareto_analyses(db),
        fmea=get_fmeas(db),
        control_charts=get_control_charts(db),
        root_causes=[],
    )


# ==========================================================
# DMAIC
# ==========================================================

def create_dmaic(
    payload: DMACCreate,
    db: Session,
):
    dmaic = DMAIC(
        project_name=payload.project_name,
        define=payload.define,
        measure=payload.measure,
        analyze=payload.analyze,
        improve=payload.improve,
        control=payload.control,
        improvement_percentage=payload.improvement_percentage,
        status=payload.status,
    )

    db.add(dmaic)
    db.commit()
    db.refresh(dmaic)

    return dmaic


def get_dmaic(
    dmaic_id: int,
    db: Session,
):
    return (
        db.query(DMAIC)
        .filter(DMAIC.id == dmaic_id)
        .first()
    )


def get_all_dmaic(
    db: Session,
):
    return (
        db.query(DMAIC)
        .order_by(DMAIC.id.desc())
        .all()
    )


def update_dmaic(
    dmaic_id: int,
    payload: DMACUpdate,
    db: Session,
):
    dmaic = get_dmaic(dmaic_id, db)

    if not dmaic:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(dmaic, field, value)

    db.commit()
    db.refresh(dmaic)

    return dmaic


def delete_dmaic(
    dmaic_id: int,
    db: Session,
):
    dmaic = get_dmaic(dmaic_id, db)

    if not dmaic:
        return None

    db.delete(dmaic)
    db.commit()

    return dmaic


# ==========================================================
# SIPOC
# ==========================================================

def create_sipoc(
    payload: SIPOCCreate,
    db: Session,
):
    sipoc = SIPOC(
        process_name=payload.process_name,
        suppliers=payload.suppliers,
        inputs=payload.inputs,
        process=payload.process,
        outputs=payload.outputs,
        customers=payload.customers,
        status=payload.status,
    )

    db.add(sipoc)
    db.commit()
    db.refresh(sipoc)

    return sipoc


def get_sipoc(
    sipoc_id: int,
    db: Session,
):
    return (
        db.query(SIPOC)
        .filter(SIPOC.id == sipoc_id)
        .first()
    )


def get_all_sipoc(
    db: Session,
):
    return (
        db.query(SIPOC)
        .order_by(SIPOC.id.desc())
        .all()
    )


def update_sipoc(
    sipoc_id: int,
    payload: SIPOCUpdate,
    db: Session,
):
    sipoc = get_sipoc(sipoc_id, db)

    if not sipoc:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(sipoc, field, value)

    db.commit()
    db.refresh(sipoc)

    return sipoc


def delete_sipoc(
    sipoc_id: int,
    db: Session,
):
    sipoc = get_sipoc(sipoc_id, db)

    if not sipoc:
        return None

    db.delete(sipoc)
    db.commit()

    return sipoc


# ==========================================================
# FISHBONE ANALYSIS
# ==========================================================

def create_fishbone_analysis(
    payload: FishboneAnalysisCreate,
    db: Session,
):
    analysis = FishboneAnalysis(
        problem=payload.problem,
        people=payload.people,
        process=payload.process,
        equipment=payload.equipment,
        materials=payload.materials,
        environment=payload.environment,
        measurement=payload.measurement,
        status=payload.status,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_fishbone_analyses(
    db: Session,
):
    return (
        db.query(FishboneAnalysis)
        .order_by(FishboneAnalysis.id.desc())
        .all()
    )


def get_fishbone_analysis(
    analysis_id: int,
    db: Session,
):
    return (
        db.query(FishboneAnalysis)
        .filter(FishboneAnalysis.id == analysis_id)
        .first()
    )


def update_fishbone_analysis(
    analysis_id: int,
    payload: FishboneAnalysisUpdate,
    db: Session,
):
    analysis = get_fishbone_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(analysis, field, value)

    db.commit()
    db.refresh(analysis)

    return analysis


def delete_fishbone_analysis(
    analysis_id: int,
    db: Session,
):
    analysis = get_fishbone_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        return None

    db.delete(analysis)
    db.commit()

    return analysis


# ==========================================================
# PARETO ANALYSIS
# ==========================================================

def create_pareto_analysis(
    payload: ParetoAnalysisCreate,
    db: Session,
):
    analysis = ParetoAnalysis(
        problem=payload.problem,
        category=payload.category,
        frequency=payload.frequency,
        percentage=payload.percentage,
        cumulative_percentage=payload.cumulative_percentage,
        status=payload.status,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_pareto_analyses(
    db: Session,
):
    return (
        db.query(ParetoAnalysis)
        .order_by(ParetoAnalysis.id.desc())
        .all()
    )


def get_pareto_analysis(
    analysis_id: int,
    db: Session,
):
    return (
        db.query(ParetoAnalysis)
        .filter(ParetoAnalysis.id == analysis_id)
        .first()
    )


def update_pareto_analysis(
    analysis_id: int,
    payload: ParetoAnalysisUpdate,
    db: Session,
):
    analysis = get_pareto_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(analysis, field, value)

    db.commit()
    db.refresh(analysis)

    return analysis


def delete_pareto_analysis(
    analysis_id: int,
    db: Session,
):
    analysis = get_pareto_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        return None

    db.delete(analysis)
    db.commit()

    return analysis


# ==========================================================
# FMEA
# ==========================================================

def create_fmea(
    payload: FMEACreate,
    db: Session,
):
    fmea = FMEA(
        process_step=payload.process_step,
        failure_mode=payload.failure_mode,
        effect=payload.effect,
        cause=payload.cause,
        severity=payload.severity,
        occurrence=payload.occurrence,
        detection=payload.detection,
        rpn=payload.rpn,
        recommended_action=payload.recommended_action,
        status=payload.status,
    )

    db.add(fmea)
    db.commit()
    db.refresh(fmea)

    return fmea


def get_fmeas(
    db: Session,
):
    return (
        db.query(FMEA)
        .order_by(FMEA.id.desc())
        .all()
    )


def get_fmea(
    fmea_id: int,
    db: Session,
):
    return (
        db.query(FMEA)
        .filter(FMEA.id == fmea_id)
        .first()
    )


def update_fmea(
    fmea_id: int,
    payload: FMEAUpdate,
    db: Session,
):
    fmea = get_fmea(
        fmea_id,
        db,
    )

    if not fmea:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(fmea, field, value)

    db.commit()
    db.refresh(fmea)

    return fmea


def delete_fmea(
    fmea_id: int,
    db: Session,
):
    fmea = get_fmea(
        fmea_id,
        db,
    )

    if not fmea:
        return None

    db.delete(fmea)
    db.commit()

    return fmea


# ==========================================================
# CONTROL CHARTS
# ==========================================================

def create_control_chart(
    payload: ControlChartCreate,
    db: Session,
):
    control_chart = ControlChart(
        process_name=payload.process_name,
        measurement=payload.measurement,
        mean=payload.mean,
        upper_control_limit=payload.upper_control_limit,
        lower_control_limit=payload.lower_control_limit,
        status=payload.status,
    )

    db.add(control_chart)
    db.commit()
    db.refresh(control_chart)

    return control_chart


def get_control_charts(
    db: Session,
):
    return (
        db.query(ControlChart)
        .order_by(ControlChart.id.desc())
        .all()
    )


def get_control_chart(
    control_chart_id: int,
    db: Session,
):
    return (
        db.query(ControlChart)
        .filter(ControlChart.id == control_chart_id)
        .first()
    )


def update_control_chart(
    control_chart_id: int,
    payload: ControlChartUpdate,
    db: Session,
):
    control_chart = get_control_chart(
        control_chart_id,
        db,
    )

    if not control_chart:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(control_chart, field, value)

    db.commit()
    db.refresh(control_chart)

    return control_chart


def delete_control_chart(
    control_chart_id: int,
    db: Session,
):
    control_chart = get_control_chart(
        control_chart_id,
        db,
    )

    if not control_chart:
        return None

    db.delete(control_chart)
    db.commit()

    return control_chart

# ==========================================================
# ROOT CAUSE ANALYSIS
# ==========================================================

def create_root_cause_analysis(
    payload: RootCauseAnalysisCreate,
    db: Session,
):
    analysis = RootCauseAnalysis(
        issue=payload.issue,
        root_cause=payload.root_cause,
        analysis=payload.analysis,
        corrective_action=payload.corrective_action,
        status=payload.status,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_root_cause_analyses(
    db: Session,
):
    return (
        db.query(RootCauseAnalysis)
        .order_by(RootCauseAnalysis.id.desc())
        .all()
    )


def get_root_cause_analysis(
    analysis_id: int,
    db: Session,
):
    return (
        db.query(RootCauseAnalysis)
        .filter(RootCauseAnalysis.id == analysis_id)
        .first()
    )


def update_root_cause_analysis(
    analysis_id: int,
    payload: RootCauseAnalysisUpdate,
    db: Session,
):
    analysis = get_root_cause_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(analysis, field, value)

    db.commit()
    db.refresh(analysis)

    return analysis


def delete_root_cause_analysis(
    analysis_id: int,
    db: Session,
):
    analysis = get_root_cause_analysis(
        analysis_id,
        db,
    )

    if not analysis:
        return None

    db.delete(analysis)
    db.commit()

    return analysis