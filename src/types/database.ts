// Database Types for AI Supply Guardian
// These types match the Supabase database schema

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  user_id: string;
  item_name: string;
  current_stock: number;
  unit: string;
  daily_usage_rate?: number;
  minimum_stock_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  supplier_id: string;
  order_number?: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  status: "pending" | "shipped" | "delivered" | "delayed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: string;
  user_id: string;
  supplier_id?: string;
  sender_email: string;
  sender_name?: string;
  subject?: string;
  body_text: string;
  body_html?: string;
  received_at: string;
  processed: boolean;
  created_at: string;
}

export interface ExtractedData {
  id: string;
  email_id: string;
  user_id: string;
  issue_type?:
    | "Delay"
    | "Price Change"
    | "Quantity Change"
    | "Cancellation"
    | "General Update"
    | "Unknown";
  delay_days?: number;
  new_delivery_date?: string;
  old_delivery_date?: string;
  quantity_change?: number;
  price_change?: number;
  cancellation_flag: boolean;
  additional_notes?: string;
  extraction_confidence?: number;
  raw_json?: Record<string, unknown>;
  created_at: string;
}

export interface RiskAnalysis {
  id: string;
  extracted_data_id: string;
  order_id?: string;
  user_id: string;
  risk_level: "Low" | "Medium" | "High";
  reason: string;
  recommendation: string;
  confidence_score?: number;
  stock_coverage_days?: number;
  financial_impact?: number;
  human_reviewed: boolean;
  human_modified: boolean;
  original_risk_level?: "Low" | "Medium" | "High";
  raw_json?: Record<string, unknown>;
  created_at: string;
  reviewed_at?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  risk_analysis_id?: string;
  action: string;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
  created_at: string;
}

export interface AIAnalysisResult {
  id: string;
  issue_type: string | null;
  order_id: string | null;
  item_name: string | null;
  quantity: number | null;
  old_delivery_date: string | null;
  new_delivery_date: string | null;
  delay_days: number | null;
  cancellation_flag: boolean;
  price_change: number | null;
  tracking_number: string | null;
  risk_level: "Low" | "Medium" | "High" | null;
  reason: string | null;
  recommendation: string | null;
  confidence: number | null;
  additional_notes: string | null;
  raw_output: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  email_id: string | null;
  user_id?: string;
}

// Input types for forms
export interface SupplierInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  notes?: string;
}

export interface InventoryInput {
  item_name: string;
  current_stock: number;
  unit: string;
  daily_usage_rate?: number;
  minimum_stock_level?: number;
  notes?: string;
}

export interface OrderInput {
  supplier_id: string;
  order_number?: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  expected_delivery_date: string;
  status: "pending" | "shipped" | "delivered" | "delayed" | "cancelled";
  notes?: string;
}

// Extended types with relationships
export interface OrderWithSupplier extends Order {
  supplier?: Supplier;
}

export interface RiskAnalysisWithDetails extends RiskAnalysis {
  extracted_data?: ExtractedData;
  order?: OrderWithSupplier;
}

export interface EmailWithExtractedData extends Email {
  extracted_data?: ExtractedData[];
  supplier?: Supplier;
}

// Dashboard Statistics
export interface DashboardStats {
  total_suppliers: number;
  total_orders: number;
  pending_orders: number;
  high_risk_alerts: number;
  medium_risk_alerts: number;
  low_stock_items: number;
}
