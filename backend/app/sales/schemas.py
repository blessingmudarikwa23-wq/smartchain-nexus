from sqlalchemy.orm import Session

from app.sales.models import (
    Customer,
    SalesOrder,
    RevenueAnalysis,
    ProfitMargin,
)

from app.sales.schemas import (
    CustomerCreate,
    CustomerUpdate,
    SalesOrderCreate,
    SalesOrderUpdate,
    RevenueAnalysisCreate,
    RevenueAnalysisUpdate,
    ProfitMarginCreate,
    ProfitMarginUpdate,
)

def get_sales_dashboard():

    return SalesDashboard(

        customers=[
            Customer(
                id=1,
                name="ABC Retail",
                email="sales@abcretail.com",
            ),
            Customer(
                id=2,
                name="Tech Solutions",
                email="info@techsolutions.com",
            ),
            Customer(
                id=3,
                name="Global Traders",
                email="sales@globaltraders.com",
            ),
        ],

        sales_orders=[
            SalesOrder(
                reference="SO-2001",
                customer="ABC Retail",
                amount=12450,
                status="Completed",
            ),
            SalesOrder(
                reference="SO-2002",
                customer="Tech Solutions",
                amount=8920,
                status="Processing",
            ),
            SalesOrder(
                reference="SO-2003",
                customer="Global Traders",
                amount=15730,
                status="Completed",
            ),
        ],

        revenue=RevenueAnalysis(
            total_revenue=2450000,
            monthly_revenue=185000,
            profit_margin=33.2,
        ),
    )
from app.sales.models import Customer
from app.sales.schemas import (
    CustomerCreate,
    CustomerUpdate,
)


# ==========================================================
# CUSTOMER MANAGEMENT SERVICE
# ==========================================================


def create_customer(
    db,
    payload: CustomerCreate,
):
    customer = Customer(
        **payload.model_dump()
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def get_customers(
    db,
):
    return (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )


def get_customer(
    db,
    customer_id: int,
):
    return (
        db.query(Customer)
        .filter(
            Customer.id == customer_id
        )
        .first()
    )


def update_customer(
    db,
    customer_id: int,
    payload: CustomerUpdate,
):
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id
        )
        .first()
    )

    if customer is None:
        return None

    updates = payload.model_dump(
        exclude_unset=True
    )

    for field, value in updates.items():
        setattr(
            customer,
            field,
            value,
        )

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(
    db,
    customer_id: int,
):
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id
        )
        .first()
    )

    if customer is None:
        return None

    db.delete(customer)
    db.commit()

    return customer
from sqlalchemy.orm import Session

from app.sales.models import SalesOrder
from app.sales.schemas import (
    SalesOrderCreate,
    SalesOrderUpdate,
)


# ==========================================================
# CREATE SALES ORDER
# ==========================================================

