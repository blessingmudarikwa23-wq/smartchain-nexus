from pydantic import BaseModel, Field


class SigmaCalculationRequest(BaseModel):
    """
    Request model for Lean Six Sigma calculations.
    """

    units: int = Field(..., gt=0, description="Number of units produced")
    defects: int = Field(..., ge=0, description="Number of defects found")
    opportunities_per_unit: int = Field(
        ..., gt=0, description="Number of defect opportunities per unit"
    )


class SigmaCalculationResponse(BaseModel):
    """
    Response model containing Lean Six Sigma metrics.
    """

    dpmo: float
    yield_percentage: float
    sigma_level: float
    assessment: str
    recommendation: str
    # ==========================
# SIPOC MODELS
# ==========================

class SIPOCRequest(BaseModel):
    """
    Request model for SIPOC generation.
    """

    suppliers: list[str]
    inputs: list[str]
    process: list[str]
    outputs: list[str]
    customers: list[str]


class SIPOCResponse(BaseModel):
    """
    Response model for SIPOC summary.
    """

    suppliers: list[str]
    inputs: list[str]
    process: list[str]
    outputs: list[str]
    customers: list[str]

    supplier_count: int
    process_steps: int
    customer_count: int
    # ==========================
# PARETO ANALYSIS MODELS
# ==========================

class ParetoCause(BaseModel):
    """
    Single cause used in Pareto Analysis.
    """

    name: str = Field(..., description="Cause name")
    count: int = Field(..., gt=0, description="Number of occurrences")


class ParetoRequest(BaseModel):
    """
    Request model for Pareto Analysis.
    """

    causes: list[ParetoCause]


class ParetoResult(BaseModel):
    """
    Individual Pareto result.
    """

    name: str
    count: int
    percentage: float
    cumulative_percentage: float
    critical: bool


class ParetoResponse(BaseModel):
    """
    Complete Pareto Analysis response.
    """

    total_occurrences: int
    results: list[ParetoResult]
    # ==========================
# FISHBONE MODELS
# ==========================

class FishboneCategory(BaseModel):
    """
    Single Fishbone category.
    """

    category: str = Field(..., description="Category name")
    causes: list[str] = Field(..., description="List of causes")


class FishboneRequest(BaseModel):
    """
    Request model for Fishbone Analysis.
    """

    problem: str = Field(..., description="Problem being investigated")
    categories: list[FishboneCategory]


class FishboneResponse(BaseModel):
    """
    Fishbone Analysis response.
    """

    problem: str
    total_categories: int
    total_causes: int
    categories: list[FishboneCategory]
    # ============================================================
# DMAIC MODELS
# ============================================================

class DMAICRequest(BaseModel):
    """
    DMAIC Project Request
    """

    project_name: str
    problem_statement: str
    objective: str
    current_sigma_level: float
    target_sigma_level: float


class DMAICResponse(BaseModel):
    """
    DMAIC Improvement Roadmap
    """

    project_name: str
    define: str
    measure: str
    analyze: str
    improve: str
    control: str
    estimated_sigma_improvement: float
    # ============================================================
# COST OF POOR QUALITY (COPQ)
# ============================================================

class COPQRequest(BaseModel):
    """
    Cost of Poor Quality Request
    """

    internal_failure_cost: float = Field(
        ..., ge=0,
        description="Cost of internal failures"
    )

    external_failure_cost: float = Field(
        ..., ge=0,
        description="Cost of external failures"
    )

    appraisal_cost: float = Field(
        ..., ge=0,
        description="Inspection and testing costs"
    )

    prevention_cost: float = Field(
        ..., ge=0,
        description="Training and prevention costs"
    )


class COPQResponse(BaseModel):
    """
    Cost of Poor Quality Response
    """

    internal_failure_cost: float
    external_failure_cost: float
    appraisal_cost: float
    prevention_cost: float

    total_copq: float

    recommendation: str
    # ============================================================
# PROCESS CAPABILITY (CP / CPK)
# ============================================================

class ProcessCapabilityRequest(BaseModel):
    """
    Process Capability Analysis
    """

    upper_spec_limit: float = Field(...)

    lower_spec_limit: float = Field(...)

    process_mean: float = Field(...)

    process_standard_deviation: float = Field(..., gt=0)


class ProcessCapabilityResponse(BaseModel):
    """
    Cp / Cpk Results
    """

    cp: float

    cpk: float

    capability_level: str

    recommendation: str
    # ============================================================
# X-BAR CONTROL CHART
# ============================================================

class XBarChartRequest(BaseModel):
    """
    X-Bar Control Chart Request
    """

    sample_means: list[float] = Field(
        ...,
        min_length=2,
        description="Sample means"
    )


class XBarChartResponse(BaseModel):
    """
    X-Bar Control Chart Results
    """

    overall_mean: float

    ucl: float

    lcl: float

    process_status: str

    recommendation: str
    # ============================================================
# CONTROL CHARTS
# ============================================================

class ControlChartRequest(BaseModel):
    """
    Statistical Process Control Request
    """

    chart_type: str = Field(
        ...,
        description="XBAR, R, P or NP"
    )

    data: list[float] = Field(
        ...,
        min_length=2,
        description="Observed process values"
    )


class ControlChartResponse(BaseModel):
    """
    Statistical Process Control Response
    """

    chart_type: str

    center_line: float

    upper_control_limit: float

    lower_control_limit: float

    process_status: str

    recommendation: str
    # ============================================================
# FAILURE MODE AND EFFECTS ANALYSIS (FMEA)
# ============================================================

class FMEARequest(BaseModel):
    """
    Failure Mode and Effects Analysis Request
    """

    failure_mode: str

    severity: int = Field(..., ge=1, le=10)

    occurrence: int = Field(..., ge=1, le=10)

    detection: int = Field(..., ge=1, le=10)


class FMEAResponse(BaseModel):
    """
    Failure Mode and Effects Analysis Response
    """

    failure_mode: str

    severity: int

    occurrence: int

    detection: int

    rpn: int

    risk_level: str

    recommendation: str
    # ============================================================
# LEAN WASTE DETECTION
# ============================================================

class WasteDetectionRequest(BaseModel):
    """
    Lean Waste Detection Request
    """

    process_name: str

    waste_type: str

    description: str

    severity: int = Field(..., ge=1, le=10)


class WasteDetectionResponse(BaseModel):
    """
    Lean Waste Detection Response
    """

    process_name: str

    waste_type: str

    severity: int

    impact: str

    recommendation: str
    # ============================================================
# CONTINUOUS IMPROVEMENT DASHBOARD
# ============================================================

class ContinuousImprovementResponse(BaseModel):
    """
    Executive Lean Six Sigma Dashboard
    """

    sigma_status: str

    process_capability: str

    waste_status: str

    copq_status: str

    control_chart_status: str

    overall_health: str

    executive_recommendation: str