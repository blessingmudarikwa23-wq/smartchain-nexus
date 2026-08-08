from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.sales.schemas import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,

    SalesOrderCreate,
    SalesOrderUpdate,
    SalesOrderResponse,

    RevenueAnalysisCreate,
    RevenueAnalysisUpdate,
    RevenueAnalysisResponse,

    ProfitMarginCreate,
    ProfitMarginUpdate,
    ProfitMarginResponse,
)

from app.sales.service import (
    get_sales_dashboard,

    create_customer,
    get_customers,
    get_customer,
    update_customer,
    delete_customer,

    create_sales_order,
    get_sales_orders,
    get_sales_order,
    update_sales_order,
    delete_sales_order,

    create_revenue_analysis,
    get_revenue_analyses,
    get_revenue_analysis,
    update_revenue_analysis,
    delete_revenue_analysis,

    create_profit_margin,
    get_profit_margins,
    get_profit_margin,
    update_profit_margin,
    delete_profit_margin,
)


# ==========================================================
# SALES ROUTER
# ==========================================================

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


# ==========================================================
# SALES DASHBOARD
# GET /sales/dashboard
# ==========================================================

@router.get(
    "/dashboard",
)
def sales_dashboard_route():
    return get_sales_dashboard()


# ==========================================================
# CUSTOMER MANAGEMENT
# ==========================================================

# CREATE CUSTOMER
# POST /sales/customers
# ==========================================================

