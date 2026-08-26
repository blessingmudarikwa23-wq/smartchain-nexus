import math

from sqlalchemy.orm import Session

from app.inventory.models import (
    InventoryItem,
    InventoryAdjustment,
    InventoryTransaction,
    ABCAnalysis,
    XYZAnalysis,
    EOQAnalysis,
    SafetyStockAnalysis,
    ReorderPoint,
    InventoryTurnover,
)

from app.inventory.schemas import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryDashboard,
    InventoryTransactionCreate,
    InventoryTransactionUpdate,
    InventoryAdjustmentCreate,
    InventoryAdjustmentUpdate,
    ABCAnalysisCreate,
    ABCAnalysisUpdate,
    XYZAnalysisCreate,
    XYZAnalysisUpdate,
    EOQAnalysisCreate,
    EOQAnalysisUpdate,
    SafetyStockCreate,
    SafetyStockUpdate,
    ReorderPointCreate,
    ReorderPointUpdate,
    InventoryTurnoverCreate,
    InventoryTurnoverUpdate,
)


# ==========================================================
# INVENTORY ITEMS
# ==========================================================

def create_inventory_item(
    item: InventoryItemCreate,
    db: Session,
):
    inventory_item = InventoryItem(
        **item.model_dump()
    )

    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def get_inventory_items(
    db: Session,
):
    return (
        db.query(InventoryItem)
        .order_by(InventoryItem.id.desc())
        .all()
    )


def get_inventory_item(
    item_id: int,
    db: Session,
):
    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == item_id
        )
        .first()
    )


def update_inventory_item(
    item_id: int,
    item_data: InventoryItemUpdate,
    db: Session,
):
    inventory_item = get_inventory_item(
        item_id,
        db,
    )

    if inventory_item is None:
        return None

    update_data = item_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            inventory_item,
            key,
            value,
        )

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def delete_inventory_item(
    item_id: int,
    db: Session,
):
    inventory_item = get_inventory_item(
        item_id,
        db,
    )

    if inventory_item is None:
        return None

    db.delete(inventory_item)
    db.commit()

    return inventory_item


# ==========================================================
# INVENTORY DASHBOARD
# ==========================================================

def get_inventory_dashboard(
    db: Session,
):
    inventory_items = get_inventory_items(db)
    transactions = get_inventory_transactions(db)

    total_items = len(inventory_items)

    inventory_value = sum(
        item.quantity * item.unit_cost
        for item in inventory_items
    )

    stock = []

    for item in inventory_items:
        stock.append(
            {
                "id": item.id,
                "product": item.item_name,
                "sku": item.sku,
                "quantity": int(item.quantity),
                "reorder_point": int(item.minimum_stock),
                "safety_stock": 0,
                "warehouse": item.warehouse,
            }
        )

    transaction_data = []

    for transaction in transactions:
        inventory_item = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.id
                == transaction.inventory_item_id
            )
            .first()
        )

        transaction_data.append(
            {
                "reference": (
                    transaction.reference
                    or transaction.transaction_id
                ),
                "product": (
                    inventory_item.item_name
                    if inventory_item
                    else "Unknown"
                ),
                "quantity": int(
                    transaction.quantity
                ),
                "transaction_type": (
                    transaction.transaction_type
                ),
            }
        )

    return InventoryDashboard(
        stock=stock,
        transactions=transaction_data,
        analytics={
            "total_items": total_items,
            "inventory_value": round(
                inventory_value,
                2,
            ),
            "inventory_turnover": 0.0,
            "abc_classification": "A",
            "xyz_classification": "X",
            "eoq": 0,
        },
    )


# ==========================================================
# INVENTORY TRANSACTIONS
# ==========================================================

def create_inventory_transaction(
    db: Session,
    payload: InventoryTransactionCreate,
):
    inventory_transaction = InventoryTransaction(
        **payload.model_dump(
            exclude_unset=True
        )
    )

    db.add(inventory_transaction)
    db.commit()
    db.refresh(inventory_transaction)

    return inventory_transaction


def get_inventory_transactions(
    db: Session,
):
    return (
        db.query(InventoryTransaction)
        .order_by(
            InventoryTransaction.id.desc()
        )
        .all()
    )


