from sqlalchemy.orm import Session

from app.warehouse.models import WarehouseReceiving
from app.warehouse.schemas import (
    WarehouseReceivingCreate,
    WarehouseReceivingUpdate,
)


# ==========================================================
# CREATE RECEIVING
# ==========================================================

def create_receiving(
    receiving: WarehouseReceivingCreate,
    db: Session,
):
    warehouse_receiving = WarehouseReceiving(
        **receiving.model_dump()
    )

    db.add(warehouse_receiving)
    db.commit()
    db.refresh(warehouse_receiving)

    return warehouse_receiving


# ==========================================================
# GET ALL RECEIVING
# ==========================================================

def get_receiving_records(
    db: Session,
):
    return db.query(
        WarehouseReceiving
    ).all()


# ==========================================================
# GET SINGLE RECEIVING
# ==========================================================

def get_receiving_record(
    receiving_id: int,
    db: Session,
):
    return (
        db.query(WarehouseReceiving)
        .filter(
            WarehouseReceiving.id == receiving_id
        )
        .first()
    )


# ==========================================================
# UPDATE RECEIVING
# ==========================================================

def update_receiving(
    receiving_id: int,
    receiving_data: WarehouseReceivingUpdate,
    db: Session,
):
    warehouse_receiving = get_receiving_record(
        receiving_id,
        db,
    )

    if warehouse_receiving is None:
        return None

    update_data = receiving_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            warehouse_receiving,
            key,
            value,
        )

    db.commit()
    db.refresh(
        warehouse_receiving
    )

    return warehouse_receiving


# ==========================================================
# DELETE RECEIVING
# ==========================================================

def delete_receiving(
    receiving_id: int,
    db: Session,
):
    warehouse_receiving = get_receiving_record(
        receiving_id,
        db,
    )

    if warehouse_receiving is None:
        return None

    db.delete(
        warehouse_receiving
    )

    db.commit()

    return warehouse_receiving
# ==========================================================
# WAREHOUSE PICKING SERVICES
# ==========================================================

from app.warehouse.models import WarehousePicking
from app.warehouse.schemas import (
    WarehousePickingCreate,
    WarehousePickingUpdate,
)


# ==========================================================
# CREATE PICKING
# ==========================================================

def create_picking(
    picking: WarehousePickingCreate,
    db: Session,
):
    warehouse_picking = WarehousePicking(
        **picking.model_dump()
    )

    db.add(warehouse_picking)
    db.commit()
    db.refresh(warehouse_picking)

    return warehouse_picking


# ==========================================================
# GET ALL PICKING
# ==========================================================

def get_picking_records(
    db: Session,
):
    return db.query(
        WarehousePicking
    ).all()


# ==========================================================
# GET SINGLE PICKING
# ==========================================================

def get_picking_record(
    picking_id: int,
    db: Session,
):
    return (
        db.query(WarehousePicking)
        .filter(
            WarehousePicking.id == picking_id
        )
        .first()
    )


# ==========================================================
# UPDATE PICKING
# ==========================================================

def update_picking(
    picking_id: int,
    picking_data: WarehousePickingUpdate,
    db: Session,
):
    warehouse_picking = get_picking_record(
        picking_id,
        db,
    )

    if warehouse_picking is None:
        return None

    update_data = picking_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            warehouse_picking,
            key,
            value,
        )

    db.commit()
    db.refresh(
        warehouse_picking
    )

    return warehouse_picking


# ==========================================================
# DELETE PICKING
# ==========================================================

def delete_picking(
    picking_id: int,
    db: Session,
):
    warehouse_picking = get_picking_record(
        picking_id,
        db,
    )

    if warehouse_picking is None:
        return None

    db.delete(
        warehouse_picking
    )

    db.commit()

    return warehouse_picking
# ==========================================================
# WAREHOUSE PACKING SERVICES
# ==========================================================

from app.warehouse.models import WarehousePacking
from app.warehouse.schemas import (
    WarehousePackingCreate,
    WarehousePackingUpdate,
)


# ==========================================================
# CREATE PACKING
# ==========================================================

