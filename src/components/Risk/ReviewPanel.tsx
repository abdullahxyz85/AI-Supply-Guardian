import { useState } from "react";
import {
  X,
  AlertTriangle,
  TrendingUp,
  Shield,
  Save,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { updateRiskAnalysis, createAuditLog } from "../../lib/database";
import type { RiskAnalysis } from "../../types/database";

interface ReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  riskAnalysis: RiskAnalysis | null;
}

export function ReviewPanel({
  isOpen,
  onClose,
  onSuccess,
  riskAnalysis,
}: ReviewPanelProps) {
  const [newRiskLevel, setNewRiskLevel] = useState<"Low" | "Medium" | "High">(
    riskAnalysis?.risk_level || "Medium"
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !riskAnalysis) return null;

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case "High":
        return {
          icon: AlertTriangle,
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
        };
      case "Medium":
        return {
          icon: TrendingUp,
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
        };
      case "Low":
        return {
          icon: Shield,
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
        };
      default:
        return {
          icon: Shield,
          color: "text-gray-400",
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewNotes.trim()) {
      setError("Please provide a reason for the review");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const riskChanged = newRiskLevel !== riskAnalysis.risk_level;

      // Update risk analysis
      await updateRiskAnalysis(riskAnalysis.id, {
        risk_level: newRiskLevel,
        human_reviewed: true,
        human_modified: riskChanged,
        original_risk_level: riskChanged
          ? riskAnalysis.risk_level
          : riskAnalysis.original_risk_level,
        reviewed_at: new Date().toISOString(),
      });

      // Create audit log entry
      await createAuditLog({
        risk_analysis_id: riskAnalysis.id,
        action: riskChanged ? "modified_risk_level" : "reviewed",
        field_changed: riskChanged ? "risk_level" : undefined,
        old_value: riskChanged ? riskAnalysis.risk_level : undefined,
        new_value: riskChanged ? newRiskLevel : undefined,
        reason: reviewNotes,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const originalInfo = getRiskLevelIcon(riskAnalysis.risk_level);
  const OriginalIcon = originalInfo.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-[#1e2337] rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r gradient-button-bg rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Review Risk Analysis
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Original AI Assessment */}
            <div className="bg-[#151929] rounded-lg p-4 border border-gray-700">
              <p className="text-sm font-medium text-gray-300 mb-3">
                🤖 Original AI Assessment
              </p>

              <div className="flex items-start space-x-3 mb-3">
                <div
                  className={`w-10 h-10 ${originalInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <OriginalIcon className={`w-5 h-5 ${originalInfo.color}`} />
                </div>
                <div className="flex-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${originalInfo.bg} ${originalInfo.color} border ${originalInfo.border} mb-2`}
                  >
                    {riskAnalysis.risk_level} Risk
                  </span>
                  <p className="text-white font-medium mb-2">
                    {riskAnalysis.reason}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {riskAnalysis.recommendation}
                  </p>
                </div>
              </div>

              {riskAnalysis.confidence_score && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    AI Confidence:{" "}
                    <span className="text-indigo-400 font-semibold">
                      {riskAnalysis.confidence_score}%
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Risk Level Adjustment */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Adjust Risk Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["Low", "Medium", "High"] as const).map((level) => {
                  const info = getRiskLevelIcon(level);
                  const Icon = info.icon;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewRiskLevel(level)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        newRiskLevel === level
                          ? `${info.border} ${info.bg}`
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className={`w-12 h-12 ${info.bg} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 ${info.color}`} />
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            newRiskLevel === level
                              ? info.color
                              : "text-gray-400"
                          }`}
                        >
                          {level} Risk
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Change Indicator */}
            {newRiskLevel !== riskAnalysis.risk_level && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  ⚠️ You are changing the risk level from{" "}
                  <span className="font-semibold">
                    {riskAnalysis.risk_level}
                  </span>{" "}
                  to <span className="font-semibold">{newRiskLevel}</span>
                </p>
              </div>
            )}

            {/* Review Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Review Notes <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => {
                  setReviewNotes(e.target.value);
                  if (error) setError("");
                }}
                rows={4}
                className={`w-full px-4 py-2 bg-[#151929] border ${
                  error ? "border-red-500" : "border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500`}
                placeholder="Explain your reasoning for this review or risk level change..."
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
              <p className="text-gray-500 text-xs mt-1">
                This will be logged in the audit trail for compliance
              </p>
            </div>

            {/* Additional Metrics Display */}
            {(riskAnalysis.stock_coverage_days !== null ||
              riskAnalysis.financial_impact !== null) && (
              <div className="bg-[#151929] rounded-lg p-4 border border-gray-700">
                <p className="text-sm font-medium text-gray-300 mb-3">
                  📊 Additional Context
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {riskAnalysis.stock_coverage_days !== null &&
                    riskAnalysis.stock_coverage_days !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Stock Coverage
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            riskAnalysis.stock_coverage_days <= 3
                              ? "text-red-400"
                              : riskAnalysis.stock_coverage_days <= 7
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {riskAnalysis.stock_coverage_days} days
                        </p>
                      </div>
                    )}
                  {riskAnalysis.financial_impact !== null &&
                    riskAnalysis.financial_impact !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Financial Impact
                        </p>
                        <p className="text-lg font-bold text-orange-400">
                          ${riskAnalysis.financial_impact.toLocaleString()}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r gradient-button-bg text-white rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
