from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.inventory.schemas import (
    InventoryDashboard,
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse,
    InventoryAdjustmentCreate,
    InventoryAdjustmentUpdate,
    InventoryAdjustmentResponse,
    ABCAnalysisCreate,
    ABCAnalysisUpdate,
    ABCAnalysisResponse,
    XYZAnalysisCreate,
    XYZAnalysisUpdate,
    XYZAnalysisResponse,
    EOQAnalysisCreate,
    EOQAnalysisUpdate,
    EOQAnalysisResponse,
    SafetyStockCreate,
    SafetyStockUpdate,
    SafetyStockResponse,
    ReorderPointCreate,
    ReorderPointUpdate,
    ReorderPointResponse,
    InventoryTurnoverCreate,
    InventoryTurnoverUpdate,
    InventoryTurnoverResponse,
    InventoryTransactionCreate,
    InventoryTransactionUpdate,
    InventoryTransactionResponse,
)

from app.inventory.service import (
    get_inventory_dashboard,

    create_inventory_item,
    get_inventory_items,
    get_inventory_item,
    update_inventory_item,
    delete_inventory_item,

    create_inventory_adjustment,
    get_inventory_adjustments,
    get_inventory_adjustment,
    update_inventory_adjustment,
    delete_inventory_adjustment,

    create_abc_analysis,
    get_abc_analysis,
    get_single_abc_analysis,
    update_abc_analysis,
    delete_abc_analysis,

    create_xyz_analysis,
    get_xyz_analysis,
    get_single_xyz_analysis,
    update_xyz_analysis,
    delete_xyz_analysis,

    create_eoq_analysis,
    get_eoq_analysis,
    get_single_eoq_analysis,
    update_eoq_analysis,
    delete_eoq_analysis,

    create_safety_stock,
    get_safety_stock,
    get_safety_stock_by_id,
    update_safety_stock,
    delete_safety_stock,

    create_reorder_point,
    get_reorder_points,
    get_reorder_point,
    update_reorder_point,
    delete_reorder_point,

    create_inventory_turnover,
    get_inventory_turnover,
    get_inventory_turnover_by_id,
    update_inventory_turnover,
    delete_inventory_turnover,

    create_inventory_transaction,
    get_inventory_transactions,
    get_inventory_transaction,
    update_inventory_transaction,
    delete_inventory_transaction,
)


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)


# ==========================================================
# INVENTORY DASHBOARD
# ==========================================================

@router.get(
    "/dashboard",
    response_model=InventoryDashboard,
)
def inventory_dashboard():
    return get_inventory_dashboard()


# ==========================================================
# INVENTORY ITEMS
# ==========================================================

