from datetime import datetime

from sqlalchemy import func

from app.database.session import SessionLocal

from app.inventory.models import (
    InventoryItem,
    InventoryTransaction,
)

from app.procurement.models import (
    Supplier,
    PurchaseOrder as PurchaseOrderModel,
)

from app.sales.models import (
    Customer,
    SalesOrder as SalesOrderModel,
)

from app.dashboard.schemas import (
    DashboardSummary,
    KPIResponse,
    InventoryAlert,
    AIInsight,
    PurchaseOrder,
    SalesOrder,
    InventoryChartData,
    SalesChartData,
)


def get_dashboard_summary():
    db = SessionLocal()

    try:
        # ==========================================================
        # KPI DATA
        # ==========================================================

        products_count = (
            db.query(InventoryItem).count()
        )

        inventory_quantity = (
            db.query(
                func.coalesce(
                    func.sum(InventoryItem.quantity),
                    0,
                )
            ).scalar()
        )

        suppliers_count = (
            db.query(Supplier).count()
        )

        customers_count = (
            db.query(Customer).count()
        )

        # ==========================================================
        # INVENTORY ALERTS
        # ==========================================================

        inventory_records = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.quantity
                <= InventoryItem.minimum_stock
            )
            .order_by(
                InventoryItem.quantity.asc()
            )
            .limit(10)
            .all()
        )

        inventory_alerts = [
            InventoryAlert(
                product=item.item_name,
                quantity=item.quantity,
            )
            for item in inventory_records
        ]

        # ==========================================================
        # RECENT PURCHASE ORDERS
        # ==========================================================

        recent_purchase_orders = (
            db.query(PurchaseOrderModel)
            .order_by(
                PurchaseOrderModel.order_date.desc()
            )
            .limit(5)
            .all()
        )

        purchase_orders = []

        for order in recent_purchase_orders:
            supplier = (
                db.query(Supplier)
                .filter(
                    Supplier.id == order.supplier_id
                )
                .first()
            )

            supplier_name = (
                supplier.company_name
                if supplier
                else "Unknown Supplier"
            )

            purchase_orders.append(
                PurchaseOrder(
                    supplier=supplier_name,
                    reference=order.po_number,
                    status=order.status,
                )
            )

        # ==========================================================
        # RECENT SALES ORDERS
        # ==========================================================

        recent_sales_orders = (
            db.query(SalesOrderModel)
            .order_by(
                SalesOrderModel.order_date.desc()
            )
            .limit(5)
            .all()
        )

        sales_orders = [
            SalesOrder(
                customer=order.customer_code,
                reference=order.order_number,
                amount=order.total_amount,
            )
            for order in recent_sales_orders
        ]

        # ==========================================================
        # INVENTORY TREND
        #
        # Uses InventoryTransaction history.
        #
        # Positive transaction types:
        # IN, RECEIPT, RECEIVED, PURCHASE, ADD, ADDITION
        #
        # Negative transaction types:
        # OUT, ISSUE, ISSUED, SALE, REMOVE, REMOVAL
        #
        # The chart represents the calculated inventory position
        # over the available transaction history.
        # ==========================================================

        inventory_chart = []

        now = datetime.now()

        current_month = now.month
        current_year = now.year

        months = []

        for i in range(5, -1, -1):
            month = current_month - i
            year = current_year

            while month <= 0:
                month += 12
                year -= 1

            months.append(
                (
                    year,
                    month,
                )
            )

        # Get all inventory transactions
        transactions = (
            db.query(InventoryTransaction)
            .filter(
                InventoryTransaction.transaction_date.isnot(None)
            )
            .order_by(
                InventoryTransaction.transaction_date.asc()
            )
            .all()
        )

        # Calculate monthly net movement
        monthly_movements = {}

        for transaction in transactions:
            transaction_date = transaction.transaction_date

            key = (
                transaction_date.year,
                transaction_date.month,
            )

            transaction_type = (
                transaction.transaction_type
                or ""
            ).strip().lower()

            quantity = float(
                transaction.quantity or 0
            )

            positive_types = {
                "in",
                "receipt",
                "received",
                "purchase",
                "add",
                "addition",
                "stock_in",
                "increase",
            }

            negative_types = {
                "out",
                "issue",
                "issued",
                "sale",
                "remove",
                "removal",
                "stock_out",
                "decrease",
            }

            if transaction_type in negative_types:
                quantity = -abs(quantity)

            elif transaction_type in positive_types:
                quantity = abs(quantity)

            else:
                # Unknown transaction type.
                # Keep the stored quantity as-is.
                quantity = float(
                    transaction.quantity or 0
                )

            monthly_movements[key] = (
                monthly_movements.get(key, 0)
                + quantity
            )

        # Current inventory
        current_inventory = float(
            inventory_quantity or 0
        )

        # Calculate total movement from all known transactions
        total_transaction_movement = sum(
            monthly_movements.values()
        )

        # Estimated opening inventory before recorded transactions
        opening_inventory = (
            current_inventory
            - total_transaction_movement
        )

        running_inventory = opening_inventory

        for year, month in months:
            movement = monthly_movements.get(
                (year, month),
                0,
            )

            running_inventory += movement

            month_name = datetime(
                year,
                month,
                1,
            ).strftime("%B")

            inventory_chart.append(
                InventoryChartData(
                    month=month_name,
                    inventory=max(
                        0,
                        round(running_inventory, 2),
                    ),
                )
            )

        # ==========================================================
        # SALES VS PURCHASE ORDERS
        #
        # Sales come from sales_orders.total_amount
        # Purchases come from purchase_orders.total_amount
        # ==========================================================

        sales_chart = []

        for year, month in months:

            start_date = datetime(
                year,
                month,
                1,
            )

            if month == 12:
                end_date = datetime(
                    year + 1,
                    1,
                    1,
                )
            else:
                end_date = datetime(
                    year,
                    month + 1,
                    1,
                )

            sales_total = (
                db.query(
                    func.coalesce(
                        func.sum(
                            SalesOrderModel.total_amount
                        ),
                        0,
                    )
                )
                .filter(
                    SalesOrderModel.order_date
                    >= start_date,
                    SalesOrderModel.order_date
                    < end_date,
                )
                .scalar()
            )

            purchase_total = (
                db.query(
                    func.coalesce(
                        func.sum(
                            PurchaseOrderModel.total_amount
                        ),
                        0,
                    )
                )
                .filter(
                    PurchaseOrderModel.order_date
                    >= start_date,
                    PurchaseOrderModel.order_date
                    < end_date,
                )
                .scalar()
            )

            month_name = start_date.strftime(
                "%B"
            )

            sales_chart.append(
                SalesChartData(
                    month=month_name,
                    sales=round(
                        float(sales_total or 0),
                        2,
                    ),
                    purchase=round(
                        float(purchase_total or 0),
                        2,
                    ),
                )
            )

        # ==========================================================
        # AI INSIGHTS
        # ==========================================================

        ai_insights = []

        low_stock_count = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.quantity
                <= InventoryItem.minimum_stock
            )
            .count()
        )

        if low_stock_count > 0:
            ai_insights.append(
                AIInsight(
                    title="Inventory Risk",
                    message=(
                        f"{low_stock_count} inventory "
                        "item(s) are at or below minimum "
                        "stock levels."
                    ),
                )
            )
        else:
            ai_insights.append(
                AIInsight(
                    title="Inventory Health",
                    message=(
                        "Inventory levels are currently "
                        "above minimum stock thresholds."
                    ),
                )
            )

        # Sales insight
        total_sales = (
            db.query(
                func.coalesce(
                    func.sum(
                        SalesOrderModel.total_amount
                    ),
                    0,
                )
            ).scalar()
        )

        total_purchases = (
            db.query(
                func.coalesce(
                    func.sum(
                        PurchaseOrderModel.total_amount
                    ),
                    0,
                )
            ).scalar()
        )

        ai_insights.append(
            AIInsight(
                title="Sales Performance",
                message=(
                    f"Recorded sales revenue is "
                    f"R{float(total_sales or 0):,.2f}."
                ),
            )
        )

        ai_insights.append(
            AIInsight(
                title="Procurement Spend",
                message=(
                    f"Recorded purchase order value is "
                    f"R{float(total_purchases or 0):,.2f}."
                ),
            )
        )

        # ==========================================================
        # RETURN DASHBOARD
        # ==========================================================

        return DashboardSummary(
            kpis=KPIResponse(
                products=products_count,
                inventory=inventory_quantity,
                suppliers=suppliers_count,
                customers=customers_count,
            ),

            inventory_alerts=inventory_alerts,

            ai_insights=ai_insights,

            purchase_orders=purchase_orders,

            sales_orders=sales_orders,

            inventory_chart=inventory_chart,

            sales_chart=sales_chart,
        )

    finally:
        db.close()