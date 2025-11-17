import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import {
  getSuppliers,
  deleteSupplier,
  subscribeToSuppliers,
} from "../../lib/database";
import type { Supplier } from "../../types/database";
import { SupplierModal } from "./SupplierModal";

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load suppliers
  useEffect(() => {
    loadSuppliers();

    // Subscribe to real-time updates
    const subscription = subscribeToSuppliers(() => {
      loadSuppliers();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier");
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
    loadSuppliers();
  };

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-bold text-white">Suppliers</h2>
          <p className="text-gray-400 mt-1">Manage your supplier contacts</p>
        </div>
        <button
          onClick={handleAdd}
          className="gradient-button flex items-center space-x-2 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-elevated border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition text-white placeholder-gray-500"
        />
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm ? "No suppliers found" : "No suppliers yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first supplier"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Supplier</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-elevated border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              {/* Supplier Name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {supplier.name}
                  </h3>
                  {supplier.contact_person && (
                    <p className="text-sm text-gray-400 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {supplier.contact_person}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    title="Edit supplier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(supplier.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Delete supplier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-sm hover:text-primary transition truncate"
                  >
                    {supplier.email}
                  </a>
                </div>
                {supplier.phone && (
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <a
                      href={`tel:${supplier.phone}`}
                      className="text-sm hover:text-primary transition"
                    >
                      {supplier.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Address */}
              {supplier.address && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {supplier.address}
                  </p>
                </div>
              )}

              {/* Notes */}
              {supplier.notes && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {supplier.notes}
                  </p>
                </div>
              )}

              {/* Delete Confirmation */}
              {deleteConfirmId === supplier.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-red-400 mb-3">
                    Are you sure you want to delete this supplier?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSuccess={handleModalSuccess}
        supplier={selectedSupplier}
      />
    </div>
  );
}
