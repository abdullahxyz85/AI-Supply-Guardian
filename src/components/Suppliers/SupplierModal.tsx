import { useState, useEffect } from "react";
import { X, Loader2, Mail, Phone, User, MapPin, FileText } from "lucide-react";
import { createSupplier, updateSupplier } from "../../lib/database";
import type { Supplier, SupplierInput } from "../../types/database";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier?: Supplier | null;
}

export function SupplierModal({
  isOpen,
  onClose,
  onSuccess,
  supplier,
}: SupplierModalProps) {
  const [formData, setFormData] = useState<SupplierInput>({
    name: "",
    email: "",
    phone: "",
    address: "",
    contact_person: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone || "",
        address: supplier.address || "",
        contact_person: supplier.contact_person || "",
        notes: supplier.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        contact_person: "",
        notes: "",
      });
    }
    setError("");
  }, [supplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      if (supplier) {
        // Update existing supplier
        await updateSupplier(supplier.id, formData);
      } else {
        // Create new supplier
        await createSupplier(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError("Failed to save supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SupplierInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh]">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 animate-pulse"></div>

        {/* Main Container */}
        <div className="relative bg-elevated rounded-2xl shadow-2xl border border-primary/20 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-primary/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {supplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-red-500/10 rounded-lg group">
              <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Form - Scrollable with hidden scrollbar */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-5"
            >
              {error && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-xs sm:text-sm">
                    {error}
                  </div>
                </div>
              )}

              {/* Supplier Name */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Supplier Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-primary/40"
                      placeholder="TechComponents Ltd"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-primary/40"
                      placeholder="contact@techcomponents.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) =>
                        handleChange("contact_person", e.target.value)
                      }
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-darker border border-green-500/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-green-500/40"
                      placeholder="John Smith"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-darker border border-yellow-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 text-sm sm:text-base hover:border-yellow-500/40"
                      placeholder="+1 (555) 123-4567"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-darker border border-cyan-500/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-white placeholder-gray-500 resize-none text-sm sm:text-base hover:border-cyan-500/40"
                      placeholder="123 Business St, City, State, ZIP"
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-darker border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500 resize-none text-sm sm:text-base hover:border-primary/40"
                      placeholder="Any additional information about this supplier..."
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
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
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>
                        {supplier ? "Update Supplier" : "Add Supplier"}
                      </span>
                    )}
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