def get_inventory_transaction(
    transaction_id: int,
    db: Session,
):
    return (
        db.query(InventoryTransaction)
        .filter(
            InventoryTransaction.id
            == transaction_id
        )
        .first()
    )


def update_inventory_transaction(
    transaction_id: int,
    payload: InventoryTransactionUpdate,
    db: Session,
):
    inventory_transaction = (
        get_inventory_transaction(
            transaction_id,
            db,
        )
    )

    if inventory_transaction is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            inventory_transaction,
            key,
            value,
        )

    db.commit()
    db.refresh(inventory_transaction)

    return inventory_transaction


def delete_inventory_transaction(
    transaction_id: int,
    db: Session,
):
    inventory_transaction = (
        get_inventory_transaction(
            transaction_id,
            db,
        )
    )

    if inventory_transaction is None:
        return None

    db.delete(inventory_transaction)
    db.commit()

    return inventory_transaction


# ==========================================================
# INVENTORY ADJUSTMENTS
# ==========================================================

def _get_adjustment_direction(
    adjustment_type: str,
):
    adjustment_type_normalized = (
        adjustment_type.strip().lower()
    )

    increase_types = {
        "stock increase",
        "increase",
        "stock in",
        "add",
        "addition",
        "receiving",
    }

    decrease_types = {
        "stock decrease",
        "decrease",
        "stock out",
        "remove",
        "removal",
        "write off",
        "write-off",
        "damage",
        "loss",
    }

    if adjustment_type_normalized in increase_types:
        return 1

    if adjustment_type_normalized in decrease_types:
        return -1

    raise ValueError(
        "Invalid adjustment type. "
        "Use Stock Increase or Stock Decrease."
    )


def _build_adjustment_response(
    adjustment,
    inventory_item,
):
    return {
        "id": adjustment.id,
        "inventory_item_id": adjustment.inventory_item_id,
        "item_name": inventory_item.item_name,
        "sku": inventory_item.sku,
        "category": inventory_item.category,
        "warehouse": inventory_item.warehouse,
        "adjustment_type": adjustment.adjustment_type,
        "quantity": adjustment.quantity,
        "reason": adjustment.reason,
        "adjusted_by": adjustment.adjusted_by,
        "created_at": adjustment.created_at,
        "current_quantity": inventory_item.quantity,
    }


def create_inventory_adjustment(
    adjustment: InventoryAdjustmentCreate,
    db: Session,
):
    inventory_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id
            == adjustment.inventory_item_id
        )
        .first()
    )

    if inventory_item is None:
        raise ValueError(
            "Inventory item not found."
        )

    if adjustment.quantity <= 0:
        raise ValueError(
            "Adjustment quantity must be greater than zero."
        )

    direction = _get_adjustment_direction(
        adjustment.adjustment_type
    )

    previous_quantity = float(
        inventory_item.quantity or 0
    )

    new_quantity = (
        previous_quantity
        + (
            direction
            * float(adjustment.quantity)
        )
    )

    if new_quantity < 0:
        raise ValueError(
            "Adjustment cannot reduce stock below zero."
        )

    inventory_item.quantity = new_quantity

    inventory_adjustment = InventoryAdjustment(
        **adjustment.model_dump(
            exclude_unset=True
        )
    )

    db.add(inventory_adjustment)
    db.commit()
    db.refresh(inventory_adjustment)
    db.refresh(inventory_item)

    return {
        "id": inventory_adjustment.id,
        "inventory_item_id": inventory_item.id,
        "item_name": inventory_item.item_name,
        "sku": inventory_item.sku,
        "category": inventory_item.category,
        "warehouse": inventory_item.warehouse,
        "adjustment_type": inventory_adjustment.adjustment_type,
        "quantity": inventory_adjustment.quantity,
        "previous_quantity": previous_quantity,
        "new_quantity": new_quantity,
        "reason": inventory_adjustment.reason,
        "adjusted_by": inventory_adjustment.adjusted_by,
        "created_at": inventory_adjustment.created_at,
        "current_quantity": inventory_item.quantity,
    }


