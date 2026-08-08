import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";

// Executive Intelligence
import ExecutiveDashboard from "../pages/ExecutiveDashboard";
import BusinessKPIs from "../pages/BusinessKPIs";
import FinancialOverview from "../pages/FinancialOverview";
import OperationalPerformance from "../pages/OperationalPerformance";
import RiskMonitoring from "../pages/RiskMonitoring";

// Procurement
import Suppliers from "../pages/Suppliers";
import PurchaseOrders from "../pages/PurchaseOrders";
import SpendAnalytics from "../pages/SpendAnalytics";
import VendorPerformance from "../pages/VendorPerformance";
import LeadTimeAnalysis from "../pages/LeadTimeAnalysis";

// Inventory
import StockMonitoring from "../pages/StockMonitoring";
import InventoryTransactions from "../pages/InventoryTransactions";
import InventoryAdjustments from "../pages/InventoryAdjustments";
import ABCAnalysis from "../pages/ABCAnalysis";
import XYZAnalysis from "../pages/XYZAnalysis";
import EOQ from "../pages/EOQ";
import SafetyStock from "../pages/SafetyStock";
import ReorderPoint from "../pages/ReorderPoint";
import InventoryTurnover from "../pages/InventoryTurnover";
import Inventory from "../pages/Inventory";
import Receiving from "../pages/Receiving";
import Picking from "../pages/Picking";
import Packing from "../pages/Packing";
import Dispatch from "../pages/Dispatch";
import CycleCounts from "../pages/CycleCounts";
import WarehousePerformance from "../pages/WarehousePerformance";

// Logistics
import FleetPerformance from "../pages/FleetPerformance";
import RouteOptimization from "../pages/RouteOptimization";
import DeliveryTracking from "../pages/DeliveryTracking";
import FuelAnalysis from "../pages/FuelAnalysis";
import DistributionAnalytics from "../pages/DistributionAnalytics";

// Sales
import Customers from "../pages/Customers";
import SalesOrders from "../pages/SalesOrders";
import RevenueAnalysis from "../pages/RevenueAnalysis";
import ProfitMargin from "../pages/ProfitMargin";

// Data Science
import DemandForecasting from "../pages/DemandForecasting";
import SalesPrediction from "../pages/SalesPrediction";
import SupplierRiskPrediction from "../pages/SupplierRiskPrediction";
import CustomerSegmentation from "../pages/CustomerSegmentation";
import InventoryOptimization from "../pages/InventoryOptimization";
import AnomalyDetection from "../pages/AnomalyDetection";

// Business Intelligence
import Analytics from "../pages/Analytics";
import PowerBIDashboards from "../pages/PowerBIDashboards";
import ExecutiveReporting from "../pages/ExecutiveReporting";
import OperationalAnalytics from "../pages/OperationalAnalytics";
import InteractiveKPIMonitoring from "../pages/InteractiveKPIMonitoring";

// Artificial Intelligence
import AIInsights from "../pages/AIInsights";
import AISupplyChainAssistant from "../pages/AISupplyChainAssistant";
import PredictiveAnalytics from "../pages/PredictiveAnalytics";
import IntelligentRecommendations from "../pages/IntelligentRecommendations";
import NaturalLanguageQueries from "../pages/NaturalLanguageQueries";

// Lean Six Sigma
import LeanSixSigma from "../pages/LeanSixSigma";
import DMAIC from "../pages/DMAIC";
import SIPOC from "../pages/SIPOC";
import FishboneAnalysis from "../pages/FishboneAnalysis";
import ParetoAnalysis from "../pages/ParetoAnalysis";
import FMEA from "../pages/FMEA";
import ControlCharts from "../pages/ControlCharts";
import RootCauseAnalysis from "../pages/RootCauseAnalysis";

// Settings
import ProfileSettings from "../pages/ProfileSettings";
import CompanySettings from "../pages/CompanySettings";
import UserManagement from "../pages/UserManagement";
import NotificationSettings from "../pages/NotificationSettings";
import AppearanceSettings from "../pages/AppearanceSettings";
import SecuritySettings from "../pages/SecuritySettings";
import BackupRestore from "../pages/BackupRestore";
import Integrations from "../pages/Integrations";
import AuditLogs from "../pages/AuditLogs";
import AboutSmartChainNexus from "../pages/AboutSmartChainNexus";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Executive Intelligence */}
          <Route
            path="/executive-dashboard"
            element={<ExecutiveDashboard />}
          />

          <Route
            path="/business-kpis"
            element={<BusinessKPIs />}
          />

          <Route
            path="/financial-overview"
            element={<FinancialOverview />}
          />

          <Route
            path="/operational-performance"
            element={<OperationalPerformance />}
          />
          <Route
  path="/risk-monitoring"
  element={<RiskMonitoring />}
/>

          {/* Procurement */}
          <Route
            path="/suppliers"
            element={<Suppliers />}
          />

          <Route
            path="/purchase-orders"
            element={<PurchaseOrders />}
          />
          <Route
  path="/spend-analytics"
  element={<SpendAnalytics />}
/>
<Route
  path="/vendor-performance"
  element={<VendorPerformance />}
