import {
  Shield,
  LayoutDashboard,
  Users,
  Mail,
  Settings,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
  LogOut,
  Home,
  Box,
  ShoppingCart,
  User,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { SupplierList } from "./Suppliers/SupplierList";
import { InventoryList } from "./Inventory/InventoryList";
import { OrderList } from "./Orders/OrderList";
import { RiskDashboard } from "./Risk/RiskDashboard";
import { EmailList } from "./Risk/EmailList";
import {
  getDashboardStats,
  getRiskAnalysis,
  getPendingOrders,
  subscribeToOrders,
  subscribeToRiskAnalysis,
} from "../lib/database";
import type {
  DashboardStats,
  RiskAnalysisWithDetails,
  OrderWithSupplier,
} from "../types/database";

type Page =
  | "dashboard"
  | "suppliers"
  | "inventory"
  | "orders"
  | "risks"
  | "emails"
  | "settings";

interface DashboardProps {
  onNavigateToLanding: () => void;
}

export function Dashboard({ onNavigateToLanding }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { user, signOut } = useAuth();

  // Function to navigate to different pages
  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigateToLanding();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    const names = user.user_metadata.full_name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-card flex">
      <aside className="w-64 bg-darker border-r border-gray-800/50 fixed h-full flex flex-col">
        <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold text-white">
              AI Supply Guardian
            </span>
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-gray-800/50">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "dashboard"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentPage("suppliers")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "suppliers"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Suppliers</span>
          </button>

          <button
            onClick={() => setCurrentPage("inventory")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "inventory"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <Box className="w-5 h-5" />
            <span className="font-medium">Inventory</span>
          </button>

          <button
            onClick={() => setCurrentPage("orders")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "orders"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </button>

          <button
            onClick={() => setCurrentPage("risks")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "risks"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">Risk Analysis</span>
          </button>

          <button
            onClick={() => setCurrentPage("emails")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "emails"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email Tracking</span>
          </button>

          <button
            onClick={() => setCurrentPage("settings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "settings"
                ? "gradient-button text-white shadow-lg shadow-primary/30"
                : "text-gray-400 hover:bg-card hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800/50 flex-shrink-0 space-y-2">
          <button
            onClick={onNavigateToLanding}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-card hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 min-h-screen">
        <header className="bg-darker border-b border-gray-800/50 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40 backdrop-blur-lg bg-darker/95">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentPage === "dashboard" && "Dashboard"}
                {currentPage === "suppliers" && "Supplier Management"}
                {currentPage === "inventory" && "Inventory Management"}
                {currentPage === "orders" && "Order Management"}
                {currentPage === "risks" && "Risk Analysis"}
                {currentPage === "emails" && "Email Tracking"}
                {currentPage === "settings" && "Settings"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {currentPage === "dashboard" &&
                  "Monitor your supply chain at a glance"}
                {currentPage === "suppliers" &&
                  "View and manage all your suppliers"}
                {currentPage === "inventory" &&
                  "Track stock levels and usage rates"}
                {currentPage === "orders" &&
                  "Track and manage all your supply orders"}
                {currentPage === "risks" &&
                  "AI-powered supply chain risk monitoring"}
                {currentPage === "emails" &&
                  "Monitor supplier communications and AI extraction"}
                {currentPage === "settings" && "Configure your preferences"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">
                  {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition">
                <span className="text-primary font-semibold">
                  {getUserInitials()}
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {currentPage === "dashboard" && (
            <DashboardHome onNavigate={navigateToPage} />
          )}
          {currentPage === "suppliers" && <SupplierList />}
          {currentPage === "inventory" && <InventoryList />}
          {currentPage === "orders" && <OrderList />}
          {currentPage === "risks" && <RiskDashboard />}
          {currentPage === "emails" && <EmailList />}
          {currentPage === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

function DashboardHome({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [riskAnalyses, setRiskAnalyses] = useState<RiskAnalysisWithDetails[]>(
    []
  );
  const [pendingOrders, setPendingOrders] = useState<OrderWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, riskData, ordersData] = await Promise.all([
          getDashboardStats(),
          getRiskAnalysis(),
          getPendingOrders(),
        ]);
        setStats(statsData);
        setRiskAnalyses(riskData.slice(0, 4)); // Get top 4 recent risk analyses
        setPendingOrders(ordersData.slice(0, 12)); // Get top 12 pending orders
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const ordersChannel = subscribeToOrders(() => {
      fetchData(); // Refetch when data changes
    });

    const riskChannel = subscribeToRiskAnalysis(() => {
      fetchData(); // Refetch when data changes
    });

    return () => {
      ordersChannel.unsubscribe();
      riskChannel.unsubscribe();
    };
  }, []);

  // Calculate delivery performance from pending orders
  const calculateDeliveryRate = () => {
    if (!pendingOrders || pendingOrders.length === 0) return 0;
    const today = new Date();
    const onTimeOrders = pendingOrders.filter((order) => {
      const deliveryDate = new Date(order.expected_delivery_date);
      return deliveryDate >= today;
    });
    return Math.round((onTimeOrders.length / pendingOrders.length) * 100);
  };

  // Calculate price spike alerts from risk analyses
  const priceSpikes = riskAnalyses.filter((risk) =>
    risk.reason?.toLowerCase().includes("price")
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-primary/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Supply Chain Status
              </h3>
              <p className="text-xs text-gray-400">
                {stats?.total_suppliers || 0} Suppliers •{" "}
                {stats?.total_orders || 0} Orders •{" "}
                {stats?.high_risk_alerts || 0} Alerts
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate("orders")}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition text-sm font-medium border border-primary/20 hover:border-primary/40"
            >
              + Add Order
            </button>
            <button
              onClick={() => onNavigate("suppliers")}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition text-sm font-medium border border-primary/20 hover:border-primary/40"
            >
              + Add Supplier
            </button>
            <button
              onClick={() =>
                alert(
                  "Report generation coming soon! This will export your supply chain data to PDF/Excel."
                )
              }
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition text-sm font-medium border border-primary/20 hover:border-primary/40"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* High Risk Suppliers - Red Gradient */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <AlertTriangle className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-red-400 group-hover:text-red-300 transition-colors duration-300">
                {stats?.high_risk_alerts || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-red-300 transition-colors duration-300">
              High Risk Suppliers
            </h3>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Immediate attention needed
            </p>
          </div>
        </div>

        {/* Pending Deliveries - Blue Gradient */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Package className="w-6 h-6 text-primary group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-primary group-hover:text-primary transition-colors duration-300">
                {stats?.pending_orders || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors duration-300">
              Pending Deliveries
            </h3>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Expected this week
            </p>
          </div>
        </div>

        {/* Price Spike Alerts - Yellow Gradient */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <TrendingUp className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                {priceSpikes}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-yellow-300 transition-colors duration-300">
              Price Spike Alerts
            </h3>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Significant increases detected
            </p>
          </div>
        </div>

        {/* On-Time Delivery - Green Gradient */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Clock className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">
                {calculateDeliveryRate()}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-green-300 transition-colors duration-300">
              On-Time Delivery Rate
            </h3>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Last 30 days
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Risk Level Distribution */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary to-primary rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-gray-800/50 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">
              Risk Level Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    High Risk
                  </span>
                  <span className="text-sm font-bold text-red-400">
                    {stats?.high_risk_alerts || 0} suppliers
                  </span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((stats?.high_risk_alerts || 0) /
                          (stats?.total_suppliers || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    Medium Risk
                  </span>
                  <span className="text-sm font-bold text-yellow-400">
                    {stats?.medium_risk_alerts || 0} suppliers
                  </span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((stats?.medium_risk_alerts || 0) /
                          (stats?.total_suppliers || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    Low Risk
                  </span>
                  <span className="text-sm font-bold text-green-400">
                    {(stats?.total_suppliers || 0) -
                      (stats?.high_risk_alerts || 0) -
                      (stats?.medium_risk_alerts || 0)}{" "}
                    suppliers
                  </span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (((stats?.total_suppliers || 0) -
                          (stats?.high_risk_alerts || 0) -
                          (stats?.medium_risk_alerts || 0)) /
                          (stats?.total_suppliers || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary to-primary rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-gray-800/50 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {riskAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    No alerts yet. Your supply chain is looking good!
                  </p>
                </div>
              ) : (
                riskAnalyses.map((risk) => (
                  <div
                    key={risk.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${
                      risk.risk_level === "High"
                        ? "bg-red-500/10 border-red-500/20"
                        : risk.risk_level === "Medium"
                        ? "bg-yellow-500/10 border-yellow-500/20"
                        : "bg-green-500/10 border-green-500/20"
                    }`}
                  >
                    {risk.risk_level === "High" ? (
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : risk.risk_level === "Medium" ? (
                      <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {risk.risk_level} Risk:{" "}
                        {risk.order?.supplier?.name || "Unknown Supplier"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {risk.reason || "Risk detected in supply chain"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(risk.created_at).toLocaleDateString()} •{" "}
                        {risk.confidence_score
                          ? `${Math.round(
                              risk.confidence_score * 100
                            )}% confidence`
                          : "Analyzing..."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Health & Upcoming Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Supply Chain Health Score */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-gray-800/50 hover:border-green-500/30 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">
              Supply Chain Health
            </h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700/30"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 56 * (1 - calculateDeliveryRate() / 100)
                    }`}
                    className="text-green-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {calculateDeliveryRate()}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Healthy</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">On-Time Delivery</span>
                <span className="text-green-400 font-semibold">
                  {calculateDeliveryRate()}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Active Suppliers</span>
                <span className="text-primary font-semibold">
                  {stats?.total_suppliers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Risk Level</span>
                <span
                  className={`font-semibold ${
                    (stats?.high_risk_alerts || 0) > 0
                      ? "text-red-400"
                      : (stats?.medium_risk_alerts || 0) > 0
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {(stats?.high_risk_alerts || 0) > 0
                    ? "High"
                    : (stats?.medium_risk_alerts || 0) > 0
                    ? "Medium"
                    : "Low"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deliveries Timeline */}
        <div className="lg:col-span-2 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                Upcoming Deliveries
              </h3>
              <span className="text-xs text-gray-400">Next 7 days</span>
            </div>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No pending deliveries</p>
                <p className="text-gray-500 text-xs mt-1">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-gray-800/50">
                {pendingOrders.slice(0, 5).map((order) => {
                  const daysUntil = Math.ceil(
                    (new Date(order.expected_delivery_date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysUntil < 0;
                  const isUrgent = daysUntil >= 0 && daysUntil <= 2;

                  return (
                    <div
                      key={order.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                        isOverdue
                          ? "bg-red-500/10 border-red-500/20 hover:border-red-500/40"
                          : isUrgent
                          ? "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40"
                          : "bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isOverdue
                            ? "bg-red-500/20"
                            : isUrgent
                            ? "bg-yellow-500/20"
                            : "bg-primary/20"
                        }`}
                      >
                        <Package
                          className={`w-5 h-5 ${
                            isOverdue
                              ? "text-red-400"
                              : isUrgent
                              ? "text-yellow-400"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white truncate">
                            {order.item_name}
                          </p>
                          <span
                            className={`text-xs font-semibold ${
                              isOverdue
                                ? "text-red-400"
                                : isUrgent
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          >
                            {isOverdue
                              ? `${Math.abs(daysUntil)}d overdue`
                              : `${daysUntil}d left`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-400 truncate">
                            {order.supplier?.name || "Unknown Supplier"}
                          </p>
                          <span className="text-xs text-gray-500">•</span>
                          <p className="text-xs text-gray-500">
                            {order.quantity} {order.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Page Component
function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile & Account Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary to-primary rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl shadow-2xl border border-primary/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              User Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white hover:border-primary/40"
                  defaultValue={user?.user_metadata?.full_name || ""}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white hover:border-primary/40"
                  defaultValue={user?.email || ""}
                  placeholder="your@email.com"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white hover:border-primary/40"
                  defaultValue={user?.user_metadata?.company || ""}
                  placeholder="Your Company Inc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl shadow-2xl border border-blue-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-400" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded bg-darker border-blue-500/30 mt-0.5"
                  defaultChecked
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-blue-300 transition">
                    High-Risk Supplier Alerts
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get notified immediately when a supplier is flagged as high
                    risk
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-cyan-600 rounded bg-darker border-cyan-500/30 mt-0.5"
                  defaultChecked
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-cyan-300 transition">
                    Low Stock Warnings
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Alert when inventory drops below minimum levels
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-teal-600 rounded bg-darker border-teal-500/30 mt-0.5"
                  defaultChecked
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-teal-300 transition">
                    Order Delivery Updates
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Receive updates about pending and delayed deliveries
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded bg-darker border-primary/30 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-primary transition">
                    Daily Summary Report
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Daily digest of supply chain status and metrics
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded bg-darker border-primary/30 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-primary transition">
                    Weekly Performance Digest
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Weekly summary of supplier performance and trends
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* AI & Risk Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Configuration */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl shadow-2xl border border-green-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              AI Risk Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Risk Threshold Sensitivity
                </label>
                <select className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-green-500/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-white hover:border-green-500/40">
                  <option value="low">Low - Fewer alerts</option>
                  <option value="medium" selected>
                    Medium - Balanced
                  </option>
                  <option value="high">High - More sensitive</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Controls how aggressively AI flags potential risks
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Auto-Review Confidence Threshold
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    defaultValue="80"
                    className="flex-1"
                  />
                  <span className="text-white font-semibold w-12 text-center">
                    80%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum AI confidence for auto-approval
                </p>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600 rounded bg-darker border-green-500/30 mt-0.5"
                  defaultChecked
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-green-300 transition">
                    Enable Predictive Analysis
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Use ML models to predict future supply chain issues
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-elevated rounded-xl shadow-2xl border border-yellow-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
              Dashboard Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Default Dashboard View
                </label>
                <select className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-yellow-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white hover:border-yellow-500/40">
                  <option value="overview" selected>
                    Overview Dashboard
                  </option>
                  <option value="suppliers">Suppliers List</option>
                  <option value="orders">Orders Management</option>
                  <option value="risks">Risk Analysis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Date Format
                </label>
                <select className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-orange-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-white hover:border-orange-500/40">
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy" selected>
                    DD/MM/YYYY
                  </option>
                  <option value="ymd">YYYY-MM-DD</option>
                </select>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group/item">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-red-600 rounded bg-darker border-red-500/30 mt-0.5"
                  defaultChecked
                />
                <div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-red-300 transition">
                    Show Animations
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Enable gradient effects and smooth transitions
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <button className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition font-medium hover:border-gray-500">
          Reset to Defaults
        </button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-500/10 transition font-medium hover:border-red-500">
            Sign Out
          </button>
          <button className="gradient-button w-full sm:w-auto">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

