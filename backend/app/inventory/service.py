from app.inventory.models import (
    EOQAnalysis,
    SafetyStockAnalysis,
    ABCAnalysis,
    XYZAnalysis,
)

# ==========================================================
# CREATE INVENTORY ITEM
# ==========================================================

def create_inventory_item(
    item: InventoryItemCreate,
    db: Session,
):

    inventory_item = InventoryItem(**item.model_dump())

    db.add(inventory_item)

    db.commit()

    db.refresh(inventory_item)

    return inventory_item


# ==========================================================
# GET ALL INVENTORY ITEMS
# ==========================================================

def get_inventory_items(
    db: Session,
):

    return db.query(
        InventoryItem
    ).all()


# ==========================================================
# GET SINGLE INVENTORY ITEM
# ==========================================================

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


# ==========================================================
# UPDATE INVENTORY ITEM
# ==========================================================

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

    db.refresh(
        inventory_item
    )

    return inventory_item


# ==========================================================
# DELETE INVENTORY ITEM
# ==========================================================

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

    db.delete(
        inventory_item
    )

    db.commit()

    return inventory_item
from app.inventory.schemas import (
    InventoryDashboard,
    InventoryTransaction,
    InventoryAnalytics,
    InventoryItem as DashboardInventoryItem,
)


# ==========================================================
# INVENTORY DASHBOARD
# ==========================================================

def get_inventory_dashboard():

    return InventoryDashboard(

        stock=[

            DashboardInventoryItem(
                id=1,
                product="Laptop Stand",
                sku="LS-1001",
                quantity=120,
                reorder_point=30,
                safety_stock=20,
                warehouse="Warehouse A",
            ),

            DashboardInventoryItem(
                id=2,
                product="Wireless Mouse",
                sku="WM-1002",
                quantity=75,
                reorder_point=20,
                safety_stock=15,
                warehouse="Warehouse A",
            ),

            DashboardInventoryItem(
                id=3,
                product="USB-C Cable",
                sku="UC-1003",
                quantity=18,
                reorder_point=25,
                safety_stock=10,
                warehouse="Warehouse B",
            ),

            DashboardInventoryItem(
                id=4,
                product="Keyboard",
                sku="KB-1004",
                quantity=42,
                reorder_point=15,
                safety_stock=8,
                warehouse="Warehouse B",
            ),

        ],

        transactions=[

            InventoryTransaction(
                reference="TX-1001",
                product="Laptop Stand",
                quantity=50,
                transaction_type="Receiving",
            ),

            InventoryTransaction(
                reference="TX-1002",
                product="Wireless Mouse",
                quantity=20,
                transaction_type="Dispatch",
            ),

            InventoryTransaction(
                reference="TX-1003",
                product="USB-C Cable",
                quantity=15,
                transaction_type="Adjustment",
            ),

        ],

        analytics=InventoryAnalytics(
            total_items=255,
            inventory_value=1580000,
            inventory_turnover=6.8,
            abc_classification="A",
            xyz_classification="X",
            eoq=350,
        ),
    )
# ==========================================================
# INVENTORY ADJUSTMENTS
# ==========================================================

from app.inventory.models import InventoryAdjustment
from app.inventory.schemas import (
    InventoryAdjustmentCreate,
    InventoryAdjustmentUpdate,
)


# CREATE ADJUSTMENT
def create_inventory_adjustment(
    adjustment: InventoryAdjustmentCreate,
    db: Session,
):

    inventory_adjustment = InventoryAdjustment(
        **adjustment.model_dump()
    )

    db.add(
        inventory_adjustment
    )

    db.commit()

    db.refresh(
        inventory_adjustment
    )

    return inventory_adjustment


# GET ALL ADJUSTMENTS
def get_inventory_adjustments(
    db: Session,
):

    return db.query(
        InventoryAdjustment
    ).all()


# GET SINGLE ADJUSTMENT
def get_inventory_adjustment(
    adjustment_id: int,
    db: Session,
):

    return (
        db.query(InventoryAdjustment)
        .filter(
            InventoryAdjustment.id == adjustment_id
        )
        .first()
    )


# UPDATE ADJUSTMENT
def update_inventory_adjustment(
    adjustment_id: int,
    adjustment_data: InventoryAdjustmentUpdate,
    db: Session,
):

    inventory_adjustment = get_inventory_adjustment(
        adjustment_id,
        db,
    )

    if inventory_adjustment is None:
        return None


    update_data = adjustment_data.model_dump(
        exclude_unset=True
    )


    for key, value in update_data.items():

        setattr(
            inventory_adjustment,
            key,
            value,
        )


    db.commit()

    db.refresh(
        inventory_adjustment
    )

    return inventory_adjustment



