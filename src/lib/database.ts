import { supabase } from "./supabase";
import type {
  Supplier,
  SupplierInput,
  Inventory,
  InventoryInput,
  Order,
  OrderInput,
  Email,
  ExtractedData,
  RiskAnalysis,
  AuditLog,
  OrderWithSupplier,
  RiskAnalysisWithDetails,
  DashboardStats,
} from "../types/database";

// =====================================================
// UTILITY
// =====================================================

async function getUserId() {
  // First, check if we have a Supabase session (for email/password users)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // User is authenticated via Supabase (email/password or already linked Google account)
    return user.id;
  }

  // For Google OAuth users, we need to get the Supabase UUID from localStorage
  // This is stored when the user is created in Supabase
  const supabaseUserId = localStorage.getItem('supabase_user_id');
  if (supabaseUserId) {
    return supabaseUserId;
  }

  throw new Error("User not authenticated");
}

// =====================================================
// SUPPLIERS
// =====================================================

export async function getSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Supplier[];
}

export async function getSupplierById(id: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function createSupplier(supplier: SupplierInput) {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      ...supplier,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function updateSupplier(
  id: string,
  supplier: Partial<SupplierInput>
) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(supplier)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) throw error;
}

// =====================================================
// INVENTORY
// =====================================================

export async function getInventory() {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("item_name");

  if (error) throw error;
  return data as Inventory[];
}

