import { useState, useEffect } from "react";
import {
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Plus,
  FileText,
  TrendingUp,
  Package,
  Calendar,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { subscribeToAIAnalysisResults } from "../../lib/database";

export function EmailList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newResultsCount, setNewResultsCount] = useState(0);

  // Fetch AI analysis results from Supabase and subscribe to real-time updates
  useEffect(() => {
    fetchAiAnalysisResults();
    
    // Subscribe to real-time updates
    const subscription = subscribeToAIAnalysisResults((payload: any) => {
      console.log('✨ Real-time AI Analysis update:', payload);
      
      if (payload.eventType === 'INSERT') {
        setAiAnalysisResults(prev => [payload.new, ...prev]);
        setNewResultsCount(prev => prev + 1);
        
        // Show notification
        if (Notification.permission === 'granted') {
          new Notification('New AI Analysis Result', {
            body: `Risk Level: ${payload.new.risk_level} - ${payload.new.issue_type || 'No risk detected'}`,
            icon: '/favicon.ico'
          });
        }
      } else if (payload.eventType === 'UPDATE') {
        setAiAnalysisResults(prev => prev.map(item => 
          item.id === payload.new.id ? payload.new : item
        ));
      } else if (payload.eventType === 'DELETE') {
        setAiAnalysisResults(prev => prev.filter(item => item.id !== payload.old.id));
      }
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAiAnalysisResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ai_analysis_results")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAiAnalysisResults(data || []);
      setNewResultsCount(0);
    } catch (error) {
      console.error("Error fetching AI analysis results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter analysis results
  const filteredResults = aiAnalysisResults.filter((result) => {
    const matchesSearch =
      result.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.item_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "high" && result.risk_level === "High") ||
      (statusFilter === "medium" && result.risk_level === "Medium") ||
      (statusFilter === "low" && result.risk_level === "Low");

    return matchesSearch && matchesStatus;
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: AlertCircle,
        };
      case "medium":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: TrendingUp,
        };
      case "low":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: CheckCircle2,
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          icon: Mail,
        };
    }
  };

  const highRiskCount = aiAnalysisResults.filter(
    (r) => r.risk_level === "High"
  ).length;
  const mediumRiskCount = aiAnalysisResults.filter(
    (r) => r.risk_level === "Medium"
  ).length;
  const lowRiskCount = aiAnalysisResults.filter(
    (r) => r.risk_level === "Low"
  ).length;

  return (
    <div className="space-y-6">
      {/* AI Integration Notice */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/10 border border-primary/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              🤖 AI Email Processing System
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              This interface is ready for integration with your Two-Prompt AI
              Architecture:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>
                <span className="font-semibold text-indigo-400">
                  Prompt 1 (Extraction):
                </span>{" "}
                Extracts order details, delivery dates, prices, and supplier
                information
              </li>
              <li>
                <span className="font-semibold text-purple-400">
                  Prompt 2 (Risk Analysis):
                </span>{" "}
                Identifies delays, price changes, quality issues, and financial
                risks
              </li>
              <li>
                <span className="font-semibold text-green-400">
                  Auto-Integration:
                </span>{" "}
                Extracted data automatically populates orders and risk analysis
                tables
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              💡 The AI agent integration is being handled by another team
              member and will seamlessly connect to this UI.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Email Tracking</h2>
            <p className="text-gray-400 mt-1">
              Monitor supplier communications and AI extraction status
            </p>
          </div>
          {newResultsCount > 0 && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg border border-purple-500/30 animate-pulse">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold">
                {newResultsCount} new {newResultsCount === 1 ? 'result' : 'results'}
              </span>
            </div>
          )}
        </div>
        <button
          className="flex items-center space-x-2 bg-gradient-to-r gradient-button-bg text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 opacity-50 cursor-not-allowed"
          disabled
          title="Will be enabled when AI agent is integrated"
        >
          <Plus className="w-5 h-5" />
          <span>Connect Email</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-elevated border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Risk</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                {highRiskCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">
                {mediumRiskCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Risk</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {lowRiskCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
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
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by risk level"
          className="px-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
      </div>

      {/* AI Analysis Results List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Loading AI Analysis Results...
          </h3>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No results found"
              : "No AI analysis results yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "AI analysis results will appear here once processed"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => {
            const riskInfo = getRiskColor(result.risk_level);
            const RiskIcon = riskInfo.icon;

            return (
              <div
                key={result.id}
                className={`bg-elevated rounded-lg p-6 border-l-4 ${riskInfo.border} hover:shadow-lg transition-all duration-200`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 ${riskInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <RiskIcon className={`w-6 h-6 ${riskInfo.color}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${riskInfo.bg} ${riskInfo.color} border ${riskInfo.border}`}
                        >
                          {result.risk_level} Risk
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {result.issue_type}
                        </span>
                        {result.confidence && (
                          <span className="text-xs text-gray-400">
                            Confidence: {(result.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">
                        Order: {result.order_id}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Item</p>
                      <p className="text-sm text-white font-medium">
                        {result.item_name}
                      </p>
                      {result.quantity && (
                        <p className="text-xs text-gray-400">
                          Qty: {result.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  {result.delay_days && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400">Delivery Impact</p>
                        <p className="text-sm text-white font-medium">
                          {result.delay_days} days delay
                        </p>
                        {result.old_delivery_date &&
                          result.new_delivery_date && (
                            <p className="text-xs text-gray-400">
                              {new Date(
                                result.old_delivery_date
                              ).toLocaleDateString()}{" "}
                              →{" "}
                              {new Date(
                                result.new_delivery_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                      </div>
                    </div>
                  )}

                  {result.price_change && (
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400">Price Change</p>
                        <p className="text-sm text-white font-medium">
                          ${result.price_change}
                        </p>
                      </div>
                    </div>
                  )}

                  {result.tracking_number && (
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400">Tracking</p>
                        <p className="text-sm text-white font-medium">
                          {result.tracking_number}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reason */}
                {result.reason && (
                  <div className="bg-darker rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-400 mb-1 font-semibold">
                      Reason:
                    </p>
                    <p className="text-sm text-gray-300">{result.reason}</p>
                  </div>
                )}

                {/* Recommendation */}
                {result.recommendation && (
                  <div
                    className={`${riskInfo.bg} border ${riskInfo.border} rounded-lg p-4 mb-4`}
                  >
                    <p
                      className={`text-xs ${riskInfo.color} mb-1 font-semibold`}
                    >
                      🤖 AI Recommendation:
                    </p>
                    <p className="text-sm text-gray-300">
                      {result.recommendation}
                    </p>
                  </div>
                )}

                {/* Additional Notes */}
                {result.additional_notes && (
                  <div className="bg-darker rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">
                      Additional Notes:
                    </p>
                    <p className="text-xs text-gray-400">
                      {result.additional_notes}
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Analyzed on {new Date(result.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Integration Instructions */}
      <div className="bg-elevated border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          🔌 Integration Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-[#151929] rounded-lg p-4">
            <p className="font-semibold text-indigo-400 mb-2">
              Database Table: emails
            </p>
            <p className="text-gray-400">
              Stores email metadata, subjects, received dates, and processing
              status
            </p>
          </div>
          <div className="bg-[#151929] rounded-lg p-4">
            <p className="font-semibold text-purple-400 mb-2">
              Database Table: extracted_data
            </p>
            <p className="text-gray-400">
              Stores AI-extracted order details, prices, dates from Prompt 1
            </p>
          </div>
          <div className="bg-[#151929] rounded-lg p-4">
            <p className="font-semibold text-green-400 mb-2">
              Auto-Creation: orders
            </p>
            <p className="text-gray-400">
              Orders automatically created from extracted data
            </p>
          </div>
          <div className="bg-[#151929] rounded-lg p-4">
            <p className="font-semibold text-orange-400 mb-2">
              Auto-Creation: risk_analysis
            </p>
            <p className="text-gray-400">
              Risk assessments from Prompt 2 with confidence scores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
