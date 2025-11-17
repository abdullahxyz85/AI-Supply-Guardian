-- Create ai_analysis_results table for storing AI-extracted email analysis
CREATE TABLE IF NOT EXISTS ai_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    issue_type VARCHAR(100),
    order_id VARCHAR(50),
    item_name VARCHAR(255),
    quantity INTEGER,
    old_delivery_date DATE,
    new_delivery_date DATE,
    delay_days INTEGER,
    cancellation_flag BOOLEAN DEFAULT false,
    price_change DECIMAL(10, 2),
    tracking_number VARCHAR(100),
    risk_level VARCHAR(50),
    reason TEXT,
    recommendation TEXT,
    confidence DECIMAL(3, 2),
    additional_notes TEXT,
    raw_output JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_email_id ON ai_analysis_results(email_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_order_id ON ai_analysis_results(order_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_risk_level ON ai_analysis_results(risk_level);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_issue_type ON ai_analysis_results(issue_type);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_created_at ON ai_analysis_results(created_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_analysis_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ai_analysis_results_updated_at
    BEFORE UPDATE ON ai_analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_analysis_results_updated_at();

-- Enable Row Level Security
ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow authenticated users to view and manage)
CREATE POLICY "Authenticated users can view AI analysis results"
    ON ai_analysis_results FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert AI analysis results"
    ON ai_analysis_results FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update AI analysis results"
    ON ai_analysis_results FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete AI analysis results"
    ON ai_analysis_results FOR DELETE
    TO authenticated
    USING (true);
