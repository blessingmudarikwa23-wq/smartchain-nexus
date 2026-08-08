from pydantic import BaseModel


class Customer(BaseModel):
    id: int
    name: str
    email: str


class SalesOrder(BaseModel):
    reference: str
    customer: str
    amount: float
    status: str


class RevenueAnalysis(BaseModel):
    total_revenue: float
    monthly_revenue: float
    profit_margin: float


class SalesDashboard(BaseModel):
    customers: list[Customer]
    sales_orders: list[SalesOrder]
    revenue: RevenueAnalysis
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# CUSTOMER MANAGEMENT
# ==========================================================

class CustomerBase(BaseModel):
    customer_code: str
    customer_name: str

    email: str | None = None
    phone: str | None = None
    address: str | None = None

    customer_type: str = "Retail"

    total_orders: int = 0
    total_spend: float = 0.0

    status: str = "Active"


# ==========================================================
# CREATE
# ==========================================================

class CustomerCreate(CustomerBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class CustomerUpdate(BaseModel):
    customer_code: str | None = None
    customer_name: str | None = None

    email: str | None = None
    phone: str | None = None
    address: str | None = None

    customer_type: str | None = None

    total_orders: int | None = None
    total_spend: float | None = None

    status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class CustomerResponse(CustomerBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# SALES ORDER BASE
# ==========================================================

class SalesOrderBase(BaseModel):
    order_number: str
    customer_code: str
    product: str

    quantity: int = 1
    unit_price: float = 0.0
    total_amount: float = 0.0

    order_status: str = "Pending"
    payment_status: str = "Pending"


# ==========================================================
# CREATE
# ==========================================================

class SalesOrderCreate(SalesOrderBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class SalesOrderUpdate(BaseModel):
    customer_code: str | None = None
    product: str | None = None

    quantity: int | None = None
    unit_price: float | None = None
    total_amount: float | None = None

    order_status: str | None = None
    payment_status: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class SalesOrderResponse(SalesOrderBase):
    id: int

    order_date: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
# ==========================================================
# REVENUE ANALYSIS
# ==========================================================

class RevenueAnalysisBase(BaseModel):
    analysis_period: str

    total_orders: int = 0
    total_units_sold: int = 0

    total_revenue: float = 0.0
    average_order_value: float = 0.0
    revenue_growth_rate: float = 0.0


# ==========================================================
# CREATE
# ==========================================================

class RevenueAnalysisCreate(RevenueAnalysisBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class RevenueAnalysisUpdate(BaseModel):
    analysis_period: str | None = None

    total_orders: int | None = None
    total_units_sold: int | None = None

    total_revenue: float | None = None
    average_order_value: float | None = None
    revenue_growth_rate: float | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class RevenueAnalysisResponse(RevenueAnalysisBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
# ==========================================================
# PROFIT MARGIN
# ==========================================================

class ProfitMarginBase(BaseModel):
    analysis_period: str

    total_revenue: float = 0.0
    total_cost: float = 0.0
    gross_profit: float = 0.0
    profit_margin_percentage: float = 0.0


# ==========================================================
# CREATE
# ==========================================================

class ProfitMarginCreate(ProfitMarginBase):
    pass


# ==========================================================
# UPDATE
# ==========================================================

class ProfitMarginUpdate(BaseModel):
    analysis_period: str | None = None

    total_revenue: float | None = None
    total_cost: float | None = None
    gross_profit: float | None = None
    profit_margin_percentage: float | None = None


# ==========================================================
# RESPONSE
# ==========================================================

class ProfitMarginResponse(ProfitMarginBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )