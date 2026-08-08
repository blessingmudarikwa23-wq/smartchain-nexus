from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.procurement.schemas import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderResponse,
    SpendAnalyticsResponse,
)

from app.procurement.service import (
    create_supplier,
    get_suppliers,
    get_supplier,
    update_supplier,
    delete_supplier,
    create_purchase_order,
    get_purchase_orders,
    get_purchase_order,
    update_purchase_order,
    delete_purchase_order,
    get_spend_analytics,
)

router = APIRouter(
    prefix="/procurement",
    tags=["Procurement"],
)

# ==========================================================
# SUPPLIERS
# ==========================================================

@router.post(
    "/suppliers",
    response_model=SupplierResponse,
    status_code=201,
)
def add_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_supplier(
            supplier=supplier,
            db=db,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/suppliers",
    response_model=list[SupplierResponse],
)
def list_suppliers(
    db: Session = Depends(get_db),
):
    return get_suppliers(db)


@router.get(
    "/suppliers/{supplier_id}",
    response_model=SupplierResponse,
)
def retrieve_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
):
    supplier = get_supplier(
        supplier_id,
        db,
    )

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    return supplier


@router.put(
    "/suppliers/{supplier_id}",
    response_model=SupplierResponse,
)
def edit_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
):
    supplier_db = update_supplier(
        supplier_id,
        supplier,
        db,
    )

    if supplier_db is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    return supplier_db


@router.delete(
    "/suppliers/{supplier_id}",
)
def remove_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_supplier(
        supplier_id,
        db,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    return {
        "message": "Supplier deleted successfully."
    }

# ==========================================================
# PURCHASE ORDERS
# ==========================================================

@router.post(
    "/purchase-orders",
    response_model=PurchaseOrderResponse,
    status_code=201,
)
def add_purchase_order(
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_purchase_order(
            purchase_order,
            db,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/purchase-orders",
    response_model=list[PurchaseOrderResponse],
)
def list_purchase_orders(
    db: Session = Depends(get_db),
):
    return get_purchase_orders(db)


@router.get(
    "/purchase-orders/{po_id}",
    response_model=PurchaseOrderResponse,
)
def retrieve_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
):
    po = get_purchase_order(
        po_id,
        db,
    )

    if po is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found.",
        )

    return po


@router.put(
    "/purchase-orders/{po_id}",
    response_model=PurchaseOrderResponse,
)
def edit_purchase_order(
    po_id: int,
    purchase_order: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
):
    po = update_purchase_order(
        po_id,
        purchase_order,
        db,
    )

    if po is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found.",
        )

    return po


@router.delete(
    "/purchase-orders/{po_id}",
)
def remove_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_purchase_order(
        po_id,
        db,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found.",
        )

    return {
        "message": "Purchase Order deleted successfully."
    }

# ==========================================================
# SPEND ANALYTICS
# ==========================================================

@router.get(
    "/spend-analytics",
    response_model=SpendAnalyticsResponse,
)
def spend_analytics(
    db: Session = Depends(get_db),
):
    return get_spend_analytics(db)
# ==========================================================
# VENDOR PERFORMANCE
# ==========================================================

from app.procurement.schemas import (
    VendorPerformanceResponse,
)

from app.procurement.service import (
    get_vendor_performance,
)


@router.get(
    "/vendor-performance",
    response_model=list[VendorPerformanceResponse],
)
def vendor_performance(
    db: Session = Depends(get_db),
):
    return get_vendor_performance(db)
# ==========================================================
# LEAD TIME ANALYSIS
# ==========================================================

from app.procurement.schemas import (
    LeadTimeAnalysisResponse,
)

from app.procurement.service import (
    get_lead_time_analysis,
)


@router.get(
    "/lead-time-analysis",
    response_model=list[LeadTimeAnalysisResponse],
)
def lead_time_analysis(
    db: Session = Depends(get_db),
):
    return get_lead_time_analysis(db)