@router.post(
    "/",
    response_model=InventoryItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory(
    item: InventoryItemCreate,
    db: Session = Depends(get_db),
):
    return create_inventory_item(
        item,
        db,
    )


@router.get(
    "/",
    response_model=list[InventoryItemResponse],
)
def read_inventory(
    db: Session = Depends(get_db),
):
    return get_inventory_items(db)


# ==========================================================
# INVENTORY ADJUSTMENTS
# ==========================================================

@router.post(
    "/adjustments",
    response_model=InventoryAdjustmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_adjustment(
    adjustment: InventoryAdjustmentCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_inventory_adjustment(
            adjustment,
            db,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory adjustment not found",
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
    try:
        updated = update_inventory_adjustment(
            adjustment_id,
            adjustment,
            db,
        )

        if updated is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory adjustment not found",
            )

        return updated

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.delete(
    "/adjustments/{adjustment_id}",
)
def remove_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
):
    try:
        deleted = delete_inventory_adjustment(
            adjustment_id,
            db,
        )

        if deleted is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory adjustment not found",
            )

        return {
            "message": "Inventory adjustment deleted successfully"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


# ==========================================================
# ABC ANALYSIS
# ==========================================================

@router.post(
    "/abc-analysis",
    response_model=ABCAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
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
            status_code=status.HTTP_404_NOT_FOUND,
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
            status_code=status.HTTP_404_NOT_FOUND,
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ABC Analysis not found",
        )

    return {
        "message": "ABC Analysis deleted successfully"
    }


# ==========================================================
# XYZ ANALYSIS
# ==========================================================

@router.post(
    "/xyz-analysis",
    response_model=XYZAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
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
            status_code=status.HTTP_404_NOT_FOUND,
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
            status_code=status.HTTP_404_NOT_FOUND,
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="XYZ Analysis not found",
        )

    return {
        "message": "XYZ Analysis deleted successfully"
    }


# ==========================================================
# EOQ ANALYSIS
# ==========================================================

@router.post(
    "/eoq-analysis",
    response_model=EOQAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
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
def get_one_eoq(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_single_eoq_analysis(
        analysis_id,
        db,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="EOQ Analysis not found",
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="EOQ Analysis not found",
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="EOQ Analysis not found",
        )

    return {
        "message": "EOQ Analysis deleted successfully"
    }


# ==========================================================
# SAFETY STOCK
# ==========================================================

@router.post(
    "/safety-stock",
    response_model=SafetyStockResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_safety_stock_route(
    payload: SafetyStockCreate,
    db: Session = Depends(get_db),
):
    return create_safety_stock(
        db,
        payload,
    )


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
    record = get_safety_stock_by_id(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
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
    record = update_safety_stock(
        db,
        record_id,
        payload,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety Stock record not found",
        )

    return record


@router.delete(
    "/safety-stock/{record_id}",
)
def delete_safety_stock_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_safety_stock(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety Stock record not found",
        )

    return {
        "message": "Safety Stock deleted successfully"
    }


# ==========================================================
# REORDER POINT
# ==========================================================

@router.post(
    "/reorder-point",
    response_model=ReorderPointResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_reorder_point_route(
    payload: ReorderPointCreate,
    db: Session = Depends(get_db),
):
    return create_reorder_point(
        db,
        payload,
    )


@router.get(
    "/reorder-point",
    response_model=list[ReorderPointResponse],
)
def get_reorder_points_route(
    db: Session = Depends(get_db),
):
    return get_reorder_points(db)


@router.get(
    "/reorder-point/{record_id}",
    response_model=ReorderPointResponse,
)
def get_reorder_point_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_reorder_point(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reorder Point not found",
        )

    return record


@router.put(
    "/reorder-point/{record_id}",
    response_model=ReorderPointResponse,
)
def update_reorder_point_route(
    record_id: int,
    payload: ReorderPointUpdate,
    db: Session = Depends(get_db),
):
    record = update_reorder_point(
        db,
        record_id,
        payload,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reorder Point not found",
        )

    return record


@router.delete(
    "/reorder-point/{record_id}",
)
def delete_reorder_point_route(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = delete_reorder_point(
        db,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reorder Point not found",
        )

    return {
        "message": "Reorder Point deleted successfully"
    }


# ==========================================================
# INVENTORY TURNOVER
# ==========================================================

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


# ==========================================================
# INVENTORY TRANSACTIONS
# ==========================================================

@router.post(
    "/transactions",
    response_model=InventoryTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_transaction_route(
    payload: InventoryTransactionCreate,
    db: Session = Depends(get_db),
):
    return create_inventory_transaction(
        db,
        payload,
    )


@router.get(
    "/transactions",
    response_model=list[InventoryTransactionResponse],
)
def get_inventory_transactions_route(
    db: Session = Depends(get_db),
):
    return get_inventory_transactions(db)


@router.get(
    "/transactions/{transaction_id}",
    response_model=InventoryTransactionResponse,
)
def get_inventory_transaction_route(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    record = get_inventory_transaction(
        db,
        transaction_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory transaction not found",
        )

    return record


@router.put(
    "/transactions/{transaction_id}",
    response_model=InventoryTransactionResponse,
)
def update_inventory_transaction_route(
    transaction_id: int,
    payload: InventoryTransactionUpdate,
    db: Session = Depends(get_db),
):
    record = update_inventory_transaction(
        db,
        transaction_id,
        payload,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory transaction not found",
        )

    return record


@router.delete(
    "/transactions/{transaction_id}",
)
def delete_inventory_transaction_route(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    record = delete_inventory_transaction(
        db,
        transaction_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory transaction not found",
        )

    return {
        "message": "Inventory transaction deleted successfully"
    }


# ==========================================================
# INVENTORY ITEM DYNAMIC ROUTES
# ==========================================================
# Keep these routes LAST so they do not interfere with
# static routes such as /dashboard, /transactions, etc.
# ==========================================================

@router.get(
    "/{item_id}",
    response_model=InventoryItemResponse,
)
def read_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = get_inventory_item(
        item_id,
        db,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return item


@router.put(
    "/{item_id}",
    response_model=InventoryItemResponse,
)
def update_inventory(
    item_id: int,
    item_data: InventoryItemUpdate,
    db: Session = Depends(get_db),
):
    item = update_inventory_item(
        item_id,
        item_data,
        db,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return item


@router.delete(
    "/{item_id}",
)
def delete_inventory(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = delete_inventory_item(
        item_id,
        db,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return {
        "message": "Inventory item deleted successfully"
    }