/>
<Route
  path="/lead-time-analysis"
  element={<LeadTimeAnalysis />}
/>

          {/* Inventory */}
          <Route
  path="/stock-monitoring"
  element={<StockMonitoring />}
/>
<Route
  path="/inventory-transactions"
  element={<InventoryTransactions />}
/>
<Route
  path="/inventory-adjustments"
  element={<InventoryAdjustments />}
/>
<Route
  path="/abc-analysis"
  element={<ABCAnalysis />}
/>
<Route
  path="/xyz-analysis"
  element={<XYZAnalysis />}
/>
<Route
  path="/eoq"
  element={<EOQ />}
/>
<Route
  path="/safety-stock"
  element={<SafetyStock />}
/>
<Route
  path="/reorder-point"
  element={<ReorderPoint />}
/>
<Route
  path="/inventory-turnover"
  element={<InventoryTurnover />}
/>
<Route
  path="/receiving"
  element={<Receiving />}
/>
<Route
  path="/picking"
  element={<Picking />}
/>
<Route
  path="/packing"
  element={<Packing />}
/>
<Route
  path="/dispatch"
  element={<Dispatch />}
/>
<Route
  path="/cycle-counts"
  element={<CycleCounts />}
/>
<Route
  path="/warehouse-performance"
  element={<WarehousePerformance />}
/>
{/* Logistics */}

<Route
  path="/fleet-performance"
  element={<FleetPerformance />}
/>
<Route
  path="/route-optimization"
  element={<RouteOptimization />}
/>
<Route
  path="/delivery-tracking"
  element={<DeliveryTracking />}
/>
<Route
  path="/fuel-analysis"
  element={<FuelAnalysis />}
/>
<Route
  path="/distribution-analytics"
  element={<DistributionAnalytics />}
/>

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          {/* Sales */}
          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/sales-orders"
            element={<SalesOrders />}
          />
          <Route
  path="/revenue-analysis"
  element={<RevenueAnalysis />}
/>
<Route
  path="/profit-margin"
  element={<ProfitMargin />}
/>
{/* Data Science */}

<Route
  path="/demand-forecasting"
  element={<DemandForecasting />}
/>
<Route
  path="/sales-prediction"
  element={<SalesPrediction />}
/>
<Route
  path="/supplier-risk-prediction"
  element={<SupplierRiskPrediction />}
/>
<Route
  path="/customer-segmentation"
  element={<CustomerSegmentation />}
/>
<Route
  path="/inventory-optimization"
  element={<InventoryOptimization />}
/>
<Route
  path="/anomaly-detection"
  element={<AnomalyDetection />}
/>

          {/* Business Intelligence */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />
          {/* Business Intelligence */}

<Route
  path="/power-bi-dashboards"
  element={<PowerBIDashboards />}
/>
<Route
  path="/executive-reporting"
  element={<ExecutiveReporting />}
/>
<Route
  path="/operational-analytics"
  element={<OperationalAnalytics />}
/>
<Route
  path="/interactive-kpi-monitoring"
  element={<InteractiveKPIMonitoring />}
/>

          {/* Artificial Intelligence */}
          <Route
            path="/ai-insights"
            element={<AIInsights />}
          />
          {/* Artificial Intelligence */}

<Route
  path="/ai-supply-chain-assistant"
  element={<AISupplyChainAssistant />}
/>
<Route
  path="/predictive-analytics"
  element={<PredictiveAnalytics />}
/>
<Route
  path="/intelligent-recommendations"
  element={<IntelligentRecommendations />}
/>
<Route
  path="/natural-language-queries"
  element={<NaturalLanguageQueries />}
/>

          {/* Lean Six Sigma */}
          <Route
            path="/lean-six-sigma"
            element={<LeanSixSigma />}
          />
          {/* Lean Six Sigma */}

<Route
  path="/dmaic"
  element={<DMAIC />}
/>
<Route
  path="/sipoc"
  element={<SIPOC />}
/>
<Route
  path="/fishbone-analysis"
  element={<FishboneAnalysis />}
/>
<Route
  path="/pareto-analysis"
  element={<ParetoAnalysis />}
/>
<Route
  path="/fmea"
  element={<FMEA />}
/>
<Route
  path="/control-charts"
  element={<ControlCharts />}
/>
<Route
  path="/root-cause-analysis"
  element={<RootCauseAnalysis />}
/>

          {/* Settings */}

<Route
  path="/settings/profile"
  element={<ProfileSettings />}
/>
<Route
  path="/settings/company"
  element={<CompanySettings />}
/>
<Route
  path="/settings/users"
  element={<UserManagement />}
/>
<Route
  path="/settings/notifications"
  element={<NotificationSettings />}
/>
<Route
  path="/settings/appearance"
  element={<AppearanceSettings />}
/>
<Route
  path="/settings/security"
  element={<SecuritySettings />}
/>
<Route
  path="/settings/backup"
  element={<BackupRestore />}
/>
<Route
  path="/settings/integrations"
  element={<Integrations />}
/>
<Route
  path="/settings/audit"
  element={<AuditLogs />}
/>
<Route
  path="/settings/about"
  element={<AboutSmartChainNexus />}
/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}