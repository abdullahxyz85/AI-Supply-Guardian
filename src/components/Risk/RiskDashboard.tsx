import { useState, useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Shield,
  Eye,
  Clock,
  Loader2,
  Search,
  FileText,
} from "lucide-react";
import { getRiskAnalysis } from "../../lib/database";
import type { RiskAnalysis } from "../../types/database";
import { ReviewPanel } from "./ReviewPanel";
import { AuditLogViewer } from "./AuditLogViewer";

export function RiskDashboard() {
  const [riskAnalyses, setRiskAnalyses] = useState<RiskAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskAnalysis | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    try {
      const data = await getRiskAnalysis();
      setRiskAnalyses(data);
    } catch (error) {
      console.error("Error loading risk analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get risk level styling
  const getRiskLevelInfo = (level: string) => {
    switch (level) {
      case "High":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: AlertTriangle,
          gradient: "from-red-500 to-red-600",
        };
      case "Medium":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: TrendingUp,
          gradient: "from-yellow-500 to-yellow-600",
        };
      case "Low":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: Shield,
          gradient: "from-green-500 to-green-600",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          icon: Shield,
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  // Filter risk analyses
  const filteredRiskAnalyses = riskAnalyses.filter((risk) => {
    const matchesSearch =
      risk.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.recommendation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRiskLevel =
      riskFilter === "all" || risk.risk_level === riskFilter;

    const matchesReview =
      reviewFilter === "all" ||
      (reviewFilter === "reviewed" && risk.human_reviewed) ||
      (reviewFilter === "unreviewed" && !risk.human_reviewed) ||
      (reviewFilter === "modified" && risk.human_modified);

    return matchesSearch && matchesRiskLevel && matchesReview;
  });

  // Calculate stats
  const highRiskCount = riskAnalyses.filter(
    (r) => r.risk_level === "High"
  ).length;
  const mediumRiskCount = riskAnalyses.filter(
    (r) => r.risk_level === "Medium"
  ).length;
  const lowRiskCount = riskAnalyses.filter(
    (r) => r.risk_level === "Low"
  ).length;
  const unreviewedCount = riskAnalyses.filter((r) => !r.human_reviewed).length;
  const avgConfidence =
    riskAnalyses.length > 0
      ? Math.round(
          riskAnalyses.reduce((sum, r) => sum + (r.confidence_score || 0), 0) /
            riskAnalyses.length
        )
      : 0;

  // Handlers
  const handleReview = (risk: RiskAnalysis) => {
    setSelectedRisk(risk);
    setShowReviewPanel(true);
  };

  const handleReviewSuccess = () => {
    loadRiskData();
  };

  // Show audit log view if enabled
  if (showAuditLog) {
    return (
      <div>
        <button
          onClick={() => setShowAuditLog(false)}
          className="mb-6 flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition"
        >
          ← Back to Risk Dashboard
        </button>
        <AuditLogViewer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Risk Analysis Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            AI-powered supply chain risk monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAuditLog(true)}
            className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            <FileText className="w-4 h-4" />
            <span>View Audit Log</span>
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-400">AI Confidence</p>
            <p className="text-2xl font-bold text-indigo-400">
              {avgConfidence}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* High Risk */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <AlertTriangle className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-red-400 group-hover:text-red-300 transition-colors duration-300">
                {highRiskCount}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-red-300 transition-colors duration-300">
              High Risk
            </p>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Immediate action needed
            </p>
          </div>
        </div>

        {/* Medium Risk */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <TrendingUp className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                {mediumRiskCount}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-yellow-300 transition-colors duration-300">
              Medium Risk
            </p>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Monitor closely
            </p>
          </div>
        </div>

        {/* Low Risk */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Shield className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">
                {lowRiskCount}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-green-300 transition-colors duration-300">
              Low Risk
            </p>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Stable suppliers
            </p>
          </div>
        </div>

        {/* Needs Review */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
          <div className="relative bg-elevated rounded-xl p-6 shadow-2xl border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Eye className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
              </div>
              <span className="text-3xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                {unreviewedCount}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-indigo-300 transition-colors duration-300">
              Needs Review
            </p>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">
              Pending human review
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search risk analyses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
          />
        </div>

        {/* Risk Level Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
        >
          <option value="all">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>

        {/* Review Status Filter */}
        <select
          value={reviewFilter}
          onChange={(e) => setReviewFilter(e.target.value)}
          className="px-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
        >
          <option value="all">All Reviews</option>
          <option value="reviewed">Reviewed</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="modified">Modified by Human</option>
        </select>
      </div>

      {/* Risk Analysis Cards */}
      {filteredRiskAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm || riskFilter !== "all" || reviewFilter !== "all"
              ? "No risk analyses found"
              : "No risk analyses yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || riskFilter !== "all" || reviewFilter !== "all"
              ? "Try adjusting your filters"
              : "Risk analyses will appear here once the AI processes email data"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRiskAnalyses.map((risk) => {
            const riskInfo = getRiskLevelInfo(risk.risk_level);
            const RiskIcon = riskInfo.icon;

            return (
              <div
                key={risk.id}
                className={`bg-elevated rounded-xl border-l-4 ${riskInfo.border} p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 ${riskInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <RiskIcon className={`w-6 h-6 ${riskInfo.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${riskInfo.bg} ${riskInfo.color} border ${riskInfo.border}`}
                          >
                            {risk.risk_level} Risk
                          </span>

                          {risk.confidence_score && (
                            <span className="text-sm text-gray-400">
                              AI Confidence:{" "}
                              <span className="text-indigo-400 font-semibold">
                                {risk.confidence_score}%
                              </span>
                            </span>
                          )}

                          {risk.human_reviewed && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-indigo-400 border border-primary/30">
                              <Eye className="w-3 h-3 mr-1" />
                              Reviewed
                            </span>
                          )}

                          {risk.human_modified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30">
                              Modified
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleReview(risk)}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-3">
                        {risk.reason}
                      </h3>

                      <div className="space-y-3">
                        {/* Recommendation */}
                        <div className="bg-[#151929] rounded-lg p-4 border border-gray-700">
                          <p className="text-sm font-medium text-gray-300 mb-2">
                            💡 Recommendation
                          </p>
                          <p className="text-gray-400 text-sm">
                            {risk.recommendation}
                          </p>
                        </div>

                        {/* Additional Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {risk.stock_coverage_days !== null &&
                            risk.stock_coverage_days !== undefined && (
                              <div className="bg-[#151929] rounded-lg p-3 border border-gray-700">
                                <p className="text-xs text-gray-500 mb-1">
                                  Stock Coverage
                                </p>
                                <p
                                  className={`text-lg font-bold ${
                                    risk.stock_coverage_days <= 3
                                      ? "text-red-400"
                                      : risk.stock_coverage_days <= 7
                                      ? "text-yellow-400"
                                      : "text-green-400"
                                  }`}
                                >
                                  {risk.stock_coverage_days} days
                                </p>
                              </div>
                            )}

                          {risk.financial_impact !== null &&
                            risk.financial_impact !== undefined && (
                              <div className="bg-[#151929] rounded-lg p-3 border border-gray-700">
                                <p className="text-xs text-gray-500 mb-1">
                                  Financial Impact
                                </p>
                                <p className="text-lg font-bold text-orange-400">
                                  ${risk.financial_impact.toLocaleString()}
                                </p>
                              </div>
                            )}

                          <div className="bg-[#151929] rounded-lg p-3 border border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">
                              Analyzed
                            </p>
                            <p className="text-sm text-gray-300 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(risk.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Human Review Info */}
                        {risk.human_modified && risk.original_risk_level && (
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                            <p className="text-xs text-purple-300">
                              Risk level changed from{" "}
                              <span className="font-semibold">
                                {risk.original_risk_level}
                              </span>{" "}
                              to{" "}
                              <span className="font-semibold">
                                {risk.risk_level}
                              </span>{" "}
                              by human reviewer
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Panel Modal */}
      <ReviewPanel
        isOpen={showReviewPanel}
        onClose={() => {
          setShowReviewPanel(false);
          setSelectedRisk(null);
        }}
        onSuccess={handleReviewSuccess}
        riskAnalysis={selectedRisk}
      />
    </div>
  );
}
