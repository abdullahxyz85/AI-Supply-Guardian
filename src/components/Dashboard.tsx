import { Bell, Shield, LayoutDashboard, Users, Plus, Mail, Settings, TrendingUp, AlertTriangle, Package, Clock } from 'lucide-react';
import { useState } from 'react';

type Page = 'dashboard' | 'suppliers' | 'add-supplier' | 'alerts' | 'analyzer' | 'settings';

interface DashboardProps {
  onNavigateToLanding: () => void;
}

export function Dashboard({ onNavigateToLanding }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <button onClick={onNavigateToLanding} className="flex items-center space-x-2 hover:opacity-80 transition">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">AI Supply Guardian</span>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentPage('suppliers')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === 'suppliers'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Suppliers</span>
          </button>

          <button
            onClick={() => setCurrentPage('add-supplier')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === 'add-supplier'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Supplier</span>
          </button>

          <button
            onClick={() => setCurrentPage('alerts')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === 'alerts'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Alerts</span>
          </button>

          <button
            onClick={() => setCurrentPage('analyzer')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === 'analyzer'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email Analyzer</span>
          </button>

          <button
            onClick={() => setCurrentPage('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === 'settings'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>
      </aside>

      <main className="ml-64 flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentPage === 'dashboard' && 'Dashboard'}
                {currentPage === 'suppliers' && 'Supplier Management'}
                {currentPage === 'add-supplier' && 'Add New Supplier'}
                {currentPage === 'alerts' && 'Risk Alerts'}
                {currentPage === 'analyzer' && 'AI Email Analyzer'}
                {currentPage === 'settings' && 'Settings'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentPage === 'dashboard' && 'Monitor your supply chain at a glance'}
                {currentPage === 'suppliers' && 'View and manage all your suppliers'}
                {currentPage === 'add-supplier' && 'Add a new supplier to track'}
                {currentPage === 'alerts' && 'View all risk notifications'}
                {currentPage === 'analyzer' && 'Analyze supplier communications with AI'}
                {currentPage === 'settings' && 'Configure your preferences'}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">JD</span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {currentPage === 'dashboard' && <DashboardHome />}
          {currentPage === 'suppliers' && <SuppliersPage />}
          {currentPage === 'add-supplier' && <AddSupplierPage />}
          {currentPage === 'alerts' && <AlertsPage />}
          {currentPage === 'analyzer' && <AnalyzerPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-3xl font-bold text-red-600">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">High Risk Suppliers</h3>
          <p className="text-xs text-gray-500 mt-1">Immediate attention needed</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-blue-600">12</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pending Deliveries</h3>
          <p className="text-xs text-gray-500 mt-1">Expected this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-yellow-600">5</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Price Spike Alerts</h3>
          <p className="text-xs text-gray-500 mt-1">Significant increases detected</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-green-600">92%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">On-Time Delivery Rate</h3>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">High Risk</span>
                <span className="text-sm font-bold text-red-600">3 suppliers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Medium Risk</span>
                <span className="text-sm font-bold text-yellow-600">7 suppliers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Low Risk</span>
                <span className="text-sm font-bold text-green-600">12 suppliers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Delivery Delay Detected</p>
                <p className="text-xs text-gray-600 mt-1">Acme Corp - Steel sheets expected 5 days late</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Price Increase Warning</p>
                <p className="text-xs text-gray-600 mt-1">Global Materials - Copper wire up 18%</p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Supplier Risk Alert</p>
                <p className="text-xs text-gray-600 mt-1">TechParts Ltd - Financial instability detected</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Late Response Pattern</p>
                <p className="text-xs text-gray-600 mt-1">BuildCo - Slow email responses past 2 weeks</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuppliersPage() {
  const suppliers = [
    { name: 'Acme Corp', item: 'Steel Sheets', quantity: 500, deliveryDate: '2025-11-20', risk: 'high' },
    { name: 'Global Materials', item: 'Copper Wire', quantity: 1000, deliveryDate: '2025-11-18', risk: 'medium' },
    { name: 'TechParts Ltd', item: 'Electronic Components', quantity: 200, deliveryDate: '2025-11-22', risk: 'high' },
    { name: 'BuildCo', item: 'Concrete Mix', quantity: 2000, deliveryDate: '2025-11-17', risk: 'medium' },
    { name: 'SafeSupply Inc', item: 'Safety Equipment', quantity: 150, deliveryDate: '2025-11-19', risk: 'low' },
    { name: 'QuickShip LLC', item: 'Packaging Materials', quantity: 800, deliveryDate: '2025-11-16', risk: 'low' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Suppliers</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{supplier.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{supplier.item}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{supplier.quantity} units</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{supplier.deliveryDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      supplier.risk === 'high'
                        ? 'bg-red-100 text-red-800'
                        : supplier.risk === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {supplier.risk.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddSupplierPage() {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Supplier Information</h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="supplier@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="What are they supplying?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Delivery Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AlertsPage() {
  const alerts = [
    {
      type: 'high',
      title: 'Critical Delivery Delay',
      description: 'Acme Corp - Steel sheets order will be 5 days late due to production issues',
      time: '2 hours ago',
      icon: AlertTriangle,
    },
    {
      type: 'high',
      title: 'Supplier Financial Risk',
      description: 'TechParts Ltd - Credit rating downgraded, may affect reliability',
      time: '1 day ago',
      icon: AlertTriangle,
    },
    {
      type: 'medium',
      title: 'Price Increase Detected',
      description: 'Global Materials - Copper wire price increased by 18% from last order',
      time: '5 hours ago',
      icon: TrendingUp,
    },
    {
      type: 'medium',
      title: 'Slow Response Pattern',
      description: 'BuildCo - Average email response time increased to 48+ hours',
      time: '1 day ago',
      icon: Clock,
    },
    {
      type: 'low',
      title: 'Minor Schedule Change',
      description: 'QuickShip LLC - Delivery moved forward by 1 day, arriving earlier',
      time: '3 days ago',
      icon: Package,
    },
    {
      type: 'medium',
      title: 'Quality Concern Mentioned',
      description: 'Global Materials - Email mentioned "quality control delays", monitoring situation',
      time: '2 days ago',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${
            alert.type === 'high'
              ? 'border-red-500'
              : alert.type === 'medium'
              ? 'border-yellow-500'
              : 'border-green-500'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                alert.type === 'high'
                  ? 'bg-red-100'
                  : alert.type === 'medium'
                  ? 'bg-yellow-100'
                  : 'bg-green-100'
              }`}
            >
              <alert.icon
                className={`w-6 h-6 ${
                  alert.type === 'high'
                    ? 'text-red-600'
                    : alert.type === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    alert.type === 'high'
                      ? 'bg-red-100 text-red-800'
                      : alert.type === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {alert.type.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{alert.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{alert.time}</span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyzerPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analyze Supplier Communication</h2>
        <p className="text-gray-600 mb-6">
          Paste any email or text from your supplier below. Our AI will automatically extract key information and identify potential risks.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email or Text Content
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            rows={12}
            placeholder="Paste supplier email or message here..."
            defaultValue="Dear Valued Customer,

We wanted to update you on your steel sheets order (#12345). Unfortunately, we're experiencing some production delays due to equipment maintenance issues in our facility. We expect the shipment to be delayed by approximately 5 days from the original delivery date of Nov 20th.

We apologize for any inconvenience this may cause and will keep you updated on our progress.

Best regards,
Acme Corp Supply Team"
          />
        </div>

        <button
          onClick={() => setShowResults(!showResults)}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Analyze with AI
        </button>

        {showResults && (
          <div className="mt-8 space-y-4">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h4 className="text-lg font-semibold text-red-900">High Risk Detected</h4>
              </div>
              <p className="text-red-800 mb-4">
                Significant delivery delay identified. This may impact your production schedule.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Key Information Extracted</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Supplier</p>
                    <p className="text-sm text-gray-900">Acme Corp</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Order Number</p>
                    <p className="text-sm text-gray-900">#12345</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Item</p>
                    <p className="text-sm text-gray-900">Steel sheets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Issue</p>
                    <p className="text-sm text-gray-900">Production delays due to equipment maintenance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delay Duration</p>
                    <p className="text-sm text-gray-900">Approximately 5 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">New Expected Date</p>
                    <p className="text-sm text-gray-900">November 25, 2025</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Contact alternative suppliers for urgent needs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Adjust production schedule to accommodate delay</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Request daily updates from supplier</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-900">Monitor for further delays or complications</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              defaultValue="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              defaultValue="john@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              defaultValue="My Company Inc"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">Email alerts for high-risk suppliers</span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">Daily summary report</span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Weekly performance digest</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
