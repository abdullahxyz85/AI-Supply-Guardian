import { useState, useEffect } from "react";
import { X, ShoppingCart, Loader2 } from "lucide-react";
import { createOrder, updateOrder } from "../../lib/database";
import type { Order, OrderInput, Supplier } from "../../types/database";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
  suppliers: Supplier[];
}

export function OrderModal({
  isOpen,
  onClose,
  onSuccess,
  order,
  suppliers,
}: OrderModalProps) {
  const [formData, setFormData] = useState<OrderInput>({
    supplier_id: "",
    order_number: undefined,
    item_name: "",
    quantity: 0,
    unit: "",
    unit_price: 0,
    total_price: 0,
    expected_delivery_date: "",
    status: "pending",
    notes: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData({
        supplier_id: order.supplier_id,
        order_number: order.order_number,
        item_name: order.item_name,
        quantity: order.quantity,
        unit: order.unit,
        unit_price: order.unit_price,
        total_price: order.total_price,
        expected_delivery_date: order.expected_delivery_date,
        status: order.status,
        notes: order.notes,
      });
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split("T")[0];

      setFormData({
        supplier_id: "",
        order_number: undefined,
        item_name: "",
        quantity: 0,
        unit: "",
        unit_price: 0,
        total_price: 0,
        expected_delivery_date: dateString,
        status: "pending",
        notes: undefined,
      });
    }
    setErrors({});
  }, [order, isOpen]);

  // Auto-calculate total price when quantity or unit price changes
  useEffect(() => {
    const total = formData.quantity * formData.unit_price;
    if (total !== formData.total_price) {
      setFormData((prev) => ({ ...prev, total_price: total }));
    }
  }, [formData.quantity, formData.unit_price, formData.total_price]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier_id) {
      newErrors.supplier_id = "Supplier is required";
    }

    if (!formData.item_name.trim()) {
      newErrors.item_name = "Item name is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.unit_price < 0) {
      newErrors.unit_price = "Unit price cannot be negative";
    }

    if (!formData.expected_delivery_date) {
      newErrors.expected_delivery_date = "Delivery date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (order) {
        await updateOrder(order.id, formData);
      } else {
        await createOrder(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving order:", error);
      setErrors({ submit: "Failed to save order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OrderInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh]">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>

        {/* Main Container */}
        <div className="relative bg-[#1e2337] rounded-2xl shadow-2xl border border-blue-500/20 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {order ? "Edit Order" : "Create New Order"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-red-500/10 rounded-lg group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Form - Scrollable with hidden scrollbar */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Error Message */}
              {errors.submit && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-xs sm:text-sm">
                    {errors.submit}
                  </div>
                </div>
              )}

              {/* Supplier */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Supplier <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) =>
                      handleChange("supplier_id", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 sm:py-3 bg-darker border ${
                      errors.supplier_id
                        ? "border-red-500/50"
                        : "border-blue-500/20"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-white text-sm sm:text-base hover:border-blue-500/40`}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {errors.supplier_id && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">
                      {errors.supplier_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Number */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={formData.order_number || ""}
                    onChange={(e) =>
                      handleChange("order_number", e.target.value)
                    }
                    className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-primary/40"
                    placeholder="e.g., PO-2025-001 (optional)"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Optional reference number
                  </p>
                </div>
              </div>

              {/* Item Name and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Item Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.item_name}
                      onChange={(e) =>
                        handleChange("item_name", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-darker border ${
                        errors.item_name
                          ? "border-red-500/50"
                          : "border-green-500/20"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-green-500/40`}
                      placeholder="e.g., Steel Sheets"
                    />
                    {errors.item_name && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.item_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Unit <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                      className={`w-full px-4 py-2.5 sm:py-3 bg-darker border ${
                        errors.unit
                          ? "border-red-500/50"
                          : "border-yellow-500/20"
                      } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-yellow-500/40`}
                      placeholder="e.g., kg, pieces"
                    />
                    {errors.unit && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.unit}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity, Unit Price, Total Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        handleChange(
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-darker border ${
                        errors.quantity
                          ? "border-red-500/50"
                          : "border-cyan-500/20"
                      } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-cyan-500/40`}
                      placeholder="0"
                      step="0.01"
                      min="0"
                    />
                    {errors.quantity && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Unit Price <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.unit_price}
                      onChange={(e) =>
                        handleChange(
                          "unit_price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-darker border ${
                        errors.unit_price
                          ? "border-red-500/50"
                          : "border-primary/20"
                      } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-primary/40`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {errors.unit_price && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.unit_price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Total Price
                    </label>
                    <input
                      type="number"
                      value={formData.total_price}
                      readOnly
                      className="w-full px-4 py-2.5 sm:py-3 bg-[#0d1117] border border-green-500/30 rounded-lg text-green-400 font-semibold cursor-not-allowed text-sm sm:text-base"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Auto-calculated
                    </p>
                  </div>
                </div>
              </div>

              {/* Expected Delivery Date and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Expected Delivery Date{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.expected_delivery_date}
                      onChange={(e) =>
                        handleChange("expected_delivery_date", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-darker border ${
                        errors.expected_delivery_date
                          ? "border-red-500/50"
                          : "border-primary/20"
                      } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white text-sm sm:text-base hover:border-primary/40`}
                    />
                    {errors.expected_delivery_date && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.expected_delivery_date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-violet-500/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-white text-sm sm:text-base hover:border-violet-500/40"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="delayed">Delayed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 sm:py-3 bg-darker border border-fuchsia-500/20 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition text-white placeholder-gray-500 resize-none text-sm sm:text-base hover:border-fuchsia-500/40"
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
              </div>

              {/* Summary Info */}
              {formData.quantity > 0 && formData.unit_price > 0 && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
                  <div className="relative p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-300">Order Summary:</span>
                      <span className="text-indigo-300 font-semibold">
                        {formData.quantity} {formData.unit} × $
                        {formData.unit_price.toFixed(2)} = $
                        {formData.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-2.5 sm:py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium hover:border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative flex-1 group overflow-hidden rounded-xl gradient-button shadow-lg shadow-primary/30"
                >
                  <div className="relative px-6 py-2.5 sm:py-3 flex items-center justify-center space-x-2 text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading && (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    )}
                    <span>{order ? "Update Order" : "Create Order"}</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