# DELETE ADJUSTMENT
def delete_inventory_adjustment(
    adjustment_id: int,
    db: Session,
):

    inventory_adjustment = get_inventory_adjustment(
        adjustment_id,
        db,
    )


    if inventory_adjustment is None:
        return None


    db.delete(
        inventory_adjustment
    )

    db.commit()

    return inventory_adjustment
# ==========================================================
# ABC ANALYSIS SERVICES
# ==========================================================

from app.inventory.models import ABCAnalysis
from app.inventory.schemas import (
    ABCAnalysisCreate,
    ABCAnalysisUpdate,
)


# ==========================================================
# CREATE ABC ANALYSIS
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


# ==========================================================
# GET ALL ABC ANALYSIS
# ==========================================================

def get_abc_analysis(
    db: Session,
):
    return db.query(
        ABCAnalysis
    ).all()


# ==========================================================
# GET SINGLE ABC ANALYSIS
# ==========================================================

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


# ==========================================================
# UPDATE ABC ANALYSIS
# ==========================================================

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

    db.refresh(
        abc_analysis,
    )

    return abc_analysis


# ==========================================================
# DELETE ABC ANALYSIS
# ==========================================================

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

    db.delete(
        abc_analysis,
    )

    db.commit()

    return abc_analysis
# ==========================================================
# XYZ ANALYSIS SERVICES
# ==========================================================

from app.inventory.models import XYZAnalysis
from app.inventory.schemas import (
    XYZAnalysisCreate,
    XYZAnalysisUpdate,
)


# ==========================================================
# CREATE XYZ ANALYSIS
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


# ==========================================================
# GET ALL XYZ ANALYSIS
# ==========================================================

def get_xyz_analysis(
    db: Session,
):
    return db.query(
        XYZAnalysis
    ).all()


# ==========================================================
# GET SINGLE XYZ ANALYSIS
# ==========================================================

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


# ==========================================================
# UPDATE XYZ ANALYSIS
# ==========================================================

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

    db.refresh(
        xyz_analysis,
    )

    return xyz_analysis


# ==========================================================
# DELETE XYZ ANALYSIS
# ==========================================================

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

    db.delete(
        xyz_analysis
    )

    db.commit()

    return xyz_analysis
# ==========================================================
# EOQ ANALYSIS SERVICES
# ==========================================================

import math

from app.inventory.models import EOQAnalysis
from app.inventory.schemas import (
    EOQAnalysisCreate,
    EOQAnalysisUpdate,
)


# ==========================================================
# CREATE EOQ ANALYSIS
# ==========================================================

def create_eoq_analysis(
    analysis: EOQAnalysisCreate,
    db: Session,
):
    eoq = 0.0

    if (
        analysis.annual_demand > 0
        and analysis.ordering_cost > 0
        and analysis.holding_cost > 0
    ):
        eoq = math.sqrt(
            (
                2
                * analysis.annual_demand
                * analysis.ordering_cost
            )
            / analysis.holding_cost
        )

    eoq_record = EOQAnalysis(
        sku=analysis.sku,
        item_name=analysis.item_name,
        annual_demand=analysis.annual_demand,
        ordering_cost=analysis.ordering_cost,
        holding_cost=analysis.holding_cost,
        economic_order_quantity=round(eoq, 2),
    )

    db.add(eoq_record)

    db.commit()

    db.refresh(eoq_record)

    return eoq_record


# ==========================================================
# GET ALL EOQ ANALYSIS
# ==========================================================

def get_eoq_analysis(
    db: Session,
):
    return db.query(
        EOQAnalysis
    ).all()


# ==========================================================
# GET SINGLE EOQ ANALYSIS
# ==========================================================

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


# ==========================================================
# UPDATE EOQ ANALYSIS
# ==========================================================

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

    if (
        eoq_record.annual_demand > 0
        and eoq_record.ordering_cost > 0
        and eoq_record.holding_cost > 0
    ):
        eoq_record.economic_order_quantity = round(
            math.sqrt(
                (
                    2
                    * eoq_record.annual_demand
                    * eoq_record.ordering_cost
                )
                / eoq_record.holding_cost
            ),
            2,
        )

    db.commit()

    db.refresh(
        eoq_record,
    )

    return eoq_record


# ==========================================================
# DELETE EOQ ANALYSIS
# ==========================================================

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

    db.delete(
        eoq_record,
    )

    db.commit()

    return eoq_record
# ==========================================================
# SAFETY STOCK SERVICE
# ==========================================================

from app.inventory.models import SafetyStockAnalysis
from app.inventory.schemas import (
    SafetyStockCreate,
    SafetyStockUpdate,
)
from sqlalchemy.orm import Session


