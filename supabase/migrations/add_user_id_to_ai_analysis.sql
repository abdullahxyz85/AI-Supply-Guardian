-- Add user_id column to ai_analysis_results table for multi-tenant support
-- This ensures each user only sees their own AI analysis results

-- Add user_id column if it doesn't exist
ALTER TABLE ai_analysis_results 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_user_id 
ON ai_analysis_results(user_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own AI analysis results
CREATE POLICY "Users can view own AI analysis results"
ON ai_analysis_results
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own AI analysis results
CREATE POLICY "Users can insert own AI analysis results"
ON ai_analysis_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own AI analysis results
CREATE POLICY "Users can update own AI analysis results"
ON ai_analysis_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own AI analysis results
CREATE POLICY "Users can delete own AI analysis results"
ON ai_analysis_results
FOR DELETE
USING (auth.uid() = user_id);

-- Comment explaining the purpose
COMMENT ON COLUMN ai_analysis_results.user_id IS 'User ID for multi-tenant support - each user only sees their own AI analysis results';
