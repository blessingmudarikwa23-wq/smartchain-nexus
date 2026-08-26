import { useEffect, useState } from "react";

import InventoryChart from "../components/charts/InventoryChart";
import SalesChart from "../components/charts/SalesChart";

import { dashboardService } from "../services/dashboardService";

/* ==========================================================================
   TYPES
   ========================================================================== */

type InventoryChartData = {
  month: string;
  inventory: number;
};

type SalesChartData = {
  month: string;
  sales: number;
  purchase: number;
};

type InventoryAlert = {
  product: string;
  quantity: number;
};

type AIInsight = {
  title: string;
  message: string;
};

type PurchaseOrder = {
  supplier: string;
  reference: string;
  status: string;
};

type SalesOrder = {
  customer: string;
  reference: string;
  amount: number;
};

type DashboardSummary = {
  kpis: {
    products: number;
    inventory: number;
    suppliers: number;
    customers: number;
  };

  inventory_alerts: InventoryAlert[];
  ai_insights: AIInsight[];
  purchase_orders: PurchaseOrder[];
  sales_orders: SalesOrder[];

  inventory_chart: InventoryChartData[];
  sales_chart: SalesChartData[];
};


/* ==========================================================================
   ICON SYSTEM
   ========================================================================== */

type IconName =
  | "box"
  | "warehouse"
  | "truck"
  | "users"
  | "alert"
  | "brain"
  | "chart"
  | "purchase"
  | "sales"
  | "arrow"
  | "check"
  | "clock"
  | "currency"
  | "spark"
  | "shield"
  | "package"
  | "activity";

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<IconName, React.ReactNode> = {
    box: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="m4 7.5 8 4.5 8-4.5" />
        <path d="M12 12v9" />
      </>
    ),

    warehouse: (
      <>
        <path d="M3 10 12 4l9 6" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </>
    ),

    truck: (
      <>
        <path d="M3 6h11v11H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),

    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M16 5a3 3 0 0 1 0 6" />
        <path d="M18 14a5 5 0 0 1 3 6" />
      </>
    ),

    alert: (
      <>
        <path d="M12 4 21 20H3z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),

    brain: (
      <>
        <path d="M9 4a3 3 0 0 0-5 2.2A3.5 3.5 0 0 0 5 13a3 3 0 0 0 3 5h1V4Z" />
        <path d="M15 4a3 3 0 0 1 5 2.2A3.5 3.5 0 0 1 19 13a3 3 0 0 1-3 5h-1V4Z" />
        <path d="M12 4v16" />
      </>
    ),

    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </>
    ),

    purchase: (
      <>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M8 17h3" />
      </>
    ),

    sales: (
      <>
        <path d="M4 5h16v14H4z" />
        <path d="M8 15v-4" />
        <path d="M12 15V8" />
        <path d="M16 15v-2" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    currency: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5c-.7-.7-1.7-1-3-1-1.8 0-3 1-3 2.3 0 3.2 6 1.5 6 4.3 0 1.3-1.2 2.4-3.2 2.4-1.4 0-2.5-.4-3.3-1.2" />
        <path d="M12 6v12" />
      </>
    ),

    spark: (
      <>
        <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4z" />
        <path d="m19 16 .5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5z" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),

    package: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="M8 5.5 16 10" />
        <path d="M16 5.5 8 10" />
        <path d="M12 12v9" />
      </>
    ),

    activity: (
      <>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}


/* ==========================================================================
   HELPERS
   ========================================================================== */