export async function getLowStockItems() {
  // Fetch all inventory items and filter them on the client-side.
  // This avoids a complex query that can fail if column-to-column comparison isn't straightforward.
  const { data: allData, error } = await supabase
    .from("inventory")
    .select("*")
    .order("current_stock");

  if (error) {
    console.error("Error fetching inventory for low stock check:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }

  if (!allData) {
    return [];
  }

  // Perform the filtering logic in the application
  return (allData as Inventory[]).filter(
    (item) => item.current_stock < (item.minimum_stock_level || 0)
  );
}

export async function createInventoryItem(item: InventoryInput) {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("inventory")
    .insert({
      ...item,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Inventory;
}

export async function updateInventoryItem(
  id: string,
  item: Partial<InventoryInput>
) {
  const { data, error } = await supabase
    .from("inventory")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Inventory;
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) throw error;
}

// =====================================================
// ORDERS
// =====================================================

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      supplier:suppliers(*)
    `
    )
    .order("expected_delivery_date", { ascending: false });

  if (error) throw error;
  return data as OrderWithSupplier[];
}

export async function getOrdersBySupplier(supplierId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("supplier_id", supplierId)
    .order("expected_delivery_date", { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function getPendingOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      supplier:suppliers(*)
    `
    )
    .eq("status", "pending")
    .order("expected_delivery_date");

  if (error) throw error;
  return data as OrderWithSupplier[];
}

export async function createOrder(order: OrderInput) {
  const userId = await getUserId();

  // Calculate total price
  const totalPrice = order.quantity * order.unit_price;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...order,
      total_price: totalPrice,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrder(id: string, order: Partial<OrderInput>) {
  const updates: Record<string, unknown> = { ...order };

  // Recalculate total price if quantity or unit_price changed
  if (order.quantity || order.unit_price) {
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("quantity, unit_price")
      .eq("id", id)
      .single();

    if (existingOrder) {
      const quantity = order.quantity ?? existingOrder.quantity;
      const unitPrice = order.unit_price ?? existingOrder.unit_price;
      updates.total_price = quantity * unitPrice;
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw error;
}

// =====================================================
// EMAILS
// =====================================================

export async function getEmails() {
  const { data, error } = await supabase
    .from("emails")
    .select(
      `
      *,
      supplier:suppliers(*),
      extracted_data(*)
    `
    )
    .order("received_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUnprocessedEmails() {
  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .eq("processed", false)
    .order("received_at", { ascending: false });

  if (error) throw error;
  return data as Email[];
}

// =====================================================
// RISK ANALYSIS
// =====================================================

export async function getRiskAnalysis() {
  const { data, error } = await supabase
    .from("risk_analysis")
    .select(
      `
      *,
      extracted_data(*),
      order:orders(
        *,
        supplier:suppliers(*)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as RiskAnalysisWithDetails[];
}

export async function getHighRiskAlerts() {
  const { data, error } = await supabase
    .from("risk_analysis")
    .select(
      `
      *,
      extracted_data(*),
      order:orders(
        *,
        supplier:suppliers(*)
      )
    `
    )
    .eq("risk_level", "High")
    .eq("human_reviewed", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as RiskAnalysisWithDetails[];
}

export async function updateRiskAnalysis(
  id: string,
  updates: {
    risk_level?: "Low" | "Medium" | "High";
    recommendation?: string;
    human_reviewed?: boolean;
    human_modified?: boolean;
    original_risk_level?: "Low" | "Medium" | "High";
    reviewed_at?: string;
  }
) {
  await getUserId(); // Ensures user is authenticated

  // Get original data for audit log
  const { data: original } = await supabase
    .from("risk_analysis")
    .select("*")
    .eq("id", id)
    .single();

  const updateData: Record<string, unknown> = {
    ...updates,
    human_reviewed: true,
    reviewed_at: new Date().toISOString(),
  };

  // If risk level changed, mark as human modified and store original
  if (
    updates.risk_level &&
    original &&
    updates.risk_level !== original.risk_level
  ) {
    updateData.human_modified = true;
    updateData.original_risk_level = original.risk_level;
  }

  const { data, error } = await supabase
    .from("risk_analysis")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Create audit log entry
  if (original) {
    if (updates.risk_level && updates.risk_level !== original.risk_level) {
      await createAuditLog({
        risk_analysis_id: id,
        action: "modified_risk_level",
        field_changed: "risk_level",
        old_value: original.risk_level,
        new_value: updates.risk_level,
      });
    }
    if (
      updates.recommendation &&
      updates.recommendation !== original.recommendation
    ) {
      await createAuditLog({
        risk_analysis_id: id,
        action: "modified_recommendation",
        field_changed: "recommendation",
        old_value: original.recommendation,
        new_value: updates.recommendation,
      });
    }
  }

  return data as RiskAnalysis;
}

// =====================================================
// AUDIT LOG
// =====================================================

export async function createAuditLog(log: {
  risk_analysis_id?: string;
  action: string;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
}) {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("audit_log")
    .insert({
      ...log,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as AuditLog;
}

export async function getAuditLogs(riskAnalysisId?: string) {
  let query = supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (riskAnalysisId) {
    query = query.eq("risk_analysis_id", riskAnalysisId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as AuditLog[];
}

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  await getUserId(); // Ensures user is authenticated

  // Get counts in parallel
  const [
    suppliersResult,
    ordersResult,
    pendingOrdersResult,
    highRiskResult,
    mediumRiskResult,
    lowStockResult,
  ] = await Promise.all([
    supabase.from("suppliers").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("risk_analysis")
      .select("id", { count: "exact", head: true })
      .eq("risk_level", "High"),
    supabase
      .from("risk_analysis")
      .select("id", { count: "exact", head: true })
      .eq("risk_level", "Medium"),
    getLowStockItems(),
  ]);

  return {
    total_suppliers: suppliersResult.count || 0,
    total_orders: ordersResult.count || 0,
    pending_orders: pendingOrdersResult.count || 0,
    high_risk_alerts: highRiskResult.count || 0,
    medium_risk_alerts: mediumRiskResult.count || 0,
    low_stock_items: lowStockResult.length || 0,
  };
}

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

export function subscribeToSuppliers(callback: (payload: unknown) => void) {
  return supabase
    .channel("suppliers_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "suppliers" },
      callback
    )
    .subscribe();
}

export function subscribeToOrders(callback: (payload: unknown) => void) {
  return supabase
    .channel("orders_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      callback
    )
    .subscribe();
}

export function subscribeToRiskAnalysis(callback: (payload: unknown) => void) {
  return supabase
    .channel("risk_analysis_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "risk_analysis" },
      callback
    )
    .subscribe();
}
