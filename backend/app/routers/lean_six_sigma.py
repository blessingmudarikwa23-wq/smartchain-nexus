print(">>> Lean Six Sigma router loaded <<<")

from fastapi import APIRouter

from backend.app.schemas.lean_six_sigma import (
    SigmaCalculationRequest,
    SigmaCalculationResponse,

    SIPOCRequest,
    SIPOCResponse,

    ParetoRequest,
    ParetoResponse,
    ParetoResult,

    FishboneRequest,
    FishboneResponse,
    FishboneCategory,

    DMAICRequest,
    DMAICResponse,

    COPQRequest,
    COPQResponse,

    ProcessCapabilityRequest,
    ProcessCapabilityResponse,

    XBarChartRequest,
    XBarChartResponse,

    ControlChartRequest,
    ControlChartResponse,

    WasteDetectionRequest,
    WasteDetectionResponse,

    ContinuousImprovementResponse,

    FMEARequest,
    FMEAResponse,
)

from backend.app.services.lean_six_sigma import LeanSixSigmaService

router = APIRouter(
    prefix="/lean",
    tags=["Lean Six Sigma"],
)

# ============================================================
# SIGMA CALCULATOR
# ============================================================

@router.post(
    "/sigma",
    response_model=SigmaCalculationResponse,
    summary="Calculate Lean Six Sigma Metrics",
)
def calculate_sigma(request: SigmaCalculationRequest):

    return LeanSixSigmaService.calculate_sigma(request)


# ============================================================
# SIPOC
# ============================================================

@router.post(
    "/sipoc",
    response_model=SIPOCResponse,
    summary="Generate SIPOC Diagram",
)
def generate_sipoc(request: SIPOCRequest):

    return LeanSixSigmaService.generate_sipoc(request)


# ============================================================
# PARETO ANALYSIS
# ============================================================

@router.post(
    "/pareto",
    response_model=ParetoResponse,
    summary="Perform Pareto Analysis",
)
def pareto_analysis(request: ParetoRequest):

    return LeanSixSigmaService.pareto_analysis(request)


# ============================================================
# FISHBONE (ISHIKAWA)
# ============================================================

@router.post(
    "/fishbone",
    response_model=FishboneResponse,
    summary="Generate Fishbone Diagram",
)
def fishbone_analysis(request: FishboneRequest):

    return LeanSixSigmaService.fishbone_analysis(request)
    # ============================================================
# DMAIC PROJECT ENGINE
# ============================================================

@router.post(
    "/dmaic",
    response_model=DMAICResponse,
    summary="Generate DMAIC Improvement Roadmap",
)
def dmaic_project(request: DMAICRequest):
    """
    Generate a complete DMAIC roadmap.

    Returns:
    - Define
    - Measure
    - Analyze
    - Improve
    - Control
    - Estimated Sigma Improvement
    """

    return LeanSixSigmaService.dmaic_project(request)
    # ============================================================
# COST OF POOR QUALITY (COPQ)
# ============================================================

@router.post(
    "/copq",
    response_model=COPQResponse,
    summary="Calculate Cost of Poor Quality",
)
def calculate_copq(request: COPQRequest):
    """
    Calculate the Cost of Poor Quality.

    Returns:
    - Internal Failure Cost
    - External Failure Cost
    - Appraisal Cost
    - Prevention Cost
    - Total COPQ
    - Executive Recommendation
    """

    return LeanSixSigmaService.calculate_copq(request)
    # ============================================================
# PROCESS CAPABILITY (CP / CPK)
# ============================================================

@router.post(
    "/process-capability",
    response_model=ProcessCapabilityResponse,
    summary="Calculate Process Capability (Cp / Cpk)",
)
def process_capability(
    request: ProcessCapabilityRequest,
):
    """
    Calculate Process Capability.

    Returns

    • Cp
    • Cpk
    • Capability Level
    • Recommendation
    """

    return LeanSixSigmaService.calculate_process_capability(
        request
    )
    # ============================================================
# X-BAR CONTROL CHART
# ============================================================

@router.post(
    "/xbar-chart",
    response_model=XBarChartResponse,
    summary="Generate X-Bar Control Chart",
)
def xbar_chart(
    request: XBarChartRequest,
):
    """
    Statistical Process Control

    Returns

    • Overall Mean

    • Upper Control Limit

    • Lower Control Limit

    • Process Status

    • Recommendation
    """

    return LeanSixSigmaService.calculate_xbar_chart(
        request
    )
    # ============================================================
# CONTROL CHARTS
# ============================================================

@router.post(
    "/control-chart",
    response_model=ControlChartResponse,
    summary="Generate Statistical Process Control Chart",
)
def control_chart(
    request: ControlChartRequest,
):
    """
    Statistical Process Control

    Supported chart types:

    • XBAR
    • R
    • P
    • NP
    """

    return LeanSixSigmaService.calculate_control_chart(
        request
    )
    # ============================================================
# WASTE DETECTION
# ============================================================

@router.post(
    "/waste-detection",
    response_model=WasteDetectionResponse,
    summary="Detect Lean Waste",
)
def waste_detection(
    request: WasteDetectionRequest,
):
    """
    Detect Lean Waste (DOWNTIME)

    Waste Types:
    - Defects
    - Overproduction
    - Waiting
    - Non-utilized Talent
    - Transportation
    - Inventory
    - Motion
    - Extra Processing
    """

    return LeanSixSigmaService.detect_waste(
        request
    )
    # ============================================================
# CONTINUOUS IMPROVEMENT DASHBOARD
# ============================================================

@router.get(
    "/continuous-improvement-dashboard",
    response_model=ContinuousImprovementResponse,
    summary="Lean Six Sigma Executive Dashboard",
)
def continuous_improvement_dashboard():
    """
    Executive summary of Lean Six Sigma performance.

    Displays:

    - Sigma Status
    - Process Capability
    - Waste Status
    - COPQ Status
    - Control Chart Status
    - Overall Process Health
    - Executive Recommendation
    """

    return LeanSixSigmaService.continuous_improvement_dashboard()
    # ============================================================
# FAILURE MODE AND EFFECTS ANALYSIS (FMEA)
# ============================================================

@router.post(
    "/fmea",
    response_model=FMEAResponse,
    summary="Failure Mode and Effects Analysis",
)
def calculate_fmea(
    request: FMEARequest,
):
    """
    Calculate:

    • Severity
    • Occurrence
    • Detection
    • Risk Priority Number (RPN)
    • Risk Level
    • Recommendation
    """

    return LeanSixSigmaService.calculate_fmea(
        request
    )