def get_inventory_adjustments(
    db: Session,
):
    adjustments = (
        db.query(InventoryAdjustment)
        .order_by(
            InventoryAdjustment.id.desc()
        )
        .all()
    )

    results = []

    for adjustment in adjustments:
        inventory_item = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.id
                == adjustment.inventory_item_id
            )
            .first()
        )

        if inventory_item is None:
            continue

        direction = _get_adjustment_direction(
            adjustment.adjustment_type
        )

        current_quantity = float(
            inventory_item.quantity or 0
        )

        if direction == 1:
            previous_quantity = (
                current_quantity
                - float(adjustment.quantity)
            )
        else:
            previous_quantity = (
                current_quantity
                + float(adjustment.quantity)
            )

        results.append(
            {
                "id": adjustment.id,
                "inventory_item_id": inventory_item.id,
                "item_name": inventory_item.item_name,
                "sku": inventory_item.sku,
                "category": inventory_item.category,
                "warehouse": inventory_item.warehouse,
                "adjustment_type": adjustment.adjustment_type,
                "quantity": adjustment.quantity,
                "previous_quantity": previous_quantity,
                "new_quantity": current_quantity,
                "reason": adjustment.reason,
                "adjusted_by": adjustment.adjusted_by,
                "created_at": adjustment.created_at,
                "current_quantity": current_quantity,
            }
        )

    return results


def get_inventory_adjustment(
    adjustment_id: int,
    db: Session,
):
    adjustment = (
        db.query(InventoryAdjustment)
        .filter(
            InventoryAdjustment.id
            == adjustment_id
        )
        .first()
    )

    if adjustment is None:
        return None

    inventory_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id
            == adjustment.inventory_item_id
        )
        .first()
    )

    if inventory_item is None:
        return None

    direction = _get_adjustment_direction(
        adjustment.adjustment_type
    )

    current_quantity = float(
        inventory_item.quantity or 0
    )

    if direction == 1:
        previous_quantity = (
            current_quantity
            - float(adjustment.quantity)
        )
    else:
        previous_quantity = (
            current_quantity
            + float(adjustment.quantity)
        )

    return {
        "id": adjustment.id,
        "inventory_item_id": inventory_item.id,
        "item_name": inventory_item.item_name,
        "sku": inventory_item.sku,
        "category": inventory_item.category,
        "warehouse": inventory_item.warehouse,
        "adjustment_type": adjustment.adjustment_type,
        "quantity": adjustment.quantity,
        "previous_quantity": previous_quantity,
        "new_quantity": current_quantity,
        "reason": adjustment.reason,
        "adjusted_by": adjustment.adjusted_by,
        "created_at": adjustment.created_at,
        "current_quantity": current_quantity,
    }


def update_inventory_adjustment(
    adjustment_id: int,
    adjustment_data: InventoryAdjustmentUpdate,
    db: Session,
):
    adjustment = (
        db.query(InventoryAdjustment)
        .filter(
            InventoryAdjustment.id
            == adjustment_id
        )
        .first()
    )

    if adjustment is None:
        return None

    inventory_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id
            == adjustment.inventory_item_id
        )
        .first()
    )

    if inventory_item is None:
        return None

    old_direction = _get_adjustment_direction(
        adjustment.adjustment_type
    )

    old_quantity = float(
        adjustment.quantity
    )

    inventory_item.quantity = (
        float(inventory_item.quantity or 0)
        - (
            old_direction
            * old_quantity
        )
    )

    update_data = adjustment_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            adjustment,
            key,
            value,
        )

    new_direction = _get_adjustment_direction(
        adjustment.adjustment_type
    )

    new_quantity = float(
        adjustment.quantity
    )

    final_quantity = (
        float(inventory_item.quantity or 0)
        + (
            new_direction
            * new_quantity
        )
    )

    if final_quantity < 0:
        db.rollback()

        raise ValueError(
            "Adjustment cannot reduce stock below zero."
        )

    inventory_item.quantity = final_quantity

    db.commit()
    db.refresh(adjustment)
    db.refresh(inventory_item)

    return {
        "id": adjustment.id,
        "inventory_item_id": inventory_item.id,
        "item_name": inventory_item.item_name,
        "sku": inventory_item.sku,
        "category": inventory_item.category,
        "warehouse": inventory_item.warehouse,
        "adjustment_type": adjustment.adjustment_type,
        "quantity": adjustment.quantity,
        "new_quantity": inventory_item.quantity,
        "reason": adjustment.reason,
        "adjusted_by": adjustment.adjusted_by,
        "created_at": adjustment.created_at,
        "current_quantity": inventory_item.quantity,
    }


