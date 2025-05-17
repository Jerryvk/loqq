-- Add current_amount column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_amount DECIMAL(10,2) DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.current_amount IS 'The current payment amount set by the merchant'; 