def create_packing(
    packing: WarehousePackingCreate,
    db: Session,
):
    warehouse_packing = WarehousePacking(
        **packing.model_dump()
    )

    db.add(warehouse_packing)

    db.commit()

    db.refresh(
        warehouse_packing
    )

    return warehouse_packing


# ==========================================================
# GET ALL PACKING
# ==========================================================

def get_packing_records(
    db: Session,
):
    return db.query(
        WarehousePacking
    ).all()


# ==========================================================
# GET SINGLE PACKING
# ==========================================================

def get_packing_record(
    packing_id: int,
    db: Session,
):
    return (
        db.query(WarehousePacking)
        .filter(
            WarehousePacking.id == packing_id
        )
        .first()
    )


# ==========================================================
# UPDATE PACKING
# ==========================================================

def update_packing(
    packing_id: int,
    packing_data: WarehousePackingUpdate,
    db: Session,
):
    warehouse_packing = get_packing_record(
        packing_id,
        db,
    )

    if warehouse_packing is None:
        return None

    update_data = packing_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            warehouse_packing,
            key,
            value,
        )

    db.commit()

    db.refresh(
        warehouse_packing
    )

    return warehouse_packing


# ==========================================================
# DELETE PACKING
# ==========================================================

def delete_packing(
    packing_id: int,
    db: Session,
):
    warehouse_packing = get_packing_record(
        packing_id,
        db,
    )

    if warehouse_packing is None:
        return None

    db.delete(
        warehouse_packing
    )

    db.commit()

    return warehouse_packing
# ==========================================================
# WAREHOUSE DISPATCH SERVICES
# ==========================================================

from app.warehouse.models import WarehouseDispatch
from app.warehouse.schemas import (
    WarehouseDispatchCreate,
    WarehouseDispatchUpdate,
)


# ==========================================================
# CREATE DISPATCH
# ==========================================================

def create_dispatch(
    dispatch: WarehouseDispatchCreate,
    db: Session,
):
    warehouse_dispatch = WarehouseDispatch(
        **dispatch.model_dump()
    )

    db.add(warehouse_dispatch)

    db.commit()

    db.refresh(
        warehouse_dispatch
    )

    return warehouse_dispatch


# ==========================================================
# GET ALL DISPATCHES
# ==========================================================

def get_dispatches(
    db: Session,
):
    return db.query(
        WarehouseDispatch
    ).all()


# ==========================================================
# GET SINGLE DISPATCH
# ==========================================================

def get_dispatch(
    dispatch_id: int,
    db: Session,
):
    return (
        db.query(WarehouseDispatch)
        .filter(
            WarehouseDispatch.id == dispatch_id
        )
        .first()
    )


# ==========================================================
# UPDATE DISPATCH
# ==========================================================

def update_dispatch(
    dispatch_id: int,
    dispatch_data: WarehouseDispatchUpdate,
    db: Session,
):
    warehouse_dispatch = get_dispatch(
        dispatch_id,
        db,
    )

    if warehouse_dispatch is None:
        return None

    update_data = dispatch_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            warehouse_dispatch,
            key,
            value,
        )

    db.commit()

    db.refresh(
        warehouse_dispatch
    )

    return warehouse_dispatch


# ==========================================================
# DELETE DISPATCH
# ==========================================================

def delete_dispatch(
    dispatch_id: int,
    db: Session,
):
    warehouse_dispatch = get_dispatch(
        dispatch_id,
        db,
    )

    if warehouse_dispatch is None:
        return None

    db.delete(
        warehouse_dispatch
    )

    db.commit()

    return warehouse_dispatch
# ==========================================================
# WAREHOUSE CYCLE COUNT SERVICES
# ==========================================================

from app.warehouse.models import WarehouseCycleCount
from app.warehouse.schemas import (
    WarehouseCycleCountCreate,
    WarehouseCycleCountUpdate,
)


# ==========================================================
# CREATE CYCLE COUNT
# ==========================================================

def create_cycle_count(
    cycle_count: WarehouseCycleCountCreate,
    db: Session,
):
    variance = (
        cycle_count.counted_quantity
        - cycle_count.system_quantity
    )

    warehouse_cycle_count = WarehouseCycleCount(
        **cycle_count.model_dump(),
        variance=variance,
    )

    db.add(
        warehouse_cycle_count
    )

    db.commit()

    db.refresh(
        warehouse_cycle_count
    )

    return warehouse_cycle_count


# ==========================================================
# GET ALL CYCLE COUNTS
# ==========================================================

def get_cycle_counts(
    db: Session,
):
    return db.query(
        WarehouseCycleCount
    ).all()


# ==========================================================
# GET SINGLE CYCLE COUNT
# ==========================================================

def get_cycle_count(
    cycle_count_id: int,
    db: Session,
):
    return (
        db.query(WarehouseCycleCount)
        .filter(
            WarehouseCycleCount.id == cycle_count_id
        )
        .first()
    )


# ==========================================================
# UPDATE CYCLE COUNT
# ==========================================================

def update_cycle_count(
    cycle_count_id: int,
    cycle_count_data: WarehouseCycleCountUpdate,
    db: Session,
):
    warehouse_cycle_count = get_cycle_count(
        cycle_count_id,
        db,
    )

    if warehouse_cycle_count is None:
        return None

    update_data = cycle_count_data.model_dump(
        exclude_unset=True
    )

    if (
        "system_quantity" in update_data
        or "counted_quantity" in update_data
    ):
        system_qty = update_data.get(
            "system_quantity",
            warehouse_cycle_count.system_quantity,
        )

        counted_qty = update_data.get(
            "counted_quantity",
            warehouse_cycle_count.counted_quantity,
        )

        update_data["variance"] = (
            counted_qty - system_qty
        )

    for key, value in update_data.items():
        setattr(
            warehouse_cycle_count,
            key,
            value,
        )

    db.commit()

    db.refresh(
        warehouse_cycle_count
    )

    return warehouse_cycle_count


# ==========================================================
# DELETE CYCLE COUNT
# ==========================================================

def delete_cycle_count(
    cycle_count_id: int,
    db: Session,
):
    warehouse_cycle_count = get_cycle_count(
        cycle_count_id,
        db,
    )

    if warehouse_cycle_count is None:
        return None

    db.delete(
        warehouse_cycle_count
    )

    db.commit()

    return warehouse_cycle_count
# ==========================================================
# WAREHOUSE PERFORMANCE SERVICES
# ==========================================================

from app.warehouse.models import WarehousePerformance
from app.warehouse.schemas import (
    WarehousePerformanceCreate,
    WarehousePerformanceUpdate,
)


# ==========================================================
# CREATE PERFORMANCE RECORD
# ==========================================================

def create_performance(
    performance: WarehousePerformanceCreate,
    db: Session,
):
    performance_record = WarehousePerformance(
        **performance.model_dump()
    )

    db.add(performance_record)

    db.commit()

    db.refresh(performance_record)

    return performance_record


# ==========================================================
# GET ALL PERFORMANCE RECORDS
# ==========================================================

def get_performance_records(
    db: Session,
):
    return db.query(
        WarehousePerformance
    ).all()


# ==========================================================
# GET SINGLE PERFORMANCE RECORD
# ==========================================================

def get_performance_record(
    performance_id: int,
    db: Session,
):
    return (
        db.query(WarehousePerformance)
        .filter(
            WarehousePerformance.id == performance_id
        )
        .first()
    )


# ==========================================================
# UPDATE PERFORMANCE RECORD
# ==========================================================

def update_performance(
    performance_id: int,
    performance_data: WarehousePerformanceUpdate,
    db: Session,
):
    performance_record = get_performance_record(
        performance_id,
        db,
    )

    if performance_record is None:
        return None

    update_data = performance_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            performance_record,
            key,
            value,
        )

    db.commit()

    db.refresh(
        performance_record,
    )

    return performance_record


# ==========================================================
# DELETE PERFORMANCE RECORD
# ==========================================================

def delete_performance(
    performance_id: int,
    db: Session,
):
    performance_record = get_performance_record(
        performance_id,
        db,
    )

    if performance_record is None:
        return None

    db.delete(
        performance_record,
    )

    db.commit()

    return performance_record