@router.post(
    "/customers",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer_route(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
):
    return create_customer(
        db,
        payload,
    )


# ==========================================================
# GET ALL CUSTOMERS
# GET /sales/customers
# ==========================================================

@router.get(
    "/customers",
    response_model=list[CustomerResponse],
)
def get_customers_route(
    db: Session = Depends(get_db),
):
    return get_customers(db)


# ==========================================================
# GET ONE CUSTOMER
# GET /sales/customers/{customer_id}
# ==========================================================

@router.get(
    "/customers/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer_route(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = get_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


# ==========================================================
# UPDATE CUSTOMER
# PUT /sales/customers/{customer_id}
# ==========================================================

@router.put(
    "/customers/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer_route(
    customer_id: int,
    payload: CustomerUpdate,
    db: Session = Depends(get_db),
):
    customer = update_customer(
        db,
        customer_id,
        payload,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


# ==========================================================
# DELETE CUSTOMER
# DELETE /sales/customers/{customer_id}
# ==========================================================

@router.delete(
    "/customers/{customer_id}",
)
def delete_customer_route(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = delete_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return {
        "message": "Customer deleted successfully",
        "customer_id": customer_id,
    }


# ==========================================================
# SALES ORDERS
# ==========================================================

# CREATE SALES ORDER
# POST /sales/orders
# ==========================================================

@router.post(
    "/orders",
    response_model=SalesOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sales_order_route(
    payload: SalesOrderCreate,
    db: Session = Depends(get_db),
):
    return create_sales_order(
        db,
        payload,
    )


# ==========================================================
# GET ALL SALES ORDERS
# GET /sales/orders
# ==========================================================

@router.get(
    "/orders",
    response_model=list[SalesOrderResponse],
)
def get_sales_orders_route(
    db: Session = Depends(get_db),
):
    return get_sales_orders(db)


# ==========================================================
# GET ONE SALES ORDER
# GET /sales/orders/{order_id}
# ==========================================================

@router.get(
    "/orders/{order_id}",
    response_model=SalesOrderResponse,
)
def get_sales_order_route(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = get_sales_order(
        db,
        order_id,
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales Order not found",
        )

    return order


# ==========================================================
# UPDATE SALES ORDER
# PUT /sales/orders/{order_id}
# ==========================================================

@router.put(
    "/orders/{order_id}",
    response_model=SalesOrderResponse,
)
def update_sales_order_route(
    order_id: int,
    payload: SalesOrderUpdate,
    db: Session = Depends(get_db),
):
    order = update_sales_order(
        db,
        order_id,
        payload,
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales Order not found",
        )

    return order


# ==========================================================
# DELETE SALES ORDER
# DELETE /sales/orders/{order_id}
# ==========================================================

@router.delete(
    "/orders/{order_id}",
)
def delete_sales_order_route(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = delete_sales_order(
        db,
        order_id,
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales Order not found",
        )

    return {
        "message": "Sales Order deleted successfully",
        "order_id": order_id,
    }
# ==========================================================
# REVENUE ANALYSIS
# ==========================================================


# ==========================================================
# CREATE REVENUE ANALYSIS
# POST /sales/revenue-analysis
# ==========================================================

@router.post(
    "/revenue-analysis",
    response_model=RevenueAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_revenue_analysis_route(
    payload: RevenueAnalysisCreate,
    db: Session = Depends(get_db),
):
    return create_revenue_analysis(
        db,
        payload,
    )


# ==========================================================
# GET ALL REVENUE ANALYSES
# GET /sales/revenue-analysis
# ==========================================================

@router.get(
    "/revenue-analysis",
    response_model=list[RevenueAnalysisResponse],
)
def get_revenue_analyses_route(
    db: Session = Depends(get_db),
):
    return get_revenue_analyses(db)


# ==========================================================
# GET ONE REVENUE ANALYSIS
# GET /sales/revenue-analysis/{analysis_id}
# ==========================================================

@router.get(
    "/revenue-analysis/{analysis_id}",
    response_model=RevenueAnalysisResponse,
)
def get_revenue_analysis_route(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_revenue_analysis(
        db,
        analysis_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Revenue Analysis not found",
        )

    return analysis


# ==========================================================
# UPDATE REVENUE ANALYSIS
# PUT /sales/revenue-analysis/{analysis_id}
# ==========================================================

@router.put(
    "/revenue-analysis/{analysis_id}",
    response_model=RevenueAnalysisResponse,
)
def update_revenue_analysis_route(
    analysis_id: int,
    payload: RevenueAnalysisUpdate,
    db: Session = Depends(get_db),
):
    analysis = update_revenue_analysis(
        db,
        analysis_id,
        payload,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Revenue Analysis not found",
        )

    return analysis


# ==========================================================
# DELETE REVENUE ANALYSIS
# DELETE /sales/revenue-analysis/{analysis_id}
# ==========================================================

@router.delete(
    "/revenue-analysis/{analysis_id}",
)
def delete_revenue_analysis_route(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = delete_revenue_analysis(
        db,
        analysis_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Revenue Analysis not found",
        )

    return {
        "message": "Revenue Analysis deleted successfully",
        "analysis_id": analysis_id,
    }
# ==========================================================
# PROFIT MARGIN
# ==========================================================


# ==========================================================
# CREATE PROFIT MARGIN
# POST /sales/profit-margin
# ==========================================================

@router.post(
    "/profit-margin",
    response_model=ProfitMarginResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_profit_margin_route(
    payload: ProfitMarginCreate,
    db: Session = Depends(get_db),
):
    return create_profit_margin(
        db,
        payload,
    )


# ==========================================================
# GET ALL PROFIT MARGINS
# GET /sales/profit-margin
# ==========================================================

@router.get(
    "/profit-margin",
    response_model=list[ProfitMarginResponse],
)
def get_profit_margins_route(
    db: Session = Depends(get_db),
):
    return get_profit_margins(db)


# ==========================================================
# GET ONE PROFIT MARGIN
# GET /sales/profit-margin/{analysis_id}
# ==========================================================

@router.get(
    "/profit-margin/{analysis_id}",
    response_model=ProfitMarginResponse,
)
def get_profit_margin_route(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = get_profit_margin(
        db,
        analysis_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profit Margin not found",
        )

    return analysis


# ==========================================================
# UPDATE PROFIT MARGIN
# PUT /sales/profit-margin/{analysis_id}
# ==========================================================

@router.put(
    "/profit-margin/{analysis_id}",
    response_model=ProfitMarginResponse,
)
def update_profit_margin_route(
    analysis_id: int,
    payload: ProfitMarginUpdate,
    db: Session = Depends(get_db),
):
    analysis = update_profit_margin(
        db,
        analysis_id,
        payload,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profit Margin not found",
        )

    return analysis


# ==========================================================
# DELETE PROFIT MARGIN
# DELETE /sales/profit-margin/{analysis_id}
# ==========================================================

@router.delete(
    "/profit-margin/{analysis_id}",
)
def delete_profit_margin_route(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = delete_profit_margin(
        db,
        analysis_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profit Margin not found",
        )

    return {
        "message": "Profit Margin deleted successfully",
        "analysis_id": analysis_id,
    }