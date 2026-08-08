from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.warehouse.schemas import (
    WarehouseReceivingCreate,
    WarehouseReceivingUpdate,
    WarehouseReceivingResponse,
    WarehousePickingCreate,
    WarehousePickingUpdate,
    WarehousePickingResponse,
)

from app.warehouse.service import (
    create_receiving,
    get_receiving_records,
    get_receiving_record,
    update_receiving,
    delete_receiving,
    create_picking,
    get_picking_records,
    get_picking_record,
    update_picking,
    delete_picking,
)

router = APIRouter(
    prefix="/warehouse",
    tags=["Warehouse"],
)

# ==========================================================
# RECEIVING
# ==========================================================

@router.post(
    "/receiving",
    response_model=WarehouseReceivingResponse,
    status_code=201,
)
def create_new_receiving(
    receiving: WarehouseReceivingCreate,
    db: Session = Depends(get_db),
):
    return create_receiving(receiving, db)


@router.get(
    "/receiving",
    response_model=list[WarehouseReceivingResponse],
)
def get_all_receiving(
    db: Session = Depends(get_db),
):
    return get_receiving_records(db)


@router.get(
    "/receiving/{receiving_id}",
    response_model=WarehouseReceivingResponse,
)
def get_one_receiving(
    receiving_id: int,
    db: Session = Depends(get_db),
):
    receiving = get_receiving_record(receiving_id, db)

    if receiving is None:
        raise HTTPException(
            status_code=404,
            detail="Receiving record not found",
        )

    return receiving


@router.put(
    "/receiving/{receiving_id}",
    response_model=WarehouseReceivingResponse,
)
def update_one_receiving(
    receiving_id: int,
    receiving: WarehouseReceivingUpdate,
    db: Session = Depends(get_db),
):
    updated = update_receiving(
        receiving_id,
        receiving,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Receiving record not found",
        )

    return updated