def delete_inventory_adjustment(
    adjustment_id: int,
    db: Session,
):
    adjustment = (
        db.query(InventoryAdjustment)
        .filter(
            InventoryAdjustment.id
            == adjustment_id
        )
        .first()
    )

    if adjustment is None:
        return None

    inventory_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id
            == adjustment.inventory_item_id
        )
        .first()
    )

    if inventory_item is not None:
        direction = _get_adjustment_direction(
            adjustment.adjustment_type
        )

        restored_quantity = (
            float(inventory_item.quantity or 0)
            - (
                direction
                * float(adjustment.quantity)
            )
        )

        if restored_quantity < 0:
            db.rollback()

            raise ValueError(
                "Cannot delete this adjustment because "
                "it would create negative inventory."
            )

        inventory_item.quantity = (
            restored_quantity
        )

    db.delete(adjustment)
    db.commit()

    return adjustment


# ==========================================================
# ABC ANALYSIS
# ==========================================================

def create_abc_analysis(
    analysis: ABCAnalysisCreate,
    db: Session,
):
    abc_analysis = ABCAnalysis(
        **analysis.model_dump()
    )

    db.add(abc_analysis)
    db.commit()
    db.refresh(abc_analysis)

    return abc_analysis


def get_abc_analysis(
    db: Session,
):
    return (
        db.query(ABCAnalysis)
        .order_by(
            ABCAnalysis.id.desc()
        )
        .all()
    )


def get_single_abc_analysis(
    analysis_id: int,
    db: Session,
):
    return (
        db.query(ABCAnalysis)
        .filter(
            ABCAnalysis.id == analysis_id
        )
        .first()
    )


def update_abc_analysis(
    analysis_id: int,
    analysis_data: ABCAnalysisUpdate,
    db: Session,
):
    abc_analysis = get_single_abc_analysis(
        analysis_id,
        db,
    )

    if abc_analysis is None:
        return None

    update_data = analysis_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            abc_analysis,
            key,
            value,
        )

    db.commit()
    db.refresh(abc_analysis)

    return abc_analysis


def delete_abc_analysis(
    analysis_id: int,
    db: Session,
):
    abc_analysis = get_single_abc_analysis(
        analysis_id,
        db,
    )

    if abc_analysis is None:
        return None

    db.delete(abc_analysis)
    db.commit()

    return abc_analysis


# ==========================================================
# XYZ ANALYSIS
# ==========================================================

def create_xyz_analysis(
    analysis: XYZAnalysisCreate,
    db: Session,
):
    xyz_analysis = XYZAnalysis(
        **analysis.model_dump()
    )

    db.add(xyz_analysis)
    db.commit()
    db.refresh(xyz_analysis)

    return xyz_analysis


def get_xyz_analysis(
    db: Session,
):
    return (
        db.query(XYZAnalysis)
        .order_by(
            XYZAnalysis.id.desc()
        )
        .all()
    )


def get_single_xyz_analysis(
    analysis_id: int,
    db: Session,
):
    return (
        db.query(XYZAnalysis)
        .filter(
            XYZAnalysis.id == analysis_id
        )
        .first()
    )


def update_xyz_analysis(
    analysis_id: int,
    analysis_data: XYZAnalysisUpdate,
    db: Session,
):
    xyz_analysis = get_single_xyz_analysis(
        analysis_id,
        db,
    )

    if xyz_analysis is None:
        return None

    update_data = analysis_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            xyz_analysis,
            key,
            value,
        )

    db.commit()
    db.refresh(xyz_analysis)

    return xyz_analysis


def delete_xyz_analysis(
    analysis_id: int,
    db: Session,
):
    xyz_analysis = get_single_xyz_analysis(
        analysis_id,
        db,
    )

    if xyz_analysis is None:
        return None

    db.delete(xyz_analysis)
    db.commit()

    return xyz_analysis


# ==========================================================
# EOQ ANALYSIS
# ==========================================================

def calculate_eoq(
    annual_demand: float,
    ordering_cost: float,
    holding_cost: float,
):
    if (
        annual_demand <= 0
        or ordering_cost <= 0
        or holding_cost <= 0
    ):
        return 0.0

    return round(
        math.sqrt(
            (
                2
                * annual_demand
                * ordering_cost
            )
            / holding_cost
        ),
        2,
    )


