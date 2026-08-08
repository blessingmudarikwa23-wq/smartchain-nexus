from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================================
# DMAIC
# ==========================================================

class DMACBase(BaseModel):
    project_name: str
    define: str
    measure: str
    analyze: str
    improve: str
    control: str
    improvement_percentage: Optional[float] = None
    status: str = "Active"


class DMACCreate(DMACBase):
    pass


class DMACUpdate(BaseModel):
    project_name: Optional[str] = None
    define: Optional[str] = None
    measure: Optional[str] = None
    analyze: Optional[str] = None
    improve: Optional[str] = None
    control: Optional[str] = None
    improvement_percentage: Optional[float] = None
    status: Optional[str] = None


class DMACResponse(DMACBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# Public DMAIC aliases
DMAICBase = DMACBase
DMAICCreate = DMACCreate
DMAICUpdate = DMACUpdate
DMAICResponse = DMACResponse


# ==========================================================
# SIPOC
# ==========================================================

class SIPOCBase(BaseModel):
    process_name: str
    suppliers: str
    inputs: str
    process: str
    outputs: str
    customers: str
    status: str = "Active"


class SIPOCCreate(SIPOCBase):
    pass


class SIPOCUpdate(BaseModel):
    process_name: Optional[str] = None
    suppliers: Optional[str] = None
    inputs: Optional[str] = None
    process: Optional[str] = None
    outputs: Optional[str] = None
    customers: Optional[str] = None
    status: Optional[str] = None


class SIPOCResponse(SIPOCBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# FISHBONE ANALYSIS
# ==========================================================

class FishboneAnalysisBase(BaseModel):
    problem: str
    people: str
    process: str
    equipment: str
    materials: str
    environment: str
    measurement: str
    status: str = "Active"


class FishboneAnalysisCreate(FishboneAnalysisBase):
    pass


class FishboneAnalysisUpdate(BaseModel):
    problem: Optional[str] = None
    people: Optional[str] = None
    process: Optional[str] = None
    equipment: Optional[str] = None
    materials: Optional[str] = None
    environment: Optional[str] = None
    measurement: Optional[str] = None
    status: Optional[str] = None


class FishboneAnalysisResponse(FishboneAnalysisBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# PARETO ANALYSIS
# ==========================================================

class ParetoAnalysisBase(BaseModel):
    problem: str
    category: str
    frequency: int
    percentage: float
    cumulative_percentage: float
    status: str = "Active"


class ParetoAnalysisCreate(ParetoAnalysisBase):
    pass


class ParetoAnalysisUpdate(BaseModel):
    problem: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[int] = None
    percentage: Optional[float] = None
    cumulative_percentage: Optional[float] = None
    status: Optional[str] = None


class ParetoAnalysisResponse(ParetoAnalysisBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# FMEA
# ==========================================================

class FMEABase(BaseModel):
    process_step: str
    failure_mode: str
    effect: str
    cause: str
    severity: int
    occurrence: int
    detection: int
    rpn: int
    recommended_action: str
    status: str = "Active"


class FMEACreate(FMEABase):
    pass


class FMEAUpdate(BaseModel):
    process_step: Optional[str] = None
    failure_mode: Optional[str] = None
    effect: Optional[str] = None
    cause: Optional[str] = None
    severity: Optional[int] = None
    occurrence: Optional[int] = None
    detection: Optional[int] = None
    rpn: Optional[int] = None
    recommended_action: Optional[str] = None
    status: Optional[str] = None


class FMEAResponse(FMEABase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# CONTROL CHARTS
# ==========================================================

class ControlChartBase(BaseModel):
    process_name: str
    measurement: float
    mean: float
    upper_control_limit: float
    lower_control_limit: float
    status: str = "Active"


class ControlChartCreate(ControlChartBase):
    pass


class ControlChartUpdate(BaseModel):
    process_name: Optional[str] = None
    measurement: Optional[float] = None
    mean: Optional[float] = None
    upper_control_limit: Optional[float] = None
    lower_control_limit: Optional[float] = None
    status: Optional[str] = None


class ControlChartResponse(ControlChartBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# ROOT CAUSE ANALYSIS
# ==========================================================

class RootCauseAnalysisBase(BaseModel):
    issue: str
    root_cause: str
    analysis: str
    corrective_action: str
    status: str = "Active"


class RootCauseAnalysisCreate(RootCauseAnalysisBase):
    pass


class RootCauseAnalysisUpdate(BaseModel):
    issue: Optional[str] = None
    root_cause: Optional[str] = None
    analysis: Optional[str] = None
    corrective_action: Optional[str] = None
    status: Optional[str] = None


class RootCauseAnalysisResponse(RootCauseAnalysisBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# LEAN SIX SIGMA DASHBOARD
# ==========================================================

class LeanSixSigmaDashboard(BaseModel):
    dmaic: list[DMAICResponse]
    sipoc: list[SIPOCResponse]
    fishbone: list[FishboneAnalysisResponse]
    pareto: list[ParetoAnalysisResponse]
    fmea: list[FMEAResponse]
    control_charts: list[ControlChartResponse]
    root_causes: list[RootCauseAnalysisResponse]