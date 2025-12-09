-- Add columns to track generation performance
ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS model_used TEXT DEFAULT 'gemini-1.5-flash',
ADD COLUMN IF NOT EXISTS generation_time_ms INTEGER DEFAULT 0;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_generations_model_used ON generations(model_used);
CREATE INDEX IF NOT EXISTS idx_generations_generation_time ON generations(generation_time_ms);

-- Update existing records to reflect the new model
UPDATE generations 
SET model_used = 'gemini-1.5-flash' 
WHERE model_used = 'gpt-4o-mini' OR model_used IS NULL;