def create_eoq_analysis(
    analysis: EOQAnalysisCreate,
    db: Session,
):
    eoq = calculate_eoq(
        analysis.annual_demand,
        analysis.ordering_cost,
        analysis.holding_cost,
    )

    eoq_record = EOQAnalysis(
        sku=analysis.sku,
        item_name=analysis.item_name,
        annual_demand=analysis.annual_demand,
        ordering_cost=analysis.ordering_cost,
        holding_cost=analysis.holding_cost,
        economic_order_quantity=eoq,
    )

    db.add(eoq_record)
    db.commit()
    db.refresh(eoq_record)

    return eoq_record


def get_eoq_analysis(
    db: Session,
):
    return (
        db.query(EOQAnalysis)
        .order_by(
            EOQAnalysis.id.desc()
        )
        .all()
    )


def get_single_eoq_analysis(
    analysis_id: int,
    db: Session,
):
    return (
        db.query(EOQAnalysis)
        .filter(
            EOQAnalysis.id == analysis_id
        )
        .first()
    )


def update_eoq_analysis(
    analysis_id: int,
    analysis_data: EOQAnalysisUpdate,
    db: Session,
):
    eoq_record = get_single_eoq_analysis(
        analysis_id,
        db,
    )

    if eoq_record is None:
        return None

    update_data = analysis_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            eoq_record,
            key,
            value,
        )

    eoq_record.economic_order_quantity = (
        calculate_eoq(
            eoq_record.annual_demand,
            eoq_record.ordering_cost,
            eoq_record.holding_cost,
        )
    )

    db.commit()
    db.refresh(eoq_record)

    return eoq_record


def delete_eoq_analysis(
    analysis_id: int,
    db: Session,
):
    eoq_record = get_single_eoq_analysis(
        analysis_id,
        db,
    )

    if eoq_record is None:
        return None

    db.delete(eoq_record)
    db.commit()

    return eoq_record


# ==========================================================
# SAFETY STOCK
# ==========================================================

def calculate_safety_stock(
    average_daily_demand: float,
    lead_time_days: float,
    demand_std_dev: float,
    service_level: float,
):
    if (
        average_daily_demand < 0
        or lead_time_days < 0
        or demand_std_dev < 0
    ):
        return 0.0

    z_scores = {
        90: 1.28,
        95: 1.645,
        97: 1.88,
        98: 2.05,
        99: 2.33,
    }

    z_score = z_scores.get(
        round(service_level),
        1.645,
    )

    return round(
        z_score
        * demand_std_dev
        * math.sqrt(lead_time_days),
        2,
    )


def create_safety_stock(
    db: Session,
    payload: SafetyStockCreate,
):
    safety_stock = calculate_safety_stock(
        payload.average_daily_demand,
        payload.lead_time_days,
        payload.demand_std_dev,
        payload.service_level,
    )

    record = SafetyStockAnalysis(
        sku=payload.sku,
        item_name=payload.item_name,
        average_daily_demand=payload.average_daily_demand,
        lead_time_days=payload.lead_time_days,
        demand_std_dev=payload.demand_std_dev,
        service_level=payload.service_level,
        safety_stock=safety_stock,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_safety_stock(
    db: Session,
):
    return (
        db.query(SafetyStockAnalysis)
        .order_by(
            SafetyStockAnalysis.id.desc()
        )
        .all()
    )


def get_safety_stock_by_id(
    db: Session,
    record_id: int,
):
    return (
        db.query(SafetyStockAnalysis)
        .filter(
            SafetyStockAnalysis.id == record_id
        )
        .first()
    )


def update_safety_stock(
    db: Session,
    record_id: int,
    payload: SafetyStockUpdate,
):
    record = get_safety_stock_by_id(
        db,
        record_id,
    )

    if record is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            record,
            key,
            value,
        )

    record.safety_stock = calculate_safety_stock(
        record.average_daily_demand,
        record.lead_time_days,
        record.demand_std_dev,
        record.service_level,
    )

    db.commit()
    db.refresh(record)

    return record


