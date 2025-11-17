-- AI Supply Guardian Database Schema
-- This schema defines all tables needed for the MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SUPPLIERS TABLE
-- Store all supplier information
-- =====================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    contact_person VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_suppliers_email ON suppliers(email);

-- =====================================================
-- 2. INVENTORY TABLE
-- Track current stock levels for materials/products
-- =====================================================
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL, -- e.g., "kg", "units", "liters"
    daily_usage_rate DECIMAL(10, 2) DEFAULT 0,
    minimum_stock_level DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_inventory_user_id ON inventory(user_id);
CREATE INDEX idx_inventory_item_name ON inventory(item_name);

-- =====================================================
-- 3. ORDERS TABLE
-- Track orders placed with suppliers
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
    order_number VARCHAR(100), -- PO Number (optional)
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    expected_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, shipped, delivered, delayed, cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_expected_delivery ON orders(expected_delivery_date);

-- =====================================================
-- 4. EMAILS TABLE
-- Store incoming supplier emails
-- =====================================================
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    subject TEXT,
    body_text TEXT NOT NULL,
    body_html TEXT,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emails_supplier_id ON emails(supplier_id);
CREATE INDEX idx_emails_sender_email ON emails(sender_email);
CREATE INDEX idx_emails_processed ON emails(processed);

-- =====================================================
-- 5. EXTRACTED_DATA TABLE
-- Store results from Prompt 1 (Email Data Extraction)
-- =====================================================
CREATE TABLE extracted_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    issue_type VARCHAR(100), -- Delay, Price Change, Quantity Change, Cancellation, General Update, Unknown
    delay_days INTEGER,
    new_delivery_date DATE,
    old_delivery_date DATE,
    quantity_change DECIMAL(10, 2),
    price_change DECIMAL(10, 2),
    cancellation_flag BOOLEAN DEFAULT FALSE,
    additional_notes TEXT,
    extraction_confidence DECIMAL(3, 2), -- 0.00 to 1.00
    raw_json JSONB, -- Store complete JSON output from AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_extracted_data_email_id ON extracted_data(email_id);
CREATE INDEX idx_extracted_data_user_id ON extracted_data(user_id);
CREATE INDEX idx_extracted_data_issue_type ON extracted_data(issue_type);

-- =====================================================
-- 6. RISK_ANALYSIS TABLE
-- Store results from Prompt 2 (Risk Evaluation)
-- =====================================================
CREATE TABLE risk_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    extracted_data_id UUID REFERENCES extracted_data(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- Low, Medium, High
    reason TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    stock_coverage_days INTEGER, -- How many days of stock available
    financial_impact DECIMAL(10, 2), -- Estimated cost impact
    human_reviewed BOOLEAN DEFAULT FALSE,
    human_modified BOOLEAN DEFAULT FALSE,
    original_risk_level VARCHAR(20), -- Store original AI decision if modified
    raw_json JSONB, -- Store complete JSON output from AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_risk_analysis_extracted_data_id ON risk_analysis(extracted_data_id);
CREATE INDEX idx_risk_analysis_order_id ON risk_analysis(order_id);
CREATE INDEX idx_risk_analysis_user_id ON risk_analysis(user_id);
CREATE INDEX idx_risk_analysis_risk_level ON risk_analysis(risk_level);
CREATE INDEX idx_risk_analysis_human_reviewed ON risk_analysis(human_reviewed);

-- =====================================================
-- 7. AUDIT_LOG TABLE
-- Track all human interventions and modifications
-- =====================================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    risk_analysis_id UUID REFERENCES risk_analysis(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- modified_risk_level, modified_recommendation, added_note, approved, rejected
    field_changed VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_risk_analysis_id ON audit_log(risk_analysis_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure users can only access their own data
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- SUPPLIERS Policies
CREATE POLICY "Users can view their own suppliers"
    ON suppliers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers"
    ON suppliers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers"
    ON suppliers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers"
    ON suppliers FOR DELETE
    USING (auth.uid() = user_id);

-- INVENTORY Policies
CREATE POLICY "Users can view their own inventory"
    ON inventory FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory"
    ON inventory FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
    ON inventory FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
    ON inventory FOR DELETE
    USING (auth.uid() = user_id);

-- ORDERS Policies
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
    ON orders FOR DELETE
    USING (auth.uid() = user_id);

-- EMAILS Policies
CREATE POLICY "Users can view their own emails"
    ON emails FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails"
    ON emails FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails"
    ON emails FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emails"
    ON emails FOR DELETE
    USING (auth.uid() = user_id);

-- EXTRACTED_DATA Policies
CREATE POLICY "Users can view their own extracted data"
    ON extracted_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own extracted data"
    ON extracted_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own extracted data"
    ON extracted_data FOR UPDATE
    USING (auth.uid() = user_id);

-- RISK_ANALYSIS Policies
CREATE POLICY "Users can view their own risk analysis"
    ON risk_analysis FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own risk analysis"
    ON risk_analysis FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own risk analysis"
    ON risk_analysis FOR UPDATE
    USING (auth.uid() = user_id);

-- AUDIT_LOG Policies
CREATE POLICY "Users can view their own audit logs"
    ON audit_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit logs"
    ON audit_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- Automatically update updated_at timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. GOOGLE OAUTH TOKENS TABLE
-- Store Google OAuth tokens for Gmail/Calendar integration
-- =====================================================
CREATE TABLE google_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE, -- Google user ID
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth user
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    picture TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    scopes TEXT[], -- Array of OAuth scopes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_google_oauth_user_id ON google_oauth_tokens(user_id);
CREATE INDEX idx_google_oauth_email ON google_oauth_tokens(email);
CREATE INDEX idx_google_oauth_auth_user_id ON google_oauth_tokens(auth_user_id);

-- Trigger for updated_at
CREATE TRIGGER update_google_oauth_tokens_updated_at BEFORE UPDATE ON google_oauth_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- REALTIME PUBLICATIONS
-- Enable real-time subscriptions for all tables
-- =====================================================

-- Drop existing publication if exists
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create publication for real-time updates
CREATE PUBLICATION supabase_realtime FOR TABLE 
    suppliers,
    inventory,
    orders,
    emails,
    extracted_data,
    risk_analysis,
    audit_log,
    google_oauth_tokens;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Note: Uncomment the following to insert sample data for testing
-- You'll need to replace 'YOUR_USER_ID' with an actual user ID from auth.users

/*
INSERT INTO suppliers (user_id, name, email, contact_person) VALUES
    ('YOUR_USER_ID', 'TechComponents Ltd', 'contact@techcomponents.com', 'John Smith'),
    ('YOUR_USER_ID', 'GlobalParts Inc', 'sales@globalparts.com', 'Jane Doe');

INSERT INTO inventory (user_id, item_name, current_stock, unit, daily_usage_rate) VALUES
    ('YOUR_USER_ID', 'Electronic Components A', 500, 'units', 50),
    ('YOUR_USER_ID', 'Steel Parts B', 1000, 'kg', 100);
*/
