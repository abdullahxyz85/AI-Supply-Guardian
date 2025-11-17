import { useState } from "react";
import {
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Plus,
  FileText,
} from "lucide-react";

export function EmailList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Placeholder data - will be replaced with real data from AI agent
  const placeholderEmails = [
    {
      id: "1",
      subject: "Delivery Update - Steel Sheets Order #12345",
      supplier: "Acme Corp",
      received_date: "2025-11-17T10:30:00Z",
      status: "processed",
      extracted: true,
      risk_detected: true,
    },
    {
      id: "2",
      subject: "Re: Copper Wire Price Update",
      supplier: "Global Materials",
      received_date: "2025-11-16T14:15:00Z",
      status: "processed",
      extracted: true,
      risk_detected: false,
    },
    {
      id: "3",
      subject: "Order Confirmation PO-2025-089",
      supplier: "TechParts Ltd",
      received_date: "2025-11-15T09:45:00Z",
      status: "pending",
      extracted: false,
      risk_detected: false,
    },
  ];

  // Filter emails
  const filteredEmails = placeholderEmails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "processed" && email.status === "processed") ||
      (statusFilter === "pending" && email.status === "pending") ||
      (statusFilter === "risk" && email.risk_detected);

    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (
    status: string,
    extracted: boolean,
    riskDetected: boolean
  ) => {
    if (riskDetected) {
      return {
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        icon: AlertCircle,
        label: "Risk Detected",
      };
    }
    if (status === "processed" && extracted) {
      return {
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        icon: CheckCircle2,
        label: "Processed",
      };
    }
    if (status === "pending") {
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        icon: Loader2,
        label: "Pending",
      };
    }
    return {
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      icon: Mail,
      label: "Unknown",
    };
  };

  const processedCount = placeholderEmails.filter(
    (e) => e.status === "processed"
  ).length;
  const pendingCount = placeholderEmails.filter(
    (e) => e.status === "pending"
  ).length;
  const riskCount = placeholderEmails.filter((e) => e.risk_detected).length;

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
        <div>
          <h2 className="text-3xl font-bold text-white">Email Tracking</h2>
          <p className="text-gray-400 mt-1">
            Monitor supplier communications and AI extraction status
          </p>
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
        <div className="bg-elevated border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Processed</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {processedCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Processing</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Risks Detected</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                {riskCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
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
          className="px-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white"
        >
          <option value="all">All Emails</option>
          <option value="processed">Processed</option>
          <option value="pending">Pending</option>
          <option value="risk">Risk Detected</option>
        </select>
      </div>

      {/* Email List */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No emails found"
              : "No emails yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Emails will appear here once the AI agent is integrated"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email) => {
            const statusInfo = getStatusInfo(
              email.status,
              email.extracted,
              email.risk_detected
            );
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={email.id}
                className={`bg-elevated rounded-lg p-6 border-l-4 ${statusInfo.border} hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 ${statusInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <StatusIcon
                        className={`w-6 h-6 ${statusInfo.color} ${
                          email.status === "pending" ? "animate-spin" : ""
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}
                        >
                          {statusInfo.label}
                        </span>
                        {email.extracted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            Data Extracted
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">
                        {email.subject}
                      </h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>
                          From:{" "}
                          <span className="text-gray-300">
                            {email.supplier}
                          </span>
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(email.received_date).toLocaleString()}
                        </span>
                      </div>

                      {email.status === "pending" && (
                        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-xs text-yellow-300">
                            ⏳ Waiting for AI processing... Data extraction and
                            risk analysis will happen automatically.
                          </p>
                        </div>
                      )}

                      {email.risk_detected && (
                        <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <p className="text-xs text-red-300">
                            ⚠️ Risk detected by AI. Check the Risk Analysis
                            dashboard for details.
                          </p>
                        </div>
                      )}
                    </div>
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
