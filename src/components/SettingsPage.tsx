import { useAuth } from '../contexts/AuthContext';
import { User, Bell, Shield, TrendingUp } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();

  const getFullName = () => {
    if (!user) return "";
    if ('user_metadata' in user && user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if ('name' in user) {
      return user.name;
    }
    return "User";
  };

  const fullName = getFullName();

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
                  defaultValue={fullName}
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
                  defaultValue={user && 'user_metadata' in user ? user.user_metadata?.company || "" : "Your Company Inc."}
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
                <select defaultValue="medium" className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-green-500/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-white hover:border-green-500/40">
                  <option value="low">Low - Fewer alerts</option>
                  <option value="medium">
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
                <select defaultValue="overview" className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-yellow-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white hover:border-yellow-500/40">
                  <option value="overview">
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
                <select defaultValue="dmy" className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-orange-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-white hover:border-orange-500/40">
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy">
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
};

