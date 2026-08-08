from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.inventory.schemas import (
    InventoryDashboard,

    InventoryAdjustmentCreate,
    InventoryAdjustmentUpdate,
    InventoryAdjustmentResponse,
)

from app.inventory.service import (
    get_inventory_dashboard,

    create_inventory_adjustment,
    get_inventory_adjustments,
    get_inventory_adjustment,
    update_inventory_adjustment,
    delete_inventory_adjustment,
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)


# ==========================================================
# DASHBOARD
# ==========================================================

@router.get(
    "/dashboard",
    response_model=InventoryDashboard,
)
def inventory_dashboard():
    return get_inventory_dashboard()


# ==========================================================
# INVENTORY ADJUSTMENTS
# ==========================================================

@router.post(
    "/adjustments",
    response_model=InventoryAdjustmentResponse,
    status_code=201,
)
def create_adjustment(
    adjustment: InventoryAdjustmentCreate,
    db: Session = Depends(get_db),
):
    return create_inventory_adjustment(
        adjustment,
        db,
    )


@router.get(
    "/adjustments",
    response_model=list[InventoryAdjustmentResponse],
)
def read_adjustments(
    db: Session = Depends(get_db),
):
    return get_inventory_adjustments(db)


@router.get(
    "/adjustments/{adjustment_id}",
    response_model=InventoryAdjustmentResponse,
)
def read_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
):

    adjustment = get_inventory_adjustment(
        adjustment_id,
        db,
    )

    if adjustment is None:
        raise HTTPException(
            status_code=404,
            detail="Adjustment not found",
        )

    return adjustment


@router.put(
    "/adjustments/{adjustment_id}",
    response_model=InventoryAdjustmentResponse,
)
def update_adjustment(
    adjustment_id: int,
    adjustment: InventoryAdjustmentUpdate,
    db: Session = Depends(get_db),
):

    updated = update_inventory_adjustment(
        adjustment_id,
        adjustment,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Adjustment not found",
        )

    return updated


@router.delete(
    "/adjustments/{adjustment_id}",
)
def remove_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
):

    deleted = delete_inventory_adjustment(
        adjustment_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Adjustment not found",
        )

    return {
        "message": "Inventory adjustment deleted successfully"
    }
# ==========================================================
# ABC ANALYSIS IMPORTS
# ==========================================================

from app.inventory.schemas import (
    ABCAnalysisCreate,
    ABCAnalysisUpdate,
    ABCAnalysisResponse,
)

from app.inventory.service import (
    create_abc_analysis,
    get_abc_analysis,
    get_single_abc_analysis,
    update_abc_analysis,
    delete_abc_analysis,
)


# ==========================================================
# ABC ANALYSIS ROUTES
# ==========================================================

