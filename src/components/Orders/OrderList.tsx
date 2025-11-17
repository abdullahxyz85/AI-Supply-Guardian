import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ShoppingCart,
  Truck,
  XCircle,
  Clock,
  Loader2,
  Package,
} from "lucide-react";
import { getOrders, deleteOrder, getSuppliers } from "../../lib/database";
import type { Order, Supplier } from "../../types/database";
import { OrderModal } from "./OrderModal";

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load orders and suppliers
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, suppliersData] = await Promise.all([
        getOrders(),
        getSuppliers(),
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      setDeleteConfirmId(null);
      loadData();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    loadData();
  };

  // Get supplier name by ID
  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier?.name || "Unknown Supplier";
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: Clock,
          label: "Pending",
        };
      case "shipped":
        return {
          color: "text-purple-400",
          bg: "bg-primary/10",
          border: "border-primary/30",
          icon: Truck,
          label: "Shipped",
        };
      case "delivered":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: Package,
          label: "Delivered",
        };
      case "delayed":
        return {
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          icon: Clock,
          label: "Delayed",
        };
      case "cancelled":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: XCircle,
          label: "Cancelled",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          icon: ShoppingCart,
          label: "Unknown",
        };
    }
  };

  // Calculate days until delivery
  const getDaysUntilDelivery = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSupplierName(order.supplier_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const totalValue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

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
          <h2 className="text-3xl font-bold text-white">Orders</h2>
          <p className="text-gray-400 mt-1">
            Track and manage all your supply orders
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="gradient-button flex items-center space-x-2 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-elevated border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">
                {pendingOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Transit</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">
                {shippedOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-elevated border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-400" />
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
            placeholder="Search orders or suppliers..."
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
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No orders found"
              : "No orders yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first order"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Order</span>
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
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Total Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Delivery Date
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
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const daysUntil = getDaysUntilDelivery(
                    order.expected_delivery_date
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#151929] transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <ShoppingCart className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-white font-medium">
                              {order.item_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.unit}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {getSupplierName(order.supplier_id)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">
                          {order.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-semibold">
                          ${order.total_price?.toLocaleString() || "0"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white text-sm">
                            {new Date(
                              order.expected_delivery_date
                            ).toLocaleDateString()}
                          </p>
                          {order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <p
                                className={`text-xs ${
                                  daysUntil < 0
                                    ? "text-red-400"
                                    : daysUntil <= 3
                                    ? "text-yellow-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {daysUntil < 0
                                  ? `${Math.abs(daysUntil)} days overdue`
                                  : daysUntil === 0
                                  ? "Due today"
                                  : `${daysUntil} days left`}
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {deleteConfirmId === order.id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDelete(order.id)}
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
                              onClick={() => handleEdit(order)}
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                              title="Edit order"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(order.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Delete order"
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
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onSuccess={handleModalSuccess}
        order={selectedOrder}
        suppliers={suppliers}
      />
    </div>
  );
}
