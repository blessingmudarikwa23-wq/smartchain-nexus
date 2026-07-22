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
FMEARequest,
FMEAResponse,
WasteDetectionRequest,
WasteDetectionResponse,
ContinuousImprovementResponse,
)

from math import erf, sqrt

from backend.app.schemas.lean_six_sigma import (
    SigmaCalculationRequest,
    SigmaCalculationResponse,
)


class LeanSixSigmaService:
    """
    Service class responsible for Lean Six Sigma calculations.
    """

    @staticmethod
    def calculate_sigma(
        request: SigmaCalculationRequest,
    ) -> SigmaCalculationResponse:
        """
        Calculate DPMO, Yield, Sigma Level, Assessment and Recommendation.
        """

        total_opportunities = (
            request.units * request.opportunities_per_unit
        )

        dpmo = (
            request.defects / total_opportunities
        ) * 1_000_000

        yield_percentage = (
            1 - (request.defects / total_opportunities)
        ) * 100

        defect_rate = request.defects / total_opportunities

        # Approximate Sigma Level
        sigma_level = (
            sqrt(2)
            * LeanSixSigmaService.inverse_error_function(
                1 - (2 * defect_rate)
            )
        ) + 1.5

        if sigma_level >= 6:
            assessment = "World Class Process"

            recommendation = (
                "Maintain continuous monitoring and sustain improvements."
            )

        elif sigma_level >= 5:
            assessment = "Excellent Process"

            recommendation = (
                "Focus on preventive controls and continuous improvement."
            )

        elif sigma_level >= 4:
            assessment = "Good Process"

            recommendation = (
                "Reduce process variation through root cause analysis."
            )

        elif sigma_level >= 3:
            assessment = "Average Process"

            recommendation = (
                "Implement Lean improvements and reduce defects."
            )

        else:
            assessment = "Poor Process"

            recommendation = (
                "Immediate DMAIC improvement project recommended."
            )

        return SigmaCalculationResponse(
            dpmo=round(dpmo, 2),
            yield_percentage=round(yield_percentage, 2),
            sigma_level=round(sigma_level, 2),
            assessment=assessment,
            recommendation=recommendation,
        )

    @staticmethod
    def generate_sipoc(
        request: SIPOCRequest,
    ) -> SIPOCResponse:
        """
        Generate a SIPOC summary.
        """

        return SIPOCResponse(
            suppliers=request.suppliers,
            inputs=request.inputs,
            process=request.process,
            outputs=request.outputs,
            customers=request.customers,
            supplier_count=len(request.suppliers),
            process_steps=len(request.process),
            customer_count=len(request.customers),
        )
    
    @staticmethod
    def pareto_analysis(
        request: ParetoRequest,
    ) -> ParetoResponse:
        """
        Perform Pareto Analysis (80/20 Rule).
        """

        sorted_causes = sorted(
            request.causes,
            key=lambda x: x.count,
            reverse=True,
        )

        total = sum(cause.count for cause in sorted_causes)

        cumulative = 0.0
        results = []

        for cause in sorted_causes:

            percentage = (cause.count / total) * 100

            cumulative += percentage

            results.append(
                ParetoResult(
                    name=cause.name,
                    count=cause.count,
                    percentage=round(percentage, 2),
                    cumulative_percentage=round(cumulative, 2),
                    critical=cumulative <= 80,
                )
            )

        return ParetoResponse(
            total_occurrences=total,
            results=results,
        )
    @staticmethod
    def fishbone_analysis(
        request: FishboneRequest,
    ) -> FishboneResponse:
        """
        Generate Fishbone (Ishikawa) Analysis.
        """

        total_causes = sum(
            len(category.causes)
            for category in request.categories
        )

        return FishboneResponse(
            problem=request.problem,
            total_categories=len(request.categories),
            total_causes=total_causes,
            categories=request.categories,
        )

    @staticmethod
    def dmaic_project(
        request: DMAICRequest,
    ) -> DMAICResponse:
        """
        Generate a DMAIC Improvement Roadmap.
        """

        improvement = (
            request.target_sigma_level
            - request.current_sigma_level
        )

        return DMAICResponse(
            project_name=request.project_name,

            define=(
                f"Define the problem: "
                f"{request.problem_statement}. "
                f"Objective: {request.objective}."
            ),

            measure=(
                f"Measure current performance. "
                f"Current Sigma Level: "
                f"{request.current_sigma_level}."
            ),

            analyze=(
                "Analyze process variation using "
                "Pareto Analysis, Fishbone Diagram, "
                "SIPOC Mapping and Root Cause Analysis."
            ),

            improve=(
                "Implement Lean improvements, eliminate waste, "
                "optimize workflow and validate improvements."
            ),

            control=(
                "Monitor KPIs using dashboards, "
                "control charts, SOPs and continuous audits."
            ),

            estimated_sigma_improvement=round(
                improvement,
                2,
            ),
        )
    @staticmethod
    def calculate_copq(
        request: COPQRequest,
    ) -> COPQResponse:
        """
        Calculate the Cost of Poor Quality (COPQ).
        """

        total = (
            request.internal_failure_cost
            + request.external_failure_cost
            + request.appraisal_cost
            + request.prevention_cost
        )

        if total >= 100000:
            recommendation = (
                "Critical quality costs detected. "
                "Launch an immediate Lean Six Sigma improvement project."
            )

        elif total >= 50000:
            recommendation = (
                "Quality costs are high. Focus on reducing failures "
                "through DMAIC and process improvement."
            )

        elif total >= 20000:
            recommendation = (
                "Quality costs are moderate. Increase prevention "
                "activities and continuous improvement initiatives."
            )

        else:
            recommendation = (
                "Quality costs are under control. Maintain preventive "
                "quality practices and monitor KPIs."
            )

        return COPQResponse(
            internal_failure_cost=request.internal_failure_cost,
            external_failure_cost=request.external_failure_cost,
            appraisal_cost=request.appraisal_cost,
            prevention_cost=request.prevention_cost,
            total_copq=round(total, 2),
            recommendation=recommendation,
        )
    @staticmethod
    def calculate_process_capability(
        request: ProcessCapabilityRequest,
    ) -> ProcessCapabilityResponse:
        """
        Calculate Process Capability (Cp and Cpk).
        """

        cp = (
            request.upper_spec_limit
            - request.lower_spec_limit
        ) / (
            6 * request.process_standard_deviation
        )

        cpu = (
            request.upper_spec_limit
            - request.process_mean
        ) / (
            3 * request.process_standard_deviation
        )

        cpl = (
            request.process_mean
            - request.lower_spec_limit
        ) / (
            3 * request.process_standard_deviation
        )

        cpk = min(cpu, cpl)

        if cpk >= 2.0:
            capability = "World Class"

            recommendation = (
                "Excellent process capability. Maintain current controls."
            )

        elif cpk >= 1.33:
            capability = "Capable"

            recommendation = (
                "Process meets industry standards. Continue monitoring."
            )

        elif cpk >= 1.0:
            capability = "Marginal"

            recommendation = (
                "Process is barely capable. Reduce variation."
            )

        else:
            capability = "Not Capable"

            recommendation = (
                "Immediate process improvement is required."
            )

        return ProcessCapabilityResponse(
            cp=round(cp, 2),
            cpk=round(cpk, 2),
            capability_level=capability,
            recommendation=recommendation,
        )

    @staticmethod
    def calculate_xbar_chart(
        request: XBarChartRequest,
    ) -> XBarChartResponse:
        """
        Calculate X-Bar Control Chart.
        """

        sample_means = request.sample_means

        overall_mean = sum(sample_means) / len(sample_means)

        # Estimate process variation
        sigma = (
            sum(
                (x - overall_mean) ** 2
                for x in sample_means
            )
            / len(sample_means)
        ) ** 0.5

        # 3-Sigma Control Limits
        ucl = overall_mean + (3 * sigma)

        lcl = overall_mean - (3 * sigma)

        out_of_control = any(
            x > ucl or x < lcl
            for x in sample_means
        )

        if out_of_control:
            status = "Out of Control"

            recommendation = (
                "Investigate special causes of variation immediately."
            )

        else:
            status = "Stable"

            recommendation = (
                "Process is statistically stable. Continue monitoring."
            )

        return XBarChartResponse(
            overall_mean=round(overall_mean, 2),
            ucl=round(ucl, 2),
            lcl=round(lcl, 2),
            process_status=status,
            recommendation=recommendation,
        )
    @staticmethod
    def calculate_control_chart(
        request: ControlChartRequest,
    ) -> ControlChartResponse:
        """
        General Statistical Process Control Engine.
        Supports:
        - XBAR
        - R
        - P
        - NP
        """

        data = request.data

        center_line = sum(data) / len(data)

        sigma = (
            sum((x - center_line) ** 2 for x in data)
            / len(data)
        ) ** 0.5

        ucl = center_line + (3 * sigma)
        lcl = center_line - (3 * sigma)

        out_of_control = any(
            value > ucl or value < lcl
            for value in data
        )

        if out_of_control:
            status = "Out of Control"

            recommendation = (
                "Special cause variation detected. "
                "Investigate immediately."
            )

        else:
            status = "Stable"

            recommendation = (
                "Process is statistically stable."
            )

        return ControlChartResponse(
            chart_type=request.chart_type.upper(),
            center_line=round(center_line, 2),
            upper_control_limit=round(ucl, 2),
            lower_control_limit=round(lcl, 2),
            process_status=status,
            recommendation=recommendation,
        )

    @staticmethod
    def calculate_fmea(
        request: FMEARequest,
    ) -> FMEAResponse:
        """
        Calculate Failure Mode and Effects Analysis (FMEA).
        """

        rpn = (
            request.severity
            * request.occurrence
            * request.detection
        )

        if rpn >= 200:
            risk_level = "Critical"

            recommendation = (
                "Immediate corrective action required."
            )

        elif rpn >= 100:
            risk_level = "High"

            recommendation = (
                "Implement corrective actions as soon as possible."
            )

        elif rpn >= 50:
            risk_level = "Medium"

            recommendation = (
                "Monitor closely and plan improvements."
            )

        else:
            risk_level = "Low"

            recommendation = (
                "Current controls are acceptable."
            )

        return FMEAResponse(
            failure_mode=request.failure_mode,
            severity=request.severity,
            occurrence=request.occurrence,
            detection=request.detection,
            rpn=rpn,
            risk_level=risk_level,
            recommendation=recommendation,
    )
    @staticmethod
    def detect_waste(
        request: WasteDetectionRequest,
    ) -> WasteDetectionResponse:
        """
        Analyze Lean Waste and provide recommendations.
        """

        if request.severity >= 8:
            impact = "Critical"

        elif request.severity >= 5:
            impact = "Moderate"

        else:
            impact = "Low"

        recommendations = {
            "Defects": "Improve quality control and implement root cause analysis.",
            "Overproduction": "Align production with customer demand.",
            "Waiting": "Reduce bottlenecks and improve workflow.",
            "Non-utilized Talent": "Empower employees and utilize their skills.",
            "Transportation": "Optimize warehouse layout and logistics routes.",
            "Inventory": "Reduce excess inventory using JIT principles.",
            "Motion": "Improve workstation ergonomics and layout.",
            "Extra Processing": "Remove unnecessary process steps."
        }

        recommendation = recommendations.get(
            request.waste_type,
            "Review the process and eliminate non-value-added activities."
        )

        return WasteDetectionResponse(
            process_name=request.process_name,
            waste_type=request.waste_type,
            severity=request.severity,
            impact=impact,
            recommendation=recommendation,
        )
    @staticmethod
    def continuous_improvement_dashboard(
    ) -> ContinuousImprovementResponse:
        """
        Executive Lean Six Sigma Dashboard
        """

        return ContinuousImprovementResponse(

            sigma_status="4.8 Sigma",

            process_capability="Stable",

            waste_status="Moderate Waste Detected",

            copq_status="Within Target",

            control_chart_status="In Control",

            overall_health="Good",

            executive_recommendation=(
                "Continue DMAIC projects, "
                "reduce waiting waste, "
                "monitor process capability "
                "and maintain statistical process control."
            ),
        )

    @staticmethod
    def inverse_error_function(x: float) -> float:
        """
        Approximate inverse error function.
        """

        a = 0.147

        sign = -1 if x < 0 else 1

        ln = __import__("math").log

        part1 = (
            2 / (__import__("math").pi * a)
        ) + ln(1 - x**2) / 2

        part2 = ln(1 - x**2) / a

        return sign * sqrt(
            sqrt(part1**2 - part2) - part1
        )
    
    