def create_sales_order(
    db: Session,
    payload: SalesOrderCreate,
):
    total_amount = payload.quantity * payload.unit_price

    order = SalesOrder(
        order_number=payload.order_number,
        customer_code=payload.customer_code,
        product=payload.product,
        quantity=payload.quantity,
        unit_price=payload.unit_price,
        total_amount=total_amount,
        order_status=payload.order_status,
        payment_status=payload.payment_status,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


# ==========================================================
# GET ALL SALES ORDERS
# ==========================================================

def get_sales_orders(db: Session):
    return (
        db.query(SalesOrder)
        .order_by(SalesOrder.id.desc())
        .all()
    )


# ==========================================================
# GET ONE SALES ORDER
# ==========================================================

def get_sales_order(
    db: Session,
    order_id: int,
):
    return (
        db.query(SalesOrder)
        .filter(SalesOrder.id == order_id)
        .first()
    )


# ==========================================================
# UPDATE SALES ORDER
# ==========================================================

def update_sales_order(
    db: Session,
    order_id: int,
    payload: SalesOrderUpdate,
):
    order = get_sales_order(db, order_id)

    if order is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(order, field, value)

    # Recalculate total if quantity or price changed
    if (
        "quantity" in update_data
        or "unit_price" in update_data
    ):
        order.total_amount = (
            order.quantity * order.unit_price
        )

    db.commit()
    db.refresh(order)

    return order


# ==========================================================
# DELETE SALES ORDER
# ==========================================================

def delete_sales_order(
    db: Session,
    order_id: int,
):
    order = get_sales_order(db, order_id)

    if order is None:
        return None

    db.delete(order)
    db.commit()

    return order
from sqlalchemy.orm import Session

from app.sales.models import RevenueAnalysis
from app.sales.schemas import (
    RevenueAnalysisCreate,
    RevenueAnalysisUpdate,
)


# ==========================================================
# REVENUE ANALYSIS SERVICE
# ==========================================================


# ==========================================================
# CREATE
# ==========================================================

def create_revenue_analysis(
    db: Session,
    payload: RevenueAnalysisCreate,
):
    analysis = RevenueAnalysis(
        analysis_period=payload.analysis_period,
        total_orders=payload.total_orders,
        total_units_sold=payload.total_units_sold,
        total_revenue=payload.total_revenue,
        average_order_value=payload.average_order_value,
        revenue_growth_rate=payload.revenue_growth_rate,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


# ==========================================================
# GET ALL
# ==========================================================

def get_revenue_analyses(
    db: Session,
):
    return (
        db.query(RevenueAnalysis)
        .order_by(RevenueAnalysis.id.desc())
        .all()
    )


# ==========================================================
# GET ONE
# ==========================================================

def get_revenue_analysis(
    db: Session,
    analysis_id: int,
):
    return (
        db.query(RevenueAnalysis)
        .filter(
            RevenueAnalysis.id == analysis_id
        )
        .first()
    )


# ==========================================================
# UPDATE
# ==========================================================

def update_revenue_analysis(
    db: Session,
    analysis_id: int,
    payload: RevenueAnalysisUpdate,
):
    analysis = get_revenue_analysis(
        db,
        analysis_id,
    )

    if analysis is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            analysis,
            field,
            value,
        )

    db.commit()
    db.refresh(analysis)

    return analysis


# ==========================================================
# DELETE
# ==========================================================

def delete_revenue_analysis(
    db: Session,
    analysis_id: int,
):
    analysis = get_revenue_analysis(
        db,
        analysis_id,
    )

    if analysis is None:
        return None

    db.delete(analysis)
    db.commit()

    return analysis
# ==========================================================
# PROFIT MARGIN SERVICE
# ==========================================================


# ==========================================================
# CREATE
# ==========================================================

def create_profit_margin(
    db: Session,
    payload: ProfitMarginCreate,
):
    analysis = ProfitMargin(
        analysis_period=payload.analysis_period,
        total_revenue=payload.total_revenue,
        total_cost=payload.total_cost,
        gross_profit=payload.gross_profit,
        profit_margin_percentage=payload.profit_margin_percentage,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


# ==========================================================
# GET ALL
# ==========================================================

def get_profit_margins(
    db: Session,
):
    return (
        db.query(ProfitMargin)
        .order_by(ProfitMargin.id.desc())
        .all()
    )


# ==========================================================
# GET ONE
# ==========================================================

def get_profit_margin(
    db: Session,
    analysis_id: int,
):
    return (
        db.query(ProfitMargin)
        .filter(
            ProfitMargin.id == analysis_id
        )
        .first()
    )


# ==========================================================
# UPDATE
# ==========================================================

def update_profit_margin(
    db: Session,
    analysis_id: int,
    payload: ProfitMarginUpdate,
):
    analysis = get_profit_margin(
        db,
        analysis_id,
    )

    if analysis is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            analysis,
            field,
            value,
        )

    db.commit()
    db.refresh(analysis)

    return analysis


# ==========================================================
# DELETE
# ==========================================================

def delete_profit_margin(
    db: Session,
    analysis_id: int,
):
    analysis = get_profit_margin(
        db,
        analysis_id,
    )

    if analysis is None:
        return None

    db.delete(analysis)
    db.commit()

    return analysis