def delete_safety_stock(
    db: Session,
    record_id: int,
):
    record = get_safety_stock_by_id(
        db,
        record_id,
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record


# ==========================================================
# REORDER POINT
# ==========================================================

def calculate_reorder_point(
    average_daily_usage: float,
    lead_time_days: float,
    safety_stock: float,
):
    return round(
        (
            average_daily_usage
            * lead_time_days
        )
        + safety_stock,
        2,
    )


def create_reorder_point(
    db: Session,
    payload: ReorderPointCreate,
):
    reorder_point = calculate_reorder_point(
        payload.average_daily_usage,
        payload.lead_time_days,
        payload.safety_stock,
    )

    record = ReorderPoint(
        sku=payload.sku,
        item_name=payload.item_name,
        average_daily_usage=payload.average_daily_usage,
        lead_time_days=payload.lead_time_days,
        safety_stock=payload.safety_stock,
        reorder_point=reorder_point,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_reorder_points(
    db: Session,
):
    return (
        db.query(ReorderPoint)
        .order_by(
            ReorderPoint.id.desc()
        )
        .all()
    )


def get_reorder_point(
    db: Session,
    record_id: int,
):
    return (
        db.query(ReorderPoint)
        .filter(
            ReorderPoint.id == record_id
        )
        .first()
    )


def update_reorder_point(
    db: Session,
    record_id: int,
    payload: ReorderPointUpdate,
):
    record = get_reorder_point(
        db,
        record_id,
    )

    if record is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            record,
            key,
            value,
        )

    record.reorder_point = calculate_reorder_point(
        record.average_daily_usage,
        record.lead_time_days,
        record.safety_stock,
    )

    db.commit()
    db.refresh(record)

    return record


def delete_reorder_point(
    db: Session,
    record_id: int,
):
    record = get_reorder_point(
        db,
        record_id,
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record


# ==========================================================
# INVENTORY TURNOVER
# ==========================================================

def calculate_inventory_turnover(
    beginning_inventory: float,
    ending_inventory: float,
    cost_of_goods_sold: float,
):
    average_inventory = (
        beginning_inventory
        + ending_inventory
    ) / 2

    if average_inventory <= 0:
        return (
            round(average_inventory, 2),
            0.0,
            0.0,
        )

    turnover_ratio = (
        cost_of_goods_sold
        / average_inventory
    )

    days_in_inventory = (
        365 / turnover_ratio
        if turnover_ratio > 0
        else 0.0
    )

    return (
        round(average_inventory, 2),
        round(turnover_ratio, 2),
        round(days_in_inventory, 2),
    )


def create_inventory_turnover(
    db: Session,
    payload: InventoryTurnoverCreate,
):
    (
        average_inventory,
        turnover_ratio,
        days_in_inventory,
    ) = calculate_inventory_turnover(
        payload.beginning_inventory,
        payload.ending_inventory,
        payload.cost_of_goods_sold,
    )

    record = InventoryTurnover(
        sku=payload.sku,
        item_name=payload.item_name,
        beginning_inventory=payload.beginning_inventory,
        ending_inventory=payload.ending_inventory,
        average_inventory=average_inventory,
        cost_of_goods_sold=payload.cost_of_goods_sold,
        inventory_turnover_ratio=turnover_ratio,
        days_in_inventory=days_in_inventory,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_inventory_turnover(
    db: Session,
):
    return (
        db.query(InventoryTurnover)
        .order_by(
            InventoryTurnover.id.desc()
        )
        .all()
    )


def get_inventory_turnover_by_id(
    db: Session,
    record_id: int,
):
    return (
        db.query(InventoryTurnover)
        .filter(
            InventoryTurnover.id == record_id
        )
        .first()
    )


def update_inventory_turnover(
    db: Session,
    record_id: int,
    payload: InventoryTurnoverUpdate,
):
    record = get_inventory_turnover_by_id(
        db,
        record_id,
    )

    if record is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            record,
            key,
            value,
        )

    (
        record.average_inventory,
        record.inventory_turnover_ratio,
        record.days_in_inventory,
    ) = calculate_inventory_turnover(
        record.beginning_inventory,
        record.ending_inventory,
        record.cost_of_goods_sold,
    )

    db.commit()
    db.refresh(record)

    return record


def delete_inventory_turnover(
    db: Session,
    record_id: int,
):
    record = get_inventory_turnover_by_id(
        db,
        record_id,
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record