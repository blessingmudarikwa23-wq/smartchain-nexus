from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


# ==========================================================
# SUPPLIER SCHEMAS
# ==========================================================

class SupplierCreate(BaseModel):
    supplier_code: str
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    address: str
    city: str
    country: str
    tax_number: Optional[str] = None
    payment_terms: Optional[str] = None


class SupplierUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tax_number: Optional[str] = None
    payment_terms: Optional[str] = None
    status: Optional[bool] = None


class SupplierResponse(BaseModel):
    id: int
    supplier_code: str
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    address: str
    city: str
    country: str
    tax_number: Optional[str]
    payment_terms: Optional[str]
    status: bool

    class Config:
        from_attributes = True


# ==========================================================
# PURCHASE ORDER SCHEMAS
# ==========================================================

class PurchaseOrderCreate(BaseModel):
    po_number: str
    supplier_id: int
    order_date: date
    expected_delivery: date
    currency: str = "ZAR"
    total_amount: float = 0.0
    notes: Optional[str] = None


class PurchaseOrderUpdate(BaseModel):
    supplier_id: Optional[int] = None
    order_date: Optional[date] = None
    expected_delivery: Optional[date] = None
    status: Optional[str] = None
    currency: Optional[str] = None
    total_amount: Optional[float] = None
    notes: Optional[str] = None


class PurchaseOrderResponse(BaseModel):
    id: int
    po_number: str
    supplier_id: int
    order_date: date
    expected_delivery: date
    status: str
    currency: str
    total_amount: float
    notes: Optional[str]

    class Config:
        from_attributes = True


# ==========================================================
# SPEND ANALYTICS
# ==========================================================

class SpendAnalyticsResponse(BaseModel):
    total_spend: float
    total_purchase_orders: int
    average_order_value: float
    top_supplier: Optional[str] = None
    top_supplier_spend: float = 0.0
    currency: str = "ZAR"


# ==========================================================
# VENDOR PERFORMANCE
# ==========================================================

class VendorPerformanceResponse(BaseModel):
    supplier_name: str
    total_orders: int
    total_spend: float
    on_time_deliveries: int
    late_deliveries: int
    delivery_success_rate: float

    class Config:
        from_attributes = True


# ==========================================================
# LEAD TIME ANALYSIS
# ==========================================================

class LeadTimeAnalysisResponse(BaseModel):
    purchase_order: str
    supplier_name: str
    order_date: date
    expected_delivery: date
    lead_time_days: int

    class Config:
        from_attributes = True