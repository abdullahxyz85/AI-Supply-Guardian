import { useState, useEffect } from "react";
import { X, Package, Loader2 } from "lucide-react";
import { createInventoryItem, updateInventoryItem } from "../../lib/database";
import type { Inventory, InventoryInput } from "../../types/database";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: Inventory | null;
}

export function InventoryModal({
  isOpen,
  onClose,
  onSuccess,
  item,
}: InventoryModalProps) {
  const [formData, setFormData] = useState<InventoryInput>({
    item_name: "",
    current_stock: 0,
    unit: "",
    daily_usage_rate: undefined,
    minimum_stock_level: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name,
        current_stock: item.current_stock,
        unit: item.unit,
        daily_usage_rate: item.daily_usage_rate,
        minimum_stock_level: item.minimum_stock_level,
      });
    } else {
      setFormData({
        item_name: "",
        current_stock: 0,
        unit: "",
        daily_usage_rate: undefined,
        minimum_stock_level: undefined,
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_name.trim()) {
      newErrors.item_name = "Item name is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (formData.current_stock < 0) {
      newErrors.current_stock = "Stock cannot be negative";
    }

    if (
      formData.daily_usage_rate !== undefined &&
      formData.daily_usage_rate < 0
    ) {
      newErrors.daily_usage_rate = "Daily usage rate cannot be negative";
    }

    if (
      formData.minimum_stock_level !== undefined &&
      formData.minimum_stock_level < 0
    ) {
      newErrors.minimum_stock_level = "Minimum stock level cannot be negative";
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
      if (item) {
        await updateInventoryItem(item.id, formData);
      } else {
        await createInventoryItem(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving item:", error);
      setErrors({ submit: "Failed to save item. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof InventoryInput,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh]">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl blur opacity-20 animate-pulse"></div>

        {/* Main Container */}
        <div className="relative bg-[#1e2337] rounded-2xl shadow-2xl border border-green-500/20 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-green-500/20 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {item ? "Edit Inventory Item" : "Add Inventory Item"}
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

              {/* Item Name */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Item Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.item_name}
                    onChange={(e) => handleChange("item_name", e.target.value)}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-[#151929] border ${
                      errors.item_name
                        ? "border-red-500/50"
                        : "border-green-500/20"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-green-500/40`}
                    placeholder="e.g., Steel Sheets, Copper Wire"
                  />
                  {errors.item_name && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">
                      {errors.item_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Current Stock and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Current Stock <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.current_stock}
                      onChange={(e) =>
                        handleChange(
                          "current_stock",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-[#151929] border ${
                        errors.current_stock
                          ? "border-red-500/50"
                          : "border-blue-500/20"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-blue-500/40`}
                      placeholder="0"
                      step="0.01"
                      min="0"
                    />
                    {errors.current_stock && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.current_stock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Unit <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                      className={`w-full px-4 py-2.5 sm:py-3 bg-[#151929] border ${
                        errors.unit
                          ? "border-red-500/50"
                          : "border-primary/20"
                      } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-primary/40`}
                      placeholder="e.g., kg, pieces, liters"
                    />
                    {errors.unit && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.unit}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Daily Usage Rate and Minimum Stock Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Daily Usage Rate
                    </label>
                    <input
                      type="number"
                      value={formData.daily_usage_rate ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "daily_usage_rate",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-[#151929] border ${
                        errors.daily_usage_rate
                          ? "border-red-500/50"
                          : "border-yellow-500/20"
                      } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-yellow-500/40`}
                      placeholder="Optional"
                      step="0.01"
                      min="0"
                    />
                    {errors.daily_usage_rate && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.daily_usage_rate}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      How much is used per day
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Minimum Stock Level
                    </label>
                    <input
                      type="number"
                      value={formData.minimum_stock_level ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "minimum_stock_level",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 bg-[#151929] border ${
                        errors.minimum_stock_level
                          ? "border-red-500/50"
                          : "border-red-500/20"
                      } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-red-500/40`}
                      placeholder="Optional"
                      step="0.01"
                      min="0"
                    />
                    {errors.minimum_stock_level && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {errors.minimum_stock_level}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Alert when stock drops below
                    </p>
                  </div>
                </div>
              </div>

              {/* Coverage Info */}
              {formData.current_stock > 0 &&
                formData.daily_usage_rate &&
                formData.daily_usage_rate > 0 && (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-30"></div>
                    <div className="relative p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <p className="text-emerald-300 text-xs sm:text-sm">
                        <span className="font-semibold">Days of Coverage:</span>{" "}
                        {Math.floor(
                          formData.current_stock / formData.daily_usage_rate
                        )}{" "}
                        days
                      </p>
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
                    <span>{item ? "Update Item" : "Add Item"}</span>
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
