from collections import defaultdict
from datetime import datetime

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


# ==========================================================
# SALES DASHBOARD
# ==========================================================

def get_sales_dashboard(db: Session):
    customers = (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .limit(5)
        .all()
    )

    sales_orders = (
        db.query(SalesOrder)
        .order_by(SalesOrder.id.desc())
        .limit(5)
        .all()
    )

    revenue_analyses = get_revenue_analyses(db)

    total_revenue = sum(
        float(order.total_amount or 0)
        for order in db.query(SalesOrder).all()
    )

    total_orders = (
        db.query(SalesOrder).count()
    )

    monthly_revenue = 0.0

    if revenue_analyses:
        monthly_revenue = float(
            revenue_analyses[0].get(
                "total_revenue",
                0,
            )
        )

    return {
        "customers": customers,
        "sales_orders": sales_orders,
        "revenue": {
            "total_revenue": round(
                total_revenue,
                2,
            ),
            "monthly_revenue": round(
                monthly_revenue,
                2,
            ),
            "total_orders": total_orders,
        },
    }


# ==========================================================
# CUSTOMER MANAGEMENT
# ==========================================================

def create_customer(
    db: Session,
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
    db: Session,
):
    return (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )


def get_customer(
    db: Session,
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
    db: Session,
    customer_id: int,
    payload: CustomerUpdate,
):
    customer = get_customer(
        db,
        customer_id,
    )

    if customer is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            customer,
            field,
            value,
        )

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(
    db: Session,
    customer_id: int,
):
    customer = get_customer(
        db,
        customer_id,
    )

    if customer is None:
        return None

    db.delete(customer)
    db.commit()

    return customer


# ==========================================================
# SALES ORDERS
# ==========================================================

def create_sales_order(
    db: Session,
    payload: SalesOrderCreate,
):
    total_amount = (
        payload.quantity
        * payload.unit_price
    )

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


def get_sales_orders(
    db: Session,
):
    return (
        db.query(SalesOrder)
        .order_by(SalesOrder.id.desc())
        .all()
    )


def get_sales_order(
    db: Session,
    order_id: int,
):
    return (
        db.query(SalesOrder)
        .filter(
            SalesOrder.id == order_id
        )
        .first()
    )


def update_sales_order(
    db: Session,
    order_id: int,
    payload: SalesOrderUpdate,
):
    order = get_sales_order(
        db,
        order_id,
    )

    if order is None:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            order,
            field,
            value,
        )

    if (
        "quantity" in update_data
        or "unit_price" in update_data
    ):
        order.total_amount = (
            order.quantity
            * order.unit_price
        )

    db.commit()
    db.refresh(order)

    return order


def delete_sales_order(
    db: Session,
    order_id: int,
):
    order = get_sales_order(
        db,
        order_id,
    )

    if order is None:
        return None

    db.delete(order)
    db.commit()

    return order


# ==========================================================
# REVENUE ANALYSIS
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
        average_order_value=(
            payload.average_order_value
        ),
        revenue_growth_rate=(
            payload.revenue_growth_rate
        ),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_revenue_analyses(
    db: Session,
):
    sales_orders = (
        db.query(SalesOrder)
        .order_by(
            SalesOrder.order_date.asc()
        )
        .all()
    )

    if not sales_orders:
        return []

    monthly_data = defaultdict(
        lambda: {
            "total_orders": 0,
            "total_units_sold": 0,
            "total_revenue": 0.0,
        }
    )

    for order in sales_orders:

        order_date = (
            order.order_date
            or order.created_at
            or datetime.utcnow()
        )

        period = order_date.strftime(
            "%Y-%m"
        )

        monthly_data[period][
            "total_orders"
        ] += 1

        monthly_data[period][
            "total_units_sold"
        ] += int(
            order.quantity or 0
        )

        monthly_data[period][
            "total_revenue"
        ] += float(
            order.total_amount or 0
        )

    chronological_periods = sorted(
        monthly_data.keys()
    )

    calculated = []

    previous_revenue = None

    for index, period in enumerate(
        chronological_periods
    ):

        data = monthly_data[period]

        total_orders = data[
            "total_orders"
        ]

        total_units_sold = data[
            "total_units_sold"
        ]

        total_revenue = data[
            "total_revenue"
        ]

        average_order_value = (
            total_revenue / total_orders
            if total_orders > 0
            else 0.0
        )

        revenue_growth_rate = 0.0

        if (
            previous_revenue is not None
            and previous_revenue != 0
        ):
            revenue_growth_rate = (
                (
                    total_revenue
                    - previous_revenue
                )
                / previous_revenue
            ) * 100

        calculated.append(
            {
                "id": index + 1,
                "analysis_period": period,
                "total_orders": total_orders,
                "total_units_sold": total_units_sold,
                "total_revenue": round(
                    total_revenue,
                    2,
                ),
                "average_order_value": round(
                    average_order_value,
                    2,
                ),
                "revenue_growth_rate": round(
                    revenue_growth_rate,
                    2,
                ),
                "created_at": None,
                "updated_at": None,
            }
        )

        previous_revenue = total_revenue

    calculated.reverse()

    return calculated


def get_revenue_analysis(
    db: Session,
    analysis_id: int,
):
    """
    Gets a stored RevenueAnalysis record
    by its database ID.
    """

    return (
        db.query(RevenueAnalysis)
        .filter(
            RevenueAnalysis.id == analysis_id
        )
        .first()
    )


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
# PROFIT MARGIN
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
        profit_margin_percentage=(
            payload.profit_margin_percentage
        ),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_profit_margins(
    db: Session,
):
    return (
        db.query(ProfitMargin)
        .order_by(
            ProfitMargin.id.desc()
        )
        .all()
    )


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