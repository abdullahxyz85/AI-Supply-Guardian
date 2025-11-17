import { useState, useEffect } from "react";
import { FileText, Clock, User, Loader2, Search } from "lucide-react";
import { getAuditLogs } from "../../lib/database";
import type { AuditLog } from "../../types/database";

export function AuditLogViewer() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const data = await getAuditLogs();
      setAuditLogs(data);
    } catch (error) {
      console.error("Error loading audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get action styling
  const getActionInfo = (action: string) => {
    if (action.includes("modified")) {
      return {
        color: "text-purple-400",
        bg: "bg-primary/10",
        border: "border-primary/30",
        label: "Modified",
      };
    } else if (action.includes("reviewed")) {
      return {
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        label: "Reviewed",
      };
    } else if (action.includes("created")) {
      return {
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        label: "Created",
      };
    } else if (action.includes("deleted")) {
      return {
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        label: "Deleted",
      };
    }
    return {
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      label: "Updated",
    };
  };

  // Format action for display
  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reason &&
        log.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.field_changed &&
        log.field_changed.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction =
      actionFilter === "all" ||
      log.action.toLowerCase().includes(actionFilter.toLowerCase());

    return matchesSearch && matchesAction;
  });

  // Get unique action types
  const actionTypes = Array.from(new Set(auditLogs.map((log) => log.action)));

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
          <h2 className="text-3xl font-bold text-white">Audit Log</h2>
          <p className="text-gray-400 mt-1">
            Track all human interventions and system changes
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Entries</p>
          <p className="text-2xl font-bold text-indigo-400">
            {auditLogs.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500"
          />
        </div>

        {/* Action Filter */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white"
        >
          <option value="all">All Actions</option>
          {actionTypes.map((action) => (
            <option key={action} value={action}>
              {formatAction(action)}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Log List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm || actionFilter !== "all"
              ? "No logs found"
              : "No audit logs yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || actionFilter !== "all"
              ? "Try adjusting your filters"
              : "Audit logs will appear here as users interact with the system"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const actionInfo = getActionInfo(log.action);

            return (
              <div
                key={log.id}
                className="bg-elevated rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div
                      className={`w-10 h-10 ${actionInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <FileText className={`w-5 h-5 ${actionInfo.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${actionInfo.bg} ${actionInfo.color} border ${actionInfo.border}`}
                        >
                          {actionInfo.label}
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatAction(log.action)}
                        </span>
                      </div>

                      {log.field_changed && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-300">
                            Field:{" "}
                            <span className="font-semibold text-white">
                              {log.field_changed}
                            </span>
                          </p>
                          {log.old_value && log.new_value && (
                            <p className="text-sm text-gray-400">
                              Changed from{" "}
                              <span className="text-red-400">
                                {log.old_value}
                              </span>{" "}
                              to{" "}
                              <span className="text-green-400">
                                {log.new_value}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      {log.reason && (
                        <div className="bg-[#151929] rounded-lg p-3 border border-gray-700 mb-2">
                          <p className="text-sm text-gray-300">
                            <span className="font-semibold text-gray-400">
                              Reason:
                            </span>{" "}
                            {log.reason}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          User ID: {log.user_id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {auditLogs.length > 0 && (
        <div className="bg-elevated rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Activity Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Actions</p>
              <p className="text-2xl font-bold text-indigo-400">
                {auditLogs.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Modifications</p>
              <p className="text-2xl font-bold text-purple-400">
                {
                  auditLogs.filter((log) => log.action.includes("modified"))
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Reviews</p>
              <p className="text-2xl font-bold text-blue-400">
                {
                  auditLogs.filter((log) => log.action.includes("reviewed"))
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Activity</p>
              <p className="text-sm font-semibold text-green-400">
                {auditLogs.length > 0
                  ? new Date(auditLogs[0].created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