@router.post(
    "/abc-analysis",
    response_model=ABCAnalysisResponse,
    status_code=201,
)
def create_new_abc_analysis(
    analysis: ABCAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_abc_analysis(
        analysis,
        db,
    )


@router.get(
    "/abc-analysis",
    response_model=list[ABCAnalysisResponse],
)
def get_all_abc_analysis(
    db: Session = Depends(get_db),
):
    return get_abc_analysis(db)


@router.get(
    "/abc-analysis/{analysis_id}",
    response_model=ABCAnalysisResponse,
)
def get_one_abc_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_single_abc_analysis(
        analysis_id,
        db,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="ABC Analysis not found",
        )

    return analysis


@router.put(
    "/abc-analysis/{analysis_id}",
    response_model=ABCAnalysisResponse,
)
def update_one_abc_analysis(
    analysis_id: int,
    analysis: ABCAnalysisUpdate,
    db: Session = Depends(get_db),
):
    updated = update_abc_analysis(
        analysis_id,
        analysis,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="ABC Analysis not found",
        )

    return updated


@router.delete(
    "/abc-analysis/{analysis_id}",
)
def delete_one_abc_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_abc_analysis(
        analysis_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="ABC Analysis not found",
        )

    return {
        "message": "ABC Analysis deleted successfully"
    }
# ==========================================================
# XYZ ANALYSIS IMPORTS
# ==========================================================

from app.inventory.schemas import (
    XYZAnalysisCreate,
    XYZAnalysisUpdate,
    XYZAnalysisResponse,
)

from app.inventory.service import (
    create_xyz_analysis,
    get_xyz_analysis,
    get_single_xyz_analysis,
    update_xyz_analysis,
    delete_xyz_analysis,
)


# ==========================================================
# XYZ ANALYSIS ROUTES
# ==========================================================

@router.post(
    "/xyz-analysis",
    response_model=XYZAnalysisResponse,
    status_code=201,
)
def create_new_xyz_analysis(
    analysis: XYZAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_xyz_analysis(
        analysis,
        db,
    )


@router.get(
    "/xyz-analysis",
    response_model=list[XYZAnalysisResponse],
)
def get_all_xyz_analysis(
    db: Session = Depends(get_db),
):
    return get_xyz_analysis(db)


@router.get(
    "/xyz-analysis/{analysis_id}",
    response_model=XYZAnalysisResponse,
)
def get_one_xyz_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_single_xyz_analysis(
        analysis_id,
        db,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="XYZ Analysis not found",
        )

    return analysis


@router.put(
    "/xyz-analysis/{analysis_id}",
    response_model=XYZAnalysisResponse,
)
def update_one_xyz_analysis(
    analysis_id: int,
    analysis: XYZAnalysisUpdate,
    db: Session = Depends(get_db),
):
    updated = update_xyz_analysis(
        analysis_id,
        analysis,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="XYZ Analysis not found",
        )

    return updated


@router.delete(
    "/xyz-analysis/{analysis_id}",
)
def delete_one_xyz_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_xyz_analysis(
        analysis_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="XYZ Analysis not found",
        )

    return {
        "message": "XYZ Analysis deleted successfully"
    }
# ==========================================================
# EOQ ROUTES
# ==========================================================

from app.inventory.schemas import (
    EOQAnalysisCreate,
    EOQAnalysisUpdate,
    EOQAnalysisResponse,
)

from app.inventory.service import (
    create_eoq_analysis,
    get_eoq_analysis,
    get_single_eoq_analysis,
    update_eoq_analysis,
    delete_eoq_analysis,
)


@router.post(
    "/eoq-analysis",
    response_model=EOQAnalysisResponse,
    status_code=201,
)
def create_eoq(
    analysis: EOQAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_eoq_analysis(
        analysis,
        db,
    )


@router.get(
    "/eoq-analysis",
    response_model=list[EOQAnalysisResponse],
)
def get_all_eoq(
    db: Session = Depends(get_db),
):
    return get_eoq_analysis(db)


@router.get(
    "/eoq-analysis/{analysis_id}",
    response_model=EOQAnalysisResponse,
)
def get_eoq(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_single_eoq_analysis(
        analysis_id,
        db,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="EOQ analysis not found",
        )

    return analysis


@router.put(
    "/eoq-analysis/{analysis_id}",
    response_model=EOQAnalysisResponse,
)
def update_eoq(
    analysis_id: int,
    analysis: EOQAnalysisUpdate,
    db: Session = Depends(get_db),
):
    updated = update_eoq_analysis(
        analysis_id,
        analysis,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="EOQ analysis not found",
        )

    return updated


@router.delete(
    "/eoq-analysis/{analysis_id}",
)
def delete_eoq(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_eoq_analysis(
        analysis_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="EOQ analysis not found",
        )

    return {
        "message": "EOQ analysis deleted successfully"
    }
# ==========================================================
# SAFETY STOCK ROUTES
# ==========================================================

from app.inventory.schemas import (
    SafetyStockCreate,
    SafetyStockUpdate,
    SafetyStockResponse,
)
from app.inventory.service import (
    create_safety_stock,
    get_safety_stock,
    get_safety_stock_by_id,
    update_safety_stock,
    delete_safety_stock,
)


@router.post(
    "/safety-stock",
    response_model=SafetyStockResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_safety_stock_route(
    payload: SafetyStockCreate,
    db: Session = Depends(get_db),
):
    return create_safety_stock(db, payload)


@router.get(
    "/safety-stock",
    response_model=list[SafetyStockResponse],
)
def get_safety_stock_route(
    db: Session = Depends(get_db),
):
    return get_safety_stock(db)


@router.get(
    "/safety-stock/{record_id}",
    response_model=SafetyStockResponse,
)
def get_safety_stock_by_id_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_safety_stock_by_id(db, record_id)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Safety Stock record not found",
        )

    return record


@router.put(
    "/safety-stock/{record_id}",
    response_model=SafetyStockResponse,
)
def update_safety_stock_route(
    record_id: int,
    payload: SafetyStockUpdate,
    db: Session = Depends(get_db),
):
    record = update_safety_stock(db, record_id, payload)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Safety Stock record not found",
        )

    return record


@router.delete("/safety-stock/{record_id}")
def delete_safety_stock_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_safety_stock(db, record_id)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Safety Stock record not found",
        )
# ==========================================================
# REORDER POINT ROUTES
# ==========================================================

from app.inventory.schemas import (
    ReorderPointCreate,
    ReorderPointUpdate,
    ReorderPointResponse,
)

from app.inventory.service import (
    create_reorder_point,
    get_reorder_points,
    get_reorder_point,
    update_reorder_point,
    delete_reorder_point,
)


# ----------------------------------------------------------
# CREATE
# ----------------------------------------------------------

@router.post(
    "/reorder-point",
    response_model=ReorderPointResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_reorder_point_route(
    payload: ReorderPointCreate,
    db: Session = Depends(get_db),
):
    return create_reorder_point(db, payload)


# ----------------------------------------------------------
# GET ALL
# ----------------------------------------------------------

@router.get(
    "/reorder-point",
    response_model=list[ReorderPointResponse],
)
def get_reorder_points_route(
    db: Session = Depends(get_db),
):
    return get_reorder_points(db)


# ----------------------------------------------------------
# GET ONE
# ----------------------------------------------------------

@router.get(
    "/reorder-point/{record_id}",
    response_model=ReorderPointResponse,
)
def get_reorder_point_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_reorder_point(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reorder Point not found",
        )

    return record


# ----------------------------------------------------------
# UPDATE
# ----------------------------------------------------------

@router.put(
    "/reorder-point/{record_id}",
    response_model=ReorderPointResponse,
)
def update_reorder_point_route(
    record_id: int,
    payload: ReorderPointUpdate,
    db: Session = Depends(get_db),
):
    record = update_reorder_point(db, record_id, payload)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reorder Point not found",
        )

    return record


# ----------------------------------------------------------
# DELETE
# ----------------------------------------------------------

@router.delete(
    "/reorder-point/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_reorder_point_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_reorder_point(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reorder Point not found",
        )

    return {
        "message": "Reorder Point deleted successfully"
    }
# ==========================================================
# INVENTORY TURNOVER ROUTES
# ==========================================================

from app.inventory.schemas import (
    InventoryTurnoverCreate,
    InventoryTurnoverUpdate,
    InventoryTurnoverResponse,
)

from app.inventory.service import (
    create_inventory_turnover,
    get_inventory_turnover,
    get_inventory_turnover_by_id,
    update_inventory_turnover,
    delete_inventory_turnover,
)


@router.post(
    "/inventory-turnover",
    response_model=InventoryTurnoverResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_turnover_route(
    payload: InventoryTurnoverCreate,
    db: Session = Depends(get_db),
):
    return create_inventory_turnover(
        db,
        payload,
    )


@router.get(
    "/inventory-turnover",
    response_model=list[InventoryTurnoverResponse],
)
def get_inventory_turnover_route(
    db: Session = Depends(get_db),
):
    return get_inventory_turnover(db)


@router.get(
    "/inventory-turnover/{record_id}",
    response_model=InventoryTurnoverResponse,
)
def get_inventory_turnover_by_id_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_inventory_turnover_by_id(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory Turnover record not found",
        )

    return record


@router.put(
    "/inventory-turnover/{record_id}",
    response_model=InventoryTurnoverResponse,
)
def update_inventory_turnover_route(
    record_id: int,
    payload: InventoryTurnoverUpdate,
    db: Session = Depends(get_db),
):
    record = update_inventory_turnover(
        db,
        record_id,
        payload,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory Turnover record not found",
        )

    return record


@router.delete(
    "/inventory-turnover/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_inventory_turnover_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_inventory_turnover(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory Turnover record not found",
        )

    return {
        "message": "Inventory Turnover deleted successfully"
    }