function formatCurrency(value: number) {
  return `R${Number(value || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusClass(status: string) {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("approved") ||
    normalized.includes("completed") ||
    normalized.includes("active")
  ) {
    return "status-approved";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("processing")
  ) {
    return "status-pending";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("rejected") ||
    normalized.includes("failed")
  ) {
    return "status-danger";
  }

  return "status-neutral";
}


/* ==========================================================================
   MAIN DASHBOARD
   ========================================================================== */

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary>({
    kpis: {
      products: 0,
      inventory: 0,
      suppliers: 0,
      customers: 0,
    },

    inventory_alerts: [],
    ai_insights: [],
    purchase_orders: [],
    sales_orders: [],

    inventory_chart: [],
    sales_chart: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data = await dashboardService.getSummary();

      console.log("Dashboard data:", data);

      setSummary(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sc-dashboard">

      {/* ==================================================================
          PAGE HEADER
      ================================================================== */}

      <section className="sc-dashboard-header">

        <div className="sc-header-content">

          <div className="sc-live-label">
            <span className="sc-live-dot" />
            LIVE OPERATIONS
          </div>

          <h1>Executive Dashboard</h1>

          <p>
            Real-time visibility across inventory, procurement,
            sales and supply chain operations.
          </p>

        </div>


        <div className="sc-intelligence-card">

          <div className="sc-intelligence-icon">
            <Icon name="spark" size={26} />
          </div>

          <strong>SmartChain</strong>

          <span>Intelligence</span>

        </div>

      </section>


      {/* ==================================================================
          KPI SECTION
      ================================================================== */}

      <section className="sc-section">

        <div className="sc-section-heading">
          <span>KEY PERFORMANCE INDICATORS</span>
        </div>


        <div className="sc-kpi-grid">

          <KpiCard
            title="Products"
            value={summary.kpis.products}
            icon="box"
            iconClass="blue"
          />

          <KpiCard
            title="Inventory"
            value={summary.kpis.inventory}
            icon="warehouse"
            iconClass="green"
          />

          <KpiCard
            title="Suppliers"
            value={summary.kpis.suppliers}
            icon="truck"
            iconClass="orange"
          />

          <KpiCard
            title="Customers"
            value={summary.kpis.customers}
            icon="users"
            iconClass="purple"
          />

        </div>

      </section>


      {/* ==================================================================
          OPERATIONAL ANALYTICS
      ================================================================== */}

      <section className="sc-section analytics-section">

        <div className="sc-section-heading">
          <span>OPERATIONAL ANALYTICS</span>
        </div>


        <div className="sc-chart-grid">

          <div className="sc-chart-card inventory-chart-card">

            <div className="sc-chart-header">

              <div>
                <span className="sc-card-kicker">
                  INVENTORY
                </span>

                <h3>Inventory Trend</h3>

                <p>
                  Inventory movement across the last six months
                </p>
              </div>

              <div className="sc-chart-icon blue">
                <Icon name="activity" size={20} />
              </div>

            </div>

            <div className="sc-chart-container">
              <InventoryChart
                data={summary.inventory_chart}
              />
            </div>

          </div>


          <div className="sc-chart-card">

            <div className="sc-chart-header">

              <div>
                <span className="sc-card-kicker">
                  FINANCIAL PERFORMANCE
                </span>

                <h3>Sales vs Purchase Orders</h3>

                <p>
                  Monthly sales revenue compared with procurement spend
                </p>
              </div>

              <div className="sc-chart-icon orange">
                <Icon name="chart" size={20} />
              </div>

            </div>

            <div className="sc-chart-container">
              <SalesChart
                data={summary.sales_chart}
              />
            </div>

          </div>

        </div>

      </section>


      {/* ==================================================================
          ATTENTION REQUIRED
      ================================================================== */}

      <section className="sc-section lower-section">

        <div className="sc-section-heading left">

          <div>
            <span>ATTENTION REQUIRED</span>

            <p>
              Operational issues requiring monitoring or action
            </p>
          </div>

          <div className="sc-section-heading-icon warning">
            <Icon name="alert" size={20} />
          </div>

        </div>


        <div className="sc-lower-grid">

          {/* ==============================================================
              INVENTORY ALERTS
          ============================================================== */}

          <div className="sc-panel">

            <div className="sc-panel-header">

              <div className="sc-panel-title">

                <div className="sc-panel-icon red">
                  <Icon name="alert" size={20} />
                </div>

                <div>
                  <h3>Inventory Alerts</h3>

                  <p>
                    Stock level requires attention
                  </p>
                </div>

              </div>


              <div className="sc-count-badge red">
                {summary.inventory_alerts.length} Alerts
              </div>

            </div>


            <div className="sc-alert-list">

              {loading ? (

                <LoadingState />

              ) : summary.inventory_alerts.length === 0 ? (

                <EmptyState
                  icon="check"
                  title="Inventory is healthy"
                  message="No products are currently below their minimum stock level."
                  type="green"
                />

              ) : (

                summary.inventory_alerts.map(
                  (alert, index) => (

                    <div
                      className="sc-alert-row"
                      key={`${alert.product}-${index}`}
                    >

                      <div className="sc-alert-product">

                        <div className="sc-alert-product-icon">
                          <Icon name="package" size={17} />
                        </div>

                        <div>
                          <strong>
                            {alert.product}
                          </strong>

                          <span>
                            Stock level requires attention
                          </span>
                        </div>

                      </div>


                      <div className="sc-stock-value">

                        <span>
                          Stock
                        </span>

                        <strong>
                          {alert.quantity}
                        </strong>

                      </div>


                      <div className="sc-alert-arrow">
                        <Icon name="arrow" size={16} />
                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* ==============================================================
              AI INSIGHTS
          ============================================================== */}

          <div className="sc-panel">

            <div className="sc-panel-header">

              <div className="sc-panel-title">

                <div className="sc-panel-icon purple">
                  <Icon name="brain" size={20} />
                </div>

                <div>
                  <h3>AI Insights</h3>

                  <p>
                    Intelligent analysis of supply chain performance
                  </p>
                </div>

              </div>


              <div className="sc-ai-badge">
                <Icon name="spark" size={13} />
                AI POWERED
              </div>

            </div>


            <div className="sc-insight-list">

              {loading ? (

                <LoadingState />

              ) : summary.ai_insights.length === 0 ? (

                <EmptyState
                  icon="brain"
                  title="No insights available"
                  message="There are currently no AI-generated insights."
                  type="purple"
                />

              ) : (

                summary.ai_insights.map(
                  (insight, index) => {

                    const icon =
                      index === 0
                        ? "alert"
                        : index === 1
                        ? "chart"
                        : "currency";

                    const iconClass =
                      index === 0
                        ? "red"
                        : index === 1
                        ? "green"
                        : "blue";

                    return (
                      <div
                        className="sc-insight-row"
                        key={`${insight.title}-${index}`}
                      >

                        <div
                          className={`sc-insight-icon ${iconClass}`}
                        >
                          <Icon
                            name={icon as IconName}
                            size={17}
                          />
                        </div>

                        <div className="sc-insight-content">

                          <strong>
                            {insight.title}
                          </strong>

                          <p>
                            {insight.message}
                          </p>

                        </div>

                        <div className="sc-insight-status">
                          <Icon
                            name="arrow"
                            size={15}
                          />
                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================================
          RECENT TRANSACTIONS
      ================================================================== */}

      <section className="sc-section transactions-section">

        <div className="sc-section-heading left">

          <div>
            <span>RECENT TRANSACTIONS</span>

            <p>
              Latest procurement and sales activity across the platform
            </p>
          </div>

          <div className="sc-section-heading-icon blue">
            <Icon name="activity" size={20} />
          </div>

        </div>


        <div className="sc-lower-grid">

          {/* ==============================================================
              PURCHASE ORDERS
          ============================================================== */}

          <div className="sc-panel transaction-panel">

            <div className="sc-panel-header">

              <div className="sc-panel-title">

                <div className="sc-panel-icon blue">
                  <Icon name="purchase" size={20} />
                </div>

                <div>
                  <h3>Purchase Orders</h3>

                  <p>
                    Recent procurement activity
                  </p>
                </div>

              </div>

              <div className="sc-panel-header-label">
                Procurement
              </div>

            </div>


            <div className="sc-table">

              <div className="sc-table-header purchase-table">

                <span>SUPPLIER</span>
                <span>REFERENCE</span>
                <span>STATUS</span>

              </div>


              {loading ? (

                <LoadingState />

              ) : summary.purchase_orders.length === 0 ? (

                <EmptyState
                  icon="purchase"
                  title="No purchase orders"
                  message="Recent procurement orders will appear here."
                  type="blue"
                />

              ) : (

                summary.purchase_orders.map(
                  (order, index) => (

                    <div
                      className="sc-table-row purchase-table"
                      key={`${order.reference}-${index}`}
                    >

                      <div className="sc-table-primary">

                        <div className="sc-row-icon blue">
                          <Icon
                            name="truck"
                            size={15}
                          />
                        </div>

                        <strong>
                          {order.supplier}
                        </strong>

                      </div>


                      <span className="sc-reference">
                        {order.reference}
                      </span>


                      <span
                        className={`sc-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        <span className="sc-status-dot" />
                        {order.status}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* ==============================================================
              SALES ORDERS
          ============================================================== */}

          <div className="sc-panel transaction-panel">

            <div className="sc-panel-header">

              <div className="sc-panel-title">

                <div className="sc-panel-icon green">
                  <Icon name="sales" size={20} />
                </div>

                <div>
                  <h3>Sales Orders</h3>

                  <p>
                    Recent customer revenue activity
                  </p>
                </div>

              </div>

              <div className="sc-panel-header-label green-text">
                Revenue
              </div>

            </div>


            <div className="sc-table">

              <div className="sc-table-header sales-table">

                <span>CUSTOMER</span>
                <span>REFERENCE</span>
                <span>AMOUNT</span>

              </div>


              {loading ? (

                <LoadingState />

              ) : summary.sales_orders.length === 0 ? (

                <EmptyState
                  icon="sales"
                  title="No sales orders"
                  message="Recent customer sales will appear here."
                  type="green"
                />

              ) : (

                summary.sales_orders.map(
                  (order, index) => (

                    <div
                      className="sc-table-row sales-table"
                      key={`${order.reference}-${index}`}
                    >

                      <div className="sc-table-primary">

                        <div className="sc-row-icon green">
                          <Icon
                            name="users"
                            size={15}
                          />
                        </div>

                        <strong>
                          {order.customer}
                        </strong>

                      </div>


                      <span className="sc-reference">
                        {order.reference}
                      </span>


                      <strong className="sc-revenue">
                        {formatCurrency(order.amount)}
                      </strong>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================================
          DASHBOARD FOOTER
      ================================================================== */}

      <div className="sc-dashboard-footer">

        <div>
          <span className="sc-footer-dot" />
          SmartChain Nexus Intelligence
        </div>

        <span>
          Live operational data
        </span>

      </div>


      {/* ==================================================================
          STYLES
      ================================================================== */}

      <style>{`

        /* ================================================================
           GLOBAL DASHBOARD
        ================================================================ */

        .sc-dashboard {
          width: 100%;
          min-height: 100vh;
          padding: 42px 45px 70px;
          box-sizing: border-box;
          color: #0f172a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* ================================================================
           HEADER
        ================================================================ */

        .sc-dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 42px;
        }

        .sc-header-content {
          min-width: 0;
        }

        .sc-live-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #10b981;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.6px;
          margin-bottom: 10px;
        }

        .sc-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,.10);
        }

        .sc-header-content h1 {
          margin: 0;
          font-size: 38px;
          line-height: 1.1;
          font-weight: 850;
          letter-spacing: -1.2px;
          color: #071b3a;
        }

        .sc-header-content p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
        }

        .sc-intelligence-card {
          width: 170px;
          min-width: 170px;
          min-height: 110px;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(15,23,42,.06);
        }

        .sc-intelligence-icon {
          color: #111827;
          margin-bottom: 8px;
        }

        .sc-intelligence-card strong {
          color: #0f172a;
          font-size: 14px;
        }

        .sc-intelligence-card span {
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          margin-top: 3px;
        }


        /* ================================================================
           SECTION
        ================================================================ */

        .sc-section {
          width: 100%;
        }

        .analytics-section,
        .lower-section,
        .transactions-section {
          margin-top: 44px;
        }

        .sc-section-heading {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .sc-section-heading > span {
          color: #64748b;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 1.5px;
        }

        .sc-section-heading.left {
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .sc-section-heading.left > div:first-child {
          display: flex;
          flex-direction: column;
        }

        .sc-section-heading.left > div:first-child > span {
          color: #64748b;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 1.5px;
        }

        .sc-section-heading.left p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 500;
        }

        .sc-section-heading-icon {
          width: 39px;
          height: 39px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-section-heading-icon.warning {
          color: #f59e0b;
          background: #fff7e6;
        }

        .sc-section-heading-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }


        /* ================================================================
           KPI CARDS
        ================================================================ */

        .sc-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .sc-kpi-card {
          position: relative;
          min-height: 160px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          padding: 27px 24px;
          box-sizing: border-box;
          box-shadow: 0 12px 30px rgba(15,23,42,.055);
          overflow: hidden;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .sc-kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 38px rgba(15,23,42,.09);
        }

        .sc-kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .sc-kpi-title {
          color: #475569;
          font-size: 14px;
          font-weight: 600;
        }

        .sc-kpi-value {
          display: block;
          margin-top: 8px;
          font-size: 32px;
          line-height: 1;
          font-weight: 850;
          color: #0f172a;
        }

        .sc-kpi-trend {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
          color: #10b981;
          font-size: 12px;
          font-weight: 700;
        }

        .sc-kpi-icon {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-kpi-icon.blue {
          color: #2563eb;
          background: #2563eb;
        }

        .sc-kpi-icon.green {
          color: #ffffff;
          background: #10b981;
        }

        .sc-kpi-icon.orange {
          color: #111827;
          background: #f59e0b;
        }

        .sc-kpi-icon.purple {
          color: #ffffff;
          background: #8b5cf6;
        }

        .sc-kpi-icon.blue svg,
        .sc-kpi-icon.green svg,
        .sc-kpi-icon.orange svg,
        .sc-kpi-icon.purple svg {
          color: #ffffff;
        }


        /* ================================================================
           CHARTS
        ================================================================ */

        .sc-chart-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(340px, 1fr);
          gap: 24px;
        }

        .sc-chart-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          padding: 25px;
          box-sizing: border-box;
          box-shadow: 0 12px 30px rgba(15,23,42,.05);
        }

        .sc-chart-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .sc-card-kicker {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.3px;
        }

        .sc-chart-header h3 {
          margin: 5px 0 4px;
          color: #0f172a;
          font-size: 18px;
          font-weight: 800;
        }

        .sc-chart-header p {
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .sc-chart-icon {
          width: 41px;
          height: 41px;
          min-width: 41px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-chart-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .sc-chart-icon.orange {
          color: #f59e0b;
          background: #fff7e6;
        }

        .sc-chart-container {
          width: 100%;
          min-height: 285px;
          padding-top: 12px;
        }


        /* ================================================================
           LOWER PANELS
        ================================================================ */

        .sc-lower-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
        }

        .sc-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(15,23,42,.05);
        }

        .sc-panel-header {
          min-height: 82px;
          padding: 18px 21px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #eef2f7;
        }

        .sc-panel-title {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .sc-panel-icon {
          width: 43px;
          height: 43px;
          min-width: 43px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-panel-icon.red {
          color: #ef4444;
          background: #fef2f2;
        }

        .sc-panel-icon.purple {
          color: #8b5cf6;
          background: #f5f3ff;
        }

        .sc-panel-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .sc-panel-icon.green {
          color: #10b981;
          background: #ecfdf5;
        }

        .sc-panel-title h3 {
          margin: 0;
          color: #0f172a;
          font-size: 16px;
          font-weight: 800;
        }

        .sc-panel-title p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.4;
        }

        .sc-count-badge {
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .sc-count-badge.red {
          color: #dc2626;
          background: #fef2f2;
        }

        .sc-ai-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          padding: 6px 9px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .5px;
          white-space: nowrap;
        }

        .sc-panel-header-label {
          color: #2563eb;
          background: #eff6ff;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
        }

        .green-text {
          color: #059669;
          background: #ecfdf5;
        }


        /* ================================================================
           INVENTORY ALERTS
        ================================================================ */

        .sc-alert-list {
          padding: 3px 0;
        }

        .sc-alert-row {
          min-height: 69px;
          padding: 12px 19px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f1f5f9;
          transition: background .15s ease;
        }

        .sc-alert-row:last-child {
          border-bottom: 0;
        }

        .sc-alert-row:hover {
          background: #fafcff;
        }

        .sc-alert-product {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .sc-alert-product-icon {
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 10px;
          color: #ef4444;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-alert-product div:last-child {
          min-width: 0;
        }

        .sc-alert-product strong {
          display: block;
          color: #1e293b;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sc-alert-product span {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 10px;
        }

        .sc-stock-value {
          min-width: 45px;
          text-align: right;
        }

        .sc-stock-value span {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .sc-stock-value strong {
          display: block;
          margin-top: 2px;
          color: #dc2626;
          font-size: 15px;
          font-weight: 850;
        }

        .sc-alert-arrow,
        .sc-insight-status {
          width: 27px;
          height: 27px;
          border-radius: 8px;
          color: #94a3b8;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
        }


        /* ================================================================
           AI INSIGHTS
        ================================================================ */

        .sc-insight-list {
          padding: 3px 0;
        }

        .sc-insight-row {
          min-height: 83px;
          padding: 13px 19px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sc-insight-row:last-child {
          border-bottom: 0;
        }

        .sc-insight-icon {
          width: 37px;
          height: 37px;
          min-width: 37px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-insight-icon.red {
          color: #ef4444;
          background: #fef2f2;
        }

        .sc-insight-icon.green {
          color: #10b981;
          background: #ecfdf5;
        }

        .sc-insight-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .sc-insight-content {
          flex: 1;
          min-width: 0;
        }

        .sc-insight-content strong {
          display: block;
          color: #1e293b;
          font-size: 12px;
          font-weight: 800;
        }

        .sc-insight-content p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 10px;
          line-height: 1.5;
        }


        /* ================================================================
           TRANSACTION TABLES
        ================================================================ */

        .transaction-panel {
          min-width: 0;
        }

        .sc-table {
          width: 100%;
        }

        .sc-table-header,
        .sc-table-row {
          display: grid;
          align-items: center;
        }

        .purchase-table {
          grid-template-columns: minmax(0, 1.35fr) minmax(95px, .8fr) minmax(85px, .7fr);
        }

        .sales-table {
          grid-template-columns: minmax(0, 1.25fr) minmax(95px, .75fr) minmax(90px, .8fr);
        }

        .sc-table-header {
          min-height: 38px;
          padding: 0 20px;
          box-sizing: border-box;
          color: #94a3b8;
          background: #f8fafc;
          border-bottom: 1px solid #eef2f7;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .7px;
        }

        .sc-table-row {
          min-height: 67px;
          padding: 0 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #f1f5f9;
          gap: 10px;
        }

        .sc-table-row:last-child {
          border-bottom: 0;
        }

        .sc-table-row:hover {
          background: #fafcff;
        }

        .sc-table-primary {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sc-table-primary strong {
          min-width: 0;
          color: #1e293b;
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sc-row-icon {
          width: 31px;
          height: 31px;
          min-width: 31px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-row-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .sc-row-icon.green {
          color: #10b981;
          background: #ecfdf5;
        }

        .sc-reference {
          color: #64748b;
          font-size: 10px;
          font-weight: 650;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sc-status {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .sc-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-approved {
          color: #059669;
          background: #ecfdf5;
        }

        .status-pending {
          color: #d97706;
          background: #fffbeb;
        }

        .status-danger {
          color: #dc2626;
          background: #fef2f2;
        }

        .status-neutral {
          color: #64748b;
          background: #f1f5f9;
        }

        .sc-revenue {
          color: #059669;
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
        }


        /* ================================================================
           EMPTY / LOADING
        ================================================================ */

        .sc-empty-state {
          min-height: 145px;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .sc-empty-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .sc-empty-icon.green {
          color: #10b981;
          background: #ecfdf5;
        }

        .sc-empty-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .sc-empty-icon.purple {
          color: #8b5cf6;
          background: #f5f3ff;
        }

        .sc-empty-state strong {
          color: #334155;
          font-size: 12px;
        }

        .sc-empty-state p {
          max-width: 300px;
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.5;
        }

        .sc-loading {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 11px;
        }

        .sc-loading-spinner {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border: 2px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: sc-spin .7s linear infinite;
        }

        @keyframes sc-spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* ================================================================
           FOOTER
        ================================================================ */

        .sc-dashboard-footer {
          margin-top: 38px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #94a3b8;
          font-size: 10px;
        }

        .sc-dashboard-footer > div {
          display: flex;
          align-items: center;
          gap: 7px;
          font-weight: 700;
        }

        .sc-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }


        /* ================================================================
           RESPONSIVE
        ================================================================ */

        @media (max-width: 1100px) {

          .sc-dashboard {
            padding: 32px 25px 60px;
          }

          .sc-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sc-chart-grid {
            grid-template-columns: 1fr;
          }

          .sc-lower-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 700px) {

          .sc-dashboard {
            padding: 25px 16px 50px;
          }

          .sc-dashboard-header {
            flex-direction: column;
          }

          .sc-header-content h1 {
            font-size: 30px;
          }

          .sc-intelligence-card {
            width: 100%;
            min-width: 0;
          }

          .sc-kpi-grid {
            grid-template-columns: 1fr;
          }

          .sc-chart-card {
            padding: 18px;
          }

          .sc-panel-header {
            align-items: flex-start;
          }

          .sc-table-header,
          .sc-table-row {
            padding-left: 12px;
            padding-right: 12px;
          }

          .purchase-table,
          .sales-table {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(80px, .75fr)
              minmax(75px, .65fr);
          }

          .sc-section-heading.left {
            gap: 15px;
          }

        }

      `}</style>

    </div>
  );
}


/* ==========================================================================
   KPI CARD
   ========================================================================== */

function KpiCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: IconName;
  iconClass: "blue" | "green" | "orange" | "purple";
}) {
  return (
    <div className="sc-kpi-card">

      <div className="sc-kpi-top">

        <div>
          <span className="sc-kpi-title">
            {title}
          </span>

          <strong className="sc-kpi-value">
            {value}
          </strong>

          <div className="sc-kpi-trend">
            <span>▲</span>
            <span>12% this month</span>
          </div>
        </div>


        <div className={`sc-kpi-icon ${iconClass}`}>
          <Icon name={icon} size={26} />
        </div>

      </div>

    </div>
  );
}


/* ==========================================================================
   EMPTY STATE
   ========================================================================== */

function EmptyState({
  icon,
  title,
  message,
  type,
}: {
  icon: IconName;
  title: string;
  message: string;
  type: "green" | "blue" | "purple";
}) {
  return (
    <div className="sc-empty-state">

      <div className={`sc-empty-icon ${type}`}>
        <Icon name={icon} size={18} />
      </div>

      <strong>
        {title}
      </strong>

      <p>
        {message}
      </p>

    </div>
  );
}


/* ==========================================================================
   LOADING STATE
   ========================================================================== */

function LoadingState() {
  return (
    <div className="sc-loading">

      <span className="sc-loading-spinner" />

      Loading dashboard data...

    </div>
  );
}