def create_safety_stock(db: Session, payload: SafetyStockCreate):
    record = SafetyStockAnalysis(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_safety_stock(db: Session):
    return db.query(SafetyStockAnalysis).all()


def get_safety_stock_by_id(db: Session, record_id: int):
    return (
        db.query(SafetyStockAnalysis)
        .filter(SafetyStockAnalysis.id == record_id)
        .first()
    )


def update_safety_stock(
    db: Session,
    record_id: int,
    payload: SafetyStockUpdate,
):
    record = get_safety_stock_by_id(db, record_id)

    if not record:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


def delete_safety_stock(db: Session, record_id: int):
    record = get_safety_stock_by_id(db, record_id)

    if not record:
        return None

    db.delete(record)
    db.commit()

    return {"message": "Safety Stock deleted successfully"}
# ==========================================================
# REORDER POINT SERVICE
# ==========================================================

from sqlalchemy.orm import Session

from app.inventory.models import ReorderPoint
from app.inventory.schemas import (
    ReorderPointCreate,
    ReorderPointUpdate,
)


# ----------------------------------------------------------
# CREATE
# ----------------------------------------------------------

def create_reorder_point(
    db: Session,
    payload: ReorderPointCreate,
):
    record = ReorderPoint(**payload.model_dump())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ----------------------------------------------------------
# GET ALL
# ----------------------------------------------------------

def get_reorder_points(db: Session):
    return (
        db.query(ReorderPoint)
        .order_by(ReorderPoint.id.desc())
        .all()
    )


# ----------------------------------------------------------
# GET ONE
# ----------------------------------------------------------

def get_reorder_point(
    db: Session,
    record_id: int,
):
    return (
        db.query(ReorderPoint)
        .filter(ReorderPoint.id == record_id)
        .first()
    )


# ----------------------------------------------------------
# UPDATE
# ----------------------------------------------------------

def update_reorder_point(
    db: Session,
    record_id: int,
    payload: ReorderPointUpdate,
):
    record = get_reorder_point(db, record_id)

    if not record:
        return None

    updates = payload.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


# ----------------------------------------------------------
# DELETE
# ----------------------------------------------------------

def delete_reorder_point(
    db: Session,
    record_id: int,
):
    record = get_reorder_point(db, record_id)

    if not record:
        return None

    db.delete(record)
    db.commit()

    return record
# ==========================================================
# INVENTORY TURNOVER SERVICE
# ==========================================================

from app.inventory.models import InventoryTurnover
from app.inventory.schemas import (
    InventoryTurnoverCreate,
    InventoryTurnoverUpdate,
)


# ----------------------------------------------------------
# CREATE
# ----------------------------------------------------------

def create_inventory_turnover(
    db: Session,
    payload: InventoryTurnoverCreate,
):
    average_inventory = (
        payload.beginning_inventory + payload.ending_inventory
    ) / 2

    inventory_turnover_ratio = (
        payload.cost_of_goods_sold / average_inventory
        if average_inventory > 0
        else 0
    )

    days_in_inventory = (
        365 / inventory_turnover_ratio
        if inventory_turnover_ratio > 0
        else 0
    )

    record = InventoryTurnover(
        sku=payload.sku,
        item_name=payload.item_name,
        beginning_inventory=payload.beginning_inventory,
        ending_inventory=payload.ending_inventory,
        average_inventory=average_inventory,
        cost_of_goods_sold=payload.cost_of_goods_sold,
        inventory_turnover_ratio=inventory_turnover_ratio,
        days_in_inventory=days_in_inventory,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ----------------------------------------------------------
# GET ALL
# ----------------------------------------------------------

def get_inventory_turnover(db: Session):
    return db.query(InventoryTurnover).all()


# ----------------------------------------------------------
# GET ONE
# ----------------------------------------------------------

def get_inventory_turnover_by_id(
    db: Session,
    record_id: int,
):
    return (
        db.query(InventoryTurnover)
        .filter(InventoryTurnover.id == record_id)
        .first()
    )


# ----------------------------------------------------------
# UPDATE
# ----------------------------------------------------------

def update_inventory_turnover(
    db: Session,
    record_id: int,
    payload: InventoryTurnoverUpdate,
):
    record = (
        db.query(InventoryTurnover)
        .filter(InventoryTurnover.id == record_id)
        .first()
    )

    if record is None:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(record, key, value)

    record.average_inventory = (
        record.beginning_inventory + record.ending_inventory
    ) / 2

    record.inventory_turnover_ratio = (
        record.cost_of_goods_sold / record.average_inventory
        if record.average_inventory > 0
        else 0
    )

    record.days_in_inventory = (
        365 / record.inventory_turnover_ratio
        if record.inventory_turnover_ratio > 0
        else 0
    )

    db.commit()
    db.refresh(record)

    return record


# ----------------------------------------------------------
# DELETE
# ----------------------------------------------------------

def delete_inventory_turnover(
    db: Session,
    record_id: int,
):
    record = (
        db.query(InventoryTurnover)
        .filter(InventoryTurnover.id == record_id)
        .first()
    )

    if record is None:
        return None

    db.delete(record)
    db.commit()

    return record
