import {
  Shield,
  Bell,
  Mail,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

export function LandingPage({ onNavigateToDashboard }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated Background with Stars */}
      <div className="fixed inset-0 z-0">
        {/* Nebula/Galaxy Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#1a1f37] to-[#0f1629]"></div>

        {/* Animated Gradient Clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-float-delay-1"></div>
          <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-delay-2"></div>
          <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-float-delay-3"></div>
        </div>

        {/* Stars Layer 1 - Small Stars */}
        <div className="stars-small"></div>

        {/* Stars Layer 2 - Medium Stars */}
        <div className="stars-medium"></div>

        {/* Stars Layer 3 - Large Stars */}
        <div className="stars-large"></div>
      </div>

      {/* Content Wrapper with higher z-index */}
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 bg-[#1a1f37]/80 backdrop-blur-md border-b border-gray-800/50 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-indigo-500" />
                <span className="text-xl font-semibold text-white">
                  AI Supply Guardian
                </span>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-300 hover:text-white transition"
                >
                  How It Works
                </a>
                <a
                  href="#why-choose"
                  className="text-gray-300 hover:text-white transition"
                >
                  Why Choose Us
                </a>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </a>
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={onNavigateToDashboard}
                  className="text-gray-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={onNavigateToDashboard}
                  className="gradient-button text-white px-6 py-2 rounded-lg transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 duration-300"
                >
                  Get Started
                </button>
              </div>

              <button
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800/50 bg-[#1a1f37]">
              <div className="px-4 py-4 space-y-3">
                <a
                  href="#features"
                  className="block text-gray-300 hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block text-gray-300 hover:text-white"
                >
                  How It Works
                </a>
                <a
                  href="#why-choose"
                  className="block text-gray-300 hover:text-white"
                >
                  Why Choose Us
                </a>
                <a
                  href="#contact"
                  className="block text-gray-300 hover:text-white"
                >
                  Contact
                </a>
                <button
                  onClick={onNavigateToDashboard}
                  className="block w-full text-left text-gray-300 hover:text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={onNavigateToDashboard}
                  className="block w-full gradient-button text-white px-6 py-2 rounded-lg transition shadow-lg shadow-indigo-500/30"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-blue-400">AI </span>
                  <span className="text-blue-300">Supply </span>
                  <span className="gradient-text">Guardian</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-6">
                  Smart Supply Chain Assistant
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Get accurate risk alerts, supplier monitoring, and real-time
                  updates in one place. Navigate complex supply chain situations
                  with AI assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onNavigateToDashboard}
                    className="gradient-button text-white px-8 py-4 rounded-lg transition text-lg font-medium flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 duration-300"
                  >
                    <span>Start Your Supply Journey</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#2a2f4a] to-[#232840] rounded-2xl p-6 shadow-2xl border border-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-500">
                  <div className="bg-[#1e2337] rounded-xl shadow-2xl p-6 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-500 group-hover:shadow-indigo-500/20">
                    <div className="flex items-center mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-indigo-500/30 transition-colors duration-300">
                        <Mail className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
                        My supplier mentioned a potential 2-week delay. Is this
                        risky?
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a4d3a] to-[#15402f] rounded-lg p-4 mb-4 border border-green-500/30 shadow-lg hover:shadow-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      <div className="flex items-start space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-5 h-5 text-green-400 hover:text-green-300 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="text-green-300 font-semibold text-sm mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Answer
                          </h4>
                          <p className="text-green-100 text-sm leading-relaxed">
                            NO - This delay is manageable if you have a 3+ week
                            buffer. However, monitor for cascading delays from
                            their suppliers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1e3a52] to-[#193449] rounded-lg p-4 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ArrowRight className="w-5 h-5 text-blue-400 hover:text-blue-300 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="text-blue-300 font-semibold text-sm mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                            Next Steps
                          </h4>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            Contact backup suppliers for quotes within 48 hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="py-20 bg-transparent px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful Features for Supply Chain Management
              </h2>
              <p className="text-xl text-gray-400">
                Everything you need to stay ahead of supply chain disruptions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Real-time Risk Alerts - Red/Orange Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-500/20 hover:border-red-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Bell className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-300 transition-colors duration-300">
                    Real-time Risk Alerts
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Get instant notifications when AI detects potential delays,
                    price spikes, or supplier issues.
                  </p>
                </div>
              </div>

              {/* AI Email Analysis - Purple Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    AI Email Analysis
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Paste supplier emails and let AI extract key information,
                    risks, and delivery updates automatically.
                  </p>
                </div>
              </div>

              {/* Smart Dashboard - Blue/Cyan Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <BarChart3 className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                    Smart Dashboard
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Visualize your entire supply chain at a glance with
                    intuitive charts and risk indicators.
                  </p>
                </div>
              </div>

              {/* Supplier Management - Green/Emerald Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 border border-green-500/20 hover:border-green-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Users className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                    Supplier Management
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Track all your suppliers, orders, and delivery schedules in
                    one centralized platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                See AI Supply Guardian in Action
              </h2>
              <p className="text-xl text-gray-400">
                Explore how our AI simplifies complex supply chain management
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Interactive Demo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#1e2842] to-[#1a2235] rounded-2xl p-6 shadow-2xl border border-indigo-500/20">
                  {/* Browser-like window with macOS style buttons */}
                  <div className="bg-[#1a1f37] rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                    <div className="bg-[#0f1419] px-4 py-3 flex items-center border-b border-gray-800/50">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-sm text-gray-400 font-medium">
                          AI Supply Guardian Assistant
                        </span>
                      </div>
                    </div>

                    {/* Chat Interface - Scrollable */}
                    <div className="p-6 space-y-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-gray-800/50">
                      {/* User Message 1 */}
                      <div className="flex items-start space-x-3 animate-fade-in">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg inline-block max-w-md">
                            <p className="text-sm">
                              My supplier mentioned a 2-week delay for
                              electronic components. Should I be worried?
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response 1 */}
                      <div className="flex items-start space-x-3 animate-fade-in-delay">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="bg-[#1e2337] rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-gray-700/50">
                            <p className="text-gray-300 text-sm mb-2">
                              Based on your supply chain data, I can provide the
                              following analysis:
                            </p>
                          </div>

                          {/* Risk Assessment Card */}
                          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30 shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-green-300 font-semibold text-sm mb-1 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                  Risk Assessment
                                </h4>
                                <p className="text-green-100 text-xs leading-relaxed">
                                  <span className="font-semibold">
                                    LOW RISK
                                  </span>{" "}
                                  - You have a 4-week buffer in your production
                                  schedule. This delay is manageable.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Plan Card */}
                          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ArrowRight className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-blue-300 font-semibold text-sm mb-1 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                                  Recommended Actions
                                </h4>
                                <ul className="text-blue-100 text-xs space-y-1">
                                  <li>
                                    • Contact backup suppliers within 48 hours
                                  </li>
                                  <li>• Monitor for cascading delays</li>
                                  <li>• Set up price spike alerts</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Message 2 */}
                      <div className="flex items-start space-x-3 animate-fade-in pt-4">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg inline-block max-w-md">
                            <p className="text-sm">
                              Can you analyze this email from my supplier? "Due
                              to port congestion, shipment delayed 5 days. New
                              ETA: Dec 15."
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response 2 */}
                      <div className="flex items-start space-x-3 animate-fade-in-delay">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="bg-[#1e2337] rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-gray-700/50">
                            <p className="text-gray-300 text-sm">
                              <span className="font-semibold text-indigo-300">
                                Email Analysis Complete:
                              </span>
                            </p>
                          </div>

                          {/* Extracted Info Card */}
                          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 shadow-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Mail className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <h4 className="text-purple-300 font-semibold text-sm mb-2">
                                  Extracted Information
                                </h4>
                                <div className="text-purple-100 text-xs space-y-1">
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      Delay:
                                    </span>{" "}
                                    5 days
                                  </p>
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      Cause:
                                    </span>{" "}
                                    Port congestion
                                  </p>
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      New ETA:
                                    </span>{" "}
                                    December 15, 2025
                                  </p>
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      Status:
                                    </span>{" "}
                                    Updated automatically ✓
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Impact Assessment Card */}
                          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30 shadow-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bell className="w-4 h-4 text-yellow-400" />
                              </div>
                              <div>
                                <h4 className="text-yellow-300 font-semibold text-sm mb-1">
                                  Impact Assessment
                                </h4>
                                <p className="text-yellow-100 text-xs leading-relaxed">
                                  <span className="font-semibold">
                                    MEDIUM RISK
                                  </span>{" "}
                                  - This affects 2 customer orders. Consider
                                  expedited shipping or notifying customers.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Message 3 */}
                      <div className="flex items-start space-x-3 animate-fade-in pt-4">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg inline-block max-w-md">
                            <p className="text-sm">
                              Show me suppliers with delivery issues this month
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response 3 */}
                      <div className="flex items-start space-x-3 animate-fade-in-delay">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="bg-[#1e2337] rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-gray-700/50">
                            <p className="text-gray-300 text-sm">
                              Found 3 suppliers with delivery issues in November
                              2025:
                            </p>
                          </div>

                          {/* Supplier List Card */}
                          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-4 border border-red-500/30 shadow-lg">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                                <div>
                                  <p className="text-red-200 font-semibold text-xs">
                                    TechComponents Ltd
                                  </p>
                                  <p className="text-red-300/70 text-xs">
                                    2 delays (avg 6 days)
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                                  HIGH
                                </span>
                              </div>
                              <div className="flex items-center justify-between pb-2 border-b border-yellow-500/20">
                                <div>
                                  <p className="text-yellow-200 font-semibold text-xs">
                                    GlobalParts Inc
                                  </p>
                                  <p className="text-yellow-300/70 text-xs">
                                    1 delay (3 days)
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-semibold">
                                  MED
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-orange-200 font-semibold text-xs">
                                    FastShip Logistics
                                  </p>
                                  <p className="text-orange-300/70 text-xs">
                                    1 delay (2 days)
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-semibold">
                                  LOW
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scroll indicator at bottom */}
                      <div className="text-center py-2">
                        <p className="text-gray-500 text-xs italic">
                          Scroll to see more examples ↑↓
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Feature Cards */}
              <div className="space-y-6">
                {/* Real-time Analysis Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
                        <Shield className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                          Real-time Risk Analysis
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          AI analyzes your supply chain in real-time, providing
                          accurate risk assessments specific to your business
                          and current market conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automated Document Processing Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                        <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                          Automated Email Processing
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          Extract critical information from supplier emails
                          automatically. No more manual data entry or missed
                          updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Action Plans Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110">
                        <TrendingUp className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                          Step-by-Step Action Plans
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          Receive clear, actionable guidance with prioritized
                          steps to address your supply chain challenges
                          effectively and efficiently.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Dashboard Insights Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-all duration-300 group-hover:scale-110">
                        <BarChart3 className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                          Smart Dashboard Insights
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          Visualize your entire supply chain at a glance with
                          intuitive charts, risk indicators, and predictive
                          analytics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="why-choose"
          className="py-20 bg-transparent px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose AI Supply Guardian
              </h2>
              <p className="text-xl text-gray-400">
                Built specifically for small and medium enterprises
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/30">
                  <CheckCircle className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  No ERP Needed
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Lightweight solution that works independently without complex
                  integrations.
                </p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/30">
                  <TrendingUp className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  Accurate AI Detection
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Advanced algorithms identify risks with high precision and
                  minimal false positives.
                </p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/30">
                  <Clock className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  Saves Time & Money
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Prevent costly delays and make better purchasing decisions
                  with early warnings.
                </p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/30">
                  <Shield className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  Built for SMEs
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Affordable, easy to use, and designed for businesses without
                  dedicated supply chain teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer
          id="contact"
          className="bg-[#0a0e1a]/80 backdrop-blur-md text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-6 h-6 text-indigo-400" />
                  <span className="text-lg font-semibold text-white">
                    AI Supply Guardian
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Protecting SMEs from supply chain disruptions with intelligent
                  AI monitoring.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#features" className="hover:text-white transition">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Demo
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2025 AI Supply Guardian. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-500 hover:text-white transition"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-white transition"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
