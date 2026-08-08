from sqlalchemy import func
from sqlalchemy.orm import Session

from app.procurement.models import (
    Supplier,
    PurchaseOrder,
)

from app.procurement.schemas import (
    SupplierCreate,
    SupplierUpdate,
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
)


# ==========================================================
# SUPPLIERS
# ==========================================================

def create_supplier(
    supplier: SupplierCreate,
    db: Session,
):
    existing = (
        db.query(Supplier)
        .filter(
            Supplier.supplier_code == supplier.supplier_code
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Supplier code already exists."
        )

    new_supplier = Supplier(
        **supplier.model_dump()
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return new_supplier


def get_suppliers(db: Session):
    return db.query(Supplier).all()


def get_supplier(
    supplier_id: int,
    db: Session,
):
    return (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )


def update_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session,
):
    supplier_db = get_supplier(
        supplier_id,
        db,
    )

    if supplier_db is None:
        return None

    update_data = supplier.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            supplier_db,
            key,
            value,
        )

    db.commit()
    db.refresh(supplier_db)

    return supplier_db


def delete_supplier(
    supplier_id: int,
    db: Session,
):
    supplier = get_supplier(
        supplier_id,
        db,
    )

    if supplier is None:
        return False

    db.delete(supplier)
    db.commit()

    return True


# ==========================================================
# PURCHASE ORDERS
# ==========================================================

def create_purchase_order(
    purchase_order: PurchaseOrderCreate,
    db: Session,
):
    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id == purchase_order.supplier_id
        )
        .first()
    )

    if supplier is None:
        raise ValueError(
            "Supplier does not exist."
        )

    new_po = PurchaseOrder(
        **purchase_order.model_dump()
    )

    db.add(new_po)
    db.commit()
    db.refresh(new_po)

    return new_po


def get_purchase_orders(
    db: Session,
):
    return db.query(
        PurchaseOrder
    ).all()


def get_purchase_order(
    po_id: int,
    db: Session,
):
    return (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.id == po_id
        )
        .first()
    )


def update_purchase_order(
    po_id: int,
    purchase_order: PurchaseOrderUpdate,
    db: Session,
):
    po = get_purchase_order(
        po_id,
        db,
    )

    if po is None:
        return None

    update_data = purchase_order.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            po,
            key,
            value,
        )

    db.commit()
    db.refresh(po)

    return po


def delete_purchase_order(
    po_id: int,
    db: Session,
):
    po = get_purchase_order(
        po_id,
        db,
    )

    if po is None:
        return False

    db.delete(po)
    db.commit()

    return True


# ==========================================================
# SPEND ANALYTICS
# ==========================================================

def get_spend_analytics(
    db: Session,
):
    total_spend = (
        db.query(
            func.sum(
                PurchaseOrder.total_amount
            )
        )
        .scalar()
        or 0
    )

    total_purchase_orders = (
        db.query(PurchaseOrder)
        .count()
    )

    average_order_value = (
        total_spend / total_purchase_orders
        if total_purchase_orders > 0
        else 0
    )

    supplier_spend = (
        db.query(
            Supplier.company_name,
            func.sum(
                PurchaseOrder.total_amount
            ).label("spend"),
        )
        .join(
            PurchaseOrder,
            Supplier.id == PurchaseOrder.supplier_id,
        )
        .group_by(
            Supplier.company_name,
        )
        .order_by(
            func.sum(
                PurchaseOrder.total_amount
            ).desc()
        )
        .first()
    )

    if supplier_spend:
        top_supplier = supplier_spend.company_name
        top_supplier_spend = supplier_spend.spend
    else:
        top_supplier = None
        top_supplier_spend = 0

    return {
        "total_spend": total_spend,
        "total_purchase_orders": total_purchase_orders,
        "average_order_value": average_order_value,
        "top_supplier": top_supplier,
        "top_supplier_spend": top_supplier_spend,
        "currency": "ZAR",
    }
# ==========================================================
# VENDOR PERFORMANCE
# ==========================================================

from datetime import date

from app.procurement.schemas import VendorPerformanceResponse


def get_vendor_performance(db: Session):

    suppliers = db.query(Supplier).all()

    results = []

    today = date.today()

    for supplier in suppliers:

        purchase_orders = (
            db.query(PurchaseOrder)
            .filter(
                PurchaseOrder.supplier_id == supplier.id
            )
            .all()
        )

        total_orders = len(purchase_orders)

        total_spend = sum(
            po.total_amount
            for po in purchase_orders
        )

        on_time = sum(
            1
            for po in purchase_orders
            if po.expected_delivery >= today
        )

        late = total_orders - on_time

        success_rate = (
            (on_time / total_orders) * 100
            if total_orders > 0
            else 0
        )

        results.append(

            VendorPerformanceResponse(

                supplier_name=supplier.company_name,

                total_orders=total_orders,

                total_spend=total_spend,

                on_time_deliveries=on_time,

                late_deliveries=late,

                delivery_success_rate=round(
                    success_rate,
                    2,
                ),
            )

        )

    return results
# ==========================================================
# LEAD TIME ANALYSIS
# ==========================================================

from app.procurement.schemas import LeadTimeAnalysisResponse


def get_lead_time_analysis(db: Session):

    purchase_orders = db.query(PurchaseOrder).all()

    results = []

    for po in purchase_orders:

        supplier = (
            db.query(Supplier)
            .filter(Supplier.id == po.supplier_id)
            .first()
        )

        lead_time = (
            po.expected_delivery - po.order_date
        ).days

        results.append(

            LeadTimeAnalysisResponse(

                purchase_order=po.po_number,

                supplier_name=(
                    supplier.company_name
                    if supplier
                    else "Unknown"
                ),

                order_date=po.order_date,

                expected_delivery=po.expected_delivery,

                lead_time_days=lead_time,

            )

        )

    return results