@router.delete(
    "/receiving/{receiving_id}",
)
def delete_one_receiving(
    receiving_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_receiving(
        receiving_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Receiving record not found",
        )

    return {
        "message": "Receiving record deleted successfully"
    }


# ==========================================================
# PICKING
# ==========================================================

@router.post(
    "/picking",
    response_model=WarehousePickingResponse,
    status_code=201,
)
def create_new_picking(
    picking: WarehousePickingCreate,
    db: Session = Depends(get_db),
):
    return create_picking(picking, db)


@router.get(
    "/picking",
    response_model=list[WarehousePickingResponse],
)
def get_all_picking(
    db: Session = Depends(get_db),
):
    return get_picking_records(db)


@router.get(
    "/picking/{picking_id}",
    response_model=WarehousePickingResponse,
)
def get_one_picking(
    picking_id: int,
    db: Session = Depends(get_db),
):
    picking = get_picking_record(picking_id, db)

    if picking is None:
        raise HTTPException(
            status_code=404,
            detail="Picking record not found",
        )

    return picking


@router.put(
    "/picking/{picking_id}",
    response_model=WarehousePickingResponse,
)
def update_one_picking(
    picking_id: int,
    picking: WarehousePickingUpdate,
    db: Session = Depends(get_db),
):
    updated = update_picking(
        picking_id,
        picking,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Picking record not found",
        )

    return updated


@router.delete(
    "/picking/{picking_id}",
)
def delete_one_picking(
    picking_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_picking(
        picking_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Picking record not found",
        )

    return {
        "message": "Picking record deleted successfully"
    }
# ==========================================================
# PACKING
# ==========================================================

from app.warehouse.schemas import (
    WarehousePackingCreate,
    WarehousePackingUpdate,
    WarehousePackingResponse,
)

from app.warehouse.service import (
    create_packing,
    get_packing_records,
    get_packing_record,
    update_packing,
    delete_packing,
)


@router.post(
    "/packing",
    response_model=WarehousePackingResponse,
    status_code=201,
)
def create_new_packing(
    packing: WarehousePackingCreate,
    db: Session = Depends(get_db),
):
    return create_packing(
        packing,
        db,
    )


@router.get(
    "/packing",
    response_model=list[WarehousePackingResponse],
)
def get_all_packing(
    db: Session = Depends(get_db),
):
    return get_packing_records(
        db,
    )


@router.get(
    "/packing/{packing_id}",
    response_model=WarehousePackingResponse,
)
def get_one_packing(
    packing_id: int,
    db: Session = Depends(get_db),
):
    packing = get_packing_record(
        packing_id,
        db,
    )

    if packing is None:
        raise HTTPException(
            status_code=404,
            detail="Packing record not found",
        )

    return packing


@router.put(
    "/packing/{packing_id}",
    response_model=WarehousePackingResponse,
)
def update_one_packing(
    packing_id: int,
    packing: WarehousePackingUpdate,
    db: Session = Depends(get_db),
):
    updated = update_packing(
        packing_id,
        packing,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Packing record not found",
        )

    return updated


@router.delete(
    "/packing/{packing_id}",
)
def delete_one_packing(
    packing_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_packing(
        packing_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Packing record not found",
        )

    return {
        "message": "Packing record deleted successfully"
    }
# ==========================================================
# IMPORTS
# ==========================================================

from app.warehouse.schemas import (
    WarehouseDispatchCreate,
    WarehouseDispatchUpdate,
    WarehouseDispatchResponse,
)

from app.warehouse.service import (
    create_dispatch,
    get_dispatches,
    get_dispatch,
    update_dispatch,
    delete_dispatch,
)


# ==========================================================
# DISPATCH
# ==========================================================

@router.post(
    "/dispatch",
    response_model=WarehouseDispatchResponse,
    status_code=201,
)
def create_new_dispatch(
    dispatch: WarehouseDispatchCreate,
    db: Session = Depends(get_db),
):
    return create_dispatch(
        dispatch,
        db,
    )


@router.get(
    "/dispatch",
    response_model=list[WarehouseDispatchResponse],
)
def get_all_dispatches(
    db: Session = Depends(get_db),
):
    return get_dispatches(db)


@router.get(
    "/dispatch/{dispatch_id}",
    response_model=WarehouseDispatchResponse,
)
def get_one_dispatch(
    dispatch_id: int,
    db: Session = Depends(get_db),
):
    dispatch = get_dispatch(
        dispatch_id,
        db,
    )

    if dispatch is None:
        raise HTTPException(
            status_code=404,
            detail="Dispatch record not found",
        )

    return dispatch


@router.put(
    "/dispatch/{dispatch_id}",
    response_model=WarehouseDispatchResponse,
)
def update_one_dispatch(
    dispatch_id: int,
    dispatch: WarehouseDispatchUpdate,
    db: Session = Depends(get_db),
):
    updated = update_dispatch(
        dispatch_id,
        dispatch,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Dispatch record not found",
        )

    return updated


@router.delete(
    "/dispatch/{dispatch_id}",
)
def delete_one_dispatch(
    dispatch_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_dispatch(
        dispatch_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Dispatch record not found",
        )

    return {
        "message": "Dispatch record deleted successfully"
    }
# ==========================================================
# CYCLE COUNT IMPORTS
# ==========================================================

from app.warehouse.schemas import (
    WarehouseCycleCountCreate,
    WarehouseCycleCountUpdate,
    WarehouseCycleCountResponse,
)

from app.warehouse.service import (
    create_cycle_count,
    get_cycle_counts,
    get_cycle_count,
    update_cycle_count,
    delete_cycle_count,
)


# ==========================================================
# CYCLE COUNT ROUTES
# ==========================================================

@router.post(
    "/cycle-counts",
    response_model=WarehouseCycleCountResponse,
    status_code=201,
)
def create_new_cycle_count(
    cycle_count: WarehouseCycleCountCreate,
    db: Session = Depends(get_db),
):
    return create_cycle_count(
        cycle_count,
        db,
    )


@router.get(
    "/cycle-counts",
    response_model=list[WarehouseCycleCountResponse],
)
def get_all_cycle_counts(
    db: Session = Depends(get_db),
):
    return get_cycle_counts(db)


@router.get(
    "/cycle-counts/{cycle_count_id}",
    response_model=WarehouseCycleCountResponse,
)
def get_one_cycle_count(
    cycle_count_id: int,
    db: Session = Depends(get_db),
):
    cycle_count = get_cycle_count(
        cycle_count_id,
        db,
    )

    if cycle_count is None:
        raise HTTPException(
            status_code=404,
            detail="Cycle count not found",
        )

    return cycle_count


@router.put(
    "/cycle-counts/{cycle_count_id}",
    response_model=WarehouseCycleCountResponse,
)
def update_one_cycle_count(
    cycle_count_id: int,
    cycle_count: WarehouseCycleCountUpdate,
    db: Session = Depends(get_db),
):
    updated = update_cycle_count(
        cycle_count_id,
        cycle_count,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Cycle count not found",
        )

    return updated


@router.delete(
    "/cycle-counts/{cycle_count_id}",
)
def delete_one_cycle_count(
    cycle_count_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_cycle_count(
        cycle_count_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Cycle count not found",
        )

    return {
        "message": "Cycle count deleted successfully"
    }
# ==========================================================
# WAREHOUSE PERFORMANCE IMPORTS
# ==========================================================

from app.warehouse.schemas import (
    WarehousePerformanceCreate,
    WarehousePerformanceUpdate,
    WarehousePerformanceResponse,
)

from app.warehouse.service import (
    create_performance,
    get_performance_records,
    get_performance_record,
    update_performance,
    delete_performance,
)


# ==========================================================
# WAREHOUSE PERFORMANCE ROUTES
# ==========================================================

@router.post(
    "/performance",
    response_model=WarehousePerformanceResponse,
    status_code=201,
)
def create_new_performance(
    performance: WarehousePerformanceCreate,
    db: Session = Depends(get_db),
):
    return create_performance(
        performance,
        db,
    )


@router.get(
    "/performance",
    response_model=list[WarehousePerformanceResponse],
)
def get_all_performance(
    db: Session = Depends(get_db),
):
    return get_performance_records(db)


@router.get(
    "/performance/{performance_id}",
    response_model=WarehousePerformanceResponse,
)
def get_one_performance(
    performance_id: int,
    db: Session = Depends(get_db),
):
    performance = get_performance_record(
        performance_id,
        db,
    )

    if performance is None:
        raise HTTPException(
            status_code=404,
            detail="Performance record not found",
        )

    return performance


@router.put(
    "/performance/{performance_id}",
    response_model=WarehousePerformanceResponse,
)
def update_one_performance(
    performance_id: int,
    performance: WarehousePerformanceUpdate,
    db: Session = Depends(get_db),
):
    updated = update_performance(
        performance_id,
        performance,
        db,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Performance record not found",
        )

    return updated


@router.delete(
    "/performance/{performance_id}",
)
def delete_one_performance(
    performance_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_performance(
        performance_id,
        db,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Performance record not found",
        )

    return {
        "message": "Performance record deleted successfully"
    }