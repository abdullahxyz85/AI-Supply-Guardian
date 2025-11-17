import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { getInventory, deleteInventoryItem } from "../../lib/database";
import type { Inventory } from "../../types/database";
import { InventoryModal } from "./InventoryModal";

export function InventoryList() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load inventory
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Inventory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      setDeleteConfirmId(null);
      loadInventory();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    loadInventory();
  };

  // Calculate stock status
  const getStockStatus = (item: Inventory) => {
    if (item.current_stock <= 0) return "out";
    if (
      item.minimum_stock_level &&
      item.current_stock <= item.minimum_stock_level
    )
      return "low";
    return "normal";
  };

  // Calculate days of coverage
  const getDaysOfCoverage = (item: Inventory) => {
    if (!item.daily_usage_rate || item.daily_usage_rate === 0) return null;
    return Math.floor(item.current_stock / item.daily_usage_rate);
  };

  // Filter inventory based on search
  const filteredInventory = inventory.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by stock status
  const lowStockItems = filteredInventory.filter(
    (item) => getStockStatus(item) === "low"
  );
  const outOfStockItems = filteredInventory.filter(
    (item) => getStockStatus(item) === "out"
  );

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
          <h2 className="text-3xl font-bold text-white">Inventory</h2>
          <p className="text-gray-400 mt-1">
            Track your stock levels and usage
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="gradient-button flex items-center space-x-2 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-elevated border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-white mt-1">
                {inventory.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">
                {lowStockItems.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                {outOfStockItems.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search inventory items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500"
        />
      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm ? "No items found" : "No inventory items yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first inventory item"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Item</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-elevated border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#151929] border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Current Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Daily Usage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Min. Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Coverage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  const coverage = getDaysOfCoverage(item);

                  return (
                    <tr key={item.id} className="hover:bg-[#151929] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-500 mr-3" />
                          <span className="text-white font-medium">
                            {item.item_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-lg font-bold ${
                            status === "out"
                              ? "text-red-400"
                              : status === "low"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {item.current_stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.unit}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.daily_usage_rate || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.minimum_stock_level || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {coverage !== null ? (
                          <span
                            className={`font-medium ${
                              coverage <= 3
                                ? "text-red-400"
                                : coverage <= 7
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            {coverage} days
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {status === "out" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                            Out of Stock
                          </span>
                        ) : status === "low" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/30">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {deleteConfirmId === item.id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                              title="Edit item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={handleModalSuccess}
        item={selectedItem}
      />